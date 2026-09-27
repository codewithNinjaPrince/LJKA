import express from "express";

import {
  getVyawasthaPaymentInfo,
  submitVyawasthaPayment,
  listVyawasthaPayments,
  verifyVyawasthaPayment,
  rejectVyawasthaPayment,
} from "../controller/vyawasthaPaymentController.js";

import authUser from "../middleware/auth.js";

import {
  adminAuth,
  requirePermission,
} from "../middleware/adminAuth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
| These routes use normal USER authentication.
| authUser provides req.userId.
*/

// Get current user's Vywastha payment information
router.get(
  "/payment",
  authUser,
  getVyawasthaPaymentInfo
);

// Submit Vywastha payment
router.post(
  "/payment",
  authUser,
  submitVyawasthaPayment
);


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
| These routes use ADMIN authentication.
| adminAuth provides req.admin.
*/

// List all Vywastha payments
router.get(
  "/",
  adminAuth,
  requirePermission("vyawastha-payments", "view"),
  listVyawasthaPayments
);

// Verify payment
router.patch(
  "/:id/verify",
  adminAuth,
  requirePermission("vyawastha-payments", "approve"),
  verifyVyawasthaPayment
);

// Reject payment
router.patch(
  "/:id/reject",
  adminAuth,
  requirePermission("vyawastha-payments", "reject"),
  rejectVyawasthaPayment
);

export default router;