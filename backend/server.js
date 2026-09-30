import dns from "node:dns";

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import kycRouter from "./routes/kycRoute.js";
import contactRouter from "./routes/contactRoute.js";
import memberRouter from "./routes/memberRoute.js";
import sahyogAlertRouter from "./routes/sahyogAlertRoute.js";
import memberUpdateRequestRouter from "./routes/memberUpdateRequestRoute.js";
import adminMemberUpdateRouter from "./routes/adminMemberUpdateRoute.js";
import adminRouter from "./routes/adminRoute.js";
import publicSahyogRouter from "./routes/publicSahyogRoute.js";
import vyawasthaPaymentRoute from "./routes/vyawasthaPaymentRoute.js";


const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/user/kyc", kycRouter);
app.use("/api/contact", contactRouter);
app.use("/api/members", memberRouter);
app.use("/api/sahyog-alert", sahyogAlertRouter);
app.use("/api/public/sahyog", publicSahyogRouter);
app.use("/api/user/vyawastha",vyawasthaPaymentRoute);
app.use(
  "/api/member-update-request",
  memberUpdateRequestRouter
);
app.use(
  "/api/admin/member-update-requests",
  adminMemberUpdateRouter
);
app.use("/api/admin", adminRouter);

// Root
app.get("/", (req, res) => {
  res.json({
    message: "LJKA Backend is running 🚀",
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();