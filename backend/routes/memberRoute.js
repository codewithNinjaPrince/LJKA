import express from "express";

import { getMembers } from "../controller/memberController.js";

const memberRouter = express.Router();

memberRouter.get("/", getMembers);

export default memberRouter;