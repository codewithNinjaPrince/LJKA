import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaCalendarAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { LJKAContext } from "../../context/LJKAContext";

const getMembershipExpiry = (profile) => {
  // Membership is not active until payment is completed.
  if (profile?.membershipPaymentStatus !== "paid") {
    return null;
  }

  if (profile?.membershipExpiresAt) {
    return profile.membershipExpiresAt;
  }

  return null;
};


const ViewProfile = () => {

  const {
    user,
    getUserProfile,
  } = useContext(LJKAContext);
  const navigate = useNavigate();


  const [loading, setLoading] = useState(!user);
  const [errorMessage, setErrorMessage] = useState("");
  const [remainingDays, setRemainingDays] = useState(0);
  const profileRequestStarted = useRef(false);


  useEffect(() => {
    if (profileRequestStarted.current) return;

    profileRequestStarted.current = true;

    const loadProfile = async () => {

      if (getMembershipExpiry(user)) {
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

  }, [getUserProfile]);

  useEffect(() => {
    const membershipExpiry = getMembershipExpiry(user);
    if (!membershipExpiry) return;

    const updateRemainingDays = () => {
      const millisecondsRemaining =
        new Date(membershipExpiry).getTime() - Date.now();
      setRemainingDays(Math.max(Math.ceil(millisecondsRemaining / 86400000), 0));
    };

    updateRemainingDays();
    const timer = setInterval(updateRemainingDays, 60000);

    return () => clearInterval(timer);
  }, [user?.membershipExpiresAt, user?.kycCompletedAt, user?.membershipStartDate]);

  const membershipExpiry = getMembershipExpiry(user);
  const profileRemainingDays = membershipExpiry
    ? Math.max(
      Math.ceil(
        (new Date(membershipExpiry).getTime() - Date.now()) /
        86400000
      ),
      0
    )
    : null;

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
    <div className="mx-auto max-w-7xl">

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
              text-[var(--ljka-primary)]
            "
          >
            My Profile
          </h1>

          <p className="mt-1 text-sm text-[var(--ljka-muted)]">
            Your verified LJKA membership information
          </p>

        </div>


        <button
          type="button"
          onClick={() => navigate("/user/update-profile")}
          className="
            bg-[var(--ljka-primary)]
            hover:bg-[var(--ljka-primary-dark)]
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

      {profileRemainingDays !== null && (
        <MembershipRenewalCard
          user={user}
          membershipExpiry={membershipExpiry}
          remainingDays={profileRemainingDays}
        />
      )}


      {/* ==========================================
          BASIC DETAILS
      ========================================== */}

      <ProfileSection title="Basic Details">

        <Detail
          label="Member ID"
          value={user.memberId}
          emphasis
        />

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
          label="Address Line"
          value={user.address?.address}
        />

        <Detail
          label="Town / Village"
          value={user.address?.townVillage}
        />

        <Detail
          label="Tehsil / Sub District"
          value={user.address?.tehsilName}
        />

        <Detail
          label="District"
          value={user.address?.districtName}
        />

        <Detail
          label="State"
          value={user.address?.stateName}
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
        <Detail label="Nominee Name" value={user.nominee?.name} />
        <Detail label="Relationship" value={formatRelationship(user.nominee?.relationship)} />
        <Detail label="Mobile" value={user.nominee?.mobile} />
        <Detail label="Email" value={user.nominee?.email} />
      </ProfileSection>

      <ProfileSection title="KYC & Account Details">
        <Detail label="Aadhaar" value={maskAadhaar(user.aadhaar)} />
        <Detail label="Referral Code" value={user.referralCode} />
        <Detail label="Email Verified" value={user.emailVerified ? "Verified" : "Not Verified"} />
        <Detail label="Mobile Verified" value={user.mobileVerified ? "Verified" : "Not Verified"} />
        <Detail label="Registered On" value={formatDate(user.createdAt)} />
        <Detail label="KYC Status" value={user.kycCompleted ? "Completed" : "Pending"} />
        <Detail label="KYC Completed On" value={formatDate(user.kycCompletedAt)} />
        <Detail
          label="Membership Status"
          value={
            user.membershipPaymentStatus === "paid"
              ? "Active"
              : "Inactive - Payment Pending"
          }
        />

        <Detail
          label="Membership Expires On"
          value={
            user.membershipPaymentStatus === "paid"
              ? formatDate(membershipExpiry)
              : "Not active"
              }
        />
      </ProfileSection>

    </div>
  );
};


const MembershipRenewalCard = ({
  user,
  membershipExpiry,
  remainingDays,
}) => {
  const paymentPending = user?.membershipPaymentStatus !== "paid";

  const renewalDue =
    !paymentPending &&
    remainingDays > 0 &&
    remainingDays <= 30;

  const expired =
    !paymentPending &&
    (user?.membershipExpired || remainingDays <= 0);

  const needsAttention =
    paymentPending || renewalDue || expired;

  return (
    <section
      className={`mb-6 overflow-hidden rounded-2xl border p-5 shadow-[var(--ljka-shadow-sm)] sm:p-7 ${needsAttention
          ? "border-red-200 bg-red-50"
          : "border-green-200 bg-green-50"
        }`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">

          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${needsAttention
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
              }`}
          >
            {needsAttention ? (
              <FaExclamationTriangle />
            ) : (
              <FaCalendarAlt />
            )}
          </div>

          <div>

            <p
              className={`text-xs font-bold uppercase tracking-[0.16em] ${needsAttention
                  ? "text-red-600"
                  : "text-green-700"
                }`}
            >
              {paymentPending
                ? "Membership inactive"
                : expired
                  ? "Membership expired"
                  : renewalDue
                    ? "Renewal required soon"
                    : "Active membership"}
            </p>

            <h2
              className={`mt-2 text-xl font-bold sm:text-2xl ${needsAttention
                  ? "text-red-800"
                  : "text-green-800"
                }`}
            >
              {paymentPending
                ? "Complete your membership payment"
                : expired
                  ? "Please renew your LJKA membership"
                  : `${remainingDays} days remaining`}
            </h2>

            <p
              className={`mt-2 max-w-2xl text-sm leading-6 ${needsAttention
                  ? "text-red-700"
                  : "text-green-700"
                }`}
            >
              {paymentPending
                ? "Your KYC has been completed, but your LJKA membership is not active yet. Please complete the required membership payment to activate your membership."
                : expired
                  ? `Membership expired on ${formatDate(
                    membershipExpiry
                  )}. Please renew your membership and pay the required annual fee.`
                  : renewalDue
                    ? `Membership expires on ${formatDate(
                      membershipExpiry
                    )}. Please arrange the required annual fee renewal.`
                    : `Your LJKA membership is active. It expires on ${formatDate(
                      membershipExpiry
                    )}.`}
            </p>

          </div>
        </div>

        <div
          className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold ${needsAttention
              ? "bg-white text-red-700"
              : "bg-white text-green-700"
            }`}
        >
          {needsAttention ? (
            <FaExclamationTriangle />
          ) : (
            <FaCheckCircle />
          )}

          {paymentPending
            ? "Payment pending"
            : expired
              ? "Membership expired"
              : renewalDue
                ? "Renewal pending"
                : "Membership active"}
        </div>

      </div>
    </section>
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
        bg-[var(--ljka-card)]
        border border-[var(--ljka-border-light)]
        rounded-2xl
        shadow-[var(--ljka-shadow-sm)]
        mb-6
        overflow-hidden
      "
    >

      <div
        className="
          px-5
          sm:px-7
          py-4
          border-b border-[var(--ljka-border-light)]
          bg-[var(--ljka-primary-bg)]
        "
      >

        <h2
          className="
            text-lg
            sm:text-xl
            font-semibold
            text-[var(--ljka-primary)]
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
  emphasis = false,
}) => {

  return (
    <div>

      <p
        className="
          text-xs
          font-medium
          text-[var(--ljka-muted)]
          mb-1
        "
      >
        {label}
      </p>

      <p
        className={`text-sm break-words ${emphasis
          ? "font-bold text-[var(--ljka-primary)]"
          : "font-medium text-[var(--ljka-text)]"
          }`}
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

const formatRelationship = (relationship) => {
  if (!relationship) return "Not provided";

  return String(relationship)
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
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