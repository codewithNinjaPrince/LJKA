// import React, {
//     useContext,
//     useEffect,
//     useState,
// } from "react";

// import {
//     FaDownload,
//     FaQrcode,
//     FaShieldAlt,
//     FaCheckCircle,
//     FaClock,
//     FaTimesCircle,
// } from "react-icons/fa";
// import { jsPDF } from "jspdf";

// import { LJKAContext } from "../../context/LJKAContext";


// const VyawasthaShulk = () => {
//     const {
//         backendUrl,
//         token,
//         user,
//     } = useContext(LJKAContext);

//     const [paymentInfo, setPaymentInfo] =
//         useState(null);

//     const [memberInfo, setMemberInfo] =
//         useState({});

//     const [form, setForm] = useState({
//         payerName: "",
//         utrNumber: "",
//     });

//     const [loading, setLoading] =
//         useState(true);

//     const [submitting, setSubmitting] =
//         useState(false);

//     const [message, setMessage] =
//         useState("");

//     const [messageType, setMessageType] =
//         useState("info");


//     const headers = {
//         Authorization: `Bearer ${token}`,
//         token,
//         "Content-Type": "application/json",
//     };


//     // ==========================================================
//     // LOAD PAYMENT INFORMATION
//     // ==========================================================

//     const loadPaymentInfo = async () => {
//         try {
//             setLoading(true);
//             setMessage("");

//             const response = await fetch(
//                 `${backendUrl}/api/user/vyawastha/payment`,
//                 {
//                     headers,
//                     cache: "no-store",
//                 }
//             );

//             const data =
//                 await response.json();

//             if (!response.ok) {
//                 throw new Error(
//                     data.message ||
//                     "Unable to load payment information"
//                 );
//             }

//             setPaymentInfo(data.payment);
//             setMemberInfo(data.user || {});

//         } catch (error) {
//             setMessage(
//                 error.message ||
//                 "Unable to load Vywastha payment."
//             );
//             setMessageType("error");
//         } finally {
//             setLoading(false);
//         }
//     };


//     useEffect(() => {
//         if (token) {
//             loadPaymentInfo();
//         }
//     }, [backendUrl, token]);

//     const formatReceiptDate = (value) => value
//         ? new Date(value).toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "long",
//             year: "numeric",
//         })
//         : "-";

//     const getAddress = () => {
//         const address = memberInfo?.address || {};
//         return [address.address, address.townVillage, address.tehsilName, address.districtName, address.stateName, address.pincode]
//             .filter(Boolean)
//             .join(", ") || "-";
//     };

//     // The API may attach the expiry to the payment, payment summary, or member.
//     // Do not invent an expiry date when the backend has not supplied one.
//     const getMembershipExpiry = (payment = {}) =>
//         payment?.membershipExpiresAt ||
//         paymentInfo?.membershipExpiresAt ||
//         memberInfo?.membershipExpiresAt ||
//         paymentInfo?.existingPayment?.membershipExpiresAt ||
//         paymentInfo?.paymentHistory?.find((item) => item?.membershipExpiresAt)?.membershipExpiresAt ||
//         null;

//     const downloadReceipt = async (payment) => {
//         try {
//             const document = new jsPDF({ unit: "mm", format: "a4" });
//             // Try common filename spellings; deployed servers are case-sensitive.
//             const logoPaths = [
//                 "/img/Lakhdaatar_Logo.png",
//                 "/img/Lakhdatar_Logo.png",
//                 "/img/Lakdatar_Logo.png",
//                 "/img/Lakhdaatar_Logo.jpg",
//                 "/img/Lakhdatar_Logo.jpg",
//             ];
//             let logoDataUrl = null;
//             for (const logoPath of logoPaths) {
//                 try {
//                     const response = await fetch(logoPath, { cache: "no-cache" });
//                     if (!response.ok) continue;
//                     const blob = await response.blob();
//                     if (!blob.type.startsWith("image/")) continue;
//                     logoDataUrl = await new Promise((resolve, reject) => {
//                         const reader = new FileReader();
//                         reader.onload = () => resolve(reader.result);
//                         reader.onerror = reject;
//                         reader.readAsDataURL(blob);
//                     });
//                     if (logoDataUrl) break;
//                 } catch (logoError) {
//                     // Try the next filename if this one is not available.
//                 }
//             }
//             if (!logoDataUrl) {
//                 throw new Error("LJKA logo was not found. Check the exact filename in public/img.");
//             }

//             const maroon = [126, 5, 30];
//             const cream = [253, 248, 241];
//             const ink = [45, 43, 43];
//             const muted = [105, 92, 92];
//             const gold = [214, 169, 63];
//             const logoFormat = String(logoDataUrl).startsWith("data:image/jpeg") ? "JPEG" : "PNG";
//             const hideContact = (value, visible = 2) => {
//                 const text = String(value || "");
//                 return text.length > visible * 2 ? `${text.slice(0, visible)}${"*".repeat(Math.max(4, text.length - visible * 2))}${text.slice(-visible)}` : text || "-";
//             };
//             const hideEmail = (value) => {
//                 const [name, domain] = String(value || "").split("@");
//                 return name && domain ? `${name.slice(0, 2)}${"*".repeat(Math.max(3, name.length - 2))}@${domain}` : "-";
//             };

//             // Branded header, following the approved LJKA receipt format.
//             document.setFillColor(...maroon);
//             document.rect(0, 0, 210, 39, "F");
//             document.setFillColor(255, 255, 255);
//             document.roundedRect(13, 6, 27, 27, 2, 2, "F");
//             document.addImage(logoDataUrl, logoFormat, 15, 8, 23, 23, undefined, "FAST");
//             document.setTextColor(255, 255, 255);
//             document.setFont("helvetica", "bold");
//             document.setFontSize(15);
//             document.text("LAKHDATAR JEEVAN KALYAN", 47, 18);
//             document.text("ASSOCIATION", 47, 24);
//             document.setFont("helvetica", "normal");
//             document.setFontSize(8.5);
//             document.text("Membership Fee Donation Receipt", 47, 30);

//             document.setTextColor(...ink);
//             document.setFont("helvetica", "bold");
//             document.setFontSize(17);
//             document.text("DONATION RECEIPT", 105, 52, { align: "center" });
//             document.setDrawColor(...gold);
//             document.setLineWidth(0.6);
//             document.line(75, 55, 135, 55);

//             const details = [
//                 ["Receipt reference", String(payment.id || "-")],
//                 ["Donation made to", "Lakhdatar Jeevan Kalyan Association (LJKA)"],
//                 ["Donation purpose", "Annual Membership Fee"],
//                 ["Amount received", `INR ${Number(payment.amount || 0).toLocaleString("en-IN")}`],
//                 ["UTR / transaction reference", payment.utrNumber || "-"],
//                 ["Paid by", payment.payerName || memberInfo.fullName || "-"],
//                 ["Verified on", formatReceiptDate(payment.verifiedAt)],
//                 ["Membership status", "ACTIVE - payment verified"],
//                 ["Membership valid until", getMembershipExpiry(payment) ? formatReceiptDate(getMembershipExpiry(payment)) : "Active (expiry date not provided)"],
//             ];

