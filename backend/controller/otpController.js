import crypto from "crypto";
import validator from "validator";
import brevo from "../config/brevo.js";
import EmailOtp from "../models/emailOtpModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";


// HELPER: Generate 6 Digit OTP

const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// HELPER: Hash OTP

const hashOtp = (otp) => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};


// SEND OTP : POST /api/user/send-otp

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Validate email

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

    // 2. CHECK IF EMAIL IS ALREADY REGISTERED

    const existingUser = await userModel.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        code: "EMAIL_EXISTS",
        message: "This email is already registered. Please login.",
      });
    }

    // 3. Generate OTP

    const otp = generateOtp();
    console.log("OTP generated for:", normalizedEmail);

    const otpHash = hashOtp(otp); // 4. Hash OTP

    // 5. OTP expires after 5 minutes

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    // 6. Delete previous OTP

    await EmailOtp.deleteMany({
      email: normalizedEmail,
      purpose: "registration",
    });

    // 7. Save new OTP

    await EmailOtp.create({ email: normalizedEmail, otpHash, expiresAt, attempts: 0, verified: false, purpose: "registration", });

    // 8. Send OTP through Brevo

    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME,
      },

      to: [
        {
          email: normalizedEmail,
        },
      ],

      subject: "LJKA - Email Verification Code",

      htmlContent: `
        <!DOCTYPE html>

        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>LJKA Verification Code</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
              font-family: Arial, Helvetica, sans-serif;
            "
          >

            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 12px;
                padding: 40px 30px;
                box-sizing: border-box;
              "
            >

              <div style="text-align: center;">

                <h1
                  style="
                    margin: 0;
                    color: #1f2937;
                    font-size: 28px;
                  "
                >
                  LJKA
                </h1>

                <p
                  style="
                    margin-top: 8px;
                    color: #6b7280;
                    font-size: 14px;
                  "
                >
                  Lakhdaatar Jeevan Kalyan Association
                </p>

              </div>


              <div
                style="
                  margin-top: 35px;
                  text-align: center;
                "
              >

                <h2
                  style="
                    color: #111827;
                    font-size: 22px;
                  "
                >
                  Verify Your Email
                </h2>

                <p
                  style="
                    color: #4b5563;
                    font-size: 15px;
                    line-height: 1.6;
                  "
                >
                  Thank you for registering with LJKA.
                  Please use the verification code below
                  to verify your email address.
                </p>


                <div
                  style="
                    margin: 30px 0;
                    padding: 20px;
                    background-color: #f3f4f6;
                    border-radius: 10px;
                  "
                >

                  <div
                    style="
                      font-size: 32px;
                      font-weight: bold;
                      letter-spacing: 8px;
                      color: #111827;
                    "
                  >
                    ${otp}
                  </div>

                </div>


                <p
                  style="
                    color: #6b7280;
                    font-size: 14px;
                  "
                >
                  This verification code is valid for
                  <strong>5 minutes</strong>.
                </p>


                <p
                  style="
                    color: #6b7280;
                    font-size: 13px;
                    line-height: 1.5;
                  "
                >
                  Please do not share this verification code
                  with anyone.
                </p>

              </div>


              <hr
                style="
                  margin: 35px 0 20px;
                  border: none;
                  border-top: 1px solid #e5e7eb;
                "
              />


              <p
                style="
                  margin: 0;
                  text-align: center;
                  color: #9ca3af;
                  font-size: 12px;
                  line-height: 1.5;
                "
              >
                If you did not request this verification code,
                you can safely ignore this email.
              </p>

              <p
                style="
                  margin-top: 10px;
                  text-align: center;
                  color: #9ca3af;
                  font-size: 12px;
                "
              >
                © LJKA - Lakhdaatar Jeevan Kalyan Association
              </p>

            </div>

          </body>
        </html>
      `,
    });


    // --------------------------------------------------
    // 9. Success
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
    });

  } catch (error) {

    console.error("SEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send verification code. Please try again.",
    });
  }
};


// VERIFY OTP : POST /api/user/verify-otp

const verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;


    // --------------------------------------------------
    // 1. Validate email
    // --------------------------------------------------

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


    // --------------------------------------------------
    // 2. Validate OTP
    // --------------------------------------------------

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Verification code is required",
      });
    }


    if (!/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: "Verification code must be 6 digits",
      });
    }


    // --------------------------------------------------
    // 3. Find OTP
    // --------------------------------------------------

    const emailOtp = await EmailOtp.findOne({
      email: normalizedEmail,
      purpose: "registration",
      verified: false,
    });


    if (!emailOtp) {
      return res.status(400).json({
        success: false,
        message: "Verification code not found or already used",
      });
    }


    // --------------------------------------------------
    // 4. Check expiry
    // --------------------------------------------------

    if (emailOtp.expiresAt <= new Date()) {

      await EmailOtp.deleteOne({
        _id: emailOtp._id,
      });

      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new code.",
      });
    }


    // --------------------------------------------------
    // 5. Check attempts
    // --------------------------------------------------

    if (emailOtp.attempts >= 5) {

      await EmailOtp.deleteOne({
        _id: emailOtp._id,
      });

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new code.",
      });
    }


    // --------------------------------------------------
    // 6. Hash submitted OTP
    // --------------------------------------------------

    const submittedOtpHash = hashOtp(String(otp));


    // --------------------------------------------------
    // 7. Compare OTP
    // --------------------------------------------------

    if (submittedOtpHash !== emailOtp.otpHash) {

      emailOtp.attempts += 1;

      await emailOtp.save();

      const remainingAttempts =
        Math.max(0, 5 - emailOtp.attempts);

      return res.status(400).json({
        success: false,
        message: `Invalid verification code. ${remainingAttempts} attempts remaining.`,
      });
    }


    // --------------------------------------------------
    // 8. OTP correct
    // --------------------------------------------------

    emailOtp.verified = true;

    await emailOtp.save();


    // --------------------------------------------------
    // 9. Success
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {

    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify code. Please try again.",
    });
  }
};

const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

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

    const user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await EmailOtp.deleteMany({
      email: normalizedEmail,
      purpose: "forgot-password",
    });

    await EmailOtp.create({
      email: normalizedEmail,
      otpHash,
      expiresAt,
      attempts: 0,
      verified: false,
      purpose: "forgot-password",
    });

    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME,
      },
      to: [{ email: normalizedEmail }],
      subject: "LJKA - Password Reset Code",
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:40px auto;padding:30px;text-align:center;background:#fff;border-radius:12px">
          <h1 style="color:#1f2937">LJKA</h1>
          <p style="color:#6b7280">
            Lakhdaatar Jeevan Kalyan Association
          </p>

          <h2 style="color:#111827">Reset Your Password</h2>

          <p style="color:#4b5563">
            Use the verification code below to reset your password.
          </p>

          <div style="margin:30px 0;padding:20px;background:#f3f4f6;border-radius:10px">
            <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#111827">
              ${otp}
            </div>
          </div>

          <p style="color:#6b7280">
            This code is valid for <strong>5 minutes</strong>.
          </p>

          <p style="color:#9ca3af;font-size:12px">
            If you did not request a password reset, please ignore this email.
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset code sent successfully",
    });

  } catch (error) {
    console.error("FORGOT PASSWORD OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send verification code. Please try again.",
    });
  }
};

const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

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

    if (!otp || !/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: "Verification code must be 6 digits",
      });
    }

    const emailOtp = await EmailOtp.findOne({
      email: normalizedEmail,
      purpose: "forgot-password",
      verified: false,
    });

    if (!emailOtp) {
      return res.status(400).json({
        success: false,
        message: "Verification code not found or already used",
      });
    }

    if (emailOtp.expiresAt <= new Date()) {
      await EmailOtp.deleteOne({ _id: emailOtp._id });

      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new code.",
      });
    }

    if (emailOtp.attempts >= 5) {
      await EmailOtp.deleteOne({ _id: emailOtp._id });

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new code.",
      });
    }

    const submittedOtpHash = hashOtp(String(otp));

    if (submittedOtpHash !== emailOtp.otpHash) {
      emailOtp.attempts += 1;
      await emailOtp.save();

      return res.status(400).json({
        success: false,
        message: `Invalid verification code. ${5 - emailOtp.attempts} attempts remaining.`,
      });
    }

    emailOtp.verified = true;
    await emailOtp.save();

    // Create short-lived password reset token
    const resetToken = jwt.sign(
      {
        email: normalizedEmail,
        purpose: "password-reset",
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
    });

  } catch (error) {
    console.error("VERIFY FORGOT OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify code. Please try again.",
    });
  }
};

export {
  sendOtp,
  verifyOtp,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
};