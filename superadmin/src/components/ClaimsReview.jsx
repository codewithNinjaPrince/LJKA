import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminApi } from "../services/adminApi.js";
import { formatDateOnly } from "../utils/dates.js";

const statuses = ["pending", "in_review", "approved", "rejected", "closed"];

export default function ClaimsReview({ token }) {
  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await adminApi(token).get("/claims", { params: { search, status } });
      setClaims(response.data.claims || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load claims");
    }
  }, [search, status, token]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const update = async (id, changes) => {
    try {
      const response = await adminApi(token).patch(`/claims/${id}`, changes);
      setClaims((items) => items.map((item) => item._id === id ? response.data.claim : item));
      setSelected((item) => item?._id === id ? response.data.claim : item);
      toast.success("Claim updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update claim");
    }
  };

  return <>
    <div className="mb-7">
      <h2 className="text-2xl font-bold text-[#5a0615]">Member Claims</h2>
      <p className="mt-1 text-sm text-slate-500">Review death-assistance claims submitted by members.</p>
    </div>
    <div className="mb-5 flex flex-wrap gap-3">
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search claim ID, late member or claimant" className="w-full max-w-xl rounded-lg border bg-white p-3" />
      <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border bg-white p-3">
        <option value="">All statuses</option>
        {statuses.map((value) => <option key={value} value={value}>{value.replace("_", " ")}</option>)}
      </select>
    </div>
    <div className="grid gap-4 xl:grid-cols-2">
      {claims.map((claim) => (
        <article key={claim._id} className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-[#5a0615]">{claim.deceasedFullName}</h3>
              <p className="mt-1 text-sm text-slate-500">{claim.deceasedMemberCode || "No member ID"} · {claim.claimId}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase text-slate-700">{claim.status.replace("_", " ")}</span>
          </div>
          <p className="mt-3 text-sm text-slate-600">Member: {claim.claimantId?.fullName || claim.deceasedFullName || "—"} ({claim.claimantId?.memberId || claim.deceasedMemberCode || "—"})</p>
          <p className="mt-1 text-sm text-slate-600">Date of death: {formatDateOnly(claim.dateOfDeath)}</p>
          <button onClick={() => { setSelected(claim); setAdminNotes(claim.adminNotes || ""); }} className="mt-4 font-semibold text-[#78081c]">Review</button>
        </article>
      ))}
    </div>
    {!claims.length && <p className="rounded-xl border bg-white p-8 text-center text-slate-500">No claims found.</p>}

    {selected && (
      <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
        <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#78081c]">{selected.claimId}</p>
              <h3 className="mt-1 text-xl font-bold text-slate-800">{selected.deceasedFullName}</h3>
            </div>
            <button onClick={() => setSelected(null)} className="rounded-lg border px-3 py-1.5 text-sm font-semibold">Close</button>
          </div>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-slate-500">Member</dt><dd className="font-semibold">{selected.claimantId?.fullName || selected.deceasedFullName}</dd></div>
            <div><dt className="text-slate-500">Member ID</dt><dd className="font-semibold">{selected.claimantId?.memberId || selected.deceasedMemberCode || "—"}</dd></div>
            <div><dt className="text-slate-500">Contact</dt><dd className="font-semibold">{selected.claimantId?.mobile || selected.contactMobile || selected.claimantId?.email || "—"}</dd></div>
            <div><dt className="text-slate-500">Date of death</dt><dd className="font-semibold">{formatDateOnly(selected.dateOfDeath)}</dd></div>
            <div><dt className="text-slate-500">Cause / place</dt><dd className="font-semibold">{selected.causeOfDeath || "—"}{selected.placeOfDeath ? ` · ${selected.placeOfDeath}` : ""}</dd></div>
            <div><dt className="text-slate-500">Nominee mobile</dt><dd className="font-semibold">{selected.nomineeMobile || "—"}</dd></div>
          </dl>
          {selected.address && <p className="mt-3 text-sm text-slate-600">Address: {selected.address}</p>}
          <label className="mt-6 block text-sm font-semibold">Status
            <select value={selected.status} onChange={(event) => update(selected._id, { status: event.target.value, adminNotes })} className="mt-2 w-full rounded-lg border p-3">
              {statuses.map((value) => <option key={value} value={value}>{value.replace("_", " ")}</option>)}
            </select>
          </label>
          <label className="mt-4 block text-sm font-semibold">Admin notes
            <textarea value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} className="mt-2 min-h-24 w-full rounded-lg border p-3" />
          </label>
          <button onClick={() => update(selected._id, { adminNotes })} className="mt-4 rounded-lg bg-[#78081c] px-4 py-2.5 text-sm font-semibold text-white">Save notes</button>
        </section>
      </div>
    )}
  </>;
}
