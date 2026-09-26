import { X } from "lucide-react";

export const actionLabels = { view: "View", create: "Create", update: "Edit", delete: "Disable", approve: "Approve", verify: "Verify donation", reject: "Reject donation" };

export function PageTitle({ title, subtitle, action }) {
  return <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-bold text-[#5a0615]">{title}</h2>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>{action}</div>;
}

export function StatusBadge({ value }) {
  const className = { active: "bg-emerald-100 text-emerald-800", disabled: "bg-slate-200 text-slate-700" }[String(value).toLowerCase()] || "bg-slate-100 text-slate-700";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${className}`}>{value}</span>;
}

export function Modal({ title, close, children }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h3 className="text-lg font-bold text-[#5a0615]">{title}</h3><button type="button" onClick={close} aria-label="Close dialog"><X /></button></div>{children}</div></div>;
}
