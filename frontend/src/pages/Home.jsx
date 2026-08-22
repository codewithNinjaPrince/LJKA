import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaUsers,
  FaUserCheck,
  FaFileAlt,
  FaHandHoldingHeart,
  FaShieldAlt,
  FaCheckCircle,
  FaHeart,
  FaLock,
  FaStar,
} from "react-icons/fa";

import HeroCarousel from "../components/HeroCarousel";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="w-full overflow-hidden bg-[var(--ljka-bg)] text-[var(--ljka-text)]">

      <HeroCarousel />

      {/* =========================================================
          QUICK ACTIONS
          ========================================================= */}

      <section className="relative z-20 border-b border-[var(--ljka-border-light)] bg-white">
        <div className="mx-auto grid max-w-[1450px] divide-y divide-[var(--ljka-border-light)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">

          <QuickAction
            icon={<FaUsers />}
            title="Join LJKA"
            text="Start your membership journey"
            onClick={() => navigate("/register")}
          />

          <QuickAction
            icon={<FaHandHoldingHeart />}
            title="Explore Sahyog"
            text="Understand collective support"
            onClick={() => navigate("/sahyog-list")}
          />

          <QuickAction
            icon={<FaFileAlt />}
            title="View Niyamawali"
            text="Know the rules and process"
            onClick={() => navigate("/niyamawali")}
          />

        </div>
      </section>


      {/* =========================================================
          ABOUT LJKA
          ========================================================= */}

      <section className="bg-[var(--ljka-bg)] py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-[1450px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">

          <div>
            <SectionLabel text="ABOUT LJKA" />

            <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight text-[var(--ljka-text)] sm:text-4xl lg:text-5xl">
              A community built around
              <span className="block text-[var(--ljka-primary)]">
                people and responsibility.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
              Lakhdaatar Jeevan Kalyan Association aims to bring people
              together through a structured community where membership,
              verification and collective support are handled responsibly.
            </p>

            <button
              type="button"
              onClick={() => navigate("/about")}
              className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-[var(--ljka-primary)] transition hover:text-[var(--ljka-primary-dark)]"
            >
              Learn more about LJKA
              <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
            </button>
          </div>


          {/* RIGHT INFO PANEL */}

          <div className="rounded-[28px] border border-[var(--ljka-border)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] sm:p-8">

            <div className="grid gap-4">

              <InfoRow
                icon={<FaUserCheck />}
                title="Verified Membership"
                text="Member information is intended to be reviewed through a structured process."
              />

              <InfoRow
                icon={<FaShieldAlt />}
                title="Responsible Verification"
                text="Required information and documents can be reviewed before important support decisions."
              />

              <InfoRow
                icon={<FaHandHoldingHeart />}
                title="Collective Support"
                text="Eligible cases can move through a responsible community support process."
              />

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          HOW LJKA WORKS
          ========================================================= */}

      <section className="border-y border-[var(--ljka-border-light)] bg-white py-20 sm:py-24">

        <div className="mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

          <div className="max-w-2xl">
            <SectionLabel text="HOW IT WORKS" />

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--ljka-text)] sm:text-4xl">
              A simple and responsible process.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
              From becoming a member to participating in the LJKA community,
              the focus remains on clarity, responsibility and trust.
            </p>
          </div>


          <div className="mt-12 grid gap-5 md:grid-cols-3">

            <ProcessCard
              number="01"
              icon={<FaUsers />}
              title="Become a Member"
              text="Register and complete the required membership information."
            />

            <ProcessCard
              number="02"
              icon={<FaUserCheck />}
              title="Complete Verification"
              text="Required information is reviewed through the appropriate process."
            />

            <ProcessCard
              number="03"
              icon={<FaHeart />}
              title="Be Part of the Community"
              text="Participate responsibly in the LJKA community and its initiatives."
            />

          </div>

        </div>

      </section>


      {/* =========================================================
          11,000 MEMBERS
          ========================================================= */}

      <section className="bg-[var(--ljka-bg)] py-20 sm:py-24 lg:py-28">

        <div className="mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

          <div className="overflow-hidden rounded-[30px] border border-[var(--ljka-border)] bg-white shadow-[var(--ljka-shadow-sm)]">

            <div className="grid items-center lg:grid-cols-[1.2fr_.8fr]">

              {/* CONTENT */}

              <div className="p-7 sm:p-10 lg:p-14">

                <div className="inline-flex items-center gap-2 rounded-full bg-[var(--ljka-gold-light)]/60 px-3 py-1.5">
                  <FaStar className="text-[10px] text-[var(--ljka-gold-dark)]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--ljka-text)]">
                    Founding Membership Initiative
                  </span>
                </div>

                <h2 className="mt-6 text-4xl font-bold tracking-tight text-[var(--ljka-text)] sm:text-5xl">
                  First
                  <span className="text-[var(--ljka-primary)]"> 11,000 Members</span>
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
                  Registration is currently free for the first 11,000 members
                  as LJKA begins building its initial responsible community.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="group mt-7 inline-flex items-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--ljka-primary-dark)]"
                >
                  Become a Member
                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </button>

              </div>


              {/* NUMBER PANEL */}

              <div className="relative flex min-h-[280px] items-center justify-center border-t border-[var(--ljka-border-light)] bg-[var(--ljka-primary-bg)] p-8 lg:min-h-[400px] lg:border-l lg:border-t-0">

                <div className="absolute h-52 w-52 rounded-full border border-[var(--ljka-gold)]/30" />

                <div className="absolute h-72 w-72 rounded-full border border-[var(--ljka-primary)]/10" />

                <div className="relative text-center">

                  <p className="text-6xl font-bold tracking-tighter text-[var(--ljka-primary)] sm:text-7xl">
                    11K
                  </p>

                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--ljka-muted)]">
                    Founding Members
                  </p>

                  <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[var(--ljka-gold)]" />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          TRUST & RESPONSIBILITY
          ========================================================= */}

      <section className="bg-white py-20 sm:py-24">

        <div className="mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">

            <div>

              <SectionLabel text="TRUST & RESPONSIBILITY" />

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--ljka-text)] sm:text-4xl">
                Built with a responsible approach.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
                Important membership and support-related processes are designed
                around review, verification and community accountability.
              </p>

              <div className="mt-7 inline-flex items-center gap-3 rounded-xl border border-[var(--ljka-border)] bg-[var(--ljka-bg)] px-4 py-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
                  <FaLock />
                </div>

                <div>
                  <p className="text-xs font-bold text-[var(--ljka-text)]">
                    Responsible process
                  </p>

                  <p className="mt-0.5 text-[10px] text-[var(--ljka-muted)]">
                    Verification before important support decisions
                  </p>
                </div>

              </div>

            </div>


            <div className="grid gap-4 sm:grid-cols-2">

              <TrustCard
                icon={<FaUserCheck />}
                title="Member Verification"
                text="Membership information can be reviewed through the required process."
              />

              <TrustCard
                icon={<FaFileAlt />}
                title="Document Review"
                text="Required documents can be reviewed for relevant cases."
              />

              <TrustCard
                icon={<FaShieldAlt />}
                title="Nominee Verification"
                text="Relevant nominee and banking details can be checked before release."
              />

              <TrustCard
                icon={<FaCheckCircle />}
                title="Clear Process"
                text="The focus remains on responsible handling and accountability."
              />

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          FINAL CTA
          ========================================================= */}

      <section className="bg-[var(--ljka-bg)] py-20 sm:py-24 lg:py-28">

        <div className="mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

          <div className="relative overflow-hidden rounded-[30px] border border-[var(--ljka-border)] bg-[var(--ljka-primary-bg)] px-6 py-14 text-center sm:px-10 sm:py-16">

            <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[var(--ljka-gold)]/10 blur-3xl" />

            <div className="relative mx-auto max-w-2xl">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-lg text-[var(--ljka-primary)] shadow-[var(--ljka-shadow-sm)]">
                <FaHeart />
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight text-[var(--ljka-text)] sm:text-4xl">
                Become part of the
                <span className="block text-[var(--ljka-primary)]">
                  LJKA community.
                </span>
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
                Join a growing community focused on responsibility, collective
                support and a better future together.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--ljka-primary-dark)]"
                >
                  Become a Member
                  <FaArrowRight />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/about")}
                  className="inline-flex items-center justify-center rounded-lg border border-[var(--ljka-border)] bg-white px-5 py-3 text-sm font-bold text-[var(--ljka-text)] transition hover:border-[var(--ljka-primary)] hover:text-[var(--ljka-primary)]"
                >
                  Learn More
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};


/* =============================================================
   REUSABLE COMPONENTS
   ============================================================= */

const SectionLabel = ({ text }) => (
  <div className="flex items-center gap-2">
    <span className="h-1.5 w-1.5 rounded-full bg-[var(--ljka-gold)]" />
    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ljka-primary)]">
      {text}
    </span>
  </div>
);