//             let y = 64;
//             details.forEach(([label, value], index) => {
//                 const valueLines = document.splitTextToSize(String(value), 100);
//                 const rowHeight = Math.max(12, valueLines.length * 4.8 + 5);
//                 document.setFillColor(...(index % 2 === 0 ? cream : [255, 255, 255]));
//                 document.roundedRect(14, y, 182, rowHeight, 1.5, 1.5, "F");
//                 document.setTextColor(...muted);
//                 document.setFont("helvetica", "bold");
//                 document.setFontSize(8.6);
//                 document.text(label, 20, y + 7);
//                 document.setTextColor(...ink);
//                 document.setFont("helvetica", "normal");
//                 document.text(valueLines, 91, y + 7);
//                 y += rowHeight + 2;
//             });

//             y += 5;
//             document.setTextColor(...maroon);
//             document.setFont("helvetica", "bold");
//             document.setFontSize(12);
//             document.text("Member details", 15, y);
//             y += 8;
//             const memberDetails = [
//                 ["Name", memberInfo.fullName || "-"],
//                 ["Member ID", memberInfo.memberId || "-"],
//                 ["Mobile", hideContact(memberInfo.mobile)],
//                 ["Email", hideEmail(memberInfo.email)],
//                 ["Address", getAddress()],
//             ];
//             memberDetails.forEach(([label, value]) => {
//                 document.setTextColor(...muted);
//                 document.setFont("helvetica", "bold");
//                 document.setFontSize(9);
//                 document.text(label, 19, y);
//                 document.setTextColor(...ink);
//                 document.setFont("helvetica", "normal");
//                 const lines = document.splitTextToSize(String(value), 120);
//                 document.text(lines, 65, y);
//                 y += Math.max(7, lines.length * 5 + 2);
//             });

//             const noticeY = Math.min(Math.max(y + 7, 220), 245);
//             document.setFillColor(28, 28, 28);
//             document.roundedRect(36, noticeY, 138, 25, 3, 3, "F");
//             document.setTextColor(255, 255, 255);
//             document.setFont("helvetica", "normal");
//             document.setFontSize(9.5);
//             const notice = "Payment of the annual membership fee does not guarantee any financial return or benefit under any scheme.";
//             document.text(document.splitTextToSize(notice, 120), 105, noticeY + 9, { align: "center" });

//             document.setDrawColor(...gold);
//             document.setLineWidth(0.35);
//             document.line(15, 278, 195, 278);
//             document.setTextColor(100, 100, 100);
//             document.setFontSize(8);
//             document.text("This is a system-generated LJKA receipt. No signature is required.", 105, 285, { align: "center" });
//             document.save(`LJKA-Vyawastha-Receipt-${payment.utrNumber || payment.id}.pdf`);
//         } catch (error) {
//             console.error("Receipt download error:", error);
//             setMessage("Unable to generate the receipt. Please try again.");
//             setMessageType("error");
//         }
//     };


//     // ==========================================================
//     // SUBMIT
//     // ==========================================================

//     const submitPayment = async (event) => {
//         event.preventDefault();

//         if (!canSubmit) return;

//         try {
//             setSubmitting(true);
//             setMessage("");

//             const payerName = form.payerName.trim().toUpperCase();
//             const utrNumber = form.utrNumber.trim().toUpperCase();

//             const response = await fetch(
//                 `${backendUrl}/api/user/vyawastha/payment`,
//                 {
//                     method: "POST",
//                     headers,
//                     body: JSON.stringify({
//                         payerName:
//                             form.payerName.trim(),
//                         utrNumber:
//                             form.utrNumber.trim().toUpperCase(),
//                     }),
//                 }
//             );

//             const data =
//                 await response.json();

//             if (!response.ok) {
//                 throw new Error(
//                     data.message ||
//                     "Unable to submit payment"
//                 );
//             }

//             setMessage(
//                 data.message ||
//                 "Payment submitted for verification."
//             );

//             setMessageType("success");

//             setForm((current) => ({
//                 ...current,
//                 utrNumber: "",
//             }));

//             await loadPaymentInfo();
//         } catch (error) {
//             setMessage(
//                 error.message ||
//                 "Unable to submit payment."
//             );

//             setMessageType("error");
//         } finally {
//             setSubmitting(false);
//         }
//     };


//     // ==========================================================
//     // LOADING
//     // ==========================================================

//     if (loading) {
//         return (
//             <main className="grid min-h-screen place-items-center bg-[var(--ljka-bg)]">
//                 <p className="text-[var(--ljka-primary)]">
//                     Loading Vywastha Shulk...
//                 </p>
//             </main>
//         );
//     }

//     // ==========================================================
//     // PAYMENT STATUS
//     // ==========================================================

//     const membershipStatus = paymentInfo?.paymentStatus;
//     const existingPayment = paymentInfo?.existingPayment;
//     const paymentHistory = paymentInfo?.paymentHistory || [];

//     const hasSubmittedPayment = Boolean(existingPayment);

//     const isPaid = membershipStatus === "paid";
//     const firstVyawasthaShulkWaived = Boolean(
//         paymentInfo?.firstVyawasthaShulkWaived
//     );

//     const isPending =
//         existingPayment?.paymentStatus === "pending";

//     const isRejected =
//         existingPayment?.paymentStatus === "rejected";


//     // ==========================================================
//     // FORM VALIDATION
//     // ==========================================================

//     const validUtr =
//         /^[A-Za-z0-9][A-Za-z0-9\-/:._]{5,31}$/.test(
//             form.utrNumber.trim()
//         );

//     const validName =
//         form.payerName.trim().length >= 3;

//     const canSubmit =
//         validName &&
//         validUtr &&
//         !submitting &&
//         !isPaid &&
//         !isPending;


//     return (
//         <main className="min-h-screen bg-[var(--ljka-bg)] px-4 py-10 sm:px-6 lg:py-14">

//             <section className="mx-auto max-w-5xl">

//                 {/* ====================================================
//             HEADER
//         ==================================================== */}

//                 <div className="mb-7">

//                     <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold-dark)]">
//                         LJKA Membership
//                     </p>

//                     <h1 className="mt-2 text-3xl font-bold text-[var(--ljka-primary)] sm:text-4xl">
//                         Vywastha Shulk
//                     </h1>

//                     <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ljka-muted)]">
//                         Pay your annual Vywastha Shulk and submit
//                         your transaction details for verification.
//                     </p>

//                 </div>

//                 <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#efd997] bg-[#fffaf0] p-4 sm:flex-row sm:items-center sm:justify-between">
//                     <div>
//                         <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--ljka-gold-dark)]">Annual membership fee</p>
//                         <p className="mt-1 text-sm font-semibold text-[var(--ljka-primary)]">पहले 1,100 सदस्यों के लिए ₹251। उसके बाद नए सदस्यों के लिए ₹365 वार्षिक शुल्क।</p>
//                     </div>
//                     <span className="w-fit shrink-0 rounded-full bg-[var(--ljka-primary)] px-3 py-1.5 text-xs font-bold text-white">₹251 → ₹365</span>
//                 </section>


//                 {/* ====================================================
//             ALREADY VERIFIED
//         ==================================================== */}

//                 {isPaid && (
//                     <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">

//                         <div className="flex gap-4">

//                             <FaCheckCircle className="mt-1 shrink-0 text-xl text-green-600" />

//                             <div>

