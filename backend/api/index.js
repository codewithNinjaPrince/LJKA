import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "../config/mongodb.js";

import userRouter from "../routes/userRoute.js";
import kycRouter from "../routes/kycRoute.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/user/kyc", kycRouter);

app.get("/", (req, res) => {
  res.json({
    message: "LJKA Backend is running 🚀",
  });
});

const handler = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Database connection error:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};

export default handler;