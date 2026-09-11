import MemberCounter from "../models/memberCounterModel.js";

const STATE_CODES = {
  "andaman and nicobar islands": "AN",
  "andhra pradesh": "AP",
  "arunachal pradesh": "AR",
  assam: "AS",
  bihar: "BR",
  chandigarh: "CH",
  chhattisgarh: "CG",
  "dadra and nagar haveli and daman and diu": "DD",
  delhi: "DL",
  goa: "GA",
  gujarat: "GJ",
  haryana: "HR",
  "himachal pradesh": "HP",
  "jammu and kashmir": "JK",
  jharkhand: "JH",
  karnataka: "KA",
  kerala: "KL",
  ladakh: "LA",
  lakshadweep: "LD",
  "madhya pradesh": "MP",
  maharashtra: "MH",
  manipur: "MN",
  meghalaya: "ML",
  mizoram: "MZ",
  nagaland: "NL",
  odisha: "OD",
  puducherry: "PY",
  punjab: "PB",
  rajasthan: "RJ",
  sikkim: "SK",
  "tamil nadu": "TN",
  telangana: "TS",
  tripura: "TR",
  "uttar pradesh": "UP",
  uttarakhand: "UK",
  "west bengal": "WB",
};

const EMPLOYMENT_CODES = {
  government: "G",
  private: "P",
  business: "B",
  "self-employed": "S",
  student: "ST",
};

const normalize = (value) => String(value || "").trim().toLowerCase();

const getStateCode = (stateName) => {
  const normalizedState = normalize(stateName);
  return (
    STATE_CODES[normalizedState] ||
    normalizedState
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  );
};

const generateMemberId = async ({ address, employmentStatus }) => {
  const stateName = address?.stateName;

  const stateCode = getStateCode(stateName);
  const employmentCode = EMPLOYMENT_CODES[normalize(employmentStatus)];

  if (!stateCode || !employmentCode) {
    throw new Error("State and employment status are required for member ID");
  }

  const counter = await MemberCounter.findOneAndUpdate(
    { _id: "memberId" },
    { $inc: { sequence: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return `${stateCode}${employmentCode}${counter.sequence}`;
};

export default generateMemberId;