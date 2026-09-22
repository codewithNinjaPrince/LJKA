import crypto from "crypto";
import Claim from "../models/claimModel.js";
import User from "../models/userModel.js";
import { audit } from "../utils/audit.js";
import { parseCalendarDate } from "../utils/calendarDate.js";

const makeId = (prefix) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

const publicClaim = (claim) => ({
  _id: claim._id,
  claimId: claim.claimId,
  deceasedFullName: claim.deceasedFullName,
  deceasedMemberCode: claim.deceasedMemberCode,
  dateOfDeath: claim.dateOfDeath,
  relationship: claim.relationship,
  causeOfDeath: claim.causeOfDeath,
  placeOfDeath: claim.placeOfDeath,
  description: claim.description,
  nomineeName: claim.nomineeName,
  nomineeMobile: claim.nomineeMobile,
  contactMobile: claim.contactMobile,
  address: claim.address,
  documentNotes: claim.documentNotes,
  status: claim.status,
  adminNotes: claim.adminNotes,
  createdAt: claim.createdAt,
  updatedAt: claim.updatedAt,
});

export const userCreateClaim = async (req, res) => {
  try {
    if (req.body.confirmed !== true) {
      return res.status(422).json({ success: false, message: "Please confirm this claim before submitting" });
    }

    const member = await User.findById(req.userId).select("fullName memberId mobile nominee address");
    if (!member) {
      return res.status(401).json({ success: false, message: "Member account not found" });
    }

    const dateOfDeath = parseCalendarDate(req.body.dateOfDeath);
    const nomineeMobile = String(req.body.nomineeMobile || member.nominee?.mobile || "").trim();
    const contactMobile = String(req.body.contactMobile || member.mobile || "").trim();

    if (!dateOfDeath) {
      return res.status(422).json({
        success: false,
        message: "Date of death is required",
      });
    }

    if (nomineeMobile && !/^[6-9]\d{9}$/.test(nomineeMobile)) {
      return res.status(422).json({ success: false, message: "Nominee mobile must be a valid 10-digit number" });
    }

    if (contactMobile && !/^[6-9]\d{9}$/.test(contactMobile)) {
      return res.status(422).json({ success: false, message: "Contact mobile must be a valid 10-digit number" });
    }

    const claim = await Claim.create({
      claimId: makeId("CLM"),
      claimantId: member._id,
      deceasedMemberId: member._id,
      deceasedMemberCode: member.memberId || "",
      deceasedFullName: member.fullName,
      dateOfDeath,
      relationship: "member",
      causeOfDeath: String(req.body.causeOfDeath || "").trim(),
      placeOfDeath: String(req.body.placeOfDeath || "").trim(),
      description: "Claim submitted from the member account.",
      nomineeName: member.nominee?.name || "",
      nomineeMobile,
      contactMobile,
      address: String(req.body.address || member.address?.address || "").trim(),
      documentNotes: "",
    });

    res.status(201).json({
      success: true,
      message: "Your claim has been submitted for superadmin review.",
      claim: publicClaim(claim),
    });
  } catch (error) {
    console.error("CREATE CLAIM ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to submit claim" });
  }
};

export const userListClaims = async (req, res) => {
  const claims = await Claim.find({ claimantId: req.userId }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, claims: claims.map(publicClaim) });
};

export const adminListClaims = async (req, res) => {
  const search = String(req.query.search || "").trim();
  const status = String(req.query.status || "").trim();
  const filter = {
    ...(status ? { status } : {}),
  };

  if (search) {
    const expression = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const claimants = await User.find({
      $or: [{ fullName: expression }, { memberId: expression }, { email: expression }, { mobile: expression }],
    }).select("_id");

    filter.$or = [
      { claimId: expression },
      { deceasedFullName: expression },
      { deceasedMemberCode: expression },
      { claimantId: { $in: claimants.map((item) => item._id) } },
    ];
  }

  const claims = await Claim.find(filter)
    .populate("claimantId", "fullName email memberId mobile")
    .populate("deceasedMemberId", "fullName memberId")
    .populate("reviewedBy", "fullName username")
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  res.json({ success: true, claims });
};

export const adminUpdateClaim = async (req, res) => {
  const changes = {};
  if (req.body.status !== undefined) {
    if (!["pending", "in_review", "approved", "rejected", "closed"].includes(req.body.status)) {
      return res.status(400).json({ success: false, message: "Invalid claim status" });
    }
    changes.status = req.body.status;
    changes.reviewedBy = req.admin._id;
    changes.reviewedAt = new Date();
  }

  if (req.body.adminNotes !== undefined) {
    changes.adminNotes = String(req.body.adminNotes || "").trim();
  }

  if (!Object.keys(changes).length) {
    return res.status(400).json({ success: false, message: "No claim changes were supplied" });
  }

  const claim = await Claim.findByIdAndUpdate(req.params.id, { $set: changes }, { returnDocument: "after", runValidators: true })
    .populate("claimantId", "fullName email memberId mobile")
    .populate("deceasedMemberId", "fullName memberId")
    .populate("reviewedBy", "fullName username");

  if (!claim) return res.status(404).json({ success: false, message: "Claim not found" });

  await audit(req, {
    action: "claim_updated",
    module: "claims",
    resourceId: claim._id,
    metadata: { fields: Object.keys(changes), status: claim.status },
  });

  res.json({ success: true, claim });
};
