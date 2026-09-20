import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  module: { type: String, required: true, trim: true },
  actions: { type: [String], default: [] },
}, { _id: false });

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobile: { type: String, trim: true, unique: true, sparse: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["superadmin", "admin"], default: "admin", index: true },
  status: { type: String, enum: ["pending", "active", "disabled", "rejected"], default: "pending", index: true },
  permissions: { type: [permissionSchema], default: [] },
  kyc: {
    dob: Date, address: String, idType: String, idNumber: String,
    documentUrl: String, profilePhotoUrl: String,
    status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  },
  lastLoginAt: { type: Date, default: null },
  authVersion: { type: Number, default: 0 },
}, { timestamps: true });

adminSchema.index({ role: 1, status: 1, createdAt: -1 });
export default mongoose.model("Admin", adminSchema);
