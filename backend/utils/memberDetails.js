import validator from "validator";
import ReferralCode from "../models/referralCodeModel.js";
import { ageFromCalendarDate, parseCalendarDate } from "./calendarDate.js";
import { ensureLegacyReferralCodes } from "./legacyReferrals.js";

const EMPLOYMENT = ["government", "private", "business", "others"];
const GENDERS = ["male", "female", "other"];

export const buildAddress = (address = {}) => ({
  stateCode: Number(address.stateCode),
  stateName: String(address.stateName || "").trim(),
  districtCode: Number(address.districtCode),
  districtName: String(address.districtName || "").trim(),
  tehsilCode: Number(address.tehsilCode),
  tehsilName: String(address.tehsilName || "").trim(),
  townVillage: String(address.townVillage || "").trim(),
  address: String(address.address || "").trim(),
  pincode: String(address.pincode || "").trim(),
});

export const validateMemberDetails = async (body, { requirePassword = false, requireAadhaar = false, requireReferral = false } = {}) => {
  const fullName = String(body.fullName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const mobile = String(body.mobile || "").trim();
  const fatherHusbandName = String(body.fatherHusbandName || "").trim();
  const aadhaar = String(body.aadhaar || "").trim();
  const gender = String(body.gender || "").trim();
  const employmentStatus = String(body.employmentStatus || "").trim();
  const occupation = String(body.occupation || "").trim();
  const referralCode = String(body.referralCode || "").trim().toUpperCase();
  const dob = parseCalendarDate(body.dob);
  const address = buildAddress(body.address || {});
  const nominee = {
    name: String(body.nominee?.name || "").trim(),
    mobile: String(body.nominee?.mobile || "").trim(),
    email: String(body.nominee?.email || "").trim().toLowerCase(),
    relationship: String(body.nominee?.relationship || "").trim(),
  };

  if (!fullName) return { error: "Full name is required" };
  if (body.email !== undefined && !validator.isEmail(email)) return { error: "A valid email is required" };
  if (!/^[6-9]\d{9}$/.test(mobile)) return { error: "A valid 10-digit mobile number is required" };
  if (!fatherHusbandName) return { error: "Father/Husband name is required" };
  if (requireAadhaar && !/^\d{12}$/.test(aadhaar)) return { error: "Aadhaar number must be exactly 12 digits" };
  if (aadhaar && !/^\d{12}$/.test(aadhaar)) return { error: "Aadhaar number must be exactly 12 digits" };
  if (!dob) return { error: "A valid date of birth is required" };

  const age = ageFromCalendarDate(dob);
  if (age < 18) return { error: "Member must be at least 18 years old" };
  if (age >= 60) return { error: "Age must be below 60 years" };
  if (!GENDERS.includes(gender)) return { error: "Gender is required" };

  if (!Number.isInteger(address.stateCode) || !address.stateName) return { error: "State is required" };
  if (!Number.isInteger(address.districtCode) || !address.districtName) return { error: "District is required" };
  if (!Number.isInteger(address.tehsilCode) || !address.tehsilName) return { error: "Tehsil is required" };
  if (!address.townVillage) return { error: "Town / village / city is required" };
  if (!address.address) return { error: "Address is required" };
  if (!/^\d{6}$/.test(address.pincode)) return { error: "Pincode must be exactly 6 digits" };

  if (!EMPLOYMENT.includes(employmentStatus)) return { error: "Employment status is required" };
  if (!occupation) return { error: "Occupation is required" };

  if (requireReferral) {
    if (!referralCode) return { error: "A referral code is required" };
    await ensureLegacyReferralCodes();
    const referral = await ReferralCode.findOne({ code: referralCode, isActive: true }).select("_id");
    if (!referral) return { error: "This referral code is invalid or inactive" };
  }

  if (!nominee.name) return { error: "Nominee name is required" };
  if (!/^[6-9]\d{9}$/.test(nominee.mobile)) return { error: "A valid nominee mobile number is required" };
  if (nominee.email && !validator.isEmail(nominee.email)) return { error: "Nominee email is invalid" };
  if (!nominee.relationship) return { error: "Nominee relationship is required" };

  if (requirePassword) {
    const password = String(body.password || "");
    if (password.length < 6 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return { error: "Password must include a letter and number and be at least 6 characters" };
    }
  }

  return {
    data: {
      fullName,
      email,
      mobile,
      fatherHusbandName,
      aadhaar: aadhaar || undefined,
      dob,
      gender,
      address,
      employmentStatus,
      occupation,
      referralCode: referralCode || undefined,
      nominee,
      password: body.password,
      accountStatus: ["active", "disabled", "deceased"].includes(body.accountStatus) ? body.accountStatus : "active",
    },
  };
};
