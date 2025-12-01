import React, { useState, useEffect } from 'react';
import { AppStep, Persona, PromptContext } from './types';
import { StepIndicator } from './components/StepIndicator';
import { IdeaStep } from './components/steps/IdeaStep';
import { PersonaStep } from './components/steps/PersonaStep';
import { ContextStep } from './components/steps/ContextStep';
import { ResultStep } from './components/steps/ResultStep';
import { checkApiKey } from './services/gemini';
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.IDEA);
  const [idea, setIdea] = useState('');
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>([]);
  const [context, setContext] = useState<PromptContext>({
    audience: '',
    constraints: '',
    format: '',
    examples: '',
    tone: 'Professional',
    useChainOfThought: false
  });
  const [error, setError] = useState<string | null>(null);
  
  // Theme state: default to dark
  const [isDarkMode, setIsDarkMode] = useState(true);

  const hasApiKey = checkApiKey();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleNext = () => {
    setError(null);
    setCurrentStep((prev) => Math.min(prev + 1, AppStep.RESULT));
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, AppStep.IDEA));
  };

  const handleRestart = () => {
    setIdea('');
    setSelectedPersonas([]);
    setContext({ 
      audience: '', 
      constraints: '', 
      format: '', 
      examples: '',
      tone: 'Professional',
      useChainOfThought: false
    });
    setCurrentStep(AppStep.IDEA);
    setError(null);
  };

  const handlePersonaToggle = (persona: Persona) => {
    setSelectedPersonas(prev => {
      const exists = prev.find(p => p.role === persona.role);
      if (exists) {
        return prev.filter(p => p.role !== persona.role);
      }
      return [...prev, persona];
    });
  };

  const handleContextChange = (key: keyof PromptContext, value: string | boolean) => {
    setContext(prev => ({ ...prev, [key]: value }));
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold">API Key Missing</h1>
          <p className="text-slate-500 dark:text-slate-400">
            The <code>API_KEY</code> environment variable is not set. 
            This app requires a valid Google Gemini API key to function.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
              PA
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Prompt Architect</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <div className="text-xs font-medium text-slate-500 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 transition-colors">
              Powered by Gemini 2.5
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
        <StepIndicator currentStep={currentStep} />

        <div className="mt-8 relative min-h-[400px]">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/50 dark:text-red-200 p-4 rounded-lg flex items-center gap-3 animate-fade-in transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {currentStep === AppStep.IDEA && (
            <IdeaStep 
              value={idea} 
              onChange={setIdea} 
              onNext={handleNext} 
            />
          )}

          {currentStep === AppStep.PERSONA && (
            <PersonaStep 
              idea={idea} 
              selectedPersonas={selectedPersonas} 
              onToggle={handlePersonaToggle} 
              onBack={handleBack}
              onNext={handleNext}
              onError={setError}
            />
          )}

          {currentStep === AppStep.CONTEXT && (
            <ContextStep 
              context={context} 
              onChange={handleContextChange} 
              onNext={handleNext} 
              onBack={handleBack}
            />
          )}

          {currentStep === AppStep.RESULT && selectedPersonas.length > 0 && (
            <ResultStep 
              idea={idea} 
              personas={selectedPersonas} 
              context={context} 
              onRestart={handleRestart}
              onBack={handleBack}
              onError={setError}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 dark:text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Prompt Architect. Built with React & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;