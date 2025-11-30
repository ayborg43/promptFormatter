import React, { useState } from 'react';
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
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [context, setContext] = useState<PromptContext>({
    audience: '',
    constraints: '',
    format: '',
    examples: ''
  });
  const [error, setError] = useState<string | null>(null);

  const hasApiKey = checkApiKey();

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
    setSelectedPersona(null);
    setContext({ audience: '', constraints: '', format: '', examples: '' });
    setCurrentStep(AppStep.IDEA);
    setError(null);
  };

  const handleContextChange = (key: keyof PromptContext, value: string) => {
    setContext(prev => ({ ...prev, [key]: value }));
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold">API Key Missing</h1>
          <p className="text-slate-400">
            The <code>API_KEY</code> environment variable is not set. 
            This app requires a valid Google Gemini API key to function.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
              PA
            </div>
            <h1 className="font-bold text-xl tracking-tight">Prompt Architect</h1>
          </div>
          <div className="text-xs font-medium text-slate-500 border border-slate-800 px-2 py-1 rounded bg-slate-900">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
        <StepIndicator currentStep={currentStep} />

        <div className="mt-8 relative min-h-[400px]">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-center gap-3 animate-fade-in">
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
              selectedPersona={selectedPersona} 
              onSelect={setSelectedPersona} 
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

          {currentStep === AppStep.RESULT && selectedPersona && (
            <ResultStep 
              idea={idea} 
              persona={selectedPersona} 
              context={context} 
              onRestart={handleRestart}
              onBack={handleBack}
              onError={setError}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Prompt Architect. Built with React & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;