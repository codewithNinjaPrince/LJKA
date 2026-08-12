import User from "../models/userModel.js";

const submitKYC = async (req, res) => {
    try {
        // User ID should come from JWT middleware
        const userId = req.userId;

        const {
            referralCode,
            mobile,
            fatherHusbandName,
            aadhaar,
            dob,
            gender,

            address,

            employmentStatus,
            occupation,

            nominee,
        } = req.body;

        // ==========================================
        // BASIC VALIDATION
        // ==========================================

        if (!mobile) {
            return res.status(400).json({
                success: false,
                message: "Mobile number is required",
            });
        }

        if (!/^[6-9]\d{9}$/.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid mobile number",
            });
        }

        if (!fatherHusbandName?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Father/Husband name is required",
            });
        }

        // ==========================================
        // AADHAAR VALIDATION
        // ==========================================

        if (!aadhaar) {
            return res.status(400).json({
                success: false,
                message: "Aadhaar number is required",
            });
        }

        if (!/^\d{12}$/.test(aadhaar)) {
            return res.status(400).json({
                success: false,
                message: "Aadhaar number must be exactly 12 digits",
            });
        }

        // ==========================================
        // DOB
        // ==========================================

        if (!dob) {
            return res.status(400).json({
                success: false,
                message: "Date of birth is required",
            });
        }

        const dobDate = new Date(dob);

        if (Number.isNaN(dobDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date of birth",
            });
        }

        const today = new Date();

        let age = today.getFullYear() - dobDate.getFullYear();

        const monthDiff = today.getMonth() - dobDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dobDate.getDate())
        ) {
            age--;
        }

        if (age < 18) {
            return res.status(400).json({
                success: false,
                message: "You must be at least 18 years old",
            });
        }

        if (age >= 60) {
            return res.status(400).json({
                success: false,
                message: "Age must be below 60 years",
            });
        }

        // ==========================================
        // GENDER
        // ==========================================

        if (!gender) {
            return res.status(400).json({
                success: false,
                message: "Gender is required",
            });
        }

        if (!["male", "female", "other"].includes(gender)) {
            return res.status(400).json({
                success: false,
                message: "Invalid gender",
            });
        }

        // ==========================================
        // ADDRESS
        // ==========================================

        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Address details are required",
            });
        }

        const {
            stateCode,
            stateName,
            districtCode,
            districtName,
            tehsilCode,
            tehsilName,
            townVillage,
            address: addressLine,
            pincode,
        } = address;

        if (
            stateCode === undefined ||
            stateCode === null ||
            !stateName?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "State is required",
            });
        }

        if (
            districtCode === undefined ||
            districtCode === null ||
            !districtName?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "District is required",
            });
        }

        if (
            tehsilCode === undefined ||
            tehsilCode === null ||
            !tehsilName?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Tehsil is required",
            });
        }

        if (!Number.isInteger(Number(stateCode))) {
            return res.status(400).json({
                success: false,
                message: "Invalid state code",
            });
        }

        if (!Number.isInteger(Number(districtCode))) {
            return res.status(400).json({
                success: false,
                message: "Invalid district code",
            });
        }

        if (!Number.isInteger(Number(tehsilCode))) {
            return res.status(400).json({
                success: false,
                message: "Invalid tehsil code",
            });
        }

        if (!townVillage?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Town / Village / City is required",
            });
        }

        if (!addressLine?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Address is required",
            });
        }

        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                success: false,
                message: "Pincode must be exactly 6 digits",
            });
        }

        // ==========================================
        // EMPLOYMENT
        // ==========================================

        if (!employmentStatus) {
            return res.status(400).json({
                success: false,
                message: "Employment status is required",
            });
        }

        const allowedEmployment = [
            "government",
            "private",
            "business",
            "self-employed",
            "student",
        ];

        if (!allowedEmployment.includes(employmentStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employment status",
            });
        }

        if (!occupation?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Occupation is required",
            });
        }

        const finalReferralCode =
            referralCode?.trim() || "AY92";

        // ==========================================
        // NOMINEE
        // ==========================================

        if (!nominee) {
            return res.status(400).json({
                success: false,
                message: "Nominee details are required",
            });
        }

        if (!nominee.name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Nominee name is required",
            });
        }

        if (!nominee.mobile || !/^[6-9]\d{9}$/.test(nominee.mobile)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid nominee mobile number",
            });
        }

        if (!nominee.relationship?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Nominee relationship is required",
            });
        }

        // ==========================================
        // FIND USER
        // ==========================================

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // ==========================================
        // ALREADY COMPLETED
        // ==========================================

        if (user.kycCompleted) {
            return res.status(400).json({
                success: false,
                message: "KYC has already been completed",
            });
        }

        // ==========================================
        // DUPLICATE AADHAAR
        // ==========================================

        const existingAadhaar = await User.findOne({
            aadhaar,
            _id: { $ne: userId },
        });

        if (existingAadhaar) {
            return res.status(409).json({
                success: false,
                message: "This Aadhaar number is already registered",
            });
        }

        // ==========================================
        // UPDATE USER
        // ==========================================
        user.referralCode = finalReferralCode;

        user.mobile = mobile.trim();
        user.fatherHusbandName = fatherHusbandName.trim();
        user.aadhaar = aadhaar.trim();
        user.dob = dobDate;
        user.gender = gender;

        user.address = {
            stateCode: Number(stateCode),
            stateName: stateName.trim(),

            districtCode: Number(districtCode),
            districtName: districtName.trim(),

            tehsilCode: Number(tehsilCode),
            tehsilName: tehsilName.trim(),

            townVillage: townVillage.trim(),

            address: addressLine.trim(),
            pincode: pincode.trim(),
        };

        user.employmentStatus = employmentStatus;
        user.occupation = occupation.trim();

        user.nominee = {
            name: nominee.name.trim(),
            mobile: nominee.mobile,
            email: nominee.email?.trim().toLowerCase() || "",
            relationship: nominee.relationship.trim(),
        };

        // ==========================================
        // MARK KYC COMPLETE
        // ==========================================

        user.kycCompleted = true;

        await user.save();

        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({
            success: true,
            message: "KYC completed successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                kycCompleted: user.kycCompleted,
            },
        });

    } catch (error) {
        console.error("KYC ERROR:", error);

        // Mongo duplicate key
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Aadhaar number is already registered",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export { submitKYC };