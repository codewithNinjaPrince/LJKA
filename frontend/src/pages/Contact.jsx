import React, { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPaperPlane,
  FaShieldAlt,
  FaSpinner,
} from "react-icons/fa";
import { toastError, toastSuccess } from "../utils/toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name) {
      toastError("Please enter your full name");
      return false;
    }

    if (name.length < 2) {
      toastError("Please enter a valid name");
      return false;
    }

    // At least one contact method is required
    if (!email && !phone) {
      toastError(
        "Please provide either a mobile number or email address"
      );
      return false;
    }

    // Validate phone only if provided
    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      toastError("Please enter a valid 10-digit mobile number");
      return false;
    }

    // Validate email only if provided
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      toastError("Please enter a valid email address");
      return false;
    }

    if (!subject) {
      toastError("Please enter the subject of your query");
      return false;
    }

    if (subject.length < 3) {
      toastError("Subject must contain at least 3 characters");
      return false;
    }

    if (!message) {
      toastError("Please write your message");
      return false;
    }

    if (message.length < 10) {
      toastError("Please provide more details in your message");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${backendUrl}/api/contact/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            subject: formData.subject.trim(),
            message: formData.message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to send your message. Please try again."
        );
      }

      toastSuccess(
        data.message || "Your message has been sent successfully!"
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form submission error:", error);

      toastError(
        error.message ||
        "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--ljka-bg)]">
      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="border-b border-[var(--ljka-border-light)] bg-[var(--ljka-primary-bg)]">
        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/25 bg-[var(--ljka-gold-light)]/45 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ljka-gold)]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ljka-primary)]">
                Get in Touch
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">
              We are here to help you.
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
              Have a question about LJKA, membership, Sahyog, or any other
              support? Send us your query and our team will assist you.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT OPTIONS
      ========================================================= */}

      <section className="mx-auto max-w-[1440px] px-5 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {/* PHONE */}

          <a
            href="tel:+910000000000"
            className="group flex items-center gap-4 rounded-xl border border-[var(--ljka-border)] bg-[var(--ljka-card)] p-4 shadow-[var(--ljka-shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--ljka-primary)]/30 hover:shadow-[var(--ljka-shadow-md)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)] transition group-hover:bg-[var(--ljka-primary)] group-hover:text-white">
              <FaPhoneAlt />
            </div>

            <div>
              <h3 className="text-base font-bold text-[var(--ljka-text)]">
                Call Us
              </h3>

              <p className="mt-1 text-xs text-[var(--ljka-muted)]">
                Speak with our support team.
              </p>

              <p className="mt-1.5 text-sm font-semibold text-[var(--ljka-primary)]">
                Contact Number
              </p>
            </div>
          </a>

          {/* EMAIL */}

          <a
            href="mailto:contact@ljka.org"
            className="group flex items-center gap-4 rounded-xl border border-[var(--ljka-border)] bg-[var(--ljka-card)] p-4 shadow-[var(--ljka-shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--ljka-primary)]/30 hover:shadow-[var(--ljka-shadow-md)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--ljka-gold-light)]/55 text-[var(--ljka-gold-dark)] transition group-hover:bg-[var(--ljka-gold)] group-hover:text-[var(--ljka-primary)]">
              <FaEnvelope />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-bold text-[var(--ljka-text)]">
                Email Us
              </h3>

              <p className="mt-1 text-xs text-[var(--ljka-muted)]">
                Send us your question or query.
              </p>

              <p className="mt-1.5 break-all text-sm font-semibold text-[var(--ljka-primary)]">
                contact@ljka.org
              </p>
            </div>
          </a>

          {/* OFFICE */}

          <div className="flex items-center gap-4 rounded-xl border border-[var(--ljka-border)] bg-[var(--ljka-card)] p-4 shadow-[var(--ljka-shadow-sm)]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
              <FaMapMarkerAlt />
            </div>

            <div>
              <h3 className="text-base font-bold text-[var(--ljka-text)]">
                Office Address
              </h3>

              <p className="mt-1 text-xs text-[var(--ljka-muted)]">
                LJKA office address will be updated here.
              </p>

              <p className="mt-1.5 text-sm font-semibold text-[var(--ljka-primary)]">
                Address Coming Soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT FORM
      ========================================================= */}

      <section className="mx-auto max-w-[1440px] px-5 pb-10 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-2xl border border-[var(--ljka-border)] bg-[var(--ljka-card)] shadow-[var(--ljka-shadow-md)] lg:grid-cols-[0.75fr_1.75fr]">
          {/* LEFT INFORMATION */}

          <div className="bg-[var(--ljka-primary-bg)] p-6 sm:p-7 lg:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--ljka-primary)] text-white">
              <FaShieldAlt />
            </div>

            <h2 className="mt-4 text-2xl font-bold text-[var(--ljka-primary)]">
              Send us a message
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--ljka-muted)]">
              Share your query with us. Our team will review your message and
              get back to you as soon as possible.
            </p>

            <div className="mt-6 border-t border-[var(--ljka-border)] pt-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--ljka-gold-light)] text-xs text-[var(--ljka-gold-dark)]">
                  <FaShieldAlt />
                </div>

                <div>
                  <p className="text-sm font-bold text-[var(--ljka-text)]">
                    Your message matters
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[var(--ljka-muted)]">
                    Please provide correct contact details so our team can
                    respond to your query.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs font-medium text-[var(--ljka-muted)]">
              Fields marked with{" "}
              <span className="font-bold text-red-500">*</span> are required.
            </p>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="p-6 sm:p-7 lg:p-8"
          >
            {/* NAME + PHONE + EMAIL */}

            <div className="grid gap-4 md:grid-cols-3">
              {/* NAME */}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-[var(--ljka-text)]">
                  Full Name{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  disabled={loading}
                  className="w-full rounded-lg border border-[var(--ljka-border)] bg-[var(--ljka-bg)] px-3.5 py-3 text-sm text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-[var(--ljka-text)]">
                  Mobile Number{" "}
                  <span className="text-[var(--ljka-muted)]">
                    (or email)
                  </span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  disabled={loading}
                  className="w-full rounded-lg border border-[var(--ljka-border)] bg-[var(--ljka-bg)] px-3.5 py-3 text-sm text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-1.5 block text-xs font-bold text-[var(--ljka-text)]">
                  Email Address{" "}
                  <span className="text-[var(--ljka-muted)]">
                    (or mobile)
                  </span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="w-full rounded-lg border border-[var(--ljka-border)] bg-[var(--ljka-bg)] px-3.5 py-3 text-sm text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* SUBJECT */}

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-bold text-[var(--ljka-text)]">
                Subject{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is your query about?"
                disabled={loading}
                className="w-full rounded-lg border border-[var(--ljka-border)] bg-[var(--ljka-bg)] px-3.5 py-3 text-sm text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* MESSAGE */}

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-bold text-[var(--ljka-text)]">
                Your Message{" "}
                <span className="text-red-500">*</span>
              </label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Write your message here..."
                disabled={loading}
                className="w-full resize-none rounded-lg border border-[var(--ljka-border)] bg-[var(--ljka-bg)] px-3.5 py-3 text-sm leading-6 text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* SUBMIT */}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[var(--ljka-muted)]">
                <span className="font-bold text-red-500">*</span>{" "}
                Required fields must be completed and please provide at least one contact method.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex min-w-[170px] items-center justify-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--ljka-primary-dark)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <FaPaperPlane className="text-xs transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;

// import React, { useState } from "react";
// import {
//   FaArrowRight,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaPhoneAlt,
//   FaPaperPlane,
//   FaShieldAlt,
// } from "react-icons/fa";

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     message: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     console.log("Contact Form:", formData);

//     // Connect your backend API here
//   };

//   return (
//     <main className="min-h-screen bg-[var(--ljka-bg)]">
//       {/* =========================================================
//           HERO
//           ========================================================= */}

//       <section className="border-b border-[var(--ljka-border-light)] bg-[var(--ljka-primary-bg)]">
//         <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
//           <div className="max-w-3xl">
//             <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/25 bg-[var(--ljka-gold-light)]/45 px-3 py-1.5">
//               <span className="h-1.5 w-1.5 rounded-full bg-[var(--ljka-gold)]" />

//               <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ljka-primary)]">
//                 Get in Touch
//               </span>
//             </div>

//             <h1 className="mt-5 text-3xl font-bold tracking-tight text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">
//               We are here to help you.
//             </h1>

//             <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
//               Have a question about LJKA, membership, Sahyog or any other
//               support? Contact us and our team will assist you.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* =========================================================
//           CONTACT OPTIONS
//           ========================================================= */}

//       <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
//         <div className="grid gap-4 md:grid-cols-3">
//           {/* PHONE */}

//           <a
//             href="tel:+910000000000"
//             className="group rounded-xl border border-[var(--ljka-border)] bg-[var(--ljka-card)] p-5 shadow-[var(--ljka-shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--ljka-primary)]/30 hover:shadow-[var(--ljka-shadow-md)]"
//           >
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)] transition group-hover:bg-[var(--ljka-primary)] group-hover:text-white">
//               <FaPhoneAlt />
//             </div>

