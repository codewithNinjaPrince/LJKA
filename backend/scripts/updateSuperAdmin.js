import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcryptjs";

import Admin from "../models/adminModel.js";

const updateSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const superadmin = await Admin.findOne({ role: "superadmin" });

    if (!superadmin) {
      console.log("No superadmin account found.");
      return;
    }

    const newPassword = process.env.SUPER_ADMIN_PASSWORD;

    if (!newPassword) {
      throw new Error("SUPER_ADMIN_PASSWORD is missing from .env");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    superadmin.fullName = process.env.SUPER_ADMIN_NAME;
    superadmin.email = process.env.SUPER_ADMIN_EMAIL;
    superadmin.username = process.env.SUPER_ADMIN_USERNAME;
    superadmin.password = hashedPassword;

    // Invalidate previously issued JWTs
    superadmin.authVersion += 1;

    // Make sure the account remains active
    superadmin.status = "active";
    superadmin.role = "superadmin";

    await superadmin.save();

    console.log("--------------------------------");
    console.log("Superadmin updated successfully");
    console.log(`Name: ${superadmin.fullName}`);
    console.log(`Email: ${superadmin.email}`);
    console.log(`Username: ${superadmin.username}`);
    console.log("Password: updated");
    console.log(`Auth version: ${superadmin.authVersion}`);
    console.log("--------------------------------");

  } catch (error) {
    console.error("Could not update superadmin:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed");
  }
};

updateSuperAdmin();