import express from "express";
import { loginUser, registerUser, updateUserProfile, resetPassword, updatePassword, verifyCurrentPassword } from "../controller/userController.js";
import { getUserProfile } from "../controller/userProfileController.js";
import { sendOtp, verifyOtp, sendForgotPasswordOtp, verifyForgotPasswordOtp } from "../controller/otpController.js";

import authUser from "../middleware/auth.js";

const userRouter = express.Router();

// Email-otp

userRouter.post("/send-otp", sendOtp);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/forgot-password/send-otp", sendForgotPasswordOtp);
userRouter.post("/forgot-password/verify-otp", verifyForgotPasswordOtp);
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post("/reset-password", resetPassword);
userRouter.post("/update-password", authUser, updatePassword);
userRouter.post("/verify-current-password", authUser, verifyCurrentPassword);
userRouter.get("/profile", authUser, getUserProfile);
userRouter.put("/update-profile", authUser, updateUserProfile);

export default userRouter;
