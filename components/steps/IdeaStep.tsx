import React from 'react';
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

interface IdeaStepProps {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
}

export const IdeaStep: React.FC<IdeaStepProps> = ({ value, onChange, onNext }) => {
  const isNextDisabled = value.trim().length < 5;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">What do you want to achieve?</h2>
        <p className="text-slate-400">Describe your task, goal, or problem in plain English.</p>
      </div>

      <div className="bg-slate-800/50 p-1 rounded-xl ring-1 ring-slate-700 focus-within:ring-blue-500 transition-all shadow-lg">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="E.g., I want to write a Python script to scrape a website, or I need a marketing email for a new coffee brand..."
          className="w-full h-48 bg-transparent text-white p-4 outline-none resize-none text-lg placeholder-slate-500 rounded-lg"
          autoFocus
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
            isNextDisabled
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25 active:scale-95'
          }`}
        >
          Next: Select Persona
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};