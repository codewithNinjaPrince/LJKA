import crypto from "crypto";
import mongoose from "mongoose";
import Sahyog from "../models/sahyogModel.js";
import Donation from "../models/donationModel.js";
import User from "../models/userModel.js";
import { audit } from "../utils/audit.js";

const makeId = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
const memberFields = "fullName memberId mobile address";
const publicMember = (member) => ({ fullName: member?.fullName || "Member", memberId: member?.memberId || "—" });
const publicCase = (item) => ({ _id: item._id, sahyogId: item.sahyogId, photoUrl: item.photoUrl, dateOfDeath: item.dateOfDeath, familyInfo: item.familyInfo, description: item.description, targetAmount: item.targetAmount, minimumDonationAmount: item.minimumDonationAmount, status: item.status, publicPayment: item.publicPayment, createdAt: item.createdAt, member: publicMember(item.memberId), donationSummary: item.donationSummary });
const totalsFor = async (ids) => Donation.aggregate([{ $match: { sahyogId: { $in: ids }, paymentStatus: "success" } }, { $group: { _id: "$sahyogId", amount: { $sum: "$amount" }, count: { $sum: 1 } } }]);
const decorate = async (cases) => {
  const totals = await totalsFor(cases.map((item) => item._id));
  const byId = new Map(totals.map((item) => [String(item._id), { amount: item.amount, count: item.count }]));
  return cases.map((item) => ({ ...item.toObject?.() || item, donationSummary: byId.get(String(item._id)) || { amount: 0, count: 0 } }));
};
const parsePagination = (req) => ({ page: Math.max(1, Number(req.query.page) || 1), limit: Math.min(100, Math.max(1, Number(req.query.limit) || 20)) });
const validateSahyogInput = (value) => {
  if (value.dateOfDeath && Number.isNaN(new Date(value.dateOfDeath).getTime())) return "Date of death is invalid";
  for (const key of ["minimumDonationAmount", "targetAmount"]) if (value[key] !== undefined && value[key] !== "" && (!Number.isFinite(Number(value[key])) || Number(value[key]) < 0)) return `${key === "targetAmount" ? "Target" : "Minimum donation"} amount cannot be negative`;
  if (value.minimumDonationAmount && value.targetAmount && Number(value.minimumDonationAmount) > Number(value.targetAmount)) return "Minimum donation amount cannot exceed the target amount";
  if (value.contactMobile && !/^[6-9]\d{9}$/.test(String(value.contactMobile))) return "Contact mobile must be a valid 10-digit Indian mobile number";
  if (value.paymentDetails?.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(value.paymentDetails.ifsc)) return "IFSC code is invalid";
  if (value.paymentDetails?.accountNumber && !/^[A-Za-z0-9-]{6,34}$/.test(value.paymentDetails.accountNumber)) return "Account number is invalid";
  return null;
};

