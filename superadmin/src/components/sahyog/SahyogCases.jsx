import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { adminApi } from "../../services/adminApi.js";
import { formatDateOnly } from "../../utils/dates.js";
import { LoadingButton, PageHeading, StatusBadge } from "./SahyogUi.jsx";

const can = (admin, action) => admin.role === "superadmin" || admin.permissions?.some((item) => item.module === "sahyog" && item.actions.includes(action));

export default function SahyogCases({ token, admin, root }) {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadCases = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi(token).get("/sahyog", { params: { search, status } });
      setCases(response.data.cases);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load Sahyog cases");
    } finally {
      setIsLoading(false);
    }
  }, [search, status, token]);

  useEffect(() => {
    const timer = setTimeout(loadCases, 250);
    return () => clearTimeout(timer);
  }, [loadCases]);

  const disable = async (id) => {
    if (!window.confirm("Disable this Sahyog case? Donation history will be retained.")) return;
    setDeletingId(id);
    try {
      await adminApi(token).delete(`/sahyog/${id}`);
      toast.success("Sahyog case disabled");
      loadCases();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not disable Sahyog case");
    } finally {
      setDeletingId(null);
    }
  };

  return <>
    <PageHeading title="Sahyog Management" subtitle="Create and manage verified-member Sahyog cases." action={can(admin, "create") && <button onClick={() => navigate("new")} className="rounded-lg bg-[#78081c] px-4 py-2 text-sm font-bold text-white">Create Sahyog</button>} />
    <div className="mb-5 grid gap-3 sm:grid-cols-2"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search member or Sahyog ID" className="rounded-lg border bg-white p-3" /><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border bg-white p-3"><option value="">All statuses</option>{["draft", "pending", "active", "closed", "disabled"].map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
    {isLoading ? <p className="py-12 text-center text-slate-500">Loading Sahyog cases…</p> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cases.map((item) => <article key={item._id} className="rounded-xl border bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-[#5a0615]">{item.memberId?.fullName || "Member"}</h3><p className="mt-1 text-sm text-slate-500">{item.memberId?.memberId || item.sahyogId}</p></div><StatusBadge value={item.status} /></div><dl className="mt-5 space-y-2 text-sm"><div className="flex justify-between gap-3"><dt className="text-slate-500">Death date</dt><dd>{formatDateOnly(item.dateOfDeath)}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Minimum donation</dt><dd>{item.minimumDonationAmount ? `₹${item.minimumDonationAmount}` : "Not set"}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Verified donations</dt><dd>₹{item.donationSummary.amount} ({item.donationSummary.count})</dd></div></dl><div className="mt-5 flex flex-wrap gap-3 border-t pt-4"><button onClick={() => navigate(item._id)} className="font-semibold text-[#78081c]">View</button>{can(admin, "update") && <button onClick={() => navigate(`${item._id}/edit`)} className="font-semibold text-slate-700">Edit</button>}{can(admin, "delete") && <LoadingButton loading={deletingId === item._id} onClick={() => disable(item._id)} className="font-semibold text-rose-700">Disable</LoadingButton>}</div></article>)}</div>}
    {!isLoading && !cases.length && <p className="rounded-xl border bg-white p-8 text-center text-slate-500">No Sahyog cases found.</p>}
  </>;
}