const QuickAction = ({ icon, title, text, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-center gap-4 px-5 py-6 text-left transition hover:bg-[var(--ljka-primary-bg)] sm:px-7"
  >
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)] transition group-hover:bg-[var(--ljka-primary)] group-hover:text-white">
      {icon}
    </div>

    <div className="min-w-0">
      <p className="text-sm font-bold text-[var(--ljka-text)]">
        {title}
      </p>

      <p className="mt-1 text-xs text-[var(--ljka-muted)]">
        {text}
      </p>
    </div>

    <FaArrowRight className="ml-auto shrink-0 text-xs text-[var(--ljka-gold)] transition-transform group-hover:translate-x-1" />
  </button>
);


const InfoRow = ({ icon, title, text }) => (
  <div className="flex gap-4 rounded-2xl border border-[var(--ljka-border-light)] p-4 transition hover:border-[var(--ljka-border)] hover:shadow-[var(--ljka-shadow-sm)]">

    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
      {icon}
    </div>

    <div>
      <h3 className="text-sm font-bold text-[var(--ljka-text)]">
        {title}
      </h3>

      <p className="mt-1.5 text-xs leading-6 text-[var(--ljka-muted)]">
        {text}
      </p>
    </div>

  </div>
);


const ProcessCard = ({ number, icon, title, text }) => (
  <div className="group rounded-[22px] border border-[var(--ljka-border-light)] bg-[var(--ljka-bg)] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[var(--ljka-shadow-md)]">

    <div className="flex items-center justify-between">

      <span className="text-xs font-bold text-[var(--ljka-gold-dark)]">
        {number}
      </span>

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[var(--ljka-primary)] shadow-sm transition group-hover:bg-[var(--ljka-primary)] group-hover:text-white">
        {icon}
      </div>

    </div>

    <h3 className="mt-6 text-lg font-bold text-[var(--ljka-text)]">
      {title}
    </h3>

    <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
      {text}
    </p>

  </div>
);


const TrustCard = ({ icon, title, text }) => (
  <div className="group rounded-[22px] border border-[var(--ljka-border-light)] bg-[var(--ljka-bg)] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[var(--ljka-shadow-sm)]">

    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[var(--ljka-primary)] shadow-sm">
      {icon}
    </div>

    <h3 className="mt-5 text-sm font-bold text-[var(--ljka-text)]">
      {title}
    </h3>

    <p className="mt-2 text-xs leading-6 text-[var(--ljka-muted)]">
      {text}
    </p>

  </div>
);


export default Home;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { FaArrowRight, FaUsers, FaShieldAlt, FaHandsHelping, FaHeart, FaCheckCircle, FaUserCheck, FaFileAlt, FaHandHoldingHeart, FaLock, FaStar, FaFingerprint, FaGlobeAsia, FaBalanceScale, FaQuoteLeft } from "react-icons/fa";
// import HeroCarousel from "../components/HeroCarousel";

// const Home = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="relative w-full overflow-hidden bg-[var(--ljka-bg)] text-[var(--ljka-text)]">

//       <style>{`
//         @keyframes ljka-float {
//           0%, 100% { transform: translate3d(0, 0, 0); }
//           50% { transform: translate3d(0, -12px, 0); }
//         }

//         @keyframes ljka-float-reverse {
//           0%, 100% { transform: translate3d(0, 0, 0); }
//           50% { transform: translate3d(0, 12px, 0); }
//         }

//         @keyframes ljka-float-rotate {
//           0%, 100% { transform: translateY(0) rotate(0deg); }
//           50% { transform: translateY(-10px) rotate(3deg); }
//         }

//         @keyframes ljka-pulse {
//           0%, 100% { transform: scale(1); opacity: .45; }
//           50% { transform: scale(1.12); opacity: .75; }
//         }

//         @keyframes ljka-pulse-soft {
//           0%, 100% { box-shadow: 0 0 0 0 rgba(201,154,36,.18); }
//           50% { box-shadow: 0 0 0 10px rgba(201,154,36,0); }
//         }

//         @keyframes ljka-slide-up {
//           from { opacity: 0; transform: translateY(25px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @keyframes ljka-shine {
//           0% { transform: translateX(-140%); }
//           55%, 100% { transform: translateX(140%); }
//         }

//         @keyframes ljka-orbit {
//           from { transform: rotate(0deg) translateX(8px) rotate(0deg); }
//           to { transform: rotate(360deg) translateX(8px) rotate(-360deg); }
//         }

//         @keyframes ljka-border-flow {
//           0% { background-position: 0% 50%; }
//           100% { background-position: 200% 50%; }
//         }

//         @keyframes ljka-breathe {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.035); }
//         }

//         @keyframes ljka-number {
//           0%, 100% { opacity: .12; }
//           50% { opacity: .22; }
//         }

//         .ljka-float { animation: ljka-float 4s ease-in-out infinite; }
//         .ljka-float-reverse { animation: ljka-float-reverse 5s ease-in-out infinite; }
//         .ljka-float-rotate { animation: ljka-float-rotate 6s ease-in-out infinite; }
//         .ljka-pulse { animation: ljka-pulse 5s ease-in-out infinite; }
//         .ljka-pulse-soft { animation: ljka-pulse-soft 3s ease-in-out infinite; }
//         .ljka-slide-up { animation: ljka-slide-up .8s ease-out both; }
//         .ljka-breathe { animation: ljka-breathe 5s ease-in-out infinite; }

//         .ljka-shine { position: relative; overflow: hidden; }
//         .ljka-shine::after { content: ""; position: absolute; inset: 0; width: 30%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent); transform: translateX(-140%); animation: ljka-shine 4s ease-in-out infinite; pointer-events: none; }

//         .ljka-flow-border {
//           background: linear-gradient(90deg, var(--ljka-primary), var(--ljka-gold), var(--ljka-danger), var(--ljka-primary));
//           background-size: 200% 100%;
//           animation: ljka-border-flow 6s linear infinite;
//         }

//         .ljka-number { animation: ljka-number 4s ease-in-out infinite; }

//         .ljka-grid {
//           background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
//           background-size: 34px 34px;
//         }

//         .ljka-light-grid {
//           background-image: linear-gradient(rgba(0,107,79,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,107,79,.045) 1px, transparent 1px);
//           background-size: 32px 32px;
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .ljka-float, .ljka-float-reverse, .ljka-float-rotate, .ljka-pulse, .ljka-pulse-soft, .ljka-slide-up, .ljka-breathe, .ljka-shine::after, .ljka-flow-border, .ljka-number { animation: none; }
//         }
//       `}</style>


//       <HeroCarousel/>

//       <section className="relative min-h-[720px] overflow-hidden bg-[var(--ljka-primary)] text-white sm:min-h-[760px] lg:min-h-[800px]">

//         <div className="absolute inset-0 ljka-grid opacity-70" />

//         <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[var(--ljka-gold)]/10 blur-3xl ljka-pulse" />

//         <div className="absolute -bottom-48 -right-32 h-[520px] w-[520px] rounded-full bg-[var(--ljka-danger)]/10 blur-3xl ljka-pulse" />

//         <div className="absolute left-[10%] top-[25%] h-2 w-2 rounded-full bg-[var(--ljka-gold)] ljka-orbit" />

//         <div className="absolute right-[12%] top-[20%] h-3 w-3 rounded-full bg-white/30 ljka-float" />

//         <div className="relative mx-auto grid max-w-[1450px] items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_.88fr] lg:px-12 lg:py-24 xl:gap-20">

//           {/* HERO CONTENT */}

//           <div className="ljka-slide-up">

//             <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/30 bg-white/[0.06] px-4 py-2 backdrop-blur-md">
//               <span className="flex h-2 w-2 rounded-full bg-[var(--ljka-gold)] ljka-pulse-soft" />
//               <FaHeart className="text-[10px] text-[var(--ljka-gold)]" />
//               <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/80 sm:text-xs">A Community Built Together</span>
//             </div>

//             <h1 className="mt-7 max-w-4xl text-[42px] font-black leading-[.98] tracking-[-.045em] sm:text-5xl md:text-6xl lg:text-[66px] xl:text-[76px]">
//               Lakhdaatar
//               <span className="block text-[var(--ljka-gold)]">Jeevan Kalyan</span>
//               <span className="block text-white/95">Association</span>
//             </h1>

//             <p className="mt-7 max-w-2xl text-sm leading-7 text-white/65 sm:text-base lg:text-lg lg:leading-8">A community built on trust, humanity and collective responsibility — standing together to support the family of an eligible member when they need it most.</p>

//             <div className="mt-8 flex flex-col gap-3 sm:flex-row">

//               <button type="button" onClick={() => navigate("/register")} className="ljka-shine group inline-flex items-center justify-center gap-3 rounded-xl bg-[var(--ljka-gold)] px-7 py-4 text-sm font-extrabold text-[var(--ljka-text)] shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[var(--ljka-gold-light)] hover:shadow-2xl">
//                 Become a Member
//                 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 transition group-hover:translate-x-1">
//                   <FaArrowRight className="text-[9px]" />
//                 </span>
//               </button>

//               <button type="button" onClick={() => navigate("/vyawastha-list")} className="group inline-flex items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.05] px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[var(--ljka-gold)]/50 hover:bg-white/[0.1]">
//                 Explore LJKA
//                 <FaArrowRight className="text-xs text-[var(--ljka-gold)] transition group-hover:translate-x-1" />
//               </button>

