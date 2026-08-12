import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import EmailOtp from "../models/emailOtpModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2d" });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. EMAIL VALIDATION

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // 2. PASSWORD VALIDATION

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // 3. FIND USER

    const user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. CHECK PASSWORD

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id);   // 5. GENERATE JWT

    // 6. LOGIN SUCCESS

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        emailVerified: user.emailVerified,
        kycCompleted: user.kycCompleted,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to login. Please try again.",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, agreeTerms, } = req.body;

    // Full Name Validation

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    const normalizedFullName = fullName.trim();

    if (normalizedFullName.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid full name",
      });
    }


    // Email Validation

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Check if email already exists

    const existingUser = await userModel.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        code: "EMAIL_EXISTS",
        message: "Email is already registered. Please login.",
      });
    }

    // 4. PASSWORD - Minimum 6 characters, at least 1 alphabet, at least 1 number

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (!/[A-Za-z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one alphabet",
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one number",
      });
    }


    // --------------------------------------------------
    // 5. CONFIRM PASSWORD
    // --------------------------------------------------

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please confirm your password",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // 6. TERMS & CONDITIONS

    if (agreeTerms !== true) {
      return res.status(400).json({
        success: false,
        message: "Please accept Terms & Conditions",
      });
    }

    // 7. EMAIL OTP VERIFICATION

    const emailOtp = await EmailOtp.findOne({
      email: normalizedEmail,
      purpose: "registration",
      verified: true,
      expiresAt: { $gt: new Date() },
    });

    if (!emailOtp) {
      return res.status(400).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email with OTP first",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);  // 8. HASH PASSWORD

    // 9. CREATE USER

    const newUser = new userModel({
      fullName: normalizedFullName,
      email: normalizedEmail,
      password: hashedPassword,
      emailVerified: true,
      kycCompleted: false,
    });

    await newUser.save();

    // 10. DELETE USED OTP

    await EmailOtp.deleteOne({
      email: normalizedEmail,
      purpose: "registration",
    });

    // 11. SUCCESS

    return res.status(201).json({
      success: true,
      message: "Registration successful",
    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    // MongoDB duplicate-key protection
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered. Please login.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to register user. Please try again.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, password, confirmPassword } = req.body;

    // 1. RESET TOKEN
    if (!resetToken) {
      return res.status(401).json({
        success: false,
        message: "Password reset session has expired",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Password reset session has expired. Please try again.",
      });
    }

    if (
      decoded.purpose !== "password-reset" ||
      !decoded.email
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid password reset token",
      });
    }

    // 2. PASSWORD
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (!/[A-Za-z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one alphabet",
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one number",
      });
    }

    // 3. CONFIRM PASSWORD
    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please confirm your password",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // 4. FIND USER
    const user = await userModel.findOne({
      email: decoded.email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    // 5. HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. UPDATE PASSWORD
    user.password = hashedPassword;

    await user.save();

    // 7. DELETE USED OTP
    await EmailOtp.deleteOne({
      email: decoded.email,
      purpose: "forgot-password",
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully. Please login.",
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to change password. Please try again.",
    });
  }
};

export { loginUser, registerUser, resetPassword };