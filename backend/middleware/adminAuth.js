import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const adminAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.token || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;
    if (!token) return res.status(401).json({ success: false, message: "Authentication required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "admin") return res.status(401).json({ success: false, message: "Invalid administrative token" });
    const admin = await Admin.findById(decoded.id).select("+password");
    if (!admin || admin.status !== "active" || admin.authVersion !== decoded.version) {
      return res.status(401).json({ success: false, message: "Administrative access is no longer active" });
    }
    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.admin?.role)
    ? next()
    : res.status(403).json({ success: false, message: "Insufficient role" });

export const requirePermission = (module, action) => (req, res, next) => {
  if (req.admin?.role === "superadmin") return next();
  const permission = req.admin?.permissions.find((entry) => entry.module === module);
  const actions = permission?.actions || [];
  if (actions.includes(action) || (action === "view" && actions.length > 0)) {
    return next();
  }
  return res.status(403).json({ success: false, message: `Permission denied: ${module}.${action}` });
};
