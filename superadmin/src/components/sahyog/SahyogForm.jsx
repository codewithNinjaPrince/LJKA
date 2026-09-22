import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { adminApi } from "../../services/adminApi.js";
import { dateInputValue } from "../../utils/dates.js";
import { LoadingButton, PageHeading } from "./SahyogUi.jsx";

const blankForm = () => ({
  memberId: "",
  dateOfDeath: "",
  contactName: "",
  contactMobile: "",
  address: "",
  minimumDonationAmount: "",
  status: "active",
  paymentDetails: { bankName: "", accountHolderName: "", accountNumber: "", ifsc: "", upiId: "", paymentCode: "", branchName: "" },
  publicPayment: { upiId: "" },
});

export default function SahyogForm({ token, root }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(blankForm);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (editing) {
          const response = await adminApi(token).get(`/sahyog/${id}`);
          const item = response.data.sahyog;
          setForm({ ...blankForm(), ...item, memberId: item.memberId?._id || item.memberId, dateOfDeath: dateInputValue(item.dateOfDeath), paymentDetails: { ...blankForm().paymentDetails, ...item.paymentDetails }, publicPayment: { upiId: item.publicPayment?.upiId || "" } });
        } else {
          const response = await adminApi(token).get("/sahyog/eligible-members");
          setMembers(response.data.members);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load Sahyog form");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [editing, id, token]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setPayment = (key, value) => setForm((current) => ({ ...current, paymentDetails: { ...current.paymentDetails, [key]: value } }));

  const submit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        memberId: typeof form.memberId === "object" ? form.memberId._id : form.memberId,
        dateOfDeath: form.dateOfDeath,
        contactName: form.contactName,
        contactMobile: form.contactMobile,
        address: form.address,
        familyInfo: form.familyInfo || "",
        description: form.description || "",
        minimumDonationAmount: form.minimumDonationAmount === "" ? "" : Number(form.minimumDonationAmount),
        status: form.status || "active",
        paymentDetails: form.paymentDetails,
        publicPayment: form.publicPayment,
      };
      if (editing) await adminApi(token).patch(`/sahyog/${id}`, payload);
      else await adminApi(token).post("/sahyog", payload);
      toast.success(editing ? "Sahyog case updated" : "Sahyog case created");
      navigate(`${root}/sahyog`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save Sahyog case");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p className="py-12 text-center text-slate-500">Loading Sahyog form…</p>;

  return <form onSubmit={submit} className="space-y-5"><PageHeading title={editing ? "Update Sahyog" : "Create Sahyog"} subtitle="Only active members with completed KYC can be selected for a new case." />
    <section className="rounded-xl border bg-white p-5"><h3 className="mb-4 font-bold text-[#5a0615]">Member and family contact</h3><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium sm:col-span-2">Verified member<select disabled={editing} required value={form.memberId} onChange={(event) => set("memberId", event.target.value)} className="mt-1 w-full rounded-lg border p-3 disabled:bg-slate-100"><option value="">Select a verified member</option>{editing ? <option value={form.memberId}>{form.memberId?.fullName || "Selected member"}</option> : members.map((member) => <option key={member._id} value={member._id}>{member.fullName} · {member.memberId || member.mobile}</option>)}</select></label><label className="text-sm font-medium">Date of death<input required type="date" value={form.dateOfDeath} onChange={(event) => set("dateOfDeath", event.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label><label className="text-sm font-medium">Status<select value={form.status} onChange={(event) => set("status", event.target.value)} className="mt-1 w-full rounded-lg border p-3">{["draft", "pending", "active", "closed"].map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label className="text-sm font-medium">Contact person<input required value={form.contactName} onChange={(event) => set("contactName", event.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label><label className="text-sm font-medium">Contact mobile<input required inputMode="numeric" pattern="[6-9][0-9]{9}" value={form.contactMobile} onChange={(event) => set("contactMobile", event.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label><label className="text-sm font-medium sm:col-span-2">Family address<textarea required value={form.address} onChange={(event) => set("address", event.target.value)} className="mt-1 min-h-24 w-full rounded-lg border p-3" /></label></div></section>
    <section className="rounded-xl border bg-white p-5"><h3 className="mb-4 font-bold text-[#5a0615]">Donation and bank details</h3><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Minimum donation<input min="1" type="number" value={form.minimumDonationAmount} onChange={(event) => set("minimumDonationAmount", event.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label><label className="text-sm font-medium">Public UPI ID<input value={form.publicPayment.upiId} onChange={(event) => setForm((current) => ({ ...current, publicPayment: { upiId: event.target.value } }))} className="mt-1 w-full rounded-lg border p-3" /></label>{[["bankName", "Bank name"], ["accountHolderName", "Account holder name"], ["accountNumber", "Account number"], ["ifsc", "IFSC code"], ["branchName", "Branch name"], ["upiId", "Bank UPI ID"], ["paymentCode", "Payment code"]].map(([key, label]) => <label key={key} className="text-sm font-medium">{label}<input value={form.paymentDetails[key]} onChange={(event) => setPayment(key, event.target.value)} className="mt-1 w-full rounded-lg border p-3" /></label>)}</div></section>
    <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row"><button type="button" disabled={isSaving} onClick={() => navigate(`${root}/sahyog`)} className="rounded-lg border px-5 py-3 font-semibold disabled:opacity-60">Cancel</button><LoadingButton type="submit" loading={isSaving} className="rounded-lg bg-[#78081c] px-5 py-3 font-bold text-white">{editing ? "Save changes" : "Create Sahyog"}</LoadingButton></div>
  </form>;
}
