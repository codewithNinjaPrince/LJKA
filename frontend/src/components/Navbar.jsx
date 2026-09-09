import React, { useContext, useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaArrowRight,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { LJKAContext } from "../context/LJKAContext";

const NAV_LINKS = [
  ["/", "Home"],
  ["/about", "About LJKA"],
  ["/user-list", "Members"],
  ["/sahyog-list", "Sahyog"],
  ["/vyawastha-list", "Vyawastha"],
  ["/niyamawali", "Niyamawali"],
  ["/contact", "Contact"],
  ["/privacy-policy", "Privacy Policy"],
  ["/terms-conditions", "Terms & Conditions"],
];

const MEMBER_NAV_LINKS = [
  ["/user/view-profile", "View Profile"],
  ["/user/id-card", "Download ID Card"],
  ["/user/upload-sahyog", "Upload Sahyog"],
  ["/user/sahyog-list", "View All Sahyog"],
  ["/user/upload-kanyadan", "Upload Kanyadan"],
  ["/user/kanyadan-list", "View Kanyadan Sahyog"],
  ["/user/raise-claim", "Raise Claim"],
  ["/user/update-password", "Update Password"],
  ["/contact", "Contact LJKA"],
];

const Navbar = ({ memberPortal = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, logout } = useContext(LJKAContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const isKYCPage = location.pathname === "/kyc";

  const showLogout =
    memberPortal || (isKYCPage && Boolean(token));

  const links = memberPortal ? MEMBER_NAV_LINKS : NAV_LINKS;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* =========================================================
          MAIN NAVBAR
          ========================================================= */}

      <header className="sticky top-0 z-50 w-full overflow-visible border-b border-[var(--ljka-gold)]/25 bg-[var(--ljka-primary)] shadow-[var(--ljka-shadow-md)]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 xl:px-8">
          <div className="flex min-h-[78px] w-full items-center gap-3 xl:min-h-[84px] xl:gap-7">

            {/* BRAND */}
            <button
              type="button"
              onClick={() => navigate(memberPortal ? "/user/view-profile" : "/")}
              className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden text-left lg:flex-none lg:overflow-visible"
            >
              <img
                src="/img/Lakhdaatar_Logo.png"
                alt="Lakhdaatar Jeevan Kalyan Association"
                className="h-15 w-15 shrink-0 object-contain"
              />

              <div className="min-w-0 leading-tight">
                <h1 className="text-[13px] font-bold tracking-[-0.01em] text-white sm:text-[15px] xl:text-[17px]">
                  <span className="block whitespace-nowrap">
                    Lakhdaatar Jeevan
                  </span>

                  <span className="block whitespace-nowrap">
                    Kalyan Association
                  </span>
                </h1>
              </div>
            </button>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
              <div className="flex items-center gap-0.5 xl:gap-1">
                {links.filter(([path]) =>
                  memberPortal || !["/privacy-policy", "/terms-conditions"].includes(path)
                ).map(([path, name]) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `relative whitespace-nowrap rounded-lg px-2.5 py-2.5 text-[12px] font-semibold transition-all xl:px-3 xl:text-[13px] ${isActive
                        ? "bg-white/20 text-white"
                        : "text-white/75 hover:bg-white/15 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {name}

                        <span
                          className={`absolute bottom-1 left-3 right-3 h-[2px] origin-center rounded-full bg-[var(--ljka-gold)] transition-transform duration-200 ${isActive
                            ? "scale-x-100"
                            : "scale-x-0"
                            }`}
                        />
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* DESKTOP ACTIONS */}
            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              {showLogout ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--ljka-gold)] px-3.5 py-2.5 text-[12px] font-bold text-[var(--ljka-primary)] shadow-sm transition hover:bg-[var(--ljka-gold-light)] hover:shadow-md xl:px-4 xl:text-[13px]"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/5 px-3 py-2.5 text-[12px] font-semibold text-white transition hover:border-[var(--ljka-gold)] hover:bg-white/10 xl:px-3.5 xl:text-[13px]"
                  >
                    <FaUserCircle className="text-sm text-[var(--ljka-gold)]" />
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="whitespace-nowrap rounded-lg bg-[var(--ljka-gold)] px-3.5 py-2.5 text-[12px] font-bold text-[var(--ljka-primary)] shadow-sm transition hover:bg-[var(--ljka-gold-light)] hover:shadow-md xl:px-4 xl:text-[13px]"
                  >
                    Become a Member
                  </button>
                </>
              )}
            </div>

            {/* MOBILE / TABLET MENU BUTTON */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="ml-auto flex h-11 w-11 min-h-11 min-w-11 shrink-0 grow-0 basis-11 items-center justify-center overflow-visible rounded-lg border border-white/25 bg-white/5 text-[var(--ljka-gold)] transition hover:border-[var(--ljka-gold)] hover:bg-white/10 lg:hidden"
            >
              <span className="flex h-5 w-5 shrink-0 flex-col items-center justify-center gap-[4px]">
                <span className="block h-[2px] w-5 shrink-0 rounded-full bg-[var(--ljka-gold)]" />
                <span className="block h-[2px] w-5 shrink-0 rounded-full bg-[var(--ljka-gold)]" />
                <span className="block h-[2px] w-5 shrink-0 rounded-full bg-[var(--ljka-gold)]" />
              </span>
            </button>

          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE OVERLAY
          ========================================================= */}

      {menuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-[60] bg-[var(--ljka-primary-dark)]/45 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* =========================================================
          MOBILE DRAWER
          ========================================================= */}

      <aside
        className={`fixed right-0 top-0 z-[70] h-full w-[84%] max-w-[380px] bg-[var(--ljka-card)] shadow-2xl transition-transform duration-300 ease-out lg:hidden ${menuOpen
          ? "translate-x-0"
          : "translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col">

          {/* DRAWER HEADER */}
          <div className="flex items-center justify-between border-b border-[var(--ljka-gold)]/25 bg-[var(--ljka-primary)] px-5 py-4">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                navigate(memberPortal ? "/user/view-profile" : "/");
              }}
              className="flex min-w-0 items-center gap-3 text-left"
            >
              <img
                src="/img/Lakhdaatar_Logo.png"
                alt="Lakhdaatar Jeevan Kalyan Association"
                className="h-11 w-11 shrink-0 object-contain"
              />

              <p className="min-w-0 text-[12px] font-bold leading-4 text-white">
                <span className="block">Lakhdaatar Jeevan</span>
                <span className="block">Kalyan Association</span>
              </p>
            </button>

            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--ljka-gold)] transition hover:bg-[var(--ljka-gold)] hover:text-[var(--ljka-primary)]"
            >
              <FaTimes />
            </button>
          </div>

          {/* MEMBERSHIP HIGHLIGHT */}
          <div className="mx-4 mt-5 rounded-xl border border-[var(--ljka-gold)]/30 bg-[var(--ljka-gold-light)]/45 px-4 py-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ljka-primary-light)]">
              LJKA Membership
            </p>

            <p className="mt-1 text-sm font-bold text-[var(--ljka-primary)]">
              {memberPortal ? "Your LJKA Member Portal" : "First 11,000 Members"}
            </p>

            <p className="mt-0.5 text-xs font-bold text-[var(--ljka-primary)]">
              {memberPortal ? "Manage your membership" : "Registration is FREE"}
            </p>
          </div>

          {/* NAVIGATION */}
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <div className="mb-4 flex items-center gap-3 px-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--ljka-gold-dark)]">
                Navigation
              </p>
              <span className="h-px flex-1 bg-gradient-to-r from-[var(--ljka-gold)]/60 to-transparent" />
            </div>

            <div className="divide-y divide-[var(--ljka-border-light)]">
              {links.map(([path, name]) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-3.5 text-[14px] font-semibold transition-all duration-200 hover:rounded-lg ${isActive
                      ? "rounded-lg bg-[var(--ljka-primary)] text-white shadow-sm"
                      : "text-black hover:bg-[var(--ljka-primary)] hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{name}</span>

                      {isActive && (
                        <FaArrowRight className="text-xs text-[var(--ljka-gold)]" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* MOBILE ACTIONS */}
          <div className="space-y-2 border-t border-[var(--ljka-border)] bg-[var(--ljka-primary-bg)] p-4">
            {showLogout ? (
              <>
                <button type="button" onClick={() => setShowLogoutConfirm(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--ljka-gold)] py-3 text-sm font-bold text-[var(--ljka-primary)] shadow-sm transition hover:bg-[var(--ljka-gold-light)] hover:shadow-md">
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMenu} className={({ isActive }) => `flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-semibold transition ${isActive ? "border-[var(--ljka-primary)] bg-[var(--ljka-primary)] text-white ring-2 ring-[var(--ljka-gold)] ring-offset-2" : "border-[var(--ljka-primary)]/25 bg-[var(--ljka-card)] text-[var(--ljka-primary)] hover:border-[var(--ljka-primary)] hover:bg-[var(--ljka-primary)] hover:text-white"}`}>
                  <FaUserCircle className="text-[var(--ljka-gold-dark)]" />
                  Login
                </NavLink>
                <NavLink to="/register" onClick={closeMenu} className={({ isActive }) => `flex w-full items-center justify-center rounded-lg py-3 text-sm font-bold text-[var(--ljka-primary)] shadow-sm transition ${isActive ? "bg-[var(--ljka-gold-light)] ring-2 ring-[var(--ljka-primary)] ring-offset-2" : "bg-[var(--ljka-gold)] hover:bg-[var(--ljka-gold-light)] hover:shadow-md"}`}>
                  Become a Member
                </NavLink>
              </>
            )}
          </div>

        </div>
      </aside>

{showLogout && showLogoutConfirm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-5 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--ljka-border)] bg-white p-6 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ljka-gold-dark)]"> LJKA Account</p>
            <h2 className="mt-2 text-xl font-bold text-[var(--ljka-primary)]">Log out of LJKA?</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--ljka-muted)]"> Your current session will be closed. Your unfinished KYC information will also be cleared.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setShowLogoutConfirm(false)} className="rounded-lg border border-[var(--ljka-border)] px-4 py-2.5 text-sm font-semibold text-[var(--ljka-primary)]">Cancel</button>
              <button type="button" onClick={logout} className="rounded-lg bg-[var(--ljka-primary)] px-4 py-2.5 text-sm font-bold text-white hover:bg-[var(--ljka-primary-dark)]">Confirm Logout</button>
            </div>
          </div>
        </div>
      )}
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

