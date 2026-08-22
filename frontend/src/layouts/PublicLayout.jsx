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
    <div className="w-full min-h-screen bg-[var(--ljka-bg)] text-[var(--ljka-text)] overflow-x-hidden">

      {/* FIXED WEBSITE HEADER */}
      <div className="fixed inset-x-0 top-0 z-[100]">
        <AnnouncementBar />
        <Navbar />
      </div>

      {/* PAGE CONTENT */}
      <main className="pt-[108px] sm:pt-[112px]">
        <Outlet />
      </main>

      {/* FOOTER */}
      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default PublicLayout;