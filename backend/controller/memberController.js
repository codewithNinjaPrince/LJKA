import User from "../models/userModel.js";

const getMembers = async (req, res) => {
  try {
    // ==========================================
    // QUERY PARAMETERS
    // ==========================================

    const {
      page = 1,
      limit = 50,
      search = "",
      state = "",
      district = "",
      tehsil = "",
      occupation = "",
      employmentStatus = "",
    } = req.query;

    // ==========================================
    // PAGINATION
    // ==========================================

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);

    // Never allow more than 50 users per request
    const perPage = Math.min(
      Math.max(parseInt(limit, 10) || 50, 1),
      50
    );

    const skip = (currentPage - 1) * perPage;

    // ==========================================
    // BASE FILTER
    // ==========================================

    const filter = {
      kycCompleted: true,
      memberId: { $exists: true, $ne: "" },
    };

    // ==========================================
    // SEARCH
    // ==========================================

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      filter.$or = [
        { fullName: searchRegex },
        { memberId: searchRegex },
      ];
    }

    // ==========================================
    // STATE FILTER
    // ==========================================

    if (state.trim()) {
      filter["address.stateName"] = state.trim();
    }

    // ==========================================
    // DISTRICT FILTER
    // ==========================================

    if (district.trim()) {
      filter["address.districtName"] = district.trim();
    }

    // ==========================================
    // TEHSIL FILTER
    // ==========================================

    if (tehsil.trim()) {
      filter["address.tehsilName"] = tehsil.trim();
    }

    // ==========================================
    // OCCUPATION FILTER
    // ==========================================

    if (occupation.trim()) {
      filter.occupation = new RegExp(
        occupation.trim(),
        "i"
      );
    }

    // ==========================================
    // EMPLOYMENT STATUS FILTER
    // ==========================================

    if (employmentStatus.trim()) {
      filter.employmentStatus = employmentStatus.trim();
    }

    // ==========================================
    // FETCH MEMBERS + TOTAL COUNT
    // ==========================================

    const [members, totalMembers] = await Promise.all([
      User.find(filter)
        .select(
          "memberId fullName mobile address occupation employmentStatus createdAt"
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

    // ==========================================
    // PAGINATION INFORMATION
    // ==========================================

    const totalPages = Math.ceil(
      totalMembers / perPage
    );

    // ==========================================
    // MASK MOBILE NUMBER
    // ==========================================

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

    // ==========================================
    // FORMAT MEMBERS FOR FRONTEND
    // ==========================================

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

    // ==========================================
    // RESPONSE
    // ==========================================

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

export { getMembers };