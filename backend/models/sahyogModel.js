import mongoose from "mongoose";

const sahyogSchema = new mongoose.Schema({
  sahyogId: { type: String, required: true, unique: true, index: true },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  photoUrl: { type: String, trim: true, default: "" },
  dateOfDeath: { type: Date, required: true },
  familyInfo: { type: String, trim: true, default: "" },
  description: { type: String, trim: true, default: "", maxlength: 5000 },
  address: { type: String, trim: true, default: "" },
  contactName: { type: String, trim: true, default: "" },
  contactMobile: { type: String, trim: true, default: "" },
  targetAmount: { type: Number, min: 0, default: null },
  minimumDonationAmount: { type: Number, min: 1, default: null },
  status: { type: String, enum: ["draft", "pending", "active", "closed", "disabled"], default: "draft", index: true },
  paymentDetails: {
    bankName: { type: String, trim: true, default: "" }, accountHolderName: { type: String, trim: true, default: "" },
    accountNumber: { type: String, trim: true, default: "" }, ifsc: { type: String, trim: true, default: "" },
    upiId: { type: String, trim: true, default: "" }, paymentCode: { type: String, trim: true, default: "" }, branchName: { type: String, trim: true, default: "" },
  },
  publicPayment: { upiId: { type: String, trim: true, default: "" }, instructions: { type: String, trim: true, default: "" }, paymentCode: { type: String, trim: true, default: "" } },
  isDeleted: { type: Boolean, default: false, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
}, { timestamps: true });

sahyogSchema.index({ status: 1, isDeleted: 1, createdAt: -1 });
export default mongoose.model("Sahyog", sahyogSchema);
