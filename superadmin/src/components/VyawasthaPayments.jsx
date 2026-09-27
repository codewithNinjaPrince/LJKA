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
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm"><div><dt className="text-slate-500">Amount</dt><dd className="mt-0.5 font-bold text-slate-800">{money(payment.amount)}</dd></div><div><dt className="text-slate-500">Submitted</dt><dd className="mt-0.5">{new Date(payment.createdAt).toLocaleDateString("en-IN")}</dd></div><div className="col-span-2"><dt className="text-slate-500">Payer / UTR</dt><dd className="mt-0.5 break-all font-medium">{payment.payerName} · {payment.utrNumber}</dd></div><div className="col-span-2"><dt className="text-slate-500">Member contact</dt><dd className="mt-0.5">{payment.userId?.mobile || "—"}{payment.userId?.email ? ` · ${payment.userId.email}` : ""}</dd></div>{payment.paymentStatus === "verified" && <div className="col-span-2"><dt className="text-slate-500">Membership valid until</dt><dd className="mt-0.5">{payment.membershipExpiresAt ? new Date(payment.membershipExpiresAt).toLocaleDateString("en-IN") : "—"}</dd></div>}{payment.paymentStatus === "rejected" && payment.rejectionReason && <div className="col-span-2"><dt className="text-slate-500">Rejection reason</dt><dd className="mt-0.5 text-rose-700">{payment.rejectionReason}</dd></div>}</dl>
          {payment.paymentStatus === "pending" && <div className="mt-5 flex flex-wrap gap-3 border-t pt-4">{canApprove && <LoadingButton loading={changingId === payment._id} onClick={() => review(payment, "verify")} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Accept payment</LoadingButton>}{canReject && <LoadingButton loading={changingId === payment._id} onClick={() => review(payment, "reject")} className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">Reject</LoadingButton>}</div>}
        </article>)}
      </div>
      {!visiblePayments.length && <div className="rounded-xl border border-dashed bg-white p-10 text-center text-slate-500">No payments match these filters.</div>}
    </>}
  </>;
}
