import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaUsers,
  FaHeart,
  FaHandHoldingHeart,
  FaShieldAlt,
  FaUserCheck,
  FaFileAlt,
  FaCheckCircle,
  FaQuoteLeft,
} from "react-icons/fa";

const AboutUs = () => {
  return (
    <main className="w-full overflow-hidden bg-[var(--ljka-bg)] text-[var(--ljka-text)]">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-[var(--ljka-primary-bg)]">

        {/* Decorative background */}
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[var(--ljka-gold)]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[var(--ljka-primary)]/5 blur-3xl" />

        <div className="relative mx-auto max-w-[1450px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">

            {/* LEFT CONTENT */}
            <div className="max-w-3xl">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--ljka-border)] bg-white px-4 py-2 shadow-sm">
                <FaHeart className="text-xs text-[var(--ljka-gold-dark)]" />

                <span className="text-xs font-semibold tracking-wide text-[var(--ljka-primary)] sm:text-sm">
                  ABOUT LAKHDAATAR JEEVAN KALYAN ASSOCIATION
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[var(--ljka-primary)] sm:text-5xl lg:text-6xl">
                A community built on
                <span className="block text-[var(--ljka-gold-dark)]">
                  trust, humanity & support.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base lg:text-lg">
                Lakhdaatar Jeevan Kalyan Association is a community-driven
                organization created with a simple belief — when people come
                together with responsibility and compassion, they can support
                one another when it matters most.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--ljka-primary)] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[var(--ljka-primary-dark)] hover:-translate-y-0.5"
                >
                  Become a Member
                  <FaArrowRight className="text-xs" />
                </Link>

                <Link
                  to="/niyamawali"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--ljka-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ljka-primary)] shadow-sm transition hover:border-[var(--ljka-border-gold)] hover:-translate-y-0.5"
                >
                  View Niyamawali
                </Link>

              </div>
            </div>


            {/* RIGHT VISUAL */}
            <div className="hidden lg:block">

              <div className="relative mx-auto max-w-md">

                <div className="absolute -inset-5 rounded-[2rem] bg-[var(--ljka-gold)]/10 blur-2xl" />

                <div className="relative rounded-[2rem] border border-[var(--ljka-border)] bg-white p-8 shadow-[var(--ljka-shadow-lg)]">

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--ljka-primary-bg)] text-xl text-[var(--ljka-primary)]">
                      <FaHandHoldingHeart />
                    </div>

                    <div>
                      <p className="text-lg font-bold text-[var(--ljka-primary)]">
                        Mutual Support
                      </p>

                      <p className="mt-1 text-sm text-[var(--ljka-muted)]">
                        Together for a stronger community
                      </p>
                    </div>

                  </div>

                  <div className="my-8 h-px bg-[var(--ljka-border-light)]" />

                  <div className="space-y-5">

                    <HeroPoint
                      icon={<FaUsers />}
                      text="A community of participating members"
                    />

                    <HeroPoint
                      icon={<FaUserCheck />}
                      text="Structured membership and verification"
                    />

                    <HeroPoint
                      icon={<FaShieldAlt />}
                      text="Responsible and transparent processes"
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          QUICK STATS
      ========================================================= */}
      <section className="relative z-10 -mt-8 px-5 sm:px-8 lg:px-12">

        <div className="mx-auto grid max-w-[1250px] overflow-hidden rounded-2xl border border-[var(--ljka-border-light)] bg-white shadow-[var(--ljka-shadow-md)] sm:grid-cols-3">

          <MiniStat
            icon={<FaUsers />}
            title="Community"
            text="People connected by a common purpose"
          />

          <MiniStat
            icon={<FaHandHoldingHeart />}
            title="Mutual Support"
            text="Standing together when support is needed"
          />

          <MiniStat
            icon={<FaShieldAlt />}
            title="Responsibility"
            text="Rules, verification and accountable processes"
          />

        </div>

      </section>


      {/* =========================================================
          WHO WE ARE
      ========================================================= */}
      <section className="bg-[var(--ljka-bg)] py-20 sm:py-24 lg:py-28">

        <div className="mx-auto grid max-w-[1450px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">

          <div>

            <SectionLabel text="WHO WE ARE" />

            <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight text-[var(--ljka-text)] sm:text-4xl lg:text-5xl">
              More than a membership.
              <span className="block text-[var(--ljka-primary)]">
                A shared responsibility.
              </span>
            </h2>

            <div className="mt-6 h-1 w-16 rounded-full bg-[var(--ljka-gold)]" />

          </div>


          <div className="rounded-3xl border border-[var(--ljka-border-light)] bg-[var(--ljka-card)] p-7 shadow-[var(--ljka-shadow-sm)] sm:p-9">

            <p className="text-base font-semibold leading-7 text-[var(--ljka-primary)] sm:text-lg">
              LJKA brings individuals together through a structured
              community-based support system.
            </p>

            <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">

              <p>
                The association is built around mutual cooperation,
                humanity and collective responsibility. Membership is not
                simply about becoming part of a list — it means participating
                in a community where every member has a role to play.
              </p>

              <p>
                In eligible situations, the community can come together to
                provide voluntary financial assistance to the family or
                registered nominee of a member, subject to the organization's
                rules, verification and eligibility requirements.
              </p>

              <p>
                Alongside mutual support, LJKA also seeks to contribute to
                wider social welfare activities and initiatives that benefit
                society.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          OUR PURPOSE
      ========================================================= */}
      <section className="bg-white py-20 sm:py-24 lg:py-28">

        <div className="mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

          <div className="mx-auto max-w-3xl text-center">

            <SectionLabel text="OUR PURPOSE" centered />

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--ljka-text)] sm:text-4xl lg:text-5xl">
              Why LJKA exists
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
              The strength of a community is measured not only by how many
              people belong to it, but by how responsibly those people stand
              together.
            </p>

          </div>


          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <PurposeCard
              number="01"
              icon={<FaHeart />}
              title="Humanity"
              text="To create a community where compassion and concern for one another remain at the heart of participation."
            />

            <PurposeCard
              number="02"
              icon={<FaHandHoldingHeart />}
              title="Mutual Support"
              text="To facilitate community-based voluntary assistance for eligible members and their registered beneficiaries."
            />

            <PurposeCard
              number="03"
              icon={<FaUsers />}
              title="Social Welfare"
              text="To participate in meaningful welfare initiatives that can contribute toward a better and more supportive society."
            />

          </div>

        </div>

      </section>


      {/* =========================================================
          OUR APPROACH
      ========================================================= */}
      <section className="bg-[var(--ljka-primary-bg)] py-20 sm:py-24 lg:py-28">

        <div className="mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">

            <div>

              <SectionLabel text="OUR APPROACH" />

              <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--ljka-text)] sm:text-4xl lg:text-5xl">
                Simple for members.
                <span className="block text-[var(--ljka-primary)]">
                  Responsible for everyone.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
                LJKA follows a defined process so that membership,
                participation and support cases are handled with clarity.
              </p>

            </div>


            <div className="rounded-3xl border border-[var(--ljka-border-light)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">

              <ProcessStep
                number="01"
                icon={<FaUserCheck />}
                title="Become a Member"
                text="Register with the required information and complete the prescribed membership process."
              />

              <ProcessStep
                number="02"
                icon={<FaFileAlt />}
                title="Complete Verification"
                text="Required personal information and documents are reviewed as part of the organization's verification process."
              />

              <ProcessStep
                number="03"
                icon={<FaUsers />}
                title="Participate"
                text="Members participate in the community support system according to the applicable rules."
              />

              <ProcessStep
                number="04"
                icon={<FaHandHoldingHeart />}
                title="Support Eligible Cases"
                text="When an eligible case arises, members may contribute voluntarily through the official process."
                last
              />

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          TRUST / TRANSPARENCY
      ========================================================= */}
      <section className="bg-white py-20 sm:py-24 lg:py-28">

        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">

          <div className="overflow-hidden rounded-3xl border border-[var(--ljka-border-light)] bg-[var(--ljka-bg)] shadow-[var(--ljka-shadow-md)]">

            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">

              {/* LEFT */}
              <div className="relative overflow-hidden bg-[var(--ljka-primary-bg)] p-8 sm:p-10 lg:p-12">

                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[var(--ljka-gold)]/10 blur-2xl" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-[var(--ljka-primary)] shadow-sm">
                  <FaShieldAlt />
                </div>

                <h3 className="relative mt-7 text-2xl font-bold text-[var(--ljka-primary)] sm:text-3xl">
                  Trust needs
                  <span className="block text-[var(--ljka-gold-dark)]">
                    transparency.
                  </span>
                </h3>

                <p className="relative mt-5 text-sm leading-7 text-[var(--ljka-muted)]">
                  Our processes are designed around clear rules, proper
                  verification and responsible handling of member information
                  and support cases.
                </p>

              </div>


              {/* RIGHT */}
              <div className="bg-white p-8 sm:p-10 lg:p-12">

                <div className="space-y-6">

                  <TrustPoint
                    title="Clear Rules"
                    text="Membership and support are governed by defined rules and procedures."
                  />

                  <TrustPoint
                    title="Verification"
                    text="Support claims require appropriate documentation and verification before final processing."
                  />

                  <TrustPoint
                    title="Official Channels"
                    text="Members are encouraged to use only the official payment and communication channels published by LJKA."
                  />

                  <TrustPoint
                    title="Member Privacy"
                    text="Personal information is used for legitimate organizational purposes such as membership management, verification and claim processing."
                  />

                </div>

                <Link
                  to="/niyamawali"
                  className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--ljka-primary)]"
                >
                  Read the complete Niyamawali
                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          IMPORTANT NOTE
      ========================================================= */}
      <section className="bg-[var(--ljka-bg)] py-16 sm:py-20">

        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">

          <div className="relative rounded-3xl border border-[var(--ljka-border)] bg-white p-7 shadow-[var(--ljka-shadow-sm)] sm:p-10">

            <FaQuoteLeft className="absolute right-7 top-7 text-3xl text-[var(--ljka-gold)]/20 sm:right-10 sm:top-10" />

            <SectionLabel text="IMPORTANT TO UNDERSTAND" />

            <h3 className="mt-4 max-w-2xl text-2xl font-bold text-[var(--ljka-primary)] sm:text-3xl">
              LJKA is based on mutual community support.
            </h3>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
              The association's death-assistance mechanism is based on mutual
              voluntary community support. It is not an insurance policy,
              investment scheme or guaranteed death-benefit plan. Assistance
              depends on eligibility, verification, member participation,
              actual contributions received and the applicable organizational
              rules.
            </p>

            <Link
              to="/niyamawali"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[var(--ljka-border)] bg-[var(--ljka-primary-bg)] px-5 py-3 text-sm font-semibold text-[var(--ljka-primary)] transition hover:border-[var(--ljka-border-gold)]"
            >
              Understand the Rules
              <FaArrowRight className="text-xs" />
            </Link>

          </div>

        </div>

      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-[var(--ljka-gradient-soft)]">

        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[var(--ljka-primary)]/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-[var(--ljka-gold)]/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1450px] px-5 py-20 text-center sm:px-8 sm:py-24 lg:px-12">

          <div className="mx-auto h-1 w-16 rounded-full bg-[var(--ljka-gold)]" />

          <h2 className="mx-auto mt-7 max-w-3xl text-3xl font-bold leading-tight text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">
            Be a part of a community
            <span className="block text-[var(--ljka-gold-dark)]">
              built on humanity.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
            Learn about LJKA, understand the rules and become part of a
            community that believes in standing together.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--ljka-primary)] px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[var(--ljka-primary-dark)] hover:-translate-y-0.5"
            >
              Join LJKA
              <FaArrowRight className="text-xs" />
            </Link>

            <Link
              to="/user-list"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--ljka-border)] bg-white px-6 py-3.5 text-sm font-semibold text-[var(--ljka-primary)] shadow-sm transition hover:border-[var(--ljka-border-gold)] hover:-translate-y-0.5"
            >
              View Members
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
};