//             </div>

//             <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3">

//               <HeroTrust label="Community" icon={<FaUsers />} />
//               <HeroTrust label="Verified" icon={<FaShieldAlt />} />
//               <HeroTrust label="Support" icon={<FaHandsHelping />} />

//             </div>

//           </div>


//           {/* HERO VISUAL */}

//           <div className="relative mx-auto w-full max-w-[550px]">

//             <div className="absolute -inset-10 rounded-[50px] bg-[var(--ljka-gold)]/10 blur-3xl" />

//             <div className="relative rounded-[34px] border border-white/10 bg-white/[0.07] p-3 shadow-2xl backdrop-blur-xl sm:p-5">

//               <div className="rounded-[28px] bg-[var(--ljka-bg)] p-5 text-[var(--ljka-text)] sm:p-7">

//                 <div className="flex items-start justify-between">

//                   <div>
//                     <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[var(--ljka-muted)]">LJKA Community</p>
//                     <h3 className="mt-2 text-2xl font-black tracking-tight text-[var(--ljka-primary)]">Together, we support.</h3>
//                     <p className="mt-1 text-xs text-[var(--ljka-muted)]">Collective responsibility in action.</p>
//                   </div>

//                   <div className="ljka-pulse-soft flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--ljka-primary)] text-[var(--ljka-gold)] shadow-lg">
//                     <FaUsers />
//                   </div>

//                 </div>


//                 <div className="mt-6 overflow-hidden rounded-[24px] bg-[var(--ljka-mint)] p-5 sm:p-6">

//                   <div className="flex items-end justify-between">

//                     <div>
//                       <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--ljka-muted)]">Founding initiative</p>
//                       <p className="mt-1 text-5xl font-black tracking-[-.05em] text-[var(--ljka-primary)]">11K</p>
//                       <p className="mt-1 text-xs font-semibold text-[var(--ljka-muted)]">First members</p>
//                     </div>

//                     <div className="ljka-float flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[var(--ljka-gold)] text-xl text-[var(--ljka-text)] shadow-xl">
//                       <FaHeart />
//                     </div>

//                   </div>

//                   <div className="mt-6">
//                     <div className="flex justify-between text-[9px] font-bold text-[var(--ljka-muted)]">
//                       <span>Community journey</span>
//                       <span>Building together</span>
//                     </div>

//                     <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white">
//                       <div className="h-full w-[72%] rounded-full bg-[var(--ljka-primary)]" />
//                     </div>
//                   </div>

//                 </div>


//                 <div className="mt-4 grid grid-cols-3 gap-3">
//                   <MiniHeroCard icon={<FaUserCheck />} title="Members" accent="primary" />
//                   <MiniHeroCard icon={<FaShieldAlt />} title="Trust" accent="gold" />
//                   <MiniHeroCard icon={<FaHandsHelping />} title="Support" accent="danger" />
//                 </div>


//                 <div className="mt-4 rounded-2xl border border-[var(--ljka-border)] bg-white p-4">

//                   <div className="flex items-center gap-3">
//                     <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
//                       <FaCheckCircle />
//                     </div>

//                     <div>
//                       <p className="text-xs font-bold text-[var(--ljka-primary)]">Responsible community</p>
//                       <p className="mt-0.5 text-[9px] text-[var(--ljka-muted)]">Built around verification and accountability</p>
//                     </div>
//                   </div>

//                 </div>

//               </div>
//             </div>


//             {/* FLOATING BADGES */}

//             <div className="ljka-float absolute -left-3 top-14 hidden rounded-2xl border border-white/10 bg-white/[0.09] p-3 text-white shadow-2xl backdrop-blur-xl sm:block">
//               <div className="flex items-center gap-2.5">
//                 <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ljka-gold)] text-[var(--ljka-text)]">
//                   <FaHeart className="text-xs" />
//                 </span>
//                 <div>
//                   <p className="text-[9px] text-white/45">Built on</p>
//                   <p className="text-xs font-bold">Humanity</p>
//                 </div>
//               </div>
//             </div>


//             <div className="ljka-float-reverse absolute -bottom-4 right-0 hidden rounded-2xl border border-white/10 bg-white/[0.09] p-3 text-white shadow-2xl backdrop-blur-xl sm:block">
//               <div className="flex items-center gap-2.5">
//                 <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ljka-danger)] text-white">
//                   <FaShieldAlt className="text-xs" />
//                 </span>
//                 <div>
//                   <p className="text-[9px] text-white/45">Focused on</p>
//                   <p className="text-xs font-bold">Trust & Process</p>
//                 </div>
//               </div>
//             </div>

//           </div>

//         </div>


//         {/* HERO BOTTOM STRIP */}

//         <div className="relative border-t border-white/10 bg-black/10">
//           <div className="mx-auto grid max-w-[1450px] grid-cols-2 divide-x divide-white/10 px-5 py-5 sm:grid-cols-4 sm:px-8 lg:px-12">

//             <HeroStat number="11,000" label="Founding Members" />
//             <HeroStat number="01" label="Shared Mission" />
//             <HeroStat number="100%" label="Community Focus" />
//             <HeroStat number="∞" label="Togetherness" />

//           </div>
//         </div>

//       </section>


//       {/* =========================================================
//           PURPOSE
//           ========================================================= */}

//       <section className="relative overflow-hidden bg-[var(--ljka-bg)] py-20 sm:py-24 lg:py-28">

//         <div className="absolute inset-0 ljka-light-grid opacity-50" />

//         <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

//           <SectionHeading eyebrow="Our Purpose" title="No family should feel alone in a difficult time." text="LJKA aims to bring people together through a structured membership community where members can stand with one another and provide support to the family or nominee of an eligible deceased member, subject to verification and applicable LJKA rules." />


//           <div className="mt-14 grid gap-6 lg:grid-cols-3">

//             <PurposeCard number="01" icon={<FaUsers />} color="primary" title="A Strong Community" text="Members come together with a shared responsibility to support one another and create a dependable community." />

//             <PurposeCard number="02" icon={<FaHandsHelping />} color="gold" title="Collective Support" text="When an eligible member passes away, the community can come together to provide support to the verified nominee." />

//             <PurposeCard number="03" icon={<FaShieldAlt />} color="danger" title="A Verified Process" text="Reported cases and nominee claims are intended to pass through an internal verification process before support is released." />

//           </div>

//         </div>
//       </section>


//       {/* =========================================================
//           VALUES BAND
//           ========================================================= */}

//       <section className="relative overflow-hidden bg-[var(--ljka-primary)] py-16 text-white sm:py-20">

//         <div className="absolute inset-0 ljka-grid opacity-50" />

//         <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

//           <div className="grid items-center gap-10 lg:grid-cols-[.7fr_1.3fr]">

//             <div>
//               <div className="flex items-center gap-3">
//                 <span className="h-1 w-9 rounded-full bg-[var(--ljka-gold)]" />
//                 <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[var(--ljka-gold)]">What guides us</span>
//               </div>

//               <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Four values.<br />One community.</h2>

//               <p className="mt-4 max-w-md text-sm leading-7 text-white/60">The LJKA experience is designed around values that make a community stronger, more responsible and more human.</p>
//             </div>


//             <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

//               <ValueCard icon={<FaHeart />} title="Humanity" />
//               <ValueCard icon={<FaShieldAlt />} title="Trust" />
//               <ValueCard icon={<FaUsers />} title="Community" />
//               <ValueCard icon={<FaBalanceScale />} title="Responsibility" />

//             </div>

//           </div>

//         </div>
//       </section>


//       {/* =========================================================
//           HOW LJKA WORKS
//           ========================================================= */}

//       <section className="relative overflow-hidden bg-[var(--ljka-mint)] py-20 sm:py-24 lg:py-28">

//         <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[var(--ljka-gold)]/10 blur-3xl ljka-pulse" />

//         <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

//           <SectionHeading centered eyebrow="How LJKA Works" title="A simple journey built around responsibility." text="LJKA is designed around a structured community model where eligible members participate in supporting verified cases." />


//           <div className="relative mt-16">

//             <div className="absolute left-[12%] right-[12%] top-14 hidden h-px bg-gradient-to-r from-transparent via-[var(--ljka-primary)]/20 to-transparent lg:block" />

//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

//               <JourneyCard number="01" icon={<FaUsers />} title="Become a Member" text="Register with LJKA and provide the required information to begin your membership journey." />

//               <JourneyCard number="02" icon={<FaFileAlt />} title="Complete KYC" text="Complete identity and membership verification according to the applicable LJKA requirements." />

//               <JourneyCard number="03" icon={<FaUserCheck />} title="Become Eligible" text="After the applicable waiting or lock-in period, membership becomes eligible according to LJKA rules." />

//               <JourneyCard number="04" icon={<FaHandHoldingHeart />} title="Support a Family" text="When an eligible case is verified, active members can contribute according to the applicable LJKA mechanism." />

//             </div>

//           </div>


