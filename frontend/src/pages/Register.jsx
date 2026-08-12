import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { LJKAContext } from "../context/LJKAContext";
import axios from "axios";
import { FaEye, FaEyeSlash, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { toastError, toastSuccess, toastInfo } from "../utils/toast";

const SIGNUP_STORAGE_KEY = "ljka_signup_draft";

/* ---------------- HELPERS ---------------- */

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const passwordChecks = {
  length: (p) => p.length >= 6,
  letter: (p) => /[A-Za-z]/.test(p),
  number: (p) => /[0-9]/.test(p),
};

const getPasswordScore = (p) => Object.values(passwordChecks).filter((fn) => fn(p)).length;

const normalizeEmail = (value) => {
  if (!value) return "";
  return value.replace(/\s+/g, "").toLowerCase();
};

const Register = () => {
  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { setToken, navigate, backendUrl } = useContext(LJKAContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const passwordScore = getPasswordScore(password);

  /* ---------------- PERSIST DRAFT ---------------- */

  useEffect(() => {
    const data = { fullName, email, otpSent, otpVerified, cooldown, agreeTerms };
    sessionStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(data));
  }, [fullName, email, otpSent, otpVerified, cooldown, agreeTerms]);

  useEffect(() => {
    const saved = sessionStorage.getItem(SIGNUP_STORAGE_KEY);
    if (!saved) {
      setHydrated(true);
      return;
    }

    try {
      const data = JSON.parse(saved);
      setFullName(data.fullName || "");
      setEmail(data.email || "");
      setOtpSent(!!data.otpSent);
      setOtpVerified(!!data.otpVerified);
      setCooldown(data.cooldown || 0);
      setAgreeTerms(!!data.agreeTerms);
    } catch {
      sessionStorage.removeItem(SIGNUP_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setCooldown(0);
  }, [email, hydrated]);

  useEffect(() => {
    if (cooldown <= 0) {
      setCooldown(0);
      return;
    }

    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const sendOtp = async () => {
    if (!fullName.trim()) {
      toastError("Full Name is required");
      return;
    }

    if (fullName.trim().length < 3) {
      toastError("Please enter a valid full name");
      return;
    }

    const normalized = normalizeEmail(email);

    if (!normalized) {
      toastError("Email is required");
      return;
    }

    if (!isValidEmail(normalized)) {
      toastError("Please enter a valid email address");
      return;
    }

    if (cooldown > 0) return;

    try {
      setOtpLoading(true);

      await axios.post(`${backendUrl}/api/user/send-otp`, {
        email: normalized,
        purpose: "registration",
      });

      setOtp("");
      setOtpVerified(false);
      setOtpSent(true);
      setCooldown(60);
      toastSuccess("Verification code sent to your email 📩");
    } catch (err) {
      toastError(err?.response?.data?.message || "Unable to send verification code");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async (code) => {
    const codeToVerify = code ?? otp;

    if (!codeToVerify) {
      toastError("Please enter the verification code");
      return;
    }

    if (!/^\d{6}$/.test(codeToVerify)) {
      toastError("Verification code must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      const normalized = normalizeEmail(email);

      const res = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        email: normalized,
        otp: codeToVerify,
        purpose: "registration",
      });

      if (!res.data.success) {
        toastError(res.data.message || "Invalid verification code");
        setOtpVerified(false);
        return;
      }

      setOtpVerified(true);
      toastSuccess("Email verified successfully ✅");
    } catch (err) {
      toastError(err?.response?.data?.message || "Verification failed");
      setOtpVerified(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6 && !otpVerified && !loading) {
      verifyOtp(otp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    const normalized = normalizeEmail(email);

    if (!fullName.trim()) {
      toastError("Full Name is required");
      return;
    }

    if (fullName.trim().length < 3) {
      toastError("Please enter a valid full name");
      return;
    }

    if (!normalized) {
      toastError("Email is required");
      return;
    }

    if (!isValidEmail(normalized)) {
      toastError("Please enter a valid email address");
      return;
    }

    if (!otpVerified) {
      toastError("Please verify your email with the OTP first");
      return;
    }

    if (!password) {
      toastError("Password is required");
      return;
    }

    if (passwordScore < 3) {
      toastError("Password must be at least 6 characters and include a letter and a number");
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

    if (!agreeTerms) {
      toastError("Please accept the Terms & Conditions to continue");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${backendUrl}/api/user/register`, {
        fullName: fullName.trim(),
        email: normalized,
        password,
        confirmPassword,
        agreeTerms,
      });

      if (!res.data?.success) {
        toastError(res.data?.message || "Registration failed");
        return;
      }

      sessionStorage.removeItem(SIGNUP_STORAGE_KEY);

      try {
        const loginRes = await axios.post(`${backendUrl}/api/user/login`, {
          email: normalized,
          password,
        });

        if (loginRes.data?.success) {
          const { token, user } = loginRes.data;

          setToken(token);
          localStorage.setItem("token", token);
          localStorage.setItem("kycCompleted", String(!!user?.kycCompleted));

          if (user?.fullName) {
            localStorage.setItem("userName", user.fullName);
          }

          toastSuccess("Account created 🎉 Let's finish your KYC");
          navigate("/kyc");
          return;
        }
      } catch (autoLoginErr) {}

      toastInfo("Account created 🎉 Please login to continue");
      navigate("/login");
    } catch (err) {
      const response = err?.response;

      if (response?.data?.code === "EMAIL_EXISTS") {
        toastInfo("Account already exists. Please login 🙂");
        sessionStorage.removeItem(SIGNUP_STORAGE_KEY);
        navigate("/login");
        return;
      }

      if (response?.data?.code === "EMAIL_NOT_VERIFIED") {
        toastError("Your verification expired. Please verify your email again");
        setOtpSent(false);
        setOtpVerified(false);
        setOtp("");
        return;
      }

      toastError(response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] bg-[var(--ljka-bg)] px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">

        {/* LEFT INFORMATION */}
        <div className="hidden lg:block">
          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/40 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[var(--ljka-primary)] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--ljka-gold)]" />
              LJKA MEMBERSHIP
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-[var(--ljka-primary)] xl:text-5xl">
              Become a part of
              <span className="block text-[var(--ljka-gold)]">LJKA</span>
            </h1>

            <p className="mt-5 text-base leading-7 text-[var(--ljka-muted)]">
              Join Lakhdaatar Jeevan Kalyan Association and become part of a
              community built around trust, humanity, cooperation and social
              responsibility.
            </p>

            <div className="mt-8 rounded-2xl border border-[var(--ljka-gold)]/30 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ljka-primary)] text-[var(--ljka-gold)]">
                  <FaShieldAlt />
                </div>
                <div>
                  <p className="font-semibold text-[var(--ljka-primary)]">Simple & Secure Registration</p>
                  <p className="text-xs text-[var(--ljka-muted)]">Email verification protects your account.</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[var(--ljka-primary)] px-5 py-4 text-white shadow-sm">
              <div className="text-2xl font-bold text-[var(--ljka-gold)]">11,000</div>
              <div>
                <p className="text-sm font-semibold">First Members</p>
                <p className="text-xs text-white/65">Registration currently FREE</p>
              </div>
            </div>
          </div>
        </div>

        {/* REGISTER CARD */}
        <form onSubmit={onSubmitHandler} className="mx-auto w-full max-w-[560px] rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_15px_50px_rgba(5,27,50,0.10)] sm:p-7 lg:p-8">

          {/* MOBILE HEADING */}
          <div className="mb-6 text-center lg:hidden">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ljka-primary)] text-lg font-bold text-[var(--ljka-gold)] shadow-sm">
              LJKA
            </div>
            <h1 className="mt-3 text-2xl font-bold text-[var(--ljka-primary)]">Become a Member</h1>
            <p className="mt-1 text-sm text-[var(--ljka-muted)]">Create your LJKA account securely</p>
          </div>

          {/* DESKTOP CARD TITLE */}
          <div className="mb-7 hidden lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">Membership Registration</p>
            <h2 className="mt-2 text-3xl font-bold text-[var(--ljka-primary)]">Create your account</h2>
            <p className="mt-1 text-sm text-[var(--ljka-muted)]">Verify your email and create a secure LJKA account.</p>
          </div>

          {/* FORM */}
          <div className="space-y-4">

            <div>
              <label className="ljka-label">Full Name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" className="ljka-input" />
            </div>

            <div>
              <label className="ljka-label">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(normalizeEmail(e.target.value))} placeholder="you@example.com" className="ljka-input" />
            </div>

            {!otpVerified && (
              <button type="button" onClick={sendOtp} disabled={otpLoading || cooldown > 0} className="ljka-gold-btn">
                {otpLoading ? (
                  <><span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--ljka-primary)] border-t-transparent" /> Sending...</>
                ) : cooldown > 0 ? `Resend in ${cooldown}s` : otpSent ? "Resend OTP" : "Send Verification Code"}
              </button>
            )}

            {otpSent && !otpVerified && (
              <div className="rounded-xl border border-[var(--ljka-gold)]/30 bg-[#faf8f1] p-4">
                <label className="ljka-label">6-Digit Verification Code</label>
                <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" inputMode="numeric" maxLength={6} disabled={loading} className="ljka-input text-center text-xl tracking-[7px]" />

                <button type="button" onClick={() => verifyOtp(otp)} disabled={loading || otp.length !== 6} className="mt-3 w-full rounded-lg bg-[var(--ljka-primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#102b45] disabled:cursor-not-allowed disabled:opacity-50">
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <p className="mt-2 text-center text-[11px] text-gray-500">Verification will also happen automatically after 6 digits.</p>
              </div>
            )}

            {otpVerified && (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <FaCheckCircle />
                Email verified successfully
              </div>
            )}

            <div>
              <label className="ljka-label">Create Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="ljka-input pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="ljka-eye">
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {password && (
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3 text-[11px] font-medium">
                <span className={passwordChecks.length(password) ? "text-green-600" : "text-red-500"}>{passwordChecks.length(password) ? "✓" : "×"} 6+ chars</span>
                <span className={passwordChecks.letter(password) ? "text-green-600" : "text-red-500"}>{passwordChecks.letter(password) ? "✓" : "×"} Letter</span>
                <span className={passwordChecks.number(password) ? "text-green-600" : "text-red-500"}>{passwordChecks.number(password) ? "✓" : "×"} Number</span>
              </div>
            )}

            <div>
              <label className="ljka-label">Confirm Password</label>
              <div className="relative">
                <input type={showPass2 ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="ljka-input pr-12" />
                <button type="button" onClick={() => setShowPass2(!showPass2)} className="ljka-eye">
                  {showPass2 ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs leading-5 text-gray-600">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1 accent-[var(--ljka-primary)]" />
              <span>
                I agree to the{" "}
                <span onClick={() => navigate("/terms-conditions")} className="font-semibold text-[var(--ljka-primary)] underline">Terms & Conditions</span>{" "}
                and{" "}
                <span onClick={() => navigate("/privacy-policy")} className="font-semibold text-[var(--ljka-primary)] underline">Privacy Policy</span>.
              </span>
            </label>

            <button disabled={loading || !otpVerified} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102b45] disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? (
                <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> Creating account...</>
              ) : "Create LJKA Account"}
            </button>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <button type="button" onClick={() => navigate("/login")} className="font-semibold text-[var(--ljka-primary)] hover:text-[var(--ljka-gold)]">
                Login
              </button>
            </p>
          </div>
        </form>
      </div>

      <style>{`
        .ljka-label {
          display:block;
          margin-bottom:6px;
          font-size:12px;
          font-weight:600;
          color:var(--ljka-primary);
        }
        .ljka-input {
          width:100%;
          border:1px solid #d9dde3;
          border-radius:9px;
          background:#fff;
          padding:11px 13px;
          color:#172b3d;
          outline:none;
          font-size:14px;
          transition:.2s;
        }
        .ljka-input::placeholder { color:#9ca3af; }
        .ljka-input:focus {
          border-color:var(--ljka-gold);
          box-shadow:0 0 0 3px rgba(232,200,116,.14);
        }
        .ljka-input:disabled { opacity:.55; cursor:not-allowed; }
        .ljka-gold-btn {
          width:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          border-radius:9px;
          background:var(--ljka-gold);
          color:var(--ljka-primary);
          padding:11px 16px;
          font-size:13px;
          font-weight:700;
          transition:.2s;
        }
        .ljka-gold-btn:hover { filter:brightness(.96); }
        .ljka-gold-btn:disabled { opacity:.55; cursor:not-allowed; }
        .ljka-eye {
          position:absolute;
          right:13px;
          top:50%;
          transform:translateY(-50%);
          color:#7b8794;
          padding:5px;
        }
        .ljka-eye:hover { color:var(--ljka-primary); }
      `}</style>
    </div>
  );
};

export default Register;

// import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
// import { LJKAContext } from "../context/LJKAContext";
// import axios from "axios";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { toastError, toastSuccess, toastInfo } from "../utils/toast";

// const SIGNUP_STORAGE_KEY = "ljka_signup_draft";

// /* ---------------- HELPERS ---------------- */
// const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// // Mirrors registerUser password rules: 6+ chars, at least 1 alphabet, at least 1 number
// const passwordChecks = {
//   length: (p) => p.length >= 6,
//   letter: (p) => /[A-Za-z]/.test(p),
//   number: (p) => /[0-9]/.test(p),
// };

// const getPasswordScore = (p) =>
//   Object.values(passwordChecks).filter((fn) => fn(p)).length;

// const normalizeEmail = (value) => {
//   if (!value) return "";
//   return value.replace(/\s+/g, "").toLowerCase();
// };

// /* ---------------- COMPONENT ---------------- */
// const Register = () => {
//   useLayoutEffect(() => {
//     document.documentElement.scrollTop = 0;
//     document.body.scrollTop = 0;
//     window.scrollTo(0, 0);
//   }, []);

//   const [loading, setLoading] = useState(false);
//   const [otpLoading, setOtpLoading] = useState(false);
//   const [cooldown, setCooldown] = useState(0);
//   const [agreeTerms, setAgreeTerms] = useState(false);

//   const { setToken, navigate, backendUrl } = useContext(LJKAContext);

//   // Form states
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");

//   // OTP
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [hydrated, setHydrated] = useState(false);

//   // Password
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [showPass2, setShowPass2] = useState(false);

//   const passwordScore = getPasswordScore(password);

//   /* ---------------- PERSIST DRAFT ---------------- */
//   useEffect(() => {
//     const data = {
//       fullName,
//       email,
//       otpSent,
//       otpVerified,
//       cooldown,
//       agreeTerms,
//     };

//     sessionStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(data));
//   }, [fullName, email, otpSent, otpVerified, cooldown, agreeTerms]);

//   useEffect(() => {
//     const saved = sessionStorage.getItem(SIGNUP_STORAGE_KEY);
//     if (!saved) {
//       setHydrated(true);
//       return;
//     }

//     try {
//       const data = JSON.parse(saved);
//       setFullName(data.fullName || "");
//       setEmail(data.email || "");
//       setOtpSent(!!data.otpSent);
//       setOtpVerified(!!data.otpVerified);
//       setCooldown(data.cooldown || 0);
//       setAgreeTerms(!!data.agreeTerms);
//     } catch {
//       sessionStorage.removeItem(SIGNUP_STORAGE_KEY);
//     } finally {
//       setHydrated(true);
//     }
//   }, []);

//   // Reset OTP state whenever the email changes
//   useEffect(() => {
//     if (!hydrated) return;

//     setOtp("");
//     setOtpSent(false);
//     setOtpVerified(false);
//     setCooldown(0);
//   }, [email, hydrated]);

//   useEffect(() => {
//     if (cooldown <= 0) {
//       setCooldown(0);
//       return;
//     }

//     const timer = setInterval(() => {
//       setCooldown((prev) => Math.max(prev - 1, 0));
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [cooldown]);

//   /* ---------------- OTP HANDLERS ---------------- */
//   const sendOtp = async () => {
//     if (!fullName.trim()) {
//       toastError("Full Name is required");
//       return;
//     }

//     if (fullName.trim().length < 3) {
//       toastError("Please enter a valid full name");
//       return;
//     }

//     const normalized = normalizeEmail(email);

//     if (!normalized) {
//       toastError("Email is required");
//       return;
//     }

//     if (!isValidEmail(normalized)) {
//       toastError("Please enter a valid email address");
//       return;
//     }

//     if (cooldown > 0) return;

//     try {
//       setOtpLoading(true);

//       // registerUser now checks EmailOtp for purpose: "registration",
//       // so that has to be tagged on the way in too.
//       await axios.post(`${backendUrl}/api/user/send-otp`, {
//         email: normalized,
//         purpose: "registration",
//       });

//       setOtp("");
//       setOtpVerified(false);
//       setOtpSent(true);
//       setCooldown(60);
//       toastSuccess("Verification code sent to your email 📩");
//     } catch (err) {
//       toastError(err?.response?.data?.message || "Unable to send verification code");
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   // Manual verify (also used as the auto-verify trigger below)
//   const verifyOtp = async (code) => {
//     const codeToVerify = code ?? otp;

//     if (!codeToVerify) {
//       toastError("Please enter the verification code");
//       return;
//     }

//     if (!/^\d{6}$/.test(codeToVerify)) {
//       toastError("Verification code must be 6 digits");
//       return;
//     }

//     try {
//       setLoading(true);
//       const normalized = normalizeEmail(email);

//       const res = await axios.post(`${backendUrl}/api/user/verify-otp`, {
//         email: normalized,
//         otp: codeToVerify,
//         purpose: "registration",
//       });

//       if (!res.data.success) {
//         toastError(res.data.message || "Invalid verification code");
//         setOtpVerified(false);
//         return;
//       }

//       setOtpVerified(true);
//       toastSuccess("Email verified successfully ✅");
//     } catch (err) {
//       toastError(err?.response?.data?.message || "Verification failed");
//       setOtpVerified(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-verify the moment 6 digits are entered, so users don't have to
//   // remember to tap the Verify button themselves.
//   useEffect(() => {
//     if (otp.length === 6 && !otpVerified && !loading) {
//       verifyOtp(otp);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [otp]);

//   /* ---------------- SUBMIT ---------------- */
//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     const normalized = normalizeEmail(email);

//     // Mirrors registerUser controller validation order, each surfaced via toast
//     if (!fullName.trim()) {
//       toastError("Full Name is required");
//       return;
//     }

//     if (fullName.trim().length < 3) {
//       toastError("Please enter a valid full name");
//       return;
//     }

//     if (!normalized) {
//       toastError("Email is required");
//       return;
//     }

//     if (!isValidEmail(normalized)) {
//       toastError("Please enter a valid email address");
//       return;
//     }

//     if (!otpVerified) {
//       toastError("Please verify your email with the OTP first");
//       return;
//     }

//     if (!password) {
//       toastError("Password is required");
//       return;
//     }

//     if (passwordScore < 3) {
//       toastError(
//         "Password must be at least 6 characters and include a letter and a number"
//       );
//       return;
//     }

//     if (!confirmPassword) {
//       toastError("Please confirm your password");
//       return;
//     }

//     if (password !== confirmPassword) {
//       toastError("Passwords do not match");
//       return;
//     }

//     if (!agreeTerms) {
//       toastError("Please accept the Terms & Conditions to continue");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axios.post(`${backendUrl}/api/user/register`, {
//         fullName: fullName.trim(),
//         email: normalized,
//         password,
//         confirmPassword,
//         agreeTerms,
//       });

//       if (!res.data?.success) {
//         toastError(res.data?.message || "Registration failed");
//         return;
//       }

//       sessionStorage.removeItem(SIGNUP_STORAGE_KEY);

//       // registerUser doesn't return a token, so log the user in right away
//       // with the same credentials — they should never see a login screen
//       // between registering and landing on KYC.
//       try {
//         const loginRes = await axios.post(`${backendUrl}/api/user/login`, {
//           email: normalized,
//           password,
//         });

//         if (loginRes.data?.success) {
//           const { token, user } = loginRes.data;

//           setToken(token);
//           localStorage.setItem("token", token);
//           localStorage.setItem("kycCompleted", String(!!user?.kycCompleted));

//           if (user?.fullName) {
//             localStorage.setItem("userName", user.fullName);
//           }

//           toastSuccess("Account created 🎉 Let's finish your KYC");
//           navigate("/kyc");
//           return;
//         }
//       } catch (autoLoginErr) {
//         // Registration itself succeeded — fall through to manual login below.
//       }

//       toastInfo("Account created 🎉 Please login to continue");
//       navigate("/login");
//     } catch (err) {
//       const response = err?.response;

//       // registerUser returns this if the email got registered after OTP was verified
//       if (response?.data?.code === "EMAIL_EXISTS") {
//         toastInfo("Account already exists. Please login 🙂");
//         sessionStorage.removeItem(SIGNUP_STORAGE_KEY);
//         navigate("/login");
//         return;
//       }

//       // registerUser returns this if the OTP verification expired/was lost server-side
//       if (response?.data?.code === "EMAIL_NOT_VERIFIED") {
//         toastError("Your verification expired. Please verify your email again");
//         setOtpSent(false);
//         setOtpVerified(false);
//         setOtp("");
//         return;
//       }

//       toastError(response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <form
//       onSubmit={onSubmitHandler}
//       className="
//   w-[92%] max-w-[420px] sm:max-w-[520px] mx-auto
//   mt-20 mb-20  sm:mt-22 sm:mb-22 lg:mt-26 lg:mb-26
//   bg-white/5 backdrop-blur-xl
//   border border-white/10 rounded-2xl
//   p-6 sm:p-8
//   shadow-2xl text-white
//   flex flex-col gap-4
// "
//     >
//       {/* TITLE */}
//       <h2 className="text-3xl font-bold text-center tracking-wide">
//         Create Account
//       </h2>

//       <p className="text-center text-gray-400 text-10px">
//         Verify email & create a secure account
//       </p>

//       {/* FULL NAME */}
//       <input
//         value={fullName}
//         onChange={(e) => setFullName(e.target.value)}
//         placeholder="Full Name"
//         className="dark-input"
//       />

//       {/* EMAIL */}
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(normalizeEmail(e.target.value))}
//         placeholder="Email address"
//         className="dark-input"
//       />

//       {!otpVerified && (
//         <button
//           type="button"
//           onClick={sendOtp}
//           disabled={otpLoading || cooldown > 0}
//           className={`primary-btn flex items-center justify-center gap-2
//       ${(otpLoading || cooldown > 0) && "opacity-60 cursor-not-allowed"}`}
//         >
//           {otpLoading ? (
//             <>
//               <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
//               Sending...
//             </>
//           ) : cooldown > 0 ? (
//             `Resend in ${cooldown}s`
//           ) : otpSent ? (
//             "Resend OTP"
//           ) : (
//             "Send OTP"
//           )}
//         </button>
//       )}

//       {otpSent && !otpVerified && (
//         <div className="flex flex-col gap-2">
//           <input
//             value={otp}
//             onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
//             placeholder="Enter 6-digit OTP"
//             inputMode="numeric"
//             maxLength={6}
//             className="dark-input tracking-[6px] text-center text-lg"
//             disabled={loading}
//           />

//           {/* Big, hard-to-miss verify button — auto-verify fires on the 6th
//               digit, this is the visible fallback in case that ever misses. */}
//           <button
//             type="button"
//             onClick={() => verifyOtp(otp)}
//             disabled={loading || otp.length !== 6}
//             className={`verify-btn flex items-center justify-center gap-2
//               ${(loading || otp.length !== 6) && "opacity-60 cursor-not-allowed"}`}
//           >
//             {loading ? (
//               <>
//                 <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                 Verifying...
//               </>
//             ) : (
//               "Verify OTP"
//             )}
//           </button>

//           <p className="text-center text-gray-500 text-xs">
//             We'll verify automatically once you finish typing the code.
//           </p>
//         </div>
//       )}

//       {otpVerified && (
//         <p className="text-green-400 text-sm text-center">
//           ✔ Email verified successfully
//         </p>
//       )}

//       {/* PASSWORD */}
//       <div className="relative">
//         <input
//           type={showPass ? "text" : "password"}
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Create New Password"
//           className="dark-input pr-11"
//         />
//         <span onClick={() => setShowPass(!showPass)} className="eye-icon">
//           {showPass ? <FaEyeSlash /> : <FaEye />}
//         </span>
//       </div>

//       {/* PASSWORD RULES */}
//       {password && (
//         <div className="grid grid-cols-3 gap-x-4 text-xs mt-1">
//           <p className={passwordChecks.length(password) ? "ok" : "bad"}>
//             • 6+ chars
//           </p>
//           <p className={passwordChecks.letter(password) ? "ok" : "bad"}>
//             • Letter
//           </p>
//           <p className={passwordChecks.number(password) ? "ok" : "bad"}>
//             • Number
//           </p>
//         </div>
//       )}

//       {/* CONFIRM PASSWORD */}
//       <div className="relative">
//         <input
//           type={showPass2 ? "text" : "password"}
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           placeholder="Confirm New Password"
//           className="dark-input pr-11"
//         />
//         <span onClick={() => setShowPass2(!showPass2)} className="eye-icon">
//           {showPass2 ? <FaEyeSlash /> : <FaEye />}
//         </span>
//       </div>

//       {/* TERMS & CONDITIONS */}
//       <div className="flex items-start gap-2 text-sm text-gray-300">
//         <input
//           type="checkbox"
//           checked={agreeTerms}
//           onChange={(e) => setAgreeTerms(e.target.checked)}
//           className="mt-1 cursor-pointer"
//         />

//         <p className="leading-5">
//           I agree to the{" "}
//           <span
//             onClick={() => navigate("/terms-conditions")}
//             className="text-white underline cursor-pointer hover:text-blue-300"
//           >
//             Terms & Conditions
//           </span>{" "}
//           and{" "}
//           <span
//             onClick={() => navigate("/privacy-policy")}
//             className="text-white underline cursor-pointer hover:text-blue-300"
//           >
//             Privacy Policy
//           </span>
//         </p>
//       </div>

//       {/* SUBMIT */}
//       <button
//         disabled={loading || !otpVerified}
//         className={`primary-btn flex items-center justify-center gap-2
//     ${(loading || !otpVerified) && "opacity-60 cursor-not-allowed"}`}
//       >
//         {loading ? (
//           <>
//             <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
//             <span className="text-sm">Creating account...</span>
//           </>
//         ) : (
//           "Register"
//         )}
//       </button>

//       {/* TOGGLE — same-system link over to Login */}
//       <p
//         className="text-center text-sm text-blue-500 font-medium cursor-pointer underline hover:text-blue-600 transition"
//         onClick={() => navigate("/login")}
//       >
//         Already have an account? Login
//       </p>

//       {/* STYLES */}
//       <style>{`
//       .dark-input {
//         width: 100%;
//         padding: 12px 14px;
//         border-radius: 10px;
//         background: rgba(0,0,0,0.6);
//         border: 1px solid rgba(255,255,255,0.12);
//         color: white;
//         outline: none;
//         transition: all 0.2s ease;
//       }

//       .dark-input:focus {
//         border-color: white;
//         background: rgba(0,0,0,0.8);
//       }

//       .dark-input:disabled {
//         opacity: 0.6;
//         cursor: not-allowed;
//       }

//       .primary-btn {
//         width: 100%;
//         padding: 12px;
//         border-radius: 10px;
//         background: white;
//         color: black;
//         font-weight: 600;
//         cursor: pointer;
//         transition: all 0.2s ease;
//       }

//       .primary-btn:hover {
//         background: #e5e5e5;
//         transform: translateY(-1px);
//       }

//       .verify-btn {
//         width: 100%;
//         padding: 14px;
//         border-radius: 10px;
//         background: #16a34a;
//         color: white;
//         font-weight: 700;
//         font-size: 15px;
//         letter-spacing: 0.3px;
//         cursor: pointer;
//         transition: all 0.2s ease;
//       }

//       .verify-btn:hover {
//         background: #15803d;
//         transform: translateY(-1px);
//       }

//       .eye-icon {
//         position: absolute;
//         right: 14px;
//         top: 50%;
//         transform: translateY(-50%);
//         cursor: pointer;
//         color: #ccc;
//       }

//       .ok { color: #22c55e; }
//       .bad { color: #ef4444; }
//     `}</style>
//     </form>
//   );
// };

// export default Register;


