import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/mongodb.js";
import User, { createPublicSearchTerms } from "../models/userModel.js";

// One-time, idempotent preparation for the fast public member directory.
// Run: node scripts/prepareMemberDirectory.js
const run = async () => {
  await connectDB();

  const cursor = User.find({ kycCompleted: true, memberId: { $exists: true, $ne: "" } })
    .select("fullName memberId mobile publicSearchTerms")
    .lean()
    .cursor();

  const operations = [];
  let updated = 0;

  for await (const member of cursor) {
    const publicSearchTerms = createPublicSearchTerms(member);
    if (JSON.stringify(member.publicSearchTerms || []) === JSON.stringify(publicSearchTerms)) continue;

    operations.push({
      updateOne: { filter: { _id: member._id }, update: { $set: { publicSearchTerms } } },
    });

    if (operations.length === 500) {
      await User.bulkWrite(operations, { ordered: false });
      updated += operations.length;
      operations.length = 0;
    }
  }

  if (operations.length) {
    await User.bulkWrite(operations, { ordered: false });
    updated += operations.length;
  }

  await User.syncIndexes();
  console.log(`Member directory prepared. Updated ${updated} records and synchronized indexes.`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Member directory preparation failed:", error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