//           <div className="mt-12 text-center">
//             <button type="button" onClick={() => navigate("/vyawastha-list")} className="group inline-flex items-center gap-3 rounded-full border border-[var(--ljka-primary)]/15 bg-white px-6 py-3 text-xs font-bold text-[var(--ljka-primary)] shadow-sm transition hover:-translate-y-1 hover:border-[var(--ljka-primary)]/30 hover:shadow-md">
//               Understand the complete process
//               <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--ljka-primary-bg)] transition group-hover:translate-x-1">
//                 <FaArrowRight className="text-[9px] text-[var(--ljka-gold)]" />
//               </span>
//             </button>
//           </div>

//         </div>
//       </section>


//       {/* =========================================================
//           11,000 MEMBERS CAMPAIGN
//           ========================================================= */}

//       <section className="relative overflow-hidden bg-[var(--ljka-bg)] py-20 sm:py-24 lg:py-28">

//         <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

//           <div className="ljka-flow-border rounded-[32px] p-[1px] shadow-[var(--ljka-shadow-lg)]">

//             <div className="relative overflow-hidden rounded-[31px] bg-[var(--ljka-primary)]">

//               <div className="absolute inset-0 ljka-grid opacity-60" />

//               <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[var(--ljka-gold)]/10 blur-3xl ljka-pulse" />

//               <div className="relative grid items-center gap-12 p-7 sm:p-10 lg:grid-cols-[1fr_.65fr] lg:p-16 xl:p-20">

//                 <div>

//                   <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/30 bg-white/5 px-3 py-1.5">
//                     <FaStar className="text-[9px] text-[var(--ljka-gold)]" />
//                     <span className="text-[9px] font-bold uppercase tracking-[.18em] text-[var(--ljka-gold-light)]">Founding Membership Initiative</span>
//                   </div>

//                   <h2 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">First 11,000<br /><span className="text-[var(--ljka-gold)]">Members.</span></h2>

//                   <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">To build the initial LJKA community, registration is currently planned to be free for the first 11,000 members.</p>

//                   <div className="mt-7 flex flex-wrap gap-2">
//                     <CampaignTag text="Community" />
//                     <CampaignTag text="Responsibility" />
//                     <CampaignTag text="Humanity" />
//                     <CampaignTag text="Trust" />
//                   </div>

//                   <button type="button" onClick={() => navigate("/register")} className="ljka-shine mt-8 inline-flex items-center gap-3 rounded-xl bg-[var(--ljka-gold)] px-7 py-4 text-sm font-extrabold text-[var(--ljka-text)] shadow-xl transition hover:-translate-y-1 hover:bg-[var(--ljka-gold-light)]">
//                     Register Now
//                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10">
//                       <FaArrowRight className="text-[9px]" />
//                     </span>
//                   </button>

//                 </div>


//                 <div className="relative">

//                   <div className="ljka-float rounded-[28px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">

//                     <div className="rounded-[22px] bg-white p-6 text-[var(--ljka-text)]">

//                       <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[var(--ljka-muted)]">Our initial goal</p>

//                       <div className="mt-3 flex items-end gap-2">
//                         <span className="text-6xl font-black tracking-[-.07em] text-[var(--ljka-primary)]">11K</span>
//                         <span className="pb-2 text-sm font-bold text-[var(--ljka-muted)]">members</span>
//                       </div>

//                       <div className="mt-6 h-3 overflow-hidden rounded-full bg-[var(--ljka-primary-bg)]">
//                         <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[var(--ljka-primary)] to-[var(--ljka-gold)]" />
//                       </div>

//                       <div className="mt-6 grid grid-cols-2 gap-3">

//                         <CampaignStat value="FREE" label="Registration" />

//                         <CampaignStat value="01" label="Shared mission" />

//                       </div>

//                     </div>

//                   </div>

//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>
//       </section>


//       {/* =========================================================
//           TRUST / VERIFICATION
//           ========================================================= */}

//       <section className="relative overflow-hidden border-y border-[var(--ljka-border)] bg-white py-20 sm:py-24 lg:py-28">

//         <div className="absolute -left-48 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[var(--ljka-primary)]/5 blur-3xl" />

//         <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

//           <div className="grid items-center gap-14 lg:grid-cols-[.8fr_1.2fr]">

//             <div>

//               <div className="flex items-center gap-3">
//                 <span className="h-1 w-9 rounded-full bg-[var(--ljka-gold)]" />
//                 <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[var(--ljka-primary)]">Built on Trust</span>
//               </div>

//               <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-[var(--ljka-primary)] sm:text-5xl">Transparency<br /><span className="text-[var(--ljka-gold)]">matters.</span></h2>

//               <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">LJKA's purpose is not simply to collect memberships. The long-term goal is to create a responsible community where membership, verification, contribution and nominee support are handled through a clear and accountable process.</p>

//               <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-[var(--ljka-border)] bg-[var(--ljka-primary-bg)] p-3.5">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ljka-primary)] text-white shadow-sm">
//                   <FaLock />
//                 </div>
//                 <div>
//                   <p className="text-xs font-extrabold text-[var(--ljka-primary)]">Responsible process</p>
//                   <p className="mt-1 text-[10px] text-[var(--ljka-muted)]">Verification before support</p>
//                 </div>
//               </div>

//             </div>


//             <div className="grid gap-4 sm:grid-cols-2">

//               <TrustCard icon={<FaUserCheck />} color="primary" title="Member Verification" text="Identity and required membership information are verified." />

//               <TrustCard icon={<FaFileAlt />} color="gold" title="Case Verification" text="Death-related claims are intended to be reviewed with required documents." />

//               <TrustCard icon={<FaShieldAlt />} color="danger" title="Nominee Verification" text="The nominee and required banking information can be verified before support is released." />

//               <TrustCard icon={<FaUsers />} color="primary" title="Community Accountability" text="The system is designed around active participation and responsible membership." />

//             </div>

//           </div>

//         </div>
//       </section>


//       {/* =========================================================
//           COMMUNITY SNAPSHOT
//           ========================================================= */}

//       <section className="relative overflow-hidden bg-[var(--ljka-bg)] py-20 sm:py-24">

//         <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

//           <SectionHeading centered eyebrow="The LJKA Vision" title="More than a membership." text="A long-term community built around people, responsibility and standing together when it matters." />

//           <div className="mt-12 grid gap-5 md:grid-cols-3">

//             <VisionCard icon={<FaGlobeAsia />} title="Community First" text="Create a connected community where members understand their shared role and responsibility." />

//             <VisionCard icon={<FaFingerprint />} title="Identity & Trust" text="Build a structured environment where member and claim information can be verified responsibly." />

//             <VisionCard icon={<FaHandHoldingHeart />} title="Support When Needed" text="Create a mechanism through which eligible verified cases can receive community support." />

//           </div>

//         </div>
//       </section>


//       {/* =========================================================
//           FINAL CTA
//           ========================================================= */}

//       <section className="relative overflow-hidden bg-[var(--ljka-primary)] py-20 text-white sm:py-24 lg:py-28">

//         <div className="absolute inset-0 ljka-grid opacity-60" />

//         <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--ljka-gold)]/10 blur-3xl ljka-pulse" />

//         <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">

//           <div className="ljka-pulse-soft mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--ljka-gold)] text-xl text-[var(--ljka-text)] shadow-xl">
//             <FaHeart />
//           </div>

//           <div className="mt-7 flex items-center justify-center gap-3">
//             <span className="h-px w-10 bg-[var(--ljka-gold)]" />
//             <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[var(--ljka-gold)]">Join the community</span>
//             <span className="h-px w-10 bg-[var(--ljka-gold)]" />
//           </div>

//           <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Stand together.<br /><span className="text-[var(--ljka-gold)]">Support together.</span></h2>

//           <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">Become part of LJKA's long-term vision of collective support, responsibility and humanity.</p>

//           <button type="button" onClick={() => navigate("/register")} className="ljka-shine group mt-8 inline-flex items-center gap-3 rounded-xl bg-[var(--ljka-gold)] px-7 py-4 text-sm font-extrabold text-[var(--ljka-text)] shadow-xl transition hover:-translate-y-1 hover:bg-[var(--ljka-gold-light)] hover:shadow-2xl">
//             Become a Member
//             <span className="transition group-hover:translate-x-1">
//               <FaArrowRight className="text-xs" />
//             </span>
//           </button>

//         </div>

//       </section>

//     </div>
//   );
// };


// /* =============================================================
//    SECTION HEADING
//    ============================================================= */

// const SectionHeading = ({ eyebrow, title, text, centered = false }) => (
//   <div className={`${centered ? "mx-auto text-center" : ""} max-w-3xl`}>

//     <div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
//       <span className="h-1 w-9 rounded-full bg-[var(--ljka-gold)]" />
//       <span className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[var(--ljka-primary)]">{eyebrow}</span>
//       {centered && <span className="h-1 w-9 rounded-full bg-[var(--ljka-gold)]" />}
//     </div>

//     <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">{title}</h2>

//     <p className="mt-5 text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">{text}</p>

//   </div>
// );


// /* =============================================================
//    HERO TRUST
//    ============================================================= */

// const HeroTrust = ({ icon, label }) => (
//   <div className="group rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08]">
//     <div className="flex items-center gap-2">
//       <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[var(--ljka-gold)]">{icon}</span>
//       <span className="text-[10px] font-bold text-white/70 sm:text-xs">{label}</span>
//     </div>
//   </div>
// );