//             <h3 className="mt-4 text-base font-bold text-[var(--ljka-text)]">
//               Call Us
//             </h3>

//             <p className="mt-1 text-sm text-[var(--ljka-muted)]">
//               Speak with our support team.
//             </p>

//             <p className="mt-3 text-sm font-semibold text-[var(--ljka-primary)]">
//               Contact Number
//             </p>
//           </a>

//           {/* EMAIL */}

//           <a
//             href="mailto:contact@ljka.org"
//             className="group rounded-xl border border-[var(--ljka-border)] bg-[var(--ljka-card)] p-5 shadow-[var(--ljka-shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--ljka-primary)]/30 hover:shadow-[var(--ljka-shadow-md)]"
//           >
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--ljka-gold-light)]/55 text-[var(--ljka-gold-dark)] transition group-hover:bg-[var(--ljka-gold)] group-hover:text-[var(--ljka-primary)]">
//               <FaEnvelope />
//             </div>

//             <h3 className="mt-4 text-base font-bold text-[var(--ljka-text)]">
//               Email Us
//             </h3>

//             <p className="mt-1 text-sm text-[var(--ljka-muted)]">
//               Send us your question or query.
//             </p>

//             <p className="mt-3 break-all text-sm font-semibold text-[var(--ljka-primary)]">
//               contact@ljka.org
//             </p>
//           </a>

