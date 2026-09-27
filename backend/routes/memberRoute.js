import express from "express";

import {
  getMembers,
  getMemberFilterOptions,
  getPaidVyawasthaMembers,
} from "../controller/memberController.js";

const memberRouter = express.Router();


// ============================================================
// GET MEMBERS
// ============================================================

memberRouter.get("/", getMembers);
memberRouter.get("/vyawastha-paid", getPaidVyawasthaMembers);


// ============================================================
// GET MEMBER FILTER OPTIONS
// ============================================================

memberRouter.get(
  "/filter-options",
  getMemberFilterOptions
);


export default memberRouter;