// /* =============================================================
//    HERO STAT
//    ============================================================= */

// const HeroStat = ({ number, label }) => (
//   <div className="px-3 text-center sm:px-5">
//     <p className="text-xl font-black text-[var(--ljka-gold)] sm:text-2xl">{number}</p>
//     <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-white/40 sm:text-[9px]">{label}</p>
//   </div>
// );


// /* =============================================================
//    MINI HERO CARD
//    ============================================================= */

// const MiniHeroCard = ({ icon, title, accent }) => {
//   const accentClasses = {
//     primary: "bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]",
//     gold: "bg-[var(--ljka-gold-light)]/50 text-[var(--ljka-text)]",
//     danger: "bg-red-50 text-[var(--ljka-danger)]",
//   };

//   return (
//     <div className="ljka-breathe rounded-xl border border-[var(--ljka-border)] bg-white p-3 text-center shadow-sm">
//       <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-lg ${accentClasses[accent]}`}>{icon}</div>
//       <p className="mt-2 text-[9px] font-extrabold text-[var(--ljka-text)]">{title}</p>
//     </div>
//   );
// };


// /* =============================================================
//    PURPOSE CARD
//    ============================================================= */

// const PurposeCard = ({ number, icon, color, title, text }) => {

//   const styles = {
//     primary: { icon: "bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]", line: "bg-[var(--ljka-primary)]", glow: "bg-[var(--ljka-primary)]/5" },
//     gold: { icon: "bg-[var(--ljka-gold-light)]/50 text-[var(--ljka-text)]", line: "bg-[var(--ljka-gold)]", glow: "bg-[var(--ljka-gold)]/5" },
//     danger: { icon: "bg-red-50 text-[var(--ljka-danger)]", line: "bg-[var(--ljka-danger)]", glow: "bg-[var(--ljka-danger)]/5" },
//   }[color];

//   return (
//     <div className="group relative min-h-[300px] overflow-hidden rounded-[28px] border border-[var(--ljka-border)] bg-white p-7 shadow-[var(--ljka-shadow-sm)] transition duration-500 hover:-translate-y-2 hover:shadow-[var(--ljka-shadow-lg)] sm:p-8">

//       <div className={`absolute -right-20 -top-20 h-48 w-48 rounded-full ${styles.glow} blur-3xl transition duration-500 group-hover:scale-150`} />

//       <div className="absolute right-6 top-3 text-[90px] font-black leading-none text-[var(--ljka-primary)]/[0.045] ljka-number">{number}</div>

//       <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${styles.icon} text-xl shadow-sm transition duration-500 group-hover:scale-110 group-hover:rotate-3`}>
//         {icon}
//       </div>

//       <h3 className="relative mt-7 text-xl font-black text-[var(--ljka-primary)]">{title}</h3>

//       <p className="relative mt-3 text-sm leading-7 text-[var(--ljka-muted)]">{text}</p>

//       <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent">
//         <div className={`h-full w-14 ${styles.line} transition-all duration-500 group-hover:w-full`} />
//       </div>

//     </div>
//   );
// };


// /* =============================================================
//    VALUE CARD
//    ============================================================= */

// const ValueCard = ({ icon, title }) => (
//   <div className="ljka-float group rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-center backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:bg-white/[0.1]">
//     <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--ljka-gold)] text-[var(--ljka-text)] shadow-lg transition group-hover:scale-110">
//       {icon}
//     </div>
//     <p className="mt-4 text-xs font-bold text-white/80">{title}</p>
//   </div>
// );


// /* =============================================================
//    JOURNEY CARD
//    ============================================================= */

// const JourneyCard = ({ number, icon, title, text }) => (
//   <div className="group relative rounded-[24px] border border-[var(--ljka-border)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] transition duration-500 hover:-translate-y-2 hover:shadow-[var(--ljka-shadow-md)] sm:p-7">

//     <div className="flex items-center justify-between">

//       <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ljka-primary)] text-white shadow-md transition duration-500 group-hover:bg-[var(--ljka-gold)] group-hover:text-[var(--ljka-text)] group-hover:scale-110">
//         {icon}
//       </div>

//       <span className="text-4xl font-black text-[var(--ljka-primary)]/[0.08]">{number}</span>

//     </div>

//     <h3 className="mt-6 text-lg font-black text-[var(--ljka-primary)]">{title}</h3>

//     <p className="mt-3 text-sm leading-6 text-[var(--ljka-muted)]">{text}</p>

//     <div className="mt-6 flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-wider text-[var(--ljka-primary)]">
//       Step {number}
//       <span className="h-px w-8 bg-[var(--ljka-gold)] transition-all group-hover:w-14" />
//     </div>

//   </div>
// );


// /* =============================================================
//    CAMPAIGN TAG
//    ============================================================= */

// const CampaignTag = ({ text }) => (
//   <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[9px] font-bold text-white/60">{text}</span>
// );


// /* =============================================================
//    CAMPAIGN STAT
//    ============================================================= */

// const CampaignStat = ({ value, label }) => (
//   <div className="rounded-xl bg-[var(--ljka-bg)] p-3">
//     <p className="text-lg font-black text-[var(--ljka-primary)]">{value}</p>
//     <p className="mt-0.5 text-[9px] font-semibold text-[var(--ljka-muted)]">{label}</p>
//   </div>
// );


// /* =============================================================
//    TRUST CARD
//    ============================================================= */

// const TrustCard = ({ icon, color, title, text }) => {

//   const iconClasses = {
//     primary: "bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]",
//     gold: "bg-[var(--ljka-gold-light)]/50 text-[var(--ljka-text)]",
//     danger: "bg-red-50 text-[var(--ljka-danger)]",
//   }[color];

//   return (
//     <div className="group rounded-[24px] border border-[var(--ljka-border)] bg-[var(--ljka-bg)] p-6 transition duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-[var(--ljka-shadow-md)]">

//       <div className="flex items-start gap-4">

//         <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClasses} transition duration-300 group-hover:scale-110`}>
//           {icon}
//         </div>

//         <div>
//           <h3 className="text-sm font-black text-[var(--ljka-primary)]">{title}</h3>
//           <p className="mt-2 text-xs leading-6 text-[var(--ljka-muted)]">{text}</p>
//         </div>

//       </div>

//     </div>
//   );
// };


// /* =============================================================
//    VISION CARD
//    ============================================================= */

// const VisionCard = ({ icon, title, text }) => (
//   <div className="ljka-breathe group rounded-[26px] border border-[var(--ljka-border)] bg-white p-7 shadow-[var(--ljka-shadow-sm)] transition duration-500 hover:-translate-y-2 hover:shadow-[var(--ljka-shadow-md)] sm:p-8">

//     <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ljka-primary)] text-lg text-[var(--ljka-gold)] shadow-md transition duration-300 group-hover:bg-[var(--ljka-gold)] group-hover:text-[var(--ljka-text)]">
//       {icon}
//     </div>

//     <h3 className="mt-6 text-xl font-black text-[var(--ljka-primary)]">{title}</h3>

//     <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">{text}</p>

//     <div className="mt-6 flex items-center gap-2">
//       <span className="h-1.5 w-1.5 rounded-full bg-[var(--ljka-gold)]" />
//       <span className="h-px w-8 bg-[var(--ljka-border)] transition-all duration-300 group-hover:w-16 group-hover:bg-[var(--ljka-gold)]" />
//     </div>

//   </div>
// );


// export default Home;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { FaArrowRight, FaUsers, FaShieldAlt, FaHandsHelping, FaHeart, FaCheckCircle, FaUserCheck, FaFileAlt, FaHandHoldingHeart, FaLock, FaStar } from "react-icons/fa";

// const Home = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="w-full overflow-hidden bg-[var(--ljka-bg)] text-[var(--ljka-text)]">

//       {/* =========================================================
//           ANIMATION STYLES
//           ========================================================= */}

//       <style>{`
//         @keyframes ljka-float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }

//         @keyframes ljka-float-slow {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-16px) rotate(3deg); }
//         }

//         @keyframes ljka-pulse {
//           0%, 100% { transform: scale(1); opacity: .55; }
//           50% { transform: scale(1.12); opacity: .8; }
//         }

//         @keyframes ljka-slide {
//           from { opacity: 0; transform: translateY(18px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @keyframes ljka-shine {
//           0% { transform: translateX(-120%); }
//           100% { transform: translateX(120%); }
//         }

//         @keyframes ljka-orbit {
//           from { transform: rotate(0deg) translateX(7px) rotate(0deg); }
//           to { transform: rotate(360deg) translateX(7px) rotate(-360deg); }
//         }

//         .ljka-float { animation: ljka-float 4s ease-in-out infinite; }
//         .ljka-float-slow { animation: ljka-float-slow 6s ease-in-out infinite; }
//         .ljka-pulse { animation: ljka-pulse 4s ease-in-out infinite; }
//         .ljka-slide { animation: ljka-slide .7s ease-out both; }
//         .ljka-orbit { animation: ljka-orbit 10s linear infinite; }

