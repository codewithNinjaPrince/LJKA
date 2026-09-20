import "dotenv/config";
import bcrypt from "bcrypt";
import connectDB from "../config/mongodb.js";
import Admin from "../models/adminModel.js";

const { SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, SUPER_ADMIN_USERNAME, SUPER_ADMIN_PASSWORD } = process.env;
if (!SUPER_ADMIN_NAME || !SUPER_ADMIN_EMAIL || !SUPER_ADMIN_USERNAME || !SUPER_ADMIN_PASSWORD) throw new Error("Set SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, SUPER_ADMIN_USERNAME and SUPER_ADMIN_PASSWORD in your environment.");
if (SUPER_ADMIN_PASSWORD.length < 8) throw new Error("SUPER_ADMIN_PASSWORD must be at least 8 characters.");
await connectDB();
const existing = await Admin.findOne({ $or: [{ email: SUPER_ADMIN_EMAIL.toLowerCase() }, { username: SUPER_ADMIN_USERNAME.toLowerCase() }] });
if (existing) throw new Error("A super admin with that email or username already exists.");
await Admin.create({ fullName: SUPER_ADMIN_NAME, email: SUPER_ADMIN_EMAIL.toLowerCase(), username: SUPER_ADMIN_USERNAME.toLowerCase(), password: await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12), role: "superadmin", status: "active", kyc: { status: "verified" } });
console.log("Super admin created successfully.");
process.exit(0);
