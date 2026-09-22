import React, { useContext, useEffect, useState } from "react";
import { FaClipboardCheck } from "react-icons/fa";
import { LJKAContext } from "../../context/LJKAContext";

const emptyForm = {
  dateOfDeath: "",
  causeOfDeath: "",
  placeOfDeath: "",
  nomineeMobile: "",
  contactMobile: "",
  address: "",
};

const RaiseClaim = () => {
  const { backendUrl, token } = useContext(LJKAContext);
  const [form, setForm] = useState(emptyForm);
  const [claims, setClaims] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const load = () => {
    fetch(`${backendUrl}/api/user/claims`, { headers })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => setClaims(data.claims || []))
      .catch(() => setMessage("Unable to load your previous claims."));
  };

  useEffect(() => {
    load();
  }, [backendUrl, token]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!confirmed) {
      setMessage("Please confirm the claim details before submitting.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`${backendUrl}/api/user/claims`, {
        method: "POST",
        headers,
        body: JSON.stringify({ ...form, confirmed: true }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setForm(emptyForm);
      setConfirmed(false);
      setMessage(data.message);
      load();
    } catch (error) {
      setMessage(error.message || "Unable to submit claim.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--ljka-bg)]">
      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <div className="rounded-3xl border border-[var(--ljka-border-light)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">
          <div className="flex gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--ljka-primary-bg)] text-2xl text-[var(--ljka-primary)]">
              <FaClipboardCheck />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--ljka-gold-dark)]">Raise Claim</p>
              <h1 className="mt-1 text-2xl font-bold text-[var(--ljka-primary)]">Submit a death assistance claim</h1>
              <p className="mt-2 text-sm text-[var(--ljka-muted)]">If a member has passed away, provide the required details. Superadmin will review the claim before any assistance is processed.</p>
            </div>
          </div>

          <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Date of death<input required type="date" value={form.dateOfDeath} onChange={(event) => set("dateOfDeath", event.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label>
            <label className="text-sm font-semibold">Cause of death<input value={form.causeOfDeath} onChange={(event) => set("causeOfDeath", event.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label>
            <label className="text-sm font-semibold">Place of death<input value={form.placeOfDeath} onChange={(event) => set("placeOfDeath", event.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label>
            <label className="text-sm font-semibold">Nominee mobile<input inputMode="numeric" maxLength={10} value={form.nomineeMobile} onChange={(event) => set("nomineeMobile", event.target.value.replace(/\D/g, "").slice(0, 10))} className="mt-2 w-full rounded-lg border p-3" /></label>
            <label className="text-sm font-semibold">Your contact mobile<input inputMode="numeric" maxLength={10} value={form.contactMobile} onChange={(event) => set("contactMobile", event.target.value.replace(/\D/g, "").slice(0, 10))} className="mt-2 w-full rounded-lg border p-3" /></label>
            <label className="text-sm font-semibold sm:col-span-2">Current address<textarea value={form.address} onChange={(event) => set("address", event.target.value)} className="mt-2 min-h-20 w-full rounded-lg border p-3" /></label>
            <label className="flex items-start gap-3 rounded-xl border border-[var(--ljka-border-light)] bg-[var(--ljka-primary-bg)] p-4 text-sm font-medium sm:col-span-2"><input required type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1" />I confirm that I am submitting this claim from the affected member’s own LJKA account and that the information is correct.</label>
            <button disabled={saving || !confirmed} className="rounded-lg bg-[var(--ljka-primary)] px-5 py-3 text-sm font-bold text-white sm:col-span-2 disabled:opacity-60">{saving ? "Submitting…" : "Submit claim"}</button>
          </form>

          {message && <p className="mt-5 rounded-xl bg-[var(--ljka-bg)] p-4 text-sm">{message}</p>}

          <h2 className="mt-10 text-lg font-bold text-[var(--ljka-primary)]">Your submitted claims</h2>
          <div className="mt-4 grid gap-3">
            {claims.map((claim) => (
              <article key={claim._id} className="rounded-2xl border border-[var(--ljka-border-light)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-[var(--ljka-gold-dark)]">{claim.claimId}</p>
                    <p className="mt-1 text-sm text-[var(--ljka-muted)]">Submitted {new Date(claim.createdAt).toLocaleString("en-IN")}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase">{claim.status.replace("_", " ")}</span>
                </div>
                {claim.adminNotes && <p className="mt-3 text-sm text-[var(--ljka-muted)]">Admin note: {claim.adminNotes}</p>}
              </article>
            ))}
            {!claims.length && <p className="text-sm text-[var(--ljka-muted)]">No claims submitted yet.</p>}
          </div>
        </div>
      </section>
    </main>
  );
};

export default RaiseClaim;
