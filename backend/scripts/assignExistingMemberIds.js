import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/userModel.js";
import MemberCounter from "../models/memberCounterModel.js";
import generateMemberId from "../utils/generateMemberId.js";

dotenv.config();

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

    console.log(`Users receiving new Member IDs: ${users.length}`);

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
      const memberId = await generateMemberId({
        stateName: user.address?.stateName,
        employmentStatus: user.employmentStatus,
      });

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            memberId,
          },
        }
      );

      console.log(
        `${user.fullName} → ${memberId}`
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