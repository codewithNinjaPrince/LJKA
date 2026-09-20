import { Navigate, Route, Routes } from "react-router-dom";
import AdminLogin from "./components/AdminLogin.jsx";
import { AdminShell } from "./pages/AdminPortal.jsx";

export default function App() {
  return (
    <Routes>
      {/* Authentication */}
      <Route
        path="/superadmin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* Admin Portal */}
      <Route
        path="/superadmin/*"
        element={<AdminShell />}
      />

      <Route
        path="/admin/*"
        element={<AdminShell />}
      />

      {/* Fallback */}
      <Route
        path="*"
        element={
          <Navigate
            to="/superadmin/login"
            replace
          />
        }
      />
    </Routes>
  );
}
