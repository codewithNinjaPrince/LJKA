import express from "express";
import * as sahyog from "../controller/sahyogController.js";

const router = express.Router();
router.get("/", sahyog.publicListSahyog);
router.get("/donations", sahyog.publicListDonations);
router.get("/:id/donations", sahyog.publicListCaseDonors);
router.get("/:id", sahyog.publicGetSahyog);
router.post("/:id/donations", sahyog.initiatePublicDonation);
export default router;
