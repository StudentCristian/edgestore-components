'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardPhase } from '@/hooks/useWizardPersistence';

interface Step {
  id: WizardPhase;
  label: string;
  number: number;
}

const STEPS: Step[] = [
  { id: 'upload', label: 'Subir', number: 1 },
  { id: 'provide-data', label: 'Completar', number: 2 },
  { id: 'validate', label: 'Revisar', number: 3 },
];

interface WizardStepperProps {
  currentPhase: WizardPhase;
  onPhaseClick: (phase: WizardPhase) => void;
  completedPhases: WizardPhase[];
}

export function WizardStepper({ currentPhase, onPhaseClick, completedPhases }: WizardStepperProps) {
  const currentIndex = STEPS.findIndex(s => s.id === currentPhase);

  return (
    <nav aria-label="Progreso" className="w-full">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((step, index) => {
          const isCompleted = completedPhases.includes(step.id);
          const isCurrent = step.id === currentPhase;
          const isPast = index < currentIndex;
          const isClickable = isPast || isCompleted;

          return (
            <li key={step.id} className="flex items-center">
              {/* Step indicator */}
              <button
                type="button"
                onClick={() => isClickable && onPhaseClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  isCompleted && !isCurrent && 'hover:opacity-80',
                  !isCurrent && !isCompleted && 'text-muted-foreground',
                  isClickable && !isCurrent && 'cursor-pointer',
                  !isClickable && 'cursor-not-allowed opacity-60'
                )}
                style={{
                  backgroundColor: isCurrent 
                    ? 'hsl(var(--primary))' 
                    : isCompleted && !isCurrent 
                      ? 'hsl(var(--primary) / 0.1)' 
                      : 'hsl(var(--muted))',
                  color: isCurrent 
                    ? 'hsl(var(--primary-foreground))' 
                    : isCompleted && !isCurrent 
                      ? 'hsl(var(--primary))' 
                      : undefined
                }}
              >
                {/* Circle with number or check */}
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: isCurrent 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : isCompleted && !isCurrent 
                        ? 'hsl(var(--primary))' 
                        : 'hsl(var(--muted-foreground) / 0.2)',
                    color: isCurrent 
                      ? 'hsl(var(--primary-foreground))' 
                      : isCompleted && !isCurrent 
                        ? 'hsl(var(--primary-foreground))' 
                        : 'hsl(var(--muted-foreground))'
                  }}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </span>
                
                {/* Label */}
                <span className="hidden sm:inline text-sm font-medium">
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 w-8 sm:w-12 mx-2',
                    isPast || isCompleted ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
