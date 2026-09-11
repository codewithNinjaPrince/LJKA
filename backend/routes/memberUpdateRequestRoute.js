import express from "express";
import {
  submitMemberUpdateRequest,
} from "../controller/memberUpdateRequestController.js";
import authUser from "../middleware/auth.js";

const memberUpdateRequestRouter = express.Router();

memberUpdateRequestRouter.post(
  "/submit",
  authUser,
  submitMemberUpdateRequest
);

export default memberUpdateRequestRouter;