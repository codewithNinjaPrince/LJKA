
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import {
  Activity,
  ClipboardCheck,
  Code2,
  HandHeart,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import AdminManagement, { Rights } from "../components/AdminManagement.jsx";
import MemberUpdateRequests from "../components/member-update-requests/MemberUpdateRequests.jsx";
import SahyogCrudPortal from "./SahyogCrudPortal.jsx";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const actionLabels = {
  view: "View",
  create: "Create",
  update: "Update",
  delete: "Delete",
  approve: "Approve",
  reject: "Reject",
};

const moduleIcons = {
  members: Users,
  referrals: Code2,
  sahyog: HandHeart,
  "sahyog-donations": HandHeart,
  "member-update-requests": ClipboardCheck,
  "sahyog-alerts": Activity,
  contacts: Activity,
};

const api = (token) =>
  axios.create({
    baseURL: `${apiUrl}/api/admin`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const statusClass = (value) =>
  ({
    active: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    disabled: "bg-slate-200 text-slate-700",
    rejected: "bg-rose-100 text-rose-800",
  }[String(value).toLowerCase()] ||
  "bg-slate-100 text-slate-700");

function AdminShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("ljka_admin_token");

  const [me, setMe] = useState(null);
  const [open, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api(token).get("/auth/me");

      setMe(data);

      if (
        (location.pathname.startsWith("/superadmin") &&
          data.admin.role !== "superadmin") ||
        (location.pathname.startsWith("/admin") &&
          data.admin.role !== "admin")
      ) {
        navigate(
          data.admin.role === "superadmin"
            ? "/superadmin/dashboard"
            : "/admin/dashboard",
          { replace: true }
        );
      }
    } catch {
      localStorage.removeItem("ljka_admin_token");

      navigate(
        location.pathname.startsWith("/superadmin")
          ? "/superadmin/login"
          : "/admin/login",
        { replace: true }
      );
    }
  }, [token, navigate, location.pathname]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!token) {
    return (
      <Navigate
        to={
          location.pathname.startsWith("/superadmin")
            ? "/superadmin/login"
            : "/admin/login"
        }
        replace
      />
    );
  }

  if (!me) {
    return (
      <div className="min-h-screen grid place-items-center text-[#78081c]">
        Loading secure workspace…
      </div>
    );
  }

  const { admin, modules } = me;
  const isSuper = admin.role === "superadmin";

  const allowed = (key, action = "view") =>
    isSuper ||
    admin.permissions.some(
      (p) =>
        p.module === key &&
        p.actions.includes(action)
    );

  const root = isSuper ? "/superadmin" : "/admin";

  const links = [
    {
      to: `${root}/dashboard`,
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    ...(isSuper
      ? [
          {
            to: `${root}/admins`,
            label: "Admin Management",
            icon: ShieldCheck,
          },
          {
            to: `${root}/activity`,
            label: "Activity Logs",
            icon: Activity,
          },
        ]
      : []),

    ...modules
      .filter(
        (m) =>
          allowed(m.key) &&
          ["members", "referrals", "member-update-requests", "sahyog"].includes(m.key)
      )
      .map((m) => ({
        to: `${root}/${m.key}`,
        label: m.label,
        icon: moduleIcons[m.key] || Settings,
      })),
  ];

  const logout = () => {
    localStorage.removeItem("ljka_admin_token");
    navigate(`${root}/login`);
  };

  return (
    <div className="min-h-screen bg-[#fafaf5] text-slate-800">
      <aside
        className={`fixed z-30 inset-y-0 left-0 w-72 bg-[#5a0615] p-5 text-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute right-4 top-4 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <X />
        </button>

        <div className="mb-9">
          <p className="text-xs tracking-[.18em] text-[#e9ca80]">
            LJKA
          </p>

          <h1 className="text-xl font-bold">
            {isSuper ? "Super Admin" : "Admin Portal"}
          </h1>

          <p className="mt-2 text-sm text-white/65">
            {admin.fullName}
          </p>
        </div>

        <nav className="space-y-1">
          {links.map(
            ({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                onClick={() => setOpen(false)}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-white/15 text-[#f4d78d]"
                      : "text-white/75 hover:bg-white/10"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            )
          )}
        </nav>

        <button
          onClick={logout}
          className="absolute bottom-6 left-5 flex items-center gap-3 text-sm text-white/70 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white/90 px-5 backdrop-blur">
          <button
            className="lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${statusClass(
                admin.status
              )}`}
            >
              {admin.role}
            </span>

            <span className="hidden text-sm text-slate-500 sm:block">
              {admin.email}
            </span>
          </div>
        </header>

        <main className="p-5 sm:p-8">
          <Routes>
            <Route
              path="dashboard"
              element={
                <Dashboard
                  token={token}
                  isSuper={isSuper}
                />
              }
            />

            {isSuper && (
              <>
                <Route
                  path="admins"
                  element={<AdminManagement token={token} />}
                />

                <Route
                  path="admins/:id/rights"
                  element={<Rights token={token} />}
                />

                <Route
                  path="activity"
                  element={<ActivityLog token={token} />}
                />
              </>
            )}

            <Route
              path="members"
              element={
                allowed("members") ? (
                  <Members token={token} />
                ) : (
                  <Navigate
                    to="../dashboard"
                    replace
                  />
                )
              }
            />

            <Route
              path="referrals"
              element={
                allowed("referrals") ? (
                  <Referrals
                    token={token}
                    canCreate={allowed(
                      "referrals",
                      "create"
                    )}
                  />
                ) : (
                  <Navigate
                    to="../dashboard"
                    replace
                  />
                )
              }
            />

            <Route
              path="member-update-requests"
              element={
                allowed("member-update-requests") ? (
                  <MemberUpdateRequests
                    token={token}
                    canApprove={allowed("member-update-requests", "approve")}
                    canReject={allowed("member-update-requests", "reject")}
                  />
                ) : (
                  <Navigate to="../dashboard" replace />
                )
              }
            />

            <Route
              path="sahyog/*"
              element={
                allowed("sahyog") ? (
                  <SahyogCrudPortal token={token} admin={admin} />
                ) : (
                  <Navigate to="../dashboard" replace />
                )
              }
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

const PageTitle = ({
  title,
  subtitle,
  action,
}) => (
  <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h2 className="text-2xl font-bold text-[#5a0615]">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>
      )}
    </div>

    {action}
  </div>
);

function Dashboard({ token, isSuper }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api(token)
      .get("/dashboard")
      .then((r) => setData(r.data))
      .catch(() =>
        toast.error("Could not load dashboard")
      );
  }, [token]);

  if (!data) {
    return <div>Loading dashboard…</div>;
  }

  const cards = Object.entries(data.stats).map(
    ([key, value]) => ({
      key,
      value,
    })
  );

  return (
    <>
      <PageTitle
        title={
          isSuper
            ? "Super Admin Dashboard"
            : "Admin Dashboard"
        }
        subtitle="Live values from the LJKA database."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ key, value }) => (
          <div
            key={key}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <p className="text-sm capitalize text-slate-500">
              {key.replace(/([A-Z])/g, " $1")}
            </p>

            <p className="mt-2 text-3xl font-bold text-[#78081c]">
              {value}
            </p>
          </div>
        ))}
      </div>

      {isSuper && (
        <section className="mt-7 rounded-xl border bg-white">
          <div className="border-b p-5 font-semibold">
            Recent activity
          </div>

          {data.recentActivity.length ? (
            data.recentActivity.map((item) => (
              <div
                key={item._id}
                className="flex justify-between gap-4 border-b p-4 text-sm last:border-0"
              >
                <span>
                  <b>{item.actorName}</b>{" "}
                  {item.action.replaceAll("_", " ")} in{" "}
                  {item.module}
                </span>

                <time className="shrink-0 text-slate-500">
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </time>
              </div>
            ))
          ) : (
            <p className="p-5 text-sm text-slate-500">
              No activity yet.
            </p>
          )}
        </section>
      )}
    </>
  );
}

