import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { LJKAContext } from "../context/LJKAContext";
import axios from "axios";
import {
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaArrowRight,
  FaEnvelope,
  FaKey,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import { toastError, toastSuccess } from "../utils/toast";

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const passwordChecks = {
  length: (password) => password.length >= 6,
  letter: (password) => /[A-Za-z]/.test(password),
  number: (password) => /[0-9]/.test(password),
};

const normalizeEmail = (value) =>
  value ? value.replace(/\s+/g, "").toLowerCase() : "";

const ForgotPassword = () => {
  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  const { navigate, backendUrl } = useContext(LJKAContext);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;

    const timer = setInterval(
      () => setCooldown((previous) => Math.max(previous - 1, 0)),
      1000
    );

    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setResetToken("");
    setPassword("");
    setConfirmPassword("");
    sessionStorage.removeItem("ljka_reset_token");
  }, [email]);

  const passwordScore = Object.values(passwordChecks).filter((check) =>
    check(password)
  ).length;

  const sendOtp = async () => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      toastError("Email is required");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      toastError("Please enter a valid email address");
      return;
    }

    if (cooldown > 0 || otpLoading) return;

    try {
      setOtpLoading(true);

      await axios.post(
        `${backendUrl}/api/user/forgot-password/send-otp`,
        { email: normalizedEmail }
      );

      setOtp("");
      setOtpSent(true);
      setOtpVerified(false);
      setResetToken("");
      setCooldown(60);
      toastSuccess("Password reset code sent to your email 📩");
    } catch (error) {
      toastError(
        error?.response?.data?.message ||
          "Unable to send verification code"
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toastError("Please enter the verification code");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toastError("Verification code must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/user/forgot-password/verify-otp`,
        {
          email: normalizeEmail(email),
          otp,
        }
      );

      if (!response.data?.success || !response.data?.resetToken) {
        toastError(
          response.data?.message || "Invalid verification code"
        );
        return;
      }

      setResetToken(response.data.resetToken);
      setOtpVerified(true);
      sessionStorage.setItem(
        "ljka_reset_token",
        response.data.resetToken
      );
      toastSuccess("Email verified successfully ✅");
    } catch (error) {
      toastError(
        error?.response?.data?.message || "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (!resetToken) {
      toastError("Password reset session has expired");
      return;
    }

    if (!password) {
      toastError("Password is required");
      return;
    }

    if (passwordScore < 3) {
      toastError(
        "Password must be at least 6 characters and include a letter and a number"
      );
      return;
    }

    if (!confirmPassword) {
      toastError("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      toastError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/user/reset-password`,
        {
          resetToken,
          password,
          confirmPassword,
        }
      );

      if (!response.data?.success) {
        toastError(
          response.data?.message || "Unable to change password"
        );
        return;
      }

      sessionStorage.removeItem("ljka_reset_token");
      toastSuccess("Password changed successfully. Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      toastError(
        error?.response?.data?.message ||
          "Unable to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const step = otpVerified ? 3 : otpSent ? 2 : 1;

  return (
    <div className="min-h-[calc(100vh-130px)] bg-[var(--ljka-bg)] px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        {/* LEFT INFORMATION — SAME VISUAL LANGUAGE AS LOGIN */}
        <div className="hidden lg:block">
          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/40 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[var(--ljka-primary)] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--ljka-gold)]" />
              LJKA ACCOUNT SECURITY
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-[var(--ljka-primary)] xl:text-5xl">
              Secure your
              <span className="block text-[var(--ljka-gold)]">
                LJKA account
              </span>
            </h1>

            <p className="mt-5 text-base leading-7 text-[var(--ljka-muted)]">
              Forgot your password? Verify your registered email address
              and create a new password to get back to your LJKA membership.
            </p>

            <div className="mt-8 rounded-2xl border border-[var(--ljka-gold)]/30 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ljka-primary)] text-[var(--ljka-gold)]">
                  <FaShieldAlt />
                </div>
                <div>
                  <p className="font-semibold text-[var(--ljka-primary)]">
                    Secure Password Recovery
                  </p>
                  <p className="text-xs leading-5 text-[var(--ljka-muted)]">
                    Your password can only be changed after email OTP
                    verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[var(--ljka-primary)] px-5 py-4 text-white shadow-sm">
              <p className="text-xs uppercase tracking-[0.15em] text-white/50">
                LJKA Community
              </p>
              <p className="mt-1 text-sm font-semibold">
                Trust • Humanity • Cooperation
              </p>
              <p className="mt-1 text-xs text-white/60">
                Together for a stronger and caring society.
              </p>
            </div>
          </div>
        </div>

        {/* FORGOT PASSWORD CARD */}
        <section className="mx-auto w-full max-w-[560px] rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_15px_50px_rgba(5,27,50,0.10)] sm:p-7 lg:p-8">
          {/* MOBILE BRANDING */}
          <div className="mb-7 text-center lg:hidden">
            <div className="mx-auto flex h-15 w-15 items-center justify-center">
              <img
                src="/img/Lakhdatar_Logo.png"
                alt="Lakhdatar Jeevan Kalyan Association"
                className="h-15 w-15 object-contain"
              />
            </div>
            <h1 className="mt-3 text-2xl font-bold text-[var(--ljka-primary)]">
              Forgot Password?
            </h1>
            <p className="mt-1 text-sm text-[var(--ljka-muted)]">
              Recover access to your LJKA account
            </p>
          </div>

          {/* DESKTOP CARD TITLE */}
          <div className="mb-6 hidden lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
              Account Recovery
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[var(--ljka-primary)]">
              Reset your password
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--ljka-muted)]">
              Follow the steps below to securely reset your password.
            </p>
          </div>

          {/* STEP INDICATOR */}
          <div className="mb-7 grid grid-cols-3 gap-2">
            {[
              { number: 1, label: "Email" },
              { number: 2, label: "Verify OTP" },
              { number: 3, label: "New Password" },
            ].map((item) => {
              const complete = step > item.number;
              const active = step === item.number;

              return (
                <div key={item.number} className="min-w-0">
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      complete || active
                        ? "bg-[var(--ljka-primary)]"
                        : "bg-gray-200"
                    }`}
                  />
                  <p
                    className={`mt-2 truncate text-center text-[10px] font-semibold sm:text-xs ${
                      complete || active
                        ? "text-[var(--ljka-primary)]"
                        : "text-gray-400"
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="ljka-recovery-label" htmlFor="recovery-email">
                Registered Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="ljka-recovery-leading-icon" />
                <input
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(normalizeEmail(event.target.value))
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="ljka-recovery-input pl-10"
                  disabled={otpVerified}
                />
              </div>
            </div>

            {/* SEND OTP */}
            {!otpVerified && (
              <button
                type="button"
                onClick={sendOtp}
                disabled={otpLoading || cooldown > 0}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102b45] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {otpLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending verification code...
                  </>
                ) : cooldown > 0 ? (
                  `Resend OTP in ${cooldown}s`
                ) : (
                  <>
                    {otpSent ? "Resend Verification Code" : "Send Verification Code"}
                    <FaArrowRight className="text-xs text-[var(--ljka-gold)]" />
                  </>
                )}
              </button>
            )}

            {/* OTP */}
            {otpSent && !otpVerified && (
              <div className="rounded-xl border border-[var(--ljka-gold)]/30 bg-[var(--ljka-bg)] p-4 sm:p-5">
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--ljka-primary)] shadow-sm">
                    <FaKey />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--ljka-primary)]">
                      Check your inbox
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-[var(--ljka-muted)]">
                      Enter the 6-digit verification code sent to your email.
                    </p>
                  </div>
                </div>

                <label className="ljka-recovery-label" htmlFor="recovery-otp">
                  Verification Code
                </label>
                <input
                  id="recovery-otp"
                  type="text"
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  className="ljka-recovery-input text-center text-xl font-bold tracking-[0.55em]"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102b45] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Email
                      <FaArrowRight className="text-xs text-[var(--ljka-gold)]" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* VERIFIED */}
            {otpVerified && (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <FaCheckCircle className="shrink-0" />
                Email verified successfully
              </div>
            )}

            {/* NEW PASSWORD */}
            {otpVerified && (
              <>
                <div>
                  <label className="ljka-recovery-label" htmlFor="new-password">
                    New Password
                  </label>
                  <div className="relative">
                    <FaLock className="ljka-recovery-leading-icon" />
                    <input
                      id="new-password"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a new password"
                      autoComplete="new-password"
                      className="ljka-recovery-input pl-10 pr-12"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((visible) => !visible)}
                      aria-label={showPass ? "Hide password" : "Show password"}
                      className="ljka-recovery-eye"
                    >
                      {showPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {password && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {[
                        ["6+ characters", passwordChecks.length(password)],
                        ["A letter", passwordChecks.letter(password)],
                        ["A number", passwordChecks.number(password)],
                      ].map(([label, passed]) => (
                        <p
                          key={label}
                          className={`text-[10px] font-medium sm:text-xs ${
                            passed ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {passed ? "✓" : "•"} {label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label
                    className="ljka-recovery-label"
                    htmlFor="confirm-password"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <FaLock className="ljka-recovery-leading-icon" />
                    <input
                      id="confirm-password"
                      type={showPass2 ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Enter your new password again"
                      autoComplete="new-password"
                      className="ljka-recovery-input pl-10 pr-12"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass2((visible) => !visible)}
                      aria-label={
                        showPass2 ? "Hide password" : "Show password"
                      }
                      className="ljka-recovery-eye"
                    >
                      {showPass2 ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* CHANGE PASSWORD */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102b45] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      Change Password
                      <FaArrowRight className="text-xs text-[var(--ljka-gold)]" />
                    </>
                  )}
                </button>
              </>
            )}
          </form>

          {/* LOGIN LINK */}
          <div className="mt-7 border-t border-gray-100 pt-5 text-center">
            <p className="text-sm text-gray-500">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-[var(--ljka-primary)] transition hover:text-[var(--ljka-gold)]"
              >
                Back to Login
              </button>
            </p>
          </div>
        </section>
      </div>

      <style>{`
        .ljka-recovery-label {
          display: block;
          margin-bottom: 7px;
          font-size: 12px;
          font-weight: 600;
          color: var(--ljka-primary);
        }

        .ljka-recovery-input {
          width: 100%;
          border: 1px solid #d9dde3;
          border-radius: 9px;
          background: #fff;
          padding: 12px 13px;
          color: #172b3d;
          outline: none;
          font-size: 14px;
          transition: border-color .2s, box-shadow .2s;
        }

        .ljka-recovery-input::placeholder {
          color: #9ca3af;
          letter-spacing: normal;
          font-weight: 400;
        }

        .ljka-recovery-input:focus {
          border-color: var(--ljka-gold);
          box-shadow: 0 0 0 3px rgba(232, 200, 116, .14);
        }

        .ljka-recovery-input:disabled {
          background: #f8fafc;
          cursor: not-allowed;
          opacity: .75;
        }

        .ljka-recovery-leading-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #8994a1;
          font-size: 13px;
          pointer-events: none;
        }

        .ljka-recovery-eye {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #7b8794;
          padding: 5px;
          transition: color .2s;
        }

        .ljka-recovery-eye:hover {
          color: var(--ljka-primary);
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;


// import React, { useContext, useEffect, useState } from "react";
// import { LJKAContext } from "../context/LJKAContext";
// import axios from "axios";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { toastError, toastSuccess } from "../utils/toast";

// const isValidEmail = (value) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// const passwordChecks = {
//     length: (p) => p.length >= 6,
//     letter: (p) => /[A-Za-z]/.test(p),
//     number: (p) => /[0-9]/.test(p),
// };

// const normalizeEmail = (value) =>
//     value ? value.replace(/\s+/g, "").toLowerCase() : "";

// const ForgotPassword = () => {
//     const { navigate, backendUrl } = useContext(LJKAContext);

//     const [email, setEmail] = useState("");
//     const [otp, setOtp] = useState("");

//     const [otpSent, setOtpSent] = useState(false);
//     const [otpVerified, setOtpVerified] = useState(false);

//     const [resetToken, setResetToken] = useState("");

//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");

//     const [showPass, setShowPass] = useState(false);
//     const [showPass2, setShowPass2] = useState(false);

//     const [loading, setLoading] = useState(false);
//     const [otpLoading, setOtpLoading] = useState(false);
//     const [cooldown, setCooldown] = useState(0);

//     // Countdown
//     useEffect(() => {
//         if (cooldown <= 0) return;

//         const timer = setInterval(
//             () => setCooldown((prev) => Math.max(prev - 1, 0)),
//             1000
//         );

//         return () => clearInterval(timer);
//     }, [cooldown]);

//     // Reset OTP state when email changes
//     useEffect(() => {
//         setOtp("");
//         setOtpSent(false);
//         setOtpVerified(false);
//         setResetToken("");
//     }, [email]);

//     const passwordScore = Object.values(passwordChecks).filter((fn) =>
//         fn(password)
//     ).length;

//     // ==========================================
//     // SEND FORGOT PASSWORD OTP
//     // ==========================================

//     const sendOtp = async () => {
//         const normalizedEmail = normalizeEmail(email);

//         if (!normalizedEmail) {
//             toastError("Email is required");
//             return;
//         }

//         if (!isValidEmail(normalizedEmail)) {
//             toastError("Please enter a valid email address");
//             return;
//         }

//         if (cooldown > 0) return;

//         try {
//             setOtpLoading(true);

//             await axios.post(
//                 `${backendUrl}/api/user/forgot-password/send-otp`,
//                 { email: normalizedEmail }
//             );

//             setOtp("");
//             setOtpSent(true);
//             setOtpVerified(false);
//             setOtp("");
//             setCooldown(60);

//             toastSuccess("Password reset code sent to your email 📩");
//         } catch (err) {
//             toastError(
//                 err?.response?.data?.message ||
//                 "Unable to send verification code"
//             );
//         } finally {
//             setOtpLoading(false);
//         }
//     };

//     // ==========================================
//     // VERIFY OTP
//     // ==========================================

//     const verifyOtp = async () => {
//         if (!otp) {
//             toastError("Please enter the verification code");
//             return;
//         }

//         if (!/^\d{6}$/.test(otp)) {
//             toastError("Verification code must be 6 digits");
//             return;
//         }

//         try {
//             setLoading(true);

//             const res = await axios.post(
//                 `${backendUrl}/api/user/forgot-password/verify-otp`,
//                 {
//                     email: normalizeEmail(email),
//                     otp,
//                 }
//             );

//             if (!res.data?.success || !res.data?.resetToken) {
//                 toastError(res.data?.message || "Invalid verification code");
//                 return;
//             }

//             setResetToken(res.data.resetToken);
//             setOtpVerified(true);

//             // Keep only for this browser session
//             sessionStorage.setItem(
//                 "ljka_reset_token",
//                 res.data.resetToken
//             );

//             toastSuccess("Email verified successfully ✅");
//         } catch (err) {
//             toastError(
//                 err?.response?.data?.message ||
//                 "Verification failed"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ==========================================
//     // RESET PASSWORD
//     // ==========================================

//     const handleResetPassword = async (e) => {
//         e.preventDefault();

//         if (!resetToken) {
//             toastError("Password reset session has expired");
//             return;
//         }

//         if (!password) {
//             toastError("Password is required");
//             return;
//         }

//         if (passwordScore < 3) {
//             toastError(
//                 "Password must be at least 6 characters and include a letter and a number"
//             );
//             return;
//         }

//         if (!confirmPassword) {
//             toastError("Please confirm your password");
//             return;
//         }

//         if (password !== confirmPassword) {
//             toastError("Passwords do not match");
//             return;
//         }

//         try {
//             setLoading(true);

//             const res = await axios.post(
//                 `${backendUrl}/api/user/reset-password`,
//                 {
//                     resetToken,
//                     password,
//                     confirmPassword,
//                 }
//             );

//             if (!res.data?.success) {
//                 toastError(
//                     res.data?.message || "Unable to change password"
//                 );
//                 return;
//             }

//             sessionStorage.removeItem("ljka_reset_token");

//             toastSuccess(
//                 "Password changed successfully. Please login."
//             );

//             setTimeout(() => {
//                 navigate("/login");
//             }, 1200);
//         } catch (err) {
//             toastError(
//                 err?.response?.data?.message ||
//                 "Unable to change password. Please try again."
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ==========================================
//     // UI
//     // ==========================================

//     return (
//         <form
//             onSubmit={handleResetPassword}
//             className="
//         w-[92%] max-w-[420px] sm:max-w-[520px] mx-auto
//         mt-20 mb-20 sm:mt-22 sm:mb-22 lg:mt-26 lg:mb-26
//         bg-white/5 backdrop-blur-xl
//         border border-white/10 rounded-2xl
//         p-6 sm:p-8
//         shadow-2xl text-white
//         flex flex-col gap-4
//       "
//         >
//             <h2 className="text-3xl font-bold text-center tracking-wide">
//                 Forgot Password
//             </h2>

//             <p className="text-center text-gray-400 text-xs">
//                 Verify your email and create a new password
//             </p>

//             {/* EMAIL */}
//             <input
//                 type="email"
//                 value={email}
//                 onChange={(e) =>
//                     setEmail(normalizeEmail(e.target.value))
//                 }
//                 placeholder="Email address"
//                 className="dark-input"
//                 disabled={otpVerified}
//             />

//             {/* SEND OTP */}
//             {!otpVerified && (
//                 <button
//                     type="button"
//                     onClick={sendOtp}
//                     disabled={otpLoading || cooldown > 0}
//                     className={`primary-btn flex items-center justify-center gap-2
//             ${(otpLoading || cooldown > 0) &&
//                         "opacity-60 cursor-not-allowed"
//                         }`}
//                 >
//                     {otpLoading ? (
//                         <>
//                             <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
//                             Sending...
//                         </>
//                     ) : cooldown > 0 ? (
//                         `Resend in ${cooldown}s`
//                     ) : otpSent ? (
//                         "Resend OTP"
//                     ) : (
//                         "Send OTP"
//                     )}
//                 </button>
//             )}

//             {/* OTP */}
//             {otpSent && !otpVerified && (
//                 <div className="flex flex-col gap-2">
//                     <input
//                         value={otp}
//                         onChange={(e) =>
//                             setOtp(
//                                 e.target.value
//                                     .replace(/\D/g, "")
//                                     .slice(0, 6)
//                             )
//                         }
//                         placeholder="Enter 6-digit OTP"
//                         inputMode="numeric"
//                         maxLength={6}
//                         className="dark-input tracking-[6px] text-center text-lg"
//                         disabled={loading}
//                     />

//                     <button
//                         type="button"
//                         onClick={verifyOtp}
//                         disabled={loading || otp.length !== 6}
//                         className={`verify-btn
//               ${(loading || otp.length !== 6) &&
//                             "opacity-60 cursor-not-allowed"
//                             }`}
//                     >
//                         {loading ? "Verifying..." : "Verify OTP"}
//                     </button>
//                 </div>
//             )}

//             {/* VERIFIED */}
//             {otpVerified && (
//                 <p className="text-green-400 text-sm text-center">
//                     ✔ Email verified successfully
//                 </p>
//             )}

//             {/* PASSWORD SECTION */}
//             {otpVerified && (
//                 <>
//                     {/* NEW PASSWORD */}
//                     <div className="relative">
//                         <input
//                             type={showPass ? "text" : "password"}
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder="Create New Password"
//                             className="dark-input pr-11"
//                             disabled={loading}
//                         />

//                         <span
//                             onClick={() => setShowPass(!showPass)}
//                             className="eye-icon"
//                         >
//                             {showPass ? <FaEyeSlash /> : <FaEye />}
//                         </span>
//                     </div>

//                     {/* PASSWORD RULES */}
//                     {password && (
//                         <div className="grid grid-cols-3 gap-x-4 text-xs mt-1">
//                             <p
//                                 className={
//                                     passwordChecks.length(password)
//                                         ? "ok"
//                                         : "bad"
//                                 }
//                             >
//                                 • 6+ chars
//                             </p>

//                             <p
//                                 className={
//                                     passwordChecks.letter(password)
//                                         ? "ok"
//                                         : "bad"
//                                 }
//                             >
//                                 • Letter
//                             </p>

//                             <p
//                                 className={
//                                     passwordChecks.number(password)
//                                         ? "ok"
//                                         : "bad"
//                                 }
//                             >
//                                 • Number
//                             </p>
//                         </div>
//                     )}

//                     {/* CONFIRM PASSWORD */}
//                     <div className="relative">
//                         <input
//                             type={showPass2 ? "text" : "password"}
//                             value={confirmPassword}
//                             onChange={(e) =>
//                                 setConfirmPassword(e.target.value)
//                             }
//                             placeholder="Confirm New Password"
//                             className="dark-input pr-11"
//                             disabled={loading}
//                         />

//                         <span
//                             onClick={() => setShowPass2(!showPass2)}
//                             className="eye-icon"
//                         >
//                             {showPass2 ? <FaEyeSlash /> : <FaEye />}
//                         </span>
//                     </div>

//                     {/* CHANGE PASSWORD */}
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className={`primary-btn flex items-center justify-center gap-2
//               ${loading &&
//                             "opacity-60 cursor-not-allowed"
//                             }`}
//                     >
//                         {loading ? (
//                             <>
//                                 <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
//                                 Changing Password...
//                             </>
//                         ) : (
//                             "Change Password"
//                         )}
//                     </button>
//                 </>
//             )}

//             {/* LOGIN */}
//             <p
//                 className="text-center text-sm text-blue-500 font-medium cursor-pointer underline hover:text-blue-400 transition"
//                 onClick={() => navigate("/login")}
//             >
//                 Remember your password? Login
//             </p>

//             <style>{`
//         .dark-input {
//           width: 100%;
//           padding: 12px 14px;
//           border-radius: 10px;
//           background: rgba(0,0,0,0.6);
//           border: 1px solid rgba(255,255,255,0.12);
//           color: white;
//           outline: none;
//           transition: all 0.2s ease;
//         }

//         .dark-input:focus {
//           border-color: white;
//           background: rgba(0,0,0,0.8);
//         }

//         .dark-input:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .primary-btn {
//           width: 100%;
//           padding: 12px;
//           border-radius: 10px;
//           background: white;
//           color: black;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .primary-btn:hover {
//           background: #e5e5e5;
//           transform: translateY(-1px);
//         }

//         .verify-btn {
//           width: 100%;
//           padding: 14px;
//           border-radius: 10px;
//           background: #16a34a;
//           color: white;
//           font-weight: 700;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .verify-btn:hover {
//           background: #15803d;
//           transform: translateY(-1px);
//         }

//         .eye-icon {
//           position: absolute;
//           right: 14px;
//           top: 50%;
//           transform: translateY(-50%);
//           cursor: pointer;
//           color: #ccc;
//         }

//         .ok {
//           color: #22c55e;
//         }

//         .bad {
//           color: #ef4444;
//         }
//       `}</style>
//         </form>
//     );
// };

// export default ForgotPassword;