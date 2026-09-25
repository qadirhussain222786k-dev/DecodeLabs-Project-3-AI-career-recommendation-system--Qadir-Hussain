import React from "react";
import { Link } from "react-router-dom";

const PRODUCT_LINKS = [
  { to: "/assessment", label: "Start Assessment" },
  { to: "/how-it-works", label: "How It Works" },
];

const COMPANY_LINKS = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/privacy", label: "Privacy Policy" },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-navy-300">{title}</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm text-navy-200 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-brand-400 to-brand-600 text-white font-display text-xs font-semibold">
              AI
            </span>
            <span className="font-display font-semibold text-white text-sm">
              Career Recommender
            </span>
          </div>
          <p className="mt-3 text-sm text-navy-300 max-w-xs">
            AI-assisted career guidance built on a trained machine-learning model
            and a transparent skill-gap analysis.
          </p>
        </div>

        <FooterColumn title="Product" links={PRODUCT_LINKS} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />
        <FooterColumn title="Legal" links={LEGAL_LINKS} />
      </div>
      <div className="border-t border-white/5 py-6">
        <p className="text-center text-xs text-navy-400">
          AI Career &amp; Skill Recommendation System - internship project demo
        </p>
      </div>
    </footer>
  );
}