//           {/* OFFICE */}

//           <div className="rounded-xl border border-[var(--ljka-border)] bg-[var(--ljka-card)] p-5 shadow-[var(--ljka-shadow-sm)]">
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
//               <FaMapMarkerAlt />
//             </div>

//             <h3 className="mt-4 text-base font-bold text-[var(--ljka-text)]">
//               Office Address
//             </h3>

//             <p className="mt-1 text-sm leading-6 text-[var(--ljka-muted)]">
//               LJKA Office address will be updated here.
//             </p>

//             <p className="mt-3 text-sm font-semibold text-[var(--ljka-primary)]">
//               Address Coming Soon
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* =========================================================
//           CONTACT FORM
//           ========================================================= */}

//       <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-6 lg:px-8">
//         <div className="grid overflow-hidden rounded-2xl border border-[var(--ljka-border)] bg-[var(--ljka-card)] shadow-[var(--ljka-shadow-md)] lg:grid-cols-[0.85fr_1.4fr]">
//           {/* LEFT INFORMATION */}

//           <div className="bg-[var(--ljka-primary-bg)] p-7 sm:p-9">
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--ljka-primary)] text-white">
//               <FaShieldAlt />
//             </div>

//             <h2 className="mt-5 text-2xl font-bold text-[var(--ljka-primary)]">
//               Send us a message
//             </h2>

