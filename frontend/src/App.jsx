import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import AssessmentPage from "./pages/AssessmentPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
        </Routes>
      </main>
      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        AI Career &amp; Skill Recommendation System - internship project demo
      </footer>
    </div>
  );
}
