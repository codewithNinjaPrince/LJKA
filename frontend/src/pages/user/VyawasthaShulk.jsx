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

import { LJKAContext } from "../../context/LJKAContext";


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

    const [message, setMessage] =
        useState("");

    const [messageType, setMessageType] =
        useState("info");


    const headers = {
        Authorization: `Bearer ${token}`,
        token,
        "Content-Type": "application/json",
    };


    // ==========================================================
    // LOAD PAYMENT INFORMATION
    // ==========================================================

    const loadPaymentInfo = async () => {
        try {
            setLoading(true);
            setMessage("");

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
            setMessage(
                error.message ||
                "Unable to load Vywastha payment."
            );
            setMessageType("error");
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

    const downloadReceipt = async (payment) => {
        try {
            const document = new jsPDF({ unit: "mm", format: "a4" });
            const logoResponse = await fetch("/img/Lakhdatar_Logo.png");
            const logoBlob = await logoResponse.blob();
            const logoDataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(logoBlob);
            });

            document.setFillColor(120, 8, 28);
            document.rect(0, 0, 210, 35, "F");
            document.addImage(logoDataUrl, "PNG", 14, 6, 22, 22);
            document.setTextColor(255, 255, 255);
            document.setFont("helvetica", "bold");
            document.setFontSize(17);
            document.text("LAKHDATAR JEEVAN KALYAN ASSOCIATION", 42, 17);
            document.setFontSize(10);
            document.setFont("helvetica", "normal");
            document.text("Vyawastha Shulk Payment Receipt", 42, 24);

            document.saveGraphicsState();
            document.setGState(new document.GState({ opacity: 0.08 }));
            document.addImage(logoDataUrl, "PNG", 55, 82, 100, 100);
            document.restoreGraphicsState();

            document.setTextColor(40, 40, 40);
            document.setFont("helvetica", "bold");
            document.setFontSize(15);
            document.text("PAYMENT RECEIPT", 105, 49, { align: "center" });

            const details = [
                ["Receipt reference", String(payment.id || "-")],
                ["Payment made to", "Lakhdatar Jeevan Kalyan Association (LJKA)"],
                ["Payment purpose", "Annual Vyawastha Shulk"],
                ["Amount received", `INR ${Number(payment.amount || 0).toLocaleString("en-IN")}`],
                ["UTR / transaction reference", payment.utrNumber || "-"],
                ["Paid by", payment.payerName || memberInfo.fullName || "-"],
                ["Verified on", formatReceiptDate(payment.verifiedAt)],
                ["Membership valid until", formatReceiptDate(payment.membershipExpiresAt)],
            ];

            let y = 60;
            details.forEach(([label, value], index) => {
                document.setFillColor(index % 2 ? 255 : 253, index % 2 ? 255 : 247, index % 2 ? 255 : 240);
                document.roundedRect(15, y - 6, 180, 11, 1.5, 1.5, "F");
                document.setTextColor(105, 80, 80);
                document.setFont("helvetica", "bold");
                document.setFontSize(9);
                document.text(label, 19, y);
                document.setTextColor(35, 35, 35);
                document.setFont("helvetica", "normal");
                document.text(String(value), 92, y, { maxWidth: 98 });
                y += 13;
            });

            y += 5;
            document.setTextColor(120, 8, 28);
            document.setFont("helvetica", "bold");
            document.setFontSize(11);
            document.text("Member details", 15, y);
            y += 8;
            const memberDetails = [
                ["Name", memberInfo.fullName || "-"],
                ["Member ID", memberInfo.memberId || "-"],
                ["Mobile", memberInfo.mobile || "-"],
                ["Email", memberInfo.email || "-"],
                ["Address", getAddress()],
            ];
            memberDetails.forEach(([label, value]) => {
                document.setTextColor(105, 80, 80);
                document.setFont("helvetica", "bold");
                document.setFontSize(9);
                document.text(label, 19, y);
                document.setTextColor(35, 35, 35);
                document.setFont("helvetica", "normal");
                const lines = document.splitTextToSize(String(value), 120);
                document.text(lines, 65, y);
                y += Math.max(7, lines.length * 5 + 2);
            });

            document.setDrawColor(216, 177, 90);
            document.line(15, 274, 195, 274);
            document.setTextColor(100, 100, 100);
            document.setFontSize(8);
            document.text("This is a system-generated LJKA receipt. No signature is required.", 105, 281, { align: "center" });
            document.save(`LJKA-Vyawastha-Receipt-${payment.utrNumber || payment.id}.pdf`);
        } catch (error) {
            console.error("Receipt download error:", error);
            setMessage("Unable to generate the receipt. Please try again.");
            setMessageType("error");
        }
    };


    // ==========================================================
    // SUBMIT
    // ==========================================================

    const submitPayment = async (event) => {
        event.preventDefault();

        if (!canSubmit) return;

        try {
            setSubmitting(true);
            setMessage("");

            const payerName = form.payerName.trim().toUpperCase();
            const utrNumber = form.utrNumber.trim().toUpperCase();

            const response = await fetch(
                `${backendUrl}/api/user/vyawastha/payment`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        payerName:
                            form.payerName.trim(),
                        utrNumber:
                            form.utrNumber.trim().toUpperCase(),
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to submit payment"
                );
            }

            setMessage(
                data.message ||
                "Payment submitted for verification."
            );

            setMessageType("success");

            setForm((current) => ({
                ...current,
                utrNumber: "",
            }));

            await loadPaymentInfo();
        } catch (error) {
            setMessage(
                error.message ||
                "Unable to submit payment."
            );

            setMessageType("error");
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

                                {paymentInfo.membershipExpiresAt && (
                                    <p className="mt-2 text-sm font-semibold text-green-800">
                                        Membership valid until{" "}
                                        {new Date(
                                            paymentInfo.membershipExpiresAt
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
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
                                    are currently waiting for admin verification.
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


                                {/* SUBMIT */}

                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="w-full rounded-xl bg-[var(--ljka-primary)] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--ljka-primary-dark)] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit for Verification"}
                                </button>

                                {!validName && (
                                    <p className="text-xs text-red-600">
                                        Enter your name to enable submission.
                                    </p>
                                )}

                                {validName && !validUtr && (
                                    <p className="text-xs text-red-600">
                                        Enter a valid UTR / transaction number to enable submission.
                                    </p>
                                )}
                            </form>
                        )}

                        {/* MESSAGE */}

                        {message && (
                            <div
                                className={`mt-5 rounded-xl p-4 text-sm ${messageType === "success"
                                    ? "bg-green-50 text-green-800"
                                    : "bg-red-50 text-red-700"
                                    }`}
                            >
                                {message}
                            </div>
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

            </section>

        </main>
    );
};

export default VyawasthaShulk;
