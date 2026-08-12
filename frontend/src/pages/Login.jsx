import React, { useContext, useLayoutEffect, useState } from "react";
import { LJKAContext } from "../context/LJKAContext";
import axios from "axios";
import { FaEye, FaEyeSlash, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import { toastError, toastSuccess, toastInfo } from "../utils/toast";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const normalizeEmail = (value) => {
  if (!value) return "";
  return value.replace(/\s+/g, "").toLowerCase();
};

const Login = () => {
  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  const { setToken, navigate, backendUrl } = useContext(LJKAContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    const normalized = normalizeEmail(email);

    if (!normalized) {
      toastError("Email is required");
      return;
    }

    if (!isValidEmail(normalized)) {
      toastError("Please enter a valid email address");
      return;
    }

    if (!password) {
      toastError("Password is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${backendUrl}/api/user/login`, {
        email: normalized,
        password,
      });

      if (!res.data?.success) {
        toastError(res.data?.message || "Unable to login");
        return;
      }

      const { token, user } = res.data;

      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("kycCompleted", String(!!user?.kycCompleted));

      if (user?.fullName) {
        localStorage.setItem("userName", user.fullName);
      }

      const name = user?.fullName || "there";
      toastSuccess(`Welcome back, ${name} 😎`);

      if (!user?.kycCompleted) {
        toastInfo("Please complete your KYC to continue");
        navigate("/kyc");
        return;
      }

      navigate("/user/view-profile");
    } catch (err) {
      toastError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] bg-[var(--ljka-bg)] px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">

        {/* LEFT INFORMATION — DESKTOP */}
        <div className="hidden lg:block">
          <div className="max-w-md">

            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/40 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[var(--ljka-primary)] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--ljka-gold)]" />
              LJKA MEMBERSHIP
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-[var(--ljka-primary)] xl:text-5xl">
              Welcome back to
              <span className="block text-[var(--ljka-gold)]">LJKA</span>
            </h1>

            <p className="mt-5 text-base leading-7 text-[var(--ljka-muted)]">
              Login to access your LJKA membership, view your profile and
              continue your journey with Lakhdaatar Jeevan Kalyan Association.
            </p>

            <div className="mt-8 rounded-2xl border border-[var(--ljka-gold)]/30 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ljka-primary)] text-[var(--ljka-gold)]">
                  <FaShieldAlt />
                </div>

                <div>
                  <p className="font-semibold text-[var(--ljka-primary)]">
                    Secure Member Access
                  </p>
                  <p className="text-xs text-[var(--ljka-muted)]">
                    Your account is protected through secure authentication.
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

        {/* LOGIN CARD */}
        <form
          onSubmit={onSubmitHandler}
          className="mx-auto w-full max-w-[520px] rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_15px_50px_rgba(5,27,50,0.10)] sm:p-7 lg:p-8"
        >

          {/* MOBILE HEADING */}
          <div className="mb-7 text-center lg:hidden">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ljka-primary)] text-lg font-bold text-[var(--ljka-gold)] shadow-sm">
              LJKA
            </div>

            <h1 className="mt-3 text-2xl font-bold text-[var(--ljka-primary)]">
              Welcome Back
            </h1>

            <p className="mt-1 text-sm text-[var(--ljka-muted)]">
              Login to continue to LJKA
            </p>

          </div>

          {/* DESKTOP CARD TITLE */}
          <div className="mb-7 hidden lg:block">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
              Member Login
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[var(--ljka-primary)]">
              Sign in to your account
            </h2>

            <p className="mt-1 text-sm text-[var(--ljka-muted)]">
              Enter your registered email and password to continue.
            </p>

          </div>

          {/* FORM */}
          <div className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="ljka-login-label">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(normalizeEmail(e.target.value))}
                placeholder="you@example.com"
                autoComplete="email"
                className="ljka-login-input"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="ljka-login-label">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="ljka-login-input pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="ljka-login-eye"
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-xs font-semibold text-[var(--ljka-primary)] transition hover:text-[var(--ljka-gold)]"
              >
                Forgot password?
              </button>
            </div>

            {/* SUBMIT */}
            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102b45] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Signing you in...</span>
                </>
              ) : (
                <>
                  Sign In
                  <FaArrowRight className="text-xs text-[var(--ljka-gold)]" />
                </>
              )}
            </button>

          </div>

          {/* REGISTER */}
          <div className="mt-7 border-t border-gray-100 pt-5 text-center">

            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-[var(--ljka-primary)] transition hover:text-[var(--ljka-gold)]"
              >
                Become a Member
              </button>
            </p>

          </div>

        </form>
      </div>

      <style>{`
        .ljka-login-label {
          display:block;
          margin-bottom:6px;
          font-size:12px;
          font-weight:600;
          color:var(--ljka-primary);
        }

        .ljka-login-input {
          width:100%;
          border:1px solid #d9dde3;
          border-radius:9px;
          background:#fff;
          padding:12px 13px;
          color:#172b3d;
          outline:none;
          font-size:14px;
          transition:.2s;
        }

        .ljka-login-input::placeholder {
          color:#9ca3af;
        }

        .ljka-login-input:focus {
          border-color:var(--ljka-gold);
          box-shadow:0 0 0 3px rgba(232,200,116,.14);
        }

        .ljka-login-eye {
          position:absolute;
          right:13px;
          top:50%;
          transform:translateY(-50%);
          color:#7b8794;
          padding:5px;
          transition:.2s;
        }

        .ljka-login-eye:hover {
          color:var(--ljka-primary);
        }
      `}</style>
    </div>
  );
};

