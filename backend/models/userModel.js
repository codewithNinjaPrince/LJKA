import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // ACCOUNT / REGISTRATION
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  emailVerified: { type: Boolean, default: false },

  // KYC
  mobile: { type: String, trim: true },
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
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;