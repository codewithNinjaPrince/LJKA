import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/userModel.js";
import MemberCounter from "../models/memberCounterModel.js";

dotenv.config();

const assignExistingMemberIds = async () => {
  try {
    // ==========================================
    // CONNECT TO DATABASE
    // ==========================================

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    // ==========================================
    // FIND EXISTING KYC-COMPLETED USERS
    // WITHOUT MEMBER ID
    // ==========================================

    const users = await User.find({
      kycCompleted: true,
      $or: [
        { memberId: { $exists: false } },
        { memberId: null },
        { memberId: "" },
      ],
    })
      .sort({ createdAt: 1, _id: 1 })
      .select("_id fullName createdAt memberId");

    console.log(`Users requiring Member ID: ${users.length}`);

    // ==========================================
    // NOTHING TO MIGRATE
    // ==========================================

    if (users.length === 0) {
      console.log("No users require Member ID assignment.");
      return;
    }

    // ==========================================
    // GET CURRENT COUNTER
    // ==========================================

    const existingCounter = await MemberCounter.findById("memberId");

    let sequence = existingCounter?.sequence || 0;

    // ==========================================
    // ASSIGN MEMBER IDS
    // ==========================================

    for (const user of users) {
      sequence++;

      const memberId =
        `LJKA-${new Date().getFullYear()}-${String(sequence).padStart(6, "0")}`;

      await User.updateOne(
        {
          _id: user._id,
          $or: [
            { memberId: { $exists: false } },
            { memberId: null },
            { memberId: "" },
          ],
        },
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

    // ==========================================
    // UPDATE COUNTER
    // ==========================================

    await MemberCounter.findOneAndUpdate(
      { _id: "memberId" },
      {
        $set: {
          sequence,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    console.log("--------------------------------");
    console.log("Migration completed successfully");
    console.log(`Final Member ID sequence: ${sequence}`);
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