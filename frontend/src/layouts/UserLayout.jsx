import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

const UserLayout = () => {

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--ljka-bg)] text-[var(--ljka-text)]">

      <div
        className="pointer-events-none fixed left-1/2 top-[58%] z-40 w-[92vw] max-w-[420px] -translate-x-1/2 -translate-y-1/2 sm:w-[75vw] sm:max-w-[520px] md:w-[55vw] md:max-w-[620px] lg:w-[45vw] lg:max-w-[700px]"
        aria-hidden="true"
      >
        <img
          src="/img/Lakhdaatar_Logo.png"
          alt=""
          className="block h-auto w-full object-contain opacity-[0.07]"
        />
      </div>

      <div className="fixed inset-x-0 top-0 z-[100]">
        <Navbar memberPortal />
      </div>

      <main className="relative z-10 px-4 pb-12 pt-[132px] sm:px-8 sm:pb-16 sm:pt-[140px] lg:px-12 xl:px-16">
        <Outlet />
      </main>

    </div>
  );
};

export default UserLayout;