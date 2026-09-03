import mongoose from "mongoose";

const memberCounterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    sequence: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const MemberCounter = mongoose.model(
  "MemberCounter",
  memberCounterSchema
);

export default MemberCounter;