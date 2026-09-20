import { Modal } from "./ui.jsx";
import { LoadingButton } from "../sahyog/SahyogUi.jsx";

const fields = [["fullName", "Full name", "text", true], ["email", "Email", "email", true], ["mobile", "Mobile", "tel", false], ["username", "Username", "text", true], ["password", "Password", "password", true]];

export default function AdminCreateModal({ isOpen, form, isCreating, onChange, onClose, onSubmit }) {
  if (!isOpen) return null;
  const submit = (event) => { event.preventDefault(); onSubmit(); };

  return <Modal title="Create Admin" close={onClose}><form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">{fields.map(([key, label, type, required]) => <label key={key} className="text-sm font-medium">{label}<input required={required} disabled={isCreating} type={type} className="mt-1 w-full rounded-lg border p-2 disabled:bg-slate-100" value={form[key]} onChange={(event) => onChange({ ...form, [key]: event.target.value })} /></label>)}<p className="text-sm text-slate-500 sm:col-span-2">This account will be active immediately. No KYC is required for administrators.</p><div className="flex justify-end gap-2 sm:col-span-2"><button type="button" disabled={isCreating} onClick={onClose} className="rounded-lg border px-4 py-2 disabled:opacity-60">Cancel</button><LoadingButton loading={isCreating} className="rounded-lg bg-[#78081c] px-4 py-2 text-white">Create Active Admin</LoadingButton></div></form></Modal>;
}
