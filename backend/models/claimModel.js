import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    claimId: { type: String, required: true, unique: true, index: true },
    claimantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    deceasedMemberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    deceasedMemberCode: { type: String, trim: true, default: "" },
    deceasedFullName: { type: String, required: true, trim: true },
    dateOfDeath: { type: Date, required: true },
    relationship: { type: String, trim: true, default: "member" },
    causeOfDeath: { type: String, trim: true, default: "" },
    placeOfDeath: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "", maxlength: 5000 },
    nomineeName: { type: String, trim: true, default: "" },
    nomineeMobile: { type: String, trim: true, default: "" },
    contactMobile: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    documentNotes: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["pending", "in_review", "approved", "rejected", "closed"],
      default: "pending",
      index: true,
    },
    adminNotes: { type: String, trim: true, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

claimSchema.index({ status: 1, createdAt: -1 });
claimSchema.index({ claimantId: 1, createdAt: -1 });

export default mongoose.model("Claim", claimSchema);
