import MemberCounter from "../models/memberCounterModel.js";

const generateMemberId = async () => {
  const counter = await MemberCounter.findOneAndUpdate(
    { _id: "memberId" },
    { $inc: { sequence: 1 } },
    {
      returnDocument: "after",
      upsert: true,
    }
  );

  const sequenceNumber = String(counter.sequence).padStart(6, "0");

  return `LJKA-${new Date().getFullYear()}-${sequenceNumber}`;
};

export default generateMemberId;