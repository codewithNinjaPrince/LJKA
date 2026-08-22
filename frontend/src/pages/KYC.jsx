import React, { useContext, useEffect, useMemo, useState } from "react";
import { LJKAContext } from "../context/LJKAContext";
import axios from "axios";
import { toastError, toastSuccess, toastInfo } from "../utils/toast";
import locationData from "../data/india/locationData.json";

/* ---------------- HELPERS ---------------- */
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidAadhaar = (value) => /^\d{12}$/.test(value);
const isValidPincode = (value) => /^\d{6}$/.test(value);
const isValidMobile = (value) => /^[6-9]\d{9}$/.test(value);

const pad = (n) => String(n).padStart(2, "0");
const toDateInputValue = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Calendar bounds: can't pick a DOB younger than 18, and can't pick a DOB
// that makes someone 60 or older.
const getDobBounds = () => {
  const today = new Date();

  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  ); // exactly 18 today

  const minDate = new Date(
    today.getFullYear() - 60,
    today.getMonth(),
    today.getDate() + 1
  ); // one day short of turning 60 today

  return { min: toDateInputValue(minDate), max: toDateInputValue(maxDate) };
};

const calculateAge = (dobStr) => {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

const EMPLOYMENT_OPTIONS = [
  { value: "government", label: "Government" },
  { value: "private", label: "Private" },
  { value: "business", label: "Business" },
  { value: "self-employed", label: "Self Employed" },
  { value: "student", label: "Student" },
];

/* ---------------- COMPONENT ---------------- */
const KYC = () => {
  const { token, navigate, backendUrl } = useContext(LJKAContext);
  const dobBounds = useMemo(getDobBounds, []);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    mobile: "",
    fatherHusbandName: "",
    aadhaar: "",
    dob: "",
    gender: "",

    state: "",
    district: "",
    tehsil: "",
    townVillage: "",
    addressLine: "",
    pincode: "",

    employmentStatus: "",
    occupation: "",
    referralCode: "",

    nomineeName: "",
    nomineeMobile: "",
    nomineeEmail: "",
    nomineeRelationship: "",
  });

  const stateOptions = locationData.states;

  const selectedState = stateOptions.find(
    (state) => String(state.code) === String(formData.state)
  );

  const districtOptions = selectedState?.districts || [];

  const selectedDistrict = districtOptions.find(
    (district) => String(district.code) === String(formData.district)
  );

  const tehsilOptions = selectedDistrict?.tehsils || [];

  const selectedTehsil = tehsilOptions.find(
    (tehsil) => String(tehsil.code) === String(formData.tehsil)
  );

  /* ---------------- ACCESS GUARD ---------------- */
  // KYC can only be opened while logged in, and only if it isn't done already.
  useEffect(() => {
    if (!token) {
      toastError("Please login to complete your KYC");
      navigate("/login");
      return;
    }

    if (localStorage.getItem("kycCompleted") === "true") {
      toastInfo("Your KYC is already completed");
      navigate("/user/view-profile");
    }
  }, [token, navigate]);

  if (!token) return null;

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      // Reset dependent selections whenever a parent changes
      if (name === "state") {
        next.district = "";
        next.tehsil = "";
      }
      if (name === "district") {
        next.tehsil = "";
      }

      return next;
    });
  };

  const handleDigitsOnly = (name, max) => (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, max);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Mirrors submitKYC controller validation order, each surfaced via toast
    if (!isValidMobile(formData.mobile)) {
      toastError("Please enter a valid 10 digit mobile number");
      return;
    }

    if (!formData.fatherHusbandName.trim()) {
      toastError("Father / Husband name is required");
      return;
    }

    if (!isValidAadhaar(formData.aadhaar)) {
      toastError("Aadhaar number must be exactly 12 digits");
      return;
    }

    if (!formData.dob) {
      toastError("Date of birth is required");
      return;
    }

    const age = calculateAge(formData.dob);

    if (age < 18) {
      toastError("You must be at least 18 years old to continue");
      return;
    }

    if (age >= 60) {
      toastError("Age must be below 60 years to register");
      return;
    }

    if (!formData.gender) {
      toastError("Please select your gender");
      return;
    }

    if (!formData.state) {
      toastError("Please select your state");
      return;
    }

    if (!formData.district) {
      toastError("Please select your district");
      return;
    }

    if (!formData.tehsil) {
      toastError("Please select your Tehsil / Sub-District");
      return;
    }

    if (!formData.townVillage.trim()) {
      toastError("Town / Village is required");
      return;
    }

    if (!formData.addressLine.trim()) {
      toastError("Address is required");
      return;
    }

    if (!isValidPincode(formData.pincode)) {
      toastError("Pincode must be exactly 6 digits");
      return;
    }

    if (!formData.employmentStatus) {
      toastError("Please select your employment status");
      return;
    }

    if (!formData.occupation.trim()) {
      toastError("Occupation is required");
      return;
    }

    if (!formData.nomineeName.trim()) {
      toastError("Nominee name is required");
      return;
    }

    if (!isValidMobile(formData.nomineeMobile)) {
      toastError("Please enter a valid nominee mobile number");
      return;
    }

    if (formData.nomineeEmail && !isValidEmail(formData.nomineeEmail)) {
      toastError("Please enter a valid nominee email address");
      return;
    }

    if (!formData.nomineeRelationship.trim()) {
      toastError("Nominee relationship is required");
      return;
    }

    // Shape exactly matches what submitKYC destructures from req.body
    const payload = {
      referralCode: formData.referralCode.trim(),
      mobile: formData.mobile,
      fatherHusbandName: formData.fatherHusbandName.trim(),
      aadhaar: formData.aadhaar,
      dob: formData.dob,
      gender: formData.gender,
      address: {
        stateCode: selectedState?.code,
        stateName: selectedState?.name,

        districtCode: selectedDistrict?.code,
        districtName: selectedDistrict?.name,

        tehsilCode: selectedTehsil?.code,
        tehsilName: selectedTehsil?.name,

        townVillage: formData.townVillage.trim(),

        address: formData.addressLine,
        pincode: formData.pincode,
      },
      employmentStatus: formData.employmentStatus,
      occupation: formData.occupation.trim(),
      nominee: {
        name: formData.nomineeName.trim(),
        mobile: formData.nomineeMobile,
        email: formData.nomineeEmail.trim(),
        relationship: formData.nomineeRelationship,
      },
    };

    try {
      setLoading(true);

      // authUser middleware — adjust header if your middleware expects
      // "Authorization: Bearer <token>" instead of a raw "token" header.
      const res = await axios.post(
        `${backendUrl}/api/user/kyc/submit`,
        payload,
        { headers: { token } }
      );

      if (!res.data?.success) {
        toastError(res.data?.message || "Unable to submit KYC details");
        return;
      }

      localStorage.setItem("kycCompleted", "true");
      toastSuccess("KYC completed successfully 🎉");
      navigate("/user/view-profile");
    } catch (err) {
      const response = err?.response;

      if (response?.data?.message === "KYC has already been completed") {
        localStorage.setItem("kycCompleted", "true");
        toastInfo("Your KYC is already completed");
        navigate("/user/view-profile");
        return;
      }

      toastError(response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
 /* ---------------- UI ---------------- */
return (
  <div className="min-h-[calc(100vh-130px)] bg-[var(--ljka-bg)] px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
    <div className="mx-auto grid w-full max-w-7xl items-start gap-10 lg:grid-cols-[0.72fr_1.28fr]">

      {/* LEFT INFORMATION — DESKTOP */}
      <div className="hidden lg:block lg:sticky lg:top-28">
        <div className="max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/40 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[var(--ljka-primary)] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[var(--ljka-gold)]" />
            LJKA MEMBERSHIP
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-[var(--ljka-primary)] xl:text-5xl">
            Complete your
            <span className="block text-[var(--ljka-gold)]">
              KYC details
            </span>
          </h1>

          <p className="mt-5 text-base leading-7 text-[var(--ljka-muted)]">
            Complete your personal, address, employment and nominee details
            to activate your LJKA membership.
          </p>

          <div className="mt-8 rounded-2xl border border-[var(--ljka-gold)]/30 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[var(--ljka-primary)]">
              Why KYC is required?
            </p>

            <p className="mt-2 text-xs leading-6 text-[var(--ljka-muted)]">
              Your KYC information helps LJKA maintain accurate member
              records and provide membership benefits securely.
            </p>
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

      {/* KYC CARD */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-[820px] rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_15px_50px_rgba(5,27,50,0.10)] sm:p-7 lg:p-8"
      >
        {/* MOBILE HEADING */}
        <div className="mb-7 text-center lg:hidden">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ljka-primary)] text-sm font-bold text-[var(--ljka-gold)] shadow-sm">
            KYC
          </div>

          <h1 className="mt-3 text-2xl font-bold text-[var(--ljka-primary)]">
            Complete Your KYC
          </h1>

          <p className="mt-1 text-sm text-[var(--ljka-muted)]">
            A few more details to activate your LJKA account
          </p>
        </div>

        {/* DESKTOP CARD TITLE */}
        <div className="mb-8 hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
            Member Verification
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[var(--ljka-primary)]">
            Complete Your KYC
          </h2>

          <p className="mt-1 text-sm text-[var(--ljka-muted)]">
            Please provide accurate information to complete your membership.
          </p>
        </div>

        <div className="space-y-8">

          {/* PERSONAL DETAILS */}
          <section>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-[var(--ljka-primary)]">
                Personal Details
              </h3>

              <p className="mt-1 text-sm text-[var(--ljka-muted)]">
                Enter your basic personal information.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="ljka-login-label">
                  Mobile Number
                </label>

                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleDigitsOnly("mobile", 10)}
                  placeholder="Enter mobile number"
                  inputMode="numeric"
                  className="ljka-login-input"
                />
              </div>

              <div>
                <label className="ljka-login-label">
                  Father / Husband Name
                </label>

                <input
                  name="fatherHusbandName"
                  value={formData.fatherHusbandName}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="ljka-login-input"
                />
              </div>

              <div>
                <label className="ljka-login-label">
                  Aadhaar Number
                </label>

                <input
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleDigitsOnly("aadhaar", 12)}
                  placeholder="Enter 12 digit Aadhaar number"
                  inputMode="numeric"
                  className="ljka-login-input"
                />
              </div>

              <div>
                <label className="ljka-login-label">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="ljka-login-input"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="ljka-login-label">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  min={dobBounds.min}
                  max={dobBounds.max}
                  className="ljka-login-input"
                  required
                />

                <p className="mt-1.5 px-1 text-xs text-[var(--ljka-muted)]">
                  Age must be 18 years or above and below 60 years.
                </p>
              </div>
            </div>
          </section>

          {/* ADDRESS DETAILS */}
          <section className="border-t border-gray-100 pt-8">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-[var(--ljka-primary)]">
                Address Details
              </h3>

              <p className="mt-1 text-sm text-[var(--ljka-muted)]">
                Select and enter your current residential address.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="ljka-login-label">State</label>

                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="ljka-login-input"
                >
                  <option value="">Select State</option>

                  {stateOptions.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="ljka-login-label">District</label>

                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!formData.state}
                  className="ljka-login-input"
                >
                  <option value="">Select District</option>

                  {districtOptions.map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="ljka-login-label">
                  Tehsil / Sub-District
                </label>

                <select
                  name="tehsil"
                  value={formData.tehsil}
                  onChange={handleChange}
                  disabled={!formData.district}
                  className="ljka-login-input"
                >
                  <option value="">Select Tehsil / Sub-District</option>

                  {tehsilOptions.map((tehsil) => (
                    <option key={tehsil.code} value={tehsil.code}>
                      {tehsil.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="ljka-login-label">
                  Town / Village / City
                </label>

                <input
                  name="townVillage"
                  value={formData.townVillage}
                  onChange={handleChange}
                  placeholder="Enter town or village"
                  className="ljka-login-input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="ljka-login-label">
                  Address
                </label>

                <textarea
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  rows={2}
                  placeholder="House No., Street or Landmark"
                  className="ljka-login-input resize-none"
                />
              </div>

              <div>
                <label className="ljka-login-label">
                  Pincode
                </label>

                <input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleDigitsOnly("pincode", 6)}
                  placeholder="Enter pincode"
                  inputMode="numeric"
                  maxLength={6}
                  className="ljka-login-input"
                />
              </div>
            </div>
          </section>

          {/* EMPLOYMENT DETAILS */}
          <section className="border-t border-gray-100 pt-8">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-[var(--ljka-primary)]">
                Employment Details
              </h3>

              <p className="mt-1 text-sm text-[var(--ljka-muted)]">
                Tell us about your current employment.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="ljka-login-label">
                  Employment Status
                </label>

                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  className="ljka-login-input"
                >
                  <option value="">Select Employment Status</option>

                  {EMPLOYMENT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="ljka-login-label">
                  Occupation / Job Role
                </label>

                <input
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Enter your occupation"
                  className="ljka-login-input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="ljka-login-label">
                  Referral Code
                </label>

                <input
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  placeholder="e.g. AY92"
                  className="ljka-login-input"
                />
              </div>
            </div>
          </section>

          {/* NOMINEE DETAILS */}
          <section className="border-t border-gray-100 pt-8">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-[var(--ljka-primary)]">
                Nominee Details
              </h3>

              <p className="mt-1 text-sm text-[var(--ljka-muted)]">
                Provide details of your registered nominee.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="ljka-login-label">
                  Nominee Full Name
                </label>

                <input
                  name="nomineeName"
                  value={formData.nomineeName}
                  onChange={handleChange}
                  placeholder="Enter nominee name"
                  className="ljka-login-input"
                />
              </div>

              <div>
                <label className="ljka-login-label">
                  Nominee Mobile Number
                </label>

                <input
                  name="nomineeMobile"
                  value={formData.nomineeMobile}
                  onChange={handleDigitsOnly("nomineeMobile", 10)}
                  placeholder="Enter nominee mobile number"
                  inputMode="numeric"
                  className="ljka-login-input"
                />
              </div>

              <div>
                <label className="ljka-login-label">
                  Nominee Email
                  <span className="ml-1 font-normal text-[var(--ljka-muted)]">
                    (Optional)
                  </span>
                </label>

                <input
                  name="nomineeEmail"
                  value={formData.nomineeEmail}
                  onChange={handleChange}
                  placeholder="Enter nominee email"
                  type="email"
                  className="ljka-login-input"
                />
              </div>

              <div>
                <label className="ljka-login-label">
                  Relationship
                </label>

                <select
                  name="nomineeRelationship"
                  value={formData.nomineeRelationship}
                  onChange={handleChange}
                  className="ljka-login-input"
                >
                  <option value="">Select Relationship</option>
                  <option value="brother">Brother</option>
                  <option value="sister">Sister</option>
                  <option value="mother">Mother</option>
                  <option value="father">Father</option>
                  <option value="husband">Husband</option>
                  <option value="wife">Wife</option>
                  <option value="son">Son</option>
                  <option value="daughter">Daughter</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </section>

          {/* SUBMIT */}
          <div className="border-t border-gray-100 pt-7">
            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102b45] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Submitting KYC...</span>
                </>
              ) : (
                <>
                  Complete KYC
                  <span className="text-[var(--ljka-gold)]">→</span>
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-[var(--ljka-muted)]">
              Please review your information carefully before submitting.
            </p>
          </div>
        </div>
      </form>
    </div>

    <style>{`
      .ljka-login-label {
        display: block;
        margin-bottom: 6px;
        font-size: 12px;
        font-weight: 600;
        color: var(--ljka-primary);
      }

      .ljka-login-input {
        width: 100%;
        border: 1px solid #d9dde3;
        border-radius: 9px;
        background: #fff;
        padding: 12px 13px;
        color: #172b3d;
        outline: none;
        font-size: 14px;
        transition: 0.2s;
      }

      .ljka-login-input::placeholder {
        color: #9ca3af;
      }

      .ljka-login-input:focus {
        border-color: var(--ljka-gold);
        box-shadow: 0 0 0 3px rgba(232, 200, 116, 0.14);
      }

      .ljka-login-input:disabled {
        cursor: not-allowed;
        background: #f8fafc;
        opacity: 0.7;
      }

      select.ljka-login-input {
        cursor: pointer;
      }

      textarea.ljka-login-input {
        min-height: 90px;
      }
    `}</style>
  </div>
);
};

export default KYC;