import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { adminApi } from "../../services/adminApi.js";
import { LoadingButton, PageHeading, StatusBadge } from "./SahyogUi.jsx";

const can = (admin, action) => admin.role === "superadmin" || admin.permissions?.some((item) => item.module === "sahyog-donations" && item.actions.includes(action));

export default function SahyogDonations({ token, admin, root }) {
  const { id } = useParams(); const navigate = useNavigate();
  const [donations, setDonations] = useState([]); const [isLoading, setIsLoading] = useState(true); const [changingId, setChangingId] = useState(null);
  const load = useCallback(async () => { setIsLoading(true); try { const response = await adminApi(token).get(`/sahyog/${id}/donations`); setDonations(response.data.donations); } catch (error) { toast.error(error.response?.data?.message || "Could not load donations"); } finally { setIsLoading(false); } }, [id, token]);
  useEffect(() => { load(); }, [load]);
  const changeStatus = async (donationId, action) => {
    const isReject = action === "reject";
    if (isReject && !window.confirm("Reject this donation? If it was verified earlier, its amount will be removed from the Sahyog total.")) return;
    setChangingId(donationId);
    try { await adminApi(token).patch(`/sahyog/${id}/donations/${donationId}/${action}`); toast.success(isReject ? "Donation rejected and removed from totals" : "Donation verified"); load(); }
    catch (error) { toast.error(error.response?.data?.message || `Could not ${action} donation`); }
    finally { setChangingId(null); }
  };
  return <><PageHeading title="Sahyog donations" subtitle="Only verified (success) donations are included in case totals." action={<button onClick={() => navigate(`${root}/sahyog/${id}`)} className="rounded-lg border px-4 py-2 text-sm font-semibold">Back to case</button>} />{isLoading ? <p className="py-12 text-center text-slate-500">Loading donations…</p> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{donations.map((donation) => <article key={donation._id} className="rounded-xl border bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><h3 className="font-bold text-[#5a0615]">{String(donation.donorId?.fullName || donation.donorName || "—").toUpperCase()}</h3><StatusBadge value={donation.paymentStatus} /></div><p className="mt-4 text-xl font-bold">₹{donation.amount}</p><p className="mt-2 text-sm text-slate-500">{donation.paymentMethod || "—"} · {donation.transactionId || "No transaction ID"}</p><p className="mt-2 text-xs text-slate-500">{new Date(donation.createdAt).toLocaleString("en-IN")}</p><div className="mt-4 flex flex-wrap gap-3">{can(admin, "verify") && donation.paymentStatus !== "success" && <LoadingButton loading={changingId === donation._id} onClick={() => changeStatus(donation._id, "verify")} className="font-semibold text-[#78081c]">Verify donation</LoadingButton>}{can(admin, "reject") && donation.paymentStatus !== "rejected" && <LoadingButton loading={changingId === donation._id} onClick={() => changeStatus(donation._id, "reject")} className="font-semibold text-rose-700">Reject donation</LoadingButton>}</div></article>)}</div>}{!isLoading && !donations.length && <p className="rounded-xl border bg-white p-8 text-center text-slate-500">No donations recorded.</p>}</>;
}
