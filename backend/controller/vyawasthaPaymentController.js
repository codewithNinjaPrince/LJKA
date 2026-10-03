import mongoose from "mongoose";
import User from "../models/userModel.js";
import VyawasthaPayment from "../models/vyawasthaPaymentModel.js";
import { getMembershipExpiryAt } from "../utils/membershipExpiry.js";

// ============================================================
// CONFIGURATION
// ============================================================

// Put your actual annual Vywastha Shulk here.
const ANNUAL_VYAWASTHA_AMOUNT = Number(
  process.env.VYAWASTHA_ANNUAL_AMOUNT || 0
);

// UTR/reference number validation.
// Allows common bank UTR/reference formats while preventing
// very short or obviously invalid values.
const UTR_REGEX = /^[A-Z0-9][A-Z0-9\-/:._]{5,31}$/i;


// ============================================================
// GET PAYMENT INFORMATION
// GET /api/user/vyawastha/payment
// ============================================================

export const getVyawasthaPaymentInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select(
        "fullName memberId email mobile address membershipPaymentStatus membershipExpiresAt firstVyawasthaShulkWaived"
      )
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Member account not found",
      });
    }

    const payments = await VyawasthaPayment.find({
      userId: user._id,
      financialYear: "2026-27",
    })
      .sort({ createdAt: -1 })
      .lean();
    const existingPayment = payments[0] || null;
    const paymentHistory = payments.map((payment) => ({
      id: payment._id,
      payerName: payment.payerName,
      utrNumber: payment.utrNumber,
      amount: payment.amount,
      paymentStatus: payment.paymentStatus,
      createdAt: payment.createdAt,
      verifiedAt: payment.verifiedAt,
      rejectionReason: payment.rejectionReason || "",
    }));

    return res.json({
      success: true,

      payment: {
        amount: ANNUAL_VYAWASTHA_AMOUNT,

        qrUrl: "/img/vyawastha-shulk-qr.png",

        paymentStatus:
          user.membershipPaymentStatus || "pending",

        firstVyawasthaShulkWaived:
          Boolean(user.firstVyawasthaShulkWaived),

        membershipExpiresAt:
          user.membershipExpiresAt || null,

        existingPayment: paymentHistory[0] || null,
        paymentHistory,
      },

      user: {
        fullName: user.fullName,
        memberId: user.memberId,
        email: user.email,
        mobile: user.mobile,
        address: user.address || {},
      },
    });
  } catch (error) {
    console.error(
      "GET VYAWASTHA PAYMENT INFO ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load Vywastha payment information",
    });
  }
};


// ============================================================
// SUBMIT VYAWASTHA PAYMENT
// POST /api/user/vyawastha/payment
// ============================================================

export const submitVyawasthaPayment = async (req, res) => {
  try {
    const userId = req.userId;

    const payerName = String(
      req.body.payerName || ""
    ).trim();

    const utrNumber = String(
      req.body.utrNumber || ""
    )
      .trim()
      .toUpperCase();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // --------------------------------------------------------
    // NAME
    // --------------------------------------------------------

    if (!payerName || payerName.length < 3) {
      return res.status(422).json({
        success: false,
        message: "Please enter a valid payer name",
      });
    }

    // --------------------------------------------------------
    // UTR FORMAT
    // --------------------------------------------------------

    if (!UTR_REGEX.test(utrNumber)) {
      return res.status(422).json({
        success: false,
        code: "INVALID_UTR",
        message:
          "Invalid UTR / transaction reference number",
      });
    }

    // --------------------------------------------------------
    // AMOUNT
    // --------------------------------------------------------

    if (
      !Number.isFinite(ANNUAL_VYAWASTHA_AMOUNT) ||
      ANNUAL_VYAWASTHA_AMOUNT <= 0
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Annual Vywastha Shulk amount is not configured",
      });
    }

    // --------------------------------------------------------
    // USER
    // --------------------------------------------------------

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Member account not found",
      });
    }

    // --------------------------------------------------------
    // ALREADY PAID
    // --------------------------------------------------------

    if (
      user.membershipPaymentStatus === "paid" &&
      user.membershipExpiresAt &&
      new Date(user.membershipExpiresAt) >= new Date()
    ) {
      return res.status(409).json({
        success: false,
        code: "ALREADY_PAID",
        message:
          "Your annual Vywastha Shulk is already verified.",
        membershipExpiresAt:
          user.membershipExpiresAt,
      });
    }

    // A verified payment is final for this financial year. This keeps the
    // rule intact even if a membership status is later corrected separately.
    const verifiedPayment = await VyawasthaPayment.findOne({
      userId: user._id,
      financialYear: "2026-27",
      paymentStatus: "verified",
    }).lean();

    if (verifiedPayment) {
      return res.status(409).json({
        success: false,
        code: "ALREADY_PAID",
        message: "Your annual Vywastha Shulk is already verified.",
        membershipExpiresAt: verifiedPayment.membershipExpiresAt || null,
      });
    }

    // --------------------------------------------------------
    // UTR ALREADY EXISTS
    // --------------------------------------------------------

    const existingUtr = await VyawasthaPayment.findOne({
      utrNumber,
    });

    if (existingUtr) {
      return res.status(409).json({
        success: false,
        code: "UTR_EXISTS",
        message:
          "This UTR / transaction reference has already been submitted.",
      });
    }

    // --------------------------------------------------------
    // EXISTING PENDING PAYMENT FOR THIS USER
    // --------------------------------------------------------

    const existingPending = await VyawasthaPayment.findOne({
      userId: user._id,
      financialYear: "2026-27",
      paymentStatus: "pending",
    });

    if (existingPending) {
      return res.status(409).json({
        success: false,
        code: "PAYMENT_PENDING",
        message:
          "You already have a Vywastha payment waiting for verification.",
      });
    }

    // --------------------------------------------------------
    // CREATE PAYMENT
    // --------------------------------------------------------

    const payment = await VyawasthaPayment.create({
      userId: user._id,
      payerName: payerName.toUpperCase(),
      utrNumber,
      amount: ANNUAL_VYAWASTHA_AMOUNT,
      paymentStatus: "pending",
      paymentFor: "vyawastha_annual",
      financialYear: "2026-27",
    });

    return res.status(201).json({
      success: true,
      message:
        "Vywastha Shulk payment submitted successfully. It is awaiting admin verification.",
      payment: {
        id: payment._id,
        payerName: payment.payerName,
        utrNumber: payment.utrNumber,
        amount: payment.amount,
        paymentStatus: payment.paymentStatus,
      },
    });
  } catch (error) {
    console.error(
      "SUBMIT VYAWASTHA PAYMENT ERROR:",
      error
    );

    // MongoDB unique UTR protection
    if (error.code === 11000) {
      if (error.keyPattern?.utrNumber) {
        return res.status(409).json({
          success: false,
          code: "UTR_EXISTS",
          message:
            "This UTR / transaction reference has already been submitted.",
        });
      }
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit Vywastha payment",
    });
  }
};

