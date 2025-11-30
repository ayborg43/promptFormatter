import React from 'react';
import { PromptContext } from '../../types';
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

interface ContextStepProps {
  context: PromptContext;
  onChange: (key: keyof PromptContext, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ContextStep: React.FC<ContextStepProps> = ({ context, onChange, onNext, onBack }) => {
  
  const InputGroup = ({ 
    label, 
    field, 
    placeholder, 
    rows = 2 
  }: { 
    label: string, 
    field: keyof PromptContext, 
    placeholder: string, 
    rows?: number 
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-300 ml-1">{label}</label>
      <textarea
        value={context[field]}
        onChange={(e) => onChange(field, e.target.value)}
        rows={rows}
        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Refine the Context</h2>
        <p className="text-slate-400">The more specific data you provide, the better the result.</p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
           <InputGroup 
            label="Target Audience" 
            field="audience" 
            placeholder="e.g., Beginners, C-Suite Executives, Children..." 
          />
           <InputGroup 
            label="Desired Format" 
            field="format" 
            placeholder="e.g., Markdown table, JSON, Python script, Blog post..." 
          />
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
          className="px-6 py-2 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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