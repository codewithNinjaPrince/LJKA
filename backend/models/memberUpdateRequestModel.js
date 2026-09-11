import mongoose from "mongoose";

const memberUpdateRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Only the fields the member wants to change.
    requestedChanges: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // Snapshot of the existing values at the time the request was submitted.
    // This allows the future admin portal to compare OLD vs NEW.
    currentValues: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    adminRemarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Only one pending update request per member.
memberUpdateRequestSchema.index(
  { userId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: "pending",
    },
  }
);

const MemberUpdateRequest = mongoose.model(
  "MemberUpdateRequest",
  memberUpdateRequestSchema
);

export default MemberUpdateRequest;