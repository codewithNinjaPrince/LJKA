import React, { useContext, useEffect, useState } from "react";
import { LJKAContext } from "../context/LJKAContext";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toastError, toastSuccess } from "../utils/toast";

const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const passwordChecks = {
    length: (p) => p.length >= 6,
    letter: (p) => /[A-Za-z]/.test(p),
    number: (p) => /[0-9]/.test(p),
};

const normalizeEmail = (value) =>
    value ? value.replace(/\s+/g, "").toLowerCase() : "";

const ForgotPassword = () => {
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

    // Countdown
    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(
            () => setCooldown((prev) => Math.max(prev - 1, 0)),
            1000
        );

        return () => clearInterval(timer);
    }, [cooldown]);

    // Reset OTP state when email changes
    useEffect(() => {
        setOtp("");
        setOtpSent(false);
        setOtpVerified(false);
        setResetToken("");
    }, [email]);

    const passwordScore = Object.values(passwordChecks).filter((fn) =>
        fn(password)
    ).length;

    // ==========================================
    // SEND FORGOT PASSWORD OTP
    // ==========================================

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

        if (cooldown > 0) return;

        try {
            setOtpLoading(true);

            await axios.post(
                `${backendUrl}/api/user/forgot-password/send-otp`,
                { email: normalizedEmail }
            );

            setOtp("");
            setOtpSent(true);
            setOtpVerified(false);
            setOtp("");
            setCooldown(60);

            toastSuccess("Password reset code sent to your email 📩");
        } catch (err) {
            toastError(
                err?.response?.data?.message ||
                "Unable to send verification code"
            );
        } finally {
            setOtpLoading(false);
        }
    };

    // ==========================================
    // VERIFY OTP
    // ==========================================

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

            const res = await axios.post(
                `${backendUrl}/api/user/forgot-password/verify-otp`,
                {
                    email: normalizeEmail(email),
                    otp,
                }
            );

            if (!res.data?.success || !res.data?.resetToken) {
                toastError(res.data?.message || "Invalid verification code");
                return;
            }

            setResetToken(res.data.resetToken);
            setOtpVerified(true);

            // Keep only for this browser session
            sessionStorage.setItem(
                "ljka_reset_token",
                res.data.resetToken
            );

            toastSuccess("Email verified successfully ✅");
        } catch (err) {
            toastError(
                err?.response?.data?.message ||
                "Verification failed"
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // RESET PASSWORD
    // ==========================================

    const handleResetPassword = async (e) => {
        e.preventDefault();

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

            const res = await axios.post(
                `${backendUrl}/api/user/reset-password`,
                {
                    resetToken,
                    password,
                    confirmPassword,
                }
            );

            if (!res.data?.success) {
                toastError(
                    res.data?.message || "Unable to change password"
                );
                return;
            }

            sessionStorage.removeItem("ljka_reset_token");

            toastSuccess(
                "Password changed successfully. Please login."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err) {
            toastError(
                err?.response?.data?.message ||
                "Unable to change password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // UI
    // ==========================================

    return (
        <form
            onSubmit={handleResetPassword}
            className="
        w-[92%] max-w-[420px] sm:max-w-[520px] mx-auto
        mt-20 mb-20 sm:mt-22 sm:mb-22 lg:mt-26 lg:mb-26
        bg-white/5 backdrop-blur-xl
        border border-white/10 rounded-2xl
        p-6 sm:p-8
        shadow-2xl text-white
        flex flex-col gap-4
      "
        >
            <h2 className="text-3xl font-bold text-center tracking-wide">
                Forgot Password
            </h2>

            <p className="text-center text-gray-400 text-xs">
                Verify your email and create a new password
            </p>

            {/* EMAIL */}
            <input
                type="email"
                value={email}
                onChange={(e) =>
                    setEmail(normalizeEmail(e.target.value))
                }
                placeholder="Email address"
                className="dark-input"
                disabled={otpVerified}
            />

            {/* SEND OTP */}
            {!otpVerified && (
                <button
                    type="button"
                    onClick={sendOtp}
                    disabled={otpLoading || cooldown > 0}
                    className={`primary-btn flex items-center justify-center gap-2
            ${(otpLoading || cooldown > 0) &&
                        "opacity-60 cursor-not-allowed"
                        }`}
                >
                    {otpLoading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            Sending...
                        </>
                    ) : cooldown > 0 ? (
                        `Resend in ${cooldown}s`
                    ) : otpSent ? (
                        "Resend OTP"
                    ) : (
                        "Send OTP"
                    )}
                </button>
            )}

            {/* OTP */}
            {otpSent && !otpVerified && (
                <div className="flex flex-col gap-2">
                    <input
                        value={otp}
                        onChange={(e) =>
                            setOtp(
                                e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6)
                            )
                        }
                        placeholder="Enter 6-digit OTP"
                        inputMode="numeric"
                        maxLength={6}
                        className="dark-input tracking-[6px] text-center text-lg"
                        disabled={loading}
                    />

                    <button
                        type="button"
                        onClick={verifyOtp}
                        disabled={loading || otp.length !== 6}
                        className={`verify-btn
              ${(loading || otp.length !== 6) &&
                            "opacity-60 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </div>
            )}

            {/* VERIFIED */}
            {otpVerified && (
                <p className="text-green-400 text-sm text-center">
                    ✔ Email verified successfully
                </p>
            )}

            {/* PASSWORD SECTION */}
            {otpVerified && (
                <>
                    {/* NEW PASSWORD */}
                    <div className="relative">
                        <input
                            type={showPass ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create New Password"
                            className="dark-input pr-11"
                            disabled={loading}
                        />

                        <span
                            onClick={() => setShowPass(!showPass)}
                            className="eye-icon"
                        >
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {/* PASSWORD RULES */}
                    {password && (
                        <div className="grid grid-cols-3 gap-x-4 text-xs mt-1">
                            <p
                                className={
                                    passwordChecks.length(password)
                                        ? "ok"
                                        : "bad"
                                }
                            >
                                • 6+ chars
                            </p>

                            <p
                                className={
                                    passwordChecks.letter(password)
                                        ? "ok"
                                        : "bad"
                                }
                            >
                                • Letter
                            </p>

                            <p
                                className={
                                    passwordChecks.number(password)
                                        ? "ok"
                                        : "bad"
                                }
                            >
                                • Number
                            </p>
                        </div>
                    )}

                    {/* CONFIRM PASSWORD */}
                    <div className="relative">
                        <input
                            type={showPass2 ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            placeholder="Confirm New Password"
                            className="dark-input pr-11"
                            disabled={loading}
                        />

                        <span
                            onClick={() => setShowPass2(!showPass2)}
                            className="eye-icon"
                        >
                            {showPass2 ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {/* CHANGE PASSWORD */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`primary-btn flex items-center justify-center gap-2
              ${loading &&
                            "opacity-60 cursor-not-allowed"
                            }`}
                    >
                        {loading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                Changing Password...
                            </>
                        ) : (
                            "Change Password"
                        )}
                    </button>
                </>
            )}

            {/* LOGIN */}
            <p
                className="text-center text-sm text-blue-500 font-medium cursor-pointer underline hover:text-blue-400 transition"
                onClick={() => navigate("/login")}
            >
                Remember your password? Login
            </p>

            <style>{`
        .dark-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.12);
          color: white;
          outline: none;
          transition: all 0.2s ease;
        }

        .dark-input:focus {
          border-color: white;
          background: rgba(0,0,0,0.8);
        }

        .dark-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .primary-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: white;
          color: black;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .primary-btn:hover {
          background: #e5e5e5;
          transform: translateY(-1px);
        }

        .verify-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          background: #16a34a;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .verify-btn:hover {
          background: #15803d;
          transform: translateY(-1px);
        }

        .eye-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #ccc;
        }

        .ok {
          color: #22c55e;
        }

        .bad {
          color: #ef4444;
        }
      `}</style>
        </form>
    );
};

export default ForgotPassword;