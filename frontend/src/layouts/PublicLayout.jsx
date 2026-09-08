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
    top-[58%]
    z-[50]
    -translate-x-1/2
    -translate-y-1/2
    w-[92vw]
    max-w-[420px]
    sm:w-[75vw]
    sm:max-w-[520px]
    md:w-[55vw]
    md:max-w-[620px]
    lg:w-[45vw]
    lg:max-w-[700px]
    xl:w-[40vw]
    xl:max-w-[760px]
  "
  aria-hidden="true"
>
  <img
    src="/img/Lakhdaatar_Logo.png"
    alt=""
    className="
      block
      w-full
      h-auto
      object-contain
      opacity-[0.07]
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