import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // ACCOUNT / REGISTRATION
  fullName: { type: String, required: true, trim: true, uppercase: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  // Kept separate from KYC and payment state so an administrative suspension
  // is enforced at authentication time without changing membership records.
  accountStatus: { type: String, enum: ["active", "disabled", "deceased"], default: "active", index: true },

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
  
  // Search-ready values used by the public member directory. They are
  // deliberately non-sensitive: name, member ID and mobile only.
  publicSearchTerms: {
    type: [String],
    default: [],
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
  fatherHusbandName: { type: String, trim: true, uppercase: true },
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

  employmentStatus: { type: String, enum: ["government", "private", "business", "others"] },
  occupation: { type: String, trim: true },

  nominee: {
    name: { type: String, trim: true, uppercase: true },
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
userSchema.index({ kycCompleted: 1, kycCompletedAt: -1, _id: -1 });
userSchema.index({ kycCompleted: 1, "address.stateCode": 1, kycCompletedAt: -1, _id: -1 });
userSchema.index({ kycCompleted: 1, "address.districtCode": 1, kycCompletedAt: -1, _id: -1 });
userSchema.index({ kycCompleted: 1, "address.tehsilCode": 1, kycCompletedAt: -1, _id: -1 });
userSchema.index({ kycCompleted: 1, employmentStatus: 1, kycCompletedAt: -1, _id: -1 });
userSchema.index({ kycCompleted: 1, publicSearchTerms: 1, kycCompletedAt: -1, _id: -1 });

const normalizeSearch = (value = "") =>
  String(value).toLowerCase().replace(/\s+/g, "").trim();

const searchPrefixes = (value) => {
  const normalized = normalizeSearch(value);
  if (!normalized) return [];

  return Array.from(
    { length: Math.min(normalized.length, 48) },
    (_, index) => normalized.slice(0, index + 1)
  );
};

export const createPublicSearchTerms = ({ fullName, memberId, mobile }) => {
  const nameParts = String(fullName || "").split(/\s+/);

  return [...new Set([
    ...searchPrefixes(fullName),
    ...nameParts.flatMap(searchPrefixes),
    ...searchPrefixes(memberId),
    ...searchPrefixes(mobile),
  ])];
};

userSchema.pre("save", function updatePublicSearchTerms() {
  // Every future KYC completion receives an ordering timestamp even when a
  // caller omitted it. The directory must never fall back to signup time.
  if (this.isModified("kycCompleted") && this.kycCompleted && !this.kycCompletedAt) {
    this.kycCompletedAt = new Date();
  }
  if (
    this.isModified("fullName") ||
    this.isModified("memberId") ||
    this.isModified("mobile")
  ) {
    this.publicSearchTerms = createPublicSearchTerms(this);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
