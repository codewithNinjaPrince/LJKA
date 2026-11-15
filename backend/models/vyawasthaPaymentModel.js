import mongoose from "mongoose";

const paymentProofSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: true,
    },

    secureUrl: {
      type: String,
      required: true,
    },

    resourceType: {
      type: String,
      enum: ["image", "raw"],
      required: true,
    },

    format: {
      type: String,
      enum: ["jpg", "jpeg", "png", "webp", "pdf"],
      required: true,
    },

    originalFilename: {
      type: String,
      required: true,
      trim: true,
    },

    fileSize: {
      type: Number,
      required: true,
      min: 1,
      max: 1024 * 1024,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const vyawasthaPaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    payerName: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    utrNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    // Mandatory for all NEW payment submissions.
    // Optional at schema level to preserve historical records.
    paymentProof: {
      type: paymentProofSchema,
      default: undefined,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },

    paymentFor: {
      type: String,
      default: "vyawastha_annual",
      index: true,
    },

    financialYear: {
      type: String,
      required: true,
    },

    membershipExpiresAt: {
      type: Date,
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

vyawasthaPaymentSchema.index(
  {
    userId: 1,
    financialYear: 1,
    paymentFor: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      paymentStatus: "pending",
    },
  }
);

const VyawasthaPayment = mongoose.model(
  "VyawasthaPayment",
  vyawasthaPaymentSchema
);

export default VyawasthaPayment;