//         .ljka-shine { position: relative; overflow: hidden; }
//         .ljka-shine::after { content: ""; position: absolute; inset: 0; width: 35%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent); transform: translateX(-120%); animation: ljka-shine 4s ease-in-out infinite; pointer-events: none; }

//         .ljka-grid {
//           background-image: linear-gradient(rgba(0,107,79,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(0,107,79,.055) 1px, transparent 1px);
//           background-size: 34px 34px;
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .ljka-float, .ljka-float-slow, .ljka-pulse, .ljka-slide, .ljka-orbit, .ljka-shine::after { animation: none; }
//         }
//       `}</style>


//       {/* =========================================================
//           HERO
//           ========================================================= */}

//       <section className="relative overflow-hidden bg-[var(--ljka-primary)] text-white">

//         <div className="absolute inset-0 opacity-40 ljka-grid" />

//         <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[var(--ljka-gold)]/15 blur-3xl ljka-pulse" />
//         <div className="absolute -bottom-48 -left-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />

//         <div className="absolute right-[18%] top-[18%] h-3 w-3 rounded-full bg-[var(--ljka-gold)]/70 ljka-orbit" />

//         <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:px-10 lg:py-24 xl:gap-16">

//           {/* HERO CONTENT */}
//           <div className="ljka-slide">

//             <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/35 bg-white/5 px-4 py-2 backdrop-blur-sm">
//               <FaHeart className="text-xs text-[var(--ljka-gold)]" />
//               <span className="text-xs font-medium text-white/85 sm:text-sm">Together for a stronger community</span>
//             </div>

//             <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-6xl xl:text-[68px]">
//               Lakhdaatar Jeevan
//               <span className="mt-1 block text-[var(--ljka-gold)]">Kalyan Association</span>
//             </h1>

//             <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base lg:text-lg">A community built on trust, humanity and collective responsibility — standing together to support the family of a member when they need it most.</p>

//             <div className="mt-8 flex flex-col gap-3 sm:flex-row">
//               <button type="button" onClick={() => navigate("/register")} className="ljka-shine inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--ljka-gold)] px-6 py-3.5 text-sm font-bold text-[var(--ljka-text)] shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--ljka-gold-light)] hover:shadow-xl">
//                 Become a Member
//                 <FaArrowRight className="text-xs" />
//               </button>

//               <button type="button" onClick={() => navigate("/vyawastha-list")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[var(--ljka-gold)]/50 hover:bg-white/10">
//                 How LJKA Works
//                 <FaArrowRight className="text-xs text-[var(--ljka-gold)]" />
//               </button>
//             </div>

//             <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/55">
//               <span className="flex items-center gap-2"><FaCheckCircle className="text-[var(--ljka-gold)]" /> Community based</span>
//               <span className="flex items-center gap-2"><FaCheckCircle className="text-[var(--ljka-gold)]" /> Verified members</span>
//               <span className="flex items-center gap-2"><FaCheckCircle className="text-[var(--ljka-gold)]" /> Transparent process</span>
//             </div>

//           </div>


//           {/* HERO VISUAL */}
//           <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">

//             <div className="absolute -inset-8 rounded-[40px] bg-[var(--ljka-gold)]/10 blur-3xl" />

//             <div className="relative rounded-[30px] border border-white/10 bg-white/[0.07] p-4 shadow-2xl backdrop-blur-xl sm:p-5">

//               <div className="rounded-[24px] bg-[var(--ljka-bg)] p-5 text-[var(--ljka-text)] sm:p-6">

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ljka-muted)]">LJKA Community</p>
//                     <h3 className="mt-1 text-xl font-bold text-[var(--ljka-primary)]">Together, we support.</h3>
//                   </div>

//                   <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ljka-primary)] text-[var(--ljka-gold)] shadow-sm">
//                     <FaUsers />
//                   </div>
//                 </div>

//                 <div className="mt-6 rounded-2xl bg-[var(--ljka-mint)] p-5">
//                   <div className="flex items-end justify-between">
//                     <div>
//                       <p className="text-xs font-semibold text-[var(--ljka-muted)]">Founding initiative</p>
//                       <p className="mt-1 text-3xl font-bold tracking-tight text-[var(--ljka-primary)]">11,000</p>
//                       <p className="text-xs font-medium text-[var(--ljka-muted)]">Members</p>
//                     </div>

//                     <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[var(--ljka-card)] bg-[var(--ljka-gold)] text-[var(--ljka-text)] shadow-md">
//                       <FaHeart />
//                     </div>
//                   </div>

//                   <div className="mt-5 h-2 overflow-hidden rounded-full bg-white">
//                     <div className="h-full w-[72%] rounded-full bg-[var(--ljka-primary)]" />
//                   </div>

//                   <p className="mt-2 text-[10px] font-medium text-[var(--ljka-muted)]">Building a responsible community together</p>
//                 </div>

//                 <div className="mt-4 grid grid-cols-3 gap-3">
//                   <MiniHeroCard icon={<FaUserCheck />} title="Members" />
//                   <MiniHeroCard icon={<FaShieldAlt />} title="Verified" />
//                   <MiniHeroCard icon={<FaHandsHelping />} title="Support" />
//                 </div>

//               </div>
//             </div>

//             <div className="absolute -left-5 top-12 hidden rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white shadow-xl backdrop-blur-xl sm:block ljka-float">
//               <div className="flex items-center gap-2">
//                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ljka-gold)] text-[var(--ljka-text)]"><FaHeart className="text-xs" /></span>
//                 <div>
//                   <p className="text-[10px] text-white/50">Built on</p>
//                   <p className="text-xs font-bold">Humanity</p>
//                 </div>
//               </div>
//             </div>

//             <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white shadow-xl backdrop-blur-xl sm:block ljka-float-slow">
//               <div className="flex items-center gap-2">
//                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ljka-primary-light)] text-white"><FaShieldAlt className="text-xs" /></span>
//                 <div>
//                   <p className="text-[10px] text-white/50">Focused on</p>
//                   <p className="text-xs font-bold">Trust & Process</p>
//                 </div>
//               </div>
//             </div>

//           </div>

//         </div>
//       </section>


//       {/* =========================================================
//           PURPOSE INTRO
//           ========================================================= */}

//       <section className="relative bg-[var(--ljka-bg)] py-16 sm:py-20 lg:py-24">
//         <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

//           <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">

//             <div className="max-w-3xl">
//               <div className="mb-3 flex items-center gap-3">
//                 <span className="h-1 w-8 rounded-full bg-[var(--ljka-gold)]" />
//                 <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-primary)]">Our Purpose</p>
//               </div>

//               <h2 className="text-3xl font-bold leading-tight tracking-tight text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">No family should feel alone in a difficult time.</h2>
//             </div>

//             <p className="max-w-xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">LJKA aims to bring people together through a structured membership community where members can stand with one another and provide financial support to the family or nominee of a deceased member, subject to LJKA's verification process and applicable rules.</p>

//           </div>


//           <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
//             <PurposeCard icon={<FaUsers />} title="A Community" text="Members come together with a shared responsibility to support one another." number="01" />
//             <PurposeCard icon={<FaHandsHelping />} title="Collective Support" text="When an eligible member passes away, the community can come together to provide support to the nominee." number="02" />
//             <PurposeCard icon={<FaShieldAlt />} title="Verified Process" text="Reported cases and nominee claims are intended to go through an internal verification process before support is released." number="03" />
//           </div>

//         </div>
//       </section>


//       {/* =========================================================
//           HOW LJKA WORKS
//           ========================================================= */}

//       <section className="relative overflow-hidden bg-[var(--ljka-mint)] py-16 sm:py-20 lg:py-24">

//         <div className="absolute -right-32 top-0 h-72 w-72 rounded-full bg-[var(--ljka-gold)]/10 blur-3xl" />

//         <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

//           <div className="mx-auto max-w-2xl text-center">
//             <div className="mb-3 flex items-center justify-center gap-3">
//               <span className="h-1 w-8 rounded-full bg-[var(--ljka-gold)]" />
//               <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-primary)]">How LJKA Works</p>
//               <span className="h-1 w-8 rounded-full bg-[var(--ljka-gold)]" />
//             </div>

//             <h2 className="text-3xl font-bold tracking-tight text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">Simple membership. Collective responsibility.</h2>

//             <p className="mt-4 text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">LJKA is designed around a community model where eligible members participate in supporting verified cases.</p>
//           </div>


//           <div className="relative mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

//             <Step number="01" icon={<FaUsers />} title="Become a Member" text="Register with LJKA and provide the required information." />
//             <Step number="02" icon={<FaFileAlt />} title="Complete KYC" text="Complete identity and membership verification as required." />
//             <Step number="03" icon={<FaUserCheck />} title="Become Eligible" text="After the applicable waiting or lock-in period, membership becomes eligible according to LJKA rules." />
//             <Step number="04" icon={<FaHandHoldingHeart />} title="Support a Family" text="When an eligible case is verified, active members can contribute according to the applicable LJKA mechanism." />

//           </div>


