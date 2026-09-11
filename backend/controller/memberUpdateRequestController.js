import userModel from "../models/userModel.js";
import MemberUpdateRequest from "../models/memberUpdateRequestModel.js";

const submitMemberUpdateRequest = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const requestedChanges = req.body;

    if (
      !requestedChanges ||
      typeof requestedChanges !== "object" ||
      Array.isArray(requestedChanges) ||
      Object.keys(requestedChanges).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No update details were provided",
      });
    }

    const user = await userModel
      .findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    // Check whether this member already has a pending request.
    const existingRequest = await MemberUpdateRequest.findOne({
      userId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message:
          "You already have an update request pending admin verification.",
      });
    }

    /*
     * Fields that members are allowed to request changes for.
     *
     * IMPORTANT:
     * Sensitive/system-controlled fields such as:
     * password, memberId, kycCompleted, membership status,
     * payment status, membership dates, etc. cannot be changed
     * through this request.
     */
    const allowedFields = [
      "fullName",
      "mobile",
      "fatherHusbandName",
      "aadhaar",
      "dob",
      "gender",
      "occupation",
      "address",
      "nominee",
      "employmentStatus",
    ];

    const filteredChanges = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(requestedChanges, field)) {
        filteredChanges[field] = requestedChanges[field];
      }
    }

    if (Object.keys(filteredChanges).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid profile fields were provided for update.",
      });
    }

    /*
     * Take a snapshot of the current values.
     * The User document itself is NOT modified here.
     */
    const currentValues = {};

    for (const field of Object.keys(filteredChanges)) {
      currentValues[field] = user[field];
    }

    const updateRequest = await MemberUpdateRequest.create({
      userId: user._id,
      requestedChanges: filteredChanges,
      currentValues,
      status: "pending",
      submittedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message:
        "Your update request has been submitted for admin verification.",
      request: {
        id: updateRequest._id,
        status: updateRequest.status,
        submittedAt: updateRequest.submittedAt,
      },
    });
  } catch (error) {
    console.error(
      "SUBMIT MEMBER UPDATE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to submit update request",
    });
  }
};

export {
  submitMemberUpdateRequest,
};