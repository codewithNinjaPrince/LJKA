import AuditLog from "../models/auditLogModel.js";

export const audit = (req, { action, module, resourceId, metadata = {} }) =>
  AuditLog.create({
    actorId: req.admin?._id || null,
    actorName: req.admin?.fullName || "System",
    actorRole: req.admin?.role || "system",
    action, module, resourceId: resourceId ? String(resourceId) : null, metadata,
    ip: req.ip, userAgent: req.get("user-agent") || "",
  }).catch((error) => console.error("AUDIT LOG ERROR:", error.message));