//           <div className="mt-10 text-center">
//             <button type="button" onClick={() => navigate("/vyawastha-list")} className="inline-flex items-center gap-2 rounded-full border border-[var(--ljka-primary)]/15 bg-white/60 px-5 py-2.5 text-sm font-semibold text-[var(--ljka-primary)] transition hover:border-[var(--ljka-primary)] hover:bg-white">
//               Understand the complete process
//               <FaArrowRight className="text-xs text-[var(--ljka-gold)]" />
//             </button>
//           </div>

//         </div>
//       </section>


//       {/* =========================================================
//           11,000 MEMBERS CTA
//           ========================================================= */}

//       <section className="bg-[var(--ljka-bg)] py-16 sm:py-20 lg:py-24">
//         <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

//           <div className="relative overflow-hidden rounded-[28px] bg-[var(--ljka-primary)] shadow-[var(--ljka-shadow-lg)]">

//             <div className="absolute inset-0 opacity-30 ljka-grid" />
//             <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--ljka-gold)]/15 blur-3xl" />
//             <div className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

//             <div className="relative grid items-center gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-14">

//               <div>
//                 <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/30 bg-white/5 px-3 py-1.5">
//                   <FaStar className="text-[10px] text-[var(--ljka-gold)]" />
//                   <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ljka-gold-light)]">Founding Membership Initiative</span>
//                 </div>

//                 <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">First 11,000 Members</h2>

//                 <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">To build the initial LJKA community, registration is currently planned to be free for the first 11,000 members.</p>

//                 <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/60">
//                   <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Community</span>
//                   <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Responsibility</span>
//                   <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Humanity</span>
//                 </div>
//               </div>

//               <div className="lg:pr-2">
//                 <button type="button" onClick={() => navigate("/register")} className="ljka-shine inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--ljka-gold)] px-7 py-4 text-sm font-bold text-[var(--ljka-text)] shadow-lg transition hover:-translate-y-1 hover:bg-[var(--ljka-gold-light)] hover:shadow-xl sm:w-auto">
//                   Register Now
//                   <FaArrowRight className="text-xs" />
//                 </button>
//               </div>

//             </div>
//           </div>

//         </div>
//       </section>


//       {/* =========================================================
//           TRUST SECTION
//           ========================================================= */}

//       <section className="relative overflow-hidden border-y border-[var(--ljka-border)] bg-white py-16 sm:py-20 lg:py-24">

//         <div className="absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[var(--ljka-primary)]/5 blur-3xl" />

//         <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-10">

//           <div>
//             <div className="mb-3 flex items-center gap-3">
//               <span className="h-1 w-8 rounded-full bg-[var(--ljka-gold)]" />
//               <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-primary)]">Built on Trust</p>
//             </div>

//             <h2 className="text-3xl font-bold leading-tight tracking-tight text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">Transparency matters.</h2>

//             <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">LJKA's purpose is not simply to collect memberships. The long-term goal is to create a responsible community where membership, verification, contribution and nominee support are handled through a clear and accountable process.</p>

//             <div className="mt-7 inline-flex items-center gap-3 rounded-xl border border-[var(--ljka-border)] bg-[var(--ljka-primary-bg)] px-4 py-3">
//               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ljka-primary)] text-white"><FaLock className="text-xs" /></div>
//               <div>
//                 <p className="text-xs font-bold text-[var(--ljka-primary)]">Responsible process</p>
//                 <p className="text-[10px] text-[var(--ljka-muted)]">Verification before support</p>
//               </div>
//             </div>
//           </div>


//           <div className="grid gap-4 sm:grid-cols-2">
//             <TrustCard icon={<FaUserCheck />} title="Member Verification" text="Identity and required membership information are verified." />
//             <TrustCard icon={<FaFileAlt />} title="Case Verification" text="Death-related claims are intended to be reviewed with required documents." />
//             <TrustCard icon={<FaShieldAlt />} title="Nominee Verification" text="The nominee and required banking information can be verified before support is released." />
//             <TrustCard icon={<FaUsers />} title="Community Accountability" text="The system is designed around active participation and responsible membership." />
//           </div>

//         </div>
//       </section>


//       {/* =========================================================
//           FINAL CTA
//           ========================================================= */}

//       <section className="relative overflow-hidden bg-[var(--ljka-bg)] py-16 sm:py-20 lg:py-24">

//         <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--ljka-primary)]/5 blur-3xl" />

//         <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">

//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ljka-primary)] text-xl text-[var(--ljka-gold)] shadow-lg">
//             <FaHeart />
//           </div>

//           <div className="mt-5 flex items-center justify-center gap-3">
//             <span className="h-px w-10 bg-[var(--ljka-gold)]" />
//             <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-primary)]">Join the community</span>
//             <span className="h-px w-10 bg-[var(--ljka-gold)]" />
//           </div>

//           <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">Stand together. Support together.</h2>

//           <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">Join the LJKA community and become part of a long-term vision of collective support, responsibility and humanity.</p>

//           <button type="button" onClick={() => navigate("/register")} className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--ljka-primary)] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[var(--ljka-primary-dark)] hover:shadow-lg">
//             Become a Member
//             <FaArrowRight className="text-xs text-[var(--ljka-gold)]" />
//           </button>

//         </div>
//       </section>

//     </div>
//   );
// };


// /* =============================================================
//    MINI HERO CARD
//    ============================================================= */

// const MiniHeroCard = ({ icon, title }) => (
//   <div className="rounded-xl border border-[var(--ljka-border)] bg-white p-3 text-center transition hover:-translate-y-1 hover:shadow-sm">
//     <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">{icon}</div>
//     <p className="mt-2 text-[10px] font-bold text-[var(--ljka-text)]">{title}</p>
//   </div>
// );


// /* =============================================================
//    PURPOSE CARD
//    ============================================================= */

// const PurposeCard = ({ icon, title, text, number }) => (
//   <div className="group relative overflow-hidden rounded-2xl border border-[var(--ljka-border)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] transition duration-300 hover:-translate-y-2 hover:shadow-[var(--ljka-shadow-md)]">

//     <div className="absolute right-5 top-4 text-5xl font-black text-[var(--ljka-primary)]/[0.045]">{number}</div>

//     <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--ljka-primary-bg)] text-lg text-[var(--ljka-primary)] transition duration-300 group-hover:bg-[var(--ljka-primary)] group-hover:text-white">{icon}</div>

//     <h3 className="relative mt-5 text-lg font-bold text-[var(--ljka-primary)]">{title}</h3>

//     <p className="relative mt-2 text-sm leading-6 text-[var(--ljka-muted)]">{text}</p>

//     <div className="mt-5 h-1 w-8 rounded-full bg-[var(--ljka-gold)] transition-all duration-300 group-hover:w-14" />
//   </div>
// );


// /* =============================================================
//    PROCESS STEP
//    ============================================================= */

// const Step = ({ number, icon, title, text }) => (
//   <div className="group relative rounded-2xl border border-[var(--ljka-border)] bg-white p-6 shadow-[var(--ljka-shadow-sm)] transition duration-300 hover:-translate-y-2 hover:shadow-[var(--ljka-shadow-md)]">

//     <div className="flex items-center justify-between">
//       <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--ljka-primary)] text-white transition group-hover:bg-[var(--ljka-gold)] group-hover:text-[var(--ljka-text)]">{icon}</div>
//       <span className="text-3xl font-black text-[var(--ljka-primary)]/10">{number}</span>
//     </div>

//     <h3 className="mt-5 text-lg font-bold text-[var(--ljka-primary)]">{title}</h3>

//     <p className="mt-2 text-sm leading-6 text-[var(--ljka-muted)]">{text}</p>

//     <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--ljka-primary)] opacity-0 transition group-hover:opacity-100">
//       LJKA Process
//       <FaArrowRight className="text-[var(--ljka-gold)]" />
//     </div>
//   </div>
// );


// /* =============================================================
//    TRUST CARD
//    ============================================================= */

// const TrustCard = ({ icon, title, text }) => (
//   <div className="group rounded-2xl border border-[var(--ljka-border)] bg-[var(--ljka-bg)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--ljka-primary)]/20 hover:bg-[var(--ljka-primary-bg)] hover:shadow-[var(--ljka-shadow-sm)]">

//     <div className="flex items-start gap-4">

//       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--ljka-primary)] shadow-sm transition group-hover:bg-[var(--ljka-primary)] group-hover:text-white">
//         {icon}
//       </div>

//       <div>
//         <h3 className="text-sm font-bold text-[var(--ljka-primary)]">{title}</h3>
//         <p className="mt-1.5 text-xs leading-5 text-[var(--ljka-muted)]">{text}</p>
//       </div>

//     </div>
//   </div>
// );


// export default Home;

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

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaArrowRight,
//   FaUsers,
//   FaShieldAlt,
//   FaHandsHelping,
//   FaHeart,
//   FaCheckCircle,
// } from "react-icons/fa";

// const Home = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="w-full bg-[#f8f9fb] text-[var(--ljka-text)]">

//       {/* ================= HERO ================= */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-[var(--ljka-primary)] via-[#123452] to-[#071d32] text-white">
//         <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[var(--ljka-gold)]/10 blur-3xl" />
//         <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

//         <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-20 sm:py-24 lg:py-28">
//           <div className="max-w-4xl">

