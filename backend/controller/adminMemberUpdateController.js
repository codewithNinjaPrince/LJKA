import userModel from "../models/userModel.js";
import MemberUpdateRequest from "../models/memberUpdateRequestModel.js";
import { validateMemberDetails } from "../utils/memberDetails.js";

const FIELDS = ["fullName", "mobile", "fatherHusbandName", "aadhaar", "dob", "gender", "occupation", "employmentStatus", "address.stateName", "address.districtName", "address.tehsilName", "address.townVillage", "address.address", "address.pincode", "nominee.name", "nominee.mobile", "nominee.email", "nominee.relationship"];
const employmentStatusMap = { government: "government", govt: "government", private: "private", "private-sector": "private", business: "business", "self-employed": "business", "self employed": "business", selfemployed: "business", other: "others", others: "others" };
const get = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
const has = (object, path) => path.split(".").every((key) => {
  if (object === undefined || object === null || !Object.prototype.hasOwnProperty.call(object, key)) return false;
  object = object[key];
  return true;
});
const same = (first, second, field) => {
  if (field === "dob" && first && second) return new Date(first).toISOString().slice(0, 10) === new Date(second).toISOString().slice(0, 10);
  return String(first ?? "").trim() === String(second ?? "").trim();
};
const changedFields = (request) => FIELDS.filter((field) => has(request.requestedChanges, field) && !same(get(request.currentValues, field), get(request.requestedChanges, field), field));
const normalizeEmployment = (value) => employmentStatusMap[String(value || "").trim().toLowerCase()];
const profileWithApprovedChanges = (user, request, additionalFields = []) => {
  const profile = user.toObject ? user.toObject() : user;
  const result = {
    fullName: profile.fullName, email: profile.email, mobile: profile.mobile,
    fatherHusbandName: profile.fatherHusbandName, aadhaar: profile.aadhaar, dob: profile.dob,
    gender: profile.gender, occupation: profile.occupation, employmentStatus: profile.employmentStatus,
    address: { ...(profile.address || {}) }, nominee: { ...(profile.nominee || {}) }, accountStatus: profile.accountStatus,
  };
  const approved = new Set(additionalFields);
  for (const [field, review] of Object.entries(request.fieldReviews || {})) if (review?.status === "approved") approved.add(field);
  for (const field of approved) {
    let value = get(request.requestedChanges, field);
    if (field === "employmentStatus") value = normalizeEmployment(value);
    if (value !== undefined) {
      const parts = field.split(".");
      if (parts.length === 1) result[field] = value;
      else result[parts[0]][parts[1]] = value;
    }
  }
  return result;
};

const getPendingMemberUpdateRequests = async (req, res) => {
  try {
    const requests = await MemberUpdateRequest.find({ status: "pending" }).populate("userId", "fullName email memberId mobile").sort({ submittedAt: -1 }).lean();
    return res.json({ success: true, requests: requests.map((request) => ({ ...request, changedFields: changedFields(request) })) });
  } catch (error) { console.error("GET PENDING MEMBER UPDATE REQUESTS ERROR:", error); return res.status(500).json({ success: false, message: "Unable to fetch update requests" }); }
};

const getMemberUpdateRequestById = async (req, res) => {
  try {
    const request = await MemberUpdateRequest.findById(req.params.requestId).populate("userId", "-password").lean();
    if (!request) return res.status(404).json({ success: false, message: "Update request not found" });
    return res.json({ success: true, request: { ...request, changedFields: changedFields(request) } });
  } catch (error) { console.error("GET MEMBER UPDATE REQUEST ERROR:", error); return res.status(500).json({ success: false, message: "Unable to fetch update request" }); }
};

const finaliseIfReviewed = (request, fields, adminId) => {
  const reviews = request.fieldReviews || {};
  if (!fields.every((field) => ["approved", "rejected"].includes(reviews[field]?.status))) return false;
  request.status = fields.some((field) => reviews[field]?.status === "approved") ? "approved" : "rejected";
  request.reviewedAt = new Date(); request.reviewedBy = adminId;
  return true;
};

