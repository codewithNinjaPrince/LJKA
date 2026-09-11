import React, { useContext, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { LJKAContext } from "../../context/LJKAContext";

const DownloadIdCard = () => {
  const { user } = useContext(LJKAContext);

  const frontCardRef = useRef(null);
  const backCardRef = useRef(null);

  const [downloading, setDownloading] = useState(false);

  const membershipPaid =
    user?.membershipPaymentStatus === "paid";

  const membershipStartDate = user?.membershipStartDate
    ? new Date(user.membershipStartDate)
    : null;

  const membershipExpiresAt = user?.membershipExpiresAt
    ? new Date(user.membershipExpiresAt)
    : null;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const qrData = useMemo(() => {
    if (!user?.memberId) return "";

    return `${window.location.origin}/verify-member/${user.memberId}`;
  }, [user?.memberId]);

  const generateQR = async () => {
    if (!qrData) return "";

    try {
      return await QRCode.toDataURL(qrData, {
        width: 400,
        margin: 1,
        errorCorrectionLevel: "H",
      });
    } catch (error) {
      console.error("QR GENERATION ERROR:", error);
      return "";
    }
  };

  const downloadIdCard = async () => {
    if (!frontCardRef.current || !backCardRef.current) return;

    try {
      setDownloading(true);

      const frontCanvas = await html2canvas(frontCardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const backCanvas = await html2canvas(backCardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const frontImage = frontCanvas.toDataURL("image/png");
      const backImage = backCanvas.toDataURL("image/png");

      /*
       * ID card ratio:
       * 85.6mm × 54mm
       */
      const cardWidth = 85.6;
      const cardHeight = 54;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [cardWidth, cardHeight],
      });

      pdf.addImage(
        frontImage,
        "PNG",
        0,
        0,
        cardWidth,
        cardHeight
      );

      pdf.addPage(
        [cardWidth, cardHeight],
        "landscape"
      );

      pdf.addImage(
        backImage,
        "PNG",
        0,
        0,
        cardWidth,
        cardHeight
      );

      const safeName =
        user?.fullName
          ?.replace(/[^a-z0-9]/gi, "_")
          ?.toLowerCase() || "member";

      pdf.save(`LJKA_ID_CARD_${safeName}.pdf`);
    } catch (error) {
      console.error("ID CARD DOWNLOAD ERROR:", error);
      alert("Unable to generate ID card. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const printIdCard = () => {
    window.print();
  };

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[var(--ljka-primary-bg)] px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <h2 className="text-xl font-bold text-[var(--ljka-primary)]">
            Unable to load member details
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Please login again and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--ljka-primary-bg)] px-4 py-8 sm:px-6 lg:px-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mx-auto max-w-6xl">

        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--ljka-gold-dark)]">
            LJKA Member Portal
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[var(--ljka-primary)] sm:text-3xl">
            Download Member ID Card
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Your official LJKA digital membership identity card.
            Download, save or print your ID card whenever required.
          </p>
        </div>

        {/* =====================================================
            MEMBERSHIP STATUS
        ====================================================== */}

        <div
          className={`mx-auto mb-8 max-w-3xl rounded-2xl border p-4 ${
            membershipPaid
              ? "border-green-200 bg-green-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex items-start gap-3">

            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                membershipPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {membershipPaid ? "✓" : "!"}
            </div>

            <div>
              <p
                className={`font-bold ${
                  membershipPaid
                    ? "text-green-800"
                    : "text-amber-800"
                }`}
              >
                {membershipPaid
                  ? "Membership Active"
                  : "Membership Inactive — Payment Pending"}
              </p>

              <p
                className={`mt-1 text-sm ${
                  membershipPaid
                    ? "text-green-700"
                    : "text-amber-700"
                }`}
              >
                {membershipPaid
                  ? `Valid from ${formatDate(
                      membershipStartDate
                    )} to ${formatDate(membershipExpiresAt)}.`
                  : "Your ID card is available as a digital preview, but membership benefits remain inactive until payment is completed."}
              </p>
            </div>

          </div>
        </div>

        {/* =====================================================
            CARDS
        ====================================================== */}

        <div className="flex flex-col items-center gap-8">

          {/* ================= FRONT ================= */}

          <div className="w-full overflow-x-auto pb-3">
            <div className="mx-auto w-[420px] min-w-[420px] sm:w-[520px] sm:min-w-[520px]">

              <div
                ref={frontCardRef}
                className="relative aspect-[1.586/1] w-full overflow-hidden rounded-[22px] bg-white shadow-2xl"
              >

                {/* TOP BRAND AREA */}

                <div className="absolute inset-x-0 top-0 h-[28%] bg-[var(--ljka-primary)]">

                  <div className="absolute inset-0 opacity-[0.07]">
                    <img
                      src="/img/Lakhdaatar_Logo.png"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="relative flex h-full items-center px-5">

                    <img
                      src="/img/Lakhdaatar_Logo.png"
                      alt="LJKA"
                      crossOrigin="anonymous"
                      className="h-14 w-14 object-contain sm:h-16 sm:w-16"
                    />

                    <div className="ml-3 text-white">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--ljka-gold)] sm:text-[10px]">
                        Official Member Identity Card
                      </p>

                      <h2 className="mt-1 text-sm font-extrabold leading-tight sm:text-base">
                        Lakhdaatar Jeevan
                      </h2>

                      <h2 className="text-sm font-extrabold leading-tight sm:text-base">
                        Kalyan Association
                      </h2>
                    </div>

                  </div>
                </div>

                {/* WATERMARK */}

                <img
                  src="/img/Lakhdaatar_Logo.png"
                  alt=""
                  crossOrigin="anonymous"
                  className="pointer-events-none absolute left-1/2 top-[58%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.045]"
                />

                {/* MEMBER PHOTO */}

                <div className="absolute left-5 top-[34%]">

                  <div className="flex h-[105px] w-[82px] items-center justify-center overflow-hidden rounded-xl border-2 border-[var(--ljka-gold)] bg-gray-100 shadow-md sm:h-[118px] sm:w-[92px]">

                    {user.photo || user.profilePhoto ? (
                      <img
                        src={user.photo || user.profilePhoto}
                        alt={user.fullName}
                        crossOrigin="anonymous"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-300">
                          {user.fullName?.charAt(0)?.toUpperCase()}
                        </div>

                        <p className="mt-1 text-[8px] font-semibold text-gray-400">
                          MEMBER
                        </p>
                      </div>
                    )}

                  </div>

                  <p className="mt-1 text-center text-[7px] font-semibold uppercase tracking-wide text-gray-400">
                    Member Photo
                  </p>

                </div>

                {/* MEMBER DETAILS */}

                <div className="absolute left-[31%] right-4 top-[34%]">

                  <div className="mb-2">

                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Member Name
                    </p>

                    <p className="truncate text-base font-extrabold text-[var(--ljka-primary)] sm:text-lg">
                      {user.fullName || "—"}
                    </p>

                  </div>

                  <div className="grid grid-cols-2 gap-x-5 gap-y-2">

                    <div>
                      <p className="text-[7px] font-bold uppercase text-gray-400">
                        Member ID
                      </p>

                      <p className="text-[10px] font-extrabold text-[var(--ljka-primary)] sm:text-[11px]">
                        {user.memberId || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[7px] font-bold uppercase text-gray-400">
                        Gender
                      </p>

                      <p className="text-[10px] font-semibold capitalize text-gray-700 sm:text-[11px]">
                        {user.gender || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[7px] font-bold uppercase text-gray-400">
                        Date of Birth
                      </p>

                      <p className="text-[10px] font-semibold text-gray-700 sm:text-[11px]">
                        {formatDate(user.dob)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[7px] font-bold uppercase text-gray-400">
                        Mobile
                      </p>

                      <p className="text-[10px] font-semibold text-gray-700 sm:text-[11px]">
                        {user.mobile || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[7px] font-bold uppercase text-gray-400">
                        State
                      </p>

                      <p className="truncate text-[10px] font-semibold text-gray-700 sm:text-[11px]">
                        {user.address?.stateName || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[7px] font-bold uppercase text-gray-400">
                        Employment
                      </p>

                      <p className="truncate text-[10px] font-semibold capitalize text-gray-700 sm:text-[11px]">
                        {user.employmentStatus || "—"}
                      </p>
                    </div>

                  </div>

                </div>

                {/* STATUS STRIP */}

                <div className="absolute inset-x-0 bottom-0 flex h-[15%] items-center justify-between bg-[var(--ljka-gold)] px-5">

                  <div>
                    <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-[var(--ljka-primary)]">
                      Membership Status
                    </p>

                    <p className="text-[11px] font-extrabold uppercase text-[var(--ljka-primary)]">
                      {membershipPaid ? "ACTIVE" : "INACTIVE"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-[var(--ljka-primary)]">
                      Valid Until
                    </p>

                    <p className="text-[10px] font-extrabold text-[var(--ljka-primary)]">
                      {membershipPaid
                        ? formatDate(membershipExpiresAt)
                        : "PAYMENT PENDING"}
                    </p>
                  </div>

                </div>

              </div>

              <p className="mt-3 text-center text-xs font-semibold text-gray-400">
                FRONT
              </p>

            </div>
          </div>

          {/* ================= BACK ================= */}

          <div className="w-full overflow-x-auto pb-3">
            <div className="mx-auto w-[420px] min-w-[420px] sm:w-[520px] sm:min-w-[520px]">

              <div
                ref={backCardRef}
                className="relative aspect-[1.586/1] w-full overflow-hidden rounded-[22px] bg-white shadow-2xl"
              >

                {/* BACK HEADER */}

                <div className="h-[24%] bg-[var(--ljka-primary)] px-5 py-3">

                  <div className="flex items-center gap-3">

                    <img
                      src="/img/Lakhdaatar_Logo.png"
                      alt="LJKA"
                      crossOrigin="anonymous"
                      className="h-10 w-10 object-contain"
                    />

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--ljka-gold)]">
                        Lakhdaatar Jeevan Kalyan Association
                      </p>

                      <p className="text-[8px] text-white/70">
                        Member Verification & Identity
                      </p>
                    </div>

                  </div>

                </div>

                {/* WATERMARK */}

                <img
                  src="/img/Lakhdaatar_Logo.png"
                  alt=""
                  crossOrigin="anonymous"
                  className="pointer-events-none absolute left-1/2 top-[58%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.045]"
                />

                {/* BACK CONTENT */}

                <div className="relative px-5 pt-4">

                  <div className="grid grid-cols-[1fr_90px] gap-4">

                    <div>

                      <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Member Address
                      </p>

                      <p className="mt-1 text-[9px] font-semibold leading-4 text-gray-700">
                        {user.address?.address || "—"}
                        {user.address?.townVillage
                          ? `, ${user.address.townVillage}`
                          : ""}
                        {user.address?.districtName
                          ? `, ${user.address.districtName}`
                          : ""}
                        {user.address?.stateName
                          ? `, ${user.address.stateName}`
                          : ""}
                        {user.address?.pincode
                          ? ` - ${user.address.pincode}`
                          : ""}
                      </p>

                      <div className="mt-3">

                        <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-gray-400">
                          Occupation
                        </p>

                        <p className="text-[9px] font-semibold text-gray-700">
                          {user.occupation || "—"}
                        </p>

                      </div>

                    </div>

                    {/* QR */}

                    <div className="flex flex-col items-center">

                      <QRCodeImage qrData={qrData} />

                      <p className="mt-1 text-center text-[6px] font-semibold uppercase text-gray-400">
                        Scan to verify
                      </p>

                    </div>

                  </div>

                  {/* EMERGENCY / NOMINEE */}

                  <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">

                    <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-gray-400">
                      Registered Nominee
                    </p>

                    <div className="mt-1 flex justify-between gap-4">

                      <p className="text-[9px] font-bold text-gray-700">
                        {user.nominee?.name || "—"}
                      </p>

                      <p className="text-[9px] font-semibold text-gray-600">
                        {user.nominee?.relationship || "—"}
                      </p>

                    </div>

                  </div>

                  {/* TERMS */}

                  <p className="mt-3 text-[6.5px] leading-3 text-gray-400">
                    This card is issued by Lakhdaatar Jeevan Kalyan
                    Association for identification of a registered member.
                    This card remains the property of LJKA and may be
                    withdrawn or invalidated according to applicable
                    membership rules.
                  </p>

                  {/* SIGNATURE */}

                  <div className="absolute bottom-[-34px] right-5 text-center">

                    <div className="mb-1 w-20 border-b border-gray-400" />

                    <p className="text-[6px] font-bold uppercase text-gray-400">
                      Authorized Signatory
                    </p>

                  </div>

                </div>

                {/* FOOTER */}

                <div className="absolute bottom-0 inset-x-0 h-[10%] bg-[var(--ljka-gold)] px-5">

                  <div className="flex h-full items-center justify-between">

                    <p className="text-[7px] font-bold text-[var(--ljka-primary)]">
                      www.ljka.org
                    </p>

                    <p className="text-[7px] font-bold text-[var(--ljka-primary)]">
                      Member ID: {user.memberId || "—"}
                    </p>

                  </div>

                </div>

              </div>

              <p className="mt-3 text-center text-xs font-semibold text-gray-400">
                BACK
              </p>

            </div>
          </div>

        </div>

        {/* =====================================================
            ACTIONS
        ====================================================== */}

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">

          <button
            type="button"
            onClick={downloadIdCard}
            disabled={downloading}
            className="rounded-xl bg-[var(--ljka-primary)] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[var(--ljka-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloading
              ? "Generating ID Card..."
              : "Download ID Card PDF"}
          </button>

          <button
            type="button"
            onClick={printIdCard}
            className="rounded-xl border border-[var(--ljka-primary)]/20 bg-white px-6 py-3.5 text-sm font-bold text-[var(--ljka-primary)] shadow-sm transition hover:bg-gray-50"
          >
            Print ID Card
          </button>

        </div>

        <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-5 text-gray-400">
          Keep your digital ID card secure. The QR code can be used
          to verify your LJKA membership information.
        </p>

      </div>

    </div>
  );
};


/* =========================================================
   QR CODE COMPONENT
========================================================= */

const QRCodeImage = ({ qrData }) => {
  const [qr, setQr] = useState("");

  React.useEffect(() => {
    if (!qrData) return;

    QRCode.toDataURL(qrData, {
      width: 300,
      margin: 0,
      errorCorrectionLevel: "H",
    })
      .then(setQr)
      .catch((error) =>
        console.error("QR ERROR:", error)
      );
  }, [qrData]);

  if (!qr) {
    return (
      <div className="h-[72px] w-[72px] animate-pulse rounded bg-gray-100" />
    );
  }

  return (
    <img
      src={qr}
      alt="Member verification QR"
      className="h-[72px] w-[72px]"
    />
  );
};

export default DownloadIdCard;