import mongoose from "mongoose";

const referralCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  label: { type: String, trim: true, default: "" },
  // A referral belongs to one real contact.  These values are deliberately
  // separate from the member who later uses the code.
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, required: true, unique: true, trim: true, index: true },
  isActive: { type: Boolean, default: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
}, { timestamps: true });

export default mongoose.model("ReferralCode", referralCodeSchema);
