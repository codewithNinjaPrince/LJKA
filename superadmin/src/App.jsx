import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLogin, AdminShell } from "./AdminPortal.jsx";
import SahyogCrudPortal from "./SahyogCrudPortal.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/superadmin/login" element={<AdminLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/superadmin/sahyog/*" element={<SahyogCrudPortal />} />
      <Route path="/admin/sahyog/*" element={<SahyogCrudPortal />} />
      <Route path="/superadmin/*" element={<AdminShell />} />
      <Route path="/admin/*" element={<AdminShell />} />
      <Route path="*" element={<Navigate to="/superadmin/login" replace />} />
    </Routes>
  );
}
