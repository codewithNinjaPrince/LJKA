import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import userModel from "../models/userModel.js";
import EmailOtp from "../models/emailOtpModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2d" });
};

const loginUser = async (req, res) => {
  try {
    const { identifier, email, password } = req.body;
    const loginIdentifier = String(identifier || email || "").trim();

    // 1. EMAIL VALIDATION

    if (!loginIdentifier) {
      return res.status(400).json({
        success: false,
        message: "Email or mobile number is required",
      });
    }

    const normalizedEmail = loginIdentifier.toLowerCase();
    const isEmail = validator.isEmail(normalizedEmail);
    const isMobile = /^[6-9]\d{9}$/.test(loginIdentifier);

    if (!isEmail && !isMobile) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address or mobile number",
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

    const user = await userModel.findOne(
      isEmail ? { email: normalizedEmail } : { mobile: loginIdentifier }
    );

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
    const { fullName, email, mobile, password, confirmPassword, agreeTerms, } = req.body;

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

    const normalizedMobile = String(mobile || "").trim();

    if (!normalizedMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid mobile number",
      });
    }

    const existingMobile = await userModel.findOne({ mobile: normalizedMobile });

    if (existingMobile) {
      return res.status(409).json({
        success: false,
        code: "MOBILE_EXISTS",
        message: "This mobile number has already been registered. Please use a different number or contact LJKA.",
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
      mobile: normalizedMobile,
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
      if (error.keyPattern?.mobile) {
        return res.status(409).json({
          success: false,
          code: "MOBILE_EXISTS",
          message: "This mobile number has already been registered. Please use a different number or contact LJKA.",
        });
      }

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

const PASSWORD_CHANGE_TOKEN_MINUTES = 10;

const isValidPassword = (password) => {
  if (!password || typeof password !== "string") {
    return false;
  }

  if (password.length < 6) {
    return false;
  }

  if (!/[A-Za-z]/.test(password)) {
    return false;
  }

  if (!/[0-9]/.test(password)) {
    return false;
  }

  return true;
};

/* =========================================================
   VERIFY CURRENT PASSWORD
   POST /api/user/verify-current-password
========================================================= */

const verifyCurrentPassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is required",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    /*
     * Generate a random one-time verification token.
     * We only store its SHA-256 hash in MongoDB.
     */
    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const verifiedAt = new Date();

    await userModel.findByIdAndUpdate(userId, {
      $set: {
        passwordChangeVerifiedAt: verifiedAt,
        passwordChangeTokenHash: tokenHash,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Current password verified successfully",
      passwordChangeToken: rawToken,
      expiresInMinutes: PASSWORD_CHANGE_TOKEN_MINUTES,
    });
  } catch (error) {
    console.error(
      "VERIFY CURRENT PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to verify current password",
    });
  }
};


/* =========================================================
   UPDATE PASSWORD
   POST /api/user/update-password
========================================================= */

const updatePassword = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      passwordChangeToken,
      newPassword,
      confirmPassword,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!passwordChangeToken) {
      return res.status(401).json({
        success: false,
        message: "Password verification expired. Please verify your current password again.",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    if (
      !user.passwordChangeVerifiedAt ||
      !user.passwordChangeTokenHash
    ) {
      return res.status(401).json({
        success: false,
        message: "Please verify your current password first",
      });
    }

    /*
     * Verification expires after 10 minutes.
     */
    const verificationAge =
      Date.now() -
      new Date(user.passwordChangeVerifiedAt).getTime();

    if (
      verificationAge >
      PASSWORD_CHANGE_TOKEN_MINUTES * 60 * 1000
    ) {
      await userModel.findByIdAndUpdate(userId, {
        $unset: {
          passwordChangeVerifiedAt: 1,
          passwordChangeTokenHash: 1,
        },
      });

      return res.status(401).json({
        success: false,
        code: "PASSWORD_CHANGE_VERIFICATION_EXPIRED",
        message:
          "Password verification expired. Please verify your current password again.",
      });
    }

    const receivedTokenHash = crypto
      .createHash("sha256")
      .update(passwordChangeToken)
      .digest("hex");

    if (
      receivedTokenHash !== user.passwordChangeTokenHash
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid password verification",
      });
    }

    /*
     * New password validation
     */

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters and include a letter and a number",
      });
    }

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please confirm your password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    /*
     * Prevent using the same password.
     */

    const samePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from your current password",
      });
    }

    /*
     * Hash new password.
     */

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    /*
     * Verification token is one-time use.
     */

    user.passwordChangeVerifiedAt = null;
    user.passwordChangeTokenHash = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(
      "UPDATE PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update password",
    });
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User account not found" });
    }

    const {
      fullName,
      mobile,
      fatherHusbandName,
      aadhaar,
      dob,
      gender,
      address,
      employmentStatus,
      occupation,
      nominee,
      kycConsent,
    } = req.body;

    if (kycConsent !== true) {
      return res.status(400).json({
        success: false,
        message: "Please confirm that your profile information is accurate",
      });
    }

    if (fullName !== undefined && fullName.trim().length < 3) {
      return res.status(400).json({ success: false, message: "Please enter a valid full name" });
    }

    if (mobile !== undefined && !/^[6-9]\d{9}$/.test(String(mobile).trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid mobile number" });
    }

    if (!fatherHusbandName?.trim() || !/^\d{12}$/.test(aadhaar || "") || !dob || !gender) {
      return res.status(400).json({ success: false, message: "Please complete all required personal details" });
    }

    if (!address?.stateName?.trim() || !address?.districtName?.trim() || !address?.tehsilName?.trim() || !address?.townVillage?.trim() || !address?.address?.trim() || !/^\d{6}$/.test(address.pincode || "")) {
      return res.status(400).json({ success: false, message: "Please complete all required address details" });
    }

    if (!employmentStatus || !occupation?.trim() || !nominee?.name?.trim() || !/^[6-9]\d{9}$/.test(nominee.mobile || "") || !nominee.relationship?.trim()) {
      return res.status(400).json({ success: false, message: "Please complete all required membership details" });
    }

    const duplicateMobile = mobile && await userModel.findOne({ mobile: String(mobile).trim(), _id: { $ne: user._id } });
    if (duplicateMobile) {
      return res.status(409).json({ success: false, message: "This mobile number has already been registered. Please use a different number or contact LJKA." });
    }

    const duplicateAadhaar = await userModel.findOne({ aadhaar: String(aadhaar).trim(), _id: { $ne: user._id } });
    if (duplicateAadhaar) {
      return res.status(409).json({ success: false, message: "This Aadhaar number is already registered" });
    }

    user.fullName = fullName?.trim() || user.fullName;
    user.mobile = String(mobile || user.mobile).trim();
    user.fatherHusbandName = fatherHusbandName.trim();
    user.aadhaar = String(aadhaar).trim();
    user.dob = new Date(dob);
    user.gender = gender;
    user.address = {
      stateCode: Number(address.stateCode),
      stateName: address.stateName.trim(),
      districtCode: Number(address.districtCode),
      districtName: address.districtName.trim(),
      tehsilCode: Number(address.tehsilCode),
      tehsilName: address.tehsilName.trim(),
      townVillage: address.townVillage.trim(),
      address: address.address.trim(),
      pincode: address.pincode.trim(),
    };
    user.employmentStatus = employmentStatus;
    user.occupation = occupation.trim();
    user.nominee = {
      name: nominee.name.trim(),
      mobile: nominee.mobile.trim(),
      email: nominee.email?.trim().toLowerCase() || "",
      relationship: nominee.relationship.trim(),
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: user.toObject(),
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "This profile detail is already registered" });
    }

    return res.status(500).json({ success: false, message: "Unable to update profile" });
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

export { loginUser, registerUser, updateUserProfile, resetPassword, updatePassword, verifyCurrentPassword };