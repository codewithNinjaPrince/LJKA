import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import User from "../models/userModel.js";
import ReferralCode from "../models/referralCodeModel.js";
import VyawasthaPayment from "../models/vyawasthaPaymentModel.js";
import { getMembershipExpiryAt, LAUNCH_GRACE_PERIOD_END } from "../utils/membershipExpiry.js";

dotenv.config();

// Match the runtime's DNS configuration so Atlas SRV records resolve when
// this script runs outside the web server process.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const launchExpiry = getMembershipExpiryAt(LAUNCH_GRACE_PERIOD_END);
    const referralCodes = await ReferralCode.find({
      isActive: true,
      code: /1100$/,
    }).distinct("code");

    // Bring already completed qualifying KYC records in line with the launch
    // policy. This is safe to run more than once.
    const referralResult = await User.updateMany(
      {
        kycCompleted: true,
        kycCompletedAt: { $lte: LAUNCH_GRACE_PERIOD_END },
        referralCode: { $in: referralCodes },
      },
      {
        $set: {
          membershipStatus: "active",
          membershipPaymentStatus: "paid",
          firstVyawasthaShulkWaived: true,
          membershipExpiresAt: launchExpiry,
        },
      }
    );

    const launchPayments = await VyawasthaPayment.find({
      paymentStatus: "verified",
      createdAt: { $lte: LAUNCH_GRACE_PERIOD_END },
    }).select("_id userId").lean();

    const paymentIds = launchPayments.map((payment) => payment._id);
    const paymentUserIds = launchPayments.map((payment) => payment.userId);

    const [paymentResult, paymentUserResult] = await Promise.all([
      VyawasthaPayment.updateMany(
        { _id: { $in: paymentIds } },
        { $set: { membershipExpiresAt: launchExpiry } }
      ),
      User.updateMany(
        { _id: { $in: paymentUserIds } },
        {
          $set: {
            membershipStatus: "active",
            membershipPaymentStatus: "paid",
            membershipExpiresAt: launchExpiry,
          },
        }
      ),
    ]);

    console.log(`Referral memberships updated: ${referralResult.modifiedCount}`);
    console.log(`Verified launch payments updated: ${paymentResult.modifiedCount}`);
    console.log(`Payment memberships updated: ${paymentUserResult.modifiedCount}`);
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error("Launch membership expiry update failed:", error.message);
  process.exitCode = 1;
});
