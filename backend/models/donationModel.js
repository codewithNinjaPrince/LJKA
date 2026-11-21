import mongoose from "mongoose";

const paymentProofAssetSchema = new mongoose.Schema({
  publicId: { type: String, required: true },
  secureUrl: { type: String, required: true },
  resourceType: { type: String, enum: ["image", "raw"], required: true },
  format: { type: String, enum: ["jpg", "jpeg", "png", "webp", "pdf"], required: true },
  originalFilename: { type: String, required: true, trim: true },
  fileSize: { type: Number, required: true, min: 1, max: 1024 * 1024 },
  uploadedAt: { type: Date, default: Date.now },
}, { _id: false });

const donationSchema = new mongoose.Schema({
  donationId: { type: String, required: true, unique: true, index: true },
  sahyogId: { type: mongoose.Schema.Types.ObjectId, ref: "Sahyog", required: true, index: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  donorName: { type: String, trim: true, uppercase: true, default: "" },
  donorEmail: { type: String, trim: true, lowercase: true, default: "" },
  donorMobile: { type: String, trim: true, default: "" },
  isAnonymous: { type: Boolean, default: false },
  amount: { type: Number, required: true, min: 1 },
  paymentStatus: { type: String, enum: ["pending", "success", "failed", "rejected", "refunded"], default: "pending", index: true },
  transactionId: { type: String, trim: true, uppercase: true, default: "" },
  paymentMethod: { type: String, trim: true, enum: ["bank_transfer", "upi", ""], default: "" },
  paymentProof: { type: String, default: "" },
  // Versioned Cloudinary proof for new submissions. `paymentProof` remains
  // unchanged so historical base64 records stay accessible.
  paymentProofAsset: { type: paymentProofAssetSchema, default: undefined },
  verifiedAt: { type: Date, default: null },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
}, { timestamps: true });

donationSchema.index({ sahyogId: 1, paymentStatus: 1, createdAt: -1 });
donationSchema.index({ paymentStatus: 1, createdAt: -1 });
donationSchema.index({ paymentStatus: 1, verifiedAt: -1, createdAt: -1 });
export default mongoose.model("Donation", donationSchema);