//             <p className="mt-3 text-sm leading-7 text-[var(--ljka-muted)]">
//               Fill out the form and share your query with us. Our team will
//               review your message and get back to you.
//             </p>

//             <div className="mt-7 border-t border-[var(--ljka-border)] pt-5">
//               <div className="flex items-start gap-3">
//                 <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ljka-gold-light)] text-xs text-[var(--ljka-gold-dark)]">
//                   <FaShieldAlt />
//                 </div>

//                 <div>
//                   <p className="text-sm font-bold text-[var(--ljka-text)]">
//                     Your message matters
//                   </p>

//                   <p className="mt-1 text-xs leading-5 text-[var(--ljka-muted)]">
//                     Please provide correct contact information so our team can
//                     respond to your query.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* FORM */}

//           <form
//             onSubmit={handleSubmit}
//             className="p-6 sm:p-8 lg:p-9"
//           >
//             <div className="grid gap-4 sm:grid-cols-2">
//               {/* NAME */}

//               <div>
//                 <label className="mb-1.5 block text-xs font-bold text-[var(--ljka-text)]">
//                   Full Name
//                 </label>

//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Enter your name"
//                   required
//                   className="w-full rounded-lg border border-[var(--ljka-border)] bg-[var(--ljka-bg)] px-3.5 py-3 text-sm text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:bg-white"
//                 />
//               </div>

//               {/* PHONE */}

//               <div>
//                 <label className="mb-1.5 block text-xs font-bold text-[var(--ljka-text)]">
//                   Mobile Number
//                 </label>

//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="Enter mobile number"
//                   required
//                   className="w-full rounded-lg border border-[var(--ljka-border)] bg-[var(--ljka-bg)] px-3.5 py-3 text-sm text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:bg-white"
//                 />
//               </div>
//             </div>

//             {/* EMAIL */}

//             <div className="mt-4">
//               <label className="mb-1.5 block text-xs font-bold text-[var(--ljka-text)]">
//                 Email Address
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email address"
//                 className="w-full rounded-lg border border-[var(--ljka-border)] bg-[var(--ljka-bg)] px-3.5 py-3 text-sm text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:bg-white"
//               />
//             </div>

//             {/* SUBJECT */}

//             <div className="mt-4">
//               <label className="mb-1.5 block text-xs font-bold text-[var(--ljka-text)]">
//                 Subject
//               </label>

//               <input
//                 type="text"
//                 name="subject"
//                 value={formData.subject}
//                 onChange={handleChange}
//                 placeholder="What is your query about?"
//                 required
//                 className="w-full rounded-lg border border-[var(--ljka-border)] bg-[var(--ljka-bg)] px-3.5 py-3 text-sm text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:bg-white"
//               />
//             </div>

//             {/* MESSAGE */}

//             <div className="mt-4">
//               <label className="mb-1.5 block text-xs font-bold text-[var(--ljka-text)]">
//                 Your Message
//               </label>

//               <textarea
//                 name="message"
//                 value={formData.message}
//                 onChange={handleChange}
//                 rows="4"
//                 placeholder="Write your message here..."
//                 required
//                 className="w-full resize-none rounded-lg border border-[var(--ljka-border)] bg-[var(--ljka-bg)] px-3.5 py-3 text-sm text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:bg-white"
//               />
//             </div>

//             {/* SUBMIT */}

//             <button
//               type="submit"
//               className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--ljka-primary-dark)] hover:shadow-md sm:w-auto"
//             >
//               Send Message

//               <FaPaperPlane className="text-xs transition-transform group-hover:translate-x-0.5" />
//             </button>
//           </form>
//         </div>
//       </section>

//       {/* =========================================================
//           SUPPORT NOTE
//           ========================================================= */}

//       <section className="border-t border-[var(--ljka-border-light)] bg-white">
//         <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
//           <div>
//             <h3 className="text-base font-bold text-[var(--ljka-primary)]">
//               Need help with LJKA?
//             </h3>

