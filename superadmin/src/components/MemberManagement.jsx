import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, X } from "lucide-react";
import { toast } from "react-toastify";
import locationData from "@indiaLocations";
import { adminApi } from "../services/adminApi.js";
import { dateInputValue } from "../utils/dates.js";

const emptyForm = {
  fullName: "",
  email: "",
  mobile: "",
  password: "",
  fatherHusbandName: "",
  aadhaar: "",
  dob: "",
  gender: "",
  state: "",
  district: "",
  tehsil: "",
  townVillage: "",
  addressLine: "",
  pincode: "",
  employmentStatus: "",
  occupation: "",
  referralCode: "",
  nomineeName: "",
  nomineeMobile: "",
  nomineeEmail: "",
  nomineeRelationship: "",
  accountStatus: "active",
};

const statusClass = (value) =>
  ({
    active: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    disabled: "bg-slate-200 text-slate-700",
    rejected: "bg-rose-100 text-rose-800",
    deceased: "bg-slate-200 text-slate-700",
    completed: "bg-emerald-100 text-emerald-800",
  }[String(value).toLowerCase()] || "bg-slate-100 text-slate-700");

const Badge = ({ value }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${statusClass(value)}`}>{value}</span>
);

export default function MemberManagement({ token, canCreate, canUpdate }) {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const set = (key, value) => setForm((current) => {
    if (key === "state") return { ...current, state: value, district: "", tehsil: "" };
    if (key === "district") return { ...current, district: value, tehsil: "" };
    return { ...current, [key]: value };
  });

  const stateOptions = useMemo(
    () => [...(locationData.states || [])].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const selectedState = stateOptions.find((item) => String(item.code) === String(form.state));
  const districtOptions = [...(selectedState?.districts || [])].sort((a, b) => a.name.localeCompare(b.name));
  const selectedDistrict = districtOptions.find((item) => String(item.code) === String(form.district));
  const tehsilOptions = [...(selectedDistrict?.tehsils || [])].sort((a, b) => a.name.localeCompare(b.name));

  const load = useCallback(
    () =>
      adminApi(token)
        .get("/members", { params: { search } })
        .then((response) => setMembers(response.data.members || []))
        .catch((error) => toast.error(error.response?.data?.message || "Could not load members")),
    [token, search]
  );

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const close = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  const openEdit = (member) => {
    setEditingId(member._id);
    setForm({
      ...emptyForm,
      fullName: member.fullName || "",
      email: member.email || "",
      mobile: member.mobile || "",
      fatherHusbandName: member.fatherHusbandName || "",
      dob: dateInputValue(member.dob),
      gender: member.gender || "",
      state: member.address?.stateCode ? String(member.address.stateCode) : "",
      district: member.address?.districtCode ? String(member.address.districtCode) : "",
      tehsil: member.address?.tehsilCode ? String(member.address.tehsilCode) : "",
      townVillage: member.address?.townVillage || "",
      addressLine: member.address?.address || "",
      pincode: member.address?.pincode || "",
      employmentStatus: member.employmentStatus || "",
      occupation: member.occupation || "",
      referralCode: member.referralCode || "",
      nomineeName: member.nominee?.name || "",
      nomineeMobile: member.nominee?.mobile || "",
      nomineeEmail: member.nominee?.email || "",
      nomineeRelationship: member.nominee?.relationship || "",
      accountStatus: member.accountStatus || "active",
    });
    setIsDialogOpen(true);
  };

  const payload = () => {
    const state = stateOptions.find((item) => String(item.code) === String(form.state));
    const district = districtOptions.find((item) => String(item.code) === String(form.district));
    const tehsil = tehsilOptions.find((item) => String(item.code) === String(form.tehsil));
    return {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      mobile: form.mobile,
      password: form.password,
      fatherHusbandName: form.fatherHusbandName.trim(),
      aadhaar: form.aadhaar,
      dob: form.dob,
      gender: form.gender,
      address: {
        stateCode: Number(form.state),
        stateName: state?.name || "",
        districtCode: Number(form.district),
        districtName: district?.name || "",
        tehsilCode: Number(form.tehsil),
        tehsilName: tehsil?.name || "",
        townVillage: form.townVillage.trim(),
        address: form.addressLine.trim(),
        pincode: form.pincode,
      },
      employmentStatus: form.employmentStatus,
      occupation: form.occupation.trim(),
      referralCode: form.referralCode.trim().toUpperCase(),
      nominee: {
        name: form.nomineeName.trim(),
        mobile: form.nomineeMobile,
        email: form.nomineeEmail.trim(),
        relationship: form.nomineeRelationship.trim(),
      },
      accountStatus: form.accountStatus,
    };
  };

  const save = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const body = payload();
      if (editingId) {
        const { email, password, ...rest } = body;
        if (!rest.aadhaar) delete rest.aadhaar;
        if (!rest.referralCode) delete rest.referralCode;
        await adminApi(token).patch(`/members/${editingId}`, rest);
        toast.success("Member updated");
      } else {
        await adminApi(token).post("/members", body);
        toast.success("Member created");
      }
      close();
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save member");
    } finally {
      setIsSaving(false);
    }
  };

  const field = (label, input) => (
    <label className="text-sm font-medium">
      {label}
      {input}
    </label>
  );

  return <>
    <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold text-[#5a0615]">Members</h2>
        <p className="mt-1 text-sm text-slate-500">Create and edit members with the same KYC details used on the member portal. Aadhaar is never returned after save.</p>
      </div>
      <div className="flex gap-3">
        {canCreate && <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#78081c] px-3 py-2 text-sm font-semibold text-white"><Plus size={15} />Create member</button>}
        <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"><RefreshCw size={15} />Refresh</button>
      </div>
    </div>
    <input className="mb-4 w-full max-w-md rounded-lg border bg-white p-3" placeholder="Search name, email, member ID or mobile" value={search} onChange={(event) => setSearch(event.target.value)} />
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500"><tr>{["Member", "Member ID", "Mobile", "KYC", "Registered", "Actions"].map((label) => <th key={label} className="p-4 font-medium">{label}</th>)}</tr></thead>
        <tbody>
          {members.map((member) => (
            <tr key={member._id} className="border-t">
              <td className="p-4"><b>{member.fullName}</b><br /><span className="text-slate-500">{member.email}</span></td>
              <td className="p-4">{member.memberId || "—"}</td>
              <td className="p-4">{member.mobile || "—"}</td>
              <td className="p-4"><Badge value={member.kycCompleted ? "completed" : "pending"} /></td>
              <td className="p-4 text-slate-500">{new Date(member.createdAt).toLocaleDateString("en-IN")}</td>
              <td className="p-4">{canUpdate && <button onClick={() => openEdit(member)} className="font-semibold text-[#78081c]">Edit</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!members.length && <p className="p-6 text-slate-500">No matching members.</p>}
    </div>

    {isDialogOpen && (
      <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
        <form onSubmit={save} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#5a0615]">{editingId ? "Edit member" : "Create member"}</h3>
              <p className="mt-1 text-sm text-slate-500">{editingId ? "Email cannot be changed. Leave Aadhaar blank to keep the existing value." : "Fill every KYC field so the member can be created as a completed member."}</p>
            </div>
            <button type="button" onClick={close} className="rounded-lg border px-3 py-1.5 text-sm"><X size={16} /></button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {field("Full name", <input required value={form.fullName} onChange={(event) => set("fullName", event.target.value)} className="mt-1 w-full rounded-lg border p-3" />)}
            {field("Mobile", <input required inputMode="numeric" maxLength={10} value={form.mobile} onChange={(event) => set("mobile", event.target.value.replace(/\D/g, "").slice(0, 10))} className="mt-1 w-full rounded-lg border p-3" />)}
            {!editingId && field("Email", <input required type="email" value={form.email} onChange={(event) => set("email", event.target.value)} className="mt-1 w-full rounded-lg border p-3" />)}
            {!editingId && field("Temporary password", <input required minLength={6} type="password" value={form.password} onChange={(event) => set("password", event.target.value)} className="mt-1 w-full rounded-lg border p-3" />)}
            {field("Father / Husband name", <input required value={form.fatherHusbandName} onChange={(event) => set("fatherHusbandName", event.target.value)} className="mt-1 w-full rounded-lg border p-3" />)}
            {field(editingId ? "Aadhaar (leave blank to keep)" : "Aadhaar", <input required={!editingId} inputMode="numeric" maxLength={12} value={form.aadhaar} onChange={(event) => set("aadhaar", event.target.value.replace(/\D/g, "").slice(0, 12))} className="mt-1 w-full rounded-lg border p-3" />)}
            {field("Date of birth", <input required type="date" value={form.dob} onChange={(event) => set("dob", event.target.value)} className="mt-1 w-full rounded-lg border p-3" />)}
            {field("Gender", <select required value={form.gender} onChange={(event) => set("gender", event.target.value)} className="mt-1 w-full rounded-lg border p-3"><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>)}
            {field("State", <select required value={form.state} onChange={(event) => set("state", event.target.value)} className="mt-1 w-full rounded-lg border p-3"><option value="">Select state</option>{stateOptions.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select>)}
            {field("District", <select required disabled={!form.state} value={form.district} onChange={(event) => set("district", event.target.value)} className="mt-1 w-full rounded-lg border p-3"><option value="">Select district</option>{districtOptions.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select>)}
            {field("Tehsil", <select required disabled={!form.district} value={form.tehsil} onChange={(event) => set("tehsil", event.target.value)} className="mt-1 w-full rounded-lg border p-3"><option value="">Select tehsil</option>{tehsilOptions.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select>)}
            {field("Town / village / city", <input required value={form.townVillage} onChange={(event) => set("townVillage", event.target.value)} className="mt-1 w-full rounded-lg border p-3" />)}
            {field("Address", <textarea required value={form.addressLine} onChange={(event) => set("addressLine", event.target.value)} className="mt-1 min-h-20 w-full rounded-lg border p-3" />)}
            {field("Pincode", <input required inputMode="numeric" maxLength={6} value={form.pincode} onChange={(event) => set("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))} className="mt-1 w-full rounded-lg border p-3" />)}
            {field("Employment status", <select required value={form.employmentStatus} onChange={(event) => set("employmentStatus", event.target.value)} className="mt-1 w-full rounded-lg border p-3"><option value="">Select status</option><option value="government">Government</option><option value="private">Private</option><option value="business">Business</option><option value="others">Others</option></select>)}
            {field("Occupation", <input required value={form.occupation} onChange={(event) => set("occupation", event.target.value)} className="mt-1 w-full rounded-lg border p-3" />)}
            {field("Referral code", <input required={!editingId} value={form.referralCode} onChange={(event) => set("referralCode", event.target.value.toUpperCase())} className="mt-1 w-full rounded-lg border p-3" />)}
            {field("Nominee name", <input required value={form.nomineeName} onChange={(event) => set("nomineeName", event.target.value)} className="mt-1 w-full rounded-lg border p-3" />)}
            {field("Nominee mobile", <input required inputMode="numeric" maxLength={10} value={form.nomineeMobile} onChange={(event) => set("nomineeMobile", event.target.value.replace(/\D/g, "").slice(0, 10))} className="mt-1 w-full rounded-lg border p-3" />)}
            {field("Nominee email", <input type="email" value={form.nomineeEmail} onChange={(event) => set("nomineeEmail", event.target.value)} className="mt-1 w-full rounded-lg border p-3" />)}
            {field("Nominee relationship", <input required value={form.nomineeRelationship} onChange={(event) => set("nomineeRelationship", event.target.value)} className="mt-1 w-full rounded-lg border p-3" />)}
            {editingId && field("Account status", <select value={form.accountStatus} onChange={(event) => set("accountStatus", event.target.value)} className="mt-1 w-full rounded-lg border p-3"><option value="active">Active</option><option value="disabled">Disabled</option><option value="deceased">Deceased</option></select>)}
          </div>

          <div className="mt-6 flex gap-3">
            <button disabled={isSaving} className="rounded-lg bg-[#78081c] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Saving…" : editingId ? "Save changes" : "Create member"}</button>
            <button type="button" onClick={close} className="rounded-lg border px-4 py-2.5 text-sm font-semibold">Cancel</button>
          </div>
        </form>
      </div>
    )}
  </>;
}
