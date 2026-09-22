import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { adminApi } from "../services/adminApi.js";

const emptyAlert = { title: "", message: "", isActive: true };

export default function SahyogAlerts({ token, canCreate, canUpdate, canDelete }) {
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState(emptyAlert);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await adminApi(token).get("/sahyog-alerts");
      setAlerts(response.data.alerts || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load Sahyog alerts");
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await adminApi(token).patch(`/sahyog-alerts/${editingId}`, form);
        toast.success("Sahyog alert updated");
      } else {
        await adminApi(token).post("/sahyog-alerts", form);
        toast.success("Sahyog alert created");
      }
      setForm(emptyAlert);
      setEditingId(null);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save Sahyog alert");
    } finally {
      setIsSaving(false);
    }
  };

  const edit = (alert) => {
    setEditingId(alert._id);
    setForm({ title: alert.title, message: alert.message, isActive: alert.isActive });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this Sahyog alert?")) return;
    try {
      await adminApi(token).delete(`/sahyog-alerts/${id}`);
      toast.success("Sahyog alert deleted");
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyAlert);
      }
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete Sahyog alert");
    }
  };

  return <>
    <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-bold text-[#5a0615]">Sahyog Alerts</h2><p className="mt-1 text-sm text-slate-500">Create and manage the notices shown to members.</p></div></div>

    {(canCreate || (editingId && canUpdate)) && <form onSubmit={save} className="mb-6 rounded-xl border bg-white p-5 shadow-sm"><h3 className="font-bold text-[#5a0615]">{editingId ? "Edit alert" : "New alert"}</h3><div className="mt-4 grid gap-4"><label>Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label><label>Message<textarea required value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="mt-1 min-h-28 w-full rounded-lg border p-3" /></label><label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} />Show this alert to members</label></div><div className="mt-5 flex flex-wrap gap-3"><button disabled={isSaving} className="rounded-lg bg-[#78081c] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Saving…" : editingId ? "Save changes" : "Create alert"}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyAlert); }} className="rounded-lg border px-4 py-2.5 text-sm font-semibold">Cancel</button>}</div></form>}

    <div className="grid gap-4 lg:grid-cols-2">{alerts.map((alert) => <article key={alert._id} className="rounded-xl border bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-[#5a0615]">{alert.title}</h3><p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{alert.isActive ? "Active" : "Hidden"}</p></div><time className="text-xs text-slate-400">{new Date(alert.updatedAt).toLocaleDateString()}</time></div><p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">{alert.message}</p><div className="mt-5 flex gap-4 border-t pt-4">{canUpdate && <button onClick={() => edit(alert)} className="font-semibold text-[#78081c]">Edit</button>}{canDelete && <button onClick={() => remove(alert._id)} className="font-semibold text-rose-700">Delete</button>}</div></article>)}</div>
    {!alerts.length && <p className="rounded-xl border bg-white p-8 text-center text-slate-500">No Sahyog alerts created yet.</p>}
  </>;
}
