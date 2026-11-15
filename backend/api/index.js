import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import connectDB from "../config/mongodb.js";
import userRouter from "../routes/userRoute.js";
import kycRouter from "../routes/kycRoute.js";
import contactRouter from "../routes/contactRoute.js";
import memberRouter from "../routes/memberRoute.js";
import sahyogAlertRouter from "../routes/sahyogAlertRoute.js";
import memberUpdateRequestRouter from "../routes/memberUpdateRequestRoute.js";
import adminMemberUpdateRouter from "../routes/adminMemberUpdateRoute.js";
import adminRouter from "../routes/adminRoute.js";
import publicSahyogRouter from "../routes/publicSahyogRoute.js";
import vyawasthaPaymentRoute from "../routes/vyawasthaPaymentRoute.js";

const requiredEnv = [
  "MONGODB_URI",
  "JWT_SECRET",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

for (const name of requiredEnv) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

if (Buffer.byteLength(process.env.JWT_SECRET, "utf8") < 32) {
  throw new Error("JWT_SECRET must contain at least 32 bytes of high-entropy data");
}

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  throw new Error("CORS_ORIGINS must contain at least one trusted frontend origin");
}

const app = express();

// Vercel is the trusted reverse proxy in this deployment.
// Do not expose this Express app directly on an untrusted network.
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      // Requests without Origin include server-to-server/CLI clients.
      // They still must pass application authentication.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  })
);

app.use(express.json({ limit: "1mb" }));

app.use("/api/user", userRouter);
app.use("/api/user/kyc", kycRouter);
app.use("/api/contact", contactRouter);
app.use("/api/members", memberRouter);
app.use("/api/sahyog-alert", sahyogAlertRouter);
app.use("/api/public/sahyog", publicSahyogRouter);
app.use(
  "/api/member-update-request",
  memberUpdateRequestRouter
);
app.use(
  "/api/admin/member-update-requests",
  adminMemberUpdateRouter
);
app.use("/api/user/vyawastha", vyawasthaPaymentRoute);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.json({
    message: "LJKA Backend is running ",
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error?.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request body is too large",
    });
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body",
    });
  }

  // Do not return stack traces, database details, or secrets to clients.
  console.error("Unhandled API error:", error?.message || "Unknown error");

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const handler = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("API initialization/database error:", error?.message || "Unknown error");

    if (!res.headersSent) {
      return res.status(503).json({
        success: false,
        message: "Service temporarily unavailable",
      });
    }
  }
};

export default handler;
