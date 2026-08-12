import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";

// Routers
import userRouter from "./routes/userRoute.js";
import kycRouter from "./routes/kycRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/user/kyc", kycRouter);

// Root
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

export default app;