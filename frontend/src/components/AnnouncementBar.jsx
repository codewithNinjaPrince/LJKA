import React from "react";
import { FaBullhorn, FaStar } from "react-icons/fa";

const AnnouncementBar = () => {
  const messages = [
    <>For the first <span className="font-bold text-[var(--ljka-gold-light)]">11,000 Members</span>, Registration is <span className="font-extrabold text-[var(--ljka-gold-light)]">FREE</span></>,
    <>Help, Trust, Humanity — by <span className="font-bold text-white">Lakhdaatar Jeevan Kalyan Association</span></>,
    <>Join the LJKA community and become a part of <span className="font-bold text-[var(--ljka-gold-light)]">collective support</span></>,
  ];

  return (
<div className="relative w-full overflow-hidden border-b border-red-950/40 bg-[var(--ljka-danger)] text-white shadow-sm">
      <style>{`
        @keyframes ljka-announcement-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes ljka-notice-pulse {
          0%, 100% { opacity: .55; transform: scale(.92); }
          50% { opacity: 1; transform: scale(1); }
        }

        @keyframes ljka-gold-glow {
          0%, 100% { box-shadow: 0 0 0 rgba(244, 231, 189, 0); }
          50% { box-shadow: 0 0 16px rgba(244, 231, 189, .2); }
        }

        .ljka-announcement-track {
          animation: ljka-announcement-marquee 32s linear infinite;
          will-change: transform;
        }

        .ljka-announcement-wrap:hover .ljka-announcement-track {
          animation-play-state: paused;
        }

        .ljka-notice-dot {
          animation: ljka-notice-pulse 1.8s ease-in-out infinite;
        }

        .ljka-notice-badge {
          animation: ljka-gold-glow 3s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .ljka-announcement-track,
          .ljka-notice-dot,
          .ljka-notice-badge {
            animation: none;
          }
        }
      `}</style>

      <div className="flex h-9 items-center sm:h-10">

        {/* NOTICE BADGE */}
        <div className="relative z-20 flex h-full shrink-0 items-center border-r border-white/15 bg-red-950/25 px-3 sm:px-4">
          <div className="ljka-notice-badge flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/30 bg-white/5 px-2.5 py-1 backdrop-blur-sm sm:px-3">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="ljka-notice-dot absolute h-2 w-2 rounded-full bg-[var(--ljka-gold-light)]" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--ljka-gold-light)]" />
            </span>
            <FaBullhorn className="text-[10px] text-[var(--ljka-gold-light)] sm:text-xs" />
            <span className="hidden text-[9px] font-bold uppercase tracking-[0.14em] text-white sm:block">Notice</span>
          </div>
        </div>

        {/* MARQUEE */}
        <div className="ljka-announcement-wrap relative min-w-0 flex-1 overflow-hidden">

          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-[var(--ljka-danger)] to-transparent sm:w-16" />

          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-[var(--ljka-danger)] to-transparent sm:w-16" />

          <div className="ljka-announcement-track flex w-max items-center whitespace-nowrap py-2 text-[11px] font-medium text-white/95 sm:text-xs">

            {[...messages, ...messages].map((message, index) => (
              <React.Fragment key={index}>
                <span className="mx-7 inline-flex items-center gap-2 sm:mx-9">
                  {message}
                </span>

                <span className="inline-flex items-center text-[9px] text-[var(--ljka-gold)] sm:text-[10px]" aria-hidden="true">
                  <FaStar />
                </span>
              </React.Fragment>
            ))}

          </div>
        </div>

        {/* RIGHT ACCENT */}
        <div className="hidden h-full shrink-0 items-center border-l border-white/10 bg-red-950/15 px-4 sm:flex">
          <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--ljka-gold)]" />
            LJKA
          </span>
        </div>

      </div>
    </div>
  );
};

export default AnnouncementBar;


///////////////////////////////////////////////   Previous theme, golden , yellow one etc ///////////////////////////////////////////////////////////

// import React, { useState } from "react";
// import { FaBullhorn, FaTimes } from "react-icons/fa";

// const AnnouncementBar = () => {
//   const [dismissed, setDismissed] = useState(false);

//   const messages = [
//     <>For the first <span className="font-semibold text-[var(--ljka-gold)]">11,000 Members</span>, Registration is <span className="font-semibold text-[var(--ljka-gold)]">FREE</span></>,
//     <>Help, Trust, Humanity — by <span className="font-semibold text-[var(--ljka-gold)]">Lakhdaatar Jeevan Kalyan Association</span></>,
//   ];

