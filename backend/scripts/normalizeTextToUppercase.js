import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/mongodb.js";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import Sahyog from "../models/sahyogModel.js";
import Donation from "../models/donationModel.js";
import VyawasthaPayment from "../models/vyawasthaPaymentModel.js";
import Claim from "../models/claimModel.js";
import Contact from "../models/contactModel.js";
import ReferralCode from "../models/referralCodeModel.js";
import SahyogAlert from "../models/sahyogAlert.js";
import MemberUpdateRequest from "../models/memberUpdateRequestModel.js";

// Use ENV_FILE when executing against a pulled Vercel production environment.
dotenv.config({ path: process.env.ENV_FILE || ".env" });

const upper = (value) => typeof value === "string" ? value.trim().toUpperCase() : value;
const upperFields = (document, fields) => {
  let changed = false;
  for (const field of fields) {
    const parts = field.split(".");
    let target = document;
    for (const part of parts.slice(0, -1)) target = target?.[part];
    const key = parts.at(-1);
    if (target && typeof target[key] === "string") {
      const normalized = upper(target[key]);
      if (normalized !== target[key]) { target[key] = normalized; changed = true; }
    }
  }
  return changed;
};

const normalizeUpdateRequest = async () => {
  let modified = 0;
  const fields = ["fullName", "fatherHusbandName", "occupation", "referralCode", "address.stateName", "address.districtName", "address.tehsilName", "address.townVillage", "address.address", "nominee.name"];
  for await (const request of MemberUpdateRequest.find().cursor()) {
    const requestedChanged = upperFields(request.requestedChanges || {}, fields);
    const currentChanged = upperFields(request.currentValues || {}, fields);
    if (requestedChanged || currentChanged) { request.markModified("requestedChanges"); request.markModified("currentValues"); await request.save(); modified += 1; }
  }
  return modified;
};

