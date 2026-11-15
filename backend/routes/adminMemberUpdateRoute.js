import express from "express";

import {
  getPendingMemberUpdateRequests,
  getMemberUpdateRequestById,
  approveMemberUpdateRequest,
  rejectMemberUpdateRequest,
  approveMemberUpdateField,
  rejectMemberUpdateField,
} from "../controller/adminMemberUpdateController.js";

import { adminAuth, requirePermission } from "../middleware/adminAuth.js";
import { adminApiRateLimit } from "../middleware/adminRateLimit.js";

const router = express.Router();

router.use(adminAuth, adminApiRateLimit);

router.get(
  "/",
  requirePermission("member-update-requests", "view"),
  getPendingMemberUpdateRequests
);

router.get(
  "/:requestId",
  requirePermission("member-update-requests", "view"),
  getMemberUpdateRequestById
);

router.patch(
  "/:requestId/approve",
  requirePermission("member-update-requests", "approve"),
  approveMemberUpdateRequest
);

router.patch(
  "/:requestId/reject",
  requirePermission("member-update-requests", "reject"),
  rejectMemberUpdateRequest
);

router.patch(
  "/:requestId/fields/:field/approve",
  requirePermission("member-update-requests", "approve"),
  approveMemberUpdateField
);

router.patch(
  "/:requestId/fields/:field/reject",
  requirePermission("member-update-requests", "reject"),
  rejectMemberUpdateField
);

export default router;



// import express from "express";

// import {
//   getPendingMemberUpdateRequests,
//   getMemberUpdateRequestById,
//   approveMemberUpdateRequest,
//   rejectMemberUpdateRequest,
//   approveMemberUpdateField,
//   rejectMemberUpdateField,
// } from "../controller/adminMemberUpdateController.js";

// import { adminAuth, requirePermission } from "../middleware/adminAuth.js";

// const adminMemberUpdateRouter = express.Router();

// adminMemberUpdateRouter.get(
//   "/",
//   adminAuth,
//   requirePermission("member-update-requests", "view"),
//   getPendingMemberUpdateRequests
// );

// adminMemberUpdateRouter.get(
//   "/:requestId",
//   adminAuth,
//   requirePermission("member-update-requests", "view"),
//   getMemberUpdateRequestById
// );

// adminMemberUpdateRouter.patch(
//   "/:requestId/approve",
//   adminAuth,
//   requirePermission("member-update-requests", "approve"),
//   approveMemberUpdateRequest
// );

// adminMemberUpdateRouter.patch(
//   "/:requestId/reject",
//   adminAuth,
//   requirePermission("member-update-requests", "reject"),
//   rejectMemberUpdateRequest
// );

// adminMemberUpdateRouter.patch("/:requestId/fields/:field/approve", adminAuth, requirePermission("member-update-requests", "approve"), approveMemberUpdateField);
// adminMemberUpdateRouter.patch("/:requestId/fields/:field/reject", adminAuth, requirePermission("member-update-requests", "reject"), rejectMemberUpdateField);

// export default adminMemberUpdateRouter;
