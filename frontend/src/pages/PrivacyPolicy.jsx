import React from "react";
import { Link } from "react-router-dom";
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
              information provided through its website and membership
              processes.
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
                  users. Information shared with us is handled responsibly
                  and used primarily to provide, manage and improve our
                  membership and community-related services.
                </p>

                <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
                  By using the LJKA website or submitting information through
                  its forms, you acknowledge the practices described in this
                  Privacy Policy.
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
                Depending on how you use the website, LJKA may collect
                information such as your name, mobile number, address,
                membership details and other information that you voluntarily
                provide.
              </p>

              <p className="mt-3">
                Where required for membership or verification purposes,
                additional information or supporting documents may also be
                requested.
              </p>
            </PrivacyCard>


            <PrivacyCard
              number="02"
              title="How We Use Information"
              icon={<FaEye />}
            >
              <p>
                Information may be used for membership registration,
                verification, communication, account management and
                association-related activities.
              </p>

              <p className="mt-3">
                Information may also be used to process legitimate support,
                claim or member-related requests in accordance with applicable
                LJKA rules.
              </p>
            </PrivacyCard>


            <PrivacyCard
              number="03"
              title="KYC & Verification"
              icon={<FaCheckCircle />}
            >
              <p>
                Certain LJKA processes may require identity or document
                verification. Information submitted for such purposes may be
                reviewed by authorized LJKA personnel.
              </p>

              <p className="mt-3">
                Verification information should be accurate and genuine.
                False, misleading or fraudulent information may result in the
                relevant request being rejected or further action being taken
                according to applicable rules.
              </p>
            </PrivacyCard>


            <PrivacyCard
              number="04"
              title="Protection of Information"
              icon={<FaLock />}
            >
              <p>
                LJKA takes reasonable measures to protect information
                submitted through its website and associated systems against
                unauthorized access, misuse or disclosure.
              </p>

              <p className="mt-3">
                However, no internet-based system can be guaranteed to be
                completely secure, and users should exercise appropriate care
                when sharing information online.
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
                Information may be accessed or shared with authorized persons
                when reasonably necessary for membership administration,
                verification, support processing, legal requirements or
                protection of LJKA and its members.
              </p>
            </PrivacyCard>


            <PrivacyCard
              number="06"
              title="Public Member Information"
              icon={<FaEye />}
            >
              <p>
                Certain membership information may be displayed publicly on
                the LJKA website where the association considers such
                information necessary for transparency or community purposes.
              </p>

              <p className="mt-3">
                Sensitive information such as complete identity documents,
                passwords or unmasked personal credentials should not be
                displayed publicly.
              </p>
            </PrivacyCard>


            <PrivacyCard
              number="07"
              title="Cookies & Website Usage"
              icon={<FaDatabase />}
            >
              <p>
                The website may use basic technical mechanisms, including
                cookies or similar technologies, where necessary for website
                functionality, security or improving the user experience.
              </p>

              <p className="mt-3">
                Such technologies may help the website remember preferences or
                understand general website usage.
              </p>
            </PrivacyCard>


            <PrivacyCard
              number="08"
              title="Your Responsibility"
              icon={<FaUserShield />}
            >
              <p>
                Users are responsible for ensuring that information submitted
                through the website is accurate and that their login
                credentials, where applicable, are kept confidential.
              </p>

              <p className="mt-3">
                If you believe your account or personal information has been
                compromised, please contact LJKA as soon as reasonably
                possible.
              </p>
            </PrivacyCard>

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
                  Information may be retained for as long as reasonably
                  necessary to manage membership, maintain appropriate
                  records, fulfil legitimate association purposes, resolve
                  disputes, meet applicable requirements or protect the
                  interests of LJKA and its members.
                </p>

              </div>

            </div>

          </div>


          {/* =====================================================
              THIRD PARTY SERVICES
          ===================================================== */}
          <div className="mt-6 rounded-2xl border border-[var(--ljka-border)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">

            <h2 className="text-lg font-bold text-[var(--ljka-primary)]">
              Third-Party Services & External Links
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
              The LJKA website may contain links to external websites or
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
              reflect changes in its services, website, processes or
              applicable requirements. Any updated version will be published
              on this page.
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
                  If you have a question about how your information is used
                  or handled by LJKA, please get in touch with the association.
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

            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--ljka-muted)] transition hover:text-[var(--ljka-primary)]"
            >
              <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-1" />

              Back to Home
            </Link>


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