import mongoose from "mongoose";

const emailOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      // No index: true here
    },

    attempts: {
      type: Number,
      default: 0,
    },

    verified: {
      type: Boolean,
      default: false,
    },
    purpose: {
    type: String,
    enum: ["registration", "forgot-password"],
    required: true,
  },
  },
  {
    timestamps: true,
  }
);

// Automatically delete OTP document after expiry
emailOtpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const EmailOtp = mongoose.model("EmailOtp", emailOtpSchema);

export default EmailOtp;