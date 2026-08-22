import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaHeart,
  FaShieldAlt,
  FaUsers,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[var(--ljka-primary)] text-white">

      <div className="relative overflow-hidden">

        {/* SOFT BACKGROUND EFFECT */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-full w-[55%] bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />

          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[var(--ljka-gold)]/[0.06] blur-3xl" />
        </div>


        <div className="relative mx-auto max-w-7xl px-5 py-11 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">

            {/* =====================================================
                BRAND
                ===================================================== */}

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ljka-gold)] bg-white/10 text-lg font-bold text-[var(--ljka-gold-light)] shadow-sm backdrop-blur-sm">
                  LJ
                </div>

                <div>
                  <h3 className="text-lg font-bold leading-tight text-white">
                    Lakhdaatar Jeevan
                    <br />
                    Kalyan Association
                  </h3>

                  <p
                    className="mt-1 text-xs text-[var(--ljka-gold-light)]"
                    style={{
                      fontFamily: "'Noto Serif Devanagari', serif",
                    }}
                  >
                    लखदातार जीवन कल्याण एसोसिएशन
                  </p>
                </div>

              </div>


              <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
                LJKA is built around trust, humanity, collective responsibility
                and community support — standing together for families when they
                need it most.
              </p>


              {/* VALUES */}

              <div className="mt-5 flex flex-wrap gap-2.5">

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

              <div className="mt-6 inline-flex rounded-md border border-[var(--ljka-gold)]/25 bg-white/[0.04] px-3 py-1.5">

                <p className="text-[11px] font-medium text-white/55">
                  Registration No. —
                  <span className="ml-1 text-[var(--ljka-gold-light)]">
                    102/2026
                  </span>
                </p>

              </div>

            </div>


            {/* =====================================================
                EXPLORE
                ===================================================== */}

            <div>

              <FooterHeading text="Explore LJKA" />

              <div className="flex flex-col gap-3 text-sm text-white/60">

                <FooterLink to="/" text="Home" />
                <FooterLink to="/about" text="About LJKA" />
                <FooterLink to="/vyawastha-list" text="How It Works" />
                <FooterLink to="/user-list" text="Members" />
                <FooterLink to="/sahyog-list" text="Sahyog" />

              </div>

            </div>


            {/* =====================================================
                MEMBER AREA
                ===================================================== */}

            <div>

              <FooterHeading text="Member Area" />

              <div className="flex flex-col gap-3 text-sm text-white/60">

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


            {/* =====================================================
                CONTACT
                ===================================================== */}

            <div>

              <FooterHeading text="Contact & Legal" />

              <div className="flex flex-col gap-3 text-sm text-white/60">

                <Link
                  to="/contact"
                  className="group flex items-center gap-2 transition hover:text-white"
                >
                  <FaPhoneAlt className="text-xs text-[var(--ljka-gold)]" />

                  <span>Contact LJKA</span>
                </Link>


                <Link
                  to="/contact"
                  className="group flex items-center gap-2 transition hover:text-white"
                >
                  <FaEnvelope className="text-xs text-[var(--ljka-gold)]" />

                  <span>Email / Support</span>
                </Link>


                <FooterLink
                  to="/privacy-policy"
                  text="Privacy Policy"
                />

                <FooterLink
                  to="/terms-conditions"
                  text="Terms & Conditions"
                />

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =========================================================
          BOTTOM BAR — DARKER MAROON
          ========================================================= */}

      <div className="border-t border-white/10 bg-[var(--ljka-primary-dark)]">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">

          <p className="text-white/45">
            © {year} Lakhdaatar Jeevan Kalyan Association (LJKA).
            All Rights Reserved.
          </p>

          <div className="flex items-center gap-2 font-medium text-white/45">

            <span>Help</span>

            <span className="text-[var(--ljka-gold)]">
              •
            </span>

            <span>Trust</span>

            <span className="text-[var(--ljka-gold)]">
              •
            </span>

            <span>Humanity</span>

          </div>

        </div>

      </div>

    </footer>
  );
};


/* =========================================================
   FOOTER HEADING
   ========================================================= */

const FooterHeading = ({ text }) => (
  <div className="mb-5">
    <h4 className="text-sm font-bold text-white">
      {text}
    </h4>

    <div className="mt-2 h-[2px] w-6 rounded-full bg-[var(--ljka-gold)]" />
  </div>
);


/* =========================================================
   FOOTER BADGE
   ========================================================= */