const reviewFields = async (req, res, action, fieldsToReview) => {
  try {
    const request = await MemberUpdateRequest.findOne({ _id: req.params.requestId, status: "pending" });
    if (!request) return res.status(404).json({ success: false, message: "Pending update request not found" });
    const changed = changedFields(request);
    const fields = fieldsToReview.filter((field) => changed.includes(field));
    if (!fields.length) return res.status(422).json({ success: false, message: "No changed fields were selected" });
    const user = await userModel.findById(request.userId);
    if (!user) return res.status(404).json({ success: false, message: "Member account not found" });
    const currentEmployment = normalizeEmployment(user.employmentStatus);
    if (currentEmployment) user.employmentStatus = currentEmployment;
    const reviews = { ...(request.fieldReviews || {}) };
    if (action === "approve") {
      // Do not re-validate values that were already rejected when an admin
      // later chooses "approve all" for the remaining fields.
      const fieldsBeingApproved = fields.filter((field) => !reviews[field]?.status);
      const candidate = profileWithApprovedChanges(user, request, fieldsBeingApproved);
      const { error, data } = await validateMemberDetails(candidate, { requireAadhaar: true });
      if (error) return res.status(422).json({ success: false, message: `Cannot approve: ${error}` });

      const uniqueFields = new Set(fieldsBeingApproved);
      const [mobileOwner, aadhaarOwner] = await Promise.all([
        uniqueFields.has("mobile") ? userModel.findOne({ mobile: data.mobile, _id: { $ne: user._id } }).select("_id") : null,
        uniqueFields.has("aadhaar") ? userModel.findOne({ aadhaar: data.aadhaar, _id: { $ne: user._id } }).select("_id") : null,
      ]);
      if (mobileOwner) return res.status(409).json({ success: false, message: "Cannot approve: this mobile number is already registered" });
      if (aadhaarOwner) return res.status(409).json({ success: false, message: "Cannot approve: this Aadhaar number is already registered" });
    }
    for (const field of fields) {
      if (reviews[field]?.status) continue;
      if (action === "approve") {
        let value = get(request.requestedChanges, field);
        if (field === "employmentStatus") { value = normalizeEmployment(value); if (!value) return res.status(422).json({ success: false, message: "Requested employment status is invalid" }); }
        user.set(field, value);
      }
      reviews[field] = { status: action === "approve" ? "approved" : "rejected", reviewedAt: new Date(), reviewedBy: req.admin._id, remarks: String(req.body?.adminRemarks || "").trim() };
    }
    if (action === "approve") await user.save();
    request.fieldReviews = reviews;
    const completed = finaliseIfReviewed(request, changed, req.admin._id);
    await request.save();
    return res.json({ success: true, message: completed ? "All changed fields have been reviewed" : `Field${fields.length > 1 ? "s" : ""} ${action}d`, requestStatus: request.status, fieldReviews: reviews });
  } catch (error) {
    console.error("REVIEW MEMBER UPDATE FIELDS ERROR:", error);
    if (error?.code === 11000) return res.status(409).json({ success: false, message: "Cannot approve: mobile number or Aadhaar number is already registered" });
    return res.status(500).json({ success: false, message: "Unable to review member update fields" });
  }
};

const approveMemberUpdateRequest = (req, res) => reviewFields(req, res, "approve", FIELDS);
const rejectMemberUpdateRequest = (req, res) => reviewFields(req, res, "reject", FIELDS);
const approveMemberUpdateField = (req, res) => reviewFields(req, res, "approve", [req.params.field]);
const rejectMemberUpdateField = (req, res) => reviewFields(req, res, "reject", [req.params.field]);

export { getPendingMemberUpdateRequests, getMemberUpdateRequestById, approveMemberUpdateRequest, rejectMemberUpdateRequest, approveMemberUpdateField, rejectMemberUpdateField };
