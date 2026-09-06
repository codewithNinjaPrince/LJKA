import mongoose from "mongoose";

const sahyogAlertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SahyogAlert = mongoose.model(
  "SahyogAlert",
  sahyogAlertSchema
);

export default SahyogAlert;