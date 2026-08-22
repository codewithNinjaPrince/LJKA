import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaUsers,
  FaHeart,
  FaHandHoldingHeart,
  FaArrowLeft,
} from "react-icons/fa";

const HeroCarousel = () => {
  const navigate = useNavigate();

  const slides = [
    {
      image: "/img/hero1.jpeg",
      badge: "Welcome to LJKA",
      title: "Together, We Create a Stronger Community",
      description:
        "Lakhdaatar Jeevan Kalyan Association brings people together through trust, humanity, support and collective responsibility.",
      primaryText: "Become a Member",
      primaryLink: "/register",
      secondaryText: "About LJKA",
      secondaryLink: "/about",
      icon: <FaUsers />,
    },
    {
      image: "/img/hero2.jpeg",
      badge: "Collective Support",
      title: "Helping Each Other When It Matters Most",
      description:
        "Every member becomes part of a community built on compassion, cooperation and meaningful support.",
      primaryText: "Explore Sahyog",
      primaryLink: "/sahyog-list",
      secondaryText: "View Members",
      secondaryLink: "/user-list",
      icon: <FaHandHoldingHeart />,
    },
    {
      image: "/img/hero3.jpeg",
      badge: "Trust • Humanity • Unity",
      title: "A Community Built With Care and Commitment",
      description:
        "LJKA believes that when people stand together, every contribution can create a meaningful difference.",
      primaryText: "Our Niyamawali",
      primaryLink: "/niyamawali",
      secondaryText: "Contact Us",
      secondaryLink: "/contact",
      icon: <FaHeart />,
    },
    {
      image: "/img/hero4.jpeg",
      badge: "Join the Journey",
      title: "Be a Part of Something Meaningful",
      description:
        "Join LJKA and become a part of a growing community working together for welfare, support and humanity.",
      primaryText: "Join LJKA Today",
      primaryLink: "/register",
      secondaryText: "Know More",
      secondaryLink: "/about",
      icon: <FaUsers />,
    },
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[var(--ljka-card)]">

      {/* HERO */}
      <div className="relative h-[calc(100vh-120px)] min-h-[520px] max-h-[780px] w-full sm:min-h-[580px]">

        {slides.map((slide, index) => {
          const isActive = current === index;

          return (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive
                  ? "z-10 translate-x-0 opacity-100"
                  : "pointer-events-none z-0 translate-x-8 opacity-0"
              }`}
            >

              {/* IMAGE */}
              <img
                src={slide.image}
                alt={slide.title}
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[7000ms] ease-linear ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />

              {/* SOFT NEUTRAL TEXT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

              {/* SOFT BOTTOM OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              {/* LIGHT CONTENT AREA */}
              <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-white/10 via-transparent to-transparent" />

              {/* CONTENT */}
              <div className="relative z-20 mx-auto flex h-full max-w-[1440px] items-center px-5 sm:px-8 xl:px-12">

                <div className="max-w-2xl pt-5">

                  {/* BADGE */}
                  <div
                    className={`mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-2 backdrop-blur-md transition-all duration-700 ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-6 opacity-0"
                    }`}
                  >
                    <span className="text-[var(--ljka-gold)]">
                      {slide.icon}
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white sm:text-[11px]">
                      {slide.badge}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h1
                    className={`max-w-xl text-4xl font-bold leading-[1.12] tracking-tight text-white transition-all delay-100 duration-700 sm:text-5xl lg:text-6xl ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    {slide.title}
                  </h1>

                  {/* GOLD ACCENT LINE */}
                  <div
                    className={`mt-5 h-1 rounded-full bg-[var(--ljka-gold)] transition-all delay-200 duration-700 ${
                      isActive ? "w-20 opacity-100" : "w-0 opacity-0"
                    }`}
                  />

                  {/* DESCRIPTION */}
                  <p
                    className={`mt-5 max-w-xl text-sm leading-7 text-white/85 transition-all delay-300 duration-700 sm:text-base sm:leading-8 ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-7 opacity-0"
                    }`}
                  >
                    {slide.description}
                  </p>

                  {/* ACTION BUTTONS */}
                  <div
                    className={`mt-7 flex flex-col gap-3 transition-all delay-[450ms] duration-700 sm:flex-row ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-7 opacity-0"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => navigate(slide.primaryLink)}
                      className="group flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[var(--ljka-primary)] shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--ljka-gold-light)]"
                    >
                      {slide.primaryText}

                      <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(slide.secondaryLink)}
                      className="flex items-center justify-center rounded-lg border border-white/50 bg-black/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-[var(--ljka-gold)] hover:bg-white/15"
                    >
                      {slide.secondaryText}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        })}

        {/* LEFT ARROW */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-md transition hover:border-[var(--ljka-gold)] hover:bg-white/20 sm:flex"
        >
          <FaArrowLeft />
        </button>

        {/* RIGHT ARROW */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-md transition hover:border-[var(--ljka-gold)] hover:bg-white/20 sm:flex"
        >
          <FaArrowRight />
        </button>

        {/* BOTTOM CONTROLS */}
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-8 bg-[var(--ljka-gold)]"
                  : "w-2.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>

        {/* SLIDE COUNTER */}
        <div className="absolute bottom-6 right-5 z-30 hidden items-center gap-2 text-xs font-semibold text-white/75 sm:flex">
          <span className="text-[var(--ljka-gold)]">
            0{current + 1}
          </span>

          <span className="h-px w-6 bg-white/30" />

          <span>0{slides.length}</span>
        </div>

      </div>
    </section>
  );
};

export default HeroCarousel;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaArrowRight,
//   FaUsers,
//   FaHeart,
//   FaHandHoldingHeart,
//   FaArrowLeft,
// } from "react-icons/fa";

// const HeroCarousel = () => {
//   const navigate = useNavigate();

//   const slides = [
//     {
//       image: "/img/hero1.jpeg",
//       badge: "Welcome to LJKA",
//       title: "Together, We Create a Stronger Community",
//       description:
//         "Lakhdaatar Jeevan Kalyan Association brings people together through trust, humanity, support and collective responsibility.",
//       primaryText: "Become a Member",
//       primaryLink: "/register",
//       secondaryText: "About LJKA",
//       secondaryLink: "/about",
//       icon: <FaUsers />,
//     },
//     {
//       image: "/img/hero2.jpeg",
//       badge: "Collective Support",
//       title: "Helping Each Other When It Matters Most",
//       description:
//         "Every member becomes part of a community built on compassion, cooperation and meaningful support.",
//       primaryText: "Explore Sahyog",
//       primaryLink: "/sahyog-list",
//       secondaryText: "View Members",
//       secondaryLink: "/user-list",
//       icon: <FaHandHoldingHeart />,
//     },
//     {
//       image: "/img/hero3.jpeg",
//       badge: "Trust • Humanity • Unity",
//       title: "A Community Built With Care and Commitment",
//       description:
//         "LJKA believes that when people stand together, every contribution can create a meaningful difference.",
//       primaryText: "Our Niyamawali",
//       primaryLink: "/niyamawali",
//       secondaryText: "Contact Us",
//       secondaryLink: "/contact",
//       icon: <FaHeart />,
//     },
//     {
//       image: "/img/hero4.jpeg",
//       badge: "Join the Journey",
//       title: "Be a Part of Something Meaningful",
//       description:
//         "Join LJKA and become a part of a growing community working together for welfare, support and humanity.",
//       primaryText: "Join LJKA Today",
//       primaryLink: "/register",
//       secondaryText: "Know More",
//       secondaryLink: "/about",
//       icon: <FaUsers />,
//     },
//   ];

//   const [current, setCurrent] = useState(0);

//   const nextSlide = () => {
//     setCurrent((prev) => (prev + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   useEffect(() => {
//     const timer = setInterval(() => {
//       nextSlide();
//     }, 6500);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <section className="relative w-full overflow-hidden bg-[var(--ljka-primary)]">

//       {/* HERO */}
//       <div className="relative h-[calc(100vh-120px)] min-h-[520px] max-h-[780px] w-full sm:min-h-[580px]">

//         {slides.map((slide, index) => {
//           const isActive = current === index;

//           return (
//             <div
//               key={slide.image}
//               className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
//                 isActive
//                   ? "z-10 translate-x-0 opacity-100"
//                   : "pointer-events-none z-0 translate-x-8 opacity-0"
//               }`}
//             >

//               {/* IMAGE */}
//               <img
//                 src={slide.image}
//                 alt={slide.title}
//                 className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[7000ms] ease-linear ${
//                   isActive ? "scale-110" : "scale-100"
//                 }`}
//               />

//               {/* MAIN DARK OVERLAY */}
//               <div className="absolute inset-0 bg-gradient-to-r from-[var(--ljka-primary)]/95 via-[var(--ljka-primary)]/65 to-transparent" />

//               {/* BOTTOM OVERLAY */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

//               {/* GOLD GLOW */}
//               <div className="absolute left-0 top-0 h-full w-[55%] bg-gradient-to-br from-[var(--ljka-gold)]/10 via-transparent to-transparent" />

//               {/* CONTENT */}
//               <div className="relative z-20 mx-auto flex h-full max-w-[1440px] items-center px-5 sm:px-8 xl:px-12">

//                 <div className="max-w-2xl pt-5">

//                   {/* BADGE */}
//                   <div
//                     className={`mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/50 bg-white/10 px-3.5 py-2 backdrop-blur-md transition-all duration-700 ${
//                       isActive
//                         ? "translate-y-0 opacity-100"
//                         : "translate-y-6 opacity-0"
//                     }`}
//                   >
//                     <span className="text-[var(--ljka-gold)]">
//                       {slide.icon}
//                     </span>

//                     <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ljka-gold-light)] sm:text-[11px]">
//                       {slide.badge}
//                     </span>
//                   </div>

//                   {/* TITLE */}
//                   <h1
//                     className={`max-w-xl text-4xl font-bold leading-[1.12] tracking-tight text-white transition-all delay-100 duration-700 sm:text-5xl lg:text-6xl ${
//                       isActive
//                         ? "translate-y-0 opacity-100"
//                         : "translate-y-8 opacity-0"
//                     }`}
//                   >
//                     {slide.title}
//                   </h1>

//                   {/* GOLD LINE */}
//                   <div
//                     className={`mt-5 h-1 rounded-full bg-[var(--ljka-gold)] transition-all delay-200 duration-700 ${
//                       isActive ? "w-20 opacity-100" : "w-0 opacity-0"
//                     }`}
//                   />

//                   {/* DESCRIPTION */}
//                   <p
//                     className={`mt-5 max-w-xl text-sm leading-7 text-white/80 transition-all delay-300 duration-700 sm:text-base sm:leading-8 ${
//                       isActive
//                         ? "translate-y-0 opacity-100"
//                         : "translate-y-7 opacity-0"
//                     }`}
//                   >
//                     {slide.description}
//                   </p>

//                   {/* ACTION BUTTONS */}
//                   <div
//                     className={`mt-7 flex flex-col gap-3 transition-all delay-[450ms] duration-700 sm:flex-row ${
//                       isActive
//                         ? "translate-y-0 opacity-100"
//                         : "translate-y-7 opacity-0"
//                     }`}
//                   >
//                     <button
//                       type="button"
//                       onClick={() => navigate(slide.primaryLink)}
//                       className="group flex items-center justify-center gap-2 rounded-lg bg-[var(--ljka-gold)] px-5 py-3 text-sm font-bold text-[var(--ljka-primary)] shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--ljka-gold-light)]"
//                     >
//                       {slide.primaryText}

//                       <FaArrowRight className="transition-transform group-hover:translate-x-1" />
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => navigate(slide.secondaryLink)}
//                       className="flex items-center justify-center rounded-lg border border-white/40 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-[var(--ljka-gold)] hover:bg-white/10"
//                     >
//                       {slide.secondaryText}
//                     </button>
//                   </div>

//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {/* LEFT ARROW */}
//         <button
//           type="button"
//           onClick={prevSlide}
//           aria-label="Previous slide"
//           className="absolute left-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-sm transition hover:border-[var(--ljka-gold)] hover:bg-[var(--ljka-primary)] sm:flex"
//         >
//           <FaArrowLeft />
//         </button>

//         {/* RIGHT ARROW */}
//         <button
//           type="button"
//           onClick={nextSlide}
//           aria-label="Next slide"
//           className="absolute right-4 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-sm transition hover:border-[var(--ljka-gold)] hover:bg-[var(--ljka-primary)] sm:flex"
//         >
//           <FaArrowRight />
//         </button>

//         {/* BOTTOM CONTROLS */}
//         <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">

//           {slides.map((_, index) => (
//             <button
//               key={index}
//               type="button"
//               onClick={() => setCurrent(index)}
//               aria-label={`Go to slide ${index + 1}`}
//               className={`h-2.5 rounded-full transition-all duration-300 ${
//                 current === index
//                   ? "w-8 bg-[var(--ljka-gold)]"
//                   : "w-2.5 bg-white/60 hover:bg-white"
//               }`}
//             />
//           ))}

//         </div>

//         {/* SLIDE COUNTER */}
//         <div className="absolute bottom-6 right-5 z-30 hidden items-center gap-2 text-xs font-semibold text-white/75 sm:flex">
//           <span className="text-[var(--ljka-gold)]">
//             0{current + 1}
//           </span>

//           <span className="h-px w-6 bg-white/30" />

//           <span>0{slides.length}</span>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default HeroCarousel;