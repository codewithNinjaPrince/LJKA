import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { adminApi } from "../../services/adminApi.js";
import { actionLabels, PageTitle } from "./ui.jsx";
import { LoadingButton } from "../sahyog/SahyogUi.jsx";

export default function RightsEditor({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const root = pathname.startsWith("/superadmin") ? "/superadmin" : "/admin";
  const [data, setData] = useState(null);
  const [rights, setRights] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadRights = async () => {
      try {
        const response = await adminApi(token).get(`/admins/${id}/rights`);
        setData(response.data);
        setRights(response.data.admin.permissions || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load rights");
      }
    };

    loadRights();
  }, [id, token]);

  const toggle = (module, action) => {
    setRights((currentRights) => {
      const existingActions = currentRights.find((entry) => entry.module === module)?.actions || [];
      const actions = existingActions.includes(action)
        ? existingActions.filter((item) => item !== action)
        : [...existingActions, action];

      return [...currentRights.filter((entry) => entry.module !== module), { module, actions }];
    });
  };

  const save = async () => {
    if (!window.confirm("Save these permissions? The admin will need to sign in again.")) return;

    setIsSaving(true);
    try {
      await adminApi(token).put(`/admins/${id}/rights`, { permissions: rights });
      toast.success("Rights saved. The admin must sign in again to use the new access.");
      navigate(`${root}/admins`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save rights");
    } finally {
      setIsSaving(false);
    }
  };

  if (!data) return <div>Loading rights…</div>;

  return <>
    <PageTitle title={`Rights: ${data.admin.fullName}`} subtitle={`${data.admin.email} · ${data.admin.status}`} />
    <div className="space-y-4">{data.modules.map((module) => <section key={module.key} className="rounded-xl border bg-white p-5"><h3 className="font-bold text-[#5a0615]">{module.label}</h3><div className="mt-4 flex flex-wrap gap-3">{module.actions.map((action) => {
      const checked = rights.find((entry) => entry.module === module.key)?.actions.includes(action) || false;
      return <label key={action} className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm"><input type="checkbox" checked={checked} onChange={() => toggle(module.key, action)} /><span>{actionLabels[action] || action}</span></label>;
    })}</div></section>)}</div>
    <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row"><button onClick={() => navigate(`${root}/admins`)} disabled={isSaving} className="rounded-lg border px-5 py-3 font-semibold disabled:opacity-60">Cancel</button><LoadingButton loading={isSaving} onClick={save} className="rounded-lg bg-[#78081c] px-5 py-3 font-semibold text-white">Save Permissions</LoadingButton></div>
  </>;
}