//                                 <h2 className="font-bold text-green-800">
//                                     {firstVyawasthaShulkWaived
//                                         ? "First Vywastha Shulk Waived"
//                                         : "Vywastha Shulk Verified"}
//                                 </h2>

//                                 <p className="mt-1 text-sm text-green-700">
//                                     {firstVyawasthaShulkWaived
//                                         ? "Your valid referral code waived your first Vywastha Shulk. Your membership is active from the day your KYC was completed."
//                                         : "Your annual membership payment has been verified successfully."}
//                                 </p>

//                                 <p className="mt-2 text-sm font-semibold text-green-800">
//                                     Membership status: Active
//                                 </p>
//                                 {getMembershipExpiry() ? (
//                                     <p className="mt-1 text-sm font-semibold text-green-800">
//                                         Membership valid until{" "}
//                                         {new Date(getMembershipExpiry()).toLocaleDateString("en-IN", {
//                                             day: "2-digit",
//                                             month: "long",
//                                             year: "numeric",
//                                         })}
//                                     </p>
//                                 ) : (
//                                     <p className="mt-1 text-sm text-green-700">
//                                         Your payment is verified. The expiry date has not been provided by the server yet.
//                                     </p>
//                                 )}

//                             </div>

//                         </div>

//                     </div>
//                 )}


//                 {/* ====================================================
//             PAYMENT PENDING
//         ==================================================== */}

//                 {/* ====================================================
//     PAYMENT REQUIRED
// ==================================================== */}

//                 {!isPaid && !hasSubmittedPayment && (
//                     <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
//                         <div className="flex gap-4">
//                             <FaQrcode className="mt-1 shrink-0 text-xl text-blue-600" />

//                             <div>
//                                 <h2 className="font-bold text-blue-800">
//                                     Vywastha Shulk Payment Required
//                                 </h2>

//                                 <p className="mt-1 text-sm text-blue-700">
//                                     You have not submitted your annual Vywastha
//                                     Shulk payment yet. Please complete the payment
//                                     using the QR code below and then enter your UTR
//                                     number for verification.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 )}


//                 {/* ====================================================
//     PAYMENT VERIFICATION PENDING
// ==================================================== */}

//                 {isPending && (
//                     <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
//                         <div className="flex gap-4">
//                             <FaClock className="mt-1 shrink-0 text-xl text-amber-600" />

//                             <div>
//                                 <h2 className="font-bold text-amber-800">
//                                     Payment Verification Pending
//                                 </h2>

//                                 <p className="mt-1 text-sm text-amber-700">
//                                     Your payment details have been submitted and
//                                     are currently waiting for admin verification.
//                                 </p>

//                                 {existingPayment?.utrNumber && (
//                                     <p className="mt-2 text-xs font-semibold text-amber-800">
//                                         Submitted UTR: {existingPayment.utrNumber}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )}


//                 {/* ====================================================
//     PAYMENT REJECTED
// ==================================================== */}

//                 {isRejected && (
//                     <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
//                         <div className="flex gap-4">
//                             <FaTimesCircle className="mt-1 shrink-0 text-xl text-red-600" />

//                             <div>
//                                 <h2 className="font-bold text-red-800">
//                                     Payment Verification Rejected
//                                 </h2>

//                                 <p className="mt-1 text-sm text-red-700">
//                                     Your previous payment submission could not
//                                     be verified. Please make the payment again
//                                     if required and submit the new UTR number.
//                                 </p>

//                                 {existingPayment?.rejectionReason && (
//                                     <p className="mt-2 text-sm font-semibold text-red-800">
//                                         Reason: {existingPayment.rejectionReason}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {paymentHistory.length > 0 && (
//                     <section className="mb-6 overflow-hidden rounded-2xl border border-[var(--ljka-border-light)] bg-white shadow-sm">
//                         <div className="border-b border-[var(--ljka-border-light)] bg-[var(--ljka-primary-bg)] px-5 py-4">
//                             <h2 className="font-bold text-[var(--ljka-primary)]">Payment History</h2>
//                             <p className="mt-1 text-sm text-[var(--ljka-muted)]">Your submitted Vywastha Shulk payments and their verification status.</p>
//                         </div>
//                         <div className="divide-y divide-[var(--ljka-border-light)]">
//                             {paymentHistory.map((payment) => {
//                                 const statusClass = payment.paymentStatus === "verified"
//                                     ? "bg-green-100 text-green-800"
//                                     : payment.paymentStatus === "rejected"
//                                         ? "bg-red-100 text-red-800"
//                                         : "bg-amber-100 text-amber-800";
//                                 const statusLabel = payment.paymentStatus === "verified"
//                                     ? "Approved"
//                                     : payment.paymentStatus === "rejected"
//                                         ? "Rejected"
//                                         : "Pending";
//                                 return (
//                                     <div key={payment.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
//                                         <div>
//                                             <p className="font-semibold text-[var(--ljka-primary)]">UTR: {payment.utrNumber}</p>
//                                             <p className="mt-1 text-xs text-[var(--ljka-muted)]">Submitted {new Date(payment.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} · ₹{payment.amount}</p>
//                                             {payment.paymentStatus === "rejected" && payment.rejectionReason && (
//                                                 <p className="mt-2 text-sm text-red-700">Reason: {payment.rejectionReason}</p>
//                                             )}
//                                         </div>
//                                         <div className="flex items-center gap-3">
//                                             <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>{statusLabel}</span>
//                                             {payment.paymentStatus === "verified" && (
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => downloadReceipt(payment)}
//                                                     className="inline-flex items-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-3 py-2 text-xs font-bold text-white transition hover:bg-[var(--ljka-primary-dark)]"
//                                                 >
//                                                     <FaDownload /> Download receipt
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </section>
//                 )}


//                 <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">


//                     {/* ==================================================
//               QR CARD
//           ================================================== */}

//                     <section className="rounded-3xl border border-[var(--ljka-border-light)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">

//                         <div className="flex items-center gap-3">

//                             <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--ljka-primary-bg)] text-xl text-[var(--ljka-primary)]">
//                                 <FaQrcode />
//                             </span>

//                             <div>
//                                 <h2 className="font-bold text-[var(--ljka-primary)]">
//                                     Pay Vywastha Shulk
//                                 </h2>

//                                 <p className="text-xs text-[var(--ljka-muted)]">
//                                     Scan the QR code to make payment
//                                 </p>
//                             </div>

//                         </div>


//                         <div className="mt-6 flex justify-center rounded-2xl border bg-white p-5">

//                             <img
//                                 src="/img/265 QR.jpeg"
//                                 alt="Vywastha Shulk Payment QR Code"
//                                 className="h-64 w-64 object-contain sm:h-72 sm:w-72"
//                             />

//                         </div>


//                         {paymentInfo?.amount > 0 && (
//                             <div className="mt-5 rounded-xl bg-[var(--ljka-primary-bg)] p-4 text-center">

//                                 <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ljka-muted)]">
//                                     Annual Vywastha Shulk
//                                 </p>

//                                 <p className="mt-1 text-3xl font-bold text-[var(--ljka-primary)]">
//                                     ₹{paymentInfo.amount}
//                                 </p>

//                             </div>
//                         )}


//                         <a
//                             href="/img/265 QR.jpeg"
//                             download="LJKA-Vywastha-Shulk-QR.jpeg"
//                             className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--ljka-primary)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--ljka-primary-dark)]"
//                         >
//                             <FaDownload />
//                             Download QR
//                         </a>


