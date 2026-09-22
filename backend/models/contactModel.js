import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["new", "read", "in_progress", "resolved"],
      default: "new",
    },

    // Superadmin can assign a message to an administrator for follow-up.
    // Administrators with contact view permission can see every message.
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
      index: true,
    },

    assignedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

contactSchema.index({ assignedTo: 1, status: 1, createdAt: -1 });

const ContactModel =
  mongoose.models.Contact ||
  mongoose.model("Contact", contactSchema);

export default ContactModel;
