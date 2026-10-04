import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";
import User from "../models/userModel.js";
import ReferralCode from "../models/referralCodeModel.js";
import VyawasthaPayment from "../models/vyawasthaPaymentModel.js";
import { getMembershipExpiryAt, LAUNCH_GRACE_PERIOD_END } from "../utils/membershipExpiry.js";
import { ensureLegacyReferralCodes } from "../utils/legacyReferrals.js";

dotenv.config();

// Match the runtime's DNS configuration so Atlas SRV records resolve when
// this script runs outside the web server process.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const launchExpiry = getMembershipExpiryAt(LAUNCH_GRACE_PERIOD_END);
    await ensureLegacyReferralCodes();
    const qualifyingReferralCodes = await ReferralCode.find({
      isActive: true,
      code: /1100$/,
    }).distinct("code");
    const qualifyingMembers = await User.find({
      kycCompleted: true,
      referralCode: { $in: qualifyingReferralCodes },
    }).select("_id kycCompletedAt membershipStartDate").lean();

    // Backfill previously completed members only when their *1100 code is
    // currently active in the referral-code administration list.
    const referralUpdates = qualifyingMembers.map((member) => {
      const membershipStartDate = member.membershipStartDate || member.kycCompletedAt;
      return {
        updateOne: {
          filter: { _id: member._id },
          update: {
            $set: {
              membershipStatus: "active",
              membershipPaymentStatus: "paid",
              firstVyawasthaShulkWaived: true,
              membershipStartDate,
              membershipExpiresAt: getMembershipExpiryAt(membershipStartDate),
            },
          },
        },
      };
    });

    const referralResult = referralUpdates.length
      ? await User.bulkWrite(referralUpdates)
      : { modifiedCount: 0 };

    // Undo a waiver incorrectly granted to an unregistered *1100 code. A
    // verified payment always remains valid and is never changed here.
    const invalidWaiverCandidates = await User.find({
      $and: [
        { referralCode: /1100$/i },
        { referralCode: { $nin: qualifyingReferralCodes } },
      ],
      firstVyawasthaShulkWaived: true,
    }).select("_id").lean();
    const invalidCandidateIds = invalidWaiverCandidates.map((member) => member._id);
    const invalidPaidUserIds = await VyawasthaPayment.distinct("userId", {
      userId: { $in: invalidCandidateIds },
      paymentStatus: "verified",
    });
    const invalidUnpaidIds = invalidCandidateIds.filter(
      (id) => !invalidPaidUserIds.some((paidId) => String(paidId) === String(id))
    );
    const invalidWaiverResult = invalidUnpaidIds.length
      ? await User.updateMany(
        { _id: { $in: invalidUnpaidIds } },
        {
          $set: {
            referralCode: "AY92",
            membershipStatus: "pending",
            membershipPaymentStatus: "pending",
            firstVyawasthaShulkWaived: false,
            membershipStartDate: null,
            membershipExpiresAt: null,
            membershipRenewalReminderSentAt: null,
          },
        }
      )
      : { modifiedCount: 0 };

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
    console.log(`Invalid referral waivers removed: ${invalidWaiverResult.modifiedCount}`);
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
