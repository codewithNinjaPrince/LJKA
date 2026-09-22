import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminApi } from "../services/adminApi.js";

const emptyForm = { code: "", label: "", email: "", phone: "", isActive: true };

const Badge = ({ value }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${value === "active" || value === true || value === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>
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

  const load = useCallback(async () => {
    try {
      const response = await adminApi(token).get("/referrals", { params: { search } });
      setReferrals(response.data.referrals || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load referral codes");
    }
  }, [token, search]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const loadUsers = useCallback(async (id, query = "") => {
    try {
      const response = await adminApi(token).get(`/referrals/${id}/users`, { params: { search: query } });
      setSelected(response.data.referral);
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load referred members");
    }
  }, [token]);

  useEffect(() => {
    if (!selected?._id) return;
    const timer = setTimeout(() => loadUsers(selected._id, userSearch), 250);
    return () => clearTimeout(timer);
  }, [selected?._id, userSearch, loadUsers]);

  const save = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await adminApi(token).patch(`/referrals/${editingId}`, form);
        toast.success("Referral code updated");
      } else {
        await adminApi(token).post("/referrals", form);
        toast.success("Referral code created");
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save referral code");
    } finally {
      setIsSaving(false);
    }
  };

  const edit = (referral) => {
    setEditingId(referral._id);
    setForm({ code: referral.code || "", label: referral.label || "", email: referral.email || "", phone: referral.phone || "", isActive: referral.isActive });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this referral code? Existing member records will be preserved.")) return;
    try {
      await adminApi(token).delete(`/referrals/${id}`);
      toast.success("Referral code deleted");
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      if (selected?._id === id) {
        setSelected(null);
        setUsers([]);
      }
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete referral code");
    }
  };

  return <>
    <div className="mb-7">
      <h2 className="text-2xl font-bold text-[#5a0615]">Referral Codes</h2>
      <p className="mt-1 text-sm text-slate-500">Create codes and see which members registered with each code.</p>
    </div>
    <form onSubmit={save} className="mb-6 grid max-w-3xl gap-3 rounded-xl border bg-white p-5 sm:grid-cols-2">
      <input required maxLength={32} className="min-w-0 rounded-lg border p-2.5 font-mono uppercase" placeholder="Referral code, e.g. LJKA2026" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") })} />
      <input required type="email" className="min-w-0 rounded-lg border p-2.5" placeholder="Referral contact email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
      <input required inputMode="numeric" maxLength={10} className="min-w-0 rounded-lg border p-2.5" placeholder="Referral contact phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value.replace(/\D/g, "").slice(0, 10) })} />
      <input className="min-w-0 rounded-lg border p-2.5" placeholder="Optional label / description" value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} />
      <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />Active and usable</label>
      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <button disabled={isSaving} className="rounded-lg bg-[#78081c] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Saving…" : editingId ? "Save changes" : "Create referral code"}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-lg border px-4 py-2.5 text-sm font-semibold">Cancel</button>}
      </div>
    </form>

    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search referral code, label, email or phone" className="mb-4 w-full max-w-xl rounded-lg border bg-white p-3" />

    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {["Code", "Label", "Linked contact", "Members", "Status", "Created", "Actions"].map((label) => <th key={label} className="p-4 font-medium">{label}</th>)}
          </tr>
        </thead>
        <tbody>
          {referrals.map((referral) => (
            <tr key={referral._id} className="border-t">
              <td className="p-4 font-mono font-bold">{referral.code}</td>
              <td className="p-4">{referral.label || "—"}</td>
              <td className="p-4 text-slate-600"><span className="block break-all">{referral.email || "Legacy referral"}</span><span>{referral.phone || "—"}</span></td>
              <td className="p-4 font-semibold">{referral.userCount || 0}</td>
              <td className="p-4"><Badge value={referral.isActive ? "active" : "disabled"} /></td>
              <td className="p-4 text-slate-500">{new Date(referral.createdAt).toLocaleDateString("en-IN")}</td>
              <td className="p-4">
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => { setUserSearch(""); loadUsers(referral._id); }} className="font-semibold text-[#78081c]">View members</button>
                  <button onClick={() => edit(referral)} className="font-semibold text-slate-700">Edit</button>
                  <button onClick={() => remove(referral._id)} className="font-semibold text-rose-700">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!referrals.length && <p className="p-6 text-slate-500">No referral codes yet.</p>}
    </div>

    {selected && (
      <section className="mt-6 rounded-xl border bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#5a0615]">Members with code {selected.code}</h3>
            <p className="mt-1 text-sm text-slate-500">{users.length} matching member{users.length === 1 ? "" : "s"}</p>
          </div>
          <button type="button" onClick={() => { setSelected(null); setUsers([]); }} className="rounded-lg border px-3 py-1.5 text-sm font-semibold">Close</button>
        </div>
        <input value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Search member name, ID, email or mobile" className="mt-4 w-full max-w-xl rounded-lg border p-3" />
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr>{["Member", "Member ID", "Mobile", "KYC", "Registered"].map((label) => <th key={label} className="p-3 font-medium">{label}</th>)}</tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-3"><b>{user.fullName}</b><br /><span className="text-slate-500">{user.email}</span></td>
                  <td className="p-3">{user.memberId || "—"}</td>
                  <td className="p-3">{user.mobile || "—"}</td>
                  <td className="p-3"><Badge value={user.kycCompleted ? "completed" : "pending"} /></td>
                  <td className="p-3 text-slate-500">{new Date(user.createdAt).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users.length && <p className="p-4 text-sm text-slate-500">No members registered with this code.</p>}
        </div>
      </section>
    )}
  </>;
}
