
import express from "express";

import {
  getVyawasthaPaymentInfo,
  submitVyawasthaPayment,
} from "../controller/vyawasthaPaymentController.js";

import authUser from "../middleware/auth.js";

const router = express.Router();

// Authenticated member payment routes only.
router.get("/payment", authUser, getVyawasthaPaymentInfo);
router.post("/payment", authUser, submitVyawasthaPayment);

export default router;
