import React from 'react';
import { AppStep } from '../types';
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */

interface StepIndicatorProps {
  currentStep: AppStep;
}

const steps = [
  { id: AppStep.IDEA, label: 'Idea' },
  { id: AppStep.PERSONA, label: 'Persona' },
  { id: AppStep.CONTEXT, label: 'Context' },
  { id: AppStep.RESULT, label: 'Result' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      <div className="relative flex items-center justify-between">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-800 -z-10 rounded"></div>
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-500 -z-10 transition-all duration-500 ease-in-out rounded"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base border-2 transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                } ${isCurrent ? 'scale-110' : ''}`}
              >
                {index + 1}
              </div>
              <span className={`mt-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${
                isActive ? 'text-blue-400' : 'text-slate-600'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};