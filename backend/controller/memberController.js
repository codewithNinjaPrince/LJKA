import User from "../models/userModel.js";

const MEMBER_CACHE_TTL_MS = 0;
const MAX_CACHED_MEMBER_QUERIES = 100;
const memberResponseCache = new Map();

// ============================================================
// NORMALIZE SEARCH VALUE
// ============================================================

const normalizeSearch = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/\s+/g, "");
};

// ============================================================
// A small in-process cache makes repeated page views and pagination instant on
// a warm serverless instance. CDN/browser caching adds another layer below.
// ============================================================

const getCachedResponse = (key) => {
  const cached = memberResponseCache.get(key);

  if (!cached || Date.now() - cached.createdAt > MEMBER_CACHE_TTL_MS) {
    memberResponseCache.delete(key);
    return null;
  }

  return cached.payload;
};

const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const legacySearchExpression = (normalizedSearch) => {
  const regex = escapeRegex(normalizedSearch);

  return {
    $or: [
      {
        $regexMatch: {
          input: { $replaceAll: { input: { $toLower: { $ifNull: ["$fullName", ""] } }, find: " ", replacement: "" } },
          regex,
        },
      },
      {
        $regexMatch: {
          input: { $replaceAll: { input: { $toLower: { $ifNull: ["$memberId", ""] } }, find: " ", replacement: "" } },
          regex,
        },
      },
      {
        $regexMatch: {
          input: { $replaceAll: { input: { $ifNull: ["$mobile", ""] }, find: " ", replacement: "" } },
          regex,
        },
      },
    ],
  };
};

const cacheResponse = (key, payload) => {
  if (memberResponseCache.size >= MAX_CACHED_MEMBER_QUERIES) {
    memberResponseCache.delete(memberResponseCache.keys().next().value);
  }

  memberResponseCache.set(key, { createdAt: Date.now(), payload });
};

// ============================================================
// GET MEMBERS
// ============================================================

