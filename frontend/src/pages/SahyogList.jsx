import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHandHoldingHeart, FaHeart, FaUsers } from "react-icons/fa";

const SahyogList = () => {
  const navigate = useNavigate();
  const cards = [{ title: "Recent Donations / Sahyog", copy: "See LJKA members who recently contributed toward verified Sahyog cases.", to: "/sahyog-list/donations", icon: FaHandHoldingHeart }, { title: "Late Members / Sahyog Cases", copy: "View active Sahyog cases for deceased members and their support information.", to: "/sahyog-list/late-members", icon: FaHeart }];
  return <main className="min-h-screen bg-[var(--ljka-bg)]"><section className="mx-auto max-w-[1040px] px-5 py-12 sm:px-8 sm:py-16"><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--ljka-gold-dark)]">LJKA community support</p><h1 className="mt-3 text-3xl font-bold text-[var(--ljka-primary)] sm:text-4xl">Sahyog</h1><p className="mt-3 max-w-2xl leading-7 text-[var(--ljka-muted)]">Explore verified community support records. Private banking, KYC and contact information are never shown here.</p><div className="mt-8 grid gap-5 md:grid-cols-2">{cards.map(({ title, copy, to, icon: Icon }) => <button key={to} onClick={() => navigate(to)} className="group rounded-3xl border border-[var(--ljka-border-light)] bg-white p-7 text-left shadow-[var(--ljka-shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--ljka-shadow-md)]"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--ljka-primary-bg)] text-2xl text-[var(--ljka-primary)]"><Icon /></span><h2 className="mt-6 text-xl font-bold text-[var(--ljka-primary)]">{title}</h2><p className="mt-3 text-sm leading-6 text-[var(--ljka-muted)]">{copy}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--ljka-primary)]">Open <FaUsers className="text-[var(--ljka-gold-dark)]" /></span></button>)}</div></section></main>;
};
export default SahyogList;
