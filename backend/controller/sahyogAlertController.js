import SahyogAlert from "../models/SahyogAlert.js";

const getSahyogAlert = async (req, res) => {
  try {
    const alert = await SahyogAlert.findOne({
      isActive: true,
    }).sort({ updatedAt: -1 });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "No active Sahyog alert found",
      });
    }

    res.status(200).json({
      success: true,
      alert,
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