import express from "express";

import {
  getPendingMemberUpdateRequests,
  getMemberUpdateRequestById,
  approveMemberUpdateRequest,
  rejectMemberUpdateRequest,
} from "../controller/adminMemberUpdateController.js";

import authUser from "../middleware/auth.js";

const adminMemberUpdateRouter = express.Router();

adminMemberUpdateRouter.get(
  "/",
  authUser,
  getPendingMemberUpdateRequests
);

adminMemberUpdateRouter.get(
  "/:requestId",
  authUser,
  getMemberUpdateRequestById
);

adminMemberUpdateRouter.patch(
  "/:requestId/approve",
  authUser,
  approveMemberUpdateRequest
);

adminMemberUpdateRouter.patch(
  "/:requestId/reject",
  authUser,
  rejectMemberUpdateRequest
);

export default adminMemberUpdateRouter;