import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { LJKAContext } from "../../context/LJKAContext";


const ViewProfile = () => {

  const {
    user,
    getUserProfile,
  } = useContext(LJKAContext);


  const [loading, setLoading] = useState(!user);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {

    const loadProfile = async () => {

      if (user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const result = await getUserProfile();

        if (result?.message) {
          setErrorMessage(result.message);
        }
      } catch (error) {
        console.error("ViewProfile loadProfile error:", error);
        setErrorMessage("Unable to fetch profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

  }, [user, getUserProfile]);

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">

        <div
          className="
            w-10
            h-10
            border-4
            border-gray-300
            border-t-gray-800
            rounded-full
            animate-spin
          "
        />

      </div>
    );
  }


  /* ==========================================
     USER NOT FOUND
  ========================================== */

  if (!user) {
    return (
      <div className="text-center py-10">

        <h2 className="text-xl font-semibold text-gray-800">
          Unable to load profile
        </h2>

        <p className="text-gray-500 mt-2">
          {errorMessage || "Please try again."}
        </p>

      </div>
    );
  }


  /* ==========================================
     PROFILE
  ========================================== */

  return (
    <div className="max-w-7xl mx-auto">

      {/* PAGE HEADER */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          mb-6
        "
      >

        <div>

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-gray-800
            "
          >
            My Profile
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View your registered details
          </p>

        </div>


        <button
          type="button"
          className="
            bg-gray-900
            hover:bg-gray-800
            text-white
            px-5
            py-2.5
            rounded-lg
            font-medium
            transition
            w-full
            sm:w-auto
          "
        >
          Update Details
        </button>

      </div>


      {/* ==========================================
          BASIC DETAILS
      ========================================== */}

      <ProfileSection title="Basic Details">

        <Detail
          label="Full Name"
          value={user.fullName}
        />

        <Detail
          label="Email"
          value={user.email}
        />

        <Detail
          label="Mobile"
          value={user.mobile}
        />

        <Detail
          label="Father / Husband Name"
          value={user.fatherHusbandName}
        />

        <Detail
          label="Date of Birth"
          value={formatDate(user.dob)}
        />

        <Detail
          label="Gender"
          value={formatGender(user.gender)}
        />

        <Detail
          label="Employment Status"
          value={formatEmployment(user.employmentStatus)}
        />

        <Detail
          label="Occupation"
          value={user.occupation}
        />

      </ProfileSection>


      {/* ==========================================
          ADDRESS DETAILS
      ========================================== */}

      <ProfileSection title="Address Details">

        <Detail
          label="State"
          value={user.address?.stateName}
        />

        <Detail
          label="District"
          value={user.address?.districtName}
        />

        <Detail
          label="Tehsil / Sub District"
          value={user.address?.tehsilName}
        />

        <Detail
          label="Town / Village"
          value={user.address?.townVillage}
        />

        <Detail
          label="Address Line"
          value={user.address?.address}
        />

        <Detail
          label="PIN Code"
          value={user.address?.pincode}
        />

      </ProfileSection>


      {/* ==========================================
          NOMINEE DETAILS
      ========================================== */}

      <ProfileSection title="Nominee Details">

        <Detail
          label="Nominee Name"
          value={user.nominee?.name}
        />

        <Detail
          label="Relationship"
          value={user.nominee?.relationship}
        />

        <Detail
          label="Mobile"
          value={user.nominee?.mobile}
        />

        <Detail
          label="Email"
          value={user.nominee?.email}
        />

      </ProfileSection>


      {/* ==========================================
          KYC / ACCOUNT DETAILS
      ========================================== */}

      <ProfileSection title="KYC & Account Details">

        <Detail
          label="Aadhaar"
          value={maskAadhaar(user.aadhaar)}
        />

        <Detail
          label="Referral Code"
          value={user.referralCode}
        />

        <Detail
          label="Email Verified"
          value={
            user.emailVerified
              ? "Verified"
              : "Not Verified"
          }
        />

        <Detail
          label="Mobile Verified"
          value={
            user.mobileVerified
              ? "Verified"
              : "Not Verified"
          }
        />

        <Detail
          label="KYC Status"
          value={
            user.kycCompleted
              ? "Completed"
              : "Pending"
          }
        />

        <Detail
          label="Registered On"
          value={formatDate(user.createdAt)}
        />

      </ProfileSection>

    </div>
  );
};


/* =========================================================
   SECTION
========================================================= */

const ProfileSection = ({
  title,
  children,
}) => {

  return (
    <section
      className="
        bg-white
        border
        border-gray-200
        rounded-xl
        shadow-sm
        mb-6
        overflow-hidden
      "
    >

      <div
        className="
          px-5
          sm:px-7
          py-4
          border-b
          border-gray-200
        "
      >

        <h2
          className="
            text-lg
            sm:text-xl
            font-semibold
            text-gray-800
          "
        >
          {title}
        </h2>

      </div>


      <div
        className="
          p-5
          sm:p-7
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-x-8
          gap-y-6
        "
      >
        {children}
      </div>

    </section>
  );
};


/* =========================================================
   DETAIL
========================================================= */

const Detail = ({
  label,
  value,
}) => {

  return (
    <div>

      <p
        className="
          text-xs
          font-medium
          text-gray-500
          mb-1
        "
      >
        {label}
      </p>

      <p
        className="
          text-sm
          font-medium
          text-gray-800
          break-words
        "
      >
        {value || "Not provided"}
      </p>

    </div>
  );
};


/* =========================================================
   HELPERS
========================================================= */

const formatDate = (date) => {

  if (!date) return "Not provided";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not provided";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};


const formatGender = (gender) => {

  if (!gender) return "Not provided";

  return (
    gender.charAt(0).toUpperCase() +
    gender.slice(1)
  );
};


const formatEmployment = (status) => {

  if (!status) return "Not provided";

  return status
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};


const maskAadhaar = (aadhaar) => {

  if (!aadhaar) return "Not provided";

  const value = String(aadhaar);

  if (value.length < 4) {
    return "XXXX";
  }

  return `XXXX XXXX ${value.slice(-4)}`;
};


export default ViewProfile;