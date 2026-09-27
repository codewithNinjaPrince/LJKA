import crypto from "crypto";
import mongoose from "mongoose";
import Sahyog from "../models/sahyogModel.js";
import Donation from "../models/donationModel.js";
import User from "../models/userModel.js";
import { audit } from "../utils/audit.js";
import { parseCalendarDate } from "../utils/calendarDate.js";

const makeId = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
const LIST_CACHE_TTL_MS = 0;
const MAX_CACHED_LISTS = 100;
const listResponseCache = new Map();

const cachedList = (key) => {
  const value = listResponseCache.get(key);
  if (!value || Date.now() - value.createdAt > LIST_CACHE_TTL_MS) {
    listResponseCache.delete(key);
    return null;
  }
  return value.payload;
};

const cacheList = (key, payload) => {
  if (listResponseCache.size >= MAX_CACHED_LISTS) {
    listResponseCache.delete(listResponseCache.keys().next().value);
  }
  listResponseCache.set(key, { createdAt: Date.now(), payload });
};

const clearListCache = () => listResponseCache.clear();
const memberFields = "fullName memberId mobile address";
const publicMember = (member) => ({
  fullName: String(member?.fullName || "Member").toUpperCase(),
  memberId: member?.memberId || "—",
  district: member?.address?.districtName || "—",
  tehsil: member?.address?.tehsilName || "—",
});
const publicCase = (item) => ({ _id: item._id, sahyogId: item.sahyogId, photoUrl: item.photoUrl, dateOfDeath: item.dateOfDeath, familyInfo: item.familyInfo, description: item.description, targetAmount: item.targetAmount, minimumDonationAmount: item.minimumDonationAmount, status: item.status, publicPayment: item.publicPayment, createdAt: item.createdAt, member: publicMember(item.memberId), donationSummary: item.donationSummary });
const totalsFor = async (ids) => Donation.aggregate([{ $match: { sahyogId: { $in: ids }, paymentStatus: "success" } }, { $group: { _id: "$sahyogId", amount: { $sum: "$amount" }, count: { $sum: 1 } } }]);
const decorate = async (cases) => {
  const totals = await totalsFor(cases.map((item) => item._id));
  const byId = new Map(totals.map((item) => [String(item._id), { amount: item.amount, count: item.count }]));
  return cases.map((item) => ({ ...item.toObject?.() || item, donationSummary: byId.get(String(item._id)) || { amount: 0, count: 0 } }));
};
const parsePagination = (req) => ({ page: Math.max(1, Number(req.query.page) || 1), limit: Math.min(100, Math.max(1, Number(req.query.limit) || 20)) });
const validateSahyogInput = (value) => {
  if (value.dateOfDeath) {
    const parsed = parseCalendarDate(value.dateOfDeath);
    if (!parsed) return "Date of death is invalid";
    if (parsed > new Date()) return "Date of death cannot be in the future";
  }
  for (const key of ["minimumDonationAmount", "targetAmount"]) if (value[key] !== undefined && value[key] !== "" && (!Number.isFinite(Number(value[key])) || Number(value[key]) < 0)) return `${key === "targetAmount" ? "Target" : "Minimum donation"} amount cannot be negative`;
  if (value.minimumDonationAmount && value.targetAmount && Number(value.minimumDonationAmount) > Number(value.targetAmount)) return "Minimum donation amount cannot exceed the target amount";
  if (value.contactMobile && !/^[6-9]\d{9}$/.test(String(value.contactMobile))) return "Contact mobile must be a valid 10-digit Indian mobile number";
  if (value.paymentDetails?.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(value.paymentDetails.ifsc)) return "IFSC code is invalid";
  if (value.paymentDetails?.accountNumber && !/^[A-Za-z0-9-]{6,34}$/.test(value.paymentDetails.accountNumber)) return "Account number is invalid";
  return null;
};

