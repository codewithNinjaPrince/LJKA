import { Navigate, Route, Routes } from "react-router-dom";

import SahyogCases from "../components/sahyog/SahyogCases.jsx";
import SahyogDetails from "../components/sahyog/SahyogDetails.jsx";
import SahyogDonations from "../components/sahyog/SahyogDonations.jsx";
import SahyogForm from "../components/sahyog/SahyogForm.jsx";

const can = (admin, module, action) =>
  admin?.role === "superadmin" || admin?.permissions?.some(
    (permission) => permission.module === module && permission.actions.includes(action)
  );

export default function SahyogCrudPortal({ token, admin }) {
  const root = admin.role === "superadmin" ? "/superadmin" : "/admin";

  return <Routes>
    <Route index element={<SahyogCases token={token} admin={admin} root={root} />} />
    <Route path="new" element={can(admin, "sahyog", "create") ? <SahyogForm token={token} root={root} /> : <Navigate to=".." replace />} />
    <Route path=":id" element={<SahyogDetails token={token} admin={admin} root={root} />} />
    <Route path=":id/edit" element={can(admin, "sahyog", "update") ? <SahyogForm token={token} root={root} /> : <Navigate to=".." replace />} />
    <Route path=":id/donations" element={can(admin, "sahyog-donations", "view") ? <SahyogDonations token={token} admin={admin} root={root} /> : <Navigate to=".." replace />} />
  </Routes>;
}
