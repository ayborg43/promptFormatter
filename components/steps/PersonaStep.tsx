import React, { useEffect, useState } from 'react';
import { Persona } from '../../types';
import { generatePersonas } from '../../services/gemini';
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

interface PersonaStepProps {
  idea: string;
  selectedPersona: Persona | null;
  onSelect: (persona: Persona) => void;
  onBack: () => void;
  onNext: () => void;
  onError: (msg: string) => void;
}

export const PersonaStep: React.FC<PersonaStepProps> = ({ 
  idea, 
  selectedPersona, 
  onSelect, 
  onBack, 
  onNext,
  onError
}) => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Only fetch if we haven't fetched yet for this session's step
    if (!hasFetched && personas.length === 0) {
      const fetchPersonas = async () => {
        setIsLoading(true);
        try {
          const result = await generatePersonas(idea);
          setPersonas(result);
          setHasFetched(true);
          // Auto-select the first one if none selected
          if (!selectedPersona && result.length > 0) {
            onSelect(result[0]);
          }
        } catch (e) {
          onError("Could not generate personas. Please try again or check your connection.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPersonas();
    }
  }, [idea, hasFetched, personas.length, selectedPersona, onSelect, onError]);

  const handleRetry = () => {
    setPersonas([]);
    setHasFetched(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 text-center animate-pulse">
        <h2 className="text-xl font-semibold text-slate-300">Analyzing your request...</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Choose an Expert Persona</h2>
        <p className="text-slate-400">Who should the AI pretend to be to give you the best answer?</p>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {personas.map((p, idx) => {
          const isSelected = selectedPersona?.role === p.role;
          return (
            <div
              key={idx}
              onClick={() => onSelect(p)}
              className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 relative group overflow-hidden ${
                isSelected
                  ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-blue-300' : 'text-white'}`}>{p.role}</h3>
              <p className="text-sm text-slate-300 mb-3 leading-relaxed">{p.description}</p>
              <div className="text-xs text-slate-500 bg-slate-900/50 p-2 rounded border border-slate-800">
                <span className="font-semibold text-slate-400">Why:</span> {p.reasoning}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-6">
         <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          Back
        </button>
        <div className="flex gap-3">
           <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg font-medium text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors text-sm"
          >
            Regenerate Personas
          </button>
          <button
            onClick={onNext}
            disabled={!selectedPersona}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
              !selectedPersona
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/25 active:scale-95'
            }`}
          >
            Next: Add Context
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};