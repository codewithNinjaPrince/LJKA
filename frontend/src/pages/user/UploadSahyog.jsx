import React, { useCallback, useContext, useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaDownload, FaHandsHelping, FaShieldAlt, FaTimesCircle } from "react-icons/fa";
import { jsPDF } from "jspdf";
import { LJKAContext } from "../../context/LJKAContext";
import { toastError, toastSuccess } from "../../utils/toast";

const upper = (value) => String(value || "").toUpperCase();
const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const statusDetails = (status) => {
  if (status === "success") return { label: "Accepted", className: "bg-green-100 text-green-800", Icon: FaCheckCircle };
  if (status === "rejected") return { label: "Rejected", className: "bg-red-100 text-red-800", Icon: FaTimesCircle };
  return { label: "Awaiting verification", className: "bg-amber-100 text-amber-800", Icon: FaClock };
};

const loadReceiptLogo = async () => {
  const response = await fetch("/img/Lakhdatar_Logo.png", { cache: "no-cache" });
  if (!response.ok) throw new Error("LJKA logo could not be loaded");
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const downloadSahyogReceipt = async (payment) => {
  const document = new jsPDF({ unit: "mm", format: "a4" });
  const maroon = [126, 5, 30];
  const cream = [253, 248, 241];
  const gold = [214, 169, 63];
  const ink = [45, 43, 43];
  const muted = [105, 92, 92];
  try {
    const logoDataUrl = await loadReceiptLogo();
    document.setFillColor(...maroon);
    document.rect(0, 0, 210, 39, "F");
    document.setFillColor(255, 255, 255);
    document.roundedRect(13, 6, 27, 27, 2, 2, "F");
    document.addImage(logoDataUrl, "PNG", 15, 8, 23, 23, undefined, "FAST");
    document.setTextColor(255, 255, 255);
    document.setFont("helvetica", "bold");
    document.setFontSize(15);
    document.text("LAKHDATAR JEEVAN KALYAN", 47, 18);
    document.text("ASSOCIATION", 47, 24);
    document.setFont("helvetica", "normal");
    document.setFontSize(8.5);
    document.text("Sahyog Support Donation Receipt", 47, 30);

    document.setTextColor(...ink);
    document.setFont("helvetica", "bold");
    document.setFontSize(17);
    document.text("DONATION RECEIPT", 105, 52, { align: "center" });
    document.setDrawColor(...gold);
    document.setLineWidth(0.6);
    document.line(75, 55, 135, 55);

    const details = [
      ["Receipt reference", payment.donationId || "—"],
      ["Donation purpose", "Sahyog support"],
      ["Donation made to", upper(payment.lateMember?.fullName)],
      ["Late member ID", payment.lateMember?.memberId || "—"],
      ["Amount received", `INR ${Number(payment.amount || 0).toLocaleString("en-IN")}`],
      ["Payment method", String(payment.paymentMethod || "Manual payment").replaceAll("_", " ").toUpperCase()],
      ["Transaction / UTR reference", payment.transactionId || "—"],
      ["Submitted on", formatDate(payment.createdAt)],
      ["Verified on", formatDate(payment.verifiedAt)],
      ["Payment status", "ACCEPTED / VERIFIED"],
    ];

    let y = 64;
    details.forEach(([label, value], index) => {
      const valueLines = document.splitTextToSize(String(value), 100);
      const rowHeight = Math.max(12, valueLines.length * 4.8 + 5);
      document.setFillColor(...(index % 2 === 0 ? cream : [255, 255, 255]));
      document.roundedRect(14, y, 182, rowHeight, 1.5, 1.5, "F");
      document.setTextColor(...muted);
      document.setFont("helvetica", "bold");
      document.setFontSize(8.6);
      document.text(label, 20, y + 7);
      document.setTextColor(...ink);
      document.setFont("helvetica", "normal");
      document.text(valueLines, 91, y + 7);
      y += rowHeight + 2;
    });

    const noticeY = Math.min(Math.max(y + 8, 220), 245);
    document.setFillColor(28, 28, 28);
    document.roundedRect(36, noticeY, 138, 25, 3, 3, "F");
    document.setTextColor(255, 255, 255);
    document.setFont("helvetica", "normal");
    document.setFontSize(9.5);
    document.text(document.splitTextToSize("This donation has been verified by LJKA and will be used to provide Sahyog support to the late member's family.", 120), 105, noticeY + 9, { align: "center" });
    document.setDrawColor(...gold);
    document.setLineWidth(0.35);
    document.line(15, 278, 195, 278);
    document.setTextColor(100, 100, 100);
    document.setFontSize(8);
    document.text("This is a system-generated LJKA receipt. No signature is required.", 105, 285, { align: "center" });
    document.save(`LJKA-Sahyog-Receipt-${payment.donationId || "payment"}.pdf`);
  } catch (error) {
    toastError("Unable to generate the receipt. Please try again.");
  }
};

const Detail = ({ label, value }) => (
  <div>
    <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--ljka-muted)]">{label}</dt>
    <dd className="mt-1 break-words text-sm font-medium text-[var(--ljka-primary)]">{value || "—"}</dd>
  </div>
);

