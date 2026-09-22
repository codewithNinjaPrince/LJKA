import express from "express";
import { adminAuth, requireRole } from "../middleware/adminAuth.js";
import * as sahyog from "../controller/sahyogController.js";

const router = express.Router();
router.use(adminAuth);
// Cases and their donation verification are deliberately not delegable.
router.use(requireRole("superadmin"));
router.get("/sahyog", sahyog.listSahyog);
router.get("/sahyog/eligible-members", sahyog.listEligibleSahyogMembers);
router.post("/sahyog", sahyog.createSahyog);
router.get("/sahyog/:id", sahyog.getSahyog);
router.patch("/sahyog/:id", sahyog.updateSahyog);
router.delete("/sahyog/:id", sahyog.disableSahyog);
router.get("/sahyog/:id/donations", sahyog.listDonations);
router.patch("/sahyog/:id/donations/:donationId", sahyog.updateDonation);
export default router;
