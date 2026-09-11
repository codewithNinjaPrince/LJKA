import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

import { LJKAContext } from "../../context/LJKAContext";

import {
  toastError,
  toastSuccess,
} from "../../utils/toast";


const STORAGE_KEY =
  "ljka_password_change_verification";


const getStoredVerification = () => {
  try {
    const stored =
      sessionStorage.getItem(STORAGE_KEY);

    if (!stored) return null;

    const parsed = JSON.parse(stored);

    if (
      !parsed?.token ||
      !parsed?.verifiedAt
    ) {
      sessionStorage.removeItem(
        STORAGE_KEY
      );

      return null;
    }

    const age =
      Date.now() -
      Number(parsed.verifiedAt);

    /*
     * Same 10 minute limit as backend.
     */
    if (age > 10 * 60 * 1000) {
      sessionStorage.removeItem(
        STORAGE_KEY
      );

      return null;
    }

    return parsed;
  } catch {
    sessionStorage.removeItem(
      STORAGE_KEY
    );

    return null;
  }
};


const UpdatePassword = () => {
  const {
    backendUrl,
    token,
    logout,
  } = useContext(LJKAContext);

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    step,
    setStep,
  ] = useState(1);

  const [
    passwordChangeToken,
    setPasswordChangeToken,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);


  /* =====================================================
     RESTORE PASSWORD CHANGE STATE AFTER REFRESH
  ===================================================== */

  useEffect(() => {
    const stored =
      getStoredVerification();

    if (stored) {
      setPasswordChangeToken(
        stored.token
      );

      setStep(2);
    }
  }, []);


  /* =====================================================
     PASSWORD GUIDELINES
  ===================================================== */

  const passwordRules = {
    length:
      newPassword.length >= 6,

    letter:
      /[A-Za-z]/.test(
        newPassword
      ),

    number:
      /[0-9]/.test(
        newPassword
      ),
  };


  const passwordScore =
    Object.values(
      passwordRules
    ).filter(Boolean).length;


  /* =====================================================
     VERIFY CURRENT PASSWORD
  ===================================================== */

  const verifyPassword = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!currentPassword) {
      toastError(
        "Current password is required"
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await axios.post(
          `${backendUrl}/api/user/verify-current-password`,
          {
            currentPassword,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!response.data?.success) {
        toastError(
          response.data?.message ||
            "Unable to verify password"
        );

        return;
      }

      const receivedToken =
        response.data
          .passwordChangeToken;

      if (!receivedToken) {
        toastError(
          "Password verification failed"
        );

        return;
      }

      const verificationState = {
        token: receivedToken,
        verifiedAt: Date.now(),
      };

      /*
       * Only the temporary token is stored.
       * NEVER store current/new password here.
       */

      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          verificationState
        )
      );

      setPasswordChangeToken(
        receivedToken
      );

      setCurrentPassword("");

      setStep(2);

      toastSuccess(
        "Current password verified successfully"
      );
    } catch (error) {
      toastError(
        error?.response?.data?.message ||
          "Unable to verify current password"
      );
    } finally {
      setLoading(false);
    }
  };


  /* =====================================================
     UPDATE PASSWORD
  ===================================================== */

  const updatePassword = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!newPassword) {
      toastError(
        "New password is required"
      );

      return;
    }

    if (passwordScore < 3) {
      toastError(
        "Password must be at least 6 characters and include a letter and a number"
      );

      return;
    }

    if (!confirmPassword) {
      toastError(
        "Please confirm your password"
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      toastError(
        "Passwords do not match"
      );

      return;
    }

    if (!passwordChangeToken) {
      toastError(
        "Password verification expired. Please verify your current password again."
      );

      setStep(1);

      sessionStorage.removeItem(
        STORAGE_KEY
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await axios.post(
          `${backendUrl}/api/user/update-password`,
          {
            passwordChangeToken,
            newPassword,
            confirmPassword,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!response.data?.success) {
        toastError(
          response.data?.message ||
            "Unable to update password"
        );

        return;
      }

      /*
       * Remove temporary verification
       * immediately after successful update.
       */

      sessionStorage.removeItem(
        STORAGE_KEY
      );

      setPasswordChangeToken("");

      setNewPassword("");

      setConfirmPassword("");

      toastSuccess(
        "Password updated successfully"
      );

      /*
       * Security:
       * password has changed, so end
       * the existing authenticated session.
       */

      setTimeout(() => {
        logout();
      }, 1200);

    } catch (error) {
      const response =
        error?.response;

      if (
        response?.data?.code ===
        "PASSWORD_CHANGE_VERIFICATION_EXPIRED"
      ) {
        sessionStorage.removeItem(
          STORAGE_KEY
        );

        setPasswordChangeToken("");

        setStep(1);

        toastError(
          "Verification expired. Please verify your current password again."
        );

        return;
      }

      toastError(
        response?.data?.message ||
          "Unable to update password"
      );
    } finally {
      setLoading(false);
    }
  };


  /* =====================================================
     RESET TO STEP 1
  ===================================================== */

  const goBackToVerification = () => {
    sessionStorage.removeItem(
      STORAGE_KEY
    );

    setPasswordChangeToken("");

    setCurrentPassword("");

    setNewPassword("");

    setConfirmPassword("");

    setStep(1);
  };


  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-[calc(100vh-130px)] bg-[var(--ljka-bg)] px-4 py-10 sm:px-6 sm:py-14 lg:py-16">

      <div className="mx-auto w-full max-w-6xl">

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">

          {/* =================================================
              LEFT INFORMATION
          ================================================= */}

          <div className="hidden lg:block">

            <div className="max-w-md">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/40 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[var(--ljka-primary)] shadow-sm">

                <FaShieldAlt />

                Account Security

              </div>

              <h1 className="text-4xl font-bold leading-tight text-[var(--ljka-primary)]">

                Keep your LJKA account secure.

              </h1>

              <p className="mt-5 leading-7 text-gray-600">

                Change your password regularly
                and keep your membership account
                protected from unauthorized access.

              </p>

              <div className="mt-8 space-y-4">

                <div className="flex items-start gap-3">

                  <FaCheckCircle className="mt-1 text-green-600" />

                  <div>
                    <p className="font-semibold text-gray-800">
                      Verify your current password
                    </p>

                    <p className="text-sm text-gray-500">
                      Only the account owner can
                      continue.
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <FaCheckCircle className="mt-1 text-green-600" />

                  <div>
                    <p className="font-semibold text-gray-800">
                      Create a strong password
                    </p>

                    <p className="text-sm text-gray-500">
                      Use at least 6 characters with
                      a letter and a number.
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <FaCheckCircle className="mt-1 text-green-600" />

                  <div>
                    <p className="font-semibold text-gray-800">
                      Protected password update
                    </p>

                    <p className="text-sm text-gray-500">
                      Your password is securely hashed
                      before being stored.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              FORM CARD
          ================================================= */}

          <div className="mx-auto w-full max-w-[520px]">

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">

              {/* HEADER */}

              <div className="mb-7 text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ljka-primary)] text-white shadow-md">

                  <FaLock size={22} />

                </div>

                <h2 className="text-3xl font-bold tracking-wide text-gray-900">

                  Update Password

                </h2>

                <p className="mt-2 text-sm text-gray-500">

                  {step === 1
                    ? "Verify your current password to continue"
                    : "Create your new secure password"}

                </p>

              </div>


              {/* STEP INDICATOR */}

              <div className="mb-7 flex items-center">

                <div className="flex flex-1 items-center">

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                      step >= 1
                        ? "bg-[var(--ljka-primary)] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    1
                  </div>

                  <div className="mx-2 h-[2px] flex-1 bg-gray-200">

                    <div
                      className={`h-full transition-all ${
                        step >= 2
                          ? "w-full bg-[var(--ljka-primary)]"
                          : "w-0"
                      }`}
                    />

                  </div>

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                      step >= 2
                        ? "bg-[var(--ljka-primary)] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    2
                  </div>

                </div>

              </div>


              {/* =================================================
                  STEP 1
              ================================================= */}

              {step === 1 && (

                <form
                  onSubmit={verifyPassword}
                  className="space-y-5"
                >

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Current Password
                    </label>

                    <div className="relative">

                      <input
                        type={
                          showCurrentPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          currentPassword
                        }
                        onChange={(e) =>
                          setCurrentPassword(
                            e.target.value
                          )
                        }
                        autoComplete="current-password"
                        placeholder="Enter your current password"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-[var(--ljka-gold)] focus:ring-2 focus:ring-[var(--ljka-gold)]/20"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(
                            (value) =>
                              !value
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-[var(--ljka-primary)]"
                      >
                        {showCurrentPassword
                          ? <FaEyeSlash />
                          : <FaEye />}
                      </button>

                    </div>

                  </div>


                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--ljka-primary)] px-5 py-3.5 font-semibold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {loading
                      ? "Verifying..."
                      : "Verify Current Password"}

                  </button>

                </form>

              )}


              {/* =================================================
                  STEP 2
              ================================================= */}

              {step === 2 && (

                <form
                  onSubmit={updatePassword}
                  className="space-y-5"
                >

                  {/* NEW PASSWORD */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      New Password
                    </label>

                    <div className="relative">

                      <input
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(
                            e.target.value
                          )
                        }
                        autoComplete="new-password"
                        placeholder="Enter your new password"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-[var(--ljka-gold)] focus:ring-2 focus:ring-[var(--ljka-gold)]/20"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            (value) =>
                              !value
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-[var(--ljka-primary)]"
                      >
                        {showNewPassword
                          ? <FaEyeSlash />
                          : <FaEye />}
                      </button>

                    </div>

                  </div>


                  {/* PASSWORD GUIDELINES */}

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                    <p className="mb-3 text-sm font-semibold text-gray-700">
                      Password requirements
                    </p>

                    <div className="space-y-2 text-sm">

                      <p
                        className={
                          passwordRules.length
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        {passwordRules.length
                          ? "✓"
                          : "○"}{" "}
                        At least 6 characters
                      </p>

                      <p
                        className={
                          passwordRules.letter
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        {passwordRules.letter
                          ? "✓"
                          : "○"}{" "}
                        At least one letter
                      </p>

                      <p
                        className={
                          passwordRules.number
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        {passwordRules.number
                          ? "✓"
                          : "○"}{" "}
                        At least one number
                      </p>

                    </div>

                  </div>


                  {/* CONFIRM PASSWORD */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Confirm New Password
                    </label>

                    <div className="relative">

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          confirmPassword
                        }
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                        autoComplete="new-password"
                        placeholder="Confirm your new password"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-[var(--ljka-gold)] focus:ring-2 focus:ring-[var(--ljka-gold)]/20"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (value) =>
                              !value
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-[var(--ljka-primary)]"
                      >
                        {showConfirmPassword
                          ? <FaEyeSlash />
                          : <FaEye />}
                      </button>

                    </div>

                    {confirmPassword &&
                      newPassword ===
                        confirmPassword && (
                        <p className="mt-2 text-sm font-medium text-green-600">
                          ✓ Passwords match
                        </p>
                      )}

                  </div>


                  {/* BUTTONS */}

                  <div className="flex flex-col gap-3 sm:flex-row">

                    <button
                      type="button"
                      onClick={
                        goBackToVerification
                      }
                      disabled={loading}
                      className="w-full rounded-xl border border-gray-300 px-5 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={
                        loading ||
                        passwordScore < 3 ||
                        newPassword !==
                          confirmPassword
                      }
                      className="w-full rounded-xl bg-[var(--ljka-primary)] px-5 py-3.5 font-semibold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {loading
                        ? "Updating..."
                        : "Update Password"}

                    </button>

                  </div>

                </form>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UpdatePassword;