//                         <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">

//                             <strong>Important:</strong>{" "}
//                             Complete the payment first. Then enter the
//                             exact transaction / UTR number shown by your
//                             bank or UPI app.

//                         </div>

//                     </section>


//                     {/* ==================================================
//               FORM CARD
//           ================================================== */}

//                     <section className="rounded-3xl border border-[var(--ljka-border-light)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">

//                         <div>

//                             <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ljka-gold-dark)]">
//                                 Payment Verification
//                             </p>

//                             <h2 className="mt-1 text-2xl font-bold text-[var(--ljka-primary)]">
//                                 Submit Payment Details
//                             </h2>

//                             <p className="mt-2 text-sm leading-6 text-[var(--ljka-muted)]">
//                                 Enter your name and UTR / transaction
//                                 reference number after completing payment.
//                             </p>

//                         </div>


//                         {!isPaid && !isPending && (
//                             <form
//                                 onSubmit={submitPayment}
//                                 className="mt-7 space-y-5"
//                             >
//                                 {/* NAME */}

//                                 <label className="block text-sm font-semibold text-[var(--ljka-primary)]">
//                                     Name

//                                     <input
//                                         type="text"
//                                         required
//                                         value={form.payerName}
//                                         onChange={(event) =>
//                                             setForm({
//                                                 ...form,
//                                                 payerName: event.target.value.toUpperCase(),
//                                             })
//                                         }
//                                         placeholder="Enter payer name"
//                                         className="mt-2 w-full rounded-xl border border-[var(--ljka-border)] bg-white p-3.5 outline-none transition focus:border-[var(--ljka-primary)]"
//                                     />
//                                 </label>


//                                 {/* UTR */}

//                                 <label className="block text-sm font-semibold text-[var(--ljka-primary)]">
//                                     Transaction / UTR Number

//                                     <input
//                                         type="text"
//                                         required
//                                         value={form.utrNumber}
//                                         onChange={(event) =>
//                                             setForm({
//                                                 ...form,
//                                                 utrNumber: event.target.value.toUpperCase(),
//                                             })
//                                         }
//                                         placeholder="Enter UTR / transaction number"
//                                         className="mt-2 w-full rounded-xl border border-[var(--ljka-border)] bg-white p-3.5 uppercase outline-none transition focus:border-[var(--ljka-primary)]"
//                                     />

//                                     <span className="mt-2 block text-xs font-normal text-[var(--ljka-muted)]">
//                                         Complete the payment first, then enter the exact
//                                         UTR / transaction number shown by your bank or UPI app.
//                                     </span>
//                                 </label>


//                                 {/* SUBMIT */}

//                                 <button
//                                     type="submit"
//                                     disabled={!canSubmit}
//                                     className="w-full rounded-xl bg-[var(--ljka-primary)] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--ljka-primary-dark)] disabled:cursor-not-allowed disabled:opacity-40"
//                                 >
//                                     {submitting
//                                         ? "Submitting..."
//                                         : "Submit for Verification"}
//                                 </button>

//                                 {!validName && (
//                                     <p className="text-xs text-red-600">
//                                         Enter your name to enable submission.
//                                     </p>
//                                 )}

//                                 {validName && !validUtr && (
//                                     <p className="text-xs text-red-600">
//                                         Enter a valid UTR / transaction number to enable submission.
//                                     </p>
//                                 )}
//                             </form>
//                         )}

//                         {/* MESSAGE */}

//                         {message && (
//                             <div
//                                 className={`mt-5 rounded-xl p-4 text-sm ${messageType === "success"
//                                     ? "bg-green-50 text-green-800"
//                                     : "bg-red-50 text-red-700"
//                                     }`}
//                             >
//                                 {message}
//                             </div>
//                         )}


//                         <div className="mt-6 flex gap-2 text-xs leading-5 text-[var(--ljka-muted)]">

//                             <FaShieldAlt className="mt-0.5 shrink-0 text-[var(--ljka-primary)]" />

//                             <p>
//                                 Payment status changes to paid only after
//                                 LJKA administration verifies the transaction.
//                             </p>

//                         </div>

//                     </section>

//                 </div>

//             </section>

//         </main>
//     );
// };

// export default VyawasthaShulk;

import React, {
    useContext,
    useEffect,
    useState,
} from "react";

import {
    FaDownload,
    FaQrcode,
    FaShieldAlt,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import { FaFilePdf, FaEye, FaTrash } from "react-icons/fa";

import { LJKAContext } from "../../context/LJKAContext";
import { toastError, toastInfo, toastSuccess } from "../../utils/toast";
import { uploadToCloudinaryWithProgress } from "../../utils/cloudinaryUpload";



const MAX_PROOF_SIZE = 1024 * 1024;
const ALLOWED_PROOF_FORMATS = ["jpg", "jpeg", "png", "webp", "pdf"];
const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const getProofFormat = (file) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension === "jpeg") return "jpg";
    return extension || "";
};

const compressPaymentImage = async (file) => {
    if (typeof createImageBitmap !== "function") {
        throw new Error("Your browser cannot process this image. Please use a modern browser.");
    }

    const bitmap = await createImageBitmap(file);
    try {
        let width = bitmap.width;
        let height = bitmap.height;
        const initialMaxDimension = 2400;

        if (Math.max(width, height) > initialMaxDimension) {
            const scale = initialMaxDimension / Math.max(width, height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
        }

        let bestFile = null;

        // Reduce quality gradually first, then dimensions if needed.
        for (let dimensionAttempt = 0; dimensionAttempt < 7; dimensionAttempt += 1) {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext("2d");
            if (!context) {
                throw new Error("Unable to process the selected image.");
            }

            // Bank screenshots with transparent pixels should remain readable.
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, width, height);
            context.drawImage(bitmap, 0, 0, width, height);

            for (let quality = 0.92; quality >= 0.68; quality -= 0.06) {
                const blob = await new Promise((resolve) => {
                    canvas.toBlob(resolve, "image/jpeg", quality);
                });

                if (!blob) continue;

                const compressed = new File(
                    [blob],
                    `${file.name.replace(/\.[^.]+$/, "")}.jpg`,
                    { type: "image/jpeg", lastModified: Date.now() }
                );

                if (!bestFile || compressed.size < bestFile.size) {
                    bestFile = compressed;
                }

                if (compressed.size <= MAX_PROOF_SIZE) {
                    return compressed.size <= file.size ? compressed : file;
                }
            }

            width = Math.round(width * 0.82);
            height = Math.round(height * 0.82);

            if (Math.max(width, height) < 900) break;
        }

        if (file.size <= MAX_PROOF_SIZE) return file;

        if (bestFile && bestFile.size <= MAX_PROOF_SIZE) return bestFile;

        throw new Error(
            "This image could not be compressed below 1 MB while keeping it readable. Please choose another screenshot."
        );
    } finally {
        bitmap.close?.();
    }
};