export const listSahyog = async (req, res) => {
  const { page, limit } = parsePagination(req); const search = String(req.query.search || "").trim();
  const filter = { isDeleted: false, ...(req.query.status ? { status: req.query.status } : {}) };
  if (search) { const members = await User.find({ $or: [{ fullName: new RegExp(search, "i") }, { memberId: new RegExp(search, "i") }] }).select("_id"); filter.$or = [{ sahyogId: new RegExp(search, "i") }, { memberId: { $in: members.map((m) => m._id) } }]; }
  const [total, cases] = await Promise.all([Sahyog.countDocuments(filter), Sahyog.find(filter).populate("memberId", memberFields).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)]);
  res.json({ success: true, cases: await decorate(cases), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};

export const getSahyog = async (req, res) => { const item = await Sahyog.findOne({ _id: req.params.id, isDeleted: false }).populate("memberId", memberFields); if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" }); res.json({ success: true, sahyog: (await decorate([item]))[0] }); };
export const createSahyog = async (req, res) => {
  const { memberId, dateOfDeath, description, status = "draft", targetAmount } = req.body;
  if (!memberId || !dateOfDeath || !description?.trim()) return res.status(422).json({ success: false, message: "Member, date of death and description are required" });
  if (!mongoose.isValidObjectId(memberId)) return res.status(400).json({ success: false, message: "Invalid member" });
  const validationError = validateSahyogInput(req.body); if (validationError) return res.status(422).json({ success: false, message: validationError });
  const member = await User.findById(memberId); if (!member) return res.status(404).json({ success: false, message: "Member not found" });
  const item = await Sahyog.create({
    sahyogId: makeId("SHG"), memberId: member._id, dateOfDeath, description: description.trim(), status,
    targetAmount: targetAmount === "" ? null : targetAmount, minimumDonationAmount: req.body.minimumDonationAmount === "" ? null : req.body.minimumDonationAmount, photoUrl: req.body.photoUrl, familyInfo: req.body.familyInfo,
    address: req.body.address, contactName: req.body.contactName, contactMobile: req.body.contactMobile,
    paymentDetails: req.body.paymentDetails, publicPayment: req.body.publicPayment,
    createdBy: req.admin._id, updatedBy: req.admin._id,
  });
  if (member.accountStatus !== "deceased") { member.accountStatus = "deceased"; await member.save(); }
  await audit(req, { action: "sahyog_created", module: "sahyog", resourceId: item._id, metadata: { sahyogId: item.sahyogId, memberId: member.memberId } });
  res.status(201).json({ success: true, sahyog: item });
};
export const updateSahyog = async (req, res) => {
  const allowed = ["photoUrl", "dateOfDeath", "familyInfo", "description", "address", "contactName", "contactMobile", "targetAmount", "minimumDonationAmount", "status", "paymentDetails", "publicPayment"];
  const changes = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
  const validationError = validateSahyogInput(changes); if (validationError) return res.status(422).json({ success: false, message: validationError });
  const item = await Sahyog.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: { ...changes, updatedBy: req.admin._id } }, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" });
  await audit(req, { action: Object.hasOwn(changes, "paymentDetails") ? "sahyog_payment_details_updated" : "sahyog_updated", module: "sahyog", resourceId: item._id, metadata: { fields: Object.keys(changes) } });
  res.json({ success: true, sahyog: item });
};
export const disableSahyog = async (req, res) => { const item = await Sahyog.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: { status: "disabled", isDeleted: true, updatedBy: req.admin._id } }, { new: true }); if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" }); await audit(req, { action: "sahyog_disabled", module: "sahyog", resourceId: item._id }); res.json({ success: true }); };
export const listDonations = async (req, res) => { const { page, limit } = parsePagination(req); const item = await Sahyog.exists({ _id: req.params.id, isDeleted: false }); if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" }); const filter = { sahyogId: req.params.id, ...(req.query.status ? { paymentStatus: req.query.status } : {}), ...(req.query.search ? { donorName: new RegExp(String(req.query.search), "i") } : {}) }; const [total, donations] = await Promise.all([Donation.countDocuments(filter), Donation.find(filter).populate("donorId", "memberId fullName").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean()]); res.json({ success: true, donations, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }); };
export const updateDonation = async (req, res) => { const allowed = ["paymentStatus", "transactionId", "paymentMethod", "isAnonymous"]; const changes = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]])); if (changes.paymentStatus === "success") { changes.verifiedAt = new Date(); changes.verifiedBy = req.admin._id; } const donation = await Donation.findOneAndUpdate({ _id: req.params.donationId, sahyogId: req.params.id }, { $set: changes }, { new: true, runValidators: true }); if (!donation) return res.status(404).json({ success: false, message: "Donation not found" }); await audit(req, { action: "donation_updated", module: "sahyog-donations", resourceId: donation._id, metadata: { fields: Object.keys(changes) } }); res.json({ success: true, donation }); };

