import React, { useState, useEffect } from 'react';
import { AppStep, Persona, PromptContext, ExamplePair } from './types';
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
    constraints: '',
    negativeConstraints: '',
    examples: [],
    useChainOfThought: true,
    useSelfCorrection: true,
    verbosity: 'default'
  });
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
      constraints: '', 
      negativeConstraints: '',
      examples: [],
      useChainOfThought: true,
      useSelfCorrection: true,
      verbosity: 'default'
    });
    setCurrentStep(AppStep.IDEA);
    setError(null);
  };

  const handlePersonaToggle = (persona: Persona) => {
    // Enforce single persona selection for maximum prompt focus
    setSelectedPersonas([persona]);
  };

  const handleContextChange = (key: keyof PromptContext, value: any) => {
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
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 transition-colors duration-300">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-lg">
              PA
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Prompt Architect</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
        <StepIndicator currentStep={currentStep} />
        {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        <div className="mt-8">
          {currentStep === AppStep.IDEA && (
            <IdeaStep value={idea} onChange={setIdea} onNext={handleNext} />
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
          {currentStep === AppStep.RESULT && (
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
    </div>
  );
};

export default App;