export const listSahyog = async (req, res) => {
  const { page, limit } = parsePagination(req); const search = String(req.query.search || "").trim();
  const cacheKey = `admin:${JSON.stringify({ page, limit, search, status: req.query.status || "" })}`;
  const cached = cachedList(cacheKey);
  if (cached) return res.json(cached);
  const filter = { isDeleted: false, ...(req.query.status ? { status: req.query.status } : {}) };
  if (search) { const members = await User.find({ $or: [{ fullName: new RegExp(search, "i") }, { memberId: new RegExp(search, "i") }] }).select("_id"); filter.$or = [{ sahyogId: new RegExp(search, "i") }, { memberId: { $in: members.map((m) => m._id) } }]; }
  const [total, cases] = await Promise.all([Sahyog.countDocuments(filter), Sahyog.find(filter).populate("memberId", memberFields).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean()]);
  const payload = { success: true, cases: await decorate(cases), pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  cacheList(cacheKey, payload);
  res.json(payload);
};

export const getSahyog = async (req, res) => { const item = await Sahyog.findOne({ _id: req.params.id, isDeleted: false }).populate("memberId", memberFields); if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" }); res.json({ success: true, sahyog: (await decorate([item]))[0] }); };
export const listEligibleSahyogMembers = async (req, res) => {
  const members = await User.find({
    kycCompleted: true,
    $or: [
      { accountStatus: "active" },
      { accountStatus: { $exists: false } },
    ],
  })
    .select(memberFields)
    .sort({ fullName: 1 })
    .lean();

  res.json({ success: true, members });
};
export const createSahyog = async (req, res) => {
  const { memberId, status = "active", targetAmount } = req.body;
  const dateOfDeath = parseCalendarDate(req.body.dateOfDeath);
  if (!memberId || !dateOfDeath) return res.status(422).json({ success: false, message: "Member and date of death are required" });
  if (!req.body.contactName?.trim() || !req.body.contactMobile?.trim() || !req.body.address?.trim()) return res.status(422).json({ success: false, message: "Family contact person, mobile and address are required" });
  if (!mongoose.isValidObjectId(memberId)) return res.status(400).json({ success: false, message: "Invalid member" });
  const validationError = validateSahyogInput(req.body); if (validationError) return res.status(422).json({ success: false, message: validationError });
  const member = await User.findOne({
    _id: memberId,
    kycCompleted: true,
    $or: [
      { accountStatus: "active" },
      { accountStatus: { $exists: false } },
    ],
  });
  if (!member) return res.status(422).json({ success: false, message: "Only active members with completed KYC can be selected" });
  const item = await Sahyog.create({
    sahyogId: makeId("SHG"), memberId: member._id, dateOfDeath, description: String(req.body.description || "").trim(), status,
    targetAmount: targetAmount === "" ? null : targetAmount, minimumDonationAmount: req.body.minimumDonationAmount === "" ? null : req.body.minimumDonationAmount, photoUrl: req.body.photoUrl, familyInfo: req.body.familyInfo,
    address: req.body.address, contactName: req.body.contactName, contactMobile: req.body.contactMobile,
    paymentDetails: req.body.paymentDetails, publicPayment: req.body.publicPayment,
    createdBy: req.admin._id, updatedBy: req.admin._id,
  });
  if (member.accountStatus !== "deceased") { member.accountStatus = "deceased"; await member.save(); }
  clearListCache();
  await audit(req, { action: "sahyog_created", module: "sahyog", resourceId: item._id, metadata: { sahyogId: item.sahyogId, memberId: member.memberId } });
  res.status(201).json({ success: true, sahyog: item });
};
export const updateSahyog = async (req, res) => {
  const allowed = ["photoUrl", "dateOfDeath", "familyInfo", "description", "address", "contactName", "contactMobile", "targetAmount", "minimumDonationAmount", "status", "paymentDetails", "publicPayment"];
  const changes = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
  if (changes.dateOfDeath !== undefined) {
    const parsed = parseCalendarDate(changes.dateOfDeath);
    if (!parsed) return res.status(422).json({ success: false, message: "Date of death is invalid" });
    changes.dateOfDeath = parsed;
  }
  const validationError = validateSahyogInput(changes); if (validationError) return res.status(422).json({ success: false, message: validationError });
  const item = await Sahyog.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: { ...changes, updatedBy: req.admin._id } }, { returnDocument: "after", runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" });
  clearListCache();
  await audit(req, { action: Object.hasOwn(changes, "paymentDetails") ? "sahyog_payment_details_updated" : "sahyog_updated", module: "sahyog", resourceId: item._id, metadata: { fields: Object.keys(changes) } });
  res.json({ success: true, sahyog: item });
};
export const disableSahyog = async (req, res) => { const item = await Sahyog.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: { status: "disabled", isDeleted: true, updatedBy: req.admin._id } }, { returnDocument: "after" }); if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" }); clearListCache(); await audit(req, { action: "sahyog_disabled", module: "sahyog", resourceId: item._id }); res.json({ success: true }); };
export const listDonations = async (req, res) => { const { page, limit } = parsePagination(req); const item = await Sahyog.exists({ _id: req.params.id, isDeleted: false }); if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" }); const filter = { sahyogId: req.params.id, ...(req.query.status ? { paymentStatus: req.query.status } : {}), ...(req.query.search ? { donorName: new RegExp(String(req.query.search), "i") } : {}) }; const [total, donations] = await Promise.all([Donation.countDocuments(filter), Donation.find(filter).populate("donorId", "memberId fullName").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean()]); res.json({ success: true, donations, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }); };
const setDonationStatus = async (req, res, paymentStatus) => {
  const changes = paymentStatus === "success"
    ? { paymentStatus, verifiedAt: new Date(), verifiedBy: req.admin._id }
    : { paymentStatus, verifiedAt: null, verifiedBy: null };
  const donation = await Donation.findOneAndUpdate({ _id: req.params.donationId, sahyogId: req.params.id }, { $set: changes }, { returnDocument: "after", runValidators: true });
  if (!donation) return res.status(404).json({ success: false, message: "Donation not found" });
  clearListCache();
  await audit(req, { action: `donation_${paymentStatus}`, module: "sahyog-donations", resourceId: donation._id, metadata: { sahyogId: req.params.id } });
  return res.json({ success: true, donation });
};
export const verifyDonation = async (req, res) => setDonationStatus(req, res, "success");
export const rejectDonation = async (req, res) => setDonationStatus(req, res, "rejected");

export const publicListSahyog = async (req, res) => {
  try {
    const { page, limit } = parsePagination(req);

    const search = String(req.query.search || "").trim();
    const state = String(req.query.state || "").trim();
    const district = String(req.query.district || "").trim();
    const tehsil = String(req.query.tehsil || "").trim();

    const cacheKey = `public-cases:${JSON.stringify({
      page,
      limit,
      search,
      state,
      district,
      tehsil,
    })}`;

    const cached = cachedList(cacheKey);

    if (cached) {
      res.set("Cache-Control", "no-store");
      return res.json(cached);
    }

    // ------------------------------------------------------------
    // BASE SAHYOG FILTER
    // ------------------------------------------------------------

    const filter = {
      status: "active",
      isDeleted: false,
    };

    // ------------------------------------------------------------
    // MEMBER FILTER
    // ------------------------------------------------------------

    const memberQuery = {};

    if (state) {
      memberQuery["address.stateCode"] = Number(state);
    }

    if (district) {
      memberQuery["address.districtCode"] = Number(district);
    }

    if (tehsil) {
      memberQuery["address.tehsilCode"] = Number(tehsil);
    }

    // ------------------------------------------------------------
    // SEARCH
    // ------------------------------------------------------------

    if (search) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const searchRegex = new RegExp(
        escapedSearch,
        "i"
      );

      memberQuery.$or = [
        { fullName: searchRegex },
        { memberId: searchRegex },
        { mobile: searchRegex },
        { email: searchRegex },
      ];
    }

    // ------------------------------------------------------------
    // FIND MEMBERS
    // ------------------------------------------------------------

    if (Object.keys(memberQuery).length > 0) {
      const members = await User.find(memberQuery)
        .select("_id")
        .lean();

      const memberIds = members.map(
        (member) => member._id
      );

      if (search) {
        const escapedSearch = search.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

        const searchRegex = new RegExp(
          escapedSearch,
          "i"
        );

        filter.$or = [
          {
            sahyogId: searchRegex,
          },
          {
            memberId: {
              $in: memberIds,
            },
          },
        ];
      } else {
        filter.memberId = {
          $in: memberIds,
        };
      }
    } else if (search) {
      // Search only by Sahyog ID when no member
      // location filter is present.
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.sahyogId = new RegExp(
        escapedSearch,
        "i"
      );
    }

    // ------------------------------------------------------------
    // FETCH CASES
    // ------------------------------------------------------------

    const [total, cases] = await Promise.all([
      Sahyog.countDocuments(filter),

      Sahyog.find(filter)
        .populate("memberId", memberFields)
        .sort({
          dateOfDeath: -1,
          _id: -1,
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    // ------------------------------------------------------------
    // DECORATE RESPONSE
    // ------------------------------------------------------------

    const enriched = await decorate(cases);

    const payload = {
      success: true,
      cases: enriched.map(publicCase),

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    cacheList(cacheKey, payload);

    res.set("Cache-Control", "no-store");

    return res.json(payload);
  } catch (error) {
    console.error(
      "PUBLIC SAHYOG LIST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch Sahyog cases",
    });
  }
};
export const publicGetSahyog = async (req, res) => { const item = await Sahyog.findOne({ _id: req.params.id, status: "active", isDeleted: false }).populate("memberId", memberFields); if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" }); res.json({ success: true, sahyog: publicCase((await decorate([item]))[0]) }); };
export const publicGetCaseDonorSummary = async (req, res) => {
  const item = await Sahyog.findOne({
    _id: req.params.id,
    status: "active",
    isDeleted: false,
  })
    .populate(
      "memberId",
      "fullName memberId aadhaar"
    )
    .lean();

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Sahyog case not found",
    });
  }

  const [value] = await decorate([item]);

  const member = value.memberId || {};
  const payment = value.paymentDetails || {};

  const maskedAadhaar = member.aadhaar
    ? `${String(member.aadhaar).slice(0, 4)}••••••${String(
        member.aadhaar
      ).slice(-2)}`
    : "—";

  return res.json({
    success: true,

    summary: {
      /* ================================
         BENEFICIARY
      ================================= */

      member: {
        fullName: member.fullName || "Member",
        memberId: member.memberId || "—",
        aadhaar: maskedAadhaar,
      },

      /* ================================
         BANK DETAILS
      ================================= */

      bank: {
        accountHolderName:
          payment.accountHolderName || "—",

        accountNumber:
          payment.accountNumber || "—",

        ifsc:
          payment.ifsc || "—",

        bankName:
          payment.bankName || "—",

        branchName:
          payment.branchName || "—",
      },

      /* ================================
         DEATH DATE
      ================================= */

      dateOfDeath: value.dateOfDeath || null,

      /* ================================
         DONATION SUMMARY
      ================================= */

      donationSummary:
        value.donationSummary || {
          amount: 0,
          count: 0,
        },
    },
  });
};
export const publicListDonations = async (req, res) => {
  try {
    const { page, limit } = parsePagination(req);

    const search = String(req.query.search || "").trim();
    const sahyogId = String(req.query.sahyogId || "").trim();

    const state = String(req.query.state || "").trim();
    const district = String(req.query.district || "").trim();
    const tehsil = String(req.query.tehsil || "").trim();

    const dateFrom = String(req.query.dateFrom || "").trim();
    const dateTo = String(req.query.dateTo || "").trim();

    const cacheKey = `public-donations:${JSON.stringify({
      page,
      limit,
      search,
      sahyogId,
      dateFrom,
      dateTo,
      state,
      district,
      tehsil,
    })}`;

    const cached = cachedList(cacheKey);

    if (cached) {
      res.set(
        "Cache-Control",
        "public, max-age=20, s-maxage=20, stale-while-revalidate=40"
      );

      return res.json(cached);
    }

    // ============================================================
    // BASE DONATION FILTER
    // ============================================================

    const match = {
      paymentStatus: "success",
    };

    // ============================================================
    // SAHYOG CASE FILTER
    // ============================================================

    if (sahyogId) {
      if (!mongoose.isValidObjectId(sahyogId)) {
        return res.status(422).json({
          success: false,
          message: "Invalid Sahyog case",
        });
      }

      match.sahyogId = new mongoose.Types.ObjectId(sahyogId);
    }

    // ============================================================
    // DATE FILTER
    // ============================================================

    if (dateFrom || dateTo) {
      match.createdAt = {
        ...(dateFrom
          ? {
            $gte: new Date(dateFrom),
          }
          : {}),

        ...(dateTo
          ? {
            $lte: new Date(`${dateTo}T23:59:59.999Z`),
          }
          : {}),
      };
    }

    // ============================================================
    // ESCAPE SEARCH
    // ============================================================

    const escapedSearch = search
      ? search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      : "";

    // ============================================================
    // AGGREGATION
    // ============================================================

    const pipeline = [
      {
        $match: match,
      },

      // ------------------------------------------------------------
      // SAHYOG CASE
      // ------------------------------------------------------------

      {
        $lookup: {
          from: "sahyogs",
          localField: "sahyogId",
          foreignField: "_id",
          as: "case",
        },
      },

      {
        $unwind: "$case",
      },

      {
        $match: {
          "case.status": "active",
          "case.isDeleted": false,
        },
      },

      // ------------------------------------------------------------
      // DONOR
      // ------------------------------------------------------------

      {
        $lookup: {
          from: "users",
          localField: "donorId",
          foreignField: "_id",
          as: "donor",
        },
      },

      {
        $unwind: {
          path: "$donor",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ------------------------------------------------------------
      // LATE MEMBER
      // ------------------------------------------------------------

      {
        $lookup: {
          from: "users",
          localField: "case.memberId",
          foreignField: "_id",
          as: "lateMember",
        },
      },

      {
        $unwind: {
          path: "$lateMember",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    // ============================================================
    // LOCATION FILTERS
    // IMPORTANT:
    // Frontend sends location CODES, not names.
    // ============================================================

    if (state) {
      const stateCode = Number(state);

      if (!Number.isNaN(stateCode)) {
        pipeline.push({
          $match: {
            "donor.address.stateCode": stateCode,
          },
        });
      }
    }

    if (district) {
      const districtCode = Number(district);

      if (!Number.isNaN(districtCode)) {
        pipeline.push({
          $match: {
            "donor.address.districtCode": districtCode,
          },
        });
      }
    }

    if (tehsil) {
      const tehsilCode = Number(tehsil);

      if (!Number.isNaN(tehsilCode)) {
        pipeline.push({
          $match: {
            "donor.address.tehsilCode": tehsilCode,
          },
        });
      }
    }

    // ============================================================
    // SEARCH
    // ============================================================

    if (escapedSearch) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedSearch, "i");
      const searchRegex = new RegExp(escapedSearch, "i");

      pipeline.push({
        $match: {
          $or: [
            { "donor.fullName": regex },
            { "donor.memberId": regex },
            { "donor.mobile": regex },
            { "donor.email": regex },

            { "lateMember.fullName": regex },
            { "lateMember.memberId": regex },
            { "lateMember.mobile": regex },
            { "lateMember.email": regex },
          ],
        },
      });
    }

    // ============================================================
    // SORT + PAGINATION
    // ============================================================

    pipeline.push(
      {
        $sort: {
          verifiedAt: -1,
          createdAt: -1,
          _id: -1,
        },
      },

      {
        $facet: {
          rows: [
            {
              $skip: (page - 1) * limit,
            },

            {
              $limit: limit,
            },

            {
              $project: {
                amount: 1,
                createdAt: 1,
                verifiedAt: 1,
                isAnonymous: 1,

                "donor.memberId": 1,
                "donor.fullName": 1,
                "donor.mobile": 1,
                "donor.email": 1,
                "donor.address.districtName": 1,
                "donor.address.tehsilName": 1,

                "lateMember.fullName": 1,
                "lateMember.memberId": 1,
                "lateMember.mobile": 1,
                "lateMember.email": 1,
              },
            },
          ],

          total: [
            {
              $count: "count",
            },
          ],
        },
      }
    );

    // ============================================================
    // RUN AGGREGATION
    // ============================================================

    const [result] = await Donation.aggregate(pipeline);

    const total = result?.total?.[0]?.count || 0;

    const donations = (result?.rows || []).map((d) => ({
      _id: d._id,

      donor: {
        memberId: d.donor?.memberId || "—",

        fullName: String(
          d.donor?.fullName || "Member"
        ).toUpperCase(),

        district:
          d.donor?.address?.districtName || "",

        tehsil:
          d.donor?.address?.tehsilName || "",
      },

      lateMember: {
        fullName: String(
          d.lateMember?.fullName || "Member"
        ).toUpperCase(),

        memberId:
          d.lateMember?.memberId || "—",
      },

      amount: d.amount,

      donatedAt:
        d.verifiedAt || d.createdAt,
    }));

    // ============================================================
    // RESPONSE
    // ============================================================

    const payload = {
      success: true,

      donations,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),

        // These make it easier for the frontend
        // to handle pagination consistently.
        currentPage: page,
        perPage: limit,
        totalDonations: total,

        totalPages: Math.ceil(total / limit),

        hasNextPage:
          page < Math.ceil(total / limit),

        hasPreviousPage:
          page > 1,
      },
    };

    cacheList(cacheKey, payload);

    res.set(
      "Cache-Control",
      "public, max-age=20, s-maxage=20, stale-while-revalidate=40"
    );

    return res.json(payload);
  } catch (error) {
    console.error(
      "PUBLIC SAHYOG DONATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to fetch Sahyog donations",
    });
  }
};
export const publicListCaseDonors = async (req, res) => { req.query.sahyogId = req.params.id; return publicListDonations(req, res); };
export const initiatePublicDonation = async (req, res) => { const { donorName, donorEmail, donorMobile, amount } = req.body; const item = await Sahyog.findOne({ _id: req.params.id, status: "active", isDeleted: false }); if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" }); if (!amount || Number(amount) <= 0) return res.status(422).json({ success: false, message: "A valid donation amount is required" }); const donation = await Donation.create({ donationId: makeId("DON"), sahyogId: item._id, donorName, donorEmail, donorMobile, amount: Number(amount), isAnonymous: false, paymentMethod: "unconfigured", paymentStatus: "pending" }); res.status(202).json({ success: true, message: "Donation intent recorded. Payment remains pending until a verified payment provider is configured.", donationId: donation.donationId, paymentStatus: donation.paymentStatus }); };
export const userListSahyog = publicListSahyog;
export const userGetSahyog = async (req, res) => { const item = await Sahyog.findOne({ _id: req.params.id, status: "active", isDeleted: false }).populate("memberId", memberFields); if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" }); const value = (await decorate([item]))[0]; res.json({ success: true, sahyog: { ...publicCase(value), paymentDetails: value.paymentDetails } }); };
export const userCreateDonation = async (req, res) => {
  const item = await Sahyog.findOne({ _id: req.params.id, status: "active", isDeleted: false });
  if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" });
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount <= 0 || (item.minimumDonationAmount && amount < item.minimumDonationAmount)) {
    return res.status(422).json({ success: false, message: item.minimumDonationAmount ? `Minimum donation amount is ₹${item.minimumDonationAmount}` : "A valid donation amount is required" });
  }
  const transactionId = String(req.body.transactionId || "").trim();
  if (!/^[A-Za-z0-9][A-Za-z0-9\-_/:.]{5,63}$/.test(transactionId)) {
    return res.status(422).json({ success: false, message: "A valid transaction / UTR / UPI reference ID is required" });
  }
  const donor = await User.findById(req.userId).select("fullName email mobile");
  if (!donor) return res.status(401).json({ success: false, message: "Member account not found" });
  const donation = await Donation.create({
    donationId: makeId("DON"),
    sahyogId: item._id,
    donorId: donor._id,
    donorName: donor.fullName,
    donorEmail: donor.email,
    donorMobile: donor.mobile,
    amount,
    isAnonymous: false,
    transactionId,
    paymentMethod: String(req.body.paymentMethod || "manual").trim(),
    paymentStatus: "pending",
  });
  clearListCache();
  res.status(202).json({ success: true, message: "Your donation has been submitted and is awaiting verification.", donationId: donation.donationId, paymentStatus: donation.paymentStatus });
};
export const userListMyDonations = async (req, res) => {
  const { page, limit } = parsePagination(req);
  const [total, donations] = await Promise.all([
    Donation.countDocuments({ donorId: req.userId }),
    Donation.find({ donorId: req.userId })
      .populate({ path: "sahyogId", select: "sahyogId dateOfDeath memberId", populate: { path: "memberId", select: "fullName memberId" } })
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  res.json({
    success: true,
    donations: donations.map((donation) => ({
      _id: donation._id,
      donationId: donation.donationId,
      amount: donation.amount,
      paymentStatus: donation.paymentStatus,
      paymentMethod: donation.paymentMethod,
      transactionId: donation.transactionId,
      createdAt: donation.createdAt,
      verifiedAt: donation.verifiedAt,
      lateMember: {
        fullName: donation.sahyogId?.memberId?.fullName || "Member",
        memberId: donation.sahyogId?.memberId?.memberId || "—",
      },
      caseId: donation.sahyogId?.sahyogId || "",
    })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};
