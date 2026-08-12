import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import UserSidebar from "../components/user/UserSidebar";
import UserTopbar from "../components/user/UserTopbar";

const UserLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  /* ------------------------------------------
     DETECT MOBILE SCREEN
  ------------------------------------------ */

  useEffect(() => {

    const handleResize = () => {

      const mobile = window.innerWidth < 768;

      setIsMobile(mobile);

      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };

  }, []);


  /* ------------------------------------------
     TOGGLE SIDEBAR
  ------------------------------------------ */

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };


  /* ------------------------------------------
     CLOSE MOBILE SIDEBAR
  ------------------------------------------ */

  const closeMobileSidebar = () => {

    if (isMobile) {
      setSidebarOpen(false);
    }

  };


  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <UserSidebar
        open={sidebarOpen}
        isMobile={isMobile}
        closeMobileSidebar={closeMobileSidebar}
      />


      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {isMobile && sidebarOpen && (

        <div
          onClick={closeMobileSidebar}
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-[1px]
          "
        />

      )}


      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div
        className={`
          min-h-screen
          transition-all
          duration-300

          ${
            isMobile
              ? "ml-0"
              : sidebarOpen
                ? "ml-64"
                : "ml-20"
          }
        `}
      >

        {/* ======================================
            TOPBAR
        ====================================== */}

        <UserTopbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={toggleSidebar}
        />


        {/* ======================================
            PAGE CONTENT
        ====================================== */}

        <main
          className="
            p-4
            sm:p-6
            lg:p-8
          "
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default UserLayout;