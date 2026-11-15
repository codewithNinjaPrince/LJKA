import mongoose from "mongoose";

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