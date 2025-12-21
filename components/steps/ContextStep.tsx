import React from 'react';
import { PromptContext, ExamplePair } from '../../types';
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

interface ContextStepProps {
  context: PromptContext;
  onChange: (key: keyof PromptContext, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ContextStep: React.FC<ContextStepProps> = ({ context, onChange, onNext, onBack }) => {
  
  const addExample = () => onChange('examples', [...context.examples, { input: '', output: '' }]);
  const removeExample = (idx: number) => {
    const next = [...context.examples];
    next.splice(idx, 1);
    onChange('examples', next);
  };
  const updateExample = (idx: number, field: 'input' | 'output', val: string) => {
    const next = [...context.examples];
    next[idx][field] = val;
    onChange('examples', next);
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Studio Tuning</h2>
        <p className="text-slate-500 dark:text-slate-400">Enhance your prompt with high-impact logic and examples.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Logic Controls</h3>
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <div>
                   <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Chain of Thought</span>
                   <p className="text-[10px] text-slate-400">Forces explicit reasoning steps.</p>
                 </div>
                 <input type="checkbox" checked={context.useChainOfThought} onChange={() => onChange('useChainOfThought', !context.useChainOfThought)} />
               </div>
               <div className="flex items-center justify-between">
                 <div>
                   <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Meta-Criticism</span>
                   <p className="text-[10px] text-slate-400">AI reviews its draft before finishing.</p>
                 </div>
                 <input type="checkbox" checked={context.useSelfCorrection} onChange={() => onChange('useSelfCorrection', !context.useSelfCorrection)} />
               </div>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Precision Rules</h3>
            <textarea
              value={context.negativeConstraints}
              onChange={(e) => onChange('negativeConstraints', e.target.value)}
              placeholder="What should the AI NEVER do? (e.g., No jargon, no preamble...)"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm h-32 outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Verbosity Intensity</h3>
             <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
               {(['default', 'concise', 'detailed'] as const).map(v => (
                 <button
                   key={v}
                   onClick={() => onChange('verbosity', v)}
                   className={`flex-1 py-2 text-[10px] font-bold uppercase rounded transition-all ${context.verbosity === v ? 'bg-white dark:bg-slate-700 text-blue-500 shadow-sm' : 'text-slate-400'}`}
                 >
                   {v}
                 </button>
               ))}
             </div>
          </div>

          <div className="bg-white dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Core Context</h3>
            <textarea
              value={context.constraints}
              onChange={(e) => onChange('constraints', e.target.value)}
              placeholder="Special instructions or background info..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm h-32 outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest">Few-Shot Benchmarks</h3>
          <button onClick={addExample} className="text-xs font-bold text-blue-600 uppercase">+ Add Pair</button>
        </div>
        <div className="space-y-4">
          {context.examples.map((ex, i) => (
            <div key={i} className="grid grid-cols-2 gap-4 relative group">
              <textarea placeholder="Input" value={ex.input} onChange={e => updateExample(i, 'input', e.target.value)} className="p-3 text-xs bg-white dark:bg-slate-800 border rounded-lg h-24 outline-none" />
              <textarea placeholder="Output" value={ex.output} onChange={e => updateExample(i, 'output', e.target.value)} className="p-3 text-xs bg-white dark:bg-slate-800 border rounded-lg h-24 outline-none" />
              <button onClick={() => removeExample(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="px-8 py-3 rounded-xl font-medium text-slate-500">Back</button>
        <button onClick={onNext} className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold shadow-xl">Architect Prompt</button>
      </div>
    </div>
  );
};