import { StatusBadge } from "./ui.jsx";

export default function AdminTable({ admins, isLoading, onOpenRights, onChangeStatus }) {
  if (isLoading) return <p className="rounded-xl border bg-white p-8 text-center text-slate-500">Loading administrators…</p>;
  if (!admins.length) return <p className="rounded-xl border bg-white p-8 text-center text-slate-500">No administrators created yet.</p>;

  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {admins.map((admin) => <article key={admin._id} className="rounded-xl border bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-[#5a0615]">{admin.fullName}</h3><p className="mt-1 break-all text-sm text-slate-500">{admin.email}</p></div><StatusBadge value={admin.status} /></div><dl className="mt-5 space-y-2 text-sm"><div className="flex justify-between gap-3"><dt className="text-slate-500">Username</dt><dd>{admin.username}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Last login</dt><dd>{admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString() : "Never"}</dd></div></dl><div className="mt-5 flex flex-wrap gap-3 border-t pt-4"><button onClick={() => onOpenRights(admin)} className="font-semibold text-[#78081c]">View Rights</button><button onClick={() => onChangeStatus(admin._id, admin.status === "active" ? "disabled" : "active")} className="font-semibold text-slate-700">{admin.status === "active" ? "Disable" : "Enable"}</button></div></article>)}
  </div>;
}
