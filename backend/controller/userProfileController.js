import userModel from "../models/userModel.js";

/* =========================================================
   GET USER PROFILE
   GET /api/user/profile
========================================================= */

const getUserProfile = async (req, res) => {
  try {

    // authUser middleware provides this
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Find logged-in user
    const user = await userModel
      .findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });

  } catch (error) {

    console.error(
      "GET USER PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
    });
  }
};


export {
  getUserProfile,
};