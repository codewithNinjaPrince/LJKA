import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaHeart,
  FaShieldAlt,
  FaUsers,
  FaHandshake,
} from "react-icons/fa";

const AboutUs = () => {
  const values = [
    {
      icon: <FaHandshake />,
      title: "Trust",
      text: "Building a community where members can rely on one another.",
    },
    {
      icon: <FaHeart />,
      title: "Humanity",
      text: "Standing together with families during difficult moments.",
    },
    {
      icon: <FaUsers />,
      title: "Community",
      text: "Creating strength through collective participation.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Responsibility",
      text: "Encouraging every member to contribute towards a stronger community.",
    },
  ];

  return (
    <div className="w-full bg-[var(--ljka-bg)] text-[var(--ljka-text)]">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[var(--ljka-primary)]">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--ljka-gold)]/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-[var(--ljka-gold)]/40 bg-[var(--ljka-gold)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
              About LJKA
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Together for a
              <span className="block text-[var(--ljka-gold)]">
                stronger community.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              Lakhdaatar Jeevan Kalyan Association is built around a simple
              philosophy — when members stand together, a community becomes
              stronger and families do not have to face difficult times alone.
            </p>
          </div>

        </div>

        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[var(--ljka-gold)] to-transparent" />
      </section>


      {/* ================= WHO WE ARE ================= */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
              Who We Are
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[var(--ljka-primary)] sm:text-4xl">
              Lakhdaatar Jeevan Kalyan Association
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base">
              LJKA is envisioned as a community-based association where
              individuals come together with a shared sense of responsibility,
              trust and humanity.
            </p>

            <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
              The idea is simple: members become part of a larger community
              where collective participation can provide meaningful support
              to the family of a member when an unfortunate loss occurs.
            </p>

            <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
              LJKA aims to build this community first across Uttar Pradesh
              and eventually expand its presence across India.
            </p>
          </div>


          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--ljka-primary)] text-xl text-[var(--ljka-gold)]">
              <FaUsers />
            </div>

            <h3 className="mt-5 text-xl font-bold text-[var(--ljka-primary)]">
              A community built together
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Every member represents one part of a larger community.
              Together, those individual members create the strength needed
              to support one another.
            </p>

            <div className="mt-6 h-px bg-gray-100" />

            <p className="mt-5 text-sm font-semibold text-[var(--ljka-primary)]">
              Help · Trust · Humanity
            </p>

          </div>

        </div>
      </section>


      {/* ================= PURPOSE ================= */}
      <section className="bg-white border-y border-gray-100">

        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">

          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
              Our Purpose
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[var(--ljka-primary)] sm:text-4xl">
              One community. One responsibility.
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base">
              LJKA seeks to create a structured community where members can
              collectively stand beside the family of a deceased member,
              subject to the association's applicable rules, verification
              process and eligibility conditions.
            </p>
          </div>


          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {values.map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-gray-200 bg-[var(--ljka-bg)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--ljka-gold)]/40 hover:shadow-md"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--ljka-primary)] text-[var(--ljka-gold)]">
                  {item.icon}
                </div>

                <h3 className="mt-4 font-bold text-[var(--ljka-primary)]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {item.text}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>


      {/* ================= HOW WE SEE THE COMMUNITY ================= */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

          <div className="rounded-2xl bg-[var(--ljka-primary)] p-7 text-white sm:p-9">

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
              Our Philosophy
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              When one family needs support,
              <span className="block text-[var(--ljka-gold)]">
                the community stands together.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/65">
              LJKA is based on the belief that collective responsibility can
              create a meaningful support system. The strength of the
              association comes from its members and their willingness to
              participate in the community.
            </p>

          </div>


          <div>

            <div className="space-y-7">

              {[
                ["01", "Become part of the community", "Individuals join LJKA and become members of a growing community."],
                ["02", "Build collective strength", "A larger and responsible membership creates a stronger support network."],
                ["03", "Support when it matters", "When an eligible unfortunate event occurs, the community can stand beside the affected family according to LJKA rules."],
              ].map(([number, title, text]) => (
                <div key={number} className="flex gap-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--ljka-gold)]/40 text-xs font-bold text-[var(--ljka-gold)]">
                    {number}
                  </div>

                  <div>
                    <h3 className="font-bold text-[var(--ljka-primary)]">
                      {title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      {text}
                    </p>
                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>
      </section>


      {/* ================= VISION ================= */}
      <section className="border-y border-gray-100 bg-[#f4f6f8]">

        <div className="mx-auto max-w-7xl px-5 py-14 text-center sm:px-6 sm:py-18 lg:px-8 lg:py-20">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
            Our Vision
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">
            From a local community to a nationwide network.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            LJKA is intended to grow from its roots in Uttar Pradesh into a
            wider community across India, bringing together people who believe
            in mutual support and collective responsibility.
          </p>

          <div className="mx-auto mt-8 h-px max-w-md bg-gradient-to-r from-transparent via-[var(--ljka-gold)] to-transparent" />

          <p className="mt-6 text-sm font-semibold text-[var(--ljka-primary)]">
            Uttar Pradesh&nbsp;&nbsp;→&nbsp;&nbsp;India
          </p>

        </div>
      </section>

    </div>
  );
};

export default AboutUs;