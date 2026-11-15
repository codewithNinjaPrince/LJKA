// import jwt from "jsonwebtoken";
// import Admin from "../models/adminModel.js";

// export const adminAuth = async (req, res, next) => {
//   try {
//     const header = req.headers.authorization || req.headers.token || "";
//     const token = header.startsWith("Bearer ") ? header.slice(7) : header;
//     if (!token) return res.status(401).json({ success: false, message: "Authentication required" });
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.type !== "admin") return res.status(401).json({ success: false, message: "Invalid administrative token" });
//     const admin = await Admin.findById(decoded.id).select("+password");
//     if (!admin || admin.status !== "active" || admin.authVersion !== decoded.version) {
//       return res.status(401).json({ success: false, message: "Administrative access is no longer active" });
//     }
//     req.admin = admin;
//     next();
//   } catch {
//     return res.status(401).json({ success: false, message: "Invalid or expired token" });
//   }
// };

// export const requireRole = (...roles) => (req, res, next) =>
//   roles.includes(req.admin?.role)
//     ? next()
//     : res.status(403).json({ success: false, message: "Insufficient role" });

// export const requirePermission = (module, action) => (req, res, next) => {
//   if (req.admin?.role === "superadmin") return next();
//   const permission = req.admin?.permissions.find((entry) => entry.module === module);
//   const actions = permission?.actions || [];
//   if (actions.includes(action) || (action === "view" && actions.length > 0)) {
//     return next();
//   }
//   return res.status(403).json({ success: false, message: `Permission denied: ${module}.${action}` });
// };


import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

const JWT_ISSUER = "ljka-admin-api";
const JWT_AUDIENCE = "ljka-admin-portal";

export const adminAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";

  // Accept only the standard Bearer authorization scheme.
  const match = header.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1]?.trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired administrative token",
    });
  }

  if (
    !decoded ||
    typeof decoded !== "object" ||
    decoded.type !== "admin" ||
    typeof decoded.id !== "string" ||
    !Number.isSafeInteger(decoded.version)
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid administrative token",
    });
  }

  try {
    // Password is excluded by the model's select:false setting.
    const admin = await Admin.findById(decoded.id);

    if (
      !admin ||
      admin.status !== "active" ||
      admin.authVersion !== decoded.version
    ) {
      return res.status(401).json({
        success: false,
        message: "Administrative access is no longer active",
      });
    }

    req.admin = admin;
    return next();
  } catch (error) {
    console.error(
      "ADMIN AUTH DATABASE ERROR:",
      error?.message || "Unknown error"
    );

    return res.status(503).json({
      success: false,
      message: "Authentication service temporarily unavailable",
    });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (roles.includes(req.admin?.role)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Insufficient role",
  });
};

export const requirePermission = (module, action) => (req, res, next) => {
  if (req.admin?.role === "superadmin") {
    return next();
  }

  const permission = req.admin?.permissions?.find(
    (entry) => entry.module === module
  );

  const actions = permission?.actions || [];

  const allowed =
    actions.includes(action) ||
    (action === "view" && actions.length > 0);

  if (allowed) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: `Permission denied: ${module}.${action}`,
  });
};