//             <p className="mt-1 text-sm text-[var(--ljka-muted)]">
//               For membership and general support, you can contact our team.
//             </p>
//           </div>

//           <a
//             href="mailto:contact@ljka.org"
//             className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[var(--ljka-primary)] transition hover:text-[var(--ljka-gold-dark)]"
//           >
//             Get Support
//             <FaArrowRight className="text-xs" />
//           </a>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default Contact;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaArrowRight,
//   FaEnvelope,
//   FaPhoneAlt,
//   FaMapMarkerAlt,
//   FaWhatsapp,
//   FaPaperPlane,
//   FaUsers,
//   FaQuestionCircle,
//   FaRegClock,
//   FaShieldAlt,
// } from "react-icons/fa";

// const CONTACT_DETAILS = {
//   phone: "",
//   email: "",
//   whatsapp: "",
//   address: "",
// };

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     mobile: "",
//     email: "",
//     subject: "",
//     message: "",
//   });

//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Connect your backend API here later
//     console.log("Contact Form:", formData);

//     setSubmitted(true);

//     setFormData({
//       name: "",
//       mobile: "",
//       email: "",
//       subject: "",
//       message: "",
//     });
//   };

//   return (
//     <main className="min-h-screen bg-[var(--ljka-bg)]">

//       {/* =========================================================
//           PAGE HERO
//           ========================================================= */}

//       <section className="border-b border-[var(--ljka-border-light)] bg-[var(--ljka-primary-bg)]">
//         <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">

//           <div className="max-w-3xl">
//             <div className="mb-4 flex items-center gap-2">
//               <span className="h-1.5 w-8 rounded-full bg-[var(--ljka-gold)]" />

//               <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ljka-primary)]">
//                 We're here to help
//               </span>
//             </div>

//             <h1 className="text-3xl font-bold tracking-tight text-[var(--ljka-primary)] sm:text-4xl lg:text-5xl">
//               Contact LJKA
//             </h1>

//             <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ljka-muted)] sm:text-base">
//               Have a question, need assistance, or want to know more about
//               Lakhdaatar Jeevan Kalyan Association? Our team is here to help
//               you with the information and support you need.
//             </p>
//           </div>

//         </div>
//       </section>


//       {/* =========================================================
//           CONTACT INFORMATION
//           ========================================================= */}

//       <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">

//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-[var(--ljka-text)]">
//             Get in touch
//           </h2>

//           <p className="mt-2 text-sm text-[var(--ljka-muted)]">
//             Choose the most convenient way to connect with the LJKA team.
//           </p>
//         </div>

//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

//           {/* PHONE */}

//           <div className="rounded-xl border border-[var(--ljka-border-light)] bg-[var(--ljka-card)] p-5 shadow-[var(--ljka-shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--ljka-shadow-md)]">
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
//               <FaPhoneAlt />
//             </div>

//             <h3 className="mt-4 text-sm font-bold text-[var(--ljka-text)]">
//               Call Us
//             </h3>

//             <p className="mt-1.5 text-xs leading-5 text-[var(--ljka-muted)]">
//               For general information and assistance.
//             </p>

//             {CONTACT_DETAILS.phone ? (
//               <a
//                 href={`tel:${CONTACT_DETAILS.phone}`}
//                 className="mt-4 inline-block text-sm font-semibold text-[var(--ljka-primary)] hover:text-[var(--ljka-gold-dark)]"
//               >
//                 {CONTACT_DETAILS.phone}
//               </a>
//             ) : (
//               <span className="mt-4 inline-block text-sm font-semibold text-[var(--ljka-primary-light)]">
//                 Contact number coming soon
//               </span>
//             )}
//           </div>


//           {/* EMAIL */}

//           <div className="rounded-xl border border-[var(--ljka-border-light)] bg-[var(--ljka-card)] p-5 shadow-[var(--ljka-shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--ljka-shadow-md)]">
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
//               <FaEnvelope />
//             </div>

