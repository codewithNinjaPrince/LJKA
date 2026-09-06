import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaFileContract,
  FaInfoCircle,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";

const TermsConditions = () => {
  return (
    <main className="min-h-screen bg-[var(--ljka-bg)]">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-[var(--ljka-border)] bg-[var(--ljka-primary-bg)]">

        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--ljka-gold)]/[0.07] blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[var(--ljka-primary)]/[0.035] blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <div className="max-w-3xl">

            {/* Label */}
            <div className="mb-5 flex items-center gap-3">

              <span className="h-[2px] w-8 rounded-full bg-[var(--ljka-gold)]" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold-dark)]">
                Legal Information
              </span>

            </div>


            {/* Heading */}
            <h1 className="text-3xl font-extrabold leading-tight text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">
              Terms & Conditions
            </h1>


            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
              Please read these terms carefully before using the LJKA website,
              registering as a member, or participating in the association's
              activities and support systems.
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

          {/* Intro card */}
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
                  By accessing or using the LJKA website, you acknowledge that
                  you have read, understood and agree to follow these Terms &
                  Conditions. If you do not agree with any part of these terms,
                  please do not use the website or its services.
                </p>

              </div>

            </div>

          </div>


          {/* =====================================================
              TERMS GRID
          ===================================================== */}
          <div className="grid gap-6 lg:grid-cols-2">

            <TermsCard
              number="01"
              title="About LJKA"
              icon={<FaUsers />}
            >
              <p>
                Lakhdaatar Jeevan Kalyan Association (LJKA) is a community
                association established around the principles of trust,
                humanity, collective responsibility and mutual support.
              </p>

              <p className="mt-3">
                The website provides information about LJKA, its membership,
                rules, activities, support initiatives and other related
                information.
              </p>
            </TermsCard>


            <TermsCard
              number="02"
              title="Membership"
              icon={<FaCheckCircle />}
            >
              <p>
                Membership is subject to the eligibility requirements,
                registration process and rules applicable to LJKA members.
              </p>

              <p className="mt-3">
                Members are expected to provide accurate information during
                registration and keep their submitted information up to date
                whenever required.
              </p>
            </TermsCard>


            <TermsCard
              number="03"
              title="Registration & Information"
              icon={<FaInfoCircle />}
            >
              <p>
                Information submitted through registration, KYC or other
                forms should be complete and accurate to the best of the
                member's knowledge.
              </p>

              <p className="mt-3">
                LJKA may require verification of submitted information and
                supporting documents before accepting or processing a
                membership or related request.
              </p>
            </TermsCard>


            <TermsCard
              number="04"
              title="Member Responsibilities"
              icon={<FaShieldAlt />}
            >
              <p>
                Members are expected to follow LJKA's rules, maintain
                respectful conduct and cooperate with the association's
                processes.
              </p>

              <p className="mt-3">
                Members must not knowingly provide false, misleading or
                fraudulent information or misuse LJKA's services, website or
                community systems.
              </p>
            </TermsCard>


            <TermsCard
              number="05"
              title="Mutual Support & Contributions"
              icon={<FaUsers />}
            >
              <p>
                LJKA's support activities operate according to its applicable
                rules, procedures and eligibility conditions.
              </p>

              <p className="mt-3">
                Any contribution, support request, claim or related process is
                subject to verification and the applicable LJKA rules at the
                time of processing.
              </p>
            </TermsCard>


            <TermsCard
              number="06"
              title="Verification & Claims"
              icon={<FaCheckCircle />}
            >
              <p>
                LJKA may verify membership information, nominee details,
                documents and other information before processing a claim or
                support request.
              </p>

              <p className="mt-3">
                Submission of a request does not by itself guarantee approval
                or payment. The final decision will depend on applicable
                rules, eligibility and verification.
              </p>
            </TermsCard>


            <TermsCard
              number="07"
              title="Website Use"
              icon={<FaShieldAlt />}
            >
              <p>
                Users agree to use the website responsibly and only for lawful
                purposes.
              </p>

              <p className="mt-3">
                Attempting to interfere with the website, misuse its forms,
                access restricted information, submit fraudulent information or
                disrupt its operation is not permitted.
              </p>
            </TermsCard>


            <TermsCard
              number="08"
              title="Website Information"
              icon={<FaInfoCircle />}
            >
              <p>
                LJKA makes reasonable efforts to keep website information
                accurate and useful. However, information may occasionally be
                updated, changed or corrected.
              </p>

              <p className="mt-3">
                Members should rely on the latest official information and
                applicable LJKA rules when making decisions concerning
                membership or support.
              </p>
            </TermsCard>

          </div>


          {/* =====================================================
              PRIVACY
          ===================================================== */}
          <div className="mt-8 rounded-2xl border border-[var(--ljka-border)] bg-[var(--ljka-primary-bg)] p-6 sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--ljka-primary)] shadow-sm">
                <FaShieldAlt />
              </div>

              <div>

                <h2 className="text-lg font-bold text-[var(--ljka-primary)]">
                  Privacy & Personal Information
                </h2>

                <p className="mt-2 text-sm leading-7 text-[var(--ljka-muted)]">
                  Personal information submitted to LJKA may be used for
                  membership administration, verification, communication and
                  other legitimate association-related purposes in accordance
                  with the applicable privacy practices and policies.
                </p>

                <Link
                  to="/privacy-policy"
                  className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--ljka-primary)] transition hover:text-[var(--ljka-gold-dark)]"
                >
                  Read Privacy Policy

                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

              </div>

            </div>

          </div>


          {/* =====================================================
              CHANGES
          ===================================================== */}
          <div className="mt-6 rounded-2xl border border-[var(--ljka-border)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">

            <h2 className="text-lg font-bold text-[var(--ljka-primary)]">
              Changes to These Terms
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
              LJKA may update or modify these Terms & Conditions when
              necessary. Updated terms will be published on this page, and
              continued use of the website after such changes may constitute
              acceptance of the updated terms.
            </p>

          </div>


          {/* =====================================================
              CONTACT / LAST SECTION
          ===================================================== */}
          <div className="mt-8 rounded-2xl bg-[var(--ljka-primary)] p-6 text-white shadow-[var(--ljka-shadow-md)] sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ljka-gold-light)]">
                  Need Clarification?
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  We're here to help.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                  If you have questions regarding these terms, membership or
                  LJKA's processes, please contact the association.
                </p>

              </div>


              <Link
                to="/contact"
                className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-[var(--ljka-gold)] px-5 py-3 text-sm font-bold text-[var(--ljka-primary)] transition hover:bg-[var(--ljka-gold-dark)]"
              >
                Contact LJKA

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

            </div>

          </div>


          {/* Back link */}
          <div className="mt-8">

            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--ljka-muted)] transition hover:text-[var(--ljka-primary)]"
            >
              <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-1" />

              Back to Home
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