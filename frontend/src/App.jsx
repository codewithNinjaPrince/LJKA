import React from "react";
import { Routes, Route } from "react-router-dom";
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
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AnnouncementBar from "./components/AnnouncementBar";

const App = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/niyamawali" element={<Niyamawali />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/sahyog-list" element={<SahyogList />} />
      <Route path="/terms-conditions" element={<TermsConditions />} />
      <Route path="/user-list" element={<UserList />} />
      <Route path="/vyawastha-list" element={<VyawasthaList />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/kyc" element={<KYC />} />
    </Route>

    <Route path="/user" element={<UserLayout />}>
      <Route path="view-profile" element={<ViewProfile />} />
    </Route>
  </Routes>
);

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