const FooterBadge = ({ icon, text }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm">

    <span className="text-[var(--ljka-gold)]">
      {icon}
    </span>

    {text}

  </span>
);


/* =========================================================
   FOOTER LINK
   ========================================================= */

const FooterLink = ({ to, text }) => (
  <Link
    to={to}
    className="group flex w-fit items-center gap-1.5 transition hover:translate-x-0.5 hover:text-white"
  >
    <span className="h-1 w-1 rounded-full bg-[var(--ljka-gold)] opacity-0 transition group-hover:opacity-100" />

    {text}
  </Link>
);


export default Footer;

// import React from "react";
// import { Link } from "react-router-dom";
// import { FaArrowRight, FaHeart, FaShieldAlt, FaUsers, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

// const Footer = () => {
//   const year = new Date().getFullYear();

//   return (
//     <footer className="w-full bg-[var(--ljka-primary)] text-white">

//       {/* =========================================================
//           TOP CTA
//           ========================================================= */}

//       <div className="border-b border-white/10">
//         <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

//           <div>
//             <div className="mb-2 flex items-center gap-2">
//               <span className="h-1.5 w-7 rounded-full bg-[var(--ljka-gold)]" />
//               <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ljka-gold)]">Together for a stronger community</p>
//             </div>

//             <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Be part of the LJKA community.</h2>

//             <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">Join a community built on trust, humanity and collective responsibility.</p>
//           </div>

//           <div className="flex flex-col gap-3 sm:flex-row">
//             <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--ljka-gold)] px-5 py-3 text-sm font-bold text-[var(--ljka-text)] shadow-sm transition hover:bg-[var(--ljka-gold-light)] hover:shadow-md">
//               Become a Member
//               <FaArrowRight className="text-xs" />
//             </Link>

//             <Link to="/contact" className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-[var(--ljka-gold)] hover:bg-white/10 hover:text-[var(--ljka-gold-light)]">Contact LJKA</Link>
//           </div>

//         </div>
//       </div>


//       {/* =========================================================
//           MAIN FOOTER
//           ========================================================= */}

//       <div className="mx-auto max-w-7xl px-5 py-11 sm:px-6 lg:px-8">

//         <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">

//           {/* BRAND */}
//           <div>

//             <div className="flex items-center gap-3">

//               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ljka-gold)] bg-white/5 text-lg font-bold text-[var(--ljka-gold)]">LJ</div>

//               <div>
//                 <h3 className="text-lg font-bold leading-tight text-white">Lakhdaatar Jeevan<br />Kalyan Association</h3>
//                 <p className="mt-1 text-xs text-[var(--ljka-gold-light)]" style={{ fontFamily: "'Noto Serif Devanagari', serif" }}>लखदातार जीवन कल्याण एसोसिएशन</p>
//               </div>

//             </div>

//             <p className="mt-5 max-w-md text-sm leading-7 text-white/65">LJKA is built around trust, humanity, collective responsibility and community support — standing together for families when they need it most.</p>

//             <div className="mt-5 flex flex-wrap gap-2.5">

//               <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
//                 <FaUsers className="text-[var(--ljka-gold)]" />
//                 Community
//               </span>

//               <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
//                 <FaShieldAlt className="text-[var(--ljka-gold)]" />
//                 Trust
//               </span>

//               <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
//                 <FaHeart className="text-[var(--ljka-gold)]" />
//                 Humanity
//               </span>

//             </div>

//             <div className="mt-6 inline-flex rounded-md border border-[var(--ljka-gold)]/25 bg-[var(--ljka-gold)]/5 px-3 py-1.5">
//               <p className="text-[11px] font-medium text-white/55">Registration No. — <span className="text-[var(--ljka-gold-light)]">102/2026</span></p>
//             </div>

//           </div>


//           {/* EXPLORE */}
//           <div>

//             <h4 className="mb-5 text-sm font-bold text-white">Explore LJKA</h4>

//             <div className="flex flex-col gap-3 text-sm text-white/60">

//               <Link to="/" className="transition hover:translate-x-0.5 hover:text-[var(--ljka-gold-light)]">Home</Link>
//               <Link to="/about" className="transition hover:translate-x-0.5 hover:text-[var(--ljka-gold-light)]">About LJKA</Link>
//               <Link to="/vyawastha-list" className="transition hover:translate-x-0.5 hover:text-[var(--ljka-gold-light)]">How It Works</Link>
//               <Link to="/user-list" className="transition hover:translate-x-0.5 hover:text-[var(--ljka-gold-light)]">Members</Link>
//               <Link to="/sahyog-list" className="transition hover:translate-x-0.5 hover:text-[var(--ljka-gold-light)]">Sahyog</Link>

