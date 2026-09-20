import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null, index: true },
  actorName: { type: String, default: "System" },
  actorRole: { type: String, default: "system" },
  action: { type: String, required: true },
  module: { type: String, required: true, index: true },
  resourceId: { type: String, default: null },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  ip: String,
  userAgent: String,
}, { timestamps: true });

auditLogSchema.index({ createdAt: -1 });
export default mongoose.model("AuditLog", auditLogSchema);