export const publicListSahyog = async (req, res) => { const { page, limit } = parsePagination(req); const filter = { status: "active", isDeleted: false }; const [total, cases] = await Promise.all([Sahyog.countDocuments(filter), Sahyog.find(filter).populate("memberId", memberFields).sort({ dateOfDeath: -1, _id: -1 }).skip((page - 1) * limit).limit(limit)]); const enriched = await decorate(cases); res.json({ success: true, cases: enriched.map(publicCase), pagination: { page, limit, total, pages: Math.ceil(total / limit) } }); };
export const publicGetSahyog = async (req, res) => { const item = await Sahyog.findOne({ _id: req.params.id, status: "active", isDeleted: false }).populate("memberId", memberFields); if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" }); res.json({ success: true, sahyog: publicCase((await decorate([item]))[0]) }); };
export const publicListDonations = async (req, res) => {
  const { page, limit } = parsePagination(req); const search = String(req.query.search || "").trim(); const match = { paymentStatus: "success" };
  if (req.query.sahyogId && mongoose.isValidObjectId(req.query.sahyogId)) match.sahyogId = new mongoose.Types.ObjectId(req.query.sahyogId);
  if (req.query.dateFrom || req.query.dateTo) match.createdAt = { ...(req.query.dateFrom ? { $gte: new Date(req.query.dateFrom) } : {}), ...(req.query.dateTo ? { $lte: new Date(`${req.query.dateTo}T23:59:59.999Z`) } : {}) };
  const pipeline = [{ $match: match }, { $lookup: { from: "sahyogs", localField: "sahyogId", foreignField: "_id", as: "case" } }, { $unwind: "$case" }, { $match: { "case.status": "active", "case.isDeleted": false } }, { $lookup: { from: "users", localField: "donorId", foreignField: "_id", as: "donor" } }, { $unwind: { path: "$donor", preserveNullAndEmptyArrays: true } }, { $lookup: { from: "users", localField: "case.memberId", foreignField: "_id", as: "lateMember" } }, { $unwind: "$lateMember" }];
  if (req.query.district) pipeline.push({ $match: { "donor.address.districtName": String(req.query.district) } }); if (req.query.tehsil) pipeline.push({ $match: { "donor.address.tehsilName": String(req.query.tehsil) } }); if (search) pipeline.push({ $match: { $or: ["$donor.fullName", "$donor.memberId", "$lateMember.fullName"].map((field) => ({ [field]: new RegExp(search, "i") })) } });
  const [result] = await Donation.aggregate([...pipeline, { $sort: { verifiedAt: -1, createdAt: -1, _id: -1 } }, { $facet: { rows: [{ $skip: (page - 1) * limit }, { $limit: limit }, { $project: { amount: 1, createdAt: 1, verifiedAt: 1, isAnonymous: 1, "donor.memberId": 1, "donor.fullName": 1, "donor.address.districtName": 1, "donor.address.tehsilName": 1, "lateMember.fullName": 1, "lateMember.memberId": 1 } }], total: [{ $count: "count" }] } }]);
  const total = result?.total[0]?.count || 0; const donations = (result?.rows || []).map((d) => ({ _id: d._id, donor: d.isAnonymous ? null : { memberId: d.donor?.memberId || "—", fullName: d.donor?.fullName || "Member", district: d.donor?.address?.districtName || "", tehsil: d.donor?.address?.tehsilName || "" }, lateMember: { fullName: d.lateMember.fullName, memberId: d.lateMember.memberId || "—" }, amount: d.amount, donatedAt: d.verifiedAt || d.createdAt, isAnonymous: d.isAnonymous }));
  res.json({ success: true, donations, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};
export const publicListCaseDonors = async (req, res) => { req.query.sahyogId = req.params.id; return publicListDonations(req, res); };
export const initiatePublicDonation = async (req, res) => { const { donorName, donorEmail, donorMobile, amount, isAnonymous = false } = req.body; const item = await Sahyog.findOne({ _id: req.params.id, status: "active", isDeleted: false }); if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" }); if (!amount || Number(amount) <= 0) return res.status(422).json({ success: false, message: "A valid donation amount is required" }); const donation = await Donation.create({ donationId: makeId("DON"), sahyogId: item._id, donorName, donorEmail, donorMobile, amount: Number(amount), isAnonymous, paymentMethod: "unconfigured", paymentStatus: "pending" }); res.status(202).json({ success: true, message: "Donation intent recorded. Payment remains pending until a verified payment provider is configured.", donationId: donation.donationId, paymentStatus: donation.paymentStatus }); };
export const userListSahyog = publicListSahyog;
export const userGetSahyog = async (req, res) => { const item = await Sahyog.findOne({ _id: req.params.id, status: "active", isDeleted: false }).populate("memberId", memberFields); if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" }); const value = (await decorate([item]))[0]; res.json({ success: true, sahyog: { ...publicCase(value), paymentDetails: value.paymentDetails } }); };
export const userCreateDonation = async (req, res) => { const item = await Sahyog.findOne({ _id: req.params.id, status: "active", isDeleted: false }); if (!item) return res.status(404).json({ success: false, message: "Sahyog case not found" }); const amount = Number(req.body.amount); if (!Number.isFinite(amount) || amount <= 0 || (item.minimumDonationAmount && amount < item.minimumDonationAmount)) return res.status(422).json({ success: false, message: item.minimumDonationAmount ? `Minimum donation amount is ₹${item.minimumDonationAmount}` : "A valid donation amount is required" }); const donor = await User.findById(req.userId).select("fullName email mobile"); if (!donor) return res.status(401).json({ success: false, message: "Member account not found" }); const donation = await Donation.create({ donationId: makeId("DON"), sahyogId: item._id, donorId: donor._id, donorName: donor.fullName, donorEmail: donor.email, donorMobile: donor.mobile, amount, isAnonymous: Boolean(req.body.isAnonymous), transactionId: String(req.body.transactionId || "").trim(), paymentMethod: String(req.body.paymentMethod || "manual").trim(), paymentStatus: "pending" }); res.status(202).json({ success: true, message: "Your donation has been submitted and is awaiting verification.", donationId: donation.donationId, paymentStatus: donation.paymentStatus }); };
