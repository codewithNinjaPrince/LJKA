import React, { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
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
            href="tel:+919194068237"
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
                +91 91940 68237
              </p>
            </div>
          </a>

          {/* EMAIL */}

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=lakhdatarsupport@gmail.com" target="_blank" rel="noopener noreferrer"
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
                lakhdatarsupport@gmail.com
              </p>
            </div>
          </a>

          {/* WHATSAPP CHANNEL */}
          <a
            href="https://whatsapp.com/channel/0029Vb9RkLj29757RHY52m39"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open LJKA WhatsApp Channel"
            className="group flex items-center gap-4 rounded-xl border border-[var(--ljka-border)] bg-[var(--ljka-card)] p-4 shadow-[var(--ljka-shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--ljka-primary)]/30 hover:shadow-[var(--ljka-shadow-md)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--ljka-primary-bg)] text-[var(--ljka-primary)] transition group-hover:bg-[var(--ljka-primary)] group-hover:text-white">
              <FaWhatsapp />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[var(--ljka-text)]">
                WhatsApp Channel
              </h3>
              <p className="mt-1 text-xs text-[var(--ljka-muted)]">
                Follow the official LJKA WhatsApp Channel.
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[var(--ljka-primary)]">
                Join LJKA Channel
              </p>
            </div>
          </a>
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
      <section className="border-t border-[var(--ljka-border-light)] bg-[var(--ljka-primary-bg)]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-3 px-5 py-6 sm:px-6 lg:px-8">
          <a
            href="https://www.instagram.com/ljk_association?stkn=MTNqZGwzYzlwcA%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open LJKA Instagram"
            className="rounded-lg border border-[var(--ljka-border)] bg-white px-4 py-2.5 text-xs font-bold text-[var(--ljka-primary)] transition hover:border-[var(--ljka-primary)] hover:bg-[var(--ljka-primary)] hover:text-white"
          >
            Instagram
          </a>

          <a
            href="https://www.facebook.com/share/1JXzuNSZmp/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open LJKA Facebook Page"
            className="rounded-lg border border-[var(--ljka-border)] bg-white px-4 py-2.5 text-xs font-bold text-[var(--ljka-primary)] transition hover:border-[var(--ljka-primary)] hover:bg-[var(--ljka-primary)] hover:text-white"
          >
            Facebook
          </a>
        </div>
      </section>

    </main>
  );
};

export default Contact;