const VyawasthaShulk = () => {
    const {
        backendUrl,
        token,
        user,
    } = useContext(LJKAContext);

    const [paymentInfo, setPaymentInfo] =
        useState(null);

    const [memberInfo, setMemberInfo] =
        useState({});

    const [form, setForm] = useState({
        payerName: "",
        utrNumber: "",
    });

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [selectedProof, setSelectedProof] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [proofPreparing, setProofPreparing] = useState(false);
    const [draftReady, setDraftReady] = useState(false);
    const draftOwner = user?._id || user?.id || user?.email || "current";
    const draftKey = `ljka_vyawastha_draft:${draftOwner}`;

    useEffect(() => {
        return () => {
            if (selectedProof?.previewUrl) {
                URL.revokeObjectURL(selectedProof.previewUrl);
            }
        };
    }, [selectedProof]);

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    // Browsers cannot restore a selected file, but preserve the typed payment
    // details while the member navigates around the application.
    useEffect(() => {
        try {
            const saved = localStorage.getItem(draftKey);
            if (saved) setForm((current) => ({ ...current, ...JSON.parse(saved) }));
        } catch (error) {
            console.error("Failed to restore Vyawastha draft:", error);
        } finally {
            setDraftReady(true);
        }
    }, [draftKey]);

    useEffect(() => {
        if (!draftReady) return;
        try {
            const hasDraft = Object.values(form).some((value) => String(value).trim());
            if (hasDraft) localStorage.setItem(draftKey, JSON.stringify(form));
            else localStorage.removeItem(draftKey);
        } catch (error) {
            console.error("Failed to save Vyawastha draft:", error);
        }
    }, [draftKey, draftReady, form]);


    // ==========================================================
    // LOAD PAYMENT INFORMATION
    // ==========================================================

    const loadPaymentInfo = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${backendUrl}/api/user/vyawastha/payment`,
                {
                    headers,
                    cache: "no-store",
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to load payment information"
                );
            }

            setPaymentInfo(data.payment);
            setMemberInfo(data.user || {});

        } catch (error) {
            toastError(error.message || "Unable to load Vywastha payment.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (token) {
            loadPaymentInfo();
        }
    }, [backendUrl, token]);

    const formatReceiptDate = (value) => value
        ? new Date(value).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
        : "-";

    const getAddress = () => {
        const address = memberInfo?.address || {};
        return [address.address, address.townVillage, address.tehsilName, address.districtName, address.stateName, address.pincode]
            .filter(Boolean)
            .join(", ") || "-";
    };

    // The API may attach the expiry to the payment, payment summary, or member.
    // Do not invent an expiry date when the backend has not supplied one.
    const getMembershipExpiry = (payment = {}) =>
        payment?.membershipExpiresAt ||
        paymentInfo?.membershipExpiresAt ||
        memberInfo?.membershipExpiresAt ||
        paymentInfo?.existingPayment?.membershipExpiresAt ||
        paymentInfo?.paymentHistory?.find((item) => item?.membershipExpiresAt)?.membershipExpiresAt ||
        null;

    const downloadReceipt = async (payment) => {
        try {
            const document = new jsPDF({ unit: "mm", format: "a4" });
            // Try common filename spellings; deployed servers are case-sensitive.
            const logoPaths = [
                "/img/Lakhdaatar_Logo.png",
                "/img/Lakhdatar_Logo.png",
                "/img/Lakdatar_Logo.png",
                "/img/Lakhdaatar_Logo.jpg",
                "/img/Lakhdatar_Logo.jpg",
            ];
            let logoDataUrl = null;
            for (const logoPath of logoPaths) {
                try {
                    const response = await fetch(logoPath, { cache: "no-cache" });
                    if (!response.ok) continue;
                    const blob = await response.blob();
                    if (!blob.type.startsWith("image/")) continue;
                    logoDataUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                    if (logoDataUrl) break;
                } catch (logoError) {
                    // Try the next filename if this one is not available.
                }
            }
            if (!logoDataUrl) {
                throw new Error("LJKA logo was not found. Check the exact filename in public/img.");
            }

            const maroon = [126, 5, 30];
            const cream = [253, 248, 241];
            const ink = [45, 43, 43];
            const muted = [105, 92, 92];
            const gold = [214, 169, 63];
            const logoFormat = String(logoDataUrl).startsWith("data:image/jpeg") ? "JPEG" : "PNG";
            const hideContact = (value, visible = 2) => {
                const text = String(value || "");
                return text.length > visible * 2 ? `${text.slice(0, visible)}${"*".repeat(Math.max(4, text.length - visible * 2))}${text.slice(-visible)}` : text || "-";
            };
            const hideEmail = (value) => {
                const [name, domain] = String(value || "").split("@");
                return name && domain ? `${name.slice(0, 2)}${"*".repeat(Math.max(3, name.length - 2))}@${domain}` : "-";
            };

            // Branded header, following the approved LJKA receipt format.
            document.setFillColor(...maroon);
            document.rect(0, 0, 210, 39, "F");
            document.setFillColor(255, 255, 255);
            document.roundedRect(13, 6, 27, 27, 2, 2, "F");
            document.addImage(logoDataUrl, logoFormat, 15, 8, 23, 23, undefined, "FAST");
            document.setTextColor(255, 255, 255);
            document.setFont("helvetica", "bold");
            document.setFontSize(15);
            document.text("LAKHDATAR JEEVAN KALYAN", 47, 18);
            document.text("ASSOCIATION", 47, 24);
            document.setFont("helvetica", "normal");
            document.setFontSize(8.5);
            document.text("Membership Fee Donation Receipt", 47, 30);

            document.setTextColor(...ink);
            document.setFont("helvetica", "bold");
            document.setFontSize(17);
            document.text("DONATION RECEIPT", 105, 52, { align: "center" });
            document.setDrawColor(...gold);
            document.setLineWidth(0.6);
            document.line(75, 55, 135, 55);

            const details = [
                ["Receipt reference", String(payment.id || "-")],
                ["Donation made to", "Lakhdatar Jeevan Kalyan Association (LJKA)"],
                ["Donation purpose", "Annual Membership Fee"],
                ["Amount received", `INR ${Number(payment.amount || 0).toLocaleString("en-IN")}`],
                ["UTR / transaction reference", payment.utrNumber || "-"],
                ["Paid by", payment.payerName || memberInfo.fullName || "-"],
                ["Verified on", formatReceiptDate(payment.verifiedAt)],
                ["Membership status", "ACTIVE - payment verified"],
                ["Membership valid until", getMembershipExpiry(payment) ? formatReceiptDate(getMembershipExpiry(payment)) : "Active (expiry date not provided)"],
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

            y += 5;
            document.setTextColor(...maroon);
            document.setFont("helvetica", "bold");
            document.setFontSize(12);
            document.text("Member details", 15, y);
            y += 8;
            const memberDetails = [
                ["Name", memberInfo.fullName || "-"],
                ["Member ID", memberInfo.memberId || "-"],
                ["Mobile", hideContact(memberInfo.mobile)],
                ["Email", hideEmail(memberInfo.email)],
                ["Address", getAddress()],
            ];
            memberDetails.forEach(([label, value]) => {
                document.setTextColor(...muted);
                document.setFont("helvetica", "bold");
                document.setFontSize(9);
                document.text(label, 19, y);
                document.setTextColor(...ink);
                document.setFont("helvetica", "normal");
                const lines = document.splitTextToSize(String(value), 120);
                document.text(lines, 65, y);
                y += Math.max(7, lines.length * 5 + 2);
            });

            const noticeY = Math.min(Math.max(y + 7, 220), 245);
            document.setFillColor(28, 28, 28);
            document.roundedRect(36, noticeY, 138, 25, 3, 3, "F");
            document.setTextColor(255, 255, 255);
            document.setFont("helvetica", "normal");
            document.setFontSize(9.5);
            const notice = "Payment of the annual membership fee does not guarantee any financial return or benefit under any scheme.";
            document.text(document.splitTextToSize(notice, 120), 105, noticeY + 9, { align: "center" });

            document.setDrawColor(...gold);
            document.setLineWidth(0.35);
            document.line(15, 278, 195, 278);
            document.setTextColor(100, 100, 100);
            document.setFontSize(8);
            document.text("This is a system-generated LJKA receipt. No signature is required.", 105, 285, { align: "center" });
            document.save(`LJKA-Vyawastha-Receipt-${payment.utrNumber || payment.id}.pdf`);
        } catch (error) {
            console.error("Receipt download error:", error);
            toastError("Unable to generate the receipt. Please try again.");
        }
    };


    // ==========================================================
    // PAYMENT PROOF SELECTION AND PREPARATION
    // ==========================================================

    const handleProofSelection = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        // Do not keep an older preview visible while a new file is being checked.
        setSelectedProof(null);
        setProofPreparing(true);
        setUploadProgress(0);

        try {
            const format = getProofFormat(file);

            if (!ALLOWED_PROOF_FORMATS.includes(format)) {
                throw new Error("Only JPG, JPEG, PNG, WEBP and PDF files are allowed. Word and other document files are not accepted.");
            }

            // Reject oversized originals immediately. Never preview or compress a file
            // that is already larger than the permitted 1 MB upload limit.
            if (file.size > MAX_PROOF_SIZE) {
                throw new Error("File size must be 1 MB or less. Please choose a smaller file.");
            }

            let finalFile = file;

            if (format === "pdf") {
                if (file.type !== "application/pdf") {
                    throw new Error("Please select a valid PDF file.");
                }
            } else {
                if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
                    throw new Error("Please select a valid JPG, JPEG, PNG or WEBP image.");
                }

                // Keep the existing image preparation step for smaller images.
                finalFile = await compressPaymentImage(file);

                if (finalFile.size > MAX_PROOF_SIZE) {
                    throw new Error("File size must be 1 MB or less. Please choose a smaller image.");
                }
            }

            const finalFormat = getProofFormat(finalFile);

            if (!ALLOWED_PROOF_FORMATS.includes(finalFormat)) {
                throw new Error("The prepared file format is not supported.");
            }

            // Give the user a brief visible checking animation even for a small PDF.
            await new Promise((resolve) => window.setTimeout(resolve, 180));

            setSelectedProof({
                file: finalFile,
                format: finalFormat,
                originalFilename: file.name,
                previewUrl: URL.createObjectURL(finalFile),
                isPdf: finalFormat === "pdf",
            });

            toastSuccess(finalFormat === "pdf" ? "PDF ready to upload." : "Image ready to upload.");
        } catch (error) {
            setSelectedProof(null);
            toastError(error.message || "Unable to prepare payment proof.");
        } finally {
            setProofPreparing(false);
        }
    };

    const removeSelectedProof = () => {
        setSelectedProof(null);
        setUploadProgress(0);
    };


    // ==========================================================
    // SUBMIT
    // ==========================================================

    const submitPayment = async (event) => {
        event.preventDefault();

        if (!canSubmit) return;

        try {
            setSubmitting(true);

            const payerName = form.payerName.trim().toUpperCase();
            const utrNumber = form.utrNumber.trim().toUpperCase();

            if (!selectedProof) {
                throw new Error("Please upload your payment screenshot or receipt.");
            }

            toastInfo("Preparing secure upload...");

            // Ask the authenticated backend to sign this exact file format.
            const signatureResponse = await fetch(
                `${backendUrl}/api/user/vyawastha/proof/sign`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        format: selectedProof.format,
                    }),
                }
            );

            const signatureData = await signatureResponse.json();

            if (!signatureResponse.ok || !signatureData?.upload) {
                throw new Error(
                    signatureData.message || "Unable to authorize payment proof upload."
                );
            }

            const cloudinaryResult = await uploadToCloudinaryWithProgress(
                signatureData.upload,
                selectedProof.file,
                setUploadProgress
            );

            if (!cloudinaryResult?.public_id) {
                throw new Error("Cloudinary did not return a valid file reference.");
            }

            toastSuccess("Payment proof uploaded successfully.");

            const response = await fetch(
                `${backendUrl}/api/user/vyawastha/payment`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        payerName,
                        utrNumber,
                        paymentProof: {
                            publicId: cloudinaryResult.public_id,
                            originalFilename: selectedProof.originalFilename,
                            format: selectedProof.format,
                        },
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to submit payment"
                );
            }

            toastSuccess(data.message || "Payment submitted for verification.");

            localStorage.removeItem(draftKey);

            setForm({ payerName: "", utrNumber: "" });

            setSelectedProof(null);
            setUploadProgress(0);

            await loadPaymentInfo();
        } catch (error) {
            toastError(error.message || "Unable to submit payment.");
        } finally {
            setSubmitting(false);
        }
    };


    // ==========================================================
    // LOADING
    // ==========================================================

    if (loading) {
        return (
            <main className="grid min-h-screen place-items-center bg-[var(--ljka-bg)]">
                <p className="text-[var(--ljka-primary)]">
                    Loading Vywastha Shulk...
                </p>
            </main>
        );
    }

    // ==========================================================
    // PAYMENT STATUS
    // ==========================================================

    const membershipStatus = paymentInfo?.paymentStatus;
    const existingPayment = paymentInfo?.existingPayment;
    const paymentHistory = paymentInfo?.paymentHistory || [];

    const hasSubmittedPayment = Boolean(existingPayment);

    const isPaid = membershipStatus === "paid";
    const firstVyawasthaShulkWaived = Boolean(
        paymentInfo?.firstVyawasthaShulkWaived
    );

    const isPending =
        existingPayment?.paymentStatus === "pending";

    const isRejected =
        existingPayment?.paymentStatus === "rejected";


    // ==========================================================
    // FORM VALIDATION
    // ==========================================================

    const validUtr =
        /^[A-Za-z0-9][A-Za-z0-9\-/:._]{5,31}$/.test(
            form.utrNumber.trim()
        );

    const validName =
        form.payerName.trim().length >= 3;

    const canSubmit =
        validName &&
        validUtr &&
        Boolean(selectedProof) &&
        !proofPreparing &&
        !submitting &&
        !isPaid &&
        !isPending;


    return (
        <main className="min-h-screen bg-[var(--ljka-bg)] px-4 py-10 sm:px-6 lg:py-14">
            <section className="mx-auto max-w-5xl">

                {/* ====================================================
            HEADER
        ==================================================== */}

                <div className="mb-7">

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold-dark)]">
                        LJKA Membership
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-[var(--ljka-primary)] sm:text-4xl">
                        Vywastha Shulk
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ljka-muted)]">
                        Pay your annual Vywastha Shulk and submit
                        your transaction details for verification.
                    </p>

                </div>

                <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#efd997] bg-[#fffaf0] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--ljka-gold-dark)]">Annual membership fee</p>
                        <p className="mt-1 text-sm font-semibold text-[var(--ljka-primary)]">पहले 1,100 सदस्यों के लिए ₹251। उसके बाद नए सदस्यों के लिए ₹365 वार्षिक शुल्क।</p>
                    </div>
                    <span className="w-fit shrink-0 rounded-full bg-[var(--ljka-primary)] px-3 py-1.5 text-xs font-bold text-white">₹251 → ₹365</span>
                </section>


                {/* ====================================================
            ALREADY VERIFIED
        ==================================================== */}

                {isPaid && (
                    <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">

                        <div className="flex gap-4">

                            <FaCheckCircle className="mt-1 shrink-0 text-xl text-green-600" />

                            <div>

                                <h2 className="font-bold text-green-800">
                                    {firstVyawasthaShulkWaived
                                        ? "First Vywastha Shulk Waived"
                                        : "Vywastha Shulk Verified"}
                                </h2>

                                <p className="mt-1 text-sm text-green-700">
                                    {firstVyawasthaShulkWaived
                                        ? "Your valid referral code waived your first Vywastha Shulk. Your membership is active from the day your KYC was completed."
                                        : "Your annual membership payment has been verified successfully."}
                                </p>

                                <p className="mt-2 text-sm font-semibold text-green-800">
                                    Membership status: Active
                                </p>
                                {getMembershipExpiry() ? (
                                    <p className="mt-1 text-sm font-semibold text-green-800">
                                        Membership valid until{" "}
                                        {new Date(getMembershipExpiry()).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                ) : (
                                    <p className="mt-1 text-sm text-green-700">
                                        Your payment is verified. The expiry date has not been provided by the server yet.
                                    </p>
                                )}

                            </div>

                        </div>

                    </div>
                )}


                {/* ====================================================
            PAYMENT PENDING
        ==================================================== */}

                {/* ====================================================
    PAYMENT REQUIRED
==================================================== */}

                {!isPaid && !hasSubmittedPayment && (
                    <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                        <div className="flex gap-4">
                            <FaQrcode className="mt-1 shrink-0 text-xl text-blue-600" />

                            <div>
                                <h2 className="font-bold text-blue-800">
                                    Vywastha Shulk Payment Required
                                </h2>

                                <p className="mt-1 text-sm text-blue-700">
                                    You have not submitted your annual Vywastha
                                    Shulk payment yet. Please complete the payment
                                    using the QR code below and then enter your UTR
                                    number for verification.
                                </p>
                            </div>
                        </div>
                    </div>
                )}


                {/* ====================================================
    PAYMENT VERIFICATION PENDING
==================================================== */}

                {isPending && (
                    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                        <div className="flex gap-4">
                            <FaClock className="mt-1 shrink-0 text-xl text-amber-600" />

                            <div>
                                <h2 className="font-bold text-amber-800">
                                    Payment Verification Pending
                                </h2>

                                <p className="mt-1 text-sm text-amber-700">
                                    Your payment details have been submitted and
                                    are currently waiting for verification.
                                </p>

                                {existingPayment?.utrNumber && (
                                    <p className="mt-2 text-xs font-semibold text-amber-800">
                                        Submitted UTR: {existingPayment.utrNumber}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}


                {/* ====================================================
    PAYMENT REJECTED
==================================================== */}

                {isRejected && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                        <div className="flex gap-4">
                            <FaTimesCircle className="mt-1 shrink-0 text-xl text-red-600" />

                            <div>
                                <h2 className="font-bold text-red-800">
                                    Payment Verification Rejected
                                </h2>

                                <p className="mt-1 text-sm text-red-700">
                                    Your previous payment submission could not
                                    be verified. Please make the payment again
                                    if required and submit the new UTR number.
                                </p>

                                {existingPayment?.rejectionReason && (
                                    <p className="mt-2 text-sm font-semibold text-red-800">
                                        Reason: {existingPayment.rejectionReason}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {paymentHistory.length > 0 && (
                    <section className="mb-6 overflow-hidden rounded-2xl border border-[var(--ljka-border-light)] bg-white shadow-sm">
                        <div className="border-b border-[var(--ljka-border-light)] bg-[var(--ljka-primary-bg)] px-5 py-4">
                            <h2 className="font-bold text-[var(--ljka-primary)]">Payment History</h2>
                            <p className="mt-1 text-sm text-[var(--ljka-muted)]">Your submitted Vywastha Shulk payments and their verification status.</p>
                        </div>
                        <div className="divide-y divide-[var(--ljka-border-light)]">
                            {paymentHistory.map((payment) => {
                                const statusClass = payment.paymentStatus === "verified"
                                    ? "bg-green-100 text-green-800"
                                    : payment.paymentStatus === "rejected"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-amber-100 text-amber-800";
                                const statusLabel = payment.paymentStatus === "verified"
                                    ? "Approved"
                                    : payment.paymentStatus === "rejected"
                                        ? "Rejected"
                                        : "Pending";
                                return (
                                    <div key={payment.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-semibold text-[var(--ljka-primary)]">UTR: {payment.utrNumber}</p>
                                            <p className="mt-1 text-xs text-[var(--ljka-muted)]">Submitted {new Date(payment.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} · ₹{payment.amount}</p>
                                            {payment.paymentStatus === "rejected" && payment.rejectionReason && (
                                                <p className="mt-2 text-sm text-red-700">Reason: {payment.rejectionReason}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>{statusLabel}</span>
                                            {payment.paymentStatus === "verified" && (
                                                <button
                                                    type="button"
                                                    onClick={() => downloadReceipt(payment)}
                                                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-3 py-2 text-xs font-bold text-white transition hover:bg-[var(--ljka-primary-dark)]"
                                                >
                                                    <FaDownload /> Download receipt
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}


                {!isPaid && !isPending && (
                <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">


                    {/* ==================================================
              QR CARD
          ================================================== */}

                    <section className="rounded-3xl border border-[var(--ljka-border-light)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">

                        <div className="flex items-center gap-3">

                            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--ljka-primary-bg)] text-xl text-[var(--ljka-primary)]">
                                <FaQrcode />
                            </span>

                            <div>
                                <h2 className="font-bold text-[var(--ljka-primary)]">
                                    Pay Vywastha Shulk
                                </h2>

                                <p className="text-xs text-[var(--ljka-muted)]">
                                    Scan the QR code to make payment
                                </p>
                            </div>

                        </div>


                        <div className="mt-6 flex justify-center rounded-2xl border bg-white p-5">

                            <img
                                src="/img/265 QR.jpeg"
                                alt="Vywastha Shulk Payment QR Code"
                                className="h-64 w-64 object-contain sm:h-72 sm:w-72"
                            />

                        </div>


                        {paymentInfo?.amount > 0 && (
                            <div className="mt-5 rounded-xl bg-[var(--ljka-primary-bg)] p-4 text-center">

                                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ljka-muted)]">
                                    Annual Vywastha Shulk
                                </p>

                                <p className="mt-1 text-3xl font-bold text-[var(--ljka-primary)]">
                                    ₹{paymentInfo.amount}
                                </p>

                            </div>
                        )}


                        <a
                            href="/img/265 QR.jpeg"
                            download="LJKA-Vywastha-Shulk-QR.jpeg"
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--ljka-primary)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--ljka-primary-dark)]"
                        >
                            <FaDownload />
                            Download QR
                        </a>


                        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">

                            <strong>Important:</strong>{" "}
                            Complete the payment first. Then enter the
                            exact transaction / UTR number shown by your
                            bank or UPI app.

                        </div>

                    </section>


                    {/* ==================================================
              FORM CARD
          ================================================== */}

                    <section className="rounded-3xl border border-[var(--ljka-border-light)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">

                        <div>

                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ljka-gold-dark)]">
                                Payment Verification
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-[var(--ljka-primary)]">
                                Submit Payment Details
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[var(--ljka-muted)]">
                                Enter your name and UTR / transaction
                                reference number after completing payment.
                            </p>

                        </div>


                        {!isPaid && !isPending && (
                            <form
                                onSubmit={submitPayment}
                                onKeyDown={(event) => {
                                    // Keep the form click-to-submit only. Mobile keyboards and
                                    // barcode/UTR entry can emit Enter while the member is typing.
                                    if (event.key === "Enter") event.preventDefault();
                                }}
                                className="mt-7 space-y-5"
                            >
                                {/* NAME */}

                                <label className="block text-sm font-semibold text-[var(--ljka-primary)]">
                                    Name

                                    <input
                                        type="text"
                                        required
                                        value={form.payerName}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                payerName: event.target.value.toUpperCase(),
                                            })
                                        }
                                        placeholder="Enter payer name"
                                        className="mt-2 w-full rounded-xl border border-[var(--ljka-border)] bg-white p-3.5 outline-none transition focus:border-[var(--ljka-primary)]"
                                    />
                                </label>


                                {/* UTR */}

                                <label className="block text-sm font-semibold text-[var(--ljka-primary)]">
                                    Transaction / UTR Number

                                    <input
                                        type="text"
                                        required
                                        value={form.utrNumber}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                utrNumber: event.target.value.toUpperCase(),
                                            })
                                        }
                                        placeholder="Enter UTR / transaction number"
                                        className="mt-2 w-full rounded-xl border border-[var(--ljka-border)] bg-white p-3.5 uppercase outline-none transition focus:border-[var(--ljka-primary)]"
                                    />

                                    <span className="mt-2 block text-xs font-normal text-[var(--ljka-muted)]">
                                        Complete the payment first, then enter the exact
                                        UTR / transaction number shown by your bank or UPI app.
                                    </span>
                                </label>

                                {/* PAYMENT PROOF UPLOAD */}

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[var(--ljka-primary)]">
                                        Upload Payment Screenshot / Receipt
                                    </label>

                                    <input
                                        id="vyawastha-payment-proof"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf"
                                        disabled={submitting || proofPreparing}
                                        onChange={handleProofSelection}
                                        className="hidden"
                                    />

                                    {proofPreparing ? (
                                        <div className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-[var(--ljka-border)] bg-white px-4 py-7 text-center shadow-sm">
                                            <div className="relative mb-3 h-11 w-11">
                                                <div className="absolute inset-0 animate-spin rounded-full border-4 border-[var(--ljka-border)] border-t-[var(--ljka-primary)]" />
                                                <div className="absolute inset-2 rounded-full bg-[var(--ljka-primary-bg)]" />
                                            </div>
                                            <p className="text-sm font-bold text-[var(--ljka-primary)]">Checking your file</p>
                                            <p className="mt-1 text-xs text-[var(--ljka-muted)]">Please wait while we prepare the preview...</p>
                                        </div>
                                    ) : !selectedProof ? (
                                        <label
                                            htmlFor="vyawastha-payment-proof"
                                            className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--ljka-border)] bg-[var(--ljka-primary-bg)] px-4 py-8 text-center transition hover:border-[var(--ljka-primary)] hover:bg-white"
                                        >
                                            <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white text-[var(--ljka-primary)] shadow-sm transition group-hover:scale-105">
                                                <FaDownload className="text-xl" />
                                            </span>
                                            <span className="text-sm font-bold text-[var(--ljka-primary)]">
                                                Choose screenshot or receipt
                                            </span>
                                            <span className="mt-1 text-xs font-normal text-[var(--ljka-muted)]">
                                                JPG, JPEG, PNG, WEBP or PDF · Maximum 1 MB · One file only
                                            </span>
                                        </label>
                                    ) : (
                                        <div className="rounded-xl border border-[var(--ljka-border)] p-3">
                                            <div className="flex items-center gap-3">
                                                {selectedProof.isPdf ? (
                                                    <div className="grid h-20 w-16 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600">
                                                        <FaFilePdf className="text-3xl" />
                                                        <span className="text-[10px] font-bold">PDF</span>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={selectedProof.previewUrl}
                                                        alt="Payment proof preview"
                                                        className="h-20 w-20 shrink-0 rounded-lg border object-contain"
                                                    />
                                                )}

                                                <div className="min-w-0 flex-1">
                                                    <p className="break-all text-sm font-semibold text-[var(--ljka-primary)]">
                                                        {selectedProof.originalFilename}
                                                    </p>
                                                    <p className="mt-1 text-xs text-[var(--ljka-muted)]">
                                                        {(selectedProof.file.size / 1024).toFixed(0)} KB · {selectedProof.format.toUpperCase()}
                                                    </p>
                                                    {selectedProof.isPdf && (
                                                        <a
                                                            href={selectedProof.previewUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[var(--ljka-primary)] underline"
                                                        >
                                                            <FaEye /> Preview PDF
                                                        </a>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={removeSelectedProof}
                                                    disabled={submitting}
                                                    aria-label="Remove selected payment proof"
                                                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>

                                            {submitting && (
                                                <div className="mt-4 flex items-center gap-3">
                                                    <div
                                                        className="grid h-12 w-12 shrink-0 place-items-center rounded-full"
                                                        style={{
                                                            background: `conic-gradient(var(--ljka-primary) ${uploadProgress}%, #e5e7eb ${uploadProgress}%)`,
                                                        }}
                                                    >
                                                        <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-[10px] font-bold text-[var(--ljka-primary)]">
                                                            {uploadProgress}%
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-semibold text-[var(--ljka-primary)]">
                                                            Uploading payment proof
                                                        </p>
                                                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                                                            <div
                                                                className="h-full rounded-full bg-[var(--ljka-primary)] transition-all"
                                                                style={{ width: `${uploadProgress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <p className="text-xs font-normal text-[var(--ljka-muted)]">
                                        Accepted files: JPG, JPEG, PNG, WEBP and PDF only. Maximum 1 MB. Images are compressed before upload; keep the UTR, amount and transaction date readable.
                                    </p>
                                </div>


                                {/* SUBMIT */}

                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="w-full rounded-xl bg-[var(--ljka-primary)] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--ljka-primary-dark)] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {proofPreparing
                                        ? "Preparing proof..."
                                        : submitting
                                            ? uploadProgress < 100
                                                ? "Uploading proof..."
                                                : "Submitting..."
                                            : "Submit for Verification"}
                                </button>
                            </form>
                        )}

                        <div className="mt-6 flex gap-2 text-xs leading-5 text-[var(--ljka-muted)]">

                            <FaShieldAlt className="mt-0.5 shrink-0 text-[var(--ljka-primary)]" />

                            <p>
                                Payment status changes to paid only after
                                LJKA administration verifies the transaction.
                            </p>

                        </div>

                    </section>

                </div>
                )}

            </section>

        </main>
    );
};

export default VyawasthaShulk;
