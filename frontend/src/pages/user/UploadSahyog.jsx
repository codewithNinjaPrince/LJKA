import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaClock, FaDownload, FaHandsHelping, FaShieldAlt, FaTimesCircle } from "react-icons/fa";
import { jsPDF } from "jspdf";
import { LJKAContext } from "../../context/LJKAContext";
import { toastError, toastSuccess } from "../../utils/toast";
import { uploadToCloudinaryWithProgress } from "../../utils/cloudinaryUpload";

const MAX_PROOF_SIZE = 1024 * 1024;
const proofFormat = (file) => file?.name.split(".").pop()?.toLowerCase().replace("jpeg", "jpg") || "";

const prepareProof = async (file) => {
  const format = proofFormat(file);
  if (!["jpg", "png", "webp", "pdf"].includes(format)) throw new Error("Only JPG, PNG, WEBP and PDF files are allowed.");
  if (format === "pdf") {
    if (file.size > MAX_PROOF_SIZE) throw new Error("PDF payment proof must be 1 MB or smaller.");
    return file;
  }
  if (!file.type.startsWith("image/")) throw new Error("Please choose a valid image or PDF.");
  // Keep readable screenshots while converting the image to an upload-friendly JPEG.
  const bitmap = await createImageBitmap(file);
  try {
    let scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
      const context = canvas.getContext("2d"); if (!context) throw new Error("Unable to prepare this image.");
      context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.9, 0.8, 0.7]) {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
        if (blob && blob.size <= MAX_PROOF_SIZE) return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
      }
      scale *= 0.75;
    }
    throw new Error("This image could not be compressed below 1 MB. Please choose a clearer, smaller screenshot.");
  } finally { bitmap.close?.(); }
};

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
    <dd className="mt-1 break-words text-sm font-medium text-[var(--ljka-primary)]">{upper(value)}</dd>
  </div>
);