function Members({ token }) {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  const load = useCallback(
    () =>
      api(token)
        .get("/members", {
          params: { search },
        })
        .then((r) =>
          setMembers(r.data.members)
        )
        .catch((e) =>
          toast.error(
            e.response?.data?.message ||
              "Could not load members"
          )
        ),
    [token, search]
  );

  useEffect(() => {
    const timer = setTimeout(load, 250);

    return () => clearTimeout(timer);
  }, [load]);

  return (
    <>
      <PageTitle
        title="Members"
        subtitle="Existing LJKA member records. Sensitive Aadhaar data is never returned."
        action={
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        }
      />

      <input
        className="mb-4 w-full max-w-md rounded-lg border bg-white p-3"
        placeholder="Search name, email, member ID or mobile"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {[
                "Member",
                "Member ID",
                "Mobile",
                "KYC",
                "Registered",
              ].map((x) => (
                <th
                  key={x}
                  className="p-4 font-medium"
                >
                  {x}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {members.map((m) => (
              <tr
                key={m._id}
                className="border-t"
              >
                <td className="p-4">
                  <b>{m.fullName}</b>
                  <br />
                  <span className="text-slate-500">
                    {m.email}
                  </span>
                </td>

                <td className="p-4">
                  {m.memberId || "—"}
                </td>

                <td className="p-4">
                  {m.mobile || "—"}
                </td>

                <td className="p-4">
                  <Badge
                    value={
                      m.kycCompleted
                        ? "completed"
                        : "pending"
                    }
                  />
                </td>

                <td className="p-4 text-slate-500">
                  {new Date(
                    m.createdAt
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!members.length && (
          <p className="p-6 text-slate-500">
            No matching members.
          </p>
        )}
      </div>
    </>
  );
}

function Referrals({ token }) {
  const [referrals, setReferrals] = useState([]);
  const [label, setLabel] = useState("");

  const load = useCallback(
    () =>
      api(token)
        .get("/referrals")
        .then((r) =>
          setReferrals(r.data.referrals)
        )
        .catch((e) =>
          toast.error(
            e.response?.data?.message ||
              "Could not load referral codes"
          )
        ),
    [token]
  );

  useEffect(() => {
    load();
  }, [load]);

  const create = async (e) => {
    e.preventDefault();

    try {
      await api(token).post("/referrals", {
        label,
      });

      setLabel("");

      toast.success(
        "Referral code generated"
      );

      load();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Could not create code"
      );
    }
  };

  return (
    <>
      <PageTitle
        title="Referral Codes"
        subtitle="Collision-resistant codes stored separately from member KYC references."
      />

      <form
        onSubmit={create}
        className="mb-5 flex max-w-lg gap-2"
      >
        <input
          className="min-w-0 flex-1 rounded-lg border bg-white p-2.5"
          placeholder="Optional label"
          value={label}
          onChange={(e) =>
            setLabel(e.target.value)
          }
        />

        <button className="rounded-lg bg-[#78081c] px-4 text-sm font-semibold text-white">
          Generate code
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4 font-medium">
                Code
              </th>
              <th className="p-4 font-medium">
                Label
              </th>
              <th className="p-4 font-medium">
                Status
              </th>
              <th className="p-4 font-medium">
                Created
              </th>
            </tr>
          </thead>

          <tbody>
            {referrals.map((r) => (
              <tr
                key={r._id}
                className="border-t"
              >
                <td className="p-4 font-mono font-bold">
                  {r.code}
                </td>

                <td className="p-4">
                  {r.label || "—"}
                </td>

                <td className="p-4">
                  <Badge
                    value={
                      r.isActive
                        ? "active"
                        : "disabled"
                    }
                  />
                </td>

                <td className="p-4 text-slate-500">
                  {new Date(
                    r.createdAt
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!referrals.length && (
          <p className="p-6 text-slate-500">
            No referral codes yet.
          </p>
        )}
      </div>
    </>
  );
}

function SahyogManagement({
  token,
  canCreate,
  canUpdate,
  canDelete,
}) {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [members, setMembers] = useState([]);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    memberId: "",
    dateOfDeath: "",
    description: "",
    familyInfo: "",
    targetAmount: "",
    status: "draft",
    publicPayment: {
      upiId: "",
      instructions: "",
    },
  });

  const load = useCallback(
    () =>
      api(token)
        .get("/sahyog", {
          params: {
            search,
            status,
          },
        })
        .then((r) =>
          setCases(r.data.cases)
        )
        .catch((e) =>
          toast.error(
            e.response?.data?.message ||
              "Could not load Sahyog cases"
          )
        ),
    [token, search, status]
  );

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = async () => {
    try {
      const { data } = await api(token).get(
        "/members",
        {
          params: { search: "" },
        }
      );

      setMembers(data.members);
      setShow(true);
    } catch {
      toast.error("Could not load members");
    }
  };

  const create = async (event) => {
    event.preventDefault();

    try {
      await api(token).post(
        "/sahyog",
        form
      );

      toast.success(
        "Sahyog case created and member preserved as deceased"
      );

      setShow(false);
      load();
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Could not create case"
      );
    }
  };

  const setCaseStatus = async (
    id,
    next
  ) => {
    try {
      await api(token).patch(
        `/sahyog/${id}`,
        {
          status: next,
        }
      );

      toast.success("Case updated");
      load();
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Could not update case"
      );
    }
  };

  const disable = async (id) => {
    if (
      !window.confirm(
        "Disable this Sahyog case? Donation records remain preserved."
      )
    ) {
      return;
    }

    try {
      await api(token).delete(
        `/sahyog/${id}`
      );

      toast.success("Case disabled");
      load();
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Could not disable case"
      );
    }
  };

  return (
    <>
      <PageTitle
        title="Sahyog Management"
        subtitle="Linked support cases, with verified donation totals."
        action={
          canCreate && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-[#78081c] px-4 py-2 text-sm font-semibold text-white"
            >
              <Plus size={16} />
              Create Sahyog
            </button>
          )
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          className="rounded-lg border bg-white p-2.5"
          placeholder="Name, member ID or Sahyog ID"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          className="rounded-lg border bg-white p-2.5"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="">
            All statuses
          </option>

          {[
            "draft",
            "pending",
            "active",
            "closed",
            "disabled",
          ].map((x) => (
            <option key={x}>
              {x}
            </option>
          ))}
        </select>
      </div>

      {show && (
        <Modal
          title="Create Sahyog case"
          close={() => setShow(false)}
        >
          <form
            onSubmit={create}
            className="grid gap-3 sm:grid-cols-2"
          >
            <label className="text-sm font-medium sm:col-span-2">
              Existing deceased member

              <select
                required
                className="mt-1 w-full rounded-lg border p-2"
                value={form.memberId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    memberId:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select a member
                </option>

                {members.map((m) => (
                  <option
                    key={m._id}
                    value={m._id}
                  >
                    {m.fullName} ·{" "}
                    {m.memberId ||
                      m.email}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium">
              Date of death

              <input
                required
                type="date"
                className="mt-1 w-full rounded-lg border p-2"
                value={form.dateOfDeath}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dateOfDeath:
                      e.target.value,
                  })
                }
              />
            </label>

            <label className="text-sm font-medium">
              Status

              <select
                className="mt-1 w-full rounded-lg border p-2"
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status:
                      e.target.value,
                  })
                }
              >
                {[
                  "draft",
                  "pending",
                  "active",
                ].map((x) => (
                  <option key={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium sm:col-span-2">
              Description

              <textarea
                required
                className="mt-1 w-full rounded-lg border p-2"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
              />
            </label>

            <label className="text-sm font-medium sm:col-span-2">
              Family / beneficiary information

              <textarea
                className="mt-1 w-full rounded-lg border p-2"
                value={form.familyInfo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    familyInfo:
                      e.target.value,
                  })
                }
              />
            </label>

            <label className="text-sm font-medium">
              Target amount (optional)

              <input
                min="0"
                type="number"
                className="mt-1 w-full rounded-lg border p-2"
                value={form.targetAmount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    targetAmount:
                      e.target.value,
                  })
                }
              />
            </label>

            <label className="text-sm font-medium">
              Public UPI (optional)

              <input
                className="mt-1 w-full rounded-lg border p-2"
                value={
                  form.publicPayment
                    .upiId
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    publicPayment: {
                      ...form.publicPayment,
                      upiId:
                        e.target.value,
                    },
                  })
                }
              />
            </label>

            <div className="sm:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setShow(false)
                }
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button className="rounded-lg bg-[#78081c] px-4 py-2 text-white">
                Create case
              </button>
            </div>
          </form>
        </Modal>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {[
                "Member",
                "Status",
                "Target / received",
                "Created",
                "Actions",
              ].map((x) => (
                <th
                  key={x}
                  className="p-4 font-medium"
                >
                  {x}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {cases.map((item) => (
              <tr
                key={item._id}
                className="border-t"
              >
                <td className="p-4">
                  <b>
                    {item.memberId?.fullName}
                  </b>
                  <br />

                  <span className="text-slate-500">
                    {item.memberId?.memberId ||
                      item.sahyogId}
                  </span>
                </td>

                <td className="p-4">
                  <Badge
                    value={item.status}
                  />
                </td>

                <td className="p-4">
                  {item.targetAmount
                    ? `₹${item.targetAmount.toLocaleString()} / `
                    : ""}

                  <b>
                    ₹{item.donationSummary.amount.toLocaleString()}
                  </b>

                  <br />

                  <span className="text-slate-500">
                    {item.donationSummary.count}{" "}
                    verified
                  </span>
                </td>

                <td className="p-4 text-slate-500">
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="p-4 whitespace-nowrap">
                  <button
                    onClick={() =>
                      navigate(
                        `${item._id}/donations`
                      )
                    }
                    className="mr-3 font-semibold text-[#78081c]"
                  >
                    View Donations
                  </button>

                  {canUpdate &&
                    item.status !==
                      "active" && (
                      <button
                        onClick={() =>
                          setCaseStatus(
                            item._id,
                            "active"
                          )
                        }
                        className="mr-3 font-semibold text-slate-600"
                      >
                        Activate
                      </button>
                    )}

                  {canDelete && (
                    <button
                      onClick={() =>
                        disable(item._id)
                      }
                      className="font-semibold text-rose-700"
                    >
                      Disable
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!cases.length && (
          <p className="p-6 text-slate-500">
            No Sahyog cases found.
          </p>
        )}
      </div>
    </>
  );
}

function Donations({
  token,
  canUpdate,
}) {
  const id = useLocation()
    .pathname.split("/")
    .at(-2);

  const [donations, setDonations] =
    useState([]);

  const load = useCallback(
    () =>
      api(token)
        .get(
          `/sahyog/${id}/donations`
        )
        .then((r) =>
          setDonations(
            r.data.donations
          )
        )
        .catch((e) =>
          toast.error(
            e.response?.data?.message ||
              "Could not load donations"
          )
        ),
    [token, id]
  );

  useEffect(() => {
    load();
  }, [load]);

  const mark = async (
    donationId,
    paymentStatus
  ) => {
    try {
      await api(token).patch(
        `/sahyog/${id}/donations/${donationId}`,
        {
          paymentStatus,
        }
      );

      toast.success(
        "Donation updated"
      );

      load();
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Could not update donation"
      );
    }
  };

  return (
    <>
      <PageTitle
        title="Sahyog Donations"
        subtitle="Only verified successful payments count toward a case total."
      />

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {[
                "Donor",
                "Amount",
                "Status",
                "Transaction",
                "Method",
                "Date",
                "Actions",
              ].map((x) => (
                <th
                  key={x}
                  className="p-4 font-medium"
                >
                  {x}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {donations.map((d) => (
              <tr
                key={d._id}
                className="border-t"
              >
                <td className="p-4">
                  {d.isAnonymous
                    ? "Anonymous"
                    : d.donorName || "—"}
                </td>

                <td className="p-4 font-semibold">
                  ₹{d.amount.toLocaleString()}
                </td>

                <td className="p-4">
                  <Badge
                    value={
                      d.paymentStatus
                    }
                  />
                </td>

                <td className="p-4 font-mono text-xs">
                  {d.transactionId || "—"}
                </td>

                <td className="p-4">
                  {d.paymentMethod || "—"}
                </td>

                <td className="p-4 text-slate-500">
                  {new Date(
                    d.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">
                  {canUpdate &&
                    d.paymentStatus ===
                      "pending" && (
                      <button
                        onClick={() =>
                          mark(
                            d._id,
                            "success"
                          )
                        }
                        className="font-semibold text-[#78081c]"
                      >
                        Verify success
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!donations.length && (
          <p className="p-6 text-slate-500">
            No donations recorded.
          </p>
        )}
      </div>
    </>
  );
}

function ActivityLog({ token }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api(token)
      .get("/activity")
      .then((r) => setLogs(r.data.logs));
  }, [token]);

  return (
    <>
      <PageTitle
        title="Activity Logs"
        subtitle="Security-sensitive changes and administrative events."
      />

      <div className="rounded-xl border bg-white">
        {logs.map((log) => (
          <div
            key={log._id}
            className="flex flex-wrap justify-between gap-2 border-b p-4 text-sm last:border-0"
          >
            <span>
              <b>{log.actorName}</b>{" "}
              {log.action.replaceAll(
                "_",
                " "
              )}{" "}
              · {log.module}
            </span>

            <span className="text-slate-500">
              {new Date(
                log.createdAt
              ).toLocaleString()}
            </span>
          </div>
        ))}

        {!logs.length && (
          <p className="p-6 text-slate-500">
            No administrative activity recorded.
          </p>
        )}
      </div>
    </>
  );
}

function Badge({ value }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${statusClass(
        value
      )}`}
    >
      {value}
    </span>
  );
}

function Modal({
  title,
  close,
  children,
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#5a0615]">
            {title}
          </h3>

          <button onClick={close}>
            <X />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export { AdminShell };
