import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminApi } from "../services/adminApi.js";

const emptyForm = {
  code: "",
  label: "",
  email: "",
  phone: "",
  isActive: true,
};

// -----------------------------
// Helpers
// -----------------------------

const upper = (value) => String(value || "").toUpperCase();

const lower = (value) => String(value || "").toLowerCase();

const isValidIndianPhone = (phone) => {
  return /^[6-9]\d{9}$/.test(String(phone || ""));
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
};

// -----------------------------
// Status Badge
// -----------------------------

const Badge = ({ value }) => (
  <span
    className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
      value === "active" ||
      value === true ||
      value === "completed"
        ? "bg-emerald-100 text-emerald-800"
        : "bg-slate-200 text-slate-700"
    }`}
  >
    {String(value)}
  </span>
);

export default function ReferralCodes({ token }) {
  const [referrals, setReferrals] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");

  // -----------------------------
  // Load Referral Codes
  // -----------------------------

  const load = useCallback(async () => {
    try {
      const response = await adminApi(token).get("/referrals", {
        params: {
          search: upper(search),
        },
      });

      setReferrals(response.data.referrals || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not load referral codes"
      );
    }
  }, [token, search]);

  useEffect(() => {
    const timer = setTimeout(load, 250);

    return () => clearTimeout(timer);
  }, [load]);

  // -----------------------------
  // Load Members
  // -----------------------------

  const loadUsers = useCallback(
    async (id, query = "") => {
      try {
        const response = await adminApi(token).get(
          `/referrals/${id}/users`,
          {
            params: {
              search: query,
            },
          }
        );

        setSelected(response.data.referral);
        setUsers(response.data.users || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Could not load referred members"
        );
      }
    },
    [token]
  );

  useEffect(() => {
    if (!selected?._id) return;

    const timer = setTimeout(() => {
      loadUsers(selected._id, userSearch);
    }, 250);

    return () => clearTimeout(timer);
  }, [selected?._id, userSearch, loadUsers]);

  // -----------------------------
  // Form Change
  // -----------------------------

  const handleChange = (field, value) => {
    let newValue = value;

    // Referral code -> ALWAYS UPPERCASE
    if (field === "code") {
      newValue = upper(value)
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 32);
    }

    // Label / Name -> ALWAYS UPPERCASE
    if (field === "label") {
      newValue = upper(value);
    }

    // Email -> ALWAYS LOWERCASE
    if (field === "email") {
      newValue = lower(value).trim();
    }

    // Phone -> ONLY DIGITS, max 10
    if (field === "phone") {
      newValue = String(value)
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    setForm((previous) => ({
      ...previous,
      [field]: newValue,
    }));
  };

  // -----------------------------
  // Save
  // -----------------------------

  const save = async (event) => {
    event.preventDefault();

    const code = upper(form.code).trim();
    const label = upper(form.label).trim();
    const email = lower(form.email).trim();
    const phone = String(form.phone || "").trim();

    // Referral code validation
    if (!code) {
      toast.error("Referral code is required");
      return;
    }

    // Email validation
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Indian mobile validation
    if (!phone) {
      toast.error("Contact number is required");
      return;
    }

    if (!isValidIndianPhone(phone)) {
      toast.error(
        "Please enter a valid Indian mobile number starting with 6, 7, 8 or 9"
      );
      return;
    }

    // Final payload
    // This guarantees backend receives normalized data
    const payload = {
      code,
      label,
      email,
      phone,
      isActive: Boolean(form.isActive),
    };

    setIsSaving(true);

    try {
      if (editingId) {
        await adminApi(token).patch(
          `/referrals/${editingId}`,
          payload
        );

        toast.success("Referral code updated");
      } else {
        await adminApi(token).post(
          "/referrals",
          payload
        );

        toast.success("Referral code created");
      }

      setForm({ ...emptyForm });
      setEditingId(null);

      await load();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not save referral code"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // -----------------------------
  // Edit
  // -----------------------------

  const edit = (referral) => {
    setEditingId(referral._id);

    setForm({
      code: upper(referral.code),
      label: upper(referral.label),
      email: lower(referral.email),
      phone: referral.phone || "",
      isActive: Boolean(referral.isActive),
    });

    // IMPORTANT:
    // No navigation is performed.
    // The same ReferralCodes UI remains rendered.
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // -----------------------------
  // Delete
  // -----------------------------

  const remove = async (id) => {
    if (
      !window.confirm(
        "Delete this referral code? Existing member records will be preserved."
      )
    ) {
      return;
    }

    try {
      await adminApi(token).delete(`/referrals/${id}`);

      toast.success("Referral code deleted");

      if (editingId === id) {
        setEditingId(null);
        setForm({ ...emptyForm });
      }

      if (selected?._id === id) {
        setSelected(null);
        setUsers([]);
      }

      await load();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not delete referral code"
      );
    }
  };

  // -----------------------------
  // View Members
  // -----------------------------

  const viewMembers = async (referral) => {
    setUserSearch("");

    // Stay on the same page.
    // Only update local state.
    await loadUsers(referral._id);

    // Scroll to the members section without changing route.
    setTimeout(() => {
      document
        .getElementById("referral-members-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  return (
    <>
      {/* PAGE HEADER */}

      <div className="mb-7">
        <h2 className="text-2xl font-bold text-[#5a0615]">
          REFERRAL CODES
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create codes and see which members registered with each code.
        </p>
      </div>

      {/* FORM */}

      <form
        onSubmit={save}
        className="mb-6 grid max-w-3xl gap-3 rounded-xl border bg-white p-5 sm:grid-cols-2"
      >
        {/* REFERRAL CODE */}

        <input
          required
          maxLength={32}
          className="min-w-0 rounded-lg border p-2.5 font-mono uppercase"
          placeholder="REFERRAL CODE, E.G. LJKA2026"
          value={form.code}
          onChange={(event) =>
            handleChange("code", event.target.value)
          }
        />

        {/* EMAIL */}

        <input
          required
          type="email"
          inputMode="email"
          className="min-w-0 rounded-lg border p-2.5"
          placeholder="Referral Contact Email "
          value={form.email}
          onChange={(event) =>
            handleChange("email", event.target.value)
          }
        />

        {/* PHONE */}

        <input
          required
          type="tel"
          inputMode="numeric"
          maxLength={10}
          minLength={10}
          className="min-w-0 rounded-lg border p-2.5"
          placeholder="Mobile Number"
          value={form.phone}
          onChange={(event) =>
            handleChange("phone", event.target.value)
          }
        />

        {/* LABEL / NAME */}

        <input
          className="min-w-0 rounded-lg border p-2.5 uppercase"
          placeholder="OPTIONAL LABEL / NAME"
          value={form.label}
          onChange={(event) =>
            handleChange("label", event.target.value)
          }
        />

        {/* ACTIVE */}

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                isActive: event.target.checked,
              }))
            }
          />

          Active and Usable
        </label>

        {/* BUTTONS */}

        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-[#78081c] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSaving
              ? "SAVING…"
              : editingId
              ? "SAVE CHANGES"
              : "Create Referral Code"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ ...emptyForm });
              }}
              className="rounded-lg border px-4 py-2.5 text-sm font-semibold"
            >
              CANCEL
            </button>
          )}
        </div>
      </form>

      {/* SEARCH */}

      <input
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        placeholder="Search Referral code, label, email or phone"
        className="mb-4 w-full max-w-xl rounded-lg border bg-white p-3"
      />

      {/* REFERRAL TABLE */}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {[
                "CODE",
                "LABEL / NAME",
                "LINKED CONTACT",
                "MEMBERS",
                "STATUS",
                "CREATED",
                "ACTIONS",
              ].map((label) => (
                <th
                  key={label}
                  className="p-4 font-medium"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {referrals.map((referral) => (
              <tr
                key={referral._id}
                className="border-t"
              >
                <td className="p-4 font-mono font-bold uppercase">
                  {upper(referral.code)}
                </td>

                <td className="p-4 uppercase">
                  {upper(referral.label) || "—"}
                </td>

                <td className="p-4 text-slate-600">
                  <span className="block break-all lowercase">
                    {lower(referral.email) ||
                      "LEGACY REFERRAL"}
                  </span>

                  <span>
                    {referral.phone || "—"}
                  </span>
                </td>

                <td className="p-4 font-semibold">
                  {referral.userCount || 0}
                </td>

                <td className="p-4">
                  <Badge
                    value={
                      referral.isActive
                        ? "active"
                        : "disabled"
                    }
                  />
                </td>

                <td className="p-4 text-slate-500">
                  {referral.createdAt
                    ? new Date(
                        referral.createdAt
                      ).toLocaleDateString("en-IN")
                    : "Legacy"}
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        viewMembers(referral)
                      }
                      className="font-semibold text-[#78081c]"
                    >
                      View Members
                    </button>

                    {!referral.legacy && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            edit(referral)
                          }
                          className="font-semibold text-slate-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            remove(referral._id)
                          }
                          className="font-semibold text-rose-700"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!referrals.length && (
          <p className="p-6 text-slate-500">
            NO REFERRAL CODES YET.
          </p>
        )}
      </div>

      {/* MEMBERS SECTION */}

      {selected && (
        <section
          id="referral-members-section"
          className="mt-6 rounded-xl border bg-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#5a0615]">
                MEMBERS WITH CODE{" "}
                {upper(selected.code)}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {users.length} matching member
                {users.length === 1 ? "" : "s"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setUsers([]);
              }}
              className="rounded-lg border px-3 py-1.5 text-sm font-semibold"
            >
              CLOSE
            </button>
          </div>

          <input
            value={userSearch}
            onChange={(event) =>
              setUserSearch(event.target.value)
            }
            placeholder="SEARCH MEMBER NAME, ID, EMAIL OR MOBILE"
            className="mt-4 w-full max-w-xl rounded-lg border p-3"
          />

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {[
                    "MEMBER",
                    "MEMBER ID",
                    "MOBILE",
                    "KYC",
                    "REGISTERED",
                  ].map((label) => (
                    <th
                      key={label}
                      className="p-3 font-medium"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t"
                  >
                    <td className="p-3">
                      <b className="uppercase">
                        {upper(user.fullName)}
                      </b>

                      <br />

                      <span className="text-slate-500 lowercase">
                        {lower(user.email)}
                      </span>
                    </td>

                    <td className="p-3">
                      {user.memberId || "—"}
                    </td>

                    <td className="p-3">
                      {user.mobile || "—"}
                    </td>

                    <td className="p-3">
                      <Badge
                        value={
                          user.kycCompleted
                            ? "completed"
                            : "pending"
                        }
                      />
                    </td>

                    <td className="p-3 text-slate-500">
                      {new Date(
                        user.createdAt
                      ).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!users.length && (
              <p className="p-4 text-sm text-slate-500">
                NO MEMBERS REGISTERED WITH THIS CODE.
              </p>
            )}
          </div>
        </section>
      )}
    </>
  );
}