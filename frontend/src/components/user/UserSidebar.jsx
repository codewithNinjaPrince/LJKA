import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaIdCard,
  FaHandsHelping,
  FaGift,
  FaKey,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

import { LJKAContext } from "../../context/LJKAContext";

const UserSidebar = ({
  open,
  isMobile,
  closeMobileSidebar,
}) => {

  const { logout } = useContext(LJKAContext);

  const menuItems = [
    {
      name: "View Profile",
      path: "/user/view-profile",
      icon: <FaUser />,
    },
    {
      name: "Download ID Card",
      path: "/user/id-card",
      icon: <FaIdCard />,
    },
    {
      name: "Upload Sahyog",
      path: "/user/upload-sahyog",
      icon: <FaHandsHelping />,
    },
    {
      name: "View All Sahyog",
      path: "/user/sahyog-list",
      icon: <FaHandsHelping />,
    },
    {
      name: "Upload Kanyadan",
      path: "/user/upload-kanyadan",
      icon: <FaGift />,
    },
    {
      name: "View Kanyadan Sahyog",
      path: "/user/kanyadan-list",
      icon: <FaGift />,
    },
    {
      name: "Update Password",
      path: "/user/update-password",
      icon: <FaKey />,
    },
  ];


  const handleNavigation = () => {
    closeMobileSidebar();
  };


  return (
    <aside
      className={`
        fixed
        top-0
        left-0
        z-50
        h-screen
        bg-[#05052f]
        text-white
        overflow-hidden

        transition-all
        duration-300
        ease-in-out

        ${
          isMobile
            ? open
              ? "w-72 translate-x-0"
              : "w-72 -translate-x-full"
            : open
              ? "w-64 translate-x-0"
              : "w-20 translate-x-0"
        }
      `}
    >

      {/* ==========================================
          LOGO
      ========================================== */}

     {/* ==========================================
    LOGO / MOBILE CLOSE BUTTON
========================================== */}

<div
  className="
    h-16
    flex
    items-center
    justify-between
    px-4
    border-b
    border-white/10
  "
>

  {/* LOGO */}

  {open || isMobile ? (
    <div className="text-xl font-bold tracking-wide">
      LJKA
    </div>
  ) : (
    <div className="text-xl font-bold mx-auto">
      L
    </div>
  )}


  {/* MOBILE CLOSE BUTTON */}

  {isMobile && (
    <button
      type="button"
      onClick={closeMobileSidebar}
      className="
        w-9
        h-9
        flex
        items-center
        justify-center
        rounded-lg

        text-gray-300

        hover:bg-white/10
        hover:text-white

        transition
      "
      aria-label="Close sidebar"
    >
      <FaTimes className="text-xl" />
    </button>
  )}

</div>


      {/* ==========================================
          MENU
      ========================================== */}

      <nav className="mt-4 px-2">

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNavigation}
            className={({ isActive }) => `
              flex
              items-center
              gap-4
              h-12
              px-4
              mb-1
              rounded-lg

              transition-all
              duration-200

              whitespace-nowrap

              ${
                !open && !isMobile
                  ? "justify-center"
                  : ""
              }

              ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }
            `}
          >

            <span
              className="
                text-lg
                min-w-[20px]
              "
            >
              {item.icon}
            </span>


            {(open || isMobile) && (

              <span
                className="
                  text-sm
                  font-medium
                "
              >
                {item.name}
              </span>

            )}

          </NavLink>

        ))}


        {/* ======================================
            LOGOUT
        ====================================== */}

        <button
          type="button"
          onClick={logout}
          className={`
            w-full
            flex
            items-center
            gap-4
            h-12
            px-4
            mt-4
            rounded-lg

            text-gray-300

            hover:bg-red-500/20
            hover:text-white

            transition-all

            ${
              !open && !isMobile
                ? "justify-center"
                : ""
            }
          `}
        >

          <FaSignOutAlt
            className="
              text-lg
              min-w-[20px]
            "
          />

          {(open || isMobile) && (

            <span
              className="
                text-sm
                font-medium
              "
            >
              Logout
            </span>

          )}

        </button>

      </nav>

    </aside>
  );
};

export default UserSidebar;