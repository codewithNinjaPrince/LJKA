import express from "express";

import {
  getPendingMemberUpdateRequests,
  getMemberUpdateRequestById,
  approveMemberUpdateRequest,
  rejectMemberUpdateRequest,
} from "../controller/adminMemberUpdateController.js";

import { adminAuth, requirePermission } from "../middleware/adminAuth.js";

const adminMemberUpdateRouter = express.Router();

adminMemberUpdateRouter.get(
  "/",
  adminAuth,
  requirePermission("member-update-requests", "view"),
  getPendingMemberUpdateRequests
);

adminMemberUpdateRouter.get(
  "/:requestId",
  adminAuth,
  requirePermission("member-update-requests", "view"),
  getMemberUpdateRequestById
);

adminMemberUpdateRouter.patch(
  "/:requestId/approve",
  adminAuth,
  requirePermission("member-update-requests", "approve"),
  approveMemberUpdateRequest
);

adminMemberUpdateRouter.patch(
  "/:requestId/reject",
  adminAuth,
  requirePermission("member-update-requests", "reject"),
  rejectMemberUpdateRequest
);

export default adminMemberUpdateRouter;
