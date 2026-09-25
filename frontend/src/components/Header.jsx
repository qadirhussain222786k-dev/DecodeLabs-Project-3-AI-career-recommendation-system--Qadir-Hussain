import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const NAV_LINKS = [
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/contact", label: "Contact" },
];

function navLinkClasses({ isActive }) {
  return `text-sm transition-colors ${
    isActive ? "text-white" : "text-navy-100/70 hover:text-white"
  }`;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-navy-900/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white font-display font-semibold text-sm shadow-glow">
            AI
          </span>
          <span className="font-display font-semibold text-white tracking-tight">
            Career Recommender
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/assessment"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-400"
          >
            Start Assessment
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-navy-100"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Toggle menu</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-navy-900 px-4 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={navLinkClasses}
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/assessment"
            onClick={() => setMenuOpen(false)}
            className="mt-1 rounded-lg bg-brand-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-400"
          >
            Start Assessment
          </Link>
        </div>
      )}
    </header>
  );
}
