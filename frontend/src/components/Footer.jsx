import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaHeart,
  FaShieldAlt,
  FaUsers,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[var(--ljka-primary)] text-white">

      {/* =========================================================
          MAIN FOOTER
      ========================================================= */}
      <div className="relative overflow-hidden">

        {/* SOFT DECORATIVE BACKGROUND */}
        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-0 top-0 h-full w-[45%] bg-gradient-to-br from-white/[0.045] via-transparent to-transparent" />

          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[var(--ljka-gold)]/[0.07] blur-3xl" />

          <div className="absolute -bottom-32 left-[35%] h-64 w-64 rounded-full bg-white/[0.025] blur-3xl" />

        </div>


        <div className="relative mx-auto max-w-[1450px] px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">

          {/* =====================================================
              TOP BRAND / MOTTO STRIP
          ===================================================== */}
          <div className="mb-12 flex flex-col gap-7 border-b border-white/10 pb-10 lg:flex-row lg:items-center lg:justify-between">

            {/* BRAND */}
            <div className="flex items-center gap-4">

              <img
                src="/img/Lakhdaatar_Logo.png"
                alt="Lakhdaatar Jeevan Kalyan Association"
                className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
              />

              <div>

                <h2 className="text-lg font-bold leading-tight text-white sm:text-xl">
                  <span className="block">
                    Lakhdaatar Jeevan
                  </span>

                  <span className="block">
                    Kalyan Association
                  </span>
                </h2>

                <p
                  className="mt-1 text-[11px] font-medium text-white/55 sm:text-xs"
                  style={{
                    fontFamily: "'Noto Serif Devanagari', serif",
                  }}
                >
                  लखदातार जीवन कल्याण एसोसिएशन
                </p>

              </div>

            </div>


            {/* MOTTO */}
            <div className="lg:text-right">

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ljka-gold)]">
                Our Guiding Principle
              </p>

              <p
                className="mt-1 text-xl font-bold text-white sm:text-2xl"
                style={{
                  fontFamily: "'Noto Serif Devanagari', serif",
                }}
              >
                सेवा परमो धर्मः
              </p>

              <p className="mt-0.5 text-xs font-medium text-white/55">
                Service is the Highest Duty
              </p>

            </div>

          </div>


          {/* =====================================================
              CONTENT GRID
          ===================================================== */}
          <div className="grid grid-cols-1 gap-11 sm:grid-cols-2 lg:grid-cols-[1.55fr_1fr_1fr_1fr] lg:gap-10">


            {/* ===================================================
                ABOUT / BRAND
            =================================================== */}
            <div>

              <p className="max-w-md text-sm leading-7 text-white/60">
                LJKA is a community built around trust, humanity, collective
                responsibility and mutual support — bringing people together
                to stand with one another when support is needed most.
              </p>


              {/* VALUES */}
              <div className="mt-6 flex flex-wrap gap-2">

                <FooterBadge
                  icon={<FaUsers />}
                  text="Community"
                />

                <FooterBadge
                  icon={<FaShieldAlt />}
                  text="Trust"
                />

                <FooterBadge
                  icon={<FaHeart />}
                  text="Humanity"
                />

              </div>


              {/* REGISTRATION */}
              <div className="mt-6 inline-flex items-center rounded-lg border border-[var(--ljka-gold)]/20 bg-white/[0.04] px-3.5 py-2">

                <p className="text-[11px] text-white/45">
                  Registration No.
                </p>

                <span className="mx-2 h-3.5 w-px bg-white/15" />

                <p className="text-[11px] font-semibold text-[var(--ljka-gold-light)]">
                  102/2026
                </p>

              </div>

            </div>


            {/* ===================================================
                EXPLORE
            =================================================== */}
            <div>

              <FooterHeading text="Explore LJKA" />

              <div className="flex flex-col gap-3">

                <FooterLink to="/" text="Home" />

                <FooterLink
                  to="/about"
                  text="About LJKA"
                />

                <FooterLink
                  to="/vyawastha-list"
                  text="How It Works"
                />

                <FooterLink
                  to="/user-list"
                  text="Members"
                />

                <FooterLink
                  to="/sahyog-list"
                  text="Sahyog"
                />

              </div>

            </div>


            {/* ===================================================
                MEMBER AREA
            =================================================== */}
            <div>

              <FooterHeading text="Member Area" />

              <div className="flex flex-col gap-3">

                <FooterLink
                  to="/register"
                  text="Become a Member"
                />

                <FooterLink
                  to="/login"
                  text="Member Login"
                />

                <FooterLink
                  to="/niyamawali"
                  text="Niyamawali"
                />

                <FooterLink
                  to="/user-list"
                  text="Member List"
                />

                <FooterLink
                  to="/sahyog-list"
                  text="Sahyog List"
                />

              </div>

            </div>


            {/* ===================================================
                CONTACT
            =================================================== */}
            <div>

              <FooterHeading text="Contact LJKA" />

              <div className="flex flex-col gap-4">

                {/* PHONE */}
                <a
                  href="tel:+919194068237"
                  aria-label="Call LJKA Support at +91 91940 68237"
                  className="group flex items-start gap-3 text-sm text-white/60 transition hover:text-white"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-[var(--ljka-gold)] transition group-hover:bg-[var(--ljka-gold)] group-hover:text-[var(--ljka-primary)]">
                    <FaPhoneAlt className="text-xs" />
                  </span>

                  <span>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-white/35">
                      Call / Support
                    </span>

                    <span className="mt-0.5 block font-semibold text-white/80">
                      +91 91940 68237
                    </span>
                  </span>
                </a>

                {/* EMAIL */}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=lakhdatarsupport@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Email LJKA Support"
                  className="group flex items-start gap-3 text-sm text-white/60 transition hover:text-white"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-[var(--ljka-gold)] transition group-hover:bg-[var(--ljka-gold)] group-hover:text-[var(--ljka-primary)]">
                    <FaEnvelope className="text-xs" />
                  </span>

                  <span>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-white/35">
                      Email Support
                    </span>

                    <span className="mt-0.5 block text-xs font-semibold text-white/80">
                      lakhdatarsupport@gmail.com
                    </span>
                  </span>
                </a>

                {/* WHATSAPP CHANNEL */}
                <a
                  href="https://whatsapp.com/channel/0029Vb9RkLj29757RHY52m39"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open LJKA WhatsApp Channel"
                  className="group flex items-start gap-3 text-sm text-white/60 transition hover:text-white"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-[var(--ljka-gold)] transition group-hover:bg-[var(--ljka-gold)] group-hover:text-[var(--ljka-primary)]">
                    <FaWhatsapp className="text-xs" />
                  </span>

                  <span>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-white/35">
                      WhatsApp Channel
                    </span>

                    <span className="mt-0.5 block text-xs font-semibold text-white/80">
                      Join LJKA Channel
                    </span>
                  </span>
                </a>


                <div className="mt-1 h-px w-full bg-white/10" />


                {/* LEGAL */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/45">

                  <Link
                    to="/privacy-policy"
                    className="transition hover:text-white"
                  >
                    Privacy Policy
                  </Link>

                  <Link
                    to="/terms-conditions"
                    className="transition hover:text-white"
                  >
                    Terms & Conditions
                  </Link>

                </div>

              </div>

            </div>

          </div>


          {/* =====================================================
              SOCIAL + CTA
          ===================================================== */}
          <div className="mt-12 flex flex-col gap-7 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">

            {/* SOCIAL */}
            <div>

              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                Connect With LJKA
              </p>

              <div className="flex items-center gap-2">

                <SocialIcon
                  icon={<FaFacebookF />}
                  label="Facebook"
                  href="https://www.facebook.com/share/1JXzuNSZmp/"
                />

                <SocialIcon
                  icon={<FaInstagram />}
                  label="Instagram"
                  href="https://www.instagram.com/ljk_association?stkn=MTNqZGwzYzZ6YzlwcA%3D%3D"
                />

                <SocialIcon
                  icon={<FaWhatsapp />}
                  label="WhatsApp Channel"
                  href="https://whatsapp.com/channel/0029Vb9RkLj29757RHY52m39"
                />

              </div>

            </div>


            {/* CTA */}
            <Link
              to="/register"
              className="group inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--ljka-gold)]/40 bg-[var(--ljka-gold)]/[0.08] px-4 py-3 text-xs font-bold text-[var(--ljka-gold-light)] transition hover:border-[var(--ljka-gold)] hover:bg-[var(--ljka-gold)] hover:text-[var(--ljka-primary)]"
            >
              Become a Member

              <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
            </Link>

          </div>

        </div>

      </div>


      {/* =========================================================
          BOTTOM BAR
      ========================================================= */}
      <div className="border-t border-white/[0.06] bg-[var(--ljka-primary-dark)]">

        <div className="mx-auto flex max-w-[1450px] flex-col items-center justify-between gap-2 px-5 py-5 text-center sm:flex-row sm:px-8 sm:text-left lg:px-12">

          <p className="text-[11px] leading-5 text-white/40">
            © {year} Lakhdaatar Jeevan Kalyan Association (LJKA).
            All Rights Reserved.
          </p>

          <p className="text-[10px] font-medium text-white/25">
            Sewa Parmo Dharma
          </p>

        </div>

      </div>

    </footer>
  );
};


