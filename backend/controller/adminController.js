import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

import Admin from "../models/adminModel.js";
import User, { createPublicSearchTerms } from "../models/userModel.js";
import ReferralCode from "../models/referralCodeModel.js";
import AuditLog from "../models/auditLogModel.js";
import Contact from "../models/contactModel.js";
import SahyogAlert from "../models/sahyogAlert.js";
import Claim from "../models/claimModel.js";

import { audit } from "../utils/audit.js";
import generateMemberId from "../utils/generateMemberId.js";
import { validateMemberDetails } from "../utils/memberDetails.js";
import { ensureLegacyReferralCodes, referralCodeMatch } from "../utils/legacyReferrals.js";


/* -------------------------------------------------------------------------- */
/* MODULES                                                                    */
/* -------------------------------------------------------------------------- */

export const MODULES = [
    {
        key: "members",
        label: "Members",
        actions: [
            "view",
            "create",
            "update",
        ],
    },

    {
        key: "sahyog-alerts",
        label: "Sahyog Alerts",
        actions: [
            "view",
            "create",
            "update",
            "delete",
        ],
    },

    {
        key: "contacts",
        label: "Contact Messages",
        actions: [
            "view",
            "update",
        ],
    },
];


/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const safeAdmin = (admin) => {
    const value = admin.toObject
        ? admin.toObject()
        : admin;

    delete value.password;
    // Legacy records may still contain a KYC object. It is not part of an
    // administrative account and must never be exposed by admin APIs.
    delete value.kyc;

    return value;
};


const createToken = (admin) => {
    return jwt.sign(
        {
            id: admin._id,
            type: "admin",
            version: admin.authVersion,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "8h",
        }
    );
};


const normalizedPermissions = (
    permissions = []
) => {
    return MODULES.map(
        ({
            key,
            actions,
        }) => {
            const requested =
                permissions.find(
                    (item) =>
                        item.module === key
                )?.actions || [];

            const valid = [
                ...new Set(
                    requested.filter(
                        (action) =>
                            actions.includes(action)
                    )
                ),
            ];

            return {
                module: key,
                actions:
                    valid.some(
                        (action) =>
                            action !== "view"
                    ) &&
                    !valid.includes("view")
                        ? [
                              ...valid,
                              "view",
                          ]
                        : valid,
            };
        }
    );
};


/* -------------------------------------------------------------------------- */
/* ADMIN AUTHENTICATION                                                       */
/* -------------------------------------------------------------------------- */

export const loginAdmin = async (
    req,
    res
) => {
    try {
        const username = String(
            req.body.username || ""
        )
            .trim()
            .toLowerCase();

        const {
            password,
        } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Username and password are required",
            });
        }

        const admin =
            await Admin.findOne({
                username,
            }).select("+password");

        if (
            !admin ||
            !(await bcrypt.compare(
                password,
                admin.password
            ))
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid username or password",
            });
        }

        if (admin.status !== "active") {
            return res.status(403).json({
                success: false,
                message:
                    "This administrative account is not active",
            });
        }

        admin.lastLoginAt = new Date();

        await admin.save();

        req.admin = admin;

        await audit(req, {
            action: "login",
            module: "authentication",
            resourceId: admin._id,
        });

        return res.json({
            success: true,
            token: createToken(admin),
            admin: safeAdmin(admin),
        });
    } catch (error) {
        console.error(
            "ADMIN LOGIN ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to login",
        });
    }
};


/* -------------------------------------------------------------------------- */
/* CURRENT ADMIN                                                               */
/* -------------------------------------------------------------------------- */

export const getAdminMe = (
    req,
    res
) => {
    res.json({
        success: true,
        admin: safeAdmin(req.admin),
        modules: MODULES,
    });
};


/* -------------------------------------------------------------------------- */
/* DASHBOARD                                                                   */
/* -------------------------------------------------------------------------- */

export const dashboard = async (
    req,
    res
) => {
    if (
        req.admin.role !==
        "superadmin"
    ) {
        const allowed =
            new Set(
                req.admin.permissions.flatMap(
                    (permission) =>
                        permission.actions.includes(
                            "view"
                        )
                            ? [permission.module]
                            : []
                )
            );

        const [
            totalMembers,
            referrals,
        ] = await Promise.all([
            allowed.has("members")
                ? User.countDocuments()
                : 0,

            allowed.has("referrals")
                ? ReferralCode.countDocuments()
                : 0,
        ]);

        return res.json({
            success: true,
            stats: {
                totalMembers,
                referrals,
            },
            recentActivity: [],
        });
    }

    const [
        totalAdmins,
        activeAdmins,
        disabledAdmins,
        totalMembers,
        completedMembers,
        referrals,
        openClaims,
        recentActivity,
    ] = await Promise.all([
        Admin.countDocuments({
            role: "admin",
        }),

        Admin.countDocuments({
            role: "admin",
            status: "active",
        }),

        Admin.countDocuments({
            role: "admin",
            status: "disabled",
        }),

        User.countDocuments(),

        User.countDocuments({
            kycCompleted: true,
        }),

        ReferralCode.countDocuments(),

        Claim.countDocuments(),

        AuditLog.find()
            .sort({
                createdAt: -1,
            })
            .limit(8)
            .lean(),
    ]);

    res.json({
        success: true,

        stats: {
            totalAdmins,
            activeAdmins,
            disabledAdmins,
            totalMembers,
            completedMembers,
            referrals,
            openClaims,
        },

        recentActivity,
    });
};


/* -------------------------------------------------------------------------- */
/* ADMIN MANAGEMENT                                                           */
/* -------------------------------------------------------------------------- */

export const listAdmins = async (
    req,
    res
) => {
    const query = String(
        req.query.search || ""
    ).trim();

    const filter = {
        role: "admin",

        ...(query
            ? {
                  $or: [
                      "fullName",
                      "email",
                      "username",
                      "mobile",
                  ].map(
                      (field) => ({
                          [field]:
                              new RegExp(
                                  query,
                                  "i"
                              ),
                      })
                  ),
              }
            : {}),
    };

    const admins =
        await Admin.find(filter)
            .sort({
                createdAt: -1,
            });

    res.json({
        success: true,
        admins: admins.map(
            safeAdmin
        ),
    });
};


/* -------------------------------------------------------------------------- */
/* CREATE ADMIN                                                               */
/* -------------------------------------------------------------------------- */

export const createAdmin = async (
    req,
    res
) => {
    try {
        const {
            fullName,
            email,
            mobile,
            username,
            password,
        } = req.body;

        if (
            !fullName?.trim() ||
            !validator.isEmail(
                String(email || "")
            ) ||
            !username?.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, valid email, username and password are required",
            });
        }

        if (
            String(password).length < 8 ||
            !/[A-Za-z]/.test(
                password
            ) ||
            !/\d/.test(password)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters and include a letter and number",
            });
        }

        const admin =
            await Admin.create({
                fullName:
                    fullName.trim(),

                email:
                    email
                        .toLowerCase()
                        .trim(),

                mobile:
                    String(
                        mobile || ""
                    ).trim() ||
                    undefined,

                username:
                    username
                        .toLowerCase()
                        .trim(),

                password:
                    await bcrypt.hash(
                        password,
                        12
                    ),

                /*
                 * New admins are active immediately.
                 */
                status: "active",
            });

        await audit(req, {
            action: "create",
            module: "admins",
            resourceId: admin._id,

            metadata: {
                name: admin.fullName,
            },
        });

        res.status(201).json({
            success: true,
            admin: safeAdmin(admin),
        });
    } catch (error) {
        if (
            error.code === 11000
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Email, mobile or username already exists",
            });
        }

        console.error(
            "CREATE ADMIN ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to create admin",
        });
    }
};


/* -------------------------------------------------------------------------- */
/* UPDATE ADMIN                                                               */
/* -------------------------------------------------------------------------- */

export const updateAdmin = async (
    req,
    res
) => {
    const allowed = [
        "fullName",
        "email",
        "mobile",
        "username",
    ];

    const changes =
        Object.fromEntries(
            allowed
                .filter(
                    (key) =>
                        req.body[key] !==
                        undefined
                )
                .map(
                    (key) => [
                        key,
                        req.body[key],
                    ]
                )
        );

    if (
        changes.email &&
        !validator.isEmail(
            changes.email
        )
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid email",
        });
    }

    if (changes.email) {
        changes.email =
            changes.email
                .toLowerCase()
                .trim();
    }

    if (changes.username) {
        changes.username =
            changes.username
                .toLowerCase()
                .trim();
    }

    const admin =
        await Admin.findOneAndUpdate(
            {
                _id: req.params.id,
                role: "admin",
            },
            {
                $set: changes,
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

    if (!admin) {
        return res.status(404).json({
            success: false,
            message: "Admin not found",
        });
    }

    await audit(req, {
        action: "update",
        module: "admins",
        resourceId: admin._id,

        metadata: {
            fields:
                Object.keys(
                    changes
                ),
        },
    });

    res.json({
        success: true,
        admin: safeAdmin(admin),
    });
};


/* -------------------------------------------------------------------------- */
/* ADMIN STATUS                                                               */
/* -------------------------------------------------------------------------- */

export const setAdminStatus = async (
    req,
    res
) => {
    const {
        status,
    } = req.body;

    if (
        ![
            "active",
            "disabled",
        ].includes(status)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid status",
        });
    }

    const update = {
        $set: {
            status,
        },
    };

    /*
     * Changing status invalidates
     * existing authentication tokens.
     */
    if (status === "disabled") {
        update.$inc = {
            authVersion: 1,
        };
    }

    const admin =
        await Admin.findOneAndUpdate(
            {
                _id: req.params.id,
                role: "admin",
            },
            update,
            {
                returnDocument: "after",
            }
        );

    if (!admin) {
        return res.status(404).json({
            success: false,
            message: "Admin not found",
        });
    }

    await audit(req, {
        action: `status_${status}`,
        module: "admins",
        resourceId: admin._id,
    });

    res.json({
        success: true,
        admin: safeAdmin(admin),
    });
};


/* -------------------------------------------------------------------------- */
/* RESET ADMIN PASSWORD                                                       */
/* -------------------------------------------------------------------------- */

export const resetAdminPassword = async (
    req,
    res
) => {
    const {
        password,
    } = req.body;

    if (
        !password ||
        password.length < 8 ||
        !/[A-Za-z]/.test(password) ||
        !/\d/.test(password)
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Password must be at least 8 characters and include a letter and number",
        });
    }

    const admin =
        await Admin.findOne({
            _id: req.params.id,
            role: "admin",
        }).select("+password");

    if (!admin) {
        return res.status(404).json({
            success: false,
            message: "Admin not found",
        });
    }

    admin.password =
        await bcrypt.hash(
            password,
            12
        );

    admin.authVersion += 1;

    await admin.save();

    await audit(req, {
        action: "reset_password",
        module: "admins",
        resourceId: admin._id,
    });

    res.json({
        success: true,
        message:
            "Password reset and active sessions invalidated",
    });
};


/* -------------------------------------------------------------------------- */
/* ADMIN RIGHTS                                                               */
/* -------------------------------------------------------------------------- */

export const getRights = async (
    req,
    res
) => {
    const admin =
        await Admin.findOne({
            _id: req.params.id,
            role: "admin",
        });

    if (!admin) {
        return res.status(404).json({
            success: false,
            message: "Admin not found",
        });
    }

    res.json({
        success: true,
        admin: safeAdmin(admin),
        modules: MODULES,
    });
};


export const updateRights = async (
    req,
    res
) => {
    const admin =
        await Admin.findOneAndUpdate(
            {
                _id: req.params.id,
                role: "admin",
            },
            {
                $set: {
                    permissions:
                        normalizedPermissions(
                            req.body.permissions
                        ),
                },

                $inc: {
                    authVersion: 1,
                },
            },
            {
                returnDocument: "after",
            }
        );

    if (!admin) {
        return res.status(404).json({
            success: false,
            message: "Admin not found",
        });
    }

    await audit(req, {
        action:
            "permissions_updated",
        module: "admins",
        resourceId: admin._id,
    });

    res.json({
        success: true,
        admin: safeAdmin(admin),
    });
};


/* -------------------------------------------------------------------------- */
/* ACTIVITY LOGS                                                              */
/* -------------------------------------------------------------------------- */

export const listActivity = async (
    req,
    res
) => {
    const limit = Math.min(
        Number(
            req.query.limit
        ) || 100,
        200
    );

    res.json({
        success: true,

        logs:
            await AuditLog.find()
                .sort({
                    createdAt: -1,
                })
                .limit(limit)
                .lean(),
    });
};


/* -------------------------------------------------------------------------- */
/* MANAGED MEMBERS                                                            */
/* -------------------------------------------------------------------------- */

export const listManagedMembers = async (
    req,
    res
) => {
    const search = String(
        req.query.search || ""
    ).trim();

    const filter = search
        ? {
              $or: [
                  "fullName",
                  "email",
                  "memberId",
                  "mobile",
              ].map(
                  (field) => ({
                      [field]:
                          new RegExp(
                              search,
                              "i"
                          ),
                  })
              ),
          }
        : {};

    res.json({
        success: true,

        members:
            await User.find(
                filter
            )
                .select(
                    "-password -aadhaar"
                )
                .sort({
                    createdAt: -1,
                })
                .limit(200)
                .lean(),
    });
};


export const createManagedMember = async (
    req,
    res
) => {
    const { error, data } = await validateMemberDetails(req.body, {
        requirePassword: true,
        requireAadhaar: true,
        requireReferral: true,
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error,
        });
    }

    try {
        const now = new Date();
        const memberId = await generateMemberId({
            address: data.address,
            employmentStatus: data.employmentStatus,
        });

        const member = await User.create({
            fullName: data.fullName,
            email: data.email,
            mobile: data.mobile,
            password: await bcrypt.hash(data.password, 12),
            emailVerified: true,
            mobileVerified: true,
            fatherHusbandName: data.fatherHusbandName,
            aadhaar: data.aadhaar,
            dob: data.dob,
            gender: data.gender,
            address: data.address,
            employmentStatus: data.employmentStatus,
            occupation: data.occupation,
            nominee: data.nominee,
            referralCode: data.referralCode,
            kycCompleted: true,
            kycCompletedAt: now,
            membershipStartDate: now,
            membershipExpiresAt: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
            kycConsentAcceptedAt: now,
            memberId,
            accountStatus: data.accountStatus,
            publicSearchTerms: createPublicSearchTerms({
                fullName: data.fullName,
                memberId,
                mobile: data.mobile,
            }),
        });

        await audit(req, {
            action: "create",
            module: "members",
            resourceId: member._id,
        });

        res.status(201).json({
            success: true,
            member: {
                id: member._id,
                fullName: member.fullName,
                email: member.email,
                memberId: member.memberId,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0];
            const messages = {
                email: "Email is already registered",
                mobile: "Mobile is already registered",
                aadhaar: "Aadhaar number is already registered",
                memberId: "Member ID could not be allocated. Please try again",
            };
            return res.status(409).json({
                success: false,
                message: messages[field] || "Email, mobile or Aadhaar is already registered",
            });
        }

        throw error;
    }
};


export const updateManagedMember = async (
    req,
    res
) => {
    const existing = await User.findById(req.params.id);
    if (!existing) {
        return res.status(404).json({ success: false, message: "Member not found" });
    }

    const { error, data } = await validateMemberDetails(
        {
            ...req.body,
            email: existing.email,
            referralCode: req.body.referralCode || existing.referralCode || "",
        },
        {
            requirePassword: false,
            requireAadhaar: !existing.aadhaar,
            requireReferral: Boolean(req.body.referralCode),
        }
    );

    if (error) {
        return res.status(400).json({ success: false, message: error });
    }

    const changes = {
        fullName: data.fullName,
        mobile: data.mobile,
        fatherHusbandName: data.fatherHusbandName,
        dob: data.dob,
        gender: data.gender,
        address: data.address,
        employmentStatus: data.employmentStatus,
        occupation: data.occupation,
        nominee: data.nominee,
        accountStatus: data.accountStatus,
    };

    if (req.body.aadhaar && /^\d{12}$/.test(String(req.body.aadhaar))) {
        changes.aadhaar = String(req.body.aadhaar).trim();
    }

    if (data.referralCode) changes.referralCode = data.referralCode;

    if (!existing.kycCompleted) {
        const now = new Date();
        changes.kycCompleted = true;
        changes.kycCompletedAt = now;
        changes.membershipStartDate = existing.membershipStartDate || now;
        changes.membershipExpiresAt = existing.membershipExpiresAt || new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
        changes.kycConsentAcceptedAt = existing.kycConsentAcceptedAt || now;
        if (!existing.memberId) {
            changes.memberId = await generateMemberId({
                address: data.address,
                employmentStatus: data.employmentStatus,
            });
        }
    }

    changes.publicSearchTerms = createPublicSearchTerms({
        fullName: data.fullName,
        memberId: changes.memberId || existing.memberId,
        mobile: data.mobile,
    });

    try {
        const member = await User.findByIdAndUpdate(
            req.params.id,
            { $set: changes },
            { returnDocument: "after", runValidators: true }
        ).select("-password -aadhaar");

        await audit(req, {
            action: "update",
            module: "members",
            resourceId: member._id,
            metadata: { fields: Object.keys(changes) },
        });

        res.json({ success: true, member });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Mobile or Aadhaar is already registered",
            });
        }
        throw error;
    }
};


/* -------------------------------------------------------------------------- */
/* REFERRAL CODES                                                             */
/* -------------------------------------------------------------------------- */

export const listReferrals = async (
    req,
    res
) => {
    await ensureLegacyReferralCodes();
    const search = String(req.query.search || "").trim();
    const filter = {};

    if (search) {
        const expression = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        filter.$or = [
            { code: expression },
            { label: expression },
            { email: expression },
            { phone: expression },
        ];
    }

    const referrals = await ReferralCode.find(filter).sort({ createdAt: -1 }).lean();
    const counts = await User.aggregate([
        { $addFields: { codeUpper: { $toUpper: { $ifNull: ["$referralCode", ""] } } } },
        { $match: { codeUpper: { $in: referrals.map((item) => item.code) } } },
        { $group: { _id: "$codeUpper", count: { $sum: 1 } } },
    ]);
    const countByCode = new Map(counts.map((item) => [item._id, item.count]));

    res.json({
        success: true,
        referrals: referrals.map((referral) => ({
            ...referral,
            userCount: countByCode.get(referral.code) || 0,
        })),
    });
};

export const listReferralUsers = async (req, res) => {
    await ensureLegacyReferralCodes();
    const idOrCode = String(req.params.id || "").trim();
    let referral = null;
    if (/^[a-fA-F0-9]{24}$/.test(idOrCode)) {
        referral = await ReferralCode.findById(idOrCode).lean();
    }
    if (!referral) {
        referral = await ReferralCode.findOne({ code: idOrCode.toUpperCase() }).lean();
    }
    if (!referral) {
        return res.status(404).json({ success: false, message: "Referral code not found" });
    }

    const search = String(req.query.search || "").trim();
    const userFilter = { referralCode: referralCodeMatch(referral.code) };
    if (search) {
        const expression = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        userFilter.$or = [
            { fullName: expression },
            { email: expression },
            { memberId: expression },
            { mobile: expression },
        ];
    }

    const users = await User.find(userFilter)
        .select("fullName email memberId mobile kycCompleted createdAt accountStatus")
        .sort({ createdAt: -1 })
        .limit(500)
        .lean();

    res.json({
        success: true,
        referral,
        userCount: users.length,
        users,
    });
};


export const createReferral = async (
    req,
    res
) => {
    const code = String(req.body.code || "").trim().toUpperCase();
    const email = String(req.body.email || "").trim().toLowerCase();
    const phone = String(req.body.phone || "").trim();

    if (
        !/^[A-Z0-9]{4,32}$/.test(
            code
        )
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Code must be 4–32 letters or digits",
        });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "A valid referral contact email is required",
        });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).json({
            success: false,
            message: "A valid 10-digit referral contact phone is required",
        });
    }

    try {
        const referral =
            await ReferralCode.create({
                code,

                label: String(
                    req.body.label ||
                        ""
                ).trim(),

                email,
                phone,

                createdBy:
                    req.admin._id,
            });

        await audit(req, {
            action: "create",
            module: "referrals",
            resourceId:
                referral._id,

            metadata: {
                code,
            },
        });

        res.status(201).json({
            success: true,
            referral,
        });
    } catch (error) {
        if (
            error.code === 11000
        ) {
            return res.status(409).json({
                success: false,
                message: "Referral code, email or phone already exists",
            });
        }

        throw error;
    }
};


export const updateReferral = async (
    req,
    res
) => {
    const changes = {};

    if (req.body.code !== undefined) {
        const code = String(req.body.code || "").trim().toUpperCase();
        if (!/^[A-Z0-9]{4,32}$/.test(code)) {
            return res.status(400).json({ success: false, message: "Code must be 4–32 letters or digits" });
        }
        changes.code = code;
    }

    if (req.body.email !== undefined) {
        const email = String(req.body.email || "").trim().toLowerCase();
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "A valid referral contact email is required" });
        }
        changes.email = email;
    }

    if (req.body.phone !== undefined) {
        const phone = String(req.body.phone || "").trim();
        if (!/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({ success: false, message: "A valid 10-digit referral contact phone is required" });
        }
        changes.phone = phone;
    }

    if (req.body.label !== undefined) changes.label = String(req.body.label || "").trim();
    if (typeof req.body.isActive === "boolean") changes.isActive = req.body.isActive;

    try {
        const referral = await ReferralCode.findByIdAndUpdate(
            req.params.id,
            { $set: changes },
            { returnDocument: "after", runValidators: true }
        );

        if (!referral) {
            return res.status(404).json({ success: false, message: "Referral code not found" });
        }

        await audit(req, {
            action: "update",
            module: "referrals",
            resourceId: referral._id,
            metadata: { fields: Object.keys(changes) },
        });

        res.json({ success: true, referral });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "Referral code, email or phone already exists" });
        }
        throw error;
    }
};


export const deleteReferral = async (
    req,
    res
) => {
    const referral =
        await ReferralCode.findByIdAndDelete(
            req.params.id
        );

    if (!referral) {
        return res.status(404).json({
            success: false,
            message:
                "Referral code not found",
        });
    }

    await audit(req, {
        action: "delete",
        module: "referrals",
        resourceId:
            referral._id,
    });

    res.json({
        success: true,
    });
};


/* -------------------------------------------------------------------------- */
/* CONTACT MESSAGES                                                            */
/* -------------------------------------------------------------------------- */

export const listContacts = async (req, res) => {
    try {
        const search = String(req.query.search || "").trim();
        const status = String(req.query.status || "").trim();
        const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 200);
        const filter = {
            ...(status ? { status } : {}),
        };

        if (search) {
            const expression = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            filter.$or = ["name", "email", "phone", "subject", "message"].map((field) => ({ [field]: expression }));
        }

        const contacts = await Contact.find(filter)
            .populate("assignedTo", "fullName email username")
            .sort({ createdAt: -1, _id: -1 })
            .limit(limit)
            .lean();

        res.json({ success: true, contacts });
    } catch (error) {
        console.error("LIST CONTACTS ERROR:", error);
        res.status(500).json({ success: false, message: "Unable to load contact messages" });
    }
};

export const listContactAssignees = async (req, res) => {
    const admins = await Admin.find({ role: "admin", status: "active" })
        .select("fullName email username")
        .sort({ fullName: 1 })
        .lean();

    res.json({ success: true, admins });
};

export const getContact = async (req, res) => {
    const contact = await Contact.findOne({
        _id: req.params.id,
    })
        .populate("assignedTo", "fullName email username")
        .lean();

    if (!contact) {
        return res.status(404).json({ success: false, message: "Contact message not found" });
    }

    res.json({ success: true, contact });
};

