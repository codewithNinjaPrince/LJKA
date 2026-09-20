import mongoose from "mongoose";
import "dotenv/config";

import Admin from "../models/adminModel.js";

const activateExistingAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const activationResult = await Admin.updateMany(
      {
        role: "admin",
        status: { $in: ["pending", "rejected"] },
      },
      {
        $set: { status: "active" },
      }
    );

    const cleanupResult = await Admin.updateMany(
      { role: "admin", kyc: { $exists: true } },
      { $unset: { kyc: "" } }
    );

    console.log(`Activated ${activationResult.modifiedCount} existing admin account(s).`);
    console.log(`Removed legacy KYC data from ${cleanupResult.modifiedCount} admin account(s).`);
  } catch (error) {
    console.error("Could not activate existing admin accounts:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

activateExistingAdmins();
