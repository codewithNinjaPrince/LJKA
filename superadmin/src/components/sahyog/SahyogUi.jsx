import { LoaderCircle } from "lucide-react";

export const statusStyles = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-amber-100 text-amber-800",
  active: "bg-emerald-100 text-emerald-800",
  success: "bg-emerald-100 text-emerald-800",
  closed: "bg-blue-100 text-blue-800",
  disabled: "bg-rose-100 text-rose-800",
  failed: "bg-rose-100 text-rose-800",
  rejected: "bg-rose-100 text-rose-800",
  refunded: "bg-slate-200 text-slate-700",
};

export function StatusBadge({ value }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${statusStyles[value] || statusStyles.draft}`}>{value}</span>;
}

export function LoadingButton({ loading, children, className = "", ...props }) {
  return <button {...props} disabled={loading || props.disabled} className={`inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}>{loading && <LoaderCircle size={17} className="animate-spin" />}{children}</button>;
}

export function PageHeading({ title, subtitle, action }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-bold text-[#5a0615]">{title}</h2>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>{action}</div>;
}