export const listVyawasthaPayments = async (req, res) => {
  try {
    const payments = await VyawasthaPayment.find()
      .populate(
        "userId",
        "fullName memberId email mobile membershipPaymentStatus membershipExpiresAt"
      )
      .populate(
        "verifiedBy",
        "fullName username email"
      )
      .sort({
        paymentStatus: 1,
        createdAt: -1,
      })
      .lean();

    return res.json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error(
      "LIST VYAWASTHA PAYMENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load Vywastha payments",
    });
  }
};


// ============================================================
// VERIFY
// PATCH /api/admin/vyawastha-payments/:id/verify
// ============================================================

export const verifyVyawasthaPayment = async (
  req,
  res
) => {
  try {
    const payment =
      await VyawasthaPayment.findOne({
        _id: req.params.id,
        paymentStatus: "pending",
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Pending Vywastha payment not found",
      });
    }

    const user = await User.findById(
      payment.userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Member account not found",
      });
    }

    // --------------------------------------------------------
    // MARK PAYMENT VERIFIED
    // --------------------------------------------------------

    const verifiedAt = new Date();
    // The member's payment date determines the membership term. This means a
    // UTR submitted during the launch period retains the 18 Oct 2027 expiry
    // even if an administrator verifies it shortly afterwards.
    const membershipExpiresAt = getMembershipExpiryAt(payment.createdAt);

    payment.paymentStatus = "verified";
    payment.verifiedAt = verifiedAt;
    payment.verifiedBy = req.admin._id;
    payment.membershipExpiresAt = membershipExpiresAt;

    await payment.save();

    // --------------------------------------------------------
    // ACTIVATE MEMBERSHIP
    // --------------------------------------------------------

    user.membershipPaymentStatus = "paid";
    user.membershipStatus = "active";
    user.membershipStartDate = verifiedAt;
    user.membershipExpiresAt = membershipExpiresAt;

    await user.save();

    return res.json({
      success: true,
      message:
        "Vywastha payment verified and membership activated.",
      payment: {
        id: payment._id,
        paymentStatus: payment.paymentStatus,
        membershipExpiresAt:
          payment.membershipExpiresAt,
      },
    });
  } catch (error) {
    console.error(
      "VERIFY VYAWASTHA PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify Vywastha payment",
    });
  }
};


// ============================================================
// REJECT
// PATCH /api/admin/vyawastha-payments/:id/reject
// ============================================================

export const rejectVyawasthaPayment = async (
  req,
  res
) => {
  try {
    const payment =
      await VyawasthaPayment.findOne({
        _id: req.params.id,
        paymentStatus: "pending",
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Pending Vywastha payment not found",
      });
    }

    payment.paymentStatus = "rejected";
    payment.rejectionReason = String(
      req.body.reason || "Payment could not be verified"
    ).trim();
    payment.verifiedAt = null;
    payment.verifiedBy = null;

    await payment.save();

    return res.json({
      success: true,
      message:
        "Vywastha payment rejected.",
    });
  } catch (error) {
    console.error(
      "REJECT VYAWASTHA PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to reject Vywastha payment",
    });
  }
};
