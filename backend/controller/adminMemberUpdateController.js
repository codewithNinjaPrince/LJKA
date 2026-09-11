import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import MemberUpdateRequest from "../models/memberUpdateRequestModel.js";

/* =========================================================
   GET ALL PENDING UPDATE REQUESTS
========================================================= */

const getPendingMemberUpdateRequests = async (req, res) => {
  try {
    const requests = await MemberUpdateRequest.find({
      status: "pending",
    })
      .populate("userId", "fullName email memberId mobile")
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error(
      "GET PENDING MEMBER UPDATE REQUESTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch update requests",
    });
  }
};

/* =========================================================
   GET SINGLE UPDATE REQUEST
========================================================= */

const getMemberUpdateRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await MemberUpdateRequest.findById(requestId)
      .populate("userId", "-password");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Update request not found",
      });
    }

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    console.error(
      "GET MEMBER UPDATE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch update request",
    });
  }
};

/* =========================================================
   APPROVE UPDATE REQUEST
========================================================= */

const approveMemberUpdateRequest = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { requestId } = req.params;
    const adminId = req.userId;

    session.startTransaction();

    const request = await MemberUpdateRequest.findOne({
      _id: requestId,
      status: "pending",
    }).session(session);

    if (!request) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Pending update request not found",
      });
    }

    const user = await userModel
      .findById(request.userId)
      .session(session);

    if (!user) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Member account not found",
      });
    }

    /*
     * Apply ONLY the fields requested by the member.
     *
     * The original User document was untouched until
     * the admin approved this request.
     */
    Object.keys(request.requestedChanges).forEach((field) => {
      user[field] = request.requestedChanges[field];
    });

    await user.save({ session });

    request.status = "approved";
    request.reviewedAt = new Date();
    request.reviewedBy = adminId;

    await request.save({ session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Member update request approved successfully",
    });
  } catch (error) {
    await session.abortTransaction();

    console.error(
      "APPROVE MEMBER UPDATE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to approve update request",
    });
  } finally {
    session.endSession();
  }
};

/* =========================================================
   REJECT UPDATE REQUEST
========================================================= */

const rejectMemberUpdateRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const adminId = req.userId;

    const { adminRemarks = "" } = req.body;

    const request = await MemberUpdateRequest.findOne({
      _id: requestId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Pending update request not found",
      });
    }

    request.status = "rejected";
    request.reviewedAt = new Date();
    request.reviewedBy = adminId;
    request.adminRemarks = adminRemarks.trim();

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Member update request rejected",
    });
  } catch (error) {
    console.error(
      "REJECT MEMBER UPDATE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to reject update request",
    });
  }
};

/* =========================================================
   EXPORTS
========================================================= */

export {
  getPendingMemberUpdateRequests,
  getMemberUpdateRequestById,
  approveMemberUpdateRequest,
  rejectMemberUpdateRequest,
};