export default Login;



// import React, { useContext, useLayoutEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { LJKAContext } from "../context/LJKAContext";
// import axios from "axios";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { toastError, toastSuccess, toastInfo } from "../utils/toast";

// /* ---------------- HELPERS ---------------- */
// const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// const normalizeEmail = (value) => {
//   if (!value) return "";
//   return value.replace(/\s+/g, "").toLowerCase();
// };

// /* ---------------- COMPONENT ---------------- */
// const Login = () => {
//   useLayoutEffect(() => {
//     document.documentElement.scrollTop = 0;
//     document.body.scrollTop = 0;
//     window.scrollTo(0, 0);
//   }, []);

//   const { setToken, navigate, backendUrl } = useContext(LJKAContext);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [loading, setLoading] = useState(false);

//   /* ---------------- SUBMIT ---------------- */
//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     const normalized = normalizeEmail(email);

//     // Mirrors loginUser controller validation order, surfaced via toast
//     if (!normalized) {
//       toastError("Email is required");
//       return;
//     }

//     if (!isValidEmail(normalized)) {
//       toastError("Please enter a valid email address");
//       return;
//     }

//     if (!password) {
//       toastError("Password is required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axios.post(`${backendUrl}/api/user/login`, {
//         email: normalized,
//         password,
//       });

//       if (!res.data?.success) {
//         toastError(res.data?.message || "Unable to login");
//         return;
//       }

//       const { token, user } = res.data;

//       setToken(token);
//       localStorage.setItem("token", token);
//       localStorage.setItem("kycCompleted", String(!!user?.kycCompleted));

//       if (user?.fullName) {
//         localStorage.setItem("userName", user.fullName);
//       }

//       const name = user?.fullName || "there";
//       toastSuccess(`Welcome back, ${name} 😎`);

//       // Straight to KYC if it isn't done yet — no detour anywhere else.
//       if (!user?.kycCompleted) {
//         toastInfo("Please complete your KYC to continue");
//         navigate("/kyc");
//         return;
//       }

//       // KYC completed → enter logged-in user pane
//       navigate("/user/view-profile");
//     } catch (err) {
//       toastError(err?.response?.data?.message || "Invalid email or password");
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
//         Login User
//       </h2>

//       <p className="text-center text-gray-400 text-10px">
//         Login to continue to LJKA
//       </p>

//       {/* EMAIL */}
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(normalizeEmail(e.target.value))}
//         placeholder="Email address"
//         className="dark-input"
//       />

//       {/* PASSWORD */}
//       <div className="relative">
//         <input
//           type={showPass ? "text" : "password"}
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Enter your password"
//           className="dark-input pr-11"
//         />
//         <span onClick={() => setShowPass(!showPass)} className="eye-icon">
//           {showPass ? <FaEyeSlash /> : <FaEye />}
//         </span>
//       </div>

//       <p
//         className="text-right text-8px text-gray-200 cursor-pointer hover:text-blue-400"
//         onClick={() => navigate("/forgot-password")}
//       >
//         Forgot password?
//       </p>

//       {/* SUBMIT */}
//       <button
//         disabled={loading}
//         className={`primary-btn flex items-center justify-center gap-2
//     ${loading && "opacity-60 cursor-not-allowed"}`}
//       >
//         {loading ? (
//           <>
//             <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
//             <span className="text-sm">Signing you in...</span>
//           </>
//         ) : (
//           "Sign In"
//         )}
//       </button>

//       {/* TOGGLE — same-system link over to Register */}
//       <p
//         className="text-center text-8px text-blue-500 font-medium cursor-pointer underline hover:text-blue-600 transition"
//         onClick={() => navigate("/register")}
//       >
//         Don't have an account? Register
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

//       .eye-icon {
//         position: absolute;
//         right: 14px;
//         top: 50%;
//         transform: translateY(-50%);
//         cursor: pointer;
//         color: #ccc;
//       }
//     `}</style>
//     </form>
//   );
// };

// export default Login;
