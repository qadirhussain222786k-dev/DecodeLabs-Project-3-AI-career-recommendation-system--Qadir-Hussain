import React, { useState } from "react";
import FormSection from "./FormSection.jsx";
import SkillLevelSelect from "./SkillLevelSelect.jsx";
import InterestSlider from "./InterestSlider.jsx";

const EDUCATION_OPTIONS = [
  "Intermediate/High School",
  "Bachelor",
  "Master",
  "PhD",
];

const FIELD_OPTIONS = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Data Science",
  "Electrical Engineering",
  "Business/Commerce",
  "Mathematics",
  "Other",
];

const WORK_TYPE_OPTIONS = ["Remote", "On-site", "Hybrid"];

const SKILL_FIELDS = [
  ["python_level", "Python"],
  ["javascript_level", "JavaScript"],
  ["java_level", "Java"],
  ["sql_level", "SQL"],
  ["react_level", "React"],
  ["nodejs_level", "Node.js"],
  ["machine_learning_level", "Machine Learning"],
  ["data_analysis_level", "Data Analysis"],
  ["cloud_level", "Cloud Computing"],
  ["cybersecurity_level", "Cybersecurity"],
  ["statistics_level", "Statistics"],
  ["communication_level", "Communication"],
  ["problem_solving_level", "Problem Solving"],
];

const INTEREST_FIELDS = [
  ["interest_ai", "Artificial Intelligence"],
  ["interest_web", "Web Development"],
  ["interest_data", "Data & Analytics"],
  ["interest_cloud", "Cloud Computing"],
  ["interest_security", "Cybersecurity"],
];

const DEFAULT_FORM = {
  education_level: "Bachelor",
  field_of_study: "Software Engineering",
  years_experience: 0,
  preferred_work_type: "Remote",
  ...Object.fromEntries(SKILL_FIELDS.map(([key]) => [key, 1])),
  ...Object.fromEntries(INTEREST_FIELDS.map(([key]) => [key, 1])),
};

export default function AssessmentForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(DEFAULT_FORM);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value === "" ? "" : Number(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      years_experience: Number(form.years_experience) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormSection
        title="Personal & Education"
        description="Tell us a bit about your academic background."
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-navy-100" htmlFor="education_level">
              Education level
            </label>
            <select
              id="education_level"
              name="education_level"
              value={form.education_level}
              onChange={handleTextChange}
              className="rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-brand-400"
            >
              {EDUCATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-navy-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-navy-100" htmlFor="field_of_study">
              Field of study
            </label>
            <select
              id="field_of_study"
              name="field_of_study"
              value={form.field_of_study}
              onChange={handleTextChange}
              className="rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-brand-400"
            >
              {FIELD_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-navy-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Experience"
        description="Total professional (or internship/project) experience, in years."
      >
        <div className="max-w-xs flex flex-col gap-1">
          <label className="text-sm font-medium text-navy-100" htmlFor="years_experience">
            Years of experience
          </label>
          <input
            id="years_experience"
            name="years_experience"
            type="number"
            min={0}
            max={50}
            step={0.5}
            value={form.years_experience}
            onChange={handleNumberChange}
            className="rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-brand-400"
          />
        </div>
      </FormSection>

      <FormSection
        title="Skills"
        description="Rate your current proficiency in each skill honestly - this drives the accuracy of your recommendations."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILL_FIELDS.map(([key, label]) => (
            <SkillLevelSelect
              key={key}
              name={key}
              label={label}
              value={form[key]}
              onChange={updateField}
            />
          ))}
        </div>
      </FormSection>

      <FormSection
        title="Interests"
        description="How interested are you in each of these areas?"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {INTEREST_FIELDS.map(([key, label]) => (
            <InterestSlider
              key={key}
              name={key}
              label={label}
              value={form[key]}
              onChange={updateField}
            />
          ))}
        </div>
      </FormSection>

      <FormSection
        title="Preferences"
        description="Your preferred way of working."
      >
        <fieldset className="flex flex-wrap gap-3">
          <legend className="sr-only">Preferred work type</legend>
          {WORK_TYPE_OPTIONS.map((opt) => (
            <label
              key={opt}
              className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                form.preferred_work_type === opt
                  ? "border-brand-400 bg-brand-500/10 text-white"
                  : "border-white/10 text-navy-300 hover:border-brand-400/50 hover:text-white"
              }`}
            >
              <input
                type="radio"
                name="preferred_work_type"
                value={opt}
                checked={form.preferred_work_type === opt}
                onChange={handleTextChange}
                className="sr-only"
              />
              {opt}
            </label>
          ))}
        </fieldset>
      </FormSection>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto self-start rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-glow hover:bg-brand-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? "Analyzing your profile..." : "Get My Career Recommendations"}
      </button>
    </form>
  );
}
