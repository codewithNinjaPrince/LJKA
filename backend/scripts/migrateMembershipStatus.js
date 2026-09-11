import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";

dotenv.config();

const migrateMembershipStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected.");

    const result = await userModel.updateMany(
      {
        membershipPaymentStatus: { $exists: false },
      },
      {
        $set: {
          membershipPaymentStatus: "pending",
        },
      }
    );

    console.log(`Matched users: ${result.matchedCount}`);
    console.log(`Updated users: ${result.modifiedCount}`);

    console.log("Membership status migration completed.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);

    await mongoose.disconnect();
    process.exit(1);
  }
};

migrateMembershipStatus();