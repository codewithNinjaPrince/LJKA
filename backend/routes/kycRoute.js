import express from "express";
import { submitKYC } from "../controller/kycController.js";
import authUser from "../middleware/auth.js";

const kycRouter = express.Router();

kycRouter.post(
  "/submit",authUser,submitKYC
);

export default kycRouter;