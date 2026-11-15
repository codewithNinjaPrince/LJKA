import express from "express";
import { adminAuth, requirePermission, requireRole } from "../middleware/adminAuth.js";
import { adminApiRateLimit, adminLoginRateLimit,} from "../middleware/adminRateLimit.js";
import * as admin from "../controller/adminController.js";
import * as claims from "../controller/claimController.js";
import {listVyawasthaPayments, verifyVyawasthaPayment, rejectVyawasthaPayment,} from "../controller/vyawasthaPaymentController.js";
import sahyogRouter from "./sahyogRoute.js";

const router = express.Router();
// Login is deliberately public, but rate-limited by IP and normalized username.
router.post("/auth/login", adminLoginRateLimit, admin.loginAdmin);

// All routes below this line require a valid, active admin JWT.
// The shared Redis limiter is keyed by authenticated admin ID.
router.use(adminAuth, adminApiRateLimit);

router.get("/auth/me", admin.getAdminMe);
router.get("/dashboard", admin.dashboard);

router.get("/activity", requireRole("superadmin"), admin.listActivity);

router.get("/admins", requireRole("superadmin"), admin.listAdmins);
router.post("/admins", requireRole("superadmin"), admin.createAdmin);
router.patch("/admins/:id", requireRole("superadmin"), admin.updateAdmin);
router.patch("/admins/:id/status", requireRole("superadmin"), admin.setAdminStatus);
router.delete("/admins/:id", requireRole("superadmin"), admin.deleteAdmin);
router.post("/admins/:id/reset-password", requireRole("superadmin"), admin.resetAdminPassword);
router.get("/admins/:id/rights", requireRole("superadmin"), admin.getRights);
router.put("/admins/:id/rights", requireRole("superadmin"), admin.updateRights);

router.get("/members", requirePermission("members", "view"), admin.listManagedMembers);
router.post("/members", requirePermission("members", "create"), admin.createManagedMember);
router.patch("/members/:id", requirePermission("members", "update"), admin.updateManagedMember);

router.get("/referrals", requireRole("superadmin"), admin.listReferrals);
router.get("/referrals/:id/users", requireRole("superadmin"), admin.listReferralUsers);
router.post("/referrals", requireRole("superadmin"), admin.createReferral);
router.patch("/referrals/:id", requireRole("superadmin"), admin.updateReferral);
router.delete("/referrals/:id", requireRole("superadmin"), admin.deleteReferral);

router.get("/contacts", requirePermission("contacts", "view"), admin.listContacts);
router.get("/contacts/assignees", requireRole("superadmin"), admin.listContactAssignees);
router.get("/contacts/:id", requirePermission("contacts", "view"), admin.getContact);
router.patch("/contacts/:id", requirePermission("contacts", "update"), admin.updateContact);
router.delete("/contacts/:id", requireRole("superadmin"), admin.deleteContact);

router.get("/sahyog-alerts", requirePermission("sahyog-alerts", "view"), admin.listSahyogAlerts);
router.post("/sahyog-alerts", requirePermission("sahyog-alerts", "create"), admin.createSahyogAlert);
router.patch("/sahyog-alerts/:id", requirePermission("sahyog-alerts", "update"), admin.updateSahyogAlert);
router.delete("/sahyog-alerts/:id", requirePermission("sahyog-alerts", "delete"), admin.deleteSahyogAlert);

router.get("/claims", requireRole("superadmin"), claims.adminListClaims);
router.patch("/claims/:id", requireRole("superadmin"), claims.adminUpdateClaim);

router.get("/vyawastha-payments", requirePermission("vyawastha-payments", "view"), listVyawasthaPayments);
router.patch("/vyawastha-payments/:id/verify", requirePermission("vyawastha-payments", "approve"), verifyVyawasthaPayment);
router.patch("/vyawastha-payments/:id/reject", requirePermission("vyawastha-payments", "reject"), rejectVyawasthaPayment);

// These nested routes inherit adminAuth and adminApiRateLimit above.
router.use("/", sahyogRouter);
export default router;
