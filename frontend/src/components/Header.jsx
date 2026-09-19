import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
            AI
          </span>
          <span className="font-semibold text-gray-900">
            Career &amp; Skill Recommender
          </span>
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link to="/" className="text-gray-600 hover:text-brand-700">
            Home
          </Link>
          <Link
            to="/assessment"
            className="text-brand-700 font-medium hover:text-brand-800"
          >
            Start Assessment
          </Link>
        </nav>
      </div>
    </header>
  );
}
