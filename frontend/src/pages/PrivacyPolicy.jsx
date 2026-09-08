import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaDatabase,
  FaEnvelope,
  FaEye,
  FaLock,
  FaShieldAlt,
  FaUserShield,
} from "react-icons/fa";

const PrivacyPolicy = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const returnPath = location.state?.from;

  const returnLabel =
    returnPath === "/register"
      ? "Back to Registration"
      : returnPath === "/kyc"
        ? "Back to KYC"
        : "Back to Home";

  const handleBack = () => {
    if (returnPath) {
      navigate(returnPath);
    } else {
      navigate("/");
    }
  };
  return (
    <main className="min-h-screen bg-[var(--ljka-bg)]">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-[var(--ljka-border)] bg-[var(--ljka-primary-bg)]">

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--ljka-gold)]/[0.07] blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[var(--ljka-primary)]/[0.035] blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <div className="max-w-3xl">

            {/* Label */}
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-8 rounded-full bg-[var(--ljka-gold)]" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold-dark)]">
                Your Privacy Matters
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-extrabold leading-tight text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">
              Privacy Policy
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
              This Privacy Policy explains how Lakhdaatar Jeevan Kalyan
              Association (LJKA) collects, uses, protects and manages
              personal information provided through its website, account
              registration, membership and KYC processes.
            </p>

            {/* Motto */}
            <div className="mt-7 flex items-center gap-3">

              <span className="h-9 w-1 rounded-full bg-[var(--ljka-gold)]" />

              <div>
                <p
                  className="text-lg font-bold text-[var(--ljka-primary)]"
                  style={{
                    fontFamily: "'Noto Serif Devanagari', serif",
                  }}
                >
                  सेवा परमो धर्मः
                </p>

                <p className="text-xs font-medium text-[var(--ljka-muted)]">
                  Service is the Highest Duty
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          CONTENT
      ========================================================= */}
      <section className="py-12 sm:py-16 lg:py-20">

        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">


          {/* =====================================================
              INTRODUCTION
          ===================================================== */}
          <div className="mb-8 rounded-2xl border border-[var(--ljka-border)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
                <FaUserShield />
              </div>

              <div>

                <h2 className="text-lg font-bold text-[var(--ljka-primary)]">
                  Our Commitment to Privacy
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--ljka-muted)]">
                  LJKA respects the privacy of its members, visitors and
                  users. We understand that information provided during
                  registration, membership and KYC processes may be personal
                  or sensitive. LJKA is committed to handling such information
                  responsibly and using it only for legitimate membership,
                  verification, administrative, support and association-related
                  purposes.
                </p>

                <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
                  By using the LJKA website or submitting information through
                  its forms, you acknowledge the practices described in this
                  Privacy Policy. Where consent or another lawful basis is
                  required for processing personal information, LJKA will
                  process such information accordingly.
                </p>

              </div>

            </div>

          </div>


          {/* =====================================================
              PRIVACY CARDS
          ===================================================== */}
          <div className="grid gap-6 lg:grid-cols-2">


            <PrivacyCard
              number="01"
              title="Information We Collect"
              icon={<FaDatabase />}
            >

              <p>
                Depending on the services and processes you use, LJKA may
                collect personal information that you provide during account
                registration, membership, KYC, verification, support or
                other association-related activities.
              </p>

              <p className="mt-3">
                This may include your full name, email address, mobile number,
                father's or husband's name where required, date of birth,
                gender, residential address, state, district, tehsil,
                town/village and PIN code.
              </p>

              <p className="mt-3">
                We may also collect employment status, occupation, referral
                information, membership or member ID information, KYC status,
                verification information and other information necessary for
                legitimate association-related purposes.
              </p>

              <p className="mt-3">
                Where required for identity or KYC purposes, LJKA may request
                Aadhaar details or supporting identity documents. Such
                information will be handled as confidential personal
                information and will not be intentionally displayed publicly.
              </p>

              <p className="mt-3">
                If you provide nominee information, we may collect the
                nominee's name, mobile number, email address and relationship
                with you for membership, support, claim or related
                administrative purposes.
              </p>

            </PrivacyCard>


            <PrivacyCard
              number="02"
              title="How We Use Information"
              icon={<FaEye />}
            >

              <p>
                Information may be used to create and manage your LJKA
                account, process membership registration, verify your email
                or mobile number, complete KYC requirements and maintain
                accurate membership records.
              </p>

              <p className="mt-3">
                We may also use information to communicate with members,
                provide account-related notifications, respond to support
                requests, administer membership activities and process
                legitimate support or claim-related requests in accordance
                with applicable LJKA rules.
              </p>

              <p className="mt-3">
                Information may also be used to prevent fraud, duplicate
                accounts, misuse of services, unauthorized access and other
                activities that may compromise the security or integrity of
                LJKA systems.
              </p>

              <p className="mt-3">
                Where necessary, information may be used to comply with
                applicable legal requirements, resolve disputes, establish
                or protect legal rights, and protect LJKA, its members and
                other persons.
              </p>

            </PrivacyCard>


            <PrivacyCard
              number="03"
              title="KYC & Verification"
              icon={<FaCheckCircle />}
            >

              <p>
                Certain LJKA membership or support processes may require
                identity and KYC verification. Information submitted for
                these purposes may be reviewed by authorized LJKA personnel
                or authorized service providers where necessary for the
                relevant process.
              </p>

              <p className="mt-3">
                KYC information may include identity information, Aadhaar
                details or supporting documents, date of birth, gender,
                address and other information reasonably required for
                verification.
              </p>

              <p className="mt-3">
                Aadhaar or other identity information will be treated as
                confidential and will not be intentionally published as part
                of a public member profile or directory.
              </p>

              <p className="mt-3">
                LJKA may use verification information to confirm identity,
                prevent duplicate or fraudulent membership, process
                legitimate association requests and maintain appropriate
                membership records.
              </p>

              <p className="mt-3">
                Members are responsible for providing accurate and genuine
                information. False, misleading, altered or fraudulent
                information may result in rejection of registration,
                suspension of relevant services or other action in accordance
                with applicable LJKA rules and requirements.
              </p>

            </PrivacyCard>


            <PrivacyCard
              number="04"
              title="Protection of Information"
              icon={<FaLock />}
            >

              <p>
                LJKA takes reasonable technical and organizational measures
                to protect personal information submitted through its website
                and associated systems against unauthorized access, misuse,
                alteration, loss or disclosure.
              </p>

              <p className="mt-3">
                Access to personal and KYC information should be limited to
                persons or systems that require such information for legitimate
                membership, verification, administration, support, security
                or other authorized purposes.
              </p>

              <p className="mt-3">
                Account passwords are intended to be protected through secure
                password handling and should not be publicly displayed or
                shared with LJKA personnel or other members.
              </p>

              <p className="mt-3">
                No internet-based system can be guaranteed to be completely
                secure. Members should also take reasonable care of their
                passwords, OTPs, devices and account credentials.
              </p>

            </PrivacyCard>


            <PrivacyCard
              number="05"
              title="Information Sharing"
              icon={<FaShieldAlt />}
            >

              <p>
                LJKA does not intend to sell or commercially trade members'
                personal information.
              </p>

              <p className="mt-3">
                Personal information may be accessed by authorized LJKA
                personnel when reasonably necessary for membership
                administration, KYC verification, support, claims,
                communication, security or other legitimate association
                activities.
              </p>

              <p className="mt-3">
                Where necessary to operate services, LJKA may use trusted
                technology, hosting, communication, verification or other
                service providers. Such providers should receive only the
                information reasonably necessary for the service they provide
                and should be subject to appropriate confidentiality and
                security obligations.
              </p>

              <p className="mt-3">
                Information may also be disclosed where required by law,
                legal process, government authority, protection of rights,
                prevention of fraud or protection of the safety and security
                of LJKA and its members.
              </p>

            </PrivacyCard>


            <PrivacyCard
              number="06"
              title="Public Member Information"
              icon={<FaEye />}
            >

              <p>
                LJKA may, where appropriate and permitted, display limited
                non-sensitive membership information publicly for transparency,
                community or membership-related purposes.
              </p>

              <p className="mt-3">
                Publicly displayed information should be limited to information
                specifically intended for public display, such as a member's
                name, membership ID or other non-sensitive membership
                information where applicable.
              </p>

              <p className="mt-3">
                LJKA will not intentionally display Aadhaar numbers,
                passwords, OTPs, complete identity documents, nominee contact
                details, complete residential addresses, or other confidential
                KYC information as public member information.
              </p>

              <p className="mt-3">
                Members should also avoid voluntarily posting confidential
                personal information in public areas of the website.
              </p>

            </PrivacyCard>


            <PrivacyCard
              number="07"
              title="Cookies & Website Usage"
              icon={<FaDatabase />}
            >

              <p>
                The website may use basic technical mechanisms, including
                cookies, browser storage or similar technologies, where
                necessary for website functionality, security, authentication,
                remembering temporary form information or improving the user
                experience.
              </p>

              <p className="mt-3">
                Temporary information stored in the browser may help users
                continue an incomplete registration or form process after
                navigating between pages or refreshing the website.
              </p>

              <p className="mt-3">
                Such temporary browser information is different from the
                personal information maintained in LJKA's account or membership
                systems. Users should avoid using shared or public devices
                when entering confidential information.
              </p>

            </PrivacyCard>


            <PrivacyCard
              number="08"
              title="Your Responsibility"
              icon={<FaUserShield />}
            >

              <p>
                Users are responsible for ensuring that information submitted
                through the website is accurate, complete and up to date,
                particularly information used for registration, KYC,
                membership or nominee purposes.
              </p>

              <p className="mt-3">
                Users should keep their passwords, OTPs and account credentials
                confidential and should not share them with other persons.
              </p>

              <p className="mt-3">
                If you provide information relating to another person,
                including a nominee, you should provide accurate information
                and, where appropriate, inform that person that their
                information has been provided to LJKA.
              </p>

              <p className="mt-3">
                If you believe your account or personal information has been
                compromised, please contact LJKA as soon as reasonably
                possible.
              </p>

            </PrivacyCard>

          </div>


          {/* =====================================================
              NOMINEE INFORMATION
          ===================================================== */}
          <div className="mt-8 rounded-2xl border border-[var(--ljka-border)] bg-[var(--ljka-primary-bg)] p-6 sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--ljka-primary)] shadow-sm">
                <FaUserShield />
              </div>

              <div>

                <h2 className="text-lg font-bold text-[var(--ljka-primary)]">
                  Nominee Information
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--ljka-muted)]">
                  Where a member provides nominee information, LJKA may collect
                  the nominee's name, mobile number, email address and
                  relationship with the member. This information may be used
                  for membership administration, support, claim processing,
                  communication or other legitimate association-related
                  purposes.
                </p>

                <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
                  Nominee information will be treated as personal information
                  and should not be displayed publicly. Members should take
                  reasonable care to provide accurate nominee information and
                  inform the nominee where appropriate.
                </p>

              </div>

            </div>

          </div>


          {/* =====================================================
              AADHAAR & SENSITIVE INFORMATION
          ===================================================== */}
          <div className="mt-6 rounded-2xl border border-[var(--ljka-border)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
                <FaShieldAlt />
              </div>

              <div>

                <h2 className="text-lg font-bold text-[var(--ljka-primary)]">
                  Aadhaar & Sensitive Personal Information
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--ljka-muted)]">
                  Where Aadhaar information or other identity information is
                  requested for KYC or verification, LJKA will use it only for
                  legitimate identity, membership, verification or related
                  purposes for which it was collected.
                </p>

                <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
                  Aadhaar information, identity documents and other sensitive
                  KYC information should be accessible only to authorized
                  persons or systems that require it for the relevant process.
                  Such information should not be intentionally displayed in
                  public member profiles, public directories or publicly
                  accessible areas of the website.
                </p>

                <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
                  LJKA will handle such information in accordance with
                  applicable privacy, data-protection and identity-verification
                  requirements. Where a specific verification service or
                  authentication process is used, additional requirements may
                  apply to that process.
                </p>

              </div>

            </div>

          </div>


          {/* =====================================================
              DATA RETENTION
          ===================================================== */}
          <div className="mt-8 rounded-2xl border border-[var(--ljka-border)] bg-[var(--ljka-primary-bg)] p-6 sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--ljka-primary)] shadow-sm">
                <FaDatabase />
              </div>

              <div>

                <h2 className="text-lg font-bold text-[var(--ljka-primary)]">
                  Retention of Information
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--ljka-muted)]">
                  LJKA may retain personal information for as long as
                  reasonably necessary to provide and manage membership,
                  complete verification and KYC processes, maintain appropriate
                  membership and administrative records, process support or
                  claim-related matters, resolve disputes, prevent fraud,
                  meet applicable requirements or protect the interests of
                  LJKA and its members.
                </p>

                <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
                  Different categories of information may need to be retained
                  for different periods depending on their purpose and any
                  applicable legal, regulatory, administrative or operational
                  requirements.
                </p>

                <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
                  When personal information is no longer reasonably required
                  for its legitimate purpose, LJKA may delete, anonymize or
                  otherwise dispose of it in accordance with its applicable
                  retention and security practices, subject to information
                  that must be retained for legitimate legal or administrative
                  purposes.
                </p>

              </div>

            </div>

          </div>


          {/* =====================================================
              USER RIGHTS & REQUESTS
          ===================================================== */}
          <div className="mt-6 rounded-2xl border border-[var(--ljka-border)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">

            <h2 className="text-lg font-bold text-[var(--ljka-primary)]">
              Privacy Requests & Your Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
              Depending on applicable law and the circumstances of the
              request, members may contact LJKA regarding their personal
              information, including questions about the information held
              about them, correction of inaccurate information, or other
              privacy-related requests.
            </p>

            <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
              LJKA may need to verify the identity of the person making a
              request before providing access to, correcting, changing or
              deleting personal information. Some information may need to be
              retained where required for legitimate legal, security,
              administrative or dispute-resolution purposes.
            </p>

            <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
              To raise a privacy-related request or concern, please use the
              contact details provided by LJKA on its official website or
              contact the association using the details provided below.
            </p>

          </div>


          {/* =====================================================
              THIRD PARTY SERVICES
          ===================================================== */}
          <div className="mt-6 rounded-2xl border border-[var(--ljka-border)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">

            <h2 className="text-lg font-bold text-[var(--ljka-primary)]">
              Third-Party Services & External Links
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
              LJKA may use third-party technology or service providers where
              reasonably necessary to operate the website, provide
              communication or verification services, maintain infrastructure,
              improve security or provide other legitimate services.
            </p>

            <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
              Where third-party providers process personal information on
              behalf of LJKA, LJKA should take reasonable steps to ensure that
              such processing is limited to the relevant purpose and subject
              to appropriate confidentiality and security requirements.
            </p>

            <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
              The LJKA website may also contain links to external websites or
              services. These third-party websites operate under their own
              privacy policies and practices. LJKA is not responsible for the
              privacy practices, security or content of external websites.
            </p>

          </div>


          {/* =====================================================
              POLICY CHANGES
          ===================================================== */}
          <div className="mt-6 rounded-2xl border border-[var(--ljka-border)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">

            <h2 className="text-lg font-bold text-[var(--ljka-primary)]">
              Changes to This Privacy Policy
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
              LJKA may update this Privacy Policy from time to time to
              reflect changes in its services, website, membership processes,
              information practices or applicable requirements.
            </p>

            <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
              Any updated version will be published on this page. Where
              appropriate, LJKA may provide additional notice for material
              changes in accordance with its applicable practices and
              requirements.
            </p>

          </div>


          {/* =====================================================
              CONTACT
          ===================================================== */}
          <div className="mt-8 rounded-2xl bg-[var(--ljka-primary)] p-6 text-white shadow-[var(--ljka-shadow-md)] sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ljka-gold-light)]">
                  Privacy Questions?
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Need more information?
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                  If you have a question about how your personal information
                  is collected, used, stored or handled by LJKA, please get
                  in touch with the association.
                </p>

              </div>


              <a
                href="tel:9569503829"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-[var(--ljka-gold)] px-5 py-3 text-sm font-bold text-[var(--ljka-primary)] transition hover:bg-[var(--ljka-gold-dark)]"
              >
                <FaEnvelope className="text-xs" />
                Contact LJKA
              </a>

            </div>

          </div>


          {/* =====================================================
              BOTTOM LINKS
          ===================================================== */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">

            <button
              type="button"
              onClick={handleBack}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--ljka-muted)] transition hover:text-[var(--ljka-primary)]"
            >
              <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-1" />

              {returnLabel}
            </button>


            <Link
              to="/terms-conditions"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--ljka-primary)] transition hover:text-[var(--ljka-gold-dark)]"
            >
              Terms & Conditions

              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
};


/* =============================================================
   PRIVACY CARD
============================================================= */

const PrivacyCard = ({ number, title, icon, children }) => (
  <article className="group relative overflow-hidden rounded-2xl border border-[var(--ljka-border)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ljka-gold)]/40 hover:shadow-[var(--ljka-shadow-md)] sm:p-7">

    {/* Number */}
    <div className="absolute right-5 top-5 text-4xl font-extrabold text-[var(--ljka-primary)]/[0.045]">
      {number}
    </div>


    {/* Icon */}
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ljka-primary-bg)] text-sm text-[var(--ljka-primary)] transition-colors group-hover:bg-[var(--ljka-gold-light)]">
      {icon}
    </div>


    <h2 className="mt-5 text-lg font-bold text-[var(--ljka-primary)]">
      {title}
    </h2>


    <div className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
      {children}
    </div>


    <div className="mt-5 h-[2px] w-7 rounded-full bg-[var(--ljka-gold)] transition-all duration-300 group-hover:w-12" />

  </article>
);


export default PrivacyPolicy;
