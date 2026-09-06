import express from "express";
import { getSahyogAlert } from "../controller/sahyogAlertController.js";

const sahyogAlertRouter = express.Router();

sahyogAlertRouter.get("/", getSahyogAlert);

export default sahyogAlertRouter;