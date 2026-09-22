import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { LJKAContext } from "../context/LJKAContext";

const SahyogAlertList = () => {
  const navigate = useNavigate();
  const { sahyogAlerts } = useContext(LJKAContext);
  const alerts = (sahyogAlerts || []).filter((alert) => alert?.isActive !== false);

  if (!alerts.length) return null;

  return (
    <section className="relative z-20 border-b border-[var(--ljka-border)] bg-[var(--ljka-primary-bg)]">
      <div className="mx-auto grid max-w-[1450px] gap-3 px-4 py-5 sm:px-6 lg:px-8">
        {alerts.map((alert) => (
          <article
            key={alert._id}
            className="relative overflow-hidden rounded-[var(--ljka-radius-lg)] border border-[var(--ljka-border)] bg-white shadow-[var(--ljka-shadow-sm)]"
          >
            <div className="absolute left-0 top-0 h-full w-1.5 bg-[var(--ljka-gold)]" />
            <div className="flex flex-col gap-4 p-5 sm:p-6 md:flex-row md:items-center md:justify-between md:gap-6">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--ljka-primary)] text-white">
                  <FaBell className="text-lg" />
                </div>
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ljka-gold-dark)]">
                    {alert.title}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--ljka-text)] sm:text-base">
                    {alert.message}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/sahyog-list")}
                className="shrink-0 self-start rounded-full bg-[var(--ljka-primary)] px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[var(--ljka-primary-dark)] md:self-center"
              >
                View Sahyog
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SahyogAlertList;