/* =============================================================
   COMPONENTS
============================================================= */

const SectionLabel = ({ text, centered = false }) => (
  <div
    className={`inline-flex items-center gap-2 ${
      centered ? "justify-center" : ""
    }`}
  >
    <span className="h-2 w-2 rounded-full bg-[var(--ljka-gold)]" />

    <span className="text-xs font-bold tracking-[0.18em] text-[var(--ljka-primary)]">
      {text}
    </span>
  </div>
);


const HeroPoint = ({ icon, text }) => (
  <div className="flex items-center gap-4">

    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--ljka-primary-bg)] text-sm text-[var(--ljka-primary)]">
      {icon}
    </div>

    <p className="text-sm text-[var(--ljka-text)]">
      {text}
    </p>

  </div>
);


const MiniStat = ({ icon, title, text }) => (
  <div className="flex items-center gap-4 p-5 sm:p-6">

    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
      {icon}
    </div>

    <div>
      <h3 className="text-sm font-bold text-[var(--ljka-primary)]">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-[var(--ljka-muted)]">
        {text}
      </p>
    </div>

  </div>
);


const PurposeCard = ({ number, icon, title, text }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-[var(--ljka-border-light)] bg-[var(--ljka-card)] p-7 shadow-[var(--ljka-shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--ljka-shadow-md)]">

    <span className="absolute right-6 top-5 text-5xl font-black text-[var(--ljka-primary)]/[0.04]">
      {number}
    </span>

    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--ljka-primary-bg)] text-lg text-[var(--ljka-primary)] transition group-hover:bg-[var(--ljka-primary)] group-hover:text-white">
      {icon}
    </div>

    <h3 className="mt-6 text-xl font-bold text-[var(--ljka-primary)]">
      {title}
    </h3>

    <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
      {text}
    </p>

  </div>
);


const ProcessStep = ({
  number,
  icon,
  title,
  text,
  last = false,
}) => (
  <div
    className={`flex gap-5 ${
      !last
        ? "mb-7 border-b border-[var(--ljka-border-light)] pb-7"
        : ""
    }`}
  >

    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--ljka-primary-bg)] text-sm text-[var(--ljka-primary)]">
      {icon}
    </div>

    <div className="flex-1">

      <div className="flex items-center gap-3">

        <span className="text-[10px] font-bold tracking-widest text-[var(--ljka-gold-dark)]">
          {number}
        </span>

        <h3 className="text-base font-bold text-[var(--ljka-primary)] sm:text-lg">
          {title}
        </h3>

      </div>

      <p className="mt-2 text-sm leading-6 text-[var(--ljka-muted)]">
        {text}
      </p>

    </div>

  </div>
);


const TrustPoint = ({ title, text }) => (
  <div className="flex gap-4">

    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--ljka-gold-light)] text-xs text-[var(--ljka-primary)]">
      <FaCheckCircle />
    </div>

    <div>

      <h4 className="text-sm font-bold text-[var(--ljka-primary)]">
        {title}
      </h4>

      <p className="mt-1 text-sm leading-6 text-[var(--ljka-muted)]">
        {text}
      </p>

    </div>

  </div>
);


export default AboutUs;


// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   FaArrowRight,
//   FaUsers,
//   FaHeart,
//   FaHandHoldingHeart,
//   FaShieldAlt,
//   FaUserCheck,
//   FaFileAlt,
//   FaCheckCircle,
//   FaQuoteLeft,
// } from "react-icons/fa";

// const AboutUs = () => {
//   return (
//     <main className="w-full overflow-hidden bg-[var(--ljka-bg)] text-[var(--ljka-text)]">

//       {/* =========================================================
//           HERO
//       ========================================================= */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-[var(--ljka-primary)] via-[#123452] to-[#071d32] text-white">

//         {/* decorative elements */}
//         <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[var(--ljka-gold)]/10 blur-3xl" />
//         <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

//         <div className="relative mx-auto max-w-[1450px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">

//           <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">

//             {/* left */}
//             <div className="max-w-3xl">

//               <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/30 bg-white/5 px-4 py-2 backdrop-blur-sm">
//                 <FaHeart className="text-xs text-[var(--ljka-gold)]" />
//                 <span className="text-xs font-semibold tracking-wide text-white/85 sm:text-sm">
//                   ABOUT LAKHDAATAR JEEVAN KALYAN ASSOCIATION
//                 </span>
//               </div>

//               <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
//                 A community built on
//                 <span className="block text-[var(--ljka-gold)]">
//                   trust, humanity & support.
//                 </span>
//               </h1>

//               <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base lg:text-lg">
//                 Lakhdaatar Jeevan Kalyan Association is a community-driven
//                 organization created with a simple belief — when people come
//                 together with responsibility and compassion, they can support
//                 one another when it matters most.
//               </p>

//               <div className="mt-8 flex flex-wrap gap-3">

//                 <Link
//                   to="/register"
//                   className="inline-flex items-center gap-2 rounded-xl bg-[var(--ljka-gold)] px-5 py-3 text-sm font-bold text-[var(--ljka-primary)] shadow-lg shadow-black/10 transition hover:-translate-y-0.5"
//                 >
//                   Become a Member
//                   <FaArrowRight className="text-xs" />
//                 </Link>

//                 <Link
//                   to="/niyamawali"
//                   className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
//                 >
//                   View Niyamawali
//                 </Link>

//               </div>

//             </div>


//             {/* right visual */}
//             <div className="relative hidden lg:block">

//               <div className="relative mx-auto max-w-md">

//                 <div className="absolute -inset-4 rounded-[2rem] bg-[var(--ljka-gold)]/10 blur-2xl" />

//                 <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-md">

//                   <div className="flex items-center gap-4">

//                     <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--ljka-gold)] text-xl text-[var(--ljka-primary)]">
//                       <FaHandHoldingHeart />
//                     </div>

//                     <div>
//                       <p className="text-lg font-bold">
//                         Mutual Support
//                       </p>

//                       <p className="mt-1 text-sm text-white/55">
//                         Together for a stronger community
//                       </p>
//                     </div>

//                   </div>

//                   <div className="my-8 h-px bg-white/10" />

//                   <div className="space-y-5">

//                     <HeroPoint
//                       icon={<FaUsers />}
//                       text="A community of participating members"
//                     />

//                     <HeroPoint
//                       icon={<FaUserCheck />}
//                       text="Structured membership and verification"
//                     />

//                     <HeroPoint
//                       icon={<FaShieldAlt />}
//                       text="Responsible and transparent processes"
//                     />

//                   </div>

//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>
//       </section>


//       {/* =========================================================
//           QUICK STATS / IDENTITY
//       ========================================================= */}
//       <section className="relative z-10 -mt-8 px-5 sm:px-8 lg:px-12">

//         <div className="mx-auto grid max-w-[1250px] overflow-hidden rounded-2xl border border-[var(--ljka-border-light)] bg-white shadow-xl shadow-black/5 sm:grid-cols-3">

//           <MiniStat
//             icon={<FaUsers />}
//             title="Community"
//             text="People connected by a common purpose"
//           />

//           <MiniStat
//             icon={<FaHandHoldingHeart />}
//             title="Mutual Support"
//             text="Standing together when support is needed"
//           />

//           <MiniStat
//             icon={<FaShieldAlt />}
//             title="Responsibility"
//             text="Rules, verification and accountable processes"
//           />

//         </div>

//       </section>


//       {/* =========================================================
//           WHO WE ARE
//       ========================================================= */}
//       <section className="bg-[var(--ljka-bg)] py-20 sm:py-24 lg:py-28">

//         <div className="mx-auto grid max-w-[1450px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">

//           <div>

//             <SectionLabel text="WHO WE ARE" />

//             <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
//               More than a membership.
//               <span className="block text-[var(--ljka-primary)]">
//                 A shared responsibility.
//               </span>
//             </h2>

//             <div className="mt-6 h-1 w-16 rounded-full bg-[var(--ljka-gold)]" />

//           </div>


//           <div className="rounded-3xl border border-[var(--ljka-border-light)] bg-white p-7 shadow-sm sm:p-9">

//             <p className="text-base font-semibold leading-7 text-[var(--ljka-primary)] sm:text-lg">
//               LJKA brings individuals together through a structured
//               community-based support system.
//             </p>

//             <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">

//               <p>
//                 The association is built around mutual cooperation,
//                 humanity and collective responsibility. Membership is not
//                 simply about becoming part of a list — it means participating
//                 in a community where every member has a role to play.
//               </p>

//               <p>
//                 In eligible situations, the community can come together to
//                 provide voluntary financial assistance to the family or
//                 registered nominee of a member, subject to the organization's
//                 rules, verification and eligibility requirements.
//               </p>

//               <p>
//                 Alongside mutual support, LJKA also seeks to contribute to
//                 wider social welfare activities and initiatives that benefit
//                 society.
//               </p>

//             </div>

//           </div>

//         </div>

//       </section>


//       {/* =========================================================
//           OUR PURPOSE
//       ========================================================= */}
//       <section className="bg-white py-20 sm:py-24 lg:py-28">

//         <div className="mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

//           <div className="mx-auto max-w-3xl text-center">

//             <SectionLabel text="OUR PURPOSE" centered />

//             <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
//               Why LJKA exists
//             </h2>

//             <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
//               The strength of a community is measured not only by how many
//               people belong to it, but by how responsibly those people stand
//               together.
//             </p>

//           </div>


//           <div className="mt-14 grid gap-6 md:grid-cols-3">

//             <PurposeCard
//               number="01"
//               icon={<FaHeart />}
//               title="Humanity"
//               text="To create a community where compassion and concern for one another remain at the heart of participation."
//             />

//             <PurposeCard
//               number="02"
//               icon={<FaHandHoldingHeart />}
//               title="Mutual Support"
//               text="To facilitate community-based voluntary assistance for eligible members and their registered beneficiaries."
//             />

//             <PurposeCard
//               number="03"
//               icon={<FaUsers />}
//               title="Social Welfare"
//               text="To participate in meaningful welfare initiatives that can contribute toward a better and more supportive society."
//             />

//           </div>

//         </div>

//       </section>


//       {/* =========================================================
//           HOW IT WORKS
//       ========================================================= */}
//       <section className="bg-[var(--ljka-bg)] py-20 sm:py-24 lg:py-28">

//         <div className="mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

//           <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">

//             <div>

//               <SectionLabel text="OUR APPROACH" />

//               <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
//                 Simple for members.
//                 <span className="block text-[var(--ljka-primary)]">
//                   Responsible for everyone.
//                 </span>
//               </h2>

//               <p className="mt-5 max-w-md text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
//                 LJKA follows a defined process so that membership,
//                 participation and support cases are handled with clarity.
//               </p>

//             </div>


//             <div className="rounded-3xl border border-[var(--ljka-border-light)] bg-white p-6 shadow-sm sm:p-8">

//               <ProcessStep
//                 number="01"
//                 icon={<FaUserCheck />}
//                 title="Become a Member"
//                 text="Register with the required information and complete the prescribed membership process."
//               />

//               <ProcessStep
//                 number="02"
//                 icon={<FaFileAlt />}
//                 title="Complete Verification"
//                 text="Required personal information and documents are reviewed as part of the organization's verification process."
//               />

//               <ProcessStep
//                 number="03"
//                 icon={<FaUsers />}
//                 title="Participate"
//                 text="Members participate in the community support system according to the applicable rules."
//               />

//               <ProcessStep
//                 number="04"
//                 icon={<FaHandHoldingHeart />}
//                 title="Support Eligible Cases"
//                 text="When an eligible case arises, members may contribute voluntarily through the official process."
//                 last
//               />

//             </div>

//           </div>

//         </div>

//       </section>


//       {/* =========================================================
//           TRANSPARENCY / TRUST
//       ========================================================= */}
//       <section className="bg-gradient-to-br from-[#ffffff] to-[#f4f7fa] py-20 sm:py-24 lg:py-28">

//         <div className="mx-auto max-w-[1200px] px-5 sm:px-8">

//           <div className="overflow-hidden rounded-3xl border border-[var(--ljka-border-light)] bg-white shadow-lg">

//             <div className="grid lg:grid-cols-[0.85fr_1.15fr]">

//               {/* colored side */}
//               <div className="relative overflow-hidden bg-gradient-to-br from-[var(--ljka-primary)] to-[#0b263d] p-8 text-white sm:p-10 lg:p-12">

//                 <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[var(--ljka-gold)]/10 blur-2xl" />

//                 <FaShieldAlt className="relative text-4xl text-[var(--ljka-gold)]" />

//                 <h3 className="relative mt-7 text-2xl font-bold sm:text-3xl">
//                   Trust needs
//                   <span className="block text-[var(--ljka-gold)]">
//                     transparency.
//                   </span>
//                 </h3>

//                 <p className="relative mt-5 text-sm leading-7 text-white/65">
//                   Our processes are designed around clear rules, proper
//                   verification and responsible handling of member information
//                   and support cases.
//                 </p>

//               </div>


//               {/* content */}
//               <div className="p-8 sm:p-10 lg:p-12">

//                 <div className="space-y-6">

//                   <TrustPoint
//                     title="Clear Rules"
//                     text="Membership and support are governed by defined rules and procedures."
//                   />

//                   <TrustPoint
//                     title="Verification"
//                     text="Support claims require appropriate documentation and verification before final processing."
//                   />

//                   <TrustPoint
//                     title="Official Channels"
//                     text="Members are encouraged to use only the official payment and communication channels published by LJKA."
//                   />

//                   <TrustPoint
//                     title="Member Privacy"
//                     text="Personal information is used for legitimate organizational purposes such as membership management, verification and claim processing."
//                   />

//                 </div>

//                 <Link
//                   to="/niyamawali"
//                   className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--ljka-primary)]"
//                 >
//                   Read the complete Niyamawali
//                   <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
//                 </Link>

//               </div>

//             </div>

//           </div>

//         </div>

//       </section>


//       {/* =========================================================
//           IMPORTANT NOTE
//       ========================================================= */}
//       <section className="bg-[var(--ljka-bg)] py-16 sm:py-20">

//         <div className="mx-auto max-w-[1100px] px-5 sm:px-8">

//           <div className="relative rounded-3xl border border-[var(--ljka-gold)]/30 bg-white p-7 shadow-sm sm:p-10">

//             <FaQuoteLeft className="absolute right-7 top-7 text-3xl text-[var(--ljka-gold)]/20 sm:right-10 sm:top-10" />

//             <SectionLabel text="IMPORTANT TO UNDERSTAND" />

//             <h3 className="mt-4 max-w-2xl text-2xl font-bold text-[var(--ljka-primary)] sm:text-3xl">
//               LJKA is based on mutual community support.
//             </h3>

//             <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
//               The association's death-assistance mechanism is based on mutual
//               voluntary community support. It is not an insurance policy,
//               investment scheme or guaranteed death-benefit plan. Assistance
//               depends on eligibility, verification, member participation,
//               actual contributions received and the applicable organizational
//               rules.
//             </p>

//             <Link
//               to="/niyamawali"
//               className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[var(--ljka-primary)]/15 bg-[var(--ljka-bg)] px-5 py-3 text-sm font-semibold text-[var(--ljka-primary)] transition hover:border-[var(--ljka-gold)]"
//             >
//               Understand the Rules
//               <FaArrowRight className="text-xs" />
//             </Link>

//           </div>

//         </div>

//       </section>


//       {/* =========================================================
//           CTA
//       ========================================================= */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-[var(--ljka-primary)] via-[#123452] to-[#071d32] text-white">

//         <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[var(--ljka-gold)]/10 blur-3xl" />
//         <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

//         <div className="relative mx-auto max-w-[1450px] px-5 py-20 text-center sm:px-8 sm:py-24 lg:px-12">

//           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
//             <img
//               src="/img/Lakhdaatar_Logo.png"
//               alt="Lakhdaatar Jeevan Kalyan Association"
//               className="h-full w-full object-contain"
//             />
//           </div>

//           <h2 className="mx-auto mt-7 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
//             Be a part of a community
//             <span className="block text-[var(--ljka-gold)]">
//               built on humanity.
//             </span>
//           </h2>

//           <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
//             Learn about LJKA, understand the rules and become part of a
//             community that believes in standing together.
//           </p>

//           <div className="mt-8 flex flex-wrap justify-center gap-3">

//             <Link
//               to="/register"
//               className="inline-flex items-center gap-2 rounded-xl bg-[var(--ljka-gold)] px-6 py-3.5 text-sm font-bold text-[var(--ljka-primary)] shadow-lg transition hover:-translate-y-0.5"
//             >
//               Join LJKA
//               <FaArrowRight className="text-xs" />
//             </Link>

//             <Link
//               to="/user-list"
//               className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
//             >
//               View Members
//             </Link>

//           </div>

//         </div>

//       </section>

//     </main>
//   );
// };


// /* =============================================================
//    SMALL COMPONENTS
// ============================================================= */

// const SectionLabel = ({ text, centered = false }) => (
//   <div
//     className={`inline-flex items-center gap-2 ${
//       centered ? "justify-center" : ""
//     }`}
//   >
//     <span className="h-2 w-2 rounded-full bg-[var(--ljka-gold)]" />

//     <span className="text-xs font-bold tracking-[0.18em] text-[var(--ljka-primary)]">
//       {text}
//     </span>
//   </div>
// );


// const HeroPoint = ({ icon, text }) => (
//   <div className="flex items-center gap-4">

//     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm text-[var(--ljka-gold)]">
//       {icon}
//     </div>

