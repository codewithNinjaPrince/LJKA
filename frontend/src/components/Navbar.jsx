import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaArrowRight, FaUserCircle } from "react-icons/fa";

const NAV_LINKS = [
  ["/", "Home"],
  ["/about", "About LJKA"],
  ["/user-list", "Members"],
  ["/sahyog-list", "Sahyog"],
  ["/vyawastha-list", "Vyawastha"],
  ["/niyamawali", "Niyamawali"],
  ["/contact", "Contact"],
];

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8">

          {/* ================= DESKTOP / MAIN ROW ================= */}
          <div className="min-h-[86px] flex items-center gap-6">

            {/* BRAND */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-3 shrink-0 text-left"
            >
              <div className="w-11 h-11 rounded-full bg-[var(--ljka-primary)] flex items-center justify-center text-[var(--ljka-gold)] font-bold text-lg shadow-sm">
                LJ
              </div>

              <div className="leading-tight">
                <h1 className="text-[15px] xl:text-[17px] font-bold text-[var(--ljka-primary)] whitespace-nowrap">
                  Lakhdaatar Jeevan Kalyan Association
                </h1>

                <p className="text-[10px] xl:text-[11px] text-[var(--ljka-muted)] mt-1">
                  लखदातार जीवन कल्याण एसोसिएशन
                </p>
              </div>
            </button>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden lg:flex flex-1 items-center justify-center min-w-0">
              <div className="flex items-center justify-center">
                {NAV_LINKS.map(([path, name]) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `relative whitespace-nowrap px-2.5 xl:px-3 py-2 text-[12px] xl:text-[13px] font-semibold rounded-md transition-all ${
                        isActive
                          ? "text-[var(--ljka-primary)] bg-[#f8f6ef]"
                          : "text-gray-500 hover:text-[var(--ljka-primary)] hover:bg-gray-50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {name}
                        <span
                          className={`absolute bottom-0.5 left-2.5 right-2.5 h-[2px] bg-[var(--ljka-gold)] transition-transform duration-200 ${
                            isActive ? "scale-x-100" : "scale-x-0"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* DESKTOP ACTIONS */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[12px] xl:text-[13px] font-semibold text-[var(--ljka-primary)] hover:border-[var(--ljka-gold)] hover:text-[var(--ljka-gold)] transition"
              >
                <FaUserCircle />
                Login
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="px-3.5 xl:px-4 py-2 rounded-lg bg-[var(--ljka-primary)] text-white text-[12px] xl:text-[13px] font-semibold whitespace-nowrap hover:bg-[#102b45] transition shadow-sm"
              >
                Become a Member
              </button>
            </div>

            {/* MOBILE / TABLET HAMBURGER */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="ml-auto flex lg:hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-[var(--ljka-primary)] hover:border-[var(--ljka-gold)] hover:text-[var(--ljka-gold)] transition"
            >
              <FaBars className="text-lg" />
            </button>

          </div>
        </div>
      </header>

      {/* ================= OVERLAY ================= */}
      {menuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
        />
      )}

      {/* ================= MOBILE DRAWER ================= */}
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-[82%] max-w-[360px] bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">

          {/* DRAWER HEADER */}
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                navigate("/");
              }}
              className="text-left"
            >
              <p className="text-lg font-bold text-[var(--ljka-primary)]">
                LJKA
              </p>

              <p className="text-[10px] text-[var(--ljka-muted)]">
                Lakhdaatar Jeevan Kalyan Association
              </p>
            </button>

            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-[var(--ljka-primary)] hover:bg-gray-200 transition"
            >
              <FaTimes />
            </button>
          </div>

          {/* MOBILE MEMBERSHIP MESSAGE */}
          <div className="mx-4 mt-5 rounded-xl bg-[#f8f6ef] border border-[#e8c874]/30 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              LJKA Membership
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--ljka-primary)]">
              First 11,000 Members
            </p>

            <p className="text-xs text-[var(--ljka-gold)] font-semibold">
              Registration is FREE
            </p>
          </div>

          {/* NAVIGATION */}
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <p className="px-2 mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
              Navigation
            </p>

            <div className="space-y-1">
              {NAV_LINKS.map(([path, name]) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-lg px-3 py-3.5 text-[15px] transition ${
                      isActive
                        ? "bg-[var(--ljka-primary)] text-white font-semibold"
                        : "text-[var(--ljka-text)] hover:bg-gray-100"
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
          <div className="border-t border-gray-200 p-4 space-y-2">
            <NavLink
              to="/login"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 w-full rounded-lg border border-gray-300 py-3 text-sm font-semibold text-[var(--ljka-primary)]"
            >
              <FaUserCircle />
              Login
            </NavLink>

            <NavLink
              to="/register"
              onClick={closeMenu}
              className="flex items-center justify-center w-full rounded-lg bg-[var(--ljka-primary)] py-3 text-sm font-semibold text-white"
            >
              Become a Member
            </NavLink>
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