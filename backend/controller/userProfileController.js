import userModel from "../models/userModel.js";
import brevo from "../config/brevo.js";

const MEMBERSHIP_DAYS = 365;
const DAY_MS = 24 * 60 * 60 * 1000;

/* =========================================================
   GET USER PROFILE
   GET /api/user/profile
========================================================= */

const getUserProfile = async (req, res) => {
  try {

    // authUser middleware provides this
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Find logged-in user
    const user = await userModel
      .findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    const membershipPaid = user.membershipPaymentStatus === "paid";

    const membershipStartDate = membershipPaid
      ? user.membershipStartDate
      : null;

    const membershipExpiresAt = membershipPaid
      ? user.membershipExpiresAt
      : null;

    const remainingDays = membershipExpiresAt
      ? Math.ceil(
        (new Date(membershipExpiresAt).getTime() - Date.now()) / DAY_MS
      )
      : 0;

    const renewalDue =
      membershipPaid &&
      remainingDays > 0 &&
      remainingDays <= 30;

    if (
      renewalDue &&
      remainingDays >= 0 &&
      !user.membershipRenewalReminderSentAt
    ) {
      const reminderClaim = await userModel.findOneAndUpdate(
        {
          _id: user._id,
          membershipRenewalReminderSentAt: null,
        },
        { $set: { membershipRenewalReminderSentAt: new Date() } },
        { new: true }
      );

      if (reminderClaim) {
        try {
          await brevo.transactionalEmails.sendTransacEmail({
            sender: {
              email: process.env.BREVO_SENDER_EMAIL,
              name: process.env.BREVO_SENDER_NAME,
            },
            to: [{ email: user.email, name: user.fullName }],
            subject: "LJKA membership renewal reminder",
            htmlContent: `
              <div style="font-family:Arial,sans-serif;line-height:1.6;color:#263238;max-width:600px;margin:auto">
                <h2 style="color:#78081C">LJKA Membership Renewal</h2>
                <p>Dear ${user.fullName},</p>
                <p>Your LJKA membership has <strong>${Math.max(remainingDays, 0)} days</strong> remaining.</p>
                <p>Please renew your membership and pay the required annual fee before <strong>${new Date(membershipExpiresAt).toLocaleDateString("en-IN")}</strong> to keep it active.</p>
                <p>For renewal assistance, please contact LJKA through the official channels.</p>
                <p>Regards,<br />Lakhdaatar Jeevan Kalyan Association</p>
              </div>
            `,
          });
        } catch (emailError) {
          await userModel.updateOne(
            { _id: user._id },
            { $set: { membershipRenewalReminderSentAt: null } }
          );
          console.error("MEMBERSHIP RENEWAL EMAIL ERROR:", emailError);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: {
        ...user.toObject(),
        membershipPaymentStatus: user.membershipPaymentStatus,

        membershipStartDate,
        membershipExpiresAt,

        membershipDaysTotal: MEMBERSHIP_DAYS,
        membershipDaysRemaining: Math.max(remainingDays, 0),

        membershipExpired:
          membershipPaid && remainingDays < 0,

        membershipRenewalDue: renewalDue,

        membershipActive:
          membershipPaid && remainingDays > 0,
      },
    });

  } catch (error) {

    console.error(
      "GET USER PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
    });
  }
};


export {
  getUserProfile,
};