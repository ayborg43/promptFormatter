import React, { useEffect, useState } from 'react';
import { Persona } from '../../types';
import { generatePersonas } from '../../services/gemini';
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

interface PersonaStepProps {
  idea: string;
  selectedPersonas: Persona[];
  onToggle: (persona: Persona) => void;
  onBack: () => void;
  onNext: () => void;
  onError: (msg: string) => void;
}

export const PersonaStep: React.FC<PersonaStepProps> = ({ 
  idea, 
  selectedPersonas, 
  onToggle, 
  onBack, 
  onNext,
  onError
}) => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  
  useEffect(() => {
    if (!hasFetched) {
      const fetchPersonas = async () => {
        setIsLoading(true);
        try {
          const result = await generatePersonas(idea);
          setPersonas(result);
          setHasFetched(true);
          if (selectedPersonas.length === 0 && result.length > 0) {
            onToggle(result[0]);
          }
        } catch (e) {
          onError("Could not generate personas.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPersonas();
    }
  }, [idea, hasFetched]);

  if (isLoading) {
    return (
      <div className="space-y-6 text-center animate-pulse">
        <h2 className="text-xl font-semibold text-slate-400">Defining the perfect expert for your task...</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Select Your Master Persona</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">A single, focused expert identity produces the highest quality results.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {personas.map((p, idx) => {
          const isSelected = selectedPersonas[0]?.role === p.role;
          return (
            <div
              key={idx}
              onClick={() => onToggle(p)}
              className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-lg'
                  : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                   <h3 className="font-bold text-lg text-slate-900 dark:text-white">{p.role}</h3>
                   {isSelected && <span className="text-blue-500">●</span>}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{p.description}</p>
              </div>
              <div className="mt-4 text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-900 p-2 rounded">
                <strong>Lead Insight:</strong> {p.reasoning}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-6">
        <button onClick={onBack} className="px-6 py-2 rounded-lg text-slate-500">Back</button>
        <button
          onClick={onNext}
          disabled={selectedPersonas.length === 0}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          Next: Studio Tuning
        </button>
      </div>
    </div>
  );
};