//       <header className="sticky top-0 z-50 w-full border-b border-[var(--ljka-gold)]/25 bg-[var(--ljka-primary)] shadow-[var(--ljka-shadow-md)]">
//         <div className="mx-auto max-w-[1440px] px-4 sm:px-6 xl:px-8">
//           <div className="flex min-h-[78px] items-center gap-5 xl:min-h-[84px] xl:gap-7">

//             {/* BRAND */}
//             <button type="button" onClick={() => navigate("/")} className="flex shrink-0 items-center gap-3 text-left">
//               <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--ljka-gold)] bg-white text-base font-bold text-[var(--ljka-primary)] shadow-sm xl:h-12 xl:w-12 xl:text-lg">LJ</div>

//               <div className="leading-tight">
//                 <h1 className="whitespace-nowrap text-[14px] font-bold tracking-[-0.01em] text-white sm:text-[15px] xl:text-[17px]">Lakhdaatar Jeevan Kalyan Association</h1>
//                 <p className="mt-1 whitespace-nowrap text-[9px] font-medium text-white/65 sm:text-[10px] xl:text-[11px]">लखदातार जीवन कल्याण एसोसिएशन</p>
//               </div>
//             </button>

//             {/* DESKTOP NAVIGATION */}
//             <nav className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
//               <div className="flex items-center gap-0.5 xl:gap-1">
//                 {NAV_LINKS.map(([path, name]) => (
//                   <NavLink key={path} to={path} className={({ isActive }) => `relative whitespace-nowrap rounded-lg px-2.5 py-2.5 text-[12px] font-semibold transition-all xl:px-3 xl:text-[13px] ${isActive ? "bg-white/10 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"}`}>
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
//               <button type="button" onClick={() => navigate("/login")} className="flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/5 px-3 py-2.5 text-[12px] font-semibold text-white transition hover:border-[var(--ljka-gold)] hover:bg-white/10 xl:px-3.5 xl:text-[13px]">
//                 <FaUserCircle className="text-sm text-[var(--ljka-gold)]" />
//                 Login
//               </button>