//             </div>

//           </div>


//           {/* MEMBERS */}
//           <div>

//             <h4 className="mb-5 text-sm font-bold text-white">Member Area</h4>

//             <div className="flex flex-col gap-3 text-sm text-white/60">

//               <Link to="/register" className="transition hover:translate-x-0.5 hover:text-[var(--ljka-gold-light)]">Become a Member</Link>
//               <Link to="/login" className="transition hover:translate-x-0.5 hover:text-[var(--ljka-gold-light)]">Member Login</Link>
//               <Link to="/niyamawali" className="transition hover:translate-x-0.5 hover:text-[var(--ljka-gold-light)]">Niyamawali</Link>
//               <Link to="/user-list" className="transition hover:translate-x-0.5 hover:text-[var(--ljka-gold-light)]">Member List</Link>
//               <Link to="/sahyog-list" className="transition hover:translate-x-0.5 hover:text-[var(--ljka-gold-light)]">Sahyog List</Link>

//             </div>

//           </div>


//           {/* CONTACT */}
//           <div>

//             <h4 className="mb-5 text-sm font-bold text-white">Contact & Legal</h4>

//             <div className="flex flex-col gap-3 text-sm text-white/60">

//               <Link to="/contact" className="flex items-center gap-2 transition hover:text-[var(--ljka-gold-light)]">
//                 <FaPhoneAlt className="text-xs text-[var(--ljka-gold)]" />
//                 Contact LJKA
//               </Link>

//               <Link to="/contact" className="flex items-center gap-2 transition hover:text-[var(--ljka-gold-light)]">
//                 <FaEnvelope className="text-xs text-[var(--ljka-gold)]" />
//                 Email / Support
//               </Link>

//               <Link to="/privacy-policy" className="transition hover:text-[var(--ljka-gold-light)]">Privacy Policy</Link>
//               <Link to="/terms-conditions" className="transition hover:text-[var(--ljka-gold-light)]">Terms & Conditions</Link>

//             </div>

//           </div>

//         </div>


//         {/* =========================================================
//             BOTTOM BAR
//             ========================================================= */}

//         <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">

//           <p className="text-white/45">© {year} Lakhdaatar Jeevan Kalyan Association (LJKA). All Rights Reserved.</p>

//           <div className="flex items-center gap-2 font-medium text-white/40">
//             <span>Help</span>
//             <span className="text-[var(--ljka-gold)]">•</span>
//             <span>Trust</span>
//             <span className="text-[var(--ljka-gold)]">•</span>
//             <span>Humanity</span>
//           </div>

//         </div>

//       </div>

//     </footer>
//   );
// };

// export default Footer;

// import React from "react";
// import { Link } from "react-router-dom";
// import { FaArrowRight, FaHeart, FaShieldAlt, FaUsers, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

// const Footer = () => {
//   const year = new Date().getFullYear();

//   return (
//     <footer className="w-full bg-[var(--ljka-primary)] text-white">

//       {/* ================= TOP CTA ================= */}
//       <div className="border-b border-white/10">
//         <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

//           <div>

//              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ljka-gold)]">
//               Together for a stronger community
//             </p>


//             <h2 className="text-2xl font-bold text-white sm:text-3xl">
//               Be part of the LJKA community.
//             </h2>

//             <p className="mt-2 text-sm text-white/60">
//               Join a community built on trust, humanity and collective responsibility.
//             </p>
//           </div>

//            <div className="flex flex-col gap-3 sm:flex-row">

//             <Link
//               to="/register"
//               className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--ljka-gold)] px-5 py-3 text-sm font-bold text-[var(--ljka-primary)] transition hover:bg-[#f0d791]"
//             >
//               Become a Member
//               <FaArrowRight className="text-xs" />
//             </Link>

//             <Link
//               to="/contact"
//               className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
//             >
//               Contact LJKA
//             </Link>

//           </div>

//         </div>
//       </div>

//       {/* ================= MAIN FOOTER ================= */}
//       <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">

//         <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">


//           {/* ================= BRAND ================= */}
//           <div>

//             <div className="flex items-center gap-3">

//               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--ljka-gold)]/50 bg-white/5 text-lg font-bold text-[var(--ljka-gold)]">
//                 LJ
//               </div>