//   if (dismissed) return null;

//   return (
//     <div className="relative w-full border-b border-[var(--ljka-gold)]/25 bg-[var(--ljka-primary)] text-white">
//       <style>{`
//         @keyframes ljka-marquee {
//           from { transform: translateX(0); }
//           to { transform: translateX(-50%); }
//         }
//         .ljka-marquee-track { animation: ljka-marquee 26s linear infinite; }
//         .ljka-marquee-wrap:hover .ljka-marquee-track { animation-play-state: paused; }
//         @media (prefers-reduced-motion: reduce) {
//           .ljka-marquee-track { animation: none; }
//         }
//       `}</style>

//       <div className="flex h-9 items-center sm:h-10">

//         {/* FIXED ICON AREA */}
//         <div className="z-10 flex h-full w-10 shrink-0 items-center justify-center border-r border-white/10 bg-[var(--ljka-primary)] sm:w-12">
//           <FaBullhorn className="text-xs text-[var(--ljka-gold)] sm:text-sm" />
//         </div>

//         {/* SCROLLING AREA */}
//         <div className="ljka-marquee-wrap relative min-w-0 flex-1 overflow-hidden">
//           <div className="ljka-marquee-track flex w-max items-center gap-10 whitespace-nowrap px-10 text-xs font-medium text-white/85 sm:text-sm">
//             {[...messages, ...messages].map((msg, i) => (
//               <React.Fragment key={i}>
//                 <span>{msg}</span>
//                 <span className="text-[var(--ljka-gold)]/50" aria-hidden="true">✦</span>
//               </React.Fragment>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AnnouncementBar;

//////////////////////////////////// RED Color theme according to client //////////////////////////////////////////////////////////////////////

// import React, { useState } from "react";
// import { FaBullhorn } from "react-icons/fa";

// const AnnouncementBar = () => {
//   const [dismissed, setDismissed] = useState(false);

//   const messages = [
//     <>
//       For the first{" "}
//       <span className="font-semibold text-[var(--ljka-gold-light)]">
//         11,000 Members
//       </span>
//       , Registration is{" "}
//       <span className="font-bold text-[var(--ljka-gold-light)]">
//         FREE
//       </span>
//     </>,

//     <>
//       Help, Trust, Humanity — by{" "}
//       <span className="font-semibold text-white">
//         Lakhdaatar Jeevan Kalyan Association
//       </span>
//     </>,
//   ];

//   if (dismissed) return null;

//   return (
//     <div
//       className="
//         relative
//         w-full
//         border-b
//         border-red-900/30
//         bg-[var(--ljka-danger)]
//         text-white
//       "
//     >
//       <style>{`
//         @keyframes ljka-marquee {
//           from {
//             transform: translateX(0);
//           }

//           to {
//             transform: translateX(-50%);
//           }
//         }

//         .ljka-marquee-track {
//           animation: ljka-marquee 26s linear infinite;
//         }

//         .ljka-marquee-wrap:hover .ljka-marquee-track {
//           animation-play-state: paused;
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .ljka-marquee-track {
//             animation: none;
//           }
//         }
//       `}</style>

//       <div className="flex h-9 items-center sm:h-10">

//         {/* =================================================
//             FIXED ICON AREA
//             ================================================= */}

//         <div
//           className="
//             z-10
//             flex
//             h-full
//             w-10
//             shrink-0
//             items-center
//             justify-center
//             border-r
//             border-white/15
//             bg-[var(--ljka-danger)]
//             sm:w-12
//           "
//         >
//           <FaBullhorn
//             className="
//               text-xs
//               text-[var(--ljka-gold-light)]
//               sm:text-sm
//             "
//           />
//         </div>


//         {/* =================================================
//             SCROLLING ANNOUNCEMENT AREA
//             ================================================= */}

//         <div
//           className="
//             ljka-marquee-wrap
//             relative
//             min-w-0
//             flex-1
//             overflow-hidden
//           "
//         >
//           <div
//             className="
//               ljka-marquee-track
//               flex
//               w-max
//               items-center
//               gap-10
//               whitespace-nowrap
//               px-10
//               text-xs
//               font-medium
//               text-white/95
//               sm:text-sm
//             "
//           >
//             {[...messages, ...messages].map((msg, i) => (
//               <React.Fragment key={i}>
//                 <span>{msg}</span>

//                 <span
//                   className="text-[var(--ljka-gold-light)]"
//                   aria-hidden="true"
//                 >
//                   ✦
//                 </span>
//               </React.Fragment>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AnnouncementBar;