import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import validator from "validator";

import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import ReferralCode from "../models/referralCodeModel.js";
import AuditLog from "../models/auditLogModel.js";

import { audit } from "../utils/audit.js";


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
            "delete",
        ],
    },

    {
        key: "referrals",
        label: "Referral Codes",
        actions: [
            "view",
            "create",
            "update",
            "delete",
        ],
    },

    {
        key: "member-update-requests",
        label: "Member Update Requests",
        actions: [
            "view",
            "approve",
            "reject",
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
        key: "sahyog",
        label: "Sahyog Cases",
        actions: [
            "view",
            "create",
            "update",
            "delete",
            "approve",
        ],
    },

    {
        key: "sahyog-donations",
        label: "Sahyog Donations",
        actions: [
            "view",
            "update",
        ],
    },

    {
        key: "contacts",
        label: "Contact Messages",
        actions: [
            "view",
            "delete",
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
    const {
        fullName,
        email,
        mobile,
        password,
    } = req.body;

    if (
        !fullName?.trim() ||
        !validator.isEmail(
            String(email || "")
        ) ||
        !/^[6-9]\d{9}$/.test(
            String(mobile || "")
        ) ||
        !password
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Name, valid email, mobile and password are required",
        });
    }

    if (
        password.length < 6 ||
        !/[A-Za-z]/.test(password) ||
        !/\d/.test(password)
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Password must include a letter and number and be at least 6 characters",
        });
    }

    try {
        const member =
            await User.create({
                fullName:
                    fullName.trim(),

                email:
                    email
                        .toLowerCase()
                        .trim(),

                mobile:
                    String(
                        mobile
                    ).trim(),

                password:
                    await bcrypt.hash(
                        password,
                        12
                    ),

                emailVerified: true,
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
                fullName:
                    member.fullName,
                email:
                    member.email,
            },
        });
    } catch (error) {
        if (
            error.code === 11000
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Email or mobile is already registered",
            });
        }

        throw error;
    }
};


export const updateManagedMember = async (
    req,
    res
) => {
    const allowed = [
        "fullName",
        "mobile",
        "fatherHusbandName",
        "dob",
        "gender",
        "address",
        "employmentStatus",
        "occupation",
        "nominee",
        "membershipPaymentStatus",
        "accountStatus",
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

    const member =
        await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: changes,
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        ).select(
            "-password -aadhaar"
        );

    if (!member) {
        return res.status(404).json({
            success: false,
            message:
                "Member not found",
        });
    }

    await audit(req, {
        action: "update",
        module: "members",
        resourceId: member._id,

        metadata: {
            fields:
                Object.keys(
                    changes
                ),
        },
    });

    res.json({
        success: true,
        member,
    });
};


export const deleteManagedMember = async (
    req,
    res
) => {
    const member =
        await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    accountStatus:
                        "disabled",
                },
            },
            {
                returnDocument: "after",
            }
        );

    if (!member) {
        return res.status(404).json({
            success: false,
            message:
                "Member not found",
        });
    }

    await audit(req, {
        action: "deactivate",
        module: "members",
        resourceId: member._id,
    });

    res.json({
        success: true,
    });
};


/* -------------------------------------------------------------------------- */
/* REFERRAL CODES                                                             */
/* -------------------------------------------------------------------------- */

export const listReferrals = async (
    req,
    res
) => {
    res.json({
        success: true,

        referrals:
            await ReferralCode.find()
                .sort({
                    createdAt: -1,
                })
                .lean(),
    });
};


export const createReferral = async (
    req,
    res
) => {
    const code = String(
        req.body.code ||
            crypto
                .randomBytes(4)
                .toString("hex")
    ).toUpperCase();

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

    try {
        const referral =
            await ReferralCode.create({
                code,

                label: String(
                    req.body.label ||
                        ""
                ).trim(),

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
                message:
                    "Referral code already exists",
            });
        }

        throw error;
    }
};


export const updateReferral = async (
    req,
    res
) => {
    const referral =
        await ReferralCode.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    label:
                        req.body.label,
                    isActive:
                        req.body.isActive,
                },
            },
            {
                returnDocument: "after",
            }
        );

    if (!referral) {
        return res.status(404).json({
            success: false,
            message:
                "Referral code not found",
        });
    }

    await audit(req, {
        action: "update",
        module: "referrals",
        resourceId:
            referral._id,
    });

    res.json({
        success: true,
        referral,
    });
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