//     <p className="text-sm text-white/75">
//       {text}
//     </p>

//   </div>
// );


// const MiniStat = ({ icon, title, text }) => (
//   <div className="flex items-center gap-4 p-5 sm:p-6">

//     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--ljka-primary)]/5 text-[var(--ljka-primary)]">
//       {icon}
//     </div>

//     <div>
//       <h3 className="text-sm font-bold text-[var(--ljka-primary)]">
//         {title}
//       </h3>

//       <p className="mt-1 text-xs leading-5 text-[var(--ljka-muted)]">
//         {text}
//       </p>
//     </div>

//   </div>
// );


// const PurposeCard = ({ number, icon, title, text }) => (
//   <div className="group relative overflow-hidden rounded-2xl border border-[var(--ljka-border-light)] bg-[var(--ljka-card)] p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

//     <span className="absolute right-6 top-5 text-5xl font-black text-[var(--ljka-primary)]/[0.04]">
//       {number}
//     </span>

//     <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--ljka-primary)]/5 text-lg text-[var(--ljka-primary)] transition group-hover:bg-[var(--ljka-primary)] group-hover:text-white">
//       {icon}
//     </div>

//     <h3 className="mt-6 text-xl font-bold text-[var(--ljka-primary)]">
//       {title}
//     </h3>

//     <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
//       {text}
//     </p>

//   </div>
// );


// const ProcessStep = ({ number, icon, title, text, last = false }) => (
//   <div
//     className={`flex gap-5 ${
//       !last
//         ? "border-b border-[var(--ljka-border-light)] pb-7"
//         : ""
//     } ${!last ? "mb-7" : ""}`}
//   >

//     <div className="relative">

//       <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--ljka-primary)] text-sm text-white">
//         {icon}
//       </div>

//     </div>

//     <div className="flex-1">

//       <div className="flex items-center gap-3">

//         <span className="text-[10px] font-bold tracking-widest text-[var(--ljka-gold)]">
//           {number}
//         </span>

//         <h3 className="text-base font-bold text-[var(--ljka-primary)] sm:text-lg">
//           {title}
//         </h3>

//       </div>

//       <p className="mt-2 text-sm leading-6 text-[var(--ljka-muted)]">
//         {text}
//       </p>

//     </div>

//   </div>
// );


// const TrustPoint = ({ title, text }) => (
//   <div className="flex gap-4">

//     <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--ljka-gold)]/15 text-xs text-[var(--ljka-primary)]">
//       <FaCheckCircle />
//     </div>

//     <div>
//       <h4 className="text-sm font-bold text-[var(--ljka-primary)]">
//         {title}
//       </h4>

//       <p className="mt-1 text-sm leading-6 text-[var(--ljka-muted)]">
//         {text}
//       </p>
//     </div>

//   </div>
// );


// export default AboutUs;


// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   FaArrowRight,
//   FaHeart,
//   FaShieldAlt,
//   FaUsers,
//   FaHandshake,
// } from "react-icons/fa";

// const AboutUs = () => {
//   const values = [
//     {
//       icon: <FaHandshake />,
//       title: "Trust",
//       text: "Building a community where members can rely on one another.",
//     },
//     {
//       icon: <FaHeart />,
//       title: "Humanity",
//       text: "Standing together with families during difficult moments.",
//     },
//     {
//       icon: <FaUsers />,
//       title: "Community",
//       text: "Creating strength through collective participation.",
//     },
//     {
//       icon: <FaShieldAlt />,
//       title: "Responsibility",
//       text: "Encouraging every member to contribute towards a stronger community.",
//     },
//   ];

//   return (
//     <div className="w-full bg-[var(--ljka-bg)] text-[var(--ljka-text)]">

//       {/* ================= HERO ================= */}
//       <section className="relative overflow-hidden bg-[var(--ljka-primary)]">
//         <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--ljka-gold)]/10 blur-3xl" />
//         <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

//         <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

//           <div className="max-w-3xl">
//             <span className="inline-flex items-center rounded-full border border-[var(--ljka-gold)]/40 bg-[var(--ljka-gold)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
//               About LJKA
//             </span>

//             <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
//               Together for a
//               <span className="block text-[var(--ljka-gold)]">
//                 stronger community.
//               </span>
//             </h1>

//             <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
//               Lakhdaatar Jeevan Kalyan Association is built around a simple
//               philosophy — when members stand together, a community becomes
//               stronger and families do not have to face difficult times alone.
//             </p>
//           </div>

//         </div>

//         <div className="h-1 w-full bg-gradient-to-r from-transparent via-[var(--ljka-gold)] to-transparent" />
//       </section>


//       {/* ================= WHO WE ARE ================= */}
//       <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">

//         <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">

//           <div>
//             <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
//               Who We Are
//             </p>

//             <h2 className="mt-3 text-3xl font-bold text-[var(--ljka-primary)] sm:text-4xl">
//               Lakhdaatar Jeevan Kalyan Association
//             </h2>