//             <h3 className="mt-4 text-sm font-bold text-[var(--ljka-text)]">
//               Email Us
//             </h3>

//             <p className="mt-1.5 text-xs leading-5 text-[var(--ljka-muted)]">
//               Send us your questions and suggestions.
//             </p>

//             {CONTACT_DETAILS.email ? (
//               <a
//                 href={`mailto:${CONTACT_DETAILS.email}`}
//                 className="mt-4 inline-block break-all text-sm font-semibold text-[var(--ljka-primary)] hover:text-[var(--ljka-gold-dark)]"
//               >
//                 {CONTACT_DETAILS.email}
//               </a>
//             ) : (
//               <span className="mt-4 inline-block text-sm font-semibold text-[var(--ljka-primary-light)]">
//                 Email details coming soon
//               </span>
//             )}
//           </div>


//           {/* WHATSAPP */}

//           <div className="rounded-xl border border-[var(--ljka-border-light)] bg-[var(--ljka-card)] p-5 shadow-[var(--ljka-shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--ljka-shadow-md)]">
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--ljka-gold-light)] text-[var(--ljka-primary)]">
//               <FaWhatsapp />
//             </div>

//             <h3 className="mt-4 text-sm font-bold text-[var(--ljka-text)]">
//               WhatsApp
//             </h3>

//             <p className="mt-1.5 text-xs leading-5 text-[var(--ljka-muted)]">
//               Connect with us through WhatsApp support.
//             </p>

//             {CONTACT_DETAILS.whatsapp ? (
//               <a
//                 href={`https://wa.me/${CONTACT_DETAILS.whatsapp.replace(
//                   /\D/g,
//                   ""
//                 )}`}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="mt-4 inline-block text-sm font-semibold text-[var(--ljka-primary)] hover:text-[var(--ljka-gold-dark)]"
//               >
//                 Chat on WhatsApp
//               </a>
//             ) : (
//               <span className="mt-4 inline-block text-sm font-semibold text-[var(--ljka-primary-light)]">
//                 WhatsApp support coming soon
//               </span>
//             )}
//           </div>


//           {/* OFFICE */}

//           <div className="rounded-xl border border-[var(--ljka-border-light)] bg-[var(--ljka-card)] p-5 shadow-[var(--ljka-shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--ljka-shadow-md)]">
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
//               <FaMapMarkerAlt />
//             </div>

//             <h3 className="mt-4 text-sm font-bold text-[var(--ljka-text)]">
//               Office Address
//             </h3>

//             <p className="mt-1.5 text-xs leading-5 text-[var(--ljka-muted)]">
//               Official address of Lakhdaatar Jeevan Kalyan Association.
//             </p>

//             {CONTACT_DETAILS.address ? (
//               <p className="mt-4 text-sm font-semibold leading-6 text-[var(--ljka-primary)]">
//                 {CONTACT_DETAILS.address}
//               </p>
//             ) : (
//               <span className="mt-4 inline-block text-sm font-semibold text-[var(--ljka-primary-light)]">
//                 Office details coming soon
//               </span>
//             )}
//           </div>

//         </div>

//       </section>


//       {/* =========================================================
//           MAIN CONTACT SECTION
//           ========================================================= */}

//       <section className="border-y border-[var(--ljka-border-light)] bg-[var(--ljka-card)]">

//         <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-16">

//           {/* LEFT SIDE */}

//           <div>

//             <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ljka-gold)]/30 bg-[var(--ljka-gold-light)]/50 px-3 py-1.5">
//               <FaQuestionCircle className="text-xs text-[var(--ljka-primary)]" />

//               <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ljka-primary)]">
//                 Need Assistance?
//               </span>
//             </div>

//             <h2 className="mt-5 text-3xl font-bold tracking-tight text-[var(--ljka-primary)] sm:text-4xl">
//               Send us a message
//             </h2>