export const updateContact = async (req, res) => {
    const changes = {};
    const isSuperadmin = req.admin.role === "superadmin";

    if (req.body.status !== undefined) {
        if (!["new", "read", "in_progress", "resolved"].includes(req.body.status)) {
            return res.status(400).json({ success: false, message: "Invalid contact status" });
        }
        changes.status = req.body.status;
    }

    if (isSuperadmin && req.body.assignedTo !== undefined) {
        if (req.body.assignedTo === "" || req.body.assignedTo === null) {
            changes.assignedTo = null;
            changes.assignedAt = null;
        } else {
            const assignee = await Admin.findOne({
                _id: req.body.assignedTo,
                role: "admin",
                status: "active",
            }).select("_id");

            if (!assignee) {
                return res.status(400).json({ success: false, message: "Choose an active administrator" });
            }

            changes.assignedTo = assignee._id;
            changes.assignedAt = new Date();
        }
    }

    if (!Object.keys(changes).length) {
        return res.status(400).json({ success: false, message: "No valid contact changes were supplied" });
    }

    const contact = await Contact.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        { $set: changes },
        { returnDocument: "after", runValidators: true }
    ).populate("assignedTo", "fullName email username");

    if (!contact) {
        return res.status(404).json({ success: false, message: "Contact message not found" });
    }

    await audit(req, {
        action: "contact_updated",
        module: "contacts",
        resourceId: contact._id,
        metadata: { fields: Object.keys(changes) },
    });

    res.json({ success: true, contact });
};

export const deleteContact = async (req, res) => {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
        return res.status(404).json({ success: false, message: "Contact message not found" });
    }

    await audit(req, {
        action: "contact_deleted",
        module: "contacts",
        resourceId: contact._id,
    });

    res.json({ success: true });
};


/* -------------------------------------------------------------------------- */
/* SAHYOG ALERTS                                                               */
/* -------------------------------------------------------------------------- */

const alertPayload = (body, { partial = false } = {}) => {
    const changes = {};

    if (!partial || body.title !== undefined) {
        const title = String(body.title || "").trim();
        if (!title) return { error: "Alert title is required" };
        changes.title = title;
    }

    if (!partial || body.message !== undefined) {
        const message = String(body.message || "").trim();
        if (!message) return { error: "Alert message is required" };
        changes.message = message;
    }

    if (typeof body.isActive === "boolean") changes.isActive = body.isActive;
    return { changes };
};

export const listSahyogAlerts = async (req, res) => {
    const alerts = await SahyogAlert.find()
        .sort({ updatedAt: -1, _id: -1 })
        .limit(200)
        .lean();

    res.json({ success: true, alerts });
};

export const createSahyogAlert = async (req, res) => {
    const { changes, error } = alertPayload(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    const alert = await SahyogAlert.create(changes);
    await audit(req, { action: "sahyog_alert_created", module: "sahyog-alerts", resourceId: alert._id });
    res.status(201).json({ success: true, alert });
};

export const updateSahyogAlert = async (req, res) => {
    const { changes, error } = alertPayload(req.body, { partial: true });
    if (error) return res.status(400).json({ success: false, message: error });
    if (!Object.keys(changes).length) return res.status(400).json({ success: false, message: "No alert changes were supplied" });

    const alert = await SahyogAlert.findByIdAndUpdate(
        req.params.id,
        { $set: changes },
        { returnDocument: "after", runValidators: true }
    );

    if (!alert) return res.status(404).json({ success: false, message: "Sahyog alert not found" });

    await audit(req, {
        action: "sahyog_alert_updated",
        module: "sahyog-alerts",
        resourceId: alert._id,
        metadata: { fields: Object.keys(changes) },
    });
    res.json({ success: true, alert });
};

export const deleteSahyogAlert = async (req, res) => {
    const alert = await SahyogAlert.findByIdAndDelete(req.params.id);
    if (!alert) return res.status(404).json({ success: false, message: "Sahyog alert not found" });

    await audit(req, { action: "sahyog_alert_deleted", module: "sahyog-alerts", resourceId: alert._id });
    res.json({ success: true });
};