const run = async () => {
  await connectDB();
  const operations = await Promise.all([
    User.updateMany({}, [{ $set: {
      fullName: { $toUpper: { $trim: { input: { $ifNull: ["$fullName", ""] } } } },
      fatherHusbandName: { $toUpper: { $trim: { input: { $ifNull: ["$fatherHusbandName", ""] } } } },
      occupation: { $toUpper: { $trim: { input: { $ifNull: ["$occupation", ""] } } } },
      referralCode: { $toUpper: { $trim: { input: { $ifNull: ["$referralCode", ""] } } } },
      "address.stateName": { $toUpper: { $trim: { input: { $ifNull: ["$address.stateName", ""] } } } },
      "address.districtName": { $toUpper: { $trim: { input: { $ifNull: ["$address.districtName", ""] } } } },
      "address.tehsilName": { $toUpper: { $trim: { input: { $ifNull: ["$address.tehsilName", ""] } } } },
      "address.townVillage": { $toUpper: { $trim: { input: { $ifNull: ["$address.townVillage", ""] } } } },
      "address.address": { $toUpper: { $trim: { input: { $ifNull: ["$address.address", ""] } } } },
      "nominee.name": { $toUpper: { $trim: { input: { $ifNull: ["$nominee.name", ""] } } } },
    } }]),
    Admin.updateMany({}, [{ $set: { fullName: { $toUpper: { $trim: { input: { $ifNull: ["$fullName", ""] } } } } } }]),
    Sahyog.updateMany({}, [{ $set: { causeOfDeath: { $toUpper: { $trim: { input: { $ifNull: ["$causeOfDeath", ""] } } } }, familyInfo: { $toUpper: { $trim: { input: { $ifNull: ["$familyInfo", ""] } } } }, description: { $toUpper: { $trim: { input: { $ifNull: ["$description", ""] } } } }, address: { $toUpper: { $trim: { input: { $ifNull: ["$address", ""] } } } }, contactName: { $toUpper: { $trim: { input: { $ifNull: ["$contactName", ""] } } } }, "paymentDetails.bankName": { $toUpper: { $trim: { input: { $ifNull: ["$paymentDetails.bankName", ""] } } } }, "paymentDetails.accountHolderName": { $toUpper: { $trim: { input: { $ifNull: ["$paymentDetails.accountHolderName", ""] } } } }, "paymentDetails.accountNumber": { $toUpper: { $trim: { input: { $ifNull: ["$paymentDetails.accountNumber", ""] } } } }, "paymentDetails.ifsc": { $toUpper: { $trim: { input: { $ifNull: ["$paymentDetails.ifsc", ""] } } } }, "paymentDetails.branchName": { $toUpper: { $trim: { input: { $ifNull: ["$paymentDetails.branchName", ""] } } } }, "publicPayment.upiId": { $toUpper: { $trim: { input: { $ifNull: ["$publicPayment.upiId", ""] } } } } } }]),
    Donation.updateMany({}, [{ $set: { donorName: { $toUpper: { $trim: { input: { $ifNull: ["$donorName", ""] } } } }, transactionId: { $toUpper: { $trim: { input: { $ifNull: ["$transactionId", ""] } } } } } }]),
    VyawasthaPayment.updateMany({}, [{ $set: { payerName: { $toUpper: { $trim: { input: { $ifNull: ["$payerName", ""] } } } }, utrNumber: { $toUpper: { $trim: { input: { $ifNull: ["$utrNumber", ""] } } } } } }]),
    Claim.updateMany({}, [{ $set: { deceasedFullName: { $toUpper: { $trim: { input: { $ifNull: ["$deceasedFullName", ""] } } } }, causeOfDeath: { $toUpper: { $trim: { input: { $ifNull: ["$causeOfDeath", ""] } } } }, placeOfDeath: { $toUpper: { $trim: { input: { $ifNull: ["$placeOfDeath", ""] } } } }, description: { $toUpper: { $trim: { input: { $ifNull: ["$description", ""] } } } }, nomineeName: { $toUpper: { $trim: { input: { $ifNull: ["$nomineeName", ""] } } } }, address: { $toUpper: { $trim: { input: { $ifNull: ["$address", ""] } } } }, documentNotes: { $toUpper: { $trim: { input: { $ifNull: ["$documentNotes", ""] } } } }, adminNotes: { $toUpper: { $trim: { input: { $ifNull: ["$adminNotes", ""] } } } } } }]),
    Contact.updateMany({}, [{ $set: { name: { $toUpper: { $trim: { input: { $ifNull: ["$name", ""] } } } }, subject: { $toUpper: { $trim: { input: { $ifNull: ["$subject", ""] } } } }, message: { $toUpper: { $trim: { input: { $ifNull: ["$message", ""] } } } } } }]),
    ReferralCode.updateMany({}, [{ $set: { code: { $toUpper: { $trim: { input: { $ifNull: ["$code", ""] } } } }, label: { $toUpper: { $trim: { input: { $ifNull: ["$label", ""] } } } } } }]),
    SahyogAlert.updateMany({}, [{ $set: { title: { $toUpper: { $trim: { input: { $ifNull: ["$title", ""] } } } }, message: { $toUpper: { $trim: { input: { $ifNull: ["$message", ""] } } } } } }]),
  ]);
  const updateRequests = await normalizeUpdateRequest();
  console.log("Uppercase migration completed.");
  console.table(operations.map((result, index) => ({ collection: ["users", "admins", "sahyog", "donations", "vyawasthaPayments", "claims", "contacts", "referralCodes", "sahyogAlerts"][index], matched: result.matchedCount, modified: result.modifiedCount })).concat({ collection: "memberUpdateRequests", matched: updateRequests, modified: updateRequests }));
  await mongoose.disconnect();
};

run().catch(async (error) => { console.error("Uppercase migration failed:", error); await mongoose.disconnect(); process.exitCode = 1; });
