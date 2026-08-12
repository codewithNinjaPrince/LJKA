import React from "react";

import {
  FaBars,
  FaUserCircle,
} from "react-icons/fa";

const UserTopbar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {

  const userName =
    localStorage.getItem("userName") || "User";

  return (
    <header
      className="
        sticky
        top-0
        z-30
        h-16
        bg-white
        border-b
        border-gray-200
        shadow-sm

        flex
        items-center
        justify-between

        px-3
        sm:px-6
      "
    >

      {/* LEFT */}

      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
          className="
            w-10
            h-10
            flex
            items-center
            justify-center

            rounded-lg

            text-gray-700

            hover:bg-gray-100

            transition
          "
          aria-label="Toggle sidebar"
        >
          <FaBars className="text-xl" />
        </button>


        <h1
          className="
            text-lg
            font-semibold
            text-gray-800
          "
        >
          LJKA
        </h1>

      </div>


      {/* RIGHT */}

      <div
        className="
          flex
          items-center
          gap-2
          sm:gap-3
        "
      >

        <FaUserCircle
          className="
            text-2xl
            text-gray-500
          "
        />

        <span
          className="
            hidden
            sm:block
            text-sm
            font-medium
            text-gray-700
          "
        >
          {userName}
        </span>

      </div>

    </header>
  );
};

export default UserTopbar;