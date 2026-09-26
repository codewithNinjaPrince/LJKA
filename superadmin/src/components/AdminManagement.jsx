import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { adminApi } from "../services/adminApi.js";
import AdminCreateModal from "./admin-management/AdminCreateModal.jsx";
import AdminTable from "./admin-management/AdminTable.jsx";
import RightsEditor from "./admin-management/RightsEditor.jsx";
import { PageTitle } from "./admin-management/ui.jsx";

const initialForm = { fullName: "", email: "", mobile: "", username: "", password: "" };

function AdminManagement({ token }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const root = pathname.startsWith("/superadmin") ? "/superadmin" : "/admin";
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(initialForm);

  const loadAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminApi(token).get("/admins");
      setAdmins(response.data.admins);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load administrators");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { loadAdmins(); }, [loadAdmins]);

  const createAdmin = async () => {
    setIsCreating(true);
    try {
      await adminApi(token).post("/admins", form);
      toast.success("Admin created and activated. They can sign in now.");
      setForm(initialForm);
      setIsCreateOpen(false);
      loadAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create admin");
    } finally {
      setIsCreating(false);
    }
  };

  const updateStatus = async (id, nextStatus) => {
    if (!window.confirm(`Set this account to ${nextStatus}?`)) return;
    try {
      await adminApi(token).patch(`/admins/${id}/status`, { status: nextStatus });
      toast.success(`Admin account ${nextStatus}`);
      loadAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    }
  };

  const deleteAdmin = async (id, name) => {
    if (!window.confirm(`Delete administrator ${name}? This cannot be undone.`)) return;
    try {
      await adminApi(token).delete(`/admins/${id}`);
      toast.success("Admin deleted");
      loadAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete admin");
    }
  };

  return (
    <>
      <PageTitle
        title="Admin Management"
        subtitle="New administrators are active immediately and do not require KYC."
        action={<button onClick={() => setIsCreateOpen(true)} className="rounded-lg bg-[#78081c] px-4 py-2 text-sm font-semibold text-white">Create Admin</button>}
      />
      <AdminTable admins={admins} isLoading={isLoading} onOpenRights={(admin) => navigate(`${root}/admins/${admin._id}/rights`)} onChangeStatus={updateStatus} onDelete={deleteAdmin} />
      <AdminCreateModal isOpen={isCreateOpen} form={form} isCreating={isCreating} onChange={setForm} onClose={() => setIsCreateOpen(false)} onSubmit={createAdmin} />
    </>
  );
}

export function Rights({ token }) {
  return <RightsEditor token={token} />;
}

export default AdminManagement;
