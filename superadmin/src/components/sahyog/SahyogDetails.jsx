import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { adminApi } from "../../services/adminApi.js";
import { PageHeading, StatusBadge } from "./SahyogUi.jsx";

const canUpdate = (admin) => admin.role === "superadmin" || admin.permissions?.some((item) => item.module === "sahyog" && item.actions.includes("update"));

export default function SahyogDetails({ token, admin, root }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    adminApi(token).get(`/sahyog/${id}`).then((response) => setItem(response.data.sahyog)).catch((error) => toast.error(error.response?.data?.message || "Could not load Sahyog case"));
  }, [id, token]);

  if (!item) return <p className="py-12 text-center text-slate-500">Loading Sahyog case…</p>;

  const canViewDonations = admin.role === "superadmin" || admin.permissions?.some((item) => item.module === "sahyog-donations" && item.actions.includes("view"));

  return <><PageHeading title="Sahyog case" subtitle={item.sahyogId} action={<div className="flex flex-wrap gap-3"><button onClick={() => navigate(`${root}/sahyog`)} className="rounded-lg border px-4 py-2 text-sm font-semibold">Back to cases</button>{canViewDonations && <button onClick={() => navigate("donations")} className="rounded-lg border px-4 py-2 text-sm font-semibold">Donations</button>}{canUpdate(admin) && <button onClick={() => navigate("edit")} className="rounded-lg bg-[#78081c] px-4 py-2 text-sm font-semibold text-white">Edit</button>}</div>} /><div className="grid gap-4 md:grid-cols-2"><section className="rounded-xl border bg-white p-5"><div className="flex justify-between gap-3"><h3 className="font-bold text-[#5a0615]">Member</h3><StatusBadge value={item.status} /></div><p className="mt-4 font-semibold">{item.memberId?.fullName}</p><p className="text-sm text-slate-500">{item.memberId?.memberId || "—"}</p><p className="mt-3 text-sm">Date of death: {new Date(item.dateOfDeath).toLocaleDateString("en-IN")}</p></section><section className="rounded-xl border bg-white p-5"><h3 className="font-bold text-[#5a0615]">Family contact</h3><p className="mt-4">{item.contactName || "—"}</p><p className="text-sm text-slate-500">{item.contactMobile || "—"}</p><p className="mt-3 whitespace-pre-wrap text-sm">{item.address || "—"}</p></section><section className="rounded-xl border bg-white p-5"><h3 className="font-bold text-[#5a0615]">Donation</h3><p className="mt-4 text-sm">Minimum donation: {item.minimumDonationAmount ? `₹${item.minimumDonationAmount}` : "Not set"}</p><p className="mt-2 text-sm">Verified donations: ₹{item.donationSummary.amount} from {item.donationSummary.count} contribution(s)</p><p className="mt-2 text-sm">Public UPI: {item.publicPayment?.upiId || "—"}</p></section><section className="rounded-xl border bg-white p-5"><h3 className="font-bold text-[#5a0615]">Bank details</h3><p className="mt-4 text-sm">{item.paymentDetails?.accountHolderName || "—"} · {item.paymentDetails?.bankName || "—"}</p><p className="mt-2 text-sm">Account: {item.paymentDetails?.accountNumber || "—"}</p><p className="mt-2 text-sm">IFSC: {item.paymentDetails?.ifsc || "—"}</p><p className="mt-2 text-sm">Branch: {item.paymentDetails?.branchName || "—"}</p></section></div></>;
}
