import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // ACCOUNT / REGISTRATION
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  password: { type: String, required: true, minlength: 6 },

  passwordChangeVerifiedAt: {
    type: Date,
    default: null,
  },

  passwordChangeTokenHash: {
    type: String,
    default: null,
  },
  emailVerified: { type: Boolean, default: false },
  memberId: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },

  kycCompletedAt: {
    type: Date,
    default: null,
  },

  membershipStartDate: {
    type: Date,
    default: null,
  },

  membershipExpiresAt: {
    type: Date,
    default: null,
  },

  membershipRenewalReminderSentAt: {
    type: Date,
    default: null,
  },

  // KYC
  mobile: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    index: true,
  },
  mobileVerified: { type: Boolean, default: false },
  fatherHusbandName: { type: String, trim: true },
  aadhaar: { type: String, trim: true, unique: true, sparse: true, minlength: 12, maxlength: 12 },
  dob: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"] },

  address: {
    stateCode: { type: Number },
    stateName: { type: String, trim: true },

    districtCode: { type: Number },
    districtName: { type: String, trim: true },

    tehsilCode: { type: Number },
    tehsilName: { type: String, trim: true },

    townVillage: { type: String, trim: true },

    address: { type: String, trim: true },
    pincode: { type: String, trim: true },
  },

  employmentStatus: { type: String, enum: ["government", "private", "business", "self-employed", "student"] },
  occupation: { type: String, trim: true },

  nominee: {
    name: { type: String, trim: true },
    mobile: { type: String, trim: true },
    email: { type: String, trim: true },
    relationship: { type: String, trim: true },
  },

  referralCode: { type: String, trim: true },

  // KYC STATUS
  kycCompleted: { type: Boolean, default: false },

  membershipPaymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },

  // KYC CONSENT
  kycConsentAcceptedAt: {
    type: Date,
    default: null,
  },

  kycConsentTermsVersion: {
    type: String,
    default: "1.0",
  },

  kycConsentPrivacyVersion: {
    type: String,
    default: "1.0",
  },


}, { timestamps: true });

// Member listing is always restricted to completed members and sorted newest first.
userSchema.index({ kycCompleted: 1, createdAt: -1, _id: -1 });
userSchema.index({ kycCompleted: 1, "address.stateName": 1, createdAt: -1, _id: -1 });
userSchema.index({ kycCompleted: 1, "address.districtName": 1, createdAt: -1, _id: -1 });
userSchema.index({ kycCompleted: 1, "address.tehsilName": 1, createdAt: -1, _id: -1 });
userSchema.index({ kycCompleted: 1, employmentStatus: 1, createdAt: -1, _id: -1 });

const User = mongoose.model("User", userSchema);

export default User;