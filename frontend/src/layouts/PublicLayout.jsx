import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AnnouncementBar from "../components/AnnouncementBar";
import Navbar from "../components/Navbar";

const PublicLayout = () => (
  <div className="w-full min-h-screen bg-[var(--ljka-bg)] text-[var(--ljka-text)] overflow-x-hidden">
    {/* FIXED WEBSITE HEADER */}
    <div className="fixed top-0 left-0 z-50 w-full">
      <AnnouncementBar />
      <Navbar />
    </div>

    {/* PAGE CONTENT */}
    <main className="pt-[108px] sm:pt-[112px]">
      <Outlet />
    </main>

    <Footer />
  </div>
);

export default PublicLayout;