/* =============================================================
   FOOTER HEADING
============================================================= */

const FooterHeading = ({ text }) => (
  <div className="mb-5">

    <h4 className="text-sm font-bold text-white">
      {text}
    </h4>

    <div className="mt-2 h-[2px] w-7 rounded-full bg-[var(--ljka-gold)]" />

  </div>
);


/* =============================================================
   FOOTER BADGE
============================================================= */

const FooterBadge = ({ icon, text }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs font-medium text-white/65">

    <span className="text-[var(--ljka-gold)]">
      {icon}
    </span>

    {text}

  </span>
);


/* =============================================================
   FOOTER LINK
============================================================= */

const FooterLink = ({ to, text }) => (
  <Link
    to={to}
    className="group flex w-fit items-center gap-2 text-sm text-white/55 transition hover:translate-x-0.5 hover:text-white"
  >

    <span className="h-1 w-1 rounded-full bg-[var(--ljka-gold)] opacity-0 transition group-hover:opacity-100" />

    {text}

  </Link>
);


/* =============================================================
   SOCIAL ICON
============================================================= */

const SocialIcon = ({ icon, label, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm text-white/55 transition hover:border-[var(--ljka-gold)]/50 hover:bg-[var(--ljka-gold)] hover:text-[var(--ljka-primary)]"
  >
    {icon}
  </a>
);


export default Footer;