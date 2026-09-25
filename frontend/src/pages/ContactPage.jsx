import React, { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Static demo form - no backend endpoint for contact messages exists
    // in this project, so we simply acknowledge the submission locally.
    setSubmitted(true);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Questions, feedback, or bug reports about the assessment or its recommendations - we'd like to hear them."
      />

      <div className="max-w-xl mx-auto px-4 sm:px-6 pb-20">
        {submitted ? (
          <div className="rounded-2xl border border-brand-400/30 bg-brand-500/10 p-6 text-center">
            <h2 className="font-display font-semibold text-white">
              Message received
            </h2>
            <p className="mt-2 text-sm text-navy-200">
              Thanks for reaching out. This is a static demo form, so no message
              was actually sent anywhere - but this is exactly where a real
              contact endpoint would confirm receipt.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-navy-100">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="rounded-lg border border-white/10 bg-navy-800 px-3 py-2.5 text-sm text-white placeholder:text-navy-400 outline-none transition-colors focus:border-brand-400"
                placeholder="Your name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-navy-100">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="rounded-lg border border-white/10 bg-navy-800 px-3 py-2.5 text-sm text-white placeholder:text-navy-400 outline-none transition-colors focus:border-brand-400"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-medium text-navy-100">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                className="rounded-lg border border-white/10 bg-navy-800 px-3 py-2.5 text-sm text-white placeholder:text-navy-400 outline-none transition-colors focus:border-brand-400"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              className="self-start rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-400"
            >
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
