import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminApi } from "../../services/adminApi.js";
import { LoadingButton, PageHeading, StatusBadge } from "./SahyogUi.jsx";

const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;
const can = (admin, action) => admin.role === "superadmin" || admin.permissions?.some((item) => item.module === "sahyog" && item.actions.includes(action));
const canViewDonations = (admin) => admin.role === "superadmin" || admin.permissions?.some((item) => item.module === "sahyog-donations" && item.actions.includes("view"));

export default function SahyogCases({ token, admin }) {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]); const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(""); const [status, setStatus] = useState(""); const [changingId, setChangingId] = useState("");
  const load = useCallback(async () => { setIsLoading(true); try { const response = await adminApi(token).get("/sahyog", { params: { search, status } }); setCases(response.data.cases || []); } catch (error) { toast.error(error.response?.data?.message || "Could not load Sahyog cases"); } finally { setIsLoading(false); } }, [search, status, token]);
  useEffect(() => { load(); }, [load]);
  const disable = async (item) => { if (!window.confirm(`Disable the Sahyog case for ${item.memberId?.fullName || "this member"}? Donations are preserved.`)) return; setChangingId(item._id); try { await adminApi(token).delete(`/sahyog/${item._id}`); toast.success("Sahyog case disabled"); await load(); } catch (error) { toast.error(error.response?.data?.message || "Could not disable Sahyog case"); } finally { setChangingId(""); } };

  return <>
    <PageHeading title="Sahyog cases" subtitle="Member support cases and verified donation totals." action={can(admin, "create") && <button onClick={() => navigate("new")} className="rounded-lg bg-[#78081c] px-4 py-2 text-sm font-semibold text-white">Create case</button>} />
    <div className="mb-5 flex flex-col gap-3 sm:flex-row"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search member or Sahyog ID" className="rounded-lg border bg-white px-3 py-2.5 text-sm" /><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border bg-white px-3 py-2.5 text-sm"><option value="">All statuses</option><option value="active">Active</option><option value="draft">Draft</option><option value="pending">Pending</option><option value="closed">Closed</option></select></div>
    {isLoading ? <p className="py-12 text-center text-slate-500">Loading Sahyog cases…</p> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cases.map((item) => <article key={item._id} className="rounded-xl border bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-[#5a0615]">{item.memberId?.fullName || "Member"}</h3><p className="mt-1 text-sm text-slate-500">{item.memberId?.memberId || item.sahyogId}</p></div><StatusBadge value={item.status} /></div><div className="mt-5 rounded-lg bg-emerald-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Total donation</p><p className="mt-1 text-2xl font-bold text-emerald-900">{money(item.donationSummary?.amount)}</p><p className="mt-1 text-sm text-emerald-800">{item.donationSummary?.count || 0} verified donor{item.donationSummary?.count === 1 ? "" : "s"}</p></div><p className="mt-4 text-sm text-slate-600">Target: {item.targetAmount ? money(item.targetAmount) : "Not set"}</p><div className="mt-5 flex flex-wrap gap-3 border-t pt-4">{canViewDonations(admin) && <button onClick={() => navigate(`${item._id}/donations`)} className="font-semibold text-[#78081c]">View donors</button>}<button onClick={() => navigate(`${item._id}`)} className="font-semibold text-slate-700">View details</button>{can(admin, "update") && <button onClick={() => navigate(`${item._id}/edit`)} className="font-semibold text-slate-700">Edit</button>}{can(admin, "delete") && <LoadingButton loading={changingId === item._id} onClick={() => disable(item)} className="font-semibold text-rose-700">Disable</LoadingButton>}</div></article>)}</div>}
    {!isLoading && !cases.length && <p className="rounded-xl border bg-white p-8 text-center text-slate-500">No Sahyog cases found.</p>}
  </>;
}
