import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { adminApi } from "../services/adminApi.js";

const statusOptions = ["new", "read", "in_progress", "resolved"];

export default function ContactMessages({ token, isSuperadmin, canUpdate }) {
  const [contacts, setContacts] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try {
      const response = await adminApi(token).get("/contacts", { params: { search } });
      setContacts(response.data.contacts || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load contact messages");
    }
  }, [search, token]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    if (!isSuperadmin) return;
    adminApi(token).get("/contacts/assignees")
      .then((response) => setAdmins(response.data.admins || []))
      .catch(() => toast.error("Could not load administrators for assignment"));
  }, [isSuperadmin, token]);

  const update = async (id, changes) => {
    try {
      const response = await adminApi(token).patch(`/contacts/${id}`, changes);
      setContacts((items) => items.map((item) => item._id === id ? response.data.contact : item));
      setSelected((item) => item?._id === id ? response.data.contact : item);
      toast.success("Contact message updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update contact message");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this contact message? This cannot be undone.")) return;
    try {
      await adminApi(token).delete(`/contacts/${id}`);
      setContacts((items) => items.filter((item) => item._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success("Contact message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete contact message");
    }
  };

  return <>
    <div className="mb-7"><h2 className="text-2xl font-bold text-[#5a0615]">Contact Messages</h2><p className="mt-1 text-sm text-slate-500">{isSuperadmin ? "Review every message and assign it to an administrator when follow-up is needed." : "All contact messages submitted from the website."}</p></div>
    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sender, contact detail, subject or message" className="mb-5 w-full max-w-xl rounded-lg border bg-white p-3" />
    <div className="grid gap-4 xl:grid-cols-2">{contacts.map((contact) => <article key={contact._id} className="rounded-xl border bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h3 className="font-bold text-[#5a0615]">{contact.name}</h3><p className="mt-1 break-all text-sm text-slate-500">{contact.email || contact.phone || "No contact detail"}</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase text-slate-700">{String(contact.status || "new").replace("_", " ")}</span></div><p className="mt-4 font-semibold text-slate-700">{contact.subject}</p><p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{contact.message}</p><p className="mt-3 text-xs text-slate-400">Received {contact.createdAt ? new Date(contact.createdAt).toLocaleString("en-IN") : "—"}</p>{contact.assignedTo?.fullName && <p className="mt-1 text-xs text-slate-500">Assigned to {contact.assignedTo.fullName}</p>}<div className="mt-5 flex flex-wrap gap-4 border-t pt-4"><button onClick={() => { setSelected(contact); if (canUpdate && contact.status === "new") update(contact._id, { status: "read" }); }} className="font-semibold text-[#78081c]">View</button>{canUpdate && <select value={contact.status || "new"} onChange={(event) => update(contact._id, { status: event.target.value })} className="rounded border px-2 py-1 text-sm">{statusOptions.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select>}{isSuperadmin && <button onClick={() => remove(contact._id)} className="font-semibold text-rose-700">Delete</button>}</div></article>)}</div>
    {!contacts.length && <p className="rounded-xl border bg-white p-8 text-center text-slate-500">No contact messages found.</p>}

    {selected && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" role="dialog" aria-modal="true"><section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wide text-[#78081c]">Contact message</p><h3 className="mt-1 text-xl font-bold text-slate-800">{selected.subject}</h3></div><button onClick={() => setSelected(null)} className="rounded-lg border px-3 py-1.5 text-sm font-semibold">Close</button></div><dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-slate-500">From</dt><dd className="font-semibold">{selected.name}</dd></div><div><dt className="text-slate-500">Email</dt><dd className="break-all font-semibold">{selected.email || "—"}</dd></div><div><dt className="text-slate-500">Phone</dt><dd className="font-semibold">{selected.phone || "—"}</dd></div><div><dt className="text-slate-500">Received</dt><dd className="font-semibold">{new Date(selected.createdAt).toLocaleString()}</dd></div></dl><div className="mt-6 rounded-xl bg-slate-50 p-4"><p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{selected.message}</p></div>{isSuperadmin && <label className="mt-6 block text-sm font-semibold">Assign to administrator<select value={selected.assignedTo?._id || ""} onChange={(event) => update(selected._id, { assignedTo: event.target.value })} className="mt-2 w-full rounded-lg border p-3"><option value="">Keep in superadmin inbox</option>{admins.map((admin) => <option key={admin._id} value={admin._id}>{admin.fullName} · {admin.username}</option>)}</select></label>}{!isSuperadmin && selected.assignedTo && <p className="mt-6 text-sm text-slate-500">Assigned to you by the superadmin.</p>}</section></div>}
  </>;
}