const getMembers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = "",
      state = "",
      district = "",
      tehsil = "",
      employmentStatus = "",
    } = req.query;

    // ========================================================
    // PAGINATION
    // ========================================================

    const currentPage = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(parseInt(limit, 10) || 50, 1),
      50
    );

    const skip = (currentPage - 1) * perPage;
    const cacheKey = JSON.stringify({
      currentPage,
      perPage,
      search: normalizeSearch(search),
      state: String(state).trim(),
      district: String(district).trim(),
      tehsil: String(tehsil).trim(),
      employmentStatus: String(employmentStatus).trim(),
    });

    const cached = getCachedResponse(cacheKey);
    if (cached) {
      res.set("Cache-Control", "no-store");
      return res.status(200).json(cached);
    }

    // ========================================================
    // BASE FILTER
    // ========================================================

    const filter = {
      kycCompleted: true,
      memberId: {
        $exists: true,
        $ne: "",
      },
    };

    // ========================================================
    // SEARCH
    //
    // Searches:
    // - Full name
    // - Member ID
    // - Mobile number
    //
    // Case insensitive
    // Space insensitive
    // ========================================================

    const normalizedSearch = normalizeSearch(search);

    if (normalizedSearch) {
      // Equality on a precomputed prefix is indexable. The legacy branch keeps
      // old documents searchable until the preparation script has backfilled
      // them; it disappears from the query plan once that one-time job runs.
      filter.$or = [
        { publicSearchTerms: normalizedSearch },
        {
          publicSearchTerms: { $exists: false },
          $expr: legacySearchExpression(normalizedSearch),
        },
      ];
    }

    // ========================================================
    // STATE FILTER
    // ========================================================

   if (state.trim()) {
  const stateCode = Number(state);

  if (!Number.isNaN(stateCode)) {
    filter["address.stateCode"] = stateCode;
  }
}

    // ========================================================
    // DISTRICT FILTER
    // ========================================================

    if (district.trim()) {
  const districtCode = Number(district);

  if (!Number.isNaN(districtCode)) {
    filter["address.districtCode"] = districtCode;
  }
}
    // ========================================================
    // TEHSIL FILTER
    // ========================================================

    if (tehsil.trim()) {
  const tehsilCode = Number(tehsil);

  if (!Number.isNaN(tehsilCode)) {
    filter["address.tehsilCode"] = tehsilCode;
  }
}

    // ========================================================
    // EMPLOYMENT STATUS FILTER
    // ========================================================

    if (employmentStatus.trim()) {
      filter.employmentStatus = employmentStatus.trim();
    }

    // ========================================================
    // FETCH MEMBERS + TOTAL
    // ========================================================

    const [members, totalMembers] = await Promise.all([
      // KYC time is the membership-list order. membershipStartDate is the
      // equivalent timestamp on older records created before kycCompletedAt
      // existed; createdAt is only a final legacy fallback.
      User.aggregate([
        { $match: filter },
        {
          $addFields: {
            memberListedAt: {
              $ifNull: ["$kycCompletedAt", { $ifNull: ["$membershipStartDate", "$createdAt"] }],
            },
            // Member IDs end in their allocation number (for example UPG12).
            // Convert that suffix to a real number so 12 is correctly ahead
            // of 11 and 10 rather than using alphabetical ordering.
            memberIdNumber: {
              $convert: {
                input: {
                  $let: {
                    vars: {
                      matched: {
                        $regexFind: {
                          input: { $ifNull: ["$memberId", ""] },
                          regex: "(\\d+)$",
                        },
                      },
                    },
                    in: { $arrayElemAt: ["$$matched.captures", 0] },
                  },
                },
                to: "int",
                onError: 0,
                onNull: 0,
              },
            },
          },
        },
        { $sort: { memberIdNumber: -1, memberListedAt: -1, _id: -1 } },
        { $skip: skip },
        { $limit: perPage },
        {
          $project: {
            memberId: 1, fullName: 1, mobile: 1, address: 1,
            occupation: 1, employmentStatus: 1, memberListedAt: 1, kycCompletedAt: 1,
          },
        },
      ]),
      User.countDocuments(filter),
    ]);

    // ========================================================
    // PAGINATION
    // ========================================================

    const totalPages = Math.ceil(
      totalMembers / perPage
    );

    // ========================================================
    // MASK MOBILE
    // ========================================================

    const maskMobile = (mobile) => {
      if (!mobile) {
        return "-";
      }

      const value = String(mobile);

      if (value.length < 4) {
        return "*".repeat(value.length);
      }

      return `${value.slice(0, 2)}${"*".repeat(
        value.length - 4
      )}${value.slice(-2)}`;
    };

    // ========================================================
    // FORMAT MEMBERS
    // ========================================================

    const formattedMembers = members.map(
      (user, index) => ({
        serialNo: skip + index + 1,

        memberId: user.memberId,

        fullName: String(user.fullName || "").toUpperCase(),

        mobile: maskMobile(user.mobile),

        address: user.address?.address || "",

        state: user.address?.stateName || "",

        district: user.address?.districtName || "",

        tehsil: user.address?.tehsilName || "",

        occupation: user.occupation || "",

        employmentStatus:
          user.employmentStatus || "",

        registeredAt: user.kycCompletedAt || user.memberListedAt,
      })
    );

    // ========================================================
    // RESPONSE
    // ========================================================

    const payload = {
      success: true,

      data: formattedMembers,

      pagination: {
        currentPage,
        perPage,
        totalMembers,
        totalPages,

        hasNextPage:
          currentPage < totalPages,

        hasPreviousPage:
          currentPage > 1,
      },
    };

    cacheResponse(cacheKey, payload);
    res.set("Cache-Control", "no-store");
    return res.status(200).json(payload);
  } catch (error) {
    console.error(
      "GET MEMBERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch members",
    });
  }
};

const getMemberFilterOptions = async (req, res) => {
  try {
    const filter = {
      kycCompleted: true,
      memberId: {
        $exists: true,
        $ne: "",
      },
    };

    const [states, districts, tehsils, employmentStatuses] = await Promise.all([
      User.distinct("address.stateName", filter),
      User.distinct("address.districtName", filter),
      User.distinct("address.tehsilName", filter),
      User.distinct("employmentStatus", filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        states: states.filter(Boolean).sort(),
        districts: districts.filter(Boolean).sort(),
        tehsils: tehsils.filter(Boolean).sort(),
        employmentStatuses: employmentStatuses.filter(Boolean).sort(),
      },
    });
  } catch (error) {
    console.error("GET MEMBER FILTER OPTIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch member filter options",
    });
  }
};

export { getMembers, getMemberFilterOptions };
