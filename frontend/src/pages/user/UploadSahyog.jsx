import React from "react";
import {
  FaArrowRight,
  FaHandsHelping,
  FaHeart,
  FaShieldAlt,
} from "react-icons/fa";

const UploadSahyog = () => {
  return (
    <main className="min-h-screen bg-[var(--ljka-bg)]">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[1100px] items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full rounded-3xl border border-[var(--ljka-border-light)] bg-white px-6 py-12 text-center shadow-[var(--ljka-shadow-md)] sm:px-12 sm:py-16">

          {/* Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--ljka-primary-bg)] text-3xl text-[var(--ljka-primary)]">
            <FaHandsHelping />
          </div>

          {/* Label */}
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold-dark)]">
            Upload Sahyog
          </p>

          {/* Heading */}
          <h1 className="mt-3 text-3xl font-bold text-[var(--ljka-primary)] sm:text-4xl">
            Coming Soon
          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
            The Sahyog submission feature will be available here soon.
            You will be able to submit your Sahyog details and supporting
            information through your LJKA member portal.
          </p>

          {/* Features */}
          <div className="mx-auto mt-9 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
            <InfoPoint
              icon={<FaHandsHelping />}
              text="Submit Sahyog"
            />

            <InfoPoint
              icon={<FaHeart />}
              text="Support Others"
            />

            <InfoPoint
              icon={<FaShieldAlt />}
              text="Verified Records"
            />
          </div>

          {/* Bottom Message */}
          <div className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ljka-primary)]">
            We are working on this feature
            <FaArrowRight className="text-xs text-[var(--ljka-gold-dark)]" />
          </div>
        </div>
      </section>
    </main>
  );
};

const InfoPoint = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[var(--ljka-bg)] px-4 py-3">
      <span className="text-[var(--ljka-primary)]">
        {icon}
      </span>

      <span className="text-xs font-semibold text-[var(--ljka-text)]">
        {text}
      </span>
    </div>
  );
};

export default UploadSahyog;