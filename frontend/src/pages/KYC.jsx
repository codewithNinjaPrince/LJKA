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
  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-[94%] max-w-4xl mx-auto
        mt-10 mb-16 sm:mt-14 sm:mb-20
        bg-white/5 backdrop-blur-xl
        border border-white/10 rounded-2xl
        p-6 sm:p-10
        shadow-2xl text-white
        flex flex-col gap-8
      "
    >
      {/* TITLE */}
      <div>
        <h2 className="text-3xl font-bold text-center tracking-wide">
          Complete Your KYC
        </h2>
        <p className="mt-2 text-center text-gray-400 text-10px">
          A few more details to activate your LJKA account
        </p>
      </div>

      {/* PERSONAL DETAILS */}
      <section className="flex flex-col gap-4">
        <h3 className="section-title">Personal Details</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleDigitsOnly("mobile", 10)}
            placeholder="Mobile Number"
            inputMode="numeric"
            className="dark-input"
          />

          <input
            name="fatherHusbandName"
            value={formData.fatherHusbandName}
            onChange={handleChange}
            placeholder="Father / Husband Name"
            className="dark-input"
          />

          <input
            name="aadhaar"
            value={formData.aadhaar}
            onChange={handleDigitsOnly("aadhaar", 12)}
            placeholder="Aadhaar Number (12 digits)"
            inputMode="numeric"
            className="dark-input"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="dark-input"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <div className="flex flex-col gap-1 md:col-span-2">
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              min={dobBounds.min}
              max={dobBounds.max}
              className="dark-input dob-input"
              required
            />
            <p className="text-xs text-gray-500 px-1">
              Age must be 18 and above, and below 60
            </p>
          </div>
        </div>
      </section>

      {/* ADDRESS DETAILS */}
      <section className="flex flex-col gap-4">
        <h3 className="section-title">Address Details</h3>

        <div className="grid gap-4 md:grid-cols-3">

          {/* STATE */}
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="dark-input"
          >
            <option value="">Select State</option>

            {stateOptions.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>


          {/* DISTRICT */}
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            disabled={!formData.state}
            className="dark-input"
          >
            <option value="">Select District</option>

            {districtOptions.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>


          {/* TEHSIL */}
          <select
            name="tehsil"
            value={formData.tehsil}
            onChange={handleChange}
            disabled={!formData.district}
            className="dark-input"
          >
            <option value="">Select Tehsil / Sub-District</option>

            {tehsilOptions.map((tehsil) => (
              <option key={tehsil.code} value={tehsil.code}>
                {tehsil.name}
              </option>
            ))}
          </select>


          {/* TOWN / VILLAGE */}
          <input
            name="townVillage"
            value={formData.townVillage}
            onChange={handleChange}
            placeholder="Town / Village / City"
            className="dark-input"
          />


          {/* ADDRESS LINE */}
          <textarea
            name="addressLine"
            value={formData.addressLine}
            onChange={handleChange}
            rows={2}
            placeholder="House No., Street or Landmark"
            className="dark-input md:col-span-2 resize-none"
          />


          {/* PINCODE */}
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleDigitsOnly("pincode", 6)}
            placeholder="Pincode"
            inputMode="numeric"
            maxLength={6}
            className="dark-input"
          />

        </div>
      </section>
      {/* EMPLOYMENT DETAILS */}
      <section className="flex flex-col gap-4">
        <h3 className="section-title">Employment Details</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <select
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleChange}
            className="dark-input"
          >
            <option value="">Select Employment Status</option>
            {EMPLOYMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <input
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="Occupation / Job Role"
            className="dark-input"
          />

          <input
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            placeholder="Referral Code (e.x- AY92) "
            className="dark-input md:col-span-2"
          />
        </div>
      </section>

      {/* NOMINEE DETAILS */}
      <section className="flex flex-col gap-4">
        <h3 className="section-title">Nominee Details</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="nomineeName"
            value={formData.nomineeName}
            onChange={handleChange}
            placeholder="Nominee Full Name"
            className="dark-input"
          />

          <input
            name="nomineeMobile"
            value={formData.nomineeMobile}
            onChange={handleDigitsOnly("nomineeMobile", 10)}
            placeholder="Nominee Mobile Number"
            inputMode="numeric"
            className="dark-input"
          />

          <input
            name="nomineeEmail"
            value={formData.nomineeEmail}
            onChange={handleChange}
            placeholder="Nominee Email (optional)"
            type="email"
            className="dark-input"
          />

          <select
            name="nomineeRelationship"
            value={formData.nomineeRelationship}
            onChange={handleChange}
            className="dark-input"
          >
            <option value="">Relationship with Nominee</option>
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
      </section>

      {/* SUBMIT */}
      <button
        disabled={loading}
        className={`primary-btn flex items-center justify-center gap-2
          ${loading && "opacity-60 cursor-not-allowed"}`}
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            <span className="text-sm">Submitting...</span>
          </>
        ) : (
          "Submit KYC"
        )}
      </button>

      {/* STYLES — same theme as Register.jsx */}
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

      .dark-input::placeholder {
        color: #9ca3af;
      }

      .dark-input:focus {
        border-color: white;
        background: rgba(0,0,0,0.8);
      }

      .dark-input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      select.dark-input option {
        background: #111;
        color: white;
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

      .dob-input {
  color-scheme: dark;
  cursor: pointer;
}

.dob-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
  opacity: 0.9;
}

.dob-input::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
      .primary-btn:hover {
        background: #e5e5e5;
        transform: translateY(-1px);
      }

      .section-title {
        font-size: 1.05rem;
        font-weight: 600;
        color: white;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 8px;
      }
    `}</style>
    </form>
  );
};

export default KYC;