const UploadSahyog = () => {
  const { backendUrl, token } = useContext(LJKAContext);
  const [cases, setCases] = useState([]);
  const [selected, setSelected] = useState("");
  const [item, setItem] = useState(null);
  const [donations, setDonations] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [form, setForm] = useState({ amount: "", transactionId: "", paymentMethod: "bank_transfer" });
  const [paymentProof, setPaymentProof] = useState("");
  const [proofInputKey, setProofInputKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/user/donations?limit=100`, { headers });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load donation history.");
      setDonations(data.donations || []);
    } catch (error) {
      toastError(error.message || "Unable to load donation history.");
    } finally {
      setHistoryLoading(false);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    fetch(`${backendUrl}/api/user/sahyog?limit=100`, { headers })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load available Sahyog cases.")))
      .then((data) => {
        setCases(data.cases || []);
        if (data.cases?.length) setSelected(data.cases[0]._id);
      })
      .catch((error) => toastError(error.message || "Unable to load available Sahyog cases."))
      .finally(() => setLoading(false));
  }, [backendUrl, token]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  useEffect(() => {
    if (!selected) return;
    setItem(null);
    fetch(`${backendUrl}/api/user/sahyog/${selected}`, { headers })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load payment instructions.")))
      .then((data) => {
        setItem(data.sahyog);
        setForm((previous) => ({ ...previous, amount: data.sahyog.minimumDonationAmount ? String(data.sahyog.minimumDonationAmount) : "", transactionId: "" }));
        setPaymentProof("");
        setProofInputKey((value) => value + 1);
      })
      .catch((error) => toastError(error.message || "Unable to load payment instructions."));
  }, [backendUrl, selected, token]);

  const activeDonation = item && donations.find((donation) => donation.caseId === item.sahyogId && donation.paymentStatus !== "rejected");
  const valid = Boolean(selected && item && !activeDonation && Number(form.amount) >= (item.minimumDonationAmount || 1) && /^[A-Za-z0-9][A-Za-z0-9\-_/:.]{5,63}$/.test(form.transactionId.trim()));
  const handleProofChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return setPaymentProof("");
    if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 2 * 1024 * 1024) {
      event.target.value = "";
      setPaymentProof("");
      toastError("Choose a PNG, JPG, or WEBP payment proof smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPaymentProof(String(reader.result || ""));
    reader.onerror = () => toastError("The payment proof could not be read. Please try another image.");
    reader.readAsDataURL(file);
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch(`${backendUrl}/api/user/sahyog/${selected}/donations`, {
        method: "POST",
        headers,
        body: JSON.stringify({ ...form, paymentProof, transactionId: form.transactionId.trim(), amount: Number(form.amount) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to submit donation.");
      setForm({ amount: "", transactionId: "", paymentMethod: "bank_transfer" });
      setPaymentProof("");
      setProofInputKey((value) => value + 1);
      toastSuccess("Your donation has been submitted and is awaiting confirmation.");
      await loadHistory();
    } catch (error) {
      toastError(error.message || "Unable to submit donation.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <main className="grid min-h-screen place-items-center bg-[var(--ljka-bg)] text-[var(--ljka-primary)]">Loading Sahyog cases…</main>;

  return <main className="min-h-screen bg-[var(--ljka-bg)]"><section className="mx-auto max-w-4xl px-5 py-10 sm:px-8"><div className="rounded-3xl border border-[var(--ljka-border-light)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">
    <div className="flex gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--ljka-primary-bg)] text-2xl text-[var(--ljka-primary)]"><FaHandsHelping /></span><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--ljka-gold-dark)]">Sahyog donation</p><h1 className="mt-1 text-2xl font-bold text-[var(--ljka-primary)]">Submit a donation for verification</h1></div></div>
    {!cases.length ? <p className="mt-8 rounded-xl bg-[var(--ljka-bg)] p-5 text-center text-[var(--ljka-muted)]">No active Sahyog cases are currently available.</p> : <>
      <label className="mt-8 block text-sm font-semibold">Late member<select required value={selected} onChange={(event) => setSelected(event.target.value)} className="mt-2 w-full rounded-lg border p-3">{cases.map((caseItem) => <option key={caseItem._id} value={caseItem._id}>{upper(caseItem.member.fullName)} · {caseItem.member.memberId}</option>)}</select></label>
      {item && <div className="mt-6 grid gap-5 lg:grid-cols-2"><section className="rounded-2xl bg-[var(--ljka-primary-bg)] p-5"><h2 className="font-bold text-[var(--ljka-primary)]">Late member</h2><dl className="mt-3 grid gap-3"><Detail label="Member name" value={upper(item.member.fullName)} /><Detail label="Member ID" value={item.member.memberId} /><Detail label="Death reason" value={item.causeOfDeath} /><Detail label="Minimum donation" value={item.minimumDonationAmount ? `₹${item.minimumDonationAmount}` : "Not set"} /></dl></section><section className="rounded-2xl border p-5"><h2 className="font-bold text-[var(--ljka-primary)]">Payment details</h2><dl className="mt-3 grid gap-3 sm:grid-cols-2"><Detail label="A/c holder name" value={item.paymentDetails?.accountHolderName} /><Detail label="Bank name" value={item.paymentDetails?.bankName} /><Detail label="Account number" value={item.paymentDetails?.accountNumber} /><Detail label="IFSC code" value={item.paymentDetails?.ifsc} /><Detail label="Branch name" value={item.paymentDetails?.branchName} /><Detail label="Public UPI ID" value={item.publicPayment?.upiId} /></dl></section></div>}
      {activeDonation ? <div className={`mt-6 rounded-2xl border p-5 ${activeDonation.paymentStatus === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}><p className="font-bold">Donation already submitted</p><p className="mt-1 text-sm">Your previous donation for this late member is {statusDetails(activeDonation.paymentStatus).label.toLowerCase()}</p></div> : <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl border p-5 sm:grid-cols-2"><label className="text-sm font-semibold">Donation amount (₹)<input required min={item?.minimumDonationAmount || 1} type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="mt-2 w-full rounded-lg border p-3" /><span className="mt-1 block text-xs font-normal text-[var(--ljka-muted)]">The minimum amount is preset. You may increase it, but cannot decrease it.</span></label><label className="text-sm font-semibold">Payment method<select required value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })} className="mt-2 w-full rounded-lg border p-3"><option value="bank_transfer">Bank transfer</option><option value="upi">UPI</option></select></label><label className="text-sm font-semibold sm:col-span-2">Payment proof image (optional)<input key={proofInputKey} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleProofChange} className="mt-2 w-full rounded-lg border p-3" /><span className="mt-1 block text-xs font-normal text-[var(--ljka-muted)]">PNG, JPG, or WEBP only, up to 2 MB. {paymentProof ? "Image attached." : ""}</span></label><label className="text-sm font-semibold sm:col-span-2">Transaction / reference ID (Mandatory)<input required value={form.transactionId} onChange={(event) => setForm({ ...form, transactionId: event.target.value.toUpperCase() })} className="mt-2 w-full rounded-lg border p-3" /></label><button disabled={!valid || submitting} className="rounded-lg bg-[var(--ljka-primary)] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2">{submitting ? "Submitting…" : "Submit for verification"}</button></form>}
    </>}
    <section className="mt-8 overflow-hidden rounded-2xl border border-[var(--ljka-border-light)]"><div className="border-b bg-[var(--ljka-primary-bg)] px-5 py-4"><h2 className="font-bold text-[var(--ljka-primary)]">Your Sahyog payment history</h2></div>{historyLoading ? <p className="p-5 text-sm text-[var(--ljka-muted)]">Loading payment history…</p> : !donations.length ? <p className="p-5 text-sm text-[var(--ljka-muted)]">No Sahyog payments submitted yet.</p> : <div className="divide-y">{donations.map((payment) => { const status = statusDetails(payment.paymentStatus); return <article key={payment._id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-[var(--ljka-primary)]">To: {upper(payment.lateMember?.fullName)} <span className="text-sm font-normal text-[var(--ljka-muted)]">({payment.lateMember?.memberId || "—"})</span></p><p className="mt-1 text-sm">₹{Number(payment.amount || 0).toLocaleString("en-IN")} · {String(payment.paymentMethod || "manual payment").replaceAll("_", " ")}</p><p className="mt-1 text-xs text-[var(--ljka-muted)]">Reference: {payment.transactionId || "—"} · Submitted: {formatDate(payment.createdAt)}</p>{payment.paymentStatus === "success" && <p className="mt-1 text-xs text-green-700">Accepted: {formatDate(payment.verifiedAt)}</p>}</div><div className="flex shrink-0 items-center gap-3"><span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${status.className}`}><status.Icon />{status.label}</span>{payment.paymentStatus === "success" && <button type="button" onClick={() => downloadSahyogReceipt(payment)} className="inline-flex items-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-3 py-2 text-xs font-bold text-white"><FaDownload />Receipt</button>}</div></article>; })}</div>}</section>
    <p className="mt-5 flex gap-2 text-xs leading-5 text-[var(--ljka-muted)]"><FaShieldAlt className="shrink-0 text-[var(--ljka-primary)]" /> Payment details and verification are controlled by LJKA administration.</p>
  </div></section></main>;
};

export default UploadSahyog;