//               <button type="button" onClick={() => navigate("/register")} className="rounded-lg bg-[var(--ljka-gold)] px-3.5 py-2.5 text-[12px] font-bold whitespace-nowrap text-[var(--ljka-primary)] shadow-sm transition hover:bg-[var(--ljka-gold-light)] hover:shadow-md xl:px-4 xl:text-[13px]">
//                 Become a Member
//               </button>
//             </div>

//             {/* MOBILE / TABLET MENU BUTTON */}
//             <button
//               type="button"
//               onClick={() => setMenuOpen(true)}
//               aria-label="Open menu"
//               aria-expanded={menuOpen}
//               className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center overflow-visible rounded-lg border border-white/20 bg-white/5 text-[var(--ljka-gold)] transition hover:border-[var(--ljka-gold)] hover:bg-white/10 lg:hidden"
//             >
//               <FaBars className="shrink-0 text-lg leading-none" />
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
//           <div className="flex items-center justify-between border-b border-[var(--ljka-gold)]/25 bg-[var(--ljka-primary)] px-5 py-4">
//             <button type="button" onClick={() => { closeMenu(); navigate("/"); }} className="text-left">
//               <p className="text-lg font-bold tracking-wide text-white">LJKA</p>
//               <p className="mt-0.5 text-[10px] font-medium text-white/65">Lakhdaatar Jeevan Kalyan Association</p>
//             </button>

