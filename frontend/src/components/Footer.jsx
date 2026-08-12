import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaHeart, FaShieldAlt, FaUsers, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[var(--ljka-primary)] text-white">

      {/* ================= TOP CTA ================= */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

          <div>

             <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
              Together for a stronger community
            </p>


            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Be part of the LJKA community.
            </h2>

            <p className="mt-2 text-sm text-white/60">
              Join a community built on trust, humanity and collective responsibility.
            </p>
          </div>

           <div className="flex flex-col gap-3 sm:flex-row">

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--ljka-gold)] px-5 py-3 text-sm font-bold text-[var(--ljka-primary)] transition hover:bg-[#f0d791]"
            >
              Become a Member
              <FaArrowRight className="text-xs" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
            >
              Contact LJKA
            </Link>

          </div>

        </div>
      </div>

      {/* ================= MAIN FOOTER ================= */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">


          {/* ================= BRAND ================= */}
          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--ljka-gold)]/50 bg-white/5 text-lg font-bold text-[var(--ljka-gold)]">
                LJ
              </div>

              <div>
                <h3 className="text-lg font-bold leading-tight">
                  Lakhdaatar Jeevan
                  <br />
                  Kalyan Association
                </h3>

                <p
                  className="mt-1 text-xs text-[var(--ljka-gold)]"
                  style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
                >
                  लखदातार जीवन कल्याण एसोसिएशन
                </p>
              </div>

            </div>


            <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
              LJKA is built around the values of trust, humanity, collective
              responsibility and community support — standing together for
              families when they need it most.
            </p>


            <div className="mt-5 flex flex-wrap gap-3">

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                <FaUsers className="text-[var(--ljka-gold)]" />
                Community
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                <FaShieldAlt className="text-[var(--ljka-gold)]" />
                Trust
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                <FaHeart className="text-[var(--ljka-gold)]" />
                Humanity
              </span>

            </div>


            <p className="mt-5 text-xs text-white/45">
              Registration No. — 102/2026
            </p>

          </div>


          {/* ================= QUICK LINKS ================= */}
          <div>

            <h4 className="mb-4 text-sm font-bold text-white">
              Explore LJKA
            </h4>

            <div className="flex flex-col gap-3 text-sm text-white/60">

              <Link to="/" className="transition hover:text-[var(--ljka-gold)]">
                Home
              </Link>

              <Link to="/about" className="transition hover:text-[var(--ljka-gold)]">
                About LJKA
              </Link>

              <Link to="/vyawastha-list" className="transition hover:text-[var(--ljka-gold)]">
                How It Works
              </Link>

              <Link to="/user-list" className="transition hover:text-[var(--ljka-gold)]">
                Members
              </Link>

              <Link to="/sahyog-list" className="transition hover:text-[var(--ljka-gold)]">
                Sahyog
              </Link>

            </div>

          </div>


          {/* ================= MEMBERS ================= */}
          <div>

            <h4 className="mb-4 text-sm font-bold text-white">
              Member Area
            </h4>

            <div className="flex flex-col gap-3 text-sm text-white/60">

              <Link to="/register" className="transition hover:text-[var(--ljka-gold)]">
                Become a Member
              </Link>

              <Link to="/login" className="transition hover:text-[var(--ljka-gold)]">
                Member Login
              </Link>

              <Link to="/niyamawali" className="transition hover:text-[var(--ljka-gold)]">
                Niyamawali
              </Link>

              <Link to="/user-list" className="transition hover:text-[var(--ljka-gold)]">
                Member List
              </Link>

              <Link to="/sahyog-list" className="transition hover:text-[var(--ljka-gold)]">
                Sahyog List
              </Link>

            </div>

          </div>


          {/* ================= CONTACT / LEGAL ================= */}
          <div>

            <h4 className="mb-4 text-sm font-bold text-white">
              Contact & Legal
            </h4>

            <div className="flex flex-col gap-3 text-sm text-white/60">

              <Link to="/contact" className="flex items-center gap-2 transition hover:text-[var(--ljka-gold)]">
                <FaPhoneAlt className="text-xs text-[var(--ljka-gold)]" />
                Contact LJKA
              </Link>

              <Link to="/contact" className="flex items-center gap-2 transition hover:text-[var(--ljka-gold)]">
                <FaEnvelope className="text-xs text-[var(--ljka-gold)]" />
                Email / Support
              </Link>

              <Link to="/privacy-policy" className="transition hover:text-[var(--ljka-gold)]">
                Privacy Policy
              </Link>

              <Link to="/terms-conditions" className="transition hover:text-[var(--ljka-gold)]">
                Terms & Conditions
              </Link>

            </div>

          </div>

        </div>


        {/* ================= BOTTOM ================= */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {year} Lakhdaatar Jeevan Kalyan Association (LJKA).
            All Rights Reserved.
          </p>

          <p className="text-white/35">
            Help • Trust • Humanity
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;