//               <div>
//                 <h3 className="text-lg font-bold leading-tight">
//                   Lakhdaatar Jeevan
//                   <br />
//                   Kalyan Association
//                 </h3>

//                 <p
//                   className="mt-1 text-xs text-[var(--ljka-gold)]"
//                   style={{ fontFamily: "'Noto Serif Devanagari', serif" }}
//                 >
//                   लखदातार जीवन कल्याण एसोसिएशन
//                 </p>
//               </div>

//             </div>


//             <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
//               LJKA is built around the values of trust, humanity, collective
//               responsibility and community support — standing together for
//               families when they need it most.
//             </p>


//             <div className="mt-5 flex flex-wrap gap-3">

//               <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
//                 <FaUsers className="text-[var(--ljka-gold)]" />
//                 Community
//               </span>

//               <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
//                 <FaShieldAlt className="text-[var(--ljka-gold)]" />
//                 Trust
//               </span>

//               <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
//                 <FaHeart className="text-[var(--ljka-gold)]" />
//                 Humanity
//               </span>

//             </div>


//             <p className="mt-5 text-xs text-white/45">
//               Registration No. — 102/2026
//             </p>

//           </div>


//           {/* ================= QUICK LINKS ================= */}
//           <div>

//             <h4 className="mb-4 text-sm font-bold text-white">
//               Explore LJKA
//             </h4>

//             <div className="flex flex-col gap-3 text-sm text-white/60">

//               <Link to="/" className="transition hover:text-[var(--ljka-gold)]">
//                 Home
//               </Link>

//               <Link to="/about" className="transition hover:text-[var(--ljka-gold)]">
//                 About LJKA
//               </Link>

//               <Link to="/vyawastha-list" className="transition hover:text-[var(--ljka-gold)]">
//                 How It Works
//               </Link>

//               <Link to="/user-list" className="transition hover:text-[var(--ljka-gold)]">
//                 Members
//               </Link>

//               <Link to="/sahyog-list" className="transition hover:text-[var(--ljka-gold)]">
//                 Sahyog
//               </Link>

//             </div>

//           </div>


//           {/* ================= MEMBERS ================= */}
//           <div>

//             <h4 className="mb-4 text-sm font-bold text-white">
//               Member Area
//             </h4>

//             <div className="flex flex-col gap-3 text-sm text-white/60">

//               <Link to="/register" className="transition hover:text-[var(--ljka-gold)]">
//                 Become a Member
//               </Link>

//               <Link to="/login" className="transition hover:text-[var(--ljka-gold)]">
//                 Member Login
//               </Link>

//               <Link to="/niyamawali" className="transition hover:text-[var(--ljka-gold)]">
//                 Niyamawali
//               </Link>

//               <Link to="/user-list" className="transition hover:text-[var(--ljka-gold)]">
//                 Member List
//               </Link>

//               <Link to="/sahyog-list" className="transition hover:text-[var(--ljka-gold)]">
//                 Sahyog List
//               </Link>

//             </div>

//           </div>


//           {/* ================= CONTACT / LEGAL ================= */}
//           <div>

//             <h4 className="mb-4 text-sm font-bold text-white">
//               Contact & Legal
//             </h4>

//             <div className="flex flex-col gap-3 text-sm text-white/60">

//               <Link to="/contact" className="flex items-center gap-2 transition hover:text-[var(--ljka-gold)]">
//                 <FaPhoneAlt className="text-xs text-[var(--ljka-gold)]" />
//                 Contact LJKA
//               </Link>

//               <Link to="/contact" className="flex items-center gap-2 transition hover:text-[var(--ljka-gold)]">
//                 <FaEnvelope className="text-xs text-[var(--ljka-gold)]" />
//                 Email / Support
//               </Link>

//               <Link to="/privacy-policy" className="transition hover:text-[var(--ljka-gold)]">
//                 Privacy Policy
//               </Link>

//               <Link to="/terms-conditions" className="transition hover:text-[var(--ljka-gold)]">
//                 Terms & Conditions
//               </Link>

//             </div>

//           </div>

//         </div>


//         {/* ================= BOTTOM ================= */}
//         <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">

//           <p>
//             © {year} Lakhdaatar Jeevan Kalyan Association (LJKA).
//             All Rights Reserved.
//           </p>

//           <p className="text-white/35">
//             Help • Trust • Humanity
//           </p>

//         </div>

//       </div>

//     </footer>
//   );
// };

// export default Footer;