//             <button type="button" onClick={closeMenu} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[var(--ljka-gold)] transition hover:bg-[var(--ljka-gold)] hover:text-[var(--ljka-primary)]">
//               <FaTimes />
//             </button>
//           </div>

//           {/* MEMBERSHIP HIGHLIGHT */}
//           <div className="mx-4 mt-5 rounded-xl border border-[var(--ljka-gold)]/30 bg-[var(--ljka-gold-light)]/45 px-4 py-3.5">
//             <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ljka-muted)]">LJKA Membership</p>
//             <p className="mt-1 text-sm font-bold text-[var(--ljka-primary)]">First 11,000 Members</p>
//             <p className="mt-0.5 text-xs font-bold text-[var(--ljka-primary)]">Registration is FREE</p>
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
//                       {isActive && <FaArrowRight className="text-xs text-[var(--ljka-gold)]" />}
//                     </>
//                   )}
//                 </NavLink>
//               ))}
//             </div>
//           </div>

//           {/* MOBILE ACTIONS */}
//           <div className="space-y-2 border-t border-[var(--ljka-border)] bg-[var(--ljka-bg)] p-4">
//             <NavLink to="/login" onClick={closeMenu} className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--ljka-primary)]/25 bg-[var(--ljka-card)] py-3 text-sm font-semibold text-[var(--ljka-primary)] transition hover:border-[var(--ljka-primary)]">
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