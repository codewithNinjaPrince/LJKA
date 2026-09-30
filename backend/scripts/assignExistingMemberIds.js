import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/userModel.js";
import MemberCounter from "../models/memberCounterModel.js";
import generateMemberId from "../utils/generateMemberId.js";

dotenv.config();

const VALID_EMPLOYMENT_STATUSES = [
  "government",
  "private",
  "business",
  "others",
];

const normalizeEmploymentStatus = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  const legacyMap = {
    "government-job": "government",
    "private-job": "private",
    "private-business": "private",
    "private-businesses": "private",
    "self-employed": "business",
    "self-employed-person": "business",
    "student": "others",
    "students": "others",
    "other": "others",
    "others": "others",
    "government": "government",
    "private": "private",
    "business": "business",
  };

  return legacyMap[normalized] || (VALID_EMPLOYMENT_STATUSES.includes(normalized) ? normalized : "others");
};

const assignExistingMemberIds = async () => {
  try {
    // ==========================================
    // CONNECT TO DATABASE
    // ==========================================

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    // ==========================================
    // FIND ALL KYC-COMPLETED USERS IN JOINING ORDER.
    // Their IDs are intentionally regenerated so old IDs follow the new format.
    // ==========================================

    const users = await User.find({
      kycCompleted: true,
    })
      .sort({ createdAt: 1, _id: 1 })
      .select("_id fullName createdAt memberId address employmentStatus");

    console.log(`Users receiving member ID and status updates: ${users.length}`);

    // ==========================================
    // NOTHING TO MIGRATE
    // ==========================================

    if (users.length === 0) {
      console.log("No KYC-completed users found.");
      return;
    }

    // Reset the global serial so joining order starts at 1.
    await MemberCounter.findOneAndUpdate(
      { _id: "memberId" },
      { $set: { sequence: 0 } },
      { upsert: true, new: true }
    );

    // ==========================================
    // ASSIGN MEMBER IDS
    // ==========================================

    for (const user of users) {
      const normalizedEmploymentStatus = normalizeEmploymentStatus(user.employmentStatus);
      const memberId = await generateMemberId({
        address: user.address,
        employmentStatus: normalizedEmploymentStatus,
      });

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            employmentStatus: normalizedEmploymentStatus,
            memberId,
          },
        }
      );

      console.log(
        `${user.fullName} → ${normalizedEmploymentStatus} → ${memberId}`
      );
    }

    const finalCounter = await MemberCounter.findById("memberId");

    console.log("--------------------------------");
    console.log("Migration completed successfully");
    console.log(`Final Member ID sequence: ${finalCounter?.sequence || 0}`);
    console.log("--------------------------------");

  } catch (error) {
    console.error("MEMBER ID MIGRATION ERROR:", error);
    process.exitCode = 1;
  } finally {
    // ==========================================
    // CLOSE DATABASE CONNECTION
    // ==========================================

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  }
};

assignExistingMemberIds();