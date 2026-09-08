import React, { useContext, useEffect, useState } from "react";
import {
  FaArrowRight,
  FaClock,
  FaHandsHelping,
  FaHeart,
  FaShieldAlt,
} from "react-icons/fa";
import { LJKAContext } from "../context/LJKAContext";

const SahyogList = () => {
  const { backendUrl } = useContext(LJKAContext);
  const [activeAlert, setActiveAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSahyogUpdate = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/sahyog-alert`, {
          signal: controller.signal,
        });

        if (response.ok) {
          const result = await response.json();
          setActiveAlert(result.alert || null);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("FETCH SAHYOG UPDATE ERROR:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSahyogUpdate();

    return () => controller.abort();
  }, [backendUrl]);

  return (
    <main className="min-h-screen bg-[var(--ljka-bg)]">
      

      <section className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16">
        {loading ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-[var(--ljka-border-light)] bg-white px-6 text-center shadow-[var(--ljka-shadow-sm)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--ljka-primary-bg)] text-2xl text-[var(--ljka-primary)]">
              <FaHandsHelping className="animate-pulse" />
            </div>
            <p className="mt-5 text-sm font-semibold text-[var(--ljka-primary)]">
              Checking for Sahyog updates...
            </p>
            <div className="mt-3 flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--ljka-gold)]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--ljka-gold)] [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--ljka-gold)] [animation-delay:240ms]" />
            </div>
          </div>
        ) : (
          <>
            {activeAlert && (
              <div className="mb-6 rounded-2xl border border-[var(--ljka-gold)]/35 bg-[var(--ljka-gold-light)]/45 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ljka-gold-dark)]">
                  Latest update
                </p>
                <h2 className="mt-2 text-xl font-bold text-[var(--ljka-primary)]">
                  {activeAlert.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--ljka-text)]">
                  {activeAlert.message}
                </p>
              </div>
            )}

            <div className="rounded-3xl border border-[var(--ljka-border-light)] bg-white px-6 py-12 text-center shadow-[var(--ljka-shadow-md)] sm:px-12 sm:py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--ljka-primary-bg)] text-2xl text-[var(--ljka-primary)]">
                <FaHeart />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ljka-gold-dark)]">
                Sahyog updates coming soon
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[var(--ljka-primary)] sm:text-3xl">
                Verified support records will appear here.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
                When an eligible Sahyog case is verified and published, you
                will be able to see who received support and the community
                members who helped.
              </p>

              <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
                <InfoPoint icon={<FaShieldAlt />} text="Verified cases" />
                <InfoPoint icon={<FaHandsHelping />} text="Member contributors" />
                <InfoPoint icon={<FaClock />} text="Updates as they happen" />
              </div>

              <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ljka-primary)]">
                Building a transparent support record
                <FaArrowRight className="text-xs text-[var(--ljka-gold-dark)]" />
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

const InfoPoint = ({ icon, text }) => (
  <div className="flex items-center gap-3 rounded-xl bg-[var(--ljka-bg)] px-4 py-3">
    <span className="text-[var(--ljka-primary)]">{icon}</span>
    <span className="text-xs font-semibold text-[var(--ljka-text)]">{text}</span>
  </div>
);

export default SahyogList;
