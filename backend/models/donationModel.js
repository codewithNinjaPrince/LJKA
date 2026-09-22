import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donationId: { type: String, required: true, unique: true, index: true },
  sahyogId: { type: mongoose.Schema.Types.ObjectId, ref: "Sahyog", required: true, index: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  donorName: { type: String, trim: true, default: "" },
  donorEmail: { type: String, trim: true, lowercase: true, default: "" },
  donorMobile: { type: String, trim: true, default: "" },
  isAnonymous: { type: Boolean, default: false },
  amount: { type: Number, required: true, min: 1 },
  paymentStatus: { type: String, enum: ["pending", "success", "failed", "refunded"], default: "pending", index: true },
  transactionId: { type: String, trim: true, default: "" },
  paymentMethod: { type: String, trim: true, default: "" },
  verifiedAt: { type: Date, default: null },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
}, { timestamps: true });

donationSchema.index({ sahyogId: 1, paymentStatus: 1, createdAt: -1 });
donationSchema.index({ paymentStatus: 1, createdAt: -1 });
donationSchema.index({ paymentStatus: 1, verifiedAt: -1, createdAt: -1 });
export default mongoose.model("Donation", donationSchema);
