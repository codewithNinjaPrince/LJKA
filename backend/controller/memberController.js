import User from "../models/userModel.js";

// ============================================================
// NORMALIZE SEARCH VALUE
// ============================================================

const normalizeSearch = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/\s+/g, "");
};

// ============================================================
// ESCAPE REGEX SPECIAL CHARACTERS
// ============================================================

const escapeRegex = (value = "") => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
      const safeSearch = escapeRegex(normalizedSearch);

      filter.$expr = {
        $or: [
          {
            $regexMatch: {
              input: {
                $replaceAll: {
                  input: {
                    $toLower: {
                      $ifNull: ["$fullName", ""],
                    },
                  },
                  find: " ",
                  replacement: "",
                },
              },
              regex: safeSearch,
            },
          },

          {
            $regexMatch: {
              input: {
                $replaceAll: {
                  input: {
                    $toLower: {
                      $ifNull: ["$memberId", ""],
                    },
                  },
                  find: " ",
                  replacement: "",
                },
              },
              regex: safeSearch,
            },
          },

          {
            $regexMatch: {
              input: {
                $replaceAll: {
                  input: {
                    $ifNull: ["$mobile", ""],
                  },
                  find: " ",
                  replacement: "",
                },
              },
              regex: safeSearch,
            },
          },
        ],
      };
    }

    // ========================================================
    // STATE FILTER
    // ========================================================

    if (state.trim()) {
      filter["address.stateName"] = state.trim();
    }

    // ========================================================
    // DISTRICT FILTER
    // ========================================================

    if (district.trim()) {
      filter["address.districtName"] = district.trim();
    }

    // ========================================================
    // TEHSIL FILTER
    // ========================================================

    if (tehsil.trim()) {
      filter["address.tehsilName"] = tehsil.trim();
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
      User.find(filter)
        .select(
          "memberId fullName mobile address.stateName address.districtName address.tehsilName address.address occupation employmentStatus createdAt"
        )
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .skip(skip)
        .limit(perPage)
        .lean(),

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

        fullName: user.fullName,

        mobile: maskMobile(user.mobile),

        address: user.address?.address || "",

        state: user.address?.stateName || "",

        district: user.address?.districtName || "",

        tehsil: user.address?.tehsilName || "",

        occupation: user.occupation || "",

        employmentStatus:
          user.employmentStatus || "",

        registeredAt: user.createdAt,
      })
    );

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(200).json({
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
    });
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