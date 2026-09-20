import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { adminApi } from "../../services/adminApi.js";
import { LoadingButton } from "../sahyog/SahyogUi.jsx";

export default function MemberUpdateRequests({ token, canApprove, canReject }) {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi(token).get("/member-update-requests");
      setRequests(response.data.requests);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load member update requests");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const review = async (requestId, action) => {
    let payload;
    if (action === "reject") {
      const adminRemarks = window.prompt("Reason for rejecting this request (optional):");
      if (adminRemarks === null) return;
      payload = { adminRemarks };
    }

    setReviewingId(requestId);
    try {
      await adminApi(token).patch(`/member-update-requests/${requestId}/${action}`, payload);
      toast.success(`Member update request ${action}d`);
      loadRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || `Could not ${action} request`);
    } finally {
      setReviewingId(null);
    }
  };

  if (isLoading) return <p className="rounded-xl border bg-white p-8 text-center text-slate-500">Loading member update requests…</p>;

  return <><div className="mb-7"><h2 className="text-2xl font-bold text-[#5a0615]">Member Update Requests</h2><p className="mt-1 text-sm text-slate-500">Review pending profile changes submitted by members.</p></div><div className="grid gap-4 md:grid-cols-2">{requests.map((request) => <article key={request._id} className="rounded-xl border bg-white p-5 shadow-sm"><h3 className="font-bold text-[#5a0615]">{request.userId?.fullName || "Unknown member"}</h3><p className="mt-1 text-sm text-slate-500">{request.userId?.memberId || request.userId?.email || "—"}</p><ul className="mt-4 list-disc space-y-1 pl-5 text-sm">{Object.entries(request.requestedChanges || {}).map(([field, value]) => <li key={field}><b>{field}</b>: {typeof value === "object" ? "Updated" : String(value)}</li>)}</ul><p className="mt-4 text-xs text-slate-500">Submitted {new Date(request.submittedAt).toLocaleString()}</p><div className="mt-4 flex flex-wrap gap-3 border-t pt-4">{canApprove && <LoadingButton loading={reviewingId === request._id} onClick={() => review(request._id, "approve")} className="font-semibold text-emerald-700">Approve</LoadingButton>}{canReject && <LoadingButton loading={reviewingId === request._id} onClick={() => review(request._id, "reject")} className="font-semibold text-rose-700">Reject</LoadingButton>}</div></article>)}</div>{!requests.length && <p className="rounded-xl border bg-white p-8 text-center text-slate-500">No pending member update requests.</p>}</>;
}