//             <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/30 bg-white/5 px-4 py-2 mb-6">
//               <FaHeart className="text-[var(--ljka-gold)] text-xs" />
//               <span className="text-xs sm:text-sm text-white/85">
//                 Together for a stronger community
//               </span>
//             </div>

//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight">
//               Lakhdaatar Jeevan
//               <span className="block text-[var(--ljka-gold)]">
//                 Kalyan Association
//               </span>
//             </h1>

//             <p className="mt-5 text-sm sm:text-base lg:text-lg leading-7 text-white/70 max-w-2xl">
//               A community built on trust, humanity and collective responsibility
//               — standing together to support the family of a member when they
//               need it most.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-3 mt-8">
//               <button
//                 type="button"
//                 onClick={() => navigate("/register")}
//                 className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--ljka-gold)] px-6 py-3.5 text-sm font-bold text-[var(--ljka-primary)] hover:bg-[#f1d993] transition shadow-lg"
//               >
//                 Become a Member
//                 <FaArrowRight className="text-xs" />
//               </button>

//               <button
//                 type="button"
//                 onClick={() => navigate("/vyawastha-list")}
//                 className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition"
//               >
//                 How LJKA Works
//               </button>
//             </div>

//             <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/55">
//               <span className="flex items-center gap-2">
//                 <FaCheckCircle className="text-[var(--ljka-gold)]" />
//                 Community based
//               </span>
//               <span className="flex items-center gap-2">
//                 <FaCheckCircle className="text-[var(--ljka-gold)]" />
//                 Verified members
//               </span>
//               <span className="flex items-center gap-2">
//                 <FaCheckCircle className="text-[var(--ljka-gold)]" />
//                 Transparent process
//               </span>
//             </div>

//           </div>
//         </div>
//       </section>


//       {/* ================= PURPOSE ================= */}
//       <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-20">

//         <div className="max-w-2xl mb-10">
//           <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
//             Our Purpose
//           </p>

//           <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[var(--ljka-primary)]">
//             No family should feel alone in a difficult time.
//           </h2>

//           <p className="mt-4 text-sm sm:text-base leading-7 text-gray-600">
//             LJKA aims to bring people together through a structured membership
//             community where members can stand with one another and provide
//             financial support to the family or nominee of a deceased member,
//             subject to LJKA's verification process and applicable rules.
//           </p>
//         </div>


//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

//           <PurposeCard
//             icon={<FaUsers />}
//             title="A Community"
//             text="Members come together with a shared responsibility to support one another."
//           />

//           <PurposeCard
//             icon={<FaHandsHelping />}
//             title="Collective Support"
//             text="When an eligible member passes away, the community can come together to provide support to the nominee."
//           />

//           <PurposeCard
//             icon={<FaShieldAlt />}
//             title="Verified Process"
//             text="Reported cases and nominee claims are intended to go through an internal verification process before support is released."
//           />

//         </div>
//       </section>


//       {/* ================= HOW IT WORKS ================= */}
//       <section className="bg-white border-y border-gray-200">
//         <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-20">

//           <div className="text-center max-w-2xl mx-auto mb-12">
//             <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
//               How LJKA Works
//             </p>

//             <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[var(--ljka-primary)]">
//               Simple membership. Collective responsibility.
//             </h2>

//             <p className="mt-4 text-sm sm:text-base text-gray-600 leading-7">
//               LJKA is designed around a community model where eligible members
//               participate in supporting verified cases.
//             </p>
//           </div>


//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

//             <Step
//               number="01"
//               title="Become a Member"
//               text="Register with LJKA and provide the required information."
//             />

//             <Step
//               number="02"
//               title="Complete KYC"
//               text="Complete identity and membership verification as required."
//             />

//             <Step
//               number="03"
//               title="Become Eligible"
//               text="After the applicable waiting or lock-in period, membership becomes eligible according to LJKA rules."
//             />

//             <Step
//               number="04"
//               title="Support a Family"
//               text="When an eligible case is verified, active members can contribute according to the applicable LJKA mechanism."
//             />

//           </div>


//           <div className="mt-10 text-center">
//             <button
//               type="button"
//               onClick={() => navigate("/vyawastha-list")}
//               className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ljka-primary)] hover:text-[var(--ljka-gold)] transition"
//             >
//               Understand the complete process
//               <FaArrowRight className="text-xs" />
//             </button>
//           </div>

//         </div>
//       </section>


//       {/* ================= 11000 INITIATIVE ================= */}
//       <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-20">

//         <div className="relative overflow-hidden rounded-2xl bg-[var(--ljka-primary)] text-white">

//           <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--ljka-gold)]/10 blur-2xl" />

//           <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center p-7 sm:p-10 lg:p-12">

//             <div>
//               <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
//                 Founding Membership Initiative
//               </p>

//               <h2 className="mt-2 text-3xl sm:text-4xl font-bold">
//                 First 11,000 Members
//               </h2>

//               <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl leading-7">
//                 To build the initial LJKA community, registration is currently
//                 planned to be free for the first 11,000 members.
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={() => navigate("/register")}
//               className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--ljka-gold)] px-6 py-3.5 text-sm font-bold text-[var(--ljka-primary)] hover:bg-[#f1d993] transition whitespace-nowrap"
//             >
//               Register Now
//               <FaArrowRight className="text-xs" />
//             </button>

//           </div>
//         </div>

//       </section>


//       {/* ================= TRUST ================= */}
//       <section className="bg-[#f1f3f5] border-y border-gray-200">
//         <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-20">

//           <div className="grid lg:grid-cols-2 gap-12 items-center">

//             <div>
//               <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
//                 Built on Trust
//               </p>

//               <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[var(--ljka-primary)]">
//                 Transparency matters.
//               </h2>

//               <p className="mt-4 text-sm sm:text-base leading-7 text-gray-600">
//                 LJKA's purpose is not simply to collect memberships. The
//                 long-term goal is to create a responsible community where
//                 membership, verification, contribution and nominee support are
//                 handled through a clear and accountable process.
//               </p>
//             </div>


//             <div className="grid sm:grid-cols-2 gap-4">

//               <TrustCard
//                 title="Member Verification"
//                 text="Identity and required membership information are verified."
//               />

//               <TrustCard
//                 title="Case Verification"
//                 text="Death-related claims are intended to be reviewed with required documents."
//               />

//               <TrustCard
//                 title="Nominee Verification"
//                 text="The nominee and required banking information can be verified before support is released."
//               />

//               <TrustCard
//                 title="Community Accountability"
//                 text="The system is designed around active participation and responsible membership."
//               />

//             </div>

//           </div>

//         </div>
//       </section>


//       {/* ================= FINAL CTA ================= */}
//       <section className="bg-white">
//         <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center">

//           <div className="mx-auto w-12 h-12 rounded-full bg-[var(--ljka-primary)] text-[var(--ljka-gold)] flex items-center justify-center">
//             <FaHeart />
//           </div>

//           <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-[var(--ljka-primary)]">
//             Stand together. Support together.
//           </h2>

//           <p className="mt-4 text-sm sm:text-base text-gray-600 leading-7 max-w-2xl mx-auto">
//             Join the LJKA community and become part of a long-term vision of
//             collective support, responsibility and humanity.
//           </p>

//           <button
//             type="button"
//             onClick={() => navigate("/register")}
//             className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#102b45] transition shadow-sm"
//           >
//             Become a Member
//             <FaArrowRight className="text-xs" />
//           </button>

//         </div>
//       </section>

//     </div>
//   );
// };


// /* ================= PURPOSE CARD ================= */

// const PurposeCard = ({ icon, title, text }) => (
//   <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
//     <div className="w-11 h-11 rounded-lg bg-[#f8f6ef] text-[var(--ljka-primary)] flex items-center justify-center text-lg">
//       {icon}
//     </div>

//     <h3 className="mt-5 text-lg font-bold text-[var(--ljka-primary)]">
//       {title}
//     </h3>

//     <p className="mt-2 text-sm leading-6 text-gray-600">
//       {text}
//     </p>
//   </div>
// );


// /* ================= PROCESS STEP ================= */

// const Step = ({ number, title, text }) => (
//   <div className="relative bg-[#f8f9fb] border border-gray-200 rounded-xl p-6">

//     <span className="text-xs font-bold tracking-wider text-[var(--ljka-gold)]">
//       {number}
//     </span>

//     <h3 className="mt-3 text-lg font-bold text-[var(--ljka-primary)]">
//       {title}
//     </h3>

//     <p className="mt-2 text-sm leading-6 text-gray-600">
//       {text}
//     </p>
//   </div>
// );


// /* ================= TRUST CARD ================= */

// const TrustCard = ({ title, text }) => (
//   <div className="bg-white rounded-xl border border-gray-200 p-5">
//     <div className="flex items-start gap-3">
//       <FaCheckCircle className="mt-1 shrink-0 text-[var(--ljka-gold)]" />

//       <div>
//         <h3 className="text-sm font-bold text-[var(--ljka-primary)]">
//           {title}
//         </h3>

//         <p className="mt-1 text-xs leading-5 text-gray-600">
//           {text}
//         </p>
//       </div>
//     </div>
//   </div>
// );

// export default Home;
