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
  
  // Custom Persona State
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customRole, setCustomRole] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  useEffect(() => {
    // Only fetch if we haven't fetched yet for this session's step
    if (!hasFetched && personas.length === 0) {
      const fetchPersonas = async () => {
        setIsLoading(true);
        try {
          const result = await generatePersonas(idea);
          setPersonas(result);
          setHasFetched(true);
          // Auto-select the first one if none selected and no custom ones exist
          if (selectedPersonas.length === 0 && result.length > 0) {
            onToggle(result[0]);
          }
        } catch (e) {
          onError("Could not generate personas. Please try again or check your connection.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPersonas();
    }
  }, [idea, hasFetched, personas.length, selectedPersonas.length, onToggle, onError]);

  const handleRetry = () => {
    setPersonas([]);
    setHasFetched(false);
  };

  const handleAddCustom = () => {
    if (customRole.trim() && customDesc.trim()) {
      const newPersona: Persona = {
        role: customRole.trim(),
        description: customDesc.trim(),
        reasoning: 'Custom User Persona'
      };
      onToggle(newPersona); // Add to selected immediately
      setCustomRole('');
      setCustomDesc('');
      setIsAddingCustom(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 text-center animate-pulse">
        <h2 className="text-xl font-semibold text-slate-400 dark:text-slate-300">Analyzing your request...</h2>
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Choose Expert Persona(s)</h2>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">Select AI-generated experts or create your own.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {/* Generated Personas */}
        {personas.map((p, idx) => {
          const isSelected = selectedPersonas.some(selected => selected.role === p.role);
          return (
            <div
              key={idx}
              onClick={() => onToggle(p)}
              className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 relative group overflow-hidden ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                  : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-bold text-lg pr-8 transition-colors ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-white'}`}>{p.role}</h3>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300 dark:border-slate-500 bg-slate-50 dark:bg-slate-900'
                }`}>
                  {isSelected && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed transition-colors">{p.description}</p>
              <div className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/50 p-2 rounded border border-slate-200 dark:border-slate-800 transition-colors">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Why:</span> {p.reasoning}
              </div>
            </div>
          );
        })}

        {/* Custom Personas (User Added) - Displayed as cards if selected but not in generated list */}
        {selectedPersonas
          .filter(sp => !personas.some(p => p.role === sp.role) && sp.reasoning === 'Custom User Persona')
          .map((p, idx) => (
            <div
              key={`custom-${idx}`}
              onClick={() => onToggle(p)}
              className="cursor-pointer p-5 rounded-xl border-2 bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)] relative group"
            >
               <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg pr-8 text-blue-700 dark:text-blue-300 transition-colors">{p.role}</h3>
                <div className="w-6 h-6 rounded-full border border-blue-500 bg-blue-500 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed transition-colors">{p.description}</p>
              <div className="text-xs text-blue-600/80 dark:text-blue-400/80 bg-blue-100/50 dark:bg-blue-900/30 p-2 rounded border border-blue-200 dark:border-blue-800/50 transition-colors">
                Custom Persona
              </div>
            </div>
        ))}

        {/* Add Custom Card */}
        {isAddingCustom ? (
          <div className="p-5 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 space-y-3 transition-colors">
             <input 
              type="text" 
              placeholder="Role Name (e.g. Python Expert)" 
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:border-blue-500 outline-none transition-colors"
              autoFocus
             />
             <textarea 
               placeholder="Description (e.g. Expert in data analysis...)"
               value={customDesc}
               onChange={(e) => setCustomDesc(e.target.value)}
               className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:border-blue-500 outline-none h-20 resize-none transition-colors"
             />
             <div className="flex gap-2">
               <button onClick={handleAddCustom} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-1 rounded text-sm">Add</button>
               <button onClick={() => setIsAddingCustom(false)} className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white py-1 rounded text-sm transition-colors">Cancel</button>
             </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsAddingCustom(true)}
            className="cursor-pointer p-5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium">Create Custom Persona</span>
          </div>
        )}

      </div>

      <div className="flex justify-between pt-6">
         <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          Back
        </button>
        <div className="flex gap-3">
           <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg font-medium text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            Regenerate Suggestions
          </button>
          <button
            onClick={onNext}
            disabled={selectedPersonas.length === 0}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
              selectedPersonas.length === 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
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