//             <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base">
//               LJKA is envisioned as a community-based association where
//               individuals come together with a shared sense of responsibility,
//               trust and humanity.
//             </p>

//             <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
//               The idea is simple: members become part of a larger community
//               where collective participation can provide meaningful support
//               to the family of a member when an unfortunate loss occurs.
//             </p>

//             <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
//               LJKA aims to build this community first across Uttar Pradesh
//               and eventually expand its presence across India.
//             </p>
//           </div>


//           <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

//             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--ljka-primary)] text-xl text-[var(--ljka-gold)]">
//               <FaUsers />
//             </div>

//             <h3 className="mt-5 text-xl font-bold text-[var(--ljka-primary)]">
//               A community built together
//             </h3>

//             <p className="mt-3 text-sm leading-6 text-gray-500">
//               Every member represents one part of a larger community.
//               Together, those individual members create the strength needed
//               to support one another.
//             </p>

//             <div className="mt-6 h-px bg-gray-100" />

//             <p className="mt-5 text-sm font-semibold text-[var(--ljka-primary)]">
//               Help · Trust · Humanity
//             </p>

//           </div>

//         </div>
//       </section>


//       {/* ================= PURPOSE ================= */}
//       <section className="bg-white border-y border-gray-100">

//         <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">

//           <div className="max-w-2xl">
//             <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
//               Our Purpose
//             </p>

//             <h2 className="mt-3 text-3xl font-bold text-[var(--ljka-primary)] sm:text-4xl">
//               One community. One responsibility.
//             </h2>

//             <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base">
//               LJKA seeks to create a structured community where members can
//               collectively stand beside the family of a deceased member,
//               subject to the association's applicable rules, verification
//               process and eligibility conditions.
//             </p>
//           </div>


//           <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

//             {values.map((item) => (
//               <div
//                 key={item.title}
//                 className="group rounded-xl border border-gray-200 bg-[var(--ljka-bg)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--ljka-gold)]/40 hover:shadow-md"
//               >

//                 <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--ljka-primary)] text-[var(--ljka-gold)]">
//                   {item.icon}
//                 </div>

//                 <h3 className="mt-4 font-bold text-[var(--ljka-primary)]">
//                   {item.title}
//                 </h3>

//                 <p className="mt-2 text-sm leading-6 text-gray-500">
//                   {item.text}
//                 </p>

//               </div>
//             ))}

//           </div>

//         </div>
//       </section>


//       {/* ================= HOW WE SEE THE COMMUNITY ================= */}
//       <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">

//         <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

//           <div className="rounded-2xl bg-[var(--ljka-primary)] p-7 text-white sm:p-9">

//             <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
//               Our Philosophy
//             </p>

//             <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
//               When one family needs support,
//               <span className="block text-[var(--ljka-gold)]">
//                 the community stands together.
//               </span>
//             </h2>

//             <p className="mt-5 text-sm leading-7 text-white/65">
//               LJKA is based on the belief that collective responsibility can
//               create a meaningful support system. The strength of the
//               association comes from its members and their willingness to
//               participate in the community.
//             </p>

//           </div>


//           <div>

//             <div className="space-y-7">

//               {[
//                 ["01", "Become part of the community", "Individuals join LJKA and become members of a growing community."],
//                 ["02", "Build collective strength", "A larger and responsible membership creates a stronger support network."],
//                 ["03", "Support when it matters", "When an eligible unfortunate event occurs, the community can stand beside the affected family according to LJKA rules."],
//               ].map(([number, title, text]) => (
//                 <div key={number} className="flex gap-4">

//                   <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--ljka-gold)]/40 text-xs font-bold text-[var(--ljka-gold)]">
//                     {number}
//                   </div>

//                   <div>
//                     <h3 className="font-bold text-[var(--ljka-primary)]">
//                       {title}
//                     </h3>

//                     <p className="mt-1 text-sm leading-6 text-gray-500">
//                       {text}
//                     </p>
//                   </div>

//                 </div>
//               ))}

//             </div>

//           </div>

//         </div>
//       </section>


//       {/* ================= VISION ================= */}
//       <section className="border-y border-gray-100 bg-[#f4f6f8]">

//         <div className="mx-auto max-w-7xl px-5 py-14 text-center sm:px-6 sm:py-18 lg:px-8 lg:py-20">

//           <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
//             Our Vision
//           </p>

//           <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">
//             From a local community to a nationwide network.
//           </h2>

//           <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
//             LJKA is intended to grow from its roots in Uttar Pradesh into a
//             wider community across India, bringing together people who believe
//             in mutual support and collective responsibility.
//           </p>

//           <div className="mx-auto mt-8 h-px max-w-md bg-gradient-to-r from-transparent via-[var(--ljka-gold)] to-transparent" />

//           <p className="mt-6 text-sm font-semibold text-[var(--ljka-primary)]">
//             Uttar Pradesh&nbsp;&nbsp;→&nbsp;&nbsp;India
//           </p>

//         </div>
//       </section>

//     </div>
//   );
// };

// export default AboutUs;

