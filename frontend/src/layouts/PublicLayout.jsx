import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import Footer from "../components/Footer";
import AnnouncementBar from "../components/AnnouncementBar";
import Navbar from "../components/Navbar";

const PublicLayout = () => {
  const location = useLocation();

  const noFooterRoutes = [
    "/login",
    "/register",
    "/kyc",
  ];

  const shouldShowFooter = !noFooterRoutes.includes(
    location.pathname
  );

  return (
    <div className="relative w-full min-h-screen bg-[var(--ljka-bg)] text-[var(--ljka-text)] overflow-x-hidden">

      {/* =========================================================
          WEBSITE LOGO WATERMARK
          ========================================================= */}
      <div
        className="
          pointer-events-none
          fixed
          left-1/2
          top-[calc(50%+55px)]
          z-[50]
          -translate-x-1/2
          -translate-y-1/2
        "
        aria-hidden="true"
      >
        <img
          src="/img/Lakhdaatar_Logo.png"
          alt=""
          className="
            w-[280px]
            sm:w-[350px]
            md:w-[430px]
            lg:w-[500px]
            object-contain
            opacity-[0.06]
          "
        />
      </div>

      {/* =========================================================
          FIXED WEBSITE HEADER
          ========================================================= */}
      <div className="fixed inset-x-0 top-0 z-[100]">
        <AnnouncementBar />
        <Navbar />
      </div>

      {/* =========================================================
          PAGE CONTENT
          ========================================================= */}
      <main className="relative z-10 pt-[108px] sm:pt-[112px]">
        <Outlet />
      </main>

      {/* =========================================================
          FOOTER
          ========================================================= */}
      {shouldShowFooter && <Footer />}

    </div>
  );
};

export default PublicLayout;


// import React from "react";
// import { Outlet, useLocation } from "react-router-dom";

// import Footer from "../components/Footer";
// import AnnouncementBar from "../components/AnnouncementBar";
// import Navbar from "../components/Navbar";

// const PublicLayout = () => {
//   const location = useLocation();

//   const noFooterRoutes = [
//     "/login",
//     "/register",
//     "/kyc",
//   ];

//   const shouldShowFooter = !noFooterRoutes.includes(
//     location.pathname
//   );

//   return (
//     <div className="relative w-full min-h-screen bg-[var(--ljka-bg)] text-[var(--ljka-text)] overflow-x-hidden">

//       {/* =========================================================
//           WEBSITE WATERMARK
//           ========================================================= */}
//       <div
//         className="pointer-events-none fixed inset-0 z-[40] flex items-center justify-center"
//         aria-hidden="true"
//       >
//         <img
//           src="/img/Lakhdaatar_Logo.png"
//           alt=""
//           className="w-[260px] sm:w-[340px] md:w-[430px] lg:w-[520px] object-contain opacity-[0.08]"
//         />
//       </div>

//       {/* =========================================================
//           FIXED WEBSITE HEADER
//           ========================================================= */}
//       <div className="fixed inset-x-0 top-0 z-[100]">
//         <AnnouncementBar />
//         <Navbar />
//       </div>

//       {/* =========================================================
//           PAGE CONTENT
//           ========================================================= */}
//       <main className="relative z-10 pt-[108px] sm:pt-[112px]">
//         <Outlet />
//       </main>

//       {/* =========================================================
//           FOOTER
//           ========================================================= */}
//       {shouldShowFooter && <Footer />}

//     </div>
//   );
// };

// export default PublicLayout;