import ReferralCode from "../models/referralCodeModel.js";
import User from "../models/userModel.js";

const LEGACY_CODES = ["AY92"];

const phoneFromCode = (code) => {
  let hash = 0;
  for (const character of code) {
    hash = (hash * 33 + character.charCodeAt(0)) >>> 0;
  }
  return `6${String(100000000 + (hash % 900000000)).slice(-9)}`;
};

export const escapeRegExp = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const referralCodeMatch = (code) =>
  new RegExp(`^${escapeRegExp(String(code || "").trim())}$`, "i");

export const ensureLegacyReferralCodes = async () => {
  const usedCodes = await User.distinct("referralCode", {
    referralCode: { $nin: [null, ""] },
  });

  const codes = [
    ...new Set(
      [...LEGACY_CODES, ...usedCodes]
        .map((code) => String(code || "").trim().toUpperCase())
        .filter((code) => /^[A-Z0-9]{2,32}$/.test(code))
    ),
  ];

  if (!codes.length) return;

  const existing = await ReferralCode.find({ code: { $in: codes } })
    .select("code")
    .lean();
  const have = new Set(existing.map((item) => item.code));

  await Promise.all(
    codes
      .filter((code) => !have.has(code))
      .map(async (code) => {
        try {
          await ReferralCode.create({
            code,
            label:
              code === "AY92"
                ? "Legacy shared referral code"
                : "Imported from existing members",
            email: `legacy.${code.toLowerCase()}@referrals.ljka.internal`,
            phone: phoneFromCode(code),
            isActive: true,
          });
        } catch (error) {
          if (error.code !== 11000) throw error;
        }
      })
  );
};
