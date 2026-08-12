import React, { useState } from "react";
import { FaBullhorn, FaTimes } from "react-icons/fa";

const AnnouncementBar = () => {
  const [dismissed, setDismissed] = useState(false);

  const messages = [
    <>For the first <span className="font-semibold text-[var(--ljka-gold)]">11,000 Members</span>, Registration is <span className="font-semibold text-[var(--ljka-gold)]">FREE</span></>,
    <>Help, Trust, Humanity — by <span className="font-semibold text-[var(--ljka-gold)]">Lakhdaatar Jeevan Kalyan Association</span></>,
  ];

  if (dismissed) return null;

  return (
    <div className="relative w-full border-b border-[var(--ljka-gold)]/25 bg-[var(--ljka-primary)] text-white">
      <style>{`
        @keyframes ljka-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ljka-marquee-track { animation: ljka-marquee 26s linear infinite; }
        .ljka-marquee-wrap:hover .ljka-marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .ljka-marquee-track { animation: none; }
        }
      `}</style>

      <div className="flex h-9 items-center sm:h-10">

        {/* FIXED ICON AREA */}
        <div className="z-10 flex h-full w-10 shrink-0 items-center justify-center border-r border-white/10 bg-[var(--ljka-primary)] sm:w-12">
          <FaBullhorn className="text-xs text-[var(--ljka-gold)] sm:text-sm" />
        </div>

        {/* SCROLLING AREA */}
        <div className="ljka-marquee-wrap relative min-w-0 flex-1 overflow-hidden">
          <div className="ljka-marquee-track flex w-max items-center gap-10 whitespace-nowrap px-10 text-xs font-medium text-white/85 sm:text-sm">
            {[...messages, ...messages].map((msg, i) => (
              <React.Fragment key={i}>
                <span>{msg}</span>
                <span className="text-[var(--ljka-gold)]/50" aria-hidden="true">✦</span>
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnnouncementBar;