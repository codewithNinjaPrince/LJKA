
import express from "express";

import {
  getVyawasthaPaymentInfo,
  submitVyawasthaPayment,
  createVyawasthaProofSignature,
  getVyawasthaProofUploadOptions,
} from "../controller/vyawasthaPaymentController.js";

import authUser from "../middleware/auth.js";
import { createCloudinarySignedUpload } from "../middleware/cloudinaryUpload.js";

const router = express.Router();

// Authenticated member payment routes only.
router.get("/payment", authUser, getVyawasthaPaymentInfo);
router.post("/payment", authUser, submitVyawasthaPayment);
router.post("/proof/sign", authUser, createCloudinarySignedUpload(getVyawasthaProofUploadOptions), createVyawasthaProofSignature);

export default router;
