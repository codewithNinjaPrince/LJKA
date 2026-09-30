import "dotenv/config";
import mongoose from "mongoose";
import XLSX from "xlsx";

import User from "../models/userModel.js";

const OUTPUT_FILE = "./users-export.xlsx";

const exportUsers = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected.");

    // Get ALL users
    const users = await User.find({})
      .sort({ createdAt: 1 })
      .lean();

    console.log(`Found ${users.length} users.`);

    if (users.length === 0) {
      console.log("No users found.");
      return;
    }

    const excelData = users.map((user) => ({
      // MongoDB
      ID: user._id?.toString() || "",

      // ACCOUNT / REGISTRATION
      Full_Name: user.fullName || "",
      Email: user.email || "",
      Account_Status: user.accountStatus || "",
      Email_Verified: user.emailVerified ?? "",
      Member_ID: user.memberId || "",

      // MEMBERSHIP
      KYC_Completed_At: user.kycCompletedAt || "",
      Membership_Start_Date: user.membershipStartDate || "",
      Membership_Expires_At: user.membershipExpiresAt || "",
      Membership_Renewal_Reminder_Sent_At:
        user.membershipRenewalReminderSentAt || "",

      // KYC
      Mobile: user.mobile || "",
      Mobile_Verified: user.mobileVerified ?? "",
      Father_Husband_Name: user.fatherHusbandName || "",
      Aadhaar: user.aadhaar || "",
      Date_of_Birth: user.dob || "",
      Gender: user.gender || "",

      // ADDRESS
      State_Code: user.address?.stateCode ?? "",
      State_Name: user.address?.stateName || "",
      District_Code: user.address?.districtCode ?? "",
      District_Name: user.address?.districtName || "",
      Tehsil_Code: user.address?.tehsilCode ?? "",
      Tehsil_Name: user.address?.tehsilName || "",
      Town_Village: user.address?.townVillage || "",
      Address: user.address?.address || "",
      Pincode: user.address?.pincode || "",

      // EMPLOYMENT
      Employment_Status: user.employmentStatus || "",
      Occupation: user.occupation || "",

      // NOMINEE
      Nominee_Name: user.nominee?.name || "",
      Nominee_Mobile: user.nominee?.mobile || "",
      Nominee_Aadhaar: user.nominee?.aadhaar || "",
      Nominee_Relationship: user.nominee?.relationship || "",

      // REFERRAL
      Referral_Code: user.referralCode || "",

      // KYC STATUS
      KYC_Completed: user.kycCompleted ?? "",
      Membership_Payment_Status: user.membershipPaymentStatus || "",

      // KYC CONSENT
      KYC_Consent_Accepted_At: user.kycConsentAcceptedAt || "",
      KYC_Consent_Terms_Version: user.kycConsentTermsVersion || "",
      KYC_Consent_Privacy_Version: user.kycConsentPrivacyVersion || "",

      // SEARCH TERMS
      Public_Search_Terms:
        Array.isArray(user.publicSearchTerms)
          ? user.publicSearchTerms.join(", ")
          : "",

      // TIMESTAMPS
      Created_At: user.createdAt || "",
      Updated_At: user.updatedAt || "",
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Make columns reasonably wide
    worksheet["!cols"] = [
      { wch: 26 },
      { wch: 25 },
      { wch: 32 },
      { wch: 16 },
      { wch: 18 },
      { wch: 18 },
      { wch: 24 },
      { wch: 24 },
      { wch: 24 },
      { wch: 32 },
      { wch: 16 },
      { wch: 18 },
      { wch: 25 },
      { wch: 16 },
      { wch: 16 },
      { wch: 14 },
      { wch: 14 },
      { wch: 15 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 35 },
      { wch: 15 },
      { wch: 22 },
      { wch: 25 },
      { wch: 22 },
      { wch: 25 },
      { wch: 22 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 30 },
      { wch: 25 },
      { wch: 30 },
      { wch: 35 },
      { wch: 22 },
      { wch: 22 },
      { wch: 35 },
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Users"
    );

    // Write Excel file
    XLSX.writeFile(workbook, OUTPUT_FILE);

    console.log("");
    console.log("======================================");
    console.log("USER EXPORT COMPLETED");
    console.log("======================================");
    console.log(`Total users: ${users.length}`);
    console.log(`Excel file: ${OUTPUT_FILE}`);
    console.log("======================================");
  } catch (error) {
    console.error("Export failed:");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};

exportUsers();
