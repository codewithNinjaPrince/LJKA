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
  ["/user/all-sahyog", "View All Sahyog"],
  ["/user/upload-kanyadan", "Upload Kanyadan"],
  ["/user/kanyadan-list", "View Kanyadan Sahyog"],
  ["/user/raise-claim", "Raise Claim"],
  ["/user/update-password", "Update Password"],
];

const Navbar = ({ memberPortal = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, logout } = useContext(LJKAContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const isKYCPage = location.pathname === "/kyc";
  const isUpdateProfilePage =
    location.pathname === "/user/update-profile";
  const isAuthenticated = Boolean(token);
  const isKYCInProgress =
    isAuthenticated &&
    isKYCPage &&
    !user?.kycCompleted;

  const showAuthenticatedNavbar =
    isAuthenticated &&
    (isKYCPage || isUpdateProfilePage || memberPortal);

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
                    target={path === "/user/id-card" ? "_blank" : undefined}
                    rel={path === "/user/id-card" ? "noopener noreferrer" : undefined}
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
                  target={path === "/user/id-card" ? "_blank" : undefined}
                  rel={path === "/user/id-card" ? "noopener noreferrer" : undefined}
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