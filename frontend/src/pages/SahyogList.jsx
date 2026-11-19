import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHandHoldingHeart,
  FaHeart,
  FaArrowRight,
} from "react-icons/fa";

const SahyogList = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Recent Donations / Sahyog",
      description:
        "View recent contributions made by LJKA members towards verified Sahyog cases.",
      to: "/sahyog-list/donations",
      icon: FaHandHoldingHeart,
    },
    {
      title: "Late Members / Sahyog Cases",
      description:
        "View Sahyog cases related to late members and the support being provided.",
      to: "/sahyog-list/late-members",
      icon: FaHeart,
    },
  ];

  return (
    <main className="min-h-[calc(100vh-112px)] bg-[var(--ljka-bg)]">
      <section className="mx-auto flex w-full max-w-6xl flex-col px-5 py-7 sm:px-8 sm:py-9 lg:px-10">

        {/* =========================
            PAGE HEADER
        ========================= */}
        <div className="mb-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--ljka-gold-dark)]">
            LJKA Community Support
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--ljka-primary)] sm:text-[34px]">
            Sahyog
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--ljka-muted)]">
            Explore verified community support records and Sahyog cases.
          </p>
        </div>

        {/* =========================
            CARDS
        ========================= */}
        <div className="grid items-stretch gap-4 md:grid-cols-2">
          {cards.map(({ title, description, to, icon: Icon }) => (
            <button
              key={to}
              type="button"
              onClick={() => navigate(to)}
              className="
                group
                relative
                flex
                min-h-[180px]
                w-full
                flex-col
                overflow-hidden
                rounded-[22px]
                border
                border-[var(--ljka-border-light)]
                bg-white
                p-5 sm:p-6
                text-left
                shadow-[var(--ljka-shadow-sm)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[var(--ljka-shadow-md)]
                focus:outline-none
                focus:ring-2
                focus:ring-[var(--ljka-primary)]
                focus:ring-offset-2
              "
            >
              {/* Subtle top accent */}
              <div
                className="
                  absolute
                  inset-x-0
                  top-0
                  h-[3px]
                  bg-[var(--ljka-primary)]
                  opacity-70
                  transition-opacity
                  group-hover:opacity-100
                "
              />

              {/* Icon + Arrow */}
              <div className="flex items-center justify-between">
                <div
                  className="
                    grid
                  h-12
                  w-12
                    place-items-center
                    rounded-2xl
                    bg-[var(--ljka-primary-bg)]
                  text-xl
                    text-[var(--ljka-primary)]
                    transition-all
                    duration-300
                    group-hover:scale-105
                    group-hover:bg-[var(--ljka-primary)]
                    group-hover:text-white
                  "
                >
                  <Icon />
                </div>

                <div
                  className="
                    grid
                    h-10
                    w-10
                    place-items-center
                    rounded-full
                    border
                    border-[var(--ljka-border-light)]
                    bg-white
                    text-[var(--ljka-primary)]
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                    group-hover:border-[var(--ljka-primary)]
                  "
                >
                  <FaArrowRight className="text-xs" />
                </div>
              </div>

              {/* Content */}
              <div className="mt-4">
                <h2 className="text-lg font-bold tracking-tight text-[var(--ljka-primary)]">
                  {title}
                </h2>

                <p className="mt-1.5 max-w-md text-sm leading-5 text-[var(--ljka-muted)]">
                  {description}
                </p>
              </div>

              {/* Bottom action */}
              <div className="mt-auto flex items-center pt-4 text-sm font-bold text-[var(--ljka-primary)]">
                View details

                <span
                  className="
                    ml-2
                    text-[var(--ljka-gold-dark)]
                    transition-all
                    duration-300
                    group-hover:ml-3
                  "
                >
                  →
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Small bottom spacing only */}
        <div className="h-2 sm:h-3" />
      </section>
    </main>
  );
};

export default SahyogList;
