import express from "express";

import {
  getMembers,
  getMemberFilterOptions,
} from "../controller/memberController.js";

const memberRouter = express.Router();


// ============================================================
// GET MEMBERS
// ============================================================

memberRouter.get("/", getMembers);


// ============================================================
// GET MEMBER FILTER OPTIONS
// ============================================================

memberRouter.get(
  "/filter-options",
  getMemberFilterOptions
);


export default memberRouter;