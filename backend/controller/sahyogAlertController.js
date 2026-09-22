import SahyogAlert from "../models/sahyogAlert.js";

const getSahyogAlert = async (req, res) => {
  try {
    const alerts = await SahyogAlert.find({ isActive: true })
      .sort({ updatedAt: -1, createdAt: -1, _id: -1 })
      .lean();

    res.status(200).json({
      success: true,
      alerts,
      alert: alerts[0] || null,
    });
  } catch (error) {
    console.error("Error fetching Sahyog alert:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Sahyog alert",
    });
  }
};

export { getSahyogAlert };