import React, { useEffect, useState } from 'react';
import { Persona, PromptContext } from '../../types';
import { craftFinalPrompt } from '../../services/gemini';
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

interface ResultStepProps {
  idea: string;
  personas: Persona[];
  context: PromptContext;
  onRestart: () => void;
  onBack: () => void;
  onError: (msg: string) => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({ idea, personas, context, onRestart, onBack, onError }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!prompt && !isLoading) {
      const generate = async () => {
        setIsLoading(true);
        try {
          const result = await craftFinalPrompt(idea, personas, context);
          setPrompt(result);
        } catch (e) {
          onError("Failed to generate the final prompt. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      generate();
    }
  }, [idea, personas, context, prompt, isLoading, onError]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-fade-in">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Crafting your prompt...</h2>
          <p className="text-slate-500 dark:text-slate-400 transition-colors">Integrating context, persona, and structural delimiters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 transition-colors">
            Your Optimized Prompt
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">Copy this and paste it into ChatGPT, Claude, or Gemini.</p>
        
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full font-bold uppercase tracking-widest border border-blue-200/50 dark:border-blue-800/50">
            XML-Tagging Applied
          </span>
          <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full font-bold uppercase tracking-widest border border-indigo-200/50 dark:border-indigo-800/50">
            Structural Delimiters
          </span>
          {context.useSelfCorrection && (
            <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full font-bold uppercase tracking-widest border border-purple-200/50 dark:border-purple-800/50">
              Meta-Criticism Active
            </span>
          )}
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-2xl transition-colors">
          <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-300 leading-relaxed overflow-x-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent pr-2 transition-colors">
            {prompt}
          </pre>
          
          <div className="absolute top-4 right-4 flex gap-2">
             <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                copied 
                ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/50' 
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white border border-slate-300 dark:border-slate-600'
              }`}
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
         <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          Back to Edit
        </button>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v3.283a1 1 0 01-2 0V12.1a1 1 0 01-1.283.9H13a1 1 0 01-1 1 7.002 7.002 0 01-3.261-13.717z" clipRule="evenodd" />
          </svg>
          Start New Prompt
        </button>
      </div>
    </div>
  );
};