import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
  FaBell,
} from "react-icons/fa";

import HeroCarousel from "../components/HeroCarousel";
import SahyogAlertList from "../components/SahyogAlertList";
import { LJKAContext } from "../context/LJKAContext";

const MissionPoint = ({ title, text }) => (
  <div className="group rounded-xl border border-[var(--ljka-border)] bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--ljka-gold)]/40 hover:shadow-[var(--ljka-shadow-sm)]">

    <div className="flex items-start gap-3">

      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--ljka-gold)]" />

      <div>
        <h3 className="text-sm font-bold text-[var(--ljka-primary)]">
          {title}
        </h3>

        <p className="mt-1.5 text-xs leading-5 text-[var(--ljka-muted)]">
          {text}
        </p>
      </div>

    </div>

  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { sahyogAlert } = useContext(LJKAContext);

  return (
    <main className="w-full overflow-hidden bg-[var(--ljka-bg)] text-[var(--ljka-text)]">

      <HeroCarousel />

      <SahyogAlertList />

      {/* =========================================================
          QUICK ACTIONS
          ========================================================= */}

      <section className="relative z-20 border-b border-[var(--ljka-border-light)] bg-white">
        <div className="mx-auto grid max-w-[1450px] divide-y divide-[var(--ljka-border-light)] sm:grid-cols-2 lg:grid-cols-4 sm:divide-x sm:divide-y-0">

          <QuickAction
            icon={<FaUsers />}
            title="Join LJKA"
            text="Start your membership journey"
            onClick={() => navigate("/register")}
          />

          <QuickAction
            icon={<FaFileAlt />}
            title="Niyamawali"
            text="Know the rules and process"
            onClick={() => navigate("/niyamawali")}
          />

          <QuickAction
            icon={<FaHeart />}
            title="Donation Portal"
            text="Support the LJKA community"
            onClick={() => navigate("/sahyog-list")}
          />

          <QuickAction
            icon={<FaHeart />}
            title="Member's List"
            text="View all LJKA members"
            onClick={() => navigate("/user-list")}
          />


        </div>
      </section>

      {/* =========================================================
    SAHYOG ALERT
    ========================================================= */}
      {false && sahyogAlert?.isActive && (
        <section className="relative z-20 bg-[var(--ljka-primary-bg)] border-b border-[var(--ljka-border)]">
          <div className="mx-auto max-w-[1450px] px-4 py-5 sm:px-6 md:py-6 lg:px-8">

            <div className="relative overflow-hidden rounded-[var(--ljka-radius-lg)] border border-[var(--ljka-border)] bg-white shadow-[var(--ljka-shadow-sm)]">

              {/* Gold accent */}
              <div className="absolute left-0 top-0 h-full w-1.5 bg-[var(--ljka-gold)]" />

              <div className="flex flex-col gap-4 p-5 sm:p-6 md:flex-row md:items-center md:justify-between md:gap-6">

                {/* Alert Content */}
                <div className="flex min-w-0 items-start gap-4">

                  {/* Icon */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--ljka-primary)] text-white">
                    <FaBell className="text-lg" />
                  </div>

                  {/* Text */}
                  <div className="min-w-0">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ljka-gold-dark)]">
                      {sahyogAlert.title}
                    </p>

                    <p className="text-sm leading-6 text-[var(--ljka-text)] sm:text-base">
                      {sahyogAlert.message}
                    </p>
                  </div>

                </div>

                {/* Action */}
                <button
                  type="button"
                  onClick={() => navigate("/sahyog-list")}
                  className="
              shrink-0
              self-start
              rounded-full
              bg-[var(--ljka-primary)]
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              duration-200
              hover:bg-[var(--ljka-primary-dark)]
              md:self-center
            "
                >
                  View Sahyog
                </button>

              </div>
            </div>

          </div>
        </section>
      )}

      {/* =========================================================
    LJKA INTRODUCTION
    ========================================================= */}
      <section className="relative z-20 bg-[var(--ljka-bg)] py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">

          {/* Section Heading */}
          <div className="mb-8 text-center sm:mb-10">

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ljka-gold-dark)]">
              Introduction
            </p>

            <h2 className="text-2xl font-bold text-[var(--ljka-primary)] sm:text-3xl lg:text-4xl">
              लखदातार जीवन कल्याण एसोसिएशन
            </h2>

            <p className="mt-3 text-base font-semibold text-[var(--ljka-gold-dark)] sm:text-lg">
              “समाज के लिए, समाज के साथ”
            </p>

            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[var(--ljka-gold)]" />
          </div>


          {/* Introduction Card */}
          <div className="overflow-hidden rounded-[var(--ljka-radius-lg)] border border-[var(--ljka-border)] bg-white shadow-[var(--ljka-shadow-sm)]">

            {/* Maroon top accent */}
            <div className="h-1.5 bg-[var(--ljka-primary)]" />

            <div className="p-5 sm:p-8 md:p-10 lg:p-12">

              {/* Paragraph 1 */}
              <p className="text-justify text-sm leading-7 text-[var(--ljka-text)] sm:text-base sm:leading-8">
                <strong className="font-semibold text-[var(--ljka-primary)]">
                  लखदातार जीवन कल्याण एसोसिएशन
                </strong>{" "}
                एक सामाजिक संस्था है, जो “समाज के लिए, समाज के साथ” की भावना
                से कार्य करने के उद्देश्य से स्थापित की गई है। हमारा प्रयास है कि
                कठिन परिस्थितियों में कोई परिवार स्वयं को अकेला न समझे और
                आवश्यकता के समय समाज उसके साथ खड़ा हो।
              </p>


              {/* Paragraph 2 */}
              <p className="mt-5 text-justify text-sm leading-7 text-[var(--ljka-text)] sm:mt-6 sm:text-base sm:leading-8">
                हमारी मुख्य पहल एक पारस्परिक सामाजिक सहयोग व्यवस्था है, जिसके
                अंतर्गत संस्था से जुड़े सदस्यों के परिवार को सदस्य की आकस्मिक
                मृत्यु की स्थिति में, निर्धारित नियमों एवं आवश्यक सत्यापन के
                पश्चात, समुदाय के अन्य सक्रिय सदस्यों के स्वैच्छिक सहयोग के
                माध्यम से आर्थिक सहायता पहुँचाने का प्रयास किया जाता है।
              </p>


              {/* Paragraph 3 */}
              <p className="mt-5 text-justify text-sm leading-7 text-[var(--ljka-text)] sm:mt-6 sm:text-base sm:leading-8">
                हमारा विश्वास है कि एक व्यक्ति का छोटा सहयोग, जब हजारों लोग
                मिलकर करें, तो किसी परिवार के लिए बहुत बड़ा सहारा बन सकता है।
              </p>


              {/* Paragraph 4 */}
              <p className="mt-5 text-justify text-sm leading-7 text-[var(--ljka-text)] sm:mt-6 sm:text-base sm:leading-8">
                इसी सामाजिक भावना को आगे बढ़ाते हुए संस्था भविष्य में उपलब्ध
                संसाधनों के अनुसार शिक्षा, स्वास्थ्य, जरूरतमंदों की सहायता,
                पर्यावरण संरक्षण, आपदा राहत तथा अन्य जनकल्याणकारी कार्यों में
                भी योगदान देने का प्रयास करेगी।
              </p>


              {/* Commitment */}
              <div className="mt-7 rounded-r-[var(--ljka-radius-md)] border-l-4 border-[var(--ljka-gold)] bg-[var(--ljka-gold-light)] px-5 py-4 sm:mt-8 sm:px-6 sm:py-5">

                <p className="text-sm font-semibold leading-7 text-[var(--ljka-primary)] sm:text-base sm:leading-8">
                  हमारा संकल्प —
                  <span className="font-medium text-[var(--ljka-text)]">
                    {" "}कठिन समय में किसी परिवार को अकेला न छोड़ना और सहयोग की
                    भावना को एक संगठित सामाजिक प्रयास में बदलना।
                  </span>
                </p>

              </div>

            </div>
          </div>


          {/* Read More */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/about")}
              className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-[var(--ljka-primary)]
          px-6
          py-2.5
          text-sm
          font-semibold
          text-[var(--ljka-primary)]
          transition
          duration-200
          hover:bg-[var(--ljka-primary)]
          hover:text-white
        "
            >
              Know More
              <span aria-hidden="true">→</span>
            </button>
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
    OUR MISSION
========================================================= */}

      <section className="relative overflow-hidden bg-[var(--ljka-bg)] py-16 sm:py-20 lg:py-24">

        {/* Soft background decoration */}
        <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-[var(--ljka-primary)]/[0.035] blur-3xl" />

        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[var(--ljka-gold)]/[0.06] blur-3xl" />


        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">


            {/* =====================================================
          IMAGE
      ===================================================== */}

            <div className="relative">

              {/* Gold accent */}
              <div className="absolute -left-3 -top-3 h-24 w-24 rounded-tl-3xl border-l-2 border-t-2 border-[var(--ljka-gold)] sm:-left-4 sm:-top-4" />

              <div className="absolute -bottom-3 -right-3 h-24 w-24 rounded-br-3xl border-b-2 border-r-2 border-[var(--ljka-gold)] sm:-bottom-4 sm:-right-4" />


              <div className="relative overflow-hidden rounded-2xl border border-[var(--ljka-border)] bg-white p-2 shadow-[var(--ljka-shadow-lg)]">

                <img
                  src="/img/Mission image.png"
                  alt="LJKA community and mutual support"
                  className="h-[280px] w-full rounded-xl object-cover sm:h-[360px] lg:h-[440px]"
                />

                {/* Image overlay */}
                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/20 bg-[var(--ljka-primary)]/90 px-5 py-4 backdrop-blur-md">

                  <p
                    className="text-lg font-bold text-white"
                    style={{
                      fontFamily: "'Noto Serif Devanagari', serif",
                    }}
                  >
                    सेवा परमो धर्मः
                  </p>

                  <p className="mt-0.5 text-xs font-medium text-white/70">
                    Service is the Highest Duty
                  </p>

                </div>

              </div>

            </div>


            {/* =====================================================
          CONTENT
      ===================================================== */}

            <div>

              {/* Eyebrow */}
              <div className="mb-4 flex items-center gap-3">

                <span className="h-[2px] w-8 rounded-full bg-[var(--ljka-gold)]" />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold-dark)]">
                  Our Mission
                </span>

              </div>


              {/* Heading */}
              <h2 className="max-w-2xl text-3xl font-extrabold leading-tight text-[var(--ljka-primary)] sm:text-4xl lg:text-[44px]">
                Standing Together When
                <span className="text-[var(--ljka-gold-dark)]">
                  {" "}Support Matters Most
                </span>
              </h2>


              {/* Description */}
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
                LJKA's mission is to build a trusted community where members
                stand together through mutual support, collective responsibility
                and humanity. We believe that no family should have to face a
                difficult time alone.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
                Through a structured community network, transparent processes and
                a shared sense of responsibility, LJKA aims to create meaningful
                support for members and their families when it is needed most.
              </p>


              {/* =================================================
            MISSION POINTS
        ================================================= */}

              <div className="mt-7 grid gap-4 sm:grid-cols-2">

                <MissionPoint
                  title="Community First"
                  text="Building a connected community where members stand by one another."
                />

                <MissionPoint
                  title="Mutual Support"
                  text="Creating a system of collective responsibility and assistance."
                />

                <MissionPoint
                  title="Trust & Transparency"
                  text="Following clear processes with responsibility and accountability."
                />

                <MissionPoint
                  title="Humanity"
                  text="Keeping compassion and service at the heart of every effort."
                />

              </div>


              {/* =================================================
            CTA
        ================================================= */}

              <div className="mt-8">

                <Link
                  to="/about"
                  className="group inline-flex items-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-5 py-3 text-sm font-bold text-white shadow-[var(--ljka-shadow-sm)] transition-all duration-300 hover:bg-[var(--ljka-primary-dark)] hover:shadow-[var(--ljka-shadow-md)]"
                >
                  Learn More About LJKA

                  <FaArrowRight className="text-[11px] transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

              </div>

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