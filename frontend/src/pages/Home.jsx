// import React from 'react'
// import { Link } from 'react-router-dom'
// import HeroCarousel from '../components/HeroCarousel'
// import MessageSection from '../components/MessageSection'

// const Home = () => {
//     return (
//         <>
//             <HeroCarousel />
//             <MessageSection />
//         </>
//     )
// }

// export default Home

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaUsers,
  FaShieldAlt,
  FaHandsHelping,
  FaHeart,
  FaCheckCircle,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#f8f9fb] text-[var(--ljka-text)]">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--ljka-primary)] via-[#123452] to-[#071d32] text-white">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[var(--ljka-gold)]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-20 sm:py-24 lg:py-28">
          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/30 bg-white/5 px-4 py-2 mb-6">
              <FaHeart className="text-[var(--ljka-gold)] text-xs" />
              <span className="text-xs sm:text-sm text-white/85">
                Together for a stronger community
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight">
              Lakhdaatar Jeevan
              <span className="block text-[var(--ljka-gold)]">
                Kalyan Association
              </span>
            </h1>

            <p className="mt-5 text-sm sm:text-base lg:text-lg leading-7 text-white/70 max-w-2xl">
              A community built on trust, humanity and collective responsibility
              — standing together to support the family of a member when they
              need it most.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--ljka-gold)] px-6 py-3.5 text-sm font-bold text-[var(--ljka-primary)] hover:bg-[#f1d993] transition shadow-lg"
              >
                Become a Member
                <FaArrowRight className="text-xs" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/vyawastha-list")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                How LJKA Works
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/55">
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-[var(--ljka-gold)]" />
                Community based
              </span>
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-[var(--ljka-gold)]" />
                Verified members
              </span>
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-[var(--ljka-gold)]" />
                Transparent process
              </span>
            </div>

          </div>
        </div>
      </section>


      {/* ================= PURPOSE ================= */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-20">

        <div className="max-w-2xl mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
            Our Purpose
          </p>

          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[var(--ljka-primary)]">
            No family should feel alone in a difficult time.
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-7 text-gray-600">
            LJKA aims to bring people together through a structured membership
            community where members can stand with one another and provide
            financial support to the family or nominee of a deceased member,
            subject to LJKA's verification process and applicable rules.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <PurposeCard
            icon={<FaUsers />}
            title="A Community"
            text="Members come together with a shared responsibility to support one another."
          />

          <PurposeCard
            icon={<FaHandsHelping />}
            title="Collective Support"
            text="When an eligible member passes away, the community can come together to provide support to the nominee."
          />

          <PurposeCard
            icon={<FaShieldAlt />}
            title="Verified Process"
            text="Reported cases and nominee claims are intended to go through an internal verification process before support is released."
          />

        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-20">

          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
              How LJKA Works
            </p>

            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[var(--ljka-primary)]">
              Simple membership. Collective responsibility.
            </h2>

            <p className="mt-4 text-sm sm:text-base text-gray-600 leading-7">
              LJKA is designed around a community model where eligible members
              participate in supporting verified cases.
            </p>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <Step
              number="01"
              title="Become a Member"
              text="Register with LJKA and provide the required information."
            />

            <Step
              number="02"
              title="Complete KYC"
              text="Complete identity and membership verification as required."
            />

            <Step
              number="03"
              title="Become Eligible"
              text="After the applicable waiting or lock-in period, membership becomes eligible according to LJKA rules."
            />

            <Step
              number="04"
              title="Support a Family"
              text="When an eligible case is verified, active members can contribute according to the applicable LJKA mechanism."
            />

          </div>


          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => navigate("/vyawastha-list")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ljka-primary)] hover:text-[var(--ljka-gold)] transition"
            >
              Understand the complete process
              <FaArrowRight className="text-xs" />
            </button>
          </div>

        </div>
      </section>


      {/* ================= 11000 INITIATIVE ================= */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-20">

        <div className="relative overflow-hidden rounded-2xl bg-[var(--ljka-primary)] text-white">

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--ljka-gold)]/10 blur-2xl" />

          <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center p-7 sm:p-10 lg:p-12">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
                Founding Membership Initiative
              </p>

              <h2 className="mt-2 text-3xl sm:text-4xl font-bold">
                First 11,000 Members
              </h2>

              <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl leading-7">
                To build the initial LJKA community, registration is currently
                planned to be free for the first 11,000 members.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--ljka-gold)] px-6 py-3.5 text-sm font-bold text-[var(--ljka-primary)] hover:bg-[#f1d993] transition whitespace-nowrap"
            >
              Register Now
              <FaArrowRight className="text-xs" />
            </button>

          </div>
        </div>

      </section>


      {/* ================= TRUST ================= */}
      <section className="bg-[#f1f3f5] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-20">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
                Built on Trust
              </p>

              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[var(--ljka-primary)]">
                Transparency matters.
              </h2>

              <p className="mt-4 text-sm sm:text-base leading-7 text-gray-600">
                LJKA's purpose is not simply to collect memberships. The
                long-term goal is to create a responsible community where
                membership, verification, contribution and nominee support are
                handled through a clear and accountable process.
              </p>
            </div>


            <div className="grid sm:grid-cols-2 gap-4">

              <TrustCard
                title="Member Verification"
                text="Identity and required membership information are verified."
              />

              <TrustCard
                title="Case Verification"
                text="Death-related claims are intended to be reviewed with required documents."
              />

              <TrustCard
                title="Nominee Verification"
                text="The nominee and required banking information can be verified before support is released."
              />

              <TrustCard
                title="Community Accountability"
                text="The system is designed around active participation and responsible membership."
              />

            </div>

          </div>

        </div>
      </section>


      {/* ================= FINAL CTA ================= */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center">

          <div className="mx-auto w-12 h-12 rounded-full bg-[var(--ljka-primary)] text-[var(--ljka-gold)] flex items-center justify-center">
            <FaHeart />
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-[var(--ljka-primary)]">
            Stand together. Support together.
          </h2>

          <p className="mt-4 text-sm sm:text-base text-gray-600 leading-7 max-w-2xl mx-auto">
            Join the LJKA community and become part of a long-term vision of
            collective support, responsibility and humanity.
          </p>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#102b45] transition shadow-sm"
          >
            Become a Member
            <FaArrowRight className="text-xs" />
          </button>

        </div>
      </section>

    </div>
  );
};


/* ================= PURPOSE CARD ================= */

const PurposeCard = ({ icon, title, text }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
    <div className="w-11 h-11 rounded-lg bg-[#f8f6ef] text-[var(--ljka-primary)] flex items-center justify-center text-lg">
      {icon}
    </div>

    <h3 className="mt-5 text-lg font-bold text-[var(--ljka-primary)]">
      {title}
    </h3>

    <p className="mt-2 text-sm leading-6 text-gray-600">
      {text}
    </p>
  </div>
);


/* ================= PROCESS STEP ================= */

const Step = ({ number, title, text }) => (
  <div className="relative bg-[#f8f9fb] border border-gray-200 rounded-xl p-6">

    <span className="text-xs font-bold tracking-wider text-[var(--ljka-gold)]">
      {number}
    </span>

    <h3 className="mt-3 text-lg font-bold text-[var(--ljka-primary)]">
      {title}
    </h3>

    <p className="mt-2 text-sm leading-6 text-gray-600">
      {text}
    </p>
  </div>
);


/* ================= TRUST CARD ================= */

const TrustCard = ({ title, text }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <div className="flex items-start gap-3">
      <FaCheckCircle className="mt-1 shrink-0 text-[var(--ljka-gold)]" />

      <div>
        <h3 className="text-sm font-bold text-[var(--ljka-primary)]">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-gray-600">
          {text}
        </p>
      </div>
    </div>
  </div>
);

export default Home;
