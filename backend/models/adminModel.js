// import mongoose from "mongoose";

// const permissionSchema = new mongoose.Schema({
//   module: { type: String, required: true, trim: true },
//   actions: { type: [String], default: [] },
// }, { _id: false });

// const adminSchema = new mongoose.Schema({
//   fullName: { type: String, required: true, trim: true },
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   mobile: { type: String, trim: true, unique: true, sparse: true },
//   username: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   password: { type: String, required: true, select: false },
//   role: { type: String, enum: ["superadmin", "admin"], default: "admin", index: true },
//   // Admin accounts are provisioned by a superadmin. They do not go through
//   // the member KYC or approval process.
//   status: { type: String, enum: ["active", "disabled"], default: "active", index: true },
//   permissions: { type: [permissionSchema], default: [] },
//   lastLoginAt: { type: Date, default: null },
//   authVersion: { type: Number, default: 0 },
// }, { timestamps: true });

// adminSchema.index({ role: 1, status: 1, createdAt: -1 });
// export default mongoose.model("Admin", adminSchema);

import mongoose from "mongoose";

const ADMIN_MODULES = [
  "members",
  "member-update-requests",
  "sahyog-alerts",
  "sahyog",
  "sahyog-donations",
  "contacts",
  "vyawastha-payments",
];

const ADMIN_ACTIONS = [
  "view",
  "create",
  "update",
  "delete",
  "approve",
  "reject",
  "verify",
];

const permissionSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: true,
      trim: true,
      enum: ADMIN_MODULES,
    },
    actions: {
      type: [String],
      default: [],
      validate: {
        validator: (actions) =>
          Array.isArray(actions) &&
          actions.every((action) => ADMIN_ACTIONS.includes(action)) &&
          new Set(actions).size === actions.length,
        message: "Permission actions contain an invalid or duplicate action",
      },
    },
  },
  { _id: false }
);

const adminSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, uppercase: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    mobile: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      set: (value) => (typeof value === "string" && value.trim() ? value.trim() : undefined),
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
      match: /^[a-z0-9._-]+$/,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["superadmin", "admin"],
      default: "admin",
      index: true,
      immutable: true,
    },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "disabled",
      index: true,
    },
    permissions: { type: [permissionSchema], default: [] },
    lastLoginAt: { type: Date, default: null },
    authVersion: { type: Number, default: 0, min: 0, validate: Number.isSafeInteger },
  },
  { timestamps: true }
);

adminSchema.index({ role: 1, status: 1, createdAt: -1 });

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);

