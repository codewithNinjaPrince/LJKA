import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { adminApi } from "../services/adminApi.js";
import { LoadingButton, StatusBadge } from "./sahyog/SahyogUi.jsx";

const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function VyawasthaPayments({ token, canApprove, canReject }) {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [changingId, setChangingId] = useState("");
  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");
  const [selectedProof, setSelectedProof] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi(token).get("/vyawastha-payments");
      setPayments(response.data.payments || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load Vyawastha payments");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const visiblePayments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payments.filter((payment) => {
      if (status && payment.paymentStatus !== status) return false;
      if (!query) return true;
      return [
        payment.userId?.fullName,
        payment.userId?.memberId,
        payment.userId?.email,
        payment.userId?.mobile,
        payment.payerName,
        payment.utrNumber,
      ].some((value) => String(value || "").toLowerCase().includes(query));
    });
  }, [payments, search, status]);

  const review = async (payment, action) => {
    const isReject = action === "reject";
    let reason = "";
    if (isReject) {
      reason = window.prompt("Reason for rejecting this payment (optional):", "") ?? "";
      if (!window.confirm(`Reject the payment from ${payment.userId?.fullName || payment.payerName}?`)) return;
    } else if (!window.confirm(`Accept and activate membership for ${payment.userId?.fullName || payment.payerName}?`)) {
      return;
    }

    setChangingId(payment._id);
    try {
      await adminApi(token).patch(`/vyawastha-payments/${payment._id}/${action}`, isReject ? { reason } : {});
      toast.success(isReject ? "Payment rejected" : "Payment accepted and membership activated");
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || `Could not ${action} payment`);
    } finally {
      setChangingId("");
    }
  };

  return <>
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-[#5a0615]">Vyawastha payment verification</h2>
        <p className="mt-1 text-sm text-slate-500">Accept verified payments to activate a member’s annual membership, or reject an invalid submission.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search member, UTR or mobile" className="rounded-lg border bg-white px-3 py-2.5 text-sm" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border bg-white px-3 py-2.5 text-sm">
          <option value="pending">Pending</option><option value="verified">Accepted</option><option value="rejected">Rejected</option><option value="">All statuses</option>
        </select>
      </div>
    </div>

    {isLoading ? <div className="rounded-xl border bg-white p-10 text-center text-slate-500">Loading payment submissions…</div> : <>
      <p className="mb-4 text-sm text-slate-500">{visiblePayments.length} payment{visiblePayments.length === 1 ? "" : "s"} shown</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visiblePayments.map((payment) => <article key={payment._id} className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-[#5a0615]">{payment.userId?.fullName || payment.payerName}</h3><p className="mt-1 text-sm text-slate-500">{payment.userId?.memberId || "Member ID unavailable"}</p></div><StatusBadge value={payment.paymentStatus} /></div>
          {payment.paymentProof?.previewUrl ? (
            <section className="mt-5 border-y py-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Uploaded payment proof</p>
              {payment.paymentProof.resourceType === "image" ? (
                <button type="button" onClick={() => setSelectedProof(payment.paymentProof)} className="block w-full overflow-hidden rounded-lg border bg-slate-50 text-left transition hover:border-[#78081c] focus:outline-none focus:ring-2 focus:ring-[#78081c]">
                  <img src={payment.paymentProof.previewUrl} alt={`Payment proof uploaded by ${payment.userId?.fullName || payment.payerName}`} className="h-44 w-full object-contain" />
                  <span className="block border-t bg-white px-3 py-2 text-center text-sm font-semibold text-[#78081c]">Click image for enhanced view</span>
                </button>
              ) : (
                <button type="button" onClick={() => setSelectedProof(payment.paymentProof)} className="flex w-full items-center justify-between rounded-lg border bg-slate-50 px-4 py-4 text-left transition hover:border-[#78081c] focus:outline-none focus:ring-2 focus:ring-[#78081c]">
                  <span><span className="block font-semibold text-slate-800">PDF payment proof</span><span className="mt-1 block text-xs text-slate-500">{payment.paymentProof.originalFilename || "Uploaded receipt"}</span></span>
                  <span className="text-sm font-bold text-[#78081c]">Open PDF</span>
                </button>
              )}
            </section>
          ) : <p className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">No payment proof is available for this legacy payment.</p>}
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm"><div><dt className="text-slate-500">Amount</dt><dd className="mt-0.5 font-bold text-slate-800">{money(payment.amount)}</dd></div><div><dt className="text-slate-500">Submitted</dt><dd className="mt-0.5">{new Date(payment.createdAt).toLocaleDateString("en-IN")}</dd></div><div className="col-span-2"><dt className="text-slate-500">Payer / UTR</dt><dd className="mt-0.5 break-all font-medium">{payment.payerName} · {payment.utrNumber}</dd></div><div className="col-span-2"><dt className="text-slate-500">Member contact</dt><dd className="mt-0.5">{payment.userId?.mobile || "—"}{payment.userId?.email ? ` · ${payment.userId.email}` : ""}</dd></div>{payment.paymentStatus === "verified" && <div className="col-span-2"><dt className="text-slate-500">Membership valid until</dt><dd className="mt-0.5">{payment.membershipExpiresAt ? new Date(payment.membershipExpiresAt).toLocaleDateString("en-IN") : "—"}</dd></div>}{payment.paymentStatus === "rejected" && payment.rejectionReason && <div className="col-span-2"><dt className="text-slate-500">Rejection reason</dt><dd className="mt-0.5 text-rose-700">{payment.rejectionReason}</dd></div>}</dl>
          {payment.paymentStatus === "pending" && <div className="mt-5 flex flex-wrap gap-3 border-t pt-4">{canApprove && <LoadingButton loading={changingId === payment._id} onClick={() => review(payment, "verify")} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Accept payment</LoadingButton>}{canReject && <LoadingButton loading={changingId === payment._id} onClick={() => review(payment, "reject")} className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">Reject</LoadingButton>}</div>}
        </article>)}
      </div>
      {!visiblePayments.length && <div className="rounded-xl border border-dashed bg-white p-10 text-center text-slate-500">No payments match these filters.</div>}
    </>}
    {selectedProof && <div role="dialog" aria-modal="true" aria-label="Payment proof preview" className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/70 p-4" onClick={() => setSelectedProof(null)}>
      <div className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-xl bg-white p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between gap-4"><div><h3 className="font-bold text-[#5a0615]">Uploaded payment proof</h3><p className="text-sm text-slate-500">{selectedProof.originalFilename || "Payment receipt"}</p></div><button type="button" onClick={() => setSelectedProof(null)} className="rounded-lg border px-3 py-2 text-sm font-semibold">Close</button></div>
        {selectedProof.resourceType === "image" ? <img src={selectedProof.previewUrl} alt="Enlarged payment proof" className="max-h-[75vh] w-full object-contain" /> : <iframe title="Payment proof PDF" src={selectedProof.previewUrl} className="h-[75vh] w-full rounded border" />}
        <a href={selectedProof.previewUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-[#78081c] underline">Open in new tab</a>
      </div>
    </div>}
  </>;
}
