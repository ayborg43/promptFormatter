import React from 'react';
import { PromptContext } from '../../types';
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

interface ContextStepProps {
  context: PromptContext;
  onChange: (key: keyof PromptContext, value: string | boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ContextStep: React.FC<ContextStepProps> = ({ context, onChange, onNext, onBack }) => {
  
  const InputGroup = ({ 
    label, 
    field, 
    placeholder, 
    rows = 2,
    children
  }: { 
    label: string, 
    field: keyof PromptContext, 
    placeholder: string, 
    rows?: number,
    children?: React.ReactNode
  }) => (
    <div className="space-y-1">
      <div className="flex justify-between items-end">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 transition-colors">{label}</label>
      </div>
      <textarea
        value={context[field] as string}
        onChange={(e) => onChange(field, e.target.value)}
        rows={rows}
        className="w-full bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
        placeholder={placeholder}
      />
      {children}
    </div>
  );

  const formatOptions = ['Markdown', 'JSON', 'Python Code', 'Bullet Points', 'Email', 'Table'];
  const toneOptions = ['Professional', 'Friendly', 'Academic', 'Persuasive', 'Concise', 'Witty'];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Refine the Context</h2>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">Configure tone, format, and reasoning to get the exact output you need.</p>
      </div>

      <div className="grid gap-6">
        
        {/* Row 1: Audience & Tone */}
        <div className="grid gap-6 md:grid-cols-2">
           <InputGroup 
            label="Target Audience" 
            field="audience" 
            placeholder="e.g., Beginners, C-Suite Executives, Children..." 
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 transition-colors">Tone & Style</label>
            <div className="relative">
              <input
                value={context.tone}
                onChange={(e) => onChange('tone', e.target.value)}
                className="w-full bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. Professional, Casual, Empathetic..."
              />
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              {toneOptions.map(t => (
                <button
                  key={t}
                  onClick={() => onChange('tone', t)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    context.tone === t 
                    ? 'bg-blue-100 dark:bg-blue-600/30 border-blue-400 dark:border-blue-500 text-blue-800 dark:text-blue-200' 
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Format & Chain of Thought */}
        <div className="space-y-4 bg-slate-100 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 transition-colors">
           <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">Advanced Settings</label>
              <div className="flex items-center gap-3">
                 <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors">Chain of Thought (Step-by-Step)?</span>
                 <button 
                  onClick={() => onChange('useChainOfThought', !context.useChainOfThought)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${context.useChainOfThought ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                 >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${context.useChainOfThought ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </button>
              </div>
           </div>

           <InputGroup 
            label="Output Format" 
            field="format" 
            placeholder="e.g., Markdown table, JSON, Python script, Blog post..." 
          >
             <div className="flex gap-2 flex-wrap mt-2">
              {formatOptions.map(f => (
                <button
                  key={f}
                  onClick={() => onChange('format', f)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    context.format === f 
                    ? 'bg-purple-100 dark:bg-purple-600/30 border-purple-400 dark:border-purple-500 text-purple-800 dark:text-purple-200' 
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </InputGroup>
        </div>
        
        <InputGroup 
          label="Constraints & Guidelines" 
          field="constraints" 
          placeholder="e.g., Max 200 words, no jargon, use British English, valid JSON only..." 
          rows={3}
        />

        <InputGroup 
          label="Examples or Data" 
          field="examples" 
          placeholder="Paste any relevant data samples, code snippets, or example outputs you want the AI to mimic..." 
          rows={4}
        />
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-blue-500/50 transition-all duration-200 active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Craft Perfect Prompt
        </button>
      </div>
    </div>
  );
};