const SupportDetails = ({ support }) => (
  <div className="mt-4 border-t border-[var(--ljka-border)] pt-4">
    <div className="flex items-center justify-between gap-3"><span className="text-xs font-bold uppercase tracking-wide text-emerald-700">Past Sahyog record</span><span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800">{support?.donationPercentage || 0}%</span></div>
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-emerald-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(100, support?.donationPercentage || 0)}%` }} /></div>
    <p className="mt-2 text-sm font-semibold text-emerald-900">Supported {support?.supportedCases || 0} of {support?.totalCases || 0}  members</p>
    <p className="mt-1 text-xs text-emerald-800">Total amount donated: ₹{Number(support?.verifiedAmount || 0).toLocaleString("en-IN")}</p>
  </div>
);

const UploadSahyog = () => {
  const { backendUrl, token, user } = useContext(LJKAContext);
  const [cases, setCases] = useState([]);
  const [selected, setSelected] = useState("");
  const [item, setItem] = useState(null);
  const [donations, setDonations] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [form, setForm] = useState({ amount: "", transactionId: "", paymentMethod: "bank_transfer" });
  const [paymentProof, setPaymentProof] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [proofInputKey, setProofInputKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const restoredDraft = useRef(null);
  const draftOwner = user?._id || user?.id || user?.email || "current";
  const draftKey = `ljka_sahyog_donation_draft:${draftOwner}`;
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
    try {
      const saved = localStorage.getItem(draftKey);
      restoredDraft.current = saved ? JSON.parse(saved) : null;
      if (restoredDraft.current?.form) {
        setForm((current) => ({ ...current, ...restoredDraft.current.form }));
      }
    } catch (error) {
      restoredDraft.current = null;
      console.error("Failed to restore Sahyog donation draft:", error);
    } finally {
      setDraftReady(true);
    }
  }, [draftKey]);

  useEffect(() => {
    fetch(`${backendUrl}/api/user/sahyog?limit=100`, { headers })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load available Sahyog cases.")))
      .then((data) => {
        setCases(data.cases || []);
        if (data.cases?.length) {
          const savedSelection = restoredDraft.current?.selected;
          setSelected(data.cases.some((item) => item._id === savedSelection) ? savedSelection : data.cases[0]._id);
        }
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
        const keepingRestoredDraft = restoredDraft.current?.selected === selected;
        setForm((previous) => ({
          ...previous,
          amount: keepingRestoredDraft && previous.amount
            ? previous.amount
            : (data.sahyog.minimumDonationAmount ? String(data.sahyog.minimumDonationAmount) : ""),
          transactionId: keepingRestoredDraft ? previous.transactionId : "",
        }));
        restoredDraft.current = null;
        setPaymentProof(null);
        setProofInputKey((value) => value + 1);
      })
      .catch((error) => toastError(error.message || "Unable to load payment instructions."));
  }, [backendUrl, selected, token]);

  useEffect(() => {
    if (!draftReady) return;
    try {
      const selectedForDraft = selected || restoredDraft.current?.selected || "";
      const hasDraft = Boolean(selectedForDraft && (form.amount || form.transactionId));
      if (hasDraft) localStorage.setItem(draftKey, JSON.stringify({ selected: selectedForDraft, form }));
      else localStorage.removeItem(draftKey);
    } catch (error) {
      console.error("Failed to save Sahyog donation draft:", error);
    }
  }, [draftKey, draftReady, form, selected]);

  const activeDonation = item && donations.find((donation) => donation.caseId === item.sahyogId && donation.paymentStatus !== "rejected");
  const valid = Boolean(selected && item && paymentProof && !activeDonation && Number(form.amount) >= (item.minimumDonationAmount || 1) && /^[A-Za-z0-9][A-Za-z0-9\-_/:.]{5,63}$/.test(form.transactionId.trim()));
  const handleProofChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const prepared = await prepareProof(file);
      setPaymentProof({ file: prepared, format: proofFormat(prepared), originalFilename: file.name });
      toastSuccess("Payment proof is ready to upload.");
    } catch (error) { setPaymentProof(null); toastError(error.message || "Unable to prepare payment proof."); }
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      const signatureResponse = await fetch(`${backendUrl}/api/user/sahyog/${selected}/donations/proof/sign`, { method: "POST", headers, body: JSON.stringify({ format: paymentProof.format }) });
      const signatureData = await signatureResponse.json();
      if (!signatureResponse.ok || !signatureData.upload) throw new Error(signatureData.message || "Unable to authorize payment proof upload.");
      const upload = await uploadToCloudinaryWithProgress(signatureData.upload, paymentProof.file, setUploadProgress);
      if (!upload.public_id) throw new Error("Payment proof upload failed.");
      const response = await fetch(`${backendUrl}/api/user/sahyog/${selected}/donations`, {
        method: "POST",
        headers,
        body: JSON.stringify({ ...form, paymentProof: { publicId: upload.public_id, format: paymentProof.format, originalFilename: paymentProof.originalFilename }, transactionId: form.transactionId.trim(), amount: Number(form.amount) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to submit donation.");
      localStorage.removeItem(draftKey);
      setForm({ amount: "", transactionId: "", paymentMethod: "bank_transfer" });
      setPaymentProof(null);
      setUploadProgress(0);
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
      {item && <div className="mt-6 grid gap-5 lg:grid-cols-2"><section className="rounded-2xl bg-[var(--ljka-primary-bg)] p-5"><h2 className="font-bold text-[var(--ljka-primary)]">Late member</h2><dl className="mt-3 grid gap-3"><Detail label="Member name" value={upper(item.member.fullName)} /><Detail label="Member ID" value={item.member.memberId} /><Detail label="Joining Date" value={item.member?.joinedAt ? new Date(item.member.joinedAt).toLocaleDateString("en-IN") : "—"} /><Detail label="Date of death" value={item.dateOfDeath ? new Date(item.dateOfDeath).toLocaleDateString("en-IN") : "—"} /><Detail label="Death reason" value={item.causeOfDeath} /><Detail label="Minimum donation" value={item.minimumDonationAmount ? `₹${item.minimumDonationAmount}` : "Not set"} /></dl><SupportDetails support={item.memberSahyogSupport} /></section><section className="rounded-2xl border p-5"><h2 className="font-bold text-[var(--ljka-primary)]">Payment details</h2><dl className="mt-3 grid gap-3 sm:grid-cols-2"><Detail label="A/c holder name" value={item.paymentDetails?.accountHolderName} /><Detail label="Bank name" value={item.paymentDetails?.bankName} /><Detail label="Account number" value={item.paymentDetails?.accountNumber} /><Detail label="IFSC code" value={item.paymentDetails?.ifsc} /><Detail label="Branch name" value={item.paymentDetails?.branchName} /><Detail label="Public UPI ID" value={item.publicPayment?.upiId} /></dl></section></div>}
      {activeDonation ? <div className={`mt-6 rounded-2xl border p-5 ${activeDonation.paymentStatus === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}><p className="font-bold">Donation already submitted</p><p className="mt-1 text-sm">Your previous donation for this late member is {statusDetails(activeDonation.paymentStatus).label.toLowerCase()}</p></div> : <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl border p-5 sm:grid-cols-2"><label className="text-sm font-semibold">Donation amount (₹)<input required min={item?.minimumDonationAmount || 1} type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="mt-2 w-full rounded-lg border p-3" /><span className="mt-1 block text-xs font-normal text-[var(--ljka-muted)]">The minimum amount is preset. You may increase it, but not less than minimum amount, otherwise request may be rejected.</span></label><label className="text-sm font-semibold">Payment method<select required value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })} className="mt-2 w-full rounded-lg border p-3"><option value="bank_transfer">Bank transfer</option><option value="upi">UPI</option></select></label><label className="text-sm font-semibold sm:col-span-2">Payment proof (required)<input key={proofInputKey} type="file" accept="image/png,image/jpeg,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf" onChange={handleProofChange} className="mt-2 w-full rounded-lg border p-3" /><span className="mt-1 block text-xs font-normal text-[var(--ljka-muted)]">JPG, PNG, WEBP or PDF, maximum 1 MB. {paymentProof ? `${paymentProof.originalFilename} ready.` : ""}</span>{submitting && <span className="mt-2 block text-xs font-bold text-[var(--ljka-primary)]">Uploading proof: {uploadProgress}%</span>}</label><label className="text-sm font-semibold sm:col-span-2">Transaction / UTR Number (Mandatory)<input required value={form.transactionId} onChange={(event) => setForm({ ...form, transactionId: event.target.value.toUpperCase() })} className="mt-2 w-full rounded-lg border p-3" /></label><button disabled={!valid || submitting} className="rounded-lg bg-[var(--ljka-primary)] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2">{submitting ? (uploadProgress < 100 ? "Uploading proof…" : "Submitting…") : "Submit for verification"}</button></form>}
    </>}
    <section className="mt-8 overflow-hidden rounded-2xl border border-[var(--ljka-border-light)]"><div className="border-b bg-[var(--ljka-primary-bg)] px-5 py-4"><h2 className="font-bold text-[var(--ljka-primary)]">Your Sahyog payment history</h2></div>{historyLoading ? <p className="p-5 text-sm text-[var(--ljka-muted)]">Loading payment history…</p> : !donations.length ? <p className="p-5 text-sm text-[var(--ljka-muted)]">No Sahyog payments submitted yet.</p> : <div className="divide-y">{donations.map((payment) => { const status = statusDetails(payment.paymentStatus); return <article key={payment._id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-[var(--ljka-primary)]">To: {upper(payment.lateMember?.fullName)} <span className="text-sm font-normal text-[var(--ljka-muted)]">({payment.lateMember?.memberId || "—"})</span></p><p className="mt-1 text-sm">₹{Number(payment.amount || 0).toLocaleString("en-IN")} · {String(payment.paymentMethod || "manual payment").replaceAll("_", " ")}</p><p className="mt-1 text-xs text-[var(--ljka-muted)]">Reference: {payment.transactionId || "—"} · Submitted: {formatDate(payment.createdAt)}</p>{payment.paymentStatus === "success" && <p className="mt-1 text-xs text-green-700">Accepted: {formatDate(payment.verifiedAt)}</p>}</div><div className="flex shrink-0 items-center gap-3"><span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${status.className}`}><status.Icon />{status.label}</span>{payment.paymentStatus === "success" && <button type="button" onClick={() => downloadSahyogReceipt(payment)} className="inline-flex items-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-3 py-2 text-xs font-bold text-white"><FaDownload />Receipt</button>}</div></article>; })}</div>}</section>
    <p className="mt-5 flex gap-2 text-xs leading-5 text-[var(--ljka-muted)]"><FaShieldAlt className="shrink-0 text-[var(--ljka-primary)]" /> Payment details and verification are controlled by LJKA administration.</p>
  </div></section></main>;
};

export default UploadSahyog;
