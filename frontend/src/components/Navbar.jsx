import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaArrowRight, FaUserCircle, FaHome, FaInfoCircle, FaUsers, FaHandsHelping, FaShieldAlt, FaFileAlt, FaPhoneAlt, FaHeart, FaStar } from "react-icons/fa";

const NAV_LINKS = [
  ["/", "Home", FaHome],
  ["/about", "About LJKA", FaInfoCircle],
  ["/user-list", "Members", FaUsers],
  ["/sahyog-list", "Sahyog", FaHandsHelping],
  ["/vyawastha-list", "Vyawastha", FaShieldAlt],
  ["/niyamawali", "Niyamawali", FaFileAlt],
  ["/contact", "Contact", FaPhoneAlt],
];

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <style>{`
        @keyframes ljka-logo-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,154,36,.22); }
          50% { box-shadow: 0 0 0 7px rgba(201,154,36,0); }
        }

        @keyframes ljka-orbit {
          from { transform: rotate(0deg) translateX(4px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(4px) rotate(-360deg); }
        }

        @keyframes ljka-shine {
          0% { transform: translateX(-130%); }
          55%, 100% { transform: translateX(130%); }
        }

        @keyframes ljka-mobile-enter {
          from { opacity: 0; transform: translateX(35px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes ljka-mobile-card {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes ljka-menu-bg {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(15px,-15px) scale(1.05); }
        }

        .ljka-logo-pulse { animation: ljka-logo-pulse 3s ease-in-out infinite; }
        .ljka-orbit { animation: ljka-orbit 8s linear infinite; }
        .ljka-shine { position: relative; overflow: hidden; }
        .ljka-shine::after { content: ""; position: absolute; inset: 0; width: 35%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent); transform: translateX(-130%); animation: ljka-shine 4s ease-in-out infinite; pointer-events: none; }
        .ljka-menu-bg { animation: ljka-menu-bg 7s ease-in-out infinite; }
        .ljka-mobile-card { animation: ljka-mobile-card .45s ease-out both; }

        .ljka-mobile-link:nth-child(1) { animation-delay: .05s; }
        .ljka-mobile-link:nth-child(2) { animation-delay: .09s; }
        .ljka-mobile-link:nth-child(3) { animation-delay: .13s; }
        .ljka-mobile-link:nth-child(4) { animation-delay: .17s; }
        .ljka-mobile-link:nth-child(5) { animation-delay: .21s; }
        .ljka-mobile-link:nth-child(6) { animation-delay: .25s; }
        .ljka-mobile-link:nth-child(7) { animation-delay: .29s; }

        .ljka-mobile-link {
          animation: ljka-mobile-enter .45s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .ljka-logo-pulse, .ljka-orbit, .ljka-shine::after, .ljka-menu-bg, .ljka-mobile-card, .ljka-mobile-link { animation: none; }
        }
      `}</style>

      {/* =========================================================
          DESKTOP / MAIN NAVBAR
          ========================================================= */}

      <header className={`relative z-50 w-full px-3 transition-all duration-300 sm:px-5 lg:px-7 ${scrolled ? "py-2" : "py-3 sm:py-4"}`}>
        <div className={`mx-auto max-w-[1500px] transition-all duration-300 ${scrolled ? "max-w-[1440px]" : ""}`}>

          <div className={`relative flex min-h-[70px] items-center rounded-2xl border px-3 transition-all duration-300 sm:px-4 lg:px-5 ${scrolled ? "border-[var(--ljka-border)] bg-[var(--ljka-card)]/95 shadow-[var(--ljka-shadow-md)] backdrop-blur-xl" : "border-[var(--ljka-border)]/70 bg-[var(--ljka-card)]/90 shadow-[var(--ljka-shadow-sm)] backdrop-blur-lg"}`}>

            {/* BRAND */}
            <button type="button" onClick={() => navigate("/")} className="group flex shrink-0 items-center gap-2.5 text-left sm:gap-3">

              <div className="relative">
                <div className="ljka-logo-pulse flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--ljka-gold)] bg-[var(--ljka-primary)] text-sm font-extrabold text-white shadow-md transition duration-300 group-hover:rotate-[-4deg] group-hover:scale-105 sm:h-11 sm:w-11 sm:text-base lg:h-12 lg:w-12 lg:text-lg">
                  LJ
                </div>

                <span className="ljka-orbit absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-[var(--ljka-gold)] text-[5px] text-[var(--ljka-text)]">
                  <FaStar />
                </span>
              </div>

              <div className="hidden leading-tight sm:block">
                <h1 className="whitespace-nowrap text-[13px] font-extrabold tracking-[-0.01em] text-[var(--ljka-primary)] md:text-[14px] lg:text-[15px] xl:text-[16px]">Lakhdaatar Jeevan Kalyan Association</h1>
                <p className="mt-1 whitespace-nowrap text-[9px] font-medium text-[var(--ljka-muted)] lg:text-[10px] xl:text-[11px]">लखदातार जीवन कल्याण एसोसिएशन</p>
              </div>

              <div className="sm:hidden">
                <p className="text-sm font-extrabold tracking-wide text-[var(--ljka-primary)]">LJKA</p>
                <p className="text-[8px] font-medium text-[var(--ljka-muted)]">Community • Trust • Humanity</p>
              </div>
            </button>


            {/* DESKTOP NAVIGATION */}
            <nav className="ml-auto hidden lg:flex lg:items-center">

              <div className="ml-5 flex items-center rounded-xl border border-[var(--ljka-border)] bg-[var(--ljka-bg)]/80 p-1 xl:ml-8">

                {NAV_LINKS.map(([path, name, Icon]) => (
                  <NavLink key={path} to={path} className={({ isActive }) => `group relative flex items-center gap-1.5 rounded-lg px-2.5 py-2.5 text-[11px] font-bold transition-all duration-200 xl:px-3 xl:text-[12px] ${isActive ? "bg-white text-[var(--ljka-primary)] shadow-sm" : "text-[var(--ljka-muted)] hover:bg-white/70 hover:text-[var(--ljka-primary)]"}`}>
                    {({ isActive }) => (
                      <>
                        <Icon className={`text-[10px] transition-transform duration-200 group-hover:scale-110 xl:text-[11px] ${isActive ? "text-[var(--ljka-gold)]" : ""}`} />
                        <span>{name}</span>
                        {isActive && <span className="absolute bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[var(--ljka-gold)]" />}
                      </>
                    )}
                  </NavLink>
                ))}

              </div>
            </nav>


            {/* DESKTOP ACTIONS */}
            <div className="ml-3 hidden items-center gap-2 xl:ml-5 lg:flex">

              <button type="button" onClick={() => navigate("/login")} className="group flex items-center gap-1.5 rounded-xl border border-[var(--ljka-border)] bg-[var(--ljka-card)] px-3 py-2.5 text-[11px] font-bold text-[var(--ljka-primary)] transition hover:-translate-y-0.5 hover:border-[var(--ljka-primary)] hover:bg-[var(--ljka-primary-bg)] xl:px-3.5 xl:text-xs">
                <FaUserCircle className="text-sm transition-transform group-hover:scale-110" />
                Login
              </button>

              <button type="button" onClick={() => navigate("/register")} className="ljka-shine group flex items-center gap-2 rounded-xl bg-[var(--ljka-primary)] px-3.5 py-2.5 text-[11px] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--ljka-primary-dark)] hover:shadow-md xl:px-4 xl:text-xs">
                <span>Become a Member</span>
                <FaArrowRight className="text-[9px] transition-transform duration-200 group-hover:translate-x-1" />
              </button>

            </div>


            {/* MOBILE MENU BUTTON */}
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--ljka-border)] bg-[var(--ljka-bg)] text-[var(--ljka-primary)] transition duration-200 hover:scale-105 hover:border-[var(--ljka-gold)] hover:text-[var(--ljka-gold)] lg:hidden">
              <FaBars className="text-base" />
            </button>

          </div>
        </div>
      </header>


      {/* =========================================================
          MOBILE OVERLAY
          ========================================================= */}

      <div className={`fixed inset-0 z-[60] bg-[var(--ljka-text)]/55 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} onClick={closeMenu} />


      {/* =========================================================
          MOBILE MENU
          ========================================================= */}

      <aside className={`fixed right-0 top-0 z-[70] h-[100dvh] w-full max-w-[430px] overflow-hidden bg-[var(--ljka-bg)] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* DECORATIVE BACKGROUND */}
        <div className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[var(--ljka-primary)]/10 blur-3xl ljka-menu-bg" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[var(--ljka-gold)]/10 blur-3xl ljka-menu-bg" />

        <div className="relative flex h-full flex-col">

          {/* MOBILE HEADER */}
          <div className="flex items-center justify-between border-b border-[var(--ljka-border)] bg-white/80 px-5 py-4 backdrop-blur-xl">

            <button type="button" onClick={() => { closeMenu(); navigate("/"); }} className="group flex items-center gap-3 text-left">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--ljka-gold)] bg-[var(--ljka-primary)] text-sm font-extrabold text-white shadow-sm transition group-hover:rotate-[-4deg]">
                LJ
              </div>

              <div>
                <p className="text-sm font-extrabold tracking-wide text-[var(--ljka-primary)]">LJKA</p>
                <p className="text-[8px] font-medium text-[var(--ljka-muted)]">Lakhdaatar Jeevan Kalyan Association</p>
              </div>

            </button>


            <button type="button" onClick={closeMenu} aria-label="Close menu" className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--ljka-border)] bg-white text-[var(--ljka-primary)] transition duration-300 hover:rotate-90 hover:border-[var(--ljka-danger)] hover:bg-[var(--ljka-danger)] hover:text-white">
              <FaTimes className="text-sm" />
            </button>

          </div>


          {/* MEMBERSHIP PROMO */}
          <div className="ljka-mobile-card relative mx-4 mt-5 overflow-hidden rounded-2xl bg-[var(--ljka-primary)] p-5 text-white shadow-[var(--ljka-shadow-md)]">

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--ljka-gold)]/15 blur-xl" />

            <div className="relative flex items-start justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-[var(--ljka-gold)]" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--ljka-gold-light)]">Founding Initiative</p>
                </div>

                <h2 className="mt-2 text-xl font-extrabold">First 11,000 Members</h2>
                <p className="mt-1 text-xs text-white/60">Registration is currently FREE</p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--ljka-gold)] text-[var(--ljka-text)] shadow-lg">
                <FaHeart />
              </div>

            </div>

            <button type="button" onClick={() => { closeMenu(); navigate("/register"); }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-xs font-bold text-[var(--ljka-primary)] transition hover:bg-[var(--ljka-gold-light)]">
              Join LJKA
              <FaArrowRight className="text-[9px]" />
            </button>

          </div>


          {/* NAVIGATION */}
          <div className="flex-1 overflow-y-auto px-4 py-5">

            <div className="mb-3 flex items-center justify-between px-2">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[var(--ljka-text-light)]">Explore LJKA</p>
              <span className="text-[9px] font-semibold text-[var(--ljka-muted)]">{NAV_LINKS.length} Pages</span>
            </div>

            <div className="space-y-1.5">

              {NAV_LINKS.map(([path, name, Icon], index) => (
                <NavLink key={path} to={path} onClick={closeMenu} className={({ isActive }) => `ljka-mobile-link group relative flex items-center gap-3 overflow-hidden rounded-xl border px-3 py-3 transition-all duration-200 ${isActive ? "border-[var(--ljka-primary)] bg-[var(--ljka-primary)] text-white shadow-sm" : "border-transparent bg-white/65 text-[var(--ljka-text)] hover:border-[var(--ljka-border)] hover:bg-white hover:shadow-sm"}`}>

                  {({ isActive }) => (
                    <>
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${isActive ? "bg-white/10 text-[var(--ljka-gold-light)]" : "bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)] group-hover:bg-[var(--ljka-primary)] group-hover:text-white"}`}>
                        <Icon className="text-xs" />
                      </span>

                      <span className="flex-1">
                        <span className={`block text-[13px] font-bold ${isActive ? "text-white" : "text-[var(--ljka-text)]"}`}>{name}</span>
                        <span className={`block text-[9px] ${isActive ? "text-white/55" : "text-[var(--ljka-muted)]"}`}>{index === 0 ? "LJKA home" : `Explore ${name}`}</span>
                      </span>

                      <span className={`flex h-7 w-7 items-center justify-center rounded-full transition ${isActive ? "bg-[var(--ljka-gold)] text-[var(--ljka-text)]" : "bg-[var(--ljka-bg)] text-[var(--ljka-muted)] group-hover:bg-[var(--ljka-primary)] group-hover:text-white"}`}>
                        <FaArrowRight className="text-[9px]" />
                      </span>

                      {isActive && <span className="absolute bottom-0 left-0 top-0 w-1 bg-[var(--ljka-gold)]" />}
                    </>
                  )}

                </NavLink>
              ))}

            </div>

          </div>


          {/* MOBILE BOTTOM ACTIONS */}
          <div className="border-t border-[var(--ljka-border)] bg-white/80 p-4 backdrop-blur-xl">

            <div className="grid grid-cols-2 gap-2">

              <NavLink to="/login" onClick={closeMenu} className="flex items-center justify-center gap-2 rounded-xl border border-[var(--ljka-border)] bg-white py-3 text-xs font-bold text-[var(--ljka-primary)] transition hover:border-[var(--ljka-primary)] hover:bg-[var(--ljka-primary-bg)]">
                <FaUserCircle />
                Login
              </NavLink>

              <NavLink to="/register" onClick={closeMenu} className="ljka-shine flex items-center justify-center gap-2 rounded-xl bg-[var(--ljka-primary)] py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--ljka-primary-dark)]">
                Join Now
                <FaArrowRight className="text-[9px]" />
              </NavLink>

            </div>

            <p className="mt-3 text-center text-[8px] font-medium text-[var(--ljka-muted)]">
              Help <span className="mx-1 text-[var(--ljka-gold)]">•</span> Trust <span className="mx-1 text-[var(--ljka-gold)]">•</span> Humanity
            </p>

          </div>

        </div>
      </aside>
    </>
  );
};

export default Navbar;

// import React, { useEffect, useState } from "react";
// import { useNavigate, NavLink } from "react-router-dom";
// import { FaBars, FaTimes, FaArrowRight, FaUserCircle } from "react-icons/fa";

// const NAV_LINKS = [
//   ["/", "Home"],
//   ["/about", "About LJKA"],
//   ["/user-list", "Members"],
//   ["/sahyog-list", "Sahyog"],
//   ["/vyawastha-list", "Vyawastha"],
//   ["/niyamawali", "Niyamawali"],
//   ["/contact", "Contact"],
// ];

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     document.body.style.overflow = menuOpen ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [menuOpen]);

//   const closeMenu = () => setMenuOpen(false);

//   return (
//     <>
//       {/* =========================================================
//           MAIN NAVBAR
//           ========================================================= */}

//       <header className="sticky top-0 z-50 w-full border-b border-[var(--ljka-border)] bg-[var(--ljka-card)]/95 shadow-[var(--ljka-shadow-sm)] backdrop-blur-md">
//         <div className="mx-auto max-w-[1440px] px-4 sm:px-6 xl:px-8">
//           <div className="flex min-h-[78px] items-center gap-5 xl:min-h-[84px] xl:gap-7">

//             {/* BRAND */}
//             <button type="button" onClick={() => navigate("/")} className="flex shrink-0 items-center gap-3 text-left">
//               <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--ljka-gold)] bg-[var(--ljka-primary)] text-base font-bold text-white shadow-sm xl:h-12 xl:w-12 xl:text-lg">LJ</div>

//               <div className="leading-tight">
//                 <h1 className="whitespace-nowrap text-[14px] font-bold tracking-[-0.01em] text-[var(--ljka-primary)] sm:text-[15px] xl:text-[17px]">Lakhdaatar Jeevan Kalyan Association</h1>
//                 <p className="mt-1 whitespace-nowrap text-[9px] font-medium text-[var(--ljka-muted)] sm:text-[10px] xl:text-[11px]">लखदातार जीवन कल्याण एसोसिएशन</p>
//               </div>
//             </button>

//             {/* DESKTOP NAVIGATION */}
//             <nav className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
//               <div className="flex items-center gap-0.5 xl:gap-1">
//                 {NAV_LINKS.map(([path, name]) => (
//                   <NavLink key={path} to={path} className={({ isActive }) => `relative whitespace-nowrap rounded-lg px-2.5 py-2.5 text-[12px] font-semibold transition-all xl:px-3 xl:text-[13px] ${isActive ? "bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]" : "text-[var(--ljka-muted)] hover:bg-[var(--ljka-primary-bg)] hover:text-[var(--ljka-primary)]"}`}>
//                     {({ isActive }) => (
//                       <>
//                         {name}
//                         <span className={`absolute bottom-1 left-3 right-3 h-[2px] origin-center rounded-full bg-[var(--ljka-gold)] transition-transform duration-200 ${isActive ? "scale-x-100" : "scale-x-0"}`} />
//                       </>
//                     )}
//                   </NavLink>
//                 ))}
//               </div>
//             </nav>

//             {/* DESKTOP ACTIONS */}
//             <div className="hidden shrink-0 items-center gap-2 lg:flex">
//               <button type="button" onClick={() => navigate("/login")} className="flex items-center gap-1.5 rounded-lg border border-[var(--ljka-border)] bg-[var(--ljka-card)] px-3 py-2.5 text-[12px] font-semibold text-[var(--ljka-primary)] transition hover:border-[var(--ljka-primary)] hover:bg-[var(--ljka-primary-bg)] xl:px-3.5 xl:text-[13px]">
//                 <FaUserCircle className="text-sm" />
//                 Login
//               </button>

//               <button type="button" onClick={() => navigate("/register")} className="rounded-lg bg-[var(--ljka-primary)] px-3.5 py-2.5 text-[12px] font-semibold whitespace-nowrap text-white shadow-sm transition hover:bg-[var(--ljka-primary-dark)] hover:shadow-md xl:px-4 xl:text-[13px]">
//                 Become a Member
//               </button>
//             </div>

//             {/* MOBILE / TABLET MENU BUTTON */}
//             <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--ljka-border)] bg-[var(--ljka-card)] text-[var(--ljka-primary)] transition hover:border-[var(--ljka-gold)] hover:text-[var(--ljka-gold)] lg:hidden">
//               <FaBars className="text-lg" />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* =========================================================
//           MOBILE OVERLAY
//           ========================================================= */}

//       {menuOpen && <div onClick={closeMenu} className="fixed inset-0 z-[60] bg-[var(--ljka-text)]/45 backdrop-blur-[2px] lg:hidden" />}

//       {/* =========================================================
//           MOBILE DRAWER
//           ========================================================= */}

//       <aside className={`fixed top-0 right-0 z-[70] h-full w-[84%] max-w-[380px] bg-[var(--ljka-card)] shadow-2xl transition-transform duration-300 ease-out lg:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
//         <div className="flex h-full flex-col">

//           {/* DRAWER HEADER */}
//           <div className="flex items-center justify-between border-b border-[var(--ljka-border)] bg-[var(--ljka-bg)] px-5 py-4">
//             <button type="button" onClick={() => { closeMenu(); navigate("/"); }} className="text-left">
//               <p className="text-lg font-bold tracking-wide text-[var(--ljka-primary)]">LJKA</p>
//               <p className="mt-0.5 text-[10px] font-medium text-[var(--ljka-muted)]">Lakhdaatar Jeevan Kalyan Association</p>
//             </button>

//             <button type="button" onClick={closeMenu} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ljka-mint)] text-[var(--ljka-primary)] transition hover:bg-[var(--ljka-primary)] hover:text-white">
//               <FaTimes />
//             </button>
//           </div>

//           {/* MEMBERSHIP HIGHLIGHT */}
//           <div className="mx-4 mt-5 rounded-xl border border-[var(--ljka-gold)]/30 bg-[var(--ljka-gold-light)]/45 px-4 py-3.5">
//             <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ljka-muted)]">LJKA Membership</p>
//             <p className="mt-1 text-sm font-bold text-[var(--ljka-primary)]">First 11,000 Members</p>
//             <p className="mt-0.5 text-xs font-bold text-[var(--ljka-danger)]">Registration is FREE</p>
//           </div>

//           {/* NAVIGATION */}
//           <div className="flex-1 overflow-y-auto px-4 py-5">
//             <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--ljka-text-light)]">Navigation</p>

//             <div className="space-y-1">
//               {NAV_LINKS.map(([path, name]) => (
//                 <NavLink key={path} to={path} onClick={closeMenu} className={({ isActive }) => `flex items-center justify-between rounded-lg px-3.5 py-3.5 text-[14px] transition ${isActive ? "bg-[var(--ljka-primary)] font-semibold text-white shadow-sm" : "text-[var(--ljka-text)] hover:bg-[var(--ljka-primary-bg)] hover:text-[var(--ljka-primary)]"}`}>
//                   {({ isActive }) => (
//                     <>
//                       <span>{name}</span>
//                       {isActive && <FaArrowRight className="text-xs text-[var(--ljka-gold-light)]" />}
//                     </>
//                   )}
//                 </NavLink>
//               ))}
//             </div>
//           </div>

//           {/* MOBILE ACTIONS */}
//           <div className="space-y-2 border-t border-[var(--ljka-border)] bg-[var(--ljka-bg)] p-4">
//             <NavLink to="/login" onClick={closeMenu} className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--ljka-border)] bg-[var(--ljka-card)] py-3 text-sm font-semibold text-[var(--ljka-primary)] transition hover:border-[var(--ljka-primary)]">
//               <FaUserCircle />
//               Login
//             </NavLink>

//             <NavLink to="/register" onClick={closeMenu} className="flex w-full items-center justify-center rounded-lg bg-[var(--ljka-primary)] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--ljka-primary-dark)]">
//               Become a Member
//             </NavLink>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Navbar;

// import React, { useEffect, useState } from "react";
// import { useNavigate, NavLink } from "react-router-dom";
// import { FaBars, FaTimes, FaArrowRight, FaUserCircle } from "react-icons/fa";

// const NAV_LINKS = [
//   ["/", "Home"],
//   ["/about", "About LJKA"],
//   ["/user-list", "Members"],
//   ["/sahyog-list", "Sahyog"],
//   ["/vyawastha-list", "Vyawastha"],
//   ["/niyamawali", "Niyamawali"],
//   ["/contact", "Contact"],
// ];

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     document.body.style.overflow = menuOpen ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [menuOpen]);

//   const closeMenu = () => setMenuOpen(false);

//   return (
//     <>
//       <header className="w-full bg-white border-b border-gray-200 shadow-sm">
//         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8">

//           {/* ================= DESKTOP / MAIN ROW ================= */}
//           <div className="min-h-[86px] flex items-center gap-6">

//             {/* BRAND */}
//             <button
//               type="button"
//               onClick={() => navigate("/")}
//               className="flex items-center gap-3 shrink-0 text-left"
//             >
//               <div className="w-11 h-11 rounded-full bg-[var(--ljka-primary)] flex items-center justify-center text-[var(--ljka-gold)] font-bold text-lg shadow-sm">
//                 LJ
//               </div>

//               <div className="leading-tight">
//                 <h1 className="text-[15px] xl:text-[17px] font-bold text-[var(--ljka-primary)] whitespace-nowrap">
//                   Lakhdaatar Jeevan Kalyan Association
//                 </h1>

//                 <p className="text-[10px] xl:text-[11px] text-[var(--ljka-muted)] mt-1">
//                   लखदातार जीवन कल्याण एसोसिएशन
//                 </p>
//               </div>
//             </button>

//             {/* DESKTOP NAVIGATION */}
//             <nav className="hidden lg:flex flex-1 items-center justify-center min-w-0">
//               <div className="flex items-center justify-center">
//                 {NAV_LINKS.map(([path, name]) => (
//                   <NavLink
//                     key={path}
//                     to={path}
//                     className={({ isActive }) =>
//                       `relative whitespace-nowrap px-2.5 xl:px-3 py-2 text-[12px] xl:text-[13px] font-semibold rounded-md transition-all ${
//                         isActive
//                           ? "text-[var(--ljka-primary)] bg-[#f8f6ef]"
//                           : "text-gray-500 hover:text-[var(--ljka-primary)] hover:bg-gray-50"
//                       }`
//                     }
//                   >
//                     {({ isActive }) => (
//                       <>
//                         {name}
//                         <span
//                           className={`absolute bottom-0.5 left-2.5 right-2.5 h-[2px] bg-[var(--ljka-gold)] transition-transform duration-200 ${
//                             isActive ? "scale-x-100" : "scale-x-0"
//                           }`}
//                         />
//                       </>
//                     )}
//                   </NavLink>
//                 ))}
//               </div>
//             </nav>

//             {/* DESKTOP ACTIONS */}
//             <div className="hidden lg:flex items-center gap-2 shrink-0">
//               <button
//                 type="button"
//                 onClick={() => navigate("/login")}
//                 className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[12px] xl:text-[13px] font-semibold text-[var(--ljka-primary)] hover:border-[var(--ljka-gold)] hover:text-[var(--ljka-gold)] transition"
//               >
//                 <FaUserCircle />
//                 Login
//               </button>

//               <button
//                 type="button"
//                 onClick={() => navigate("/register")}
//                 className="px-3.5 xl:px-4 py-2 rounded-lg bg-[var(--ljka-primary)] text-white text-[12px] xl:text-[13px] font-semibold whitespace-nowrap hover:bg-[#102b45] transition shadow-sm"
//               >
//                 Become a Member
//               </button>
//             </div>

//             {/* MOBILE / TABLET HAMBURGER */}
//             <button
//               type="button"
//               onClick={() => setMenuOpen(true)}
//               aria-label="Open menu"
//               aria-expanded={menuOpen}
//               className="ml-auto flex lg:hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-[var(--ljka-primary)] hover:border-[var(--ljka-gold)] hover:text-[var(--ljka-gold)] transition"
//             >
//               <FaBars className="text-lg" />
//             </button>

//           </div>
//         </div>
//       </header>

//       {/* ================= OVERLAY ================= */}
//       {menuOpen && (
//         <div
//           onClick={closeMenu}
//           className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
//         />
//       )}

//       {/* ================= MOBILE DRAWER ================= */}
//       <aside
//         className={`fixed top-0 right-0 z-[70] h-full w-[82%] max-w-[360px] bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
//           menuOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex h-full flex-col">

//           {/* DRAWER HEADER */}
//           <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
//             <button
//               type="button"
//               onClick={() => {
//                 closeMenu();
//                 navigate("/");
//               }}
//               className="text-left"
//             >
//               <p className="text-lg font-bold text-[var(--ljka-primary)]">
//                 LJKA
//               </p>

//               <p className="text-[10px] text-[var(--ljka-muted)]">
//                 Lakhdaatar Jeevan Kalyan Association
//               </p>
//             </button>

//             <button
//               type="button"
//               onClick={closeMenu}
//               aria-label="Close menu"
//               className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-[var(--ljka-primary)] hover:bg-gray-200 transition"
//             >
//               <FaTimes />
//             </button>
//           </div>

//           {/* MOBILE MEMBERSHIP MESSAGE */}
//           <div className="mx-4 mt-5 rounded-xl bg-[#f8f6ef] border border-[#e8c874]/30 px-4 py-3">
//             <p className="text-[10px] uppercase tracking-wider text-gray-500">
//               LJKA Membership
//             </p>

//             <p className="mt-1 text-sm font-semibold text-[var(--ljka-primary)]">
//               First 11,000 Members
//             </p>

//             <p className="text-xs text-[var(--ljka-gold)] font-semibold">
//               Registration is FREE
//             </p>
//           </div>

//           {/* NAVIGATION */}
//           <div className="flex-1 overflow-y-auto px-4 py-5">
//             <p className="px-2 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
//               Navigation
//             </p>

//             <div className="space-y-1">
//               {NAV_LINKS.map(([path, name]) => (
//                 <NavLink
//                   key={path}
//                   to={path}
//                   onClick={closeMenu}
//                   className={({ isActive }) =>
//                     `flex items-center justify-between rounded-lg px-3 py-3.5 text-[15px] transition ${
//                       isActive
//                         ? "bg-[var(--ljka-primary)] text-white font-semibold"
//                         : "text-[var(--ljka-text)] hover:bg-gray-100"
//                     }`
//                   }
//                 >
//                   {({ isActive }) => (
//                     <>
//                       <span>{name}</span>
//                       {isActive && (
//                         <FaArrowRight className="text-xs text-[var(--ljka-gold)]" />
//                       )}
//                     </>
//                   )}
//                 </NavLink>
//               ))}
//             </div>
//           </div>

//           {/* MOBILE ACTIONS */}
//           <div className="border-t border-gray-200 p-4 space-y-2">
//             <NavLink
//               to="/login"
//               onClick={closeMenu}
//               className="flex items-center justify-center gap-2 w-full rounded-lg border border-gray-300 py-3 text-sm font-semibold text-[var(--ljka-primary)]"
//             >
//               <FaUserCircle />
//               Login
//             </NavLink>

//             <NavLink
//               to="/register"
//               onClick={closeMenu}
//               className="flex items-center justify-center w-full rounded-lg bg-[var(--ljka-primary)] py-3 text-sm font-semibold text-white"
//             >
//               Become a Member
//             </NavLink>
//           </div>

//         </div>
//       </aside>
//     </>
//   );
// };

// export default Navbar;

// import React, { useEffect, useState } from "react";
// import { useNavigate, NavLink } from "react-router-dom";
// import { FaBars, FaTimes, FaArrowRight, FaUserCircle } from "react-icons/fa";

// const NAV_LINKS = [
//   ["/", "Home"],
//   ["/about", "About LJKA"],
//   ["/vyawastha-list", "How It Works"],
//   ["/user-list", "Members"],
//   ["/sahyog-list", "Sahyog"],
//   ["/niyamawali", "Niyamawali"],
//   ["/contact", "Contact"],
// ];

// const Header = () => {
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     document.body.style.overflow = menuOpen ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [menuOpen]);

//   const closeMenu = () => setMenuOpen(false);

//   return (
//     <>
//       <header className="w-full bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//           <div className="min-h-[78px] flex items-center gap-5">

//             {/* BRAND */}
//             <button
//               type="button"
//               onClick={() => navigate("/")}
//               className="flex items-center gap-3 shrink-0 text-left"
//             >
//               <div className="w-11 h-11 rounded-full bg-[var(--ljka-primary)] flex items-center justify-center text-[var(--ljka-gold)] font-bold text-lg shadow-sm">
//                 LJ
//               </div>

//               <div className="leading-tight">
//                 <h1 className="text-[16px] sm:text-[18px] font-bold text-[var(--ljka-primary)] whitespace-nowrap">
//                   Lakhdaatar Jeevan Kalyan Association
//                 </h1>

//                 <p className="text-[11px] text-[var(--ljka-muted)] mt-1">
//                   लखदातार जीवन कल्याण एसोसिएशन
//                 </p>
//               </div>
//             </button>

//             {/* DESKTOP NAV */}
//             <nav className="hidden lg:flex flex-1 items-center justify-center">
//               <div className="flex items-center gap-0.5">
//                 {NAV_LINKS.map(([path, name]) => (
//                   <NavLink
//                     key={path}
//                     to={path}
//                     className={({ isActive }) =>
//                       `relative px-3 py-2 text-[13px] font-semibold rounded-md transition-all ${
//                         isActive
//                           ? "text-[var(--ljka-primary)] bg-[#f8f6ef]"
//                           : "text-gray-500 hover:text-[var(--ljka-primary)] hover:bg-gray-50"
//                       }`
//                     }
//                   >
//                     {({ isActive }) => (
//                       <>
//                         {name}
//                         <span
//                           className={`absolute bottom-0.5 left-3 right-3 h-[2px] bg-[var(--ljka-gold)] transition-transform ${
//                             isActive ? "scale-x-100" : "scale-x-0"
//                           }`}
//                         />
//                       </>
//                     )}
//                   </NavLink>
//                 ))}
//               </div>
//             </nav>

//             {/* DESKTOP ACTION AREA */}
//             <div className="hidden lg:flex items-center gap-2 shrink-0">

//               <div className="hidden xl:block mr-2 text-right leading-tight">
//                 <p className="text-[9px] uppercase tracking-wider text-gray-400">
//                   Registration
//                 </p>
//                 <p className="text-[11px] font-bold text-[var(--ljka-gold)]">
//                   First 11,000 FREE
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => navigate("/login")}
//                 className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 text-[13px] font-semibold text-[var(--ljka-primary)] hover:border-[var(--ljka-gold)] transition"
//               >
//                 <FaUserCircle />
//                 Login
//               </button>

//               <button
//                 type="button"
//                 onClick={() => navigate("/register")}
//                 className="px-4 py-2 rounded-lg bg-[var(--ljka-primary)] text-white text-[13px] font-semibold hover:bg-[#102b45] transition"
//               >
//                 Become a Member
//               </button>

//             </div>

//             {/* MOBILE / TABLET HAMBURGER */}
//             <button
//               type="button"
//               onClick={() => setMenuOpen(true)}
//               aria-label="Open menu"
//               aria-expanded={menuOpen}
//               className="ml-auto flex lg:hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-[var(--ljka-primary)] hover:border-[var(--ljka-gold)] transition"
//             >
//               <FaBars className="text-lg" />
//             </button>

//           </div>
//         </div>
//       </header>

//       {/* OVERLAY */}
//       {menuOpen && (
//         <div
//           onClick={closeMenu}
//           className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
//         />
//       )}

//       {/* RIGHT SIDE DRAWER */}
//       <aside
//         className={`fixed top-0 right-0 z-[70] h-full w-[82%] max-w-[360px] bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
//           menuOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex h-full flex-col">

//           {/* DRAWER HEADER */}
//           <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

//             <button
//               type="button"
//               onClick={() => {
//                 closeMenu();
//                 navigate("/");
//               }}
//               className="text-left"
//             >
//               <p className="text-lg font-bold text-[var(--ljka-primary)]">
//                 LJKA
//               </p>

//               <p className="text-[10px] text-[var(--ljka-muted)]">
//                 Lakhdaatar Jeevan Kalyan Association
//               </p>
//             </button>

//             <button
//               type="button"
//               onClick={closeMenu}
//               aria-label="Close menu"
//               className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-[var(--ljka-primary)] hover:bg-gray-200 transition"
//             >
//               <FaTimes />
//             </button>

//           </div>

//           {/* MEMBER MESSAGE */}
//           <div className="mx-4 mt-5 rounded-xl bg-[#f8f6ef] border border-[#e8c874]/30 px-4 py-3">
//             <p className="text-[10px] uppercase tracking-wider text-gray-500">
//               LJKA Membership
//             </p>

//             <p className="mt-1 text-sm font-semibold text-[var(--ljka-primary)]">
//               First 11,000 Members
//             </p>

//             <p className="text-xs text-[var(--ljka-gold)] font-semibold">
//               Registration is FREE
//             </p>
//           </div>

//           {/* NAVIGATION */}
//           <div className="flex-1 overflow-y-auto px-4 py-5">

//             <p className="px-2 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
//               Navigation
//             </p>

//             <div className="space-y-1">
//               {NAV_LINKS.map(([path, name]) => (
//                 <NavLink
//                   key={path}
//                   to={path}
//                   onClick={closeMenu}
//                   className={({ isActive }) =>
//                     `flex items-center justify-between rounded-lg px-3 py-3.5 text-[15px] transition ${
//                       isActive
//                         ? "bg-[var(--ljka-primary)] text-white font-semibold"
//                         : "text-[var(--ljka-text)] hover:bg-gray-100"
//                     }`
//                   }
//                 >
//                   {({ isActive }) => (
//                     <>
//                       <span>{name}</span>
//                       {isActive && (
//                         <FaArrowRight className="text-xs text-[var(--ljka-gold)]" />
//                       )}
//                     </>
//                   )}
//                 </NavLink>
//               ))}
//             </div>

//           </div>

//           {/* ACTIONS */}
//           <div className="border-t border-gray-200 p-4 space-y-2">

//             <NavLink
//               to="/login"
//               onClick={closeMenu}
//               className="flex items-center justify-center gap-2 w-full rounded-lg border border-gray-300 py-3 text-sm font-semibold text-[var(--ljka-primary)]"
//             >
//               <FaUserCircle />
//               Login
//             </NavLink>

//             <NavLink
//               to="/register"
//               onClick={closeMenu}
//               className="flex items-center justify-center w-full rounded-lg bg-[var(--ljka-primary)] py-3 text-sm font-semibold text-white"
//             >
//               Become a Member
//             </NavLink>

//           </div>

//         </div>
//       </aside>
//     </>
//   );
// };

// export default Header;