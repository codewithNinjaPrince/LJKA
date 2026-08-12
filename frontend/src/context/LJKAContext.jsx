import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const LJKAContext = createContext(null);

const LJKAContextProvider = ({ children }) => {

  const navigate = useNavigate();

  const LJKA_TITLE = {
    english: "Lakhdaatar Jeevan Kalyan Association",
    hindi: "लखदातार जीवन कल्याण एसोसिएशन",
    short: "LJKA",
  };

  const contactInfo = {
  email: "",
  whatsapp: "",
  phone: "",
  officeAddress: "",
};

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL;


  /* =====================================================
     STATES
  ===================================================== */

  const [userList, setUserList] = useState([]);

  const [search, setSearch] = useState("");

  const [showSearch, setShowSearch] = useState(false);

  const [token, setToken] = useState("");

  const [user, setUser] = useState(null);

  const [appLoading, setAppLoading] = useState(true);


  /* =====================================================
     GET USER LIST
     Existing functionality
  ===================================================== */

  const getUserList = useCallback(async () => {

    try {

      const { data } = await axios.get(
        `${backendUrl}/api/users/list`
      );

      if (data.success) {

        setUserList(data.users);

      } else {

        toast.error(
          data.message ||
          "Unable to fetch user list"
        );

      }

    } catch (error) {

      console.error(
        "GET USER LIST ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch user list"
      );

    }

  }, [backendUrl]);


  /* =====================================================
     GET LOGGED-IN USER PROFILE
  ===================================================== */

  const getUserProfile = useCallback(async () => {

    try {

      const savedToken =
        localStorage.getItem("token");


      /* -----------------------------------------------
         NO TOKEN
      ----------------------------------------------- */

      if (!savedToken) {

        setUser(null);

        return {
          user: null,
          message: "No auth token available",
        };
      }


      /* -----------------------------------------------
         API REQUEST
      ----------------------------------------------- */

      const { data } = await axios.get(
        `${backendUrl}/api/user/profile`,
        {
          headers: {
            Authorization:
              `Bearer ${savedToken}`,
          },
        }
      );


      /* -----------------------------------------------
         SUCCESS
      ----------------------------------------------- */

      if (data?.success) {

        setUser(data.user);

        return {
          user: data.user,
        };
      }


      /* -----------------------------------------------
         API RETURNED FAILURE
      -----------------------------------------------
      */

      const errorMessage =
        data?.message ||
        "Unable to fetch profile";

      toast.error(errorMessage);

      return {
        user: null,
        message: errorMessage,
      };


    } catch (error) {

      console.error(
        "GET USER PROFILE ERROR:",
        error
      );


      /* -----------------------------------------------
         INVALID / EXPIRED TOKEN
      ----------------------------------------------- */

      if (
        error.response?.status === 401
      ) {

        localStorage.removeItem("token");

        localStorage.removeItem(
          "userName"
        );

        localStorage.removeItem(
          "kycCompleted"
        );

        setToken("");

        setUser(null);

        navigate("/login");

        return {
          user: null,
          message: "Invalid or expired token",
        };
      }

      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch profile";

      toast.error(errorMessage);

      return {
        user: null,
        message: errorMessage,
      };

    }

  }, [backendUrl, navigate]);


  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("userName");

    localStorage.removeItem(
      "kycCompleted"
    );


    setToken("");

    setUser(null);

    setSearch("");

    setShowSearch(false);


    navigate("/");


    toast.success(
      "Logged out successfully 👋"
    );
  };


  /* =====================================================
     APP INITIALIZATION
  ===================================================== */

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const savedToken = localStorage.getItem("token");

        if (savedToken) {
          setToken(savedToken);
        }

      } catch (error) {
        console.error("APP INITIALIZATION ERROR:", error);
      } finally {
        setAppLoading(false);
      }
    };

    initializeApp();
  }, []);


  /* =====================================================
     CONTEXT VALUE
  ===================================================== */

  const value = {

    /* Backend */
    backendUrl,

    /* App */
    appLoading,

    /* Authentication */
    token,
    setToken,

    /* Current logged-in user */
    user,
    setUser,
    getUserProfile,

    /* User list */
    userList,
    setUserList,
    getUserList,

    /* Search */
    search,
    setSearch,

    showSearch,
    setShowSearch,

    /* Navigation */
    navigate,
    LJKA_TITLE,

    /* Logout */
    logout,
    contactInfo,
  };


  return (
    <LJKAContext.Provider value={value}>
      {children}
    </LJKAContext.Provider>
  );
};


export default LJKAContextProvider;