//             <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--ljka-muted)]">
//               Fill out the form and share your question, suggestion or concern.
//               Our team will review your message and respond through the
//               appropriate channel.
//             </p>


//             {/* SUPPORT POINTS */}

//             <div className="mt-8 space-y-4">

//               <div className="flex gap-4">
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
//                   <FaUsers />
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-bold text-[var(--ljka-text)]">
//                     Membership Support
//                   </h3>

//                   <p className="mt-1 text-xs leading-5 text-[var(--ljka-muted)]">
//                     Questions related to registration, membership and member
//                     information.
//                   </p>
//                 </div>
//               </div>


//               <div className="flex gap-4">
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
//                   <FaShieldAlt />
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-bold text-[var(--ljka-text)]">
//                     General Information
//                   </h3>

//                   <p className="mt-1 text-xs leading-5 text-[var(--ljka-muted)]">
//                     Get information about LJKA, its purpose, policies and
//                     community support system.
//                   </p>
//                 </div>
//               </div>


//               <div className="flex gap-4">
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)]">
//                   <FaRegClock />
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-bold text-[var(--ljka-text)]">
//                     Response & Support
//                   </h3>

//                   <p className="mt-1 text-xs leading-5 text-[var(--ljka-muted)]">
//                     We aim to review messages as soon as possible and provide
//                     relevant guidance.
//                   </p>
//                 </div>
//               </div>

//             </div>


//             {/* QUICK LINKS */}

//             <div className="mt-9 rounded-xl border border-[var(--ljka-border)] bg-[var(--ljka-primary-bg)] p-5">

//               <p className="text-xs font-bold text-[var(--ljka-primary)]">
//                 Looking for something specific?
//               </p>

//               <div className="mt-4 flex flex-wrap gap-2">

//                 <Link
//                   to="/about"
//                   className="inline-flex items-center gap-2 rounded-lg border border-[var(--ljka-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--ljka-primary)] transition hover:border-[var(--ljka-primary)]"
//                 >
//                   About LJKA
//                   <FaArrowRight className="text-[10px]" />
//                 </Link>

//                 <Link
//                   to="/niyamawali"
//                   className="inline-flex items-center gap-2 rounded-lg border border-[var(--ljka-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--ljka-primary)] transition hover:border-[var(--ljka-primary)]"
//                 >
//                   Niyamawali
//                   <FaArrowRight className="text-[10px]" />
//                 </Link>

//               </div>

//             </div>

//           </div>


//           {/* CONTACT FORM */}

//           <div className="rounded-2xl border border-[var(--ljka-border-light)] bg-[var(--ljka-bg)] p-5 shadow-[var(--ljka-shadow-sm)] sm:p-7 lg:p-8">

//             {submitted ? (

//               <div className="flex min-h-[420px] flex-col items-center justify-center text-center">

//                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ljka-gold-light)] text-2xl text-[var(--ljka-primary)]">
//                   <FaPaperPlane />
//                 </div>

//                 <h3 className="mt-5 text-2xl font-bold text-[var(--ljka-primary)]">
//                   Message Sent
//                 </h3>

//                 <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--ljka-muted)]">
//                   Thank you for contacting LJKA. Your message has been
//                   submitted successfully.
//                 </p>

//                 <button
//                   type="button"
//                   onClick={() => setSubmitted(false)}
//                   className="mt-6 rounded-lg border border-[var(--ljka-primary)]/25 bg-white px-5 py-3 text-sm font-semibold text-[var(--ljka-primary)] transition hover:bg-[var(--ljka-primary-bg)]"
//                 >
//                   Send Another Message
//                 </button>

//               </div>

//             ) : (

//               <form onSubmit={handleSubmit}>

//                 <div className="mb-6">
//                   <h2 className="text-xl font-bold text-[var(--ljka-text)]">
//                     Write to us
//                   </h2>

//                   <p className="mt-1.5 text-xs leading-5 text-[var(--ljka-muted)]">
//                     Fields marked with * are required.
//                   </p>
//                 </div>


//                 <div className="grid gap-5 sm:grid-cols-2">

//                   {/* NAME */}

//                   <div>
//                     <label
//                       htmlFor="name"
//                       className="mb-2 block text-xs font-bold text-[var(--ljka-text)]"
//                     >
//                       Full Name *
//                     </label>

//                     <input
//                       id="name"
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       required
//                       placeholder="Enter your full name"
//                       className="w-full rounded-lg border border-[var(--ljka-border)] bg-white px-3.5 py-3 text-sm text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:ring-2 focus:ring-[var(--ljka-primary)]/10"
//                     />
//                   </div>


//                   {/* MOBILE */}

//                   <div>
//                     <label
//                       htmlFor="mobile"
//                       className="mb-2 block text-xs font-bold text-[var(--ljka-text)]"
//                     >
//                       Mobile Number *
//                     </label>

//                     <input
//                       id="mobile"
//                       type="tel"
//                       name="mobile"
//                       value={formData.mobile}
//                       onChange={handleChange}
//                       required
//                       placeholder="Enter mobile number"
//                       className="w-full rounded-lg border border-[var(--ljka-border)] bg-white px-3.5 py-3 text-sm text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:ring-2 focus:ring-[var(--ljka-primary)]/10"
//                     />
//                   </div>

//                 </div>


//                 {/* EMAIL */}

//                 <div className="mt-5">
//                   <label
//                     htmlFor="email"
//                     className="mb-2 block text-xs font-bold text-[var(--ljka-text)]"
//                   >
//                     Email Address
//                   </label>

//                   <input
//                     id="email"
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="Enter your email address"
//                     className="w-full rounded-lg border border-[var(--ljka-border)] bg-white px-3.5 py-3 text-sm text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:ring-2 focus:ring-[var(--ljka-primary)]/10"
//                   />
//                 </div>


//                 {/* SUBJECT */}

//                 <div className="mt-5">
//                   <label
//                     htmlFor="subject"
//                     className="mb-2 block text-xs font-bold text-[var(--ljka-text)]"
//                   >
//                     Subject *
//                   </label>

//                   <input
//                     id="subject"
//                     type="text"
//                     name="subject"
//                     value={formData.subject}
//                     onChange={handleChange}
//                     required
//                     placeholder="What would you like to discuss?"
//                     className="w-full rounded-lg border border-[var(--ljka-border)] bg-white px-3.5 py-3 text-sm text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:ring-2 focus:ring-[var(--ljka-primary)]/10"
//                   />
//                 </div>


//                 {/* MESSAGE */}

//                 <div className="mt-5">
//                   <label
//                     htmlFor="message"
//                     className="mb-2 block text-xs font-bold text-[var(--ljka-text)]"
//                   >
//                     Your Message *
//                   </label>

//                   <textarea
//                     id="message"
//                     name="message"
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                     rows="6"
//                     placeholder="Write your message here..."
//                     className="w-full resize-none rounded-lg border border-[var(--ljka-border)] bg-white px-3.5 py-3 text-sm leading-6 text-[var(--ljka-text)] outline-none transition placeholder:text-[var(--ljka-text-light)] focus:border-[var(--ljka-primary)] focus:ring-2 focus:ring-[var(--ljka-primary)]/10"
//                   />
//                 </div>


//                 {/* SUBMIT */}

//                 <button
//                   type="submit"
//                   className="group mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--ljka-primary)] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--ljka-primary-dark)] hover:shadow-[var(--ljka-shadow-md)]"
//                 >
//                   Send Message

//                   <FaPaperPlane className="text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
//                 </button>

//                 <p className="mt-4 text-center text-[11px] leading-5 text-[var(--ljka-text-light)]">
//                   Please provide accurate information so that we can understand
//                   and respond to your query appropriately.
//                 </p>

//               </form>

//             )}

//           </div>

//         </div>

//       </section>

//     </main>
//   );
// };

// export default Contact;