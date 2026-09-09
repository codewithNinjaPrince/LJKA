import { useContext, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { LJKAContext } from "./context/LJKAContext";
import PublicLayout from "./layouts/PublicLayout";
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Niyamawali from "./pages/Niyamawali";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Register from "./pages/Register";
import SahyogList from "./pages/SahyogList";
import TermsConditions from "./pages/TermsConditions";
import UserList from "./pages/UserList";
import VyawasthaList from "./pages/VyawasthaList";
import ForgotPassword from "./pages/ForgotPassword";
import KYC from "./pages/KYC";
import ViewProfile from "./pages/user/ViewProfile";

const AuthRoute = ({ children }) => {
  const { token, user, appLoading } = useContext(LJKAContext);

  if (appLoading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.kycCompleted) {
    return <Navigate to="/kyc" replace />;
  }

  return children;
};


const KYCGuard = ({ children }) => {
  const { token, user, appLoading } = useContext(LJKAContext);

  if (appLoading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.kycCompleted) {
    return <Navigate to="/user/view-profile" replace />;
  }

  return children;
};


const AuthPageGuard = ({ children }) => {
  const { token, user, appLoading } = useContext(LJKAContext);

  if (appLoading) {
    return null;
  }

  if (!token || !user) {
    return children;
  }

  if (!user.kycCompleted) {
    return <Navigate to="/kyc" replace />;
  }

  return <Navigate to="/user/view-profile" replace />;
};

const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route
  path="/login"
  element={
    <AuthPageGuard>
      <Login />
    </AuthPageGuard>
  }
/>
        <Route
  path="/register"
  element={
    <AuthPageGuard>
      <Register />
    </AuthPageGuard>
  }
/>
        <Route path="/niyamawali" element={<Niyamawali />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/sahyog-list" element={<SahyogList />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/user-list" element={<UserList />} />
        <Route path="/vyawastha-list" element={<VyawasthaList />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
  path="/kyc"
  element={
    <KYCGuard>
      <KYC />
    </KYCGuard>
  }
/>
      </Route>

     <Route
  path="/user"
  element={
    <AuthRoute>
      <UserLayout />
    </AuthRoute>
  }
>
  <Route path="view-profile" element={<ViewProfile />} />
  <Route path="update-profile" element={<KYC />} />
</Route>
    </Routes>
  );
};

export default App;



// const App = () => {
//   return (
//     <div className="w-full min-h-screen bg-black text-white relative overflow-x-hidden"> 
//       <div className="fixed top-0 left-0 z-50 w-full bg-white">
//         <AnnouncementBar />
//         <Header />
//         <Navbar />
//       </div>

//       <main className="pt-[120px] sm:pt-[130px] md:pt-[135px] lg:pt-[140px]">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<AboutUs />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/niyamawali" element={<Niyamawali />} />
//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/sahyog-list" element={<SahyogList />} />
//           <Route path="/terms-condition" element={<TermsConditions />} />
//           <Route path="/user-list" element={<UserList />} />
//           <Route path="/vyawastha-list" element={<VyawasthaList />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/kyc" element={<KYC />} />
//         </Routes>
//       </main>

//       <Footer />
//     </div>
//   )
// }

// export default App