import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { LJKAContext } from "../../context/LJKAContext";

const DownloadIdCard = () => {
  const { user } = useContext(LJKAContext);

  const frontCardRef = useRef(null);
  const backCardRef = useRef(null);
  const [error, setError] = useState("");
  const [downloadRequested, setDownloadRequested] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);

  // Keep the desktop card artwork intact and scale the complete artwork as a
  // single unit on narrow screens. This avoids independently shrinking icons,
  // text and absolute-positioned sections.
  useEffect(() => {
    const updateScale = () => setPreviewScale(Math.min(1, Math.max(0.35, (window.innerWidth - 32) / 520)));
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const membershipPaid =
    user?.membershipPaymentStatus === "paid";

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

  const [qr, setQr] = useState("");

  useEffect(() => {
    if (!qrData) return;

    QRCode.toDataURL(qrData, {
      width: 400,
      margin: 1,
      errorCorrectionLevel: "H",
    })
      .then(setQr)
      .catch((err) => console.error("QR GENERATION ERROR:", err));
  }, [qrData]);

  const waitForImages = async (element) => {
    const images = Array.from(element.querySelectorAll("img"));

    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve();
              return;
            }

            const done = () => {
              img.removeEventListener("load", done);
              img.removeEventListener("error", done);
              resolve();
            };

            img.addEventListener("load", done);
            img.addEventListener("error", done);
          })
      )
    );
  };

  // Preview cards live inside a scaled mobile container. PDF capture must not
  // inherit that transform, so each card is cloned onto an unscaled 520px
  // surface before html2canvas renders it.
  const captureFullSizeCard = async (card) => {
    const surface = document.createElement("div");
    const clone = card.cloneNode(true);
    surface.style.cssText = "position:fixed;left:-10000px;top:0;width:520px;height:328px;overflow:hidden;background:#fff;transform:none;z-index:-1;";
    clone.style.width = "520px";
    clone.style.height = `${520 / 1.586}px`;
    clone.style.transform = "none";
    surface.appendChild(clone);
    document.body.appendChild(surface);

    try {
      await waitForImages(clone);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      return await html2canvas(clone, {
        scale: 4,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 15000,
        removeContainer: true,
        windowWidth: 520,
        windowHeight: 328,
      });
    } finally {
      surface.remove();
    }
  };

  useEffect(() => {
    if (!user || !frontCardRef.current || !backCardRef.current || !qr) return;
    if (!downloadRequested) return;

    let cancelled = false;

    const autoDownload = async () => {
      try {
        if (cancelled) return;

        const frontCanvas = await captureFullSizeCard(frontCardRef.current);
        const backCanvas = await captureFullSizeCard(backCardRef.current);

        if (cancelled) return;

        const frontImage = frontCanvas.toDataURL("image/png", 1.0);
        const backImage = backCanvas.toDataURL("image/png", 1.0);

        // A4 portrait page.
        // Both the front and back card are placed on the SAME A4 page.
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          compress: true,
        });

        const a4Width = 210;
        const a4Height = 297;

        // Standard ID-1 card size.
        const cardWidth = 85.6;
        const cardHeight = 54;

        const x = (a4Width - cardWidth) / 2;

        // Front and back cards stacked vertically on the A4 page.
        const frontY = 82;
        const backY = 161;

        pdf.addImage(
          frontImage,
          "PNG",
          x,
          frontY,
          cardWidth,
          cardHeight,
          undefined,
          "FAST"
        );

        pdf.addImage(
          backImage,
          "PNG",
          x,
          backY,
          cardWidth,
          cardHeight,
          undefined,
          "FAST"
        );

        const safeName =
          user?.fullName
            ?.replace(/[^a-z0-9]/gi, "_")
            ?.toLowerCase() || "member";

        pdf.save(`LJKA_ID_CARD_${safeName}.pdf`);

        // Keep the preview open in the current tab and restore the button.
        setTimeout(() => {
          setDownloadRequested(false);
        }, 300);
      } catch (err) {
        console.error("ID CARD AUTO DOWNLOAD ERROR:", err);
        setError(
          "Unable to download the ID card automatically. Please go back and try again."
        );
      }
    };

    autoDownload();

    return () => {
      cancelled = true;
    };
  }, [user, qr, downloadRequested]);

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "Arial, sans-serif",
          background: "#ffffff",
        }}
      >
        <p style={{ color: "#555", textAlign: "center", maxWidth: 420 }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        aria-label="ID card preview"
        style={{
          position: "relative",
          margin: "0 auto",
          padding: "32px 16px",
          width: "100%",
          maxWidth: "520px",
          boxSizing: "border-box",
        }}
      >
        <div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-[var(--ljka-gold-dark)]">LJKA</p><h1 className="text-2xl font-bold text-[var(--ljka-primary)]">ID Card</h1></div><button type="button" onClick={() => setDownloadRequested(true)} disabled={downloadRequested} className="rounded-lg bg-[var(--ljka-primary)] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{downloadRequested ? "Preparing download…" : "Download ID Card"}</button></div>
        <div style={{ height: `${(520 / 1.586 * 2 + 20) * previewScale}px` }}><div style={{ width: "520px", transform: `scale(${previewScale})`, transformOrigin: "top left" }}>
        {/* ================= FRONT CARD ================= */}
        <div
          ref={frontCardRef}
          style={{
            width: "520px",
            height: `${520 / 1.586}px`,
            position: "relative",
            overflow: "hidden",
            background: "#ffffff",
            borderRadius: "22px",
          }}
          className="relative overflow-hidden rounded-[22px] bg-white shadow-2xl"
        >
          <div className="absolute inset-x-0 top-0 h-[28%] bg-[var(--ljka-primary)]">
            <div className="absolute inset-0 opacity-[0.07]">
              <img
                src="/img/Lakhdatar_Logo.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <div className="relative flex h-full items-center px-5">
              <img
                src="/img/Lakhdatar_Logo.png"
                alt="LJKA"
                crossOrigin="anonymous"
                className="h-16 w-16 object-contain"
              />

              <div className="ml-3 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
                  Official Member Identity Card
                </p>

                <h2 className="mt-1 text-base font-extrabold leading-tight">
                  Lakhdatar Jeevan
                </h2>

                <h2 className="text-base font-extrabold leading-tight">
                  Kalyan Association
                </h2>
              </div>
            </div>
          </div>

          <img
            src="/img/Lakhdatar_Logo.png"
            alt=""
            crossOrigin="anonymous"
            className="pointer-events-none absolute left-1/2 top-[58%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.045]"
          />

          <div className="absolute left-5 top-[34%]">
            <div className="flex h-[118px] w-[92px] items-center justify-center overflow-hidden rounded-xl border-2 border-[var(--ljka-gold)] bg-white shadow-md">
              <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--ljka-primary-bg)] px-2">
                <img
                  src="/img/Lakhdatar_Logo.png"
                  alt="LJKA Member"
                  crossOrigin="anonymous"
                  className="h-16 w-16 object-contain"
                />

                <p className="mt-2 text-[7px] font-extrabold uppercase tracking-[0.14em] text-[var(--ljka-primary)]">
                  LJKA MEMBER
                </p>
              </div>
            </div>

          </div>

          <div className="absolute left-[31%] right-4 top-[34%]">
            <div className="mb-2">
              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-gray-400">
                Member Name
              </p>

              <p className="truncate text-lg font-extrabold text-[var(--ljka-primary)]">
                {user.fullName || "—"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
              <div>
                <p className="text-[7px] font-bold uppercase text-gray-400">
                  Member ID
                </p>
                <p className="text-[11px] font-extrabold text-[var(--ljka-primary)]">
                  {user.memberId || "—"}
                </p>
              </div>

              <div>
                <p className="text-[7px] font-bold uppercase text-gray-400">
                  Gender
                </p>
                <p className="text-[11px] font-semibold capitalize text-gray-700">
                  {user.gender || "—"}
                </p>
              </div>

              <div>
                <p className="text-[7px] font-bold uppercase text-gray-400">
                  Date of Birth
                </p>
                <p className="text-[11px] font-semibold text-gray-700">
                  {formatDate(user.dob)}
                </p>
              </div>

              <div>
                <p className="text-[7px] font-bold uppercase text-gray-400">
                  Mobile
                </p>
                <p className="text-[11px] font-semibold text-gray-700">
                  {user.mobile || "—"}
                </p>
              </div>

              <div>
                <p className="text-[7px] font-bold uppercase text-gray-400">
                  State
                </p>
                <p className="truncate text-[11px] font-semibold text-gray-700">
                  {user.address?.stateName || "—"}
                </p>
              </div>

              <div>
                <p className="text-[7px] font-bold uppercase text-gray-400">
                  Employment
                </p>
                <p className="truncate text-[11px] font-semibold capitalize text-gray-700">
                  {user.employmentStatus || "—"}
                </p>
              </div>
            </div>
          </div>

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
                {membershipPaid ? "Valid Until" : "Membership"}
              </p>

              <p className="text-[10px] font-extrabold uppercase text-[var(--ljka-primary)]">
                {membershipPaid
                  ? formatDate(user?.membershipExpiresAt)
                  : "Payment Pending"}
              </p>
            </div>
          </div>
        </div>

        {/* ================= BACK CARD ================= */}
        <div
          ref={backCardRef}
          style={{
            width: "520px",
            height: `${520 / 1.586}px`,
            position: "relative",
            overflow: "hidden",
            background: "#ffffff",
            borderRadius: "22px",
            marginTop: "20px",
          }}
          className="relative overflow-hidden rounded-[22px] bg-white shadow-2xl"
        >
          <div className="h-[24%] bg-[var(--ljka-primary)] px-5 py-3">
            <div className="flex items-center gap-3">
              <img
                src="/img/Lakhdatar_Logo.png"
                alt="LJKA"
                crossOrigin="anonymous"
                className="h-10 w-10 object-contain"
              />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--ljka-gold)]">
                  Lakhdatar Jeevan Kalyan Association
                </p>

                <p className="text-[8px] text-white/70">
                  Member Verification & Identity
                </p>
              </div>
            </div>
          </div>

          <img
            src="/img/Lakhdatar_Logo.png"
            alt=""
            crossOrigin="anonymous"
            className="pointer-events-none absolute left-1/2 top-[58%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.045]"
          />

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

              <div className="flex flex-col items-center">
                {qr ? (
                  <img
                    src={qr}
                    alt="Member verification QR"
                    className="h-[72px] w-[72px]"
                  />
                ) : (
                  <div className="h-[72px] w-[72px] rounded bg-gray-100" />
                )}

                <p className="mt-1 text-center text-[6px] font-semibold uppercase text-gray-400">
                  Scan to verify
                </p>
              </div>
            </div>

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

            <p className="mt-3 text-[6.5px] leading-3 text-gray-400">
              This card is issued by Lakhdatar Jeevan Kalyan Association for
              identification of a registered member. This card remains the
              property of LJKA and may be withdrawn or invalidated according to
              applicable membership rules.
            </p>

            <div className="absolute bottom-[-34px] right-5 text-center">
              <div className="mb-1 w-20 border-b border-gray-400" />

              <p className="text-[6px] font-bold uppercase text-gray-400">
                Authorized Signatory
              </p>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[10%] bg-[var(--ljka-gold)] px-5">
            <div className="flex h-full items-center justify-between">
              <p className="text-[7px] font-bold text-[var(--ljka-primary)]">
                www.ljka.org
              </p>

              <p className="text-[7px] font-bold text-[var(--ljka-primary)]">
                Member ID: {user.memberId || "—"}
              </p>
            </div>
          </div>
        </div></div></div>
      </div>
    </>
  );
};

export default DownloadIdCard;
