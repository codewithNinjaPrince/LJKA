import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaFileContract,
  FaGavel,
  FaIdCard,
  FaLock,
  FaShieldAlt,
  FaUserCheck,
} from "react-icons/fa";

const TermsConditions = () => {
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
                Please Read Carefully
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-extrabold leading-tight text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">
              Terms & Conditions
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
              These Terms & Conditions govern your use of the Lakhdaatar
              Jeevan Kalyan Association (LJKA) website, account registration,
              membership, KYC verification and related association services.
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
                <FaFileContract />
              </div>

              <div>

                <h2 className="text-lg font-bold text-[var(--ljka-primary)]">
                  Agreement to These Terms
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--ljka-muted)]">
                  By accessing or using the LJKA website, creating an account,
                  applying for membership, submitting KYC information or using
                  an LJKA service, you agree to comply with these Terms &
                  Conditions and any applicable LJKA rules, policies and
                  procedures.
                </p>

                <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
                  If you do not agree with these Terms & Conditions, please do
                  not use the relevant LJKA services or submit information
                  through the website.
                </p>

              </div>

            </div>

          </div>


          {/* =====================================================
              TERMS CARDS
          ===================================================== */}
          <div className="grid gap-6 lg:grid-cols-2">


            <TermsCard
              number="01"
              title="Eligibility & Membership"
              icon={<FaUserCheck />}
            >

              <p>
                Membership with LJKA is subject to the eligibility requirements,
                membership rules and verification procedures applicable to the
                relevant membership category.
              </p>

              <p className="mt-3">
                Creating an account or submitting a membership application does
                not by itself guarantee membership approval, KYC approval,
                eligibility for any support or access to any particular LJKA
                benefit.
              </p>

              <p className="mt-3">
                LJKA may review the information submitted by an applicant and
                may approve, reject, suspend or otherwise restrict an account
                where reasonably necessary in accordance with applicable rules,
                verification requirements or security considerations.
              </p>

            </TermsCard>


            <TermsCard
              number="02"
              title="Registration & Account Information"
              icon={<FaClipboardCheck />}
            >

              <p>
                Members must provide accurate, complete and current information
                during registration and throughout their relationship with
                LJKA.
              </p>

              <p className="mt-3">
                Registration information may include your full name, email
                address and other information required for account creation.
                Additional information may be required during KYC or membership
                processing.
              </p>

              <p className="mt-3">
                Members must not knowingly provide false, misleading, altered,
                fraudulent or impersonated information.
              </p>

              <p className="mt-3">
                If information changes, members should update the relevant
                information through the available LJKA process where applicable.
              </p>

            </TermsCard>


            <TermsCard
              number="03"
              title="Email, Mobile & OTP Verification"
              icon={<FaCheckCircle />}
            >

              <p>
                LJKA may use email addresses and mobile numbers for account
                verification, authentication, membership communication,
                security notifications and other legitimate association-related
                purposes.
              </p>

              <p className="mt-3">
                Where OTP verification is required, the member must enter the
                verification code received through the applicable communication
                channel.
              </p>

              <p className="mt-3">
                OTPs are intended for the person who requested the verification
                and should not be shared with another person.
              </p>

              <p className="mt-3">
                LJKA may require verification to be repeated where a
                verification has expired, is invalid, or where additional
                verification is reasonably required for account security.
              </p>

            </TermsCard>


            <TermsCard
              number="04"
              title="KYC & Identity Verification"
              icon={<FaIdCard />}
            >

              <p>
                Certain membership or association services may require
                completion of KYC or identity verification before access to
                those services is provided.
              </p>

              <p className="mt-3">
                KYC information may include personal and identity information
                such as date of birth, gender, residential address, employment
                information and identity documents or Aadhaar details where
                required for the relevant verification process.
              </p>

              <p className="mt-3">
                Members authorize LJKA to review the information submitted for
                the purpose of carrying out the applicable verification and
                membership process.
              </p>

              <p className="mt-3">
                Submission of KYC information does not guarantee successful
                verification. LJKA may request additional information or
                documentation where reasonably necessary.
              </p>

            </TermsCard>


            <TermsCard
              number="05"
              title="Aadhaar & Identity Documents"
              icon={<FaShieldAlt />}
            >

              <p>
                Where Aadhaar information or another identity document is
                requested for KYC or verification, members must provide
                information that belongs to them and is accurate to the best
                of their knowledge.
              </p>

              <p className="mt-3">
                Members must not upload, submit or use another person's identity
                document or Aadhaar information as their own.
              </p>

              <p className="mt-3">
                Identity information submitted to LJKA may be reviewed and
                processed for legitimate identity, membership and verification
                purposes and will be handled in accordance with the applicable
                privacy and data-protection requirements.
              </p>

              <p className="mt-3">
                LJKA does not guarantee approval merely because an identity
                document or Aadhaar information has been submitted.
              </p>

            </TermsCard>


            <TermsCard
              number="06"
              title="Nominee Information"
              icon={<FaUserCheck />}
            >

              <p>
                Where a member provides nominee information, the member is
                responsible for providing accurate nominee details, including
                the nominee's name, contact information and relationship.
              </p>

              <p className="mt-3">
                Nominee information may be used for membership administration,
                support or claim-related processes and other legitimate
                association purposes.
              </p>

              <p className="mt-3">
                Providing a person as a nominee does not by itself establish
                that the person is entitled to any particular payment, benefit
                or claim. Any such request remains subject to LJKA's applicable
                verification, eligibility and claim procedures.
              </p>

            </TermsCard>


            <TermsCard
              number="07"
              title="Support & Claim Requests"
              icon={<FaClipboardCheck />}
            >

              <p>
                Any support, assistance or claim-related request submitted
                through LJKA is subject to the applicable membership rules,
                eligibility conditions, verification requirements and
                documentation requirements.
              </p>

              <p className="mt-3">
                A request, application or submission does not automatically
                create an entitlement to payment, financial assistance or
                another benefit.
              </p>

              <p className="mt-3">
                LJKA may require supporting documents and may verify the
                identity, membership status, nominee information and other
                relevant facts before deciding a request.
              </p>

              <p className="mt-3">
                LJKA may reject or delay a request where information is
                incomplete, inaccurate, inconsistent, unverifiable or otherwise
                does not satisfy the applicable requirements.
              </p>

            </TermsCard>


            <TermsCard
              number="08"
              title="Account Security"
              icon={<FaLock />}
            >

              <p>
                Members are responsible for maintaining the confidentiality of
                their account credentials, passwords and OTPs and for taking
                reasonable precautions to prevent unauthorized access to their
                account.
              </p>

              <p className="mt-3">
                Members should not share passwords, OTPs or authentication
                credentials with other persons.
              </p>

              <p className="mt-3">
                If a member believes that an account has been accessed without
                authorization or that account credentials have been compromised,
                the member should notify LJKA as soon as reasonably possible.
              </p>

              <p className="mt-3">
                LJKA may temporarily restrict or suspend access where
                reasonably necessary to protect an account, member information
                or the security of its systems.
              </p>

            </TermsCard>


            <TermsCard
              number="09"
              title="Member Responsibilities"
              icon={<FaCheckCircle />}
            >

              <p>
                Members must use the LJKA website and services lawfully and
                responsibly.
              </p>

              <p className="mt-3">
                Members must not attempt to gain unauthorized access to LJKA
                systems, interfere with website functionality, introduce
                malicious software, misuse another person's account or attempt
                to circumvent security or verification controls.
              </p>

              <p className="mt-3">
                Members must not submit fraudulent documents, impersonate
                another person, create duplicate or deceptive accounts, or
                knowingly provide misleading information.
              </p>

              <p className="mt-3">
                Members must not use LJKA services for unlawful, abusive,
                fraudulent or harmful activities.
              </p>

            </TermsCard>


            <TermsCard
              number="10"
              title="Website Availability"
              icon={<FaShieldAlt />}
            >

              <p>
                LJKA aims to keep its website and services available and
                functional, but continuous or uninterrupted availability cannot
                be guaranteed.
              </p>

              <p className="mt-3">
                The website may occasionally be unavailable due to maintenance,
                updates, technical problems, security measures, network
                failures or circumstances outside LJKA's reasonable control.
              </p>

              <p className="mt-3">
                LJKA may modify, suspend or discontinue any website feature,
                process or service where reasonably necessary.
              </p>

            </TermsCard>


            <TermsCard
              number="11"
              title="Third-Party Services & Links"
              icon={<FaShieldAlt />}
            >

              <p>
                LJKA may use third-party technology or service providers for
                functions such as hosting, communication, verification,
                infrastructure, security or other website-related services.
              </p>

              <p className="mt-3">
                Third-party services may operate under their own terms,
                conditions and privacy policies. Where applicable, users should
                review those terms before using the relevant third-party
                service.
              </p>

              <p className="mt-3">
                LJKA may provide links to external websites for convenience.
                LJKA does not control and is not responsible for the content,
                availability, security or policies of external websites.
              </p>

            </TermsCard>


            <TermsCard
              number="12"
              title="Privacy"
              icon={<FaUserCheck />}
            >

              <p>
                LJKA's collection and use of personal information is described
                in its Privacy Policy, which forms an important part of the
                overall terms governing use of LJKA's website and services.
              </p>

              <p className="mt-3">
                Members should review the Privacy Policy before submitting
                registration, KYC, nominee or other personal information.
              </p>

              <p className="mt-3">
                By using LJKA services and providing information, members
                acknowledge that their information may be processed for the
                purposes described in the applicable Privacy Policy and these
                Terms & Conditions.
              </p>

            </TermsCard>


            <TermsCard
              number="13"
              title="Suspension or Termination"
              icon={<FaExclamationTriangle />}
            >

              <p>
                LJKA may suspend, restrict or terminate an account or access to
                particular services where reasonably necessary due to security
                concerns, suspected fraud, misuse, violation of these Terms,
                inaccurate or unverifiable information, or failure to satisfy
                applicable membership or verification requirements.
              </p>

              <p className="mt-3">
                Where appropriate, LJKA may provide an opportunity for the
                member to clarify or correct information before taking further
                action.
              </p>

              <p className="mt-3">
                Suspension or termination of access does not automatically
                remove obligations or rights that arose before the suspension
                or termination where those obligations or rights continue to
                apply.
              </p>

            </TermsCard>


            <TermsCard
              number="14"
              title="Intellectual Property"
              icon={<FaFileContract />}
            >

              <p>
                Unless otherwise stated, the LJKA website and its content,
                including logos, branding, graphics, text, design elements,
                materials and other original content, are owned by or used by
                LJKA with appropriate rights.
              </p>

              <p className="mt-3">
                Users must not copy, reproduce, modify, distribute, publish,
                sell or commercially exploit LJKA content without appropriate
                authorization, except where permitted by applicable law.
              </p>

            </TermsCard>


            <TermsCard
              number="15"
              title="Limitation & No Guarantee"
              icon={<FaExclamationTriangle />}
            >

              <p>
                LJKA provides its website and services subject to the
                applicable membership rules, verification requirements and
                operational conditions.
              </p>

              <p className="mt-3">
                Information displayed on the website is intended for general
                association-related purposes and may be updated or changed.
              </p>

              <p className="mt-3">
                Membership registration, KYC submission or account creation
                should not be understood as a guarantee of eligibility,
                approval, financial assistance, claim settlement or any
                particular benefit unless LJKA has specifically confirmed the
                relevant entitlement under its applicable rules.
              </p>

            </TermsCard>


            <TermsCard
              number="16"
              title="Changes to These Terms"
              icon={<FaGavel />}
            >

              <p>
                LJKA may update these Terms & Conditions from time to time to
                reflect changes in its website, membership processes, services,
                operational requirements or applicable legal and regulatory
                requirements.
              </p>

              <p className="mt-3">
                Updated Terms & Conditions will be published on this page.
                Continued use of the relevant LJKA services after an update
                may constitute acceptance of the updated terms to the extent
                permitted by applicable law.
              </p>

            </TermsCard>


            <TermsCard
              number="17"
              title="Applicable Law & Disputes"
              icon={<FaGavel />}
            >

              <p>
                These Terms & Conditions are intended to govern the use of LJKA
                website and services subject to applicable laws and regulations.
              </p>

              <p className="mt-3">
                Any dispute or concern should first be raised with LJKA through
                its designated contact or grievance process so that the matter
                may be reviewed and addressed where possible.
              </p>

              <p className="mt-3">
                Nothing in these Terms is intended to exclude or restrict any
                rights or remedies that cannot lawfully be excluded or
                restricted under applicable law.
              </p>

            </TermsCard>


            <TermsCard
              number="18"
              title="Contact & Grievances"
              icon={<FaShieldAlt />}
            >

              <p>
                If you have questions regarding these Terms & Conditions,
                membership, KYC, account access, support or privacy-related
                matters, please contact LJKA using the official contact
                information provided on the website.
              </p>

              <p className="mt-3">
                When contacting LJKA regarding an account or personal
                information, you may be asked to provide reasonable information
                to verify your identity before account-specific information
                can be disclosed or changed.
              </p>

            </TermsCard>

          </div>


          {/* =====================================================
              IMPORTANT NOTICE
          ===================================================== */}
          <div className="mt-8 rounded-2xl border border-[var(--ljka-gold)]/30 bg-[var(--ljka-primary-bg)] p-6 sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--ljka-primary)] shadow-sm">
                <FaExclamationTriangle />
              </div>

              <div>

                <h2 className="text-lg font-bold text-[var(--ljka-primary)]">
                  Important Notice
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--ljka-muted)]">
                  Submission of registration or KYC information does not by
                  itself guarantee membership approval, KYC approval, financial
                  assistance, claim approval or any other benefit. Each request
                  remains subject to the applicable LJKA rules, eligibility
                  conditions, verification and documentation requirements.
                </p>

                <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
                  Members should carefully review the Privacy Policy before
                  submitting personal, identity, nominee or KYC information.
                </p>

              </div>

            </div>

          </div>


          {/* =====================================================
              ACCEPTANCE
          ===================================================== */}
          <div className="mt-6 rounded-2xl border border-[var(--ljka-border)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
                <FaCheckCircle />
              </div>

              <div>

                <h2 className="text-lg font-bold text-[var(--ljka-primary)]">
                  By Using LJKA Services
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--ljka-muted)]">
                  By creating an account, registering as a member, submitting
                  KYC information or otherwise using LJKA services, you confirm
                  that you have read and understood these Terms & Conditions and
                  agree to comply with them, together with the applicable LJKA
                  policies and procedures.
                </p>

              </div>

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
              to="/privacy-policy"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--ljka-primary)] transition hover:text-[var(--ljka-gold-dark)]"
            >
              Privacy Policy

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
   TERMS CARD
============================================================= */

const TermsCard = ({ number, title, icon, children }) => (
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


export default TermsConditions;
