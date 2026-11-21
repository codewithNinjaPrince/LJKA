import React, { useContext, useEffect, useState } from "react";
import { FaClock, FaDownload, FaHandsHelping, FaShieldAlt } from "react-icons/fa";
import { LJKAContext } from "../../context/LJKAContext";
import { downloadSahyogReceipt } from "./UploadSahyog";
import { upper } from "../../utils/displayText";

const statusLabel = {
  pending: "Awaiting verification",
  success: "Verified",
  failed: "Failed",
  refunded: "Refunded",
};

const ViewAllSahyog = () => {
  const { backendUrl, token } = useContext(LJKAContext);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [supportSummary, setSupportSummary] = useState(null);

  useEffect(() => {
    fetch(`${backendUrl}/api/user/donations?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => { setDonations(data.donations || []); setSupportSummary(data.supportSummary || null); })
      .catch(() => setMessage("Unable to load your Sahyog contributions."))
      .finally(() => setLoading(false));
  }, [backendUrl, token]);

  if (loading) {
    return <main className="min-h-screen bg-[var(--ljka-bg)] grid place-items-center text-[var(--ljka-primary)]">Loading your contributions…</main>;
  }


  return (
    <main className="min-h-screen bg-[var(--ljka-bg)]">
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="rounded-3xl border border-[var(--ljka-border-light)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">
          <div className="flex gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--ljka-primary-bg)] text-2xl text-[var(--ljka-primary)]">
              <FaHandsHelping />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--ljka-gold-dark)]">My Sahyog</p>
              <h1 className="mt-1 text-2xl font-bold text-[var(--ljka-primary)]">Your contributions</h1>
              <p className="mt-2 text-sm text-[var(--ljka-muted)]">See who you supported, when you contributed, and whether the transaction has been verified.</p>
            </div>
          </div>

          {message && <p className="mt-6 rounded-xl bg-[var(--ljka-bg)] p-4 text-sm text-[var(--ljka-text)]">{message}</p>}

          {supportSummary?.supportedCases > 0 && <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Your Sahyog support</p><p className="mt-1 text-2xl font-bold text-emerald-900">₹{Number(supportSummary.verifiedAmount || 0).toLocaleString("en-IN")}</p></div><span className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-emerald-800">{supportSummary.donationPercentage || 0}%</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(100, supportSummary.donationPercentage || 0)}%` }} /></div><p className="mt-3 text-sm font-medium text-emerald-800">Supported {supportSummary.supportedCases} of {supportSummary.totalSahyogCases || 0} Sahyog members.</p></section>}

          {!donations.length && !message && (
            <p className="mt-8 rounded-xl bg-[var(--ljka-bg)] p-5 text-center text-[var(--ljka-muted)]">You have not submitted any Sahyog contributions yet.</p>
          )}

          <div className="mt-8 grid gap-4">
            {donations.map((donation) => (
              <article key={donation._id} className="rounded-2xl border border-[var(--ljka-border-light)] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--ljka-gold-dark)]">{donation.caseId || "Sahyog"}</p>
                    <h2 className="mt-1 text-lg font-bold text-[var(--ljka-primary)]">{upper(donation.lateMember?.fullName)}</h2>
                    <p className="text-sm text-[var(--ljka-muted)]">Member ID: {donation.lateMember?.memberId}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${donation.paymentStatus === "success" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {statusLabel[donation.paymentStatus] || donation.paymentStatus}
                  </span>
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-[var(--ljka-muted)]">Amount</dt>
                    <dd className="font-semibold">₹{Number(donation.amount || 0).toLocaleString("en-IN")}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--ljka-muted)]">Submitted</dt>
                    <dd className="font-semibold">{donation.createdAt ? new Date(donation.createdAt).toLocaleString("en-IN") : "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--ljka-muted)]">Verified at</dt>
                    <dd className="font-semibold">{donation.verifiedAt ? new Date(donation.verifiedAt).toLocaleString("en-IN") : "Not verified yet"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--ljka-muted)]">Method</dt>
                    <dd className="font-semibold">{donation.paymentMethod || "—"}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[var(--ljka-muted)]">Transaction ID</dt>
                    <dd className="font-semibold">{donation.transactionId || "—"}</dd>
                  </div>
                </dl>
                {donation.paymentStatus === "success" && (
                  <button
                    type="button"
                    onClick={() => downloadSahyogReceipt(donation)}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-4 py-2 text-sm font-bold text-white"
                  >
                    <FaDownload /> Download receipt
                  </button>
                )}
              </article>
            ))}
          </div>

          <p className="mt-6 flex gap-2 text-xs leading-5 text-[var(--ljka-muted)]">
            <FaShieldAlt className="shrink-0 text-[var(--ljka-primary)]" />
            Only verified contributions count toward a Sahyog case total.
            <FaClock className="ml-2 shrink-0 text-[var(--ljka-primary)]" />
          </p>
        </div>
      </section>
    </main>
  );
};

export default ViewAllSahyog;
