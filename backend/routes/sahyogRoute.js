import express from "express";
import { adminAuth, requirePermission } from "../middleware/adminAuth.js";
import * as sahyog from "../controller/sahyogController.js";

const router = express.Router();
router.use(adminAuth);
router.get("/sahyog", requirePermission("sahyog", "view"), sahyog.listSahyog);
router.get("/sahyog/eligible-members", requirePermission("sahyog", "create"), sahyog.listEligibleSahyogMembers);
router.post("/sahyog", requirePermission("sahyog", "create"), sahyog.createSahyog);
router.get("/sahyog/:id", requirePermission("sahyog", "view"), sahyog.getSahyog);
router.patch("/sahyog/:id", requirePermission("sahyog", "update"), sahyog.updateSahyog);
router.delete("/sahyog/:id", requirePermission("sahyog", "delete"), sahyog.disableSahyog);
router.get("/sahyog/:id/donations", requirePermission("sahyog-donations", "view"), sahyog.listDonations);
router.patch("/sahyog/:id/donations/:donationId/verify", requirePermission("sahyog-donations", "verify"), sahyog.verifyDonation);
router.patch("/sahyog/:id/donations/:donationId/reject", requirePermission("sahyog-donations", "reject"), sahyog.rejectDonation);
export default router;
