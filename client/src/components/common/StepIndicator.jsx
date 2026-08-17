import React from 'react';
import { Check } from 'lucide-react';

export const StepIndicator = ({ currentStep = 1, steps = [] }) => {
  return (
    <div className="step-indicator-wrapper" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '1.5rem auto 2.5rem auto',
      maxWidth: '650px',
      padding: '0 1rem'
    }}>
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <React.Fragment key={step.title || idx}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 700,
                transition: 'all 0.3s ease',
                backgroundColor: isCompleted
                  ? 'var(--success-500)'
                  : isCurrent
                  ? 'var(--primary-600)'
                  : 'var(--slate-200)',
                color: (isCompleted || isCurrent) ? '#ffffff' : 'var(--slate-500)',
                boxShadow: isCurrent ? '0 0 0 4px var(--primary-100)' : 'none'
              }}>
                {isCompleted ? <Check size={18} strokeWidth={2.8} /> : stepNum}
              </div>

              <span style={{
                fontSize: '0.775rem',
                fontWeight: isCurrent ? 700 : 500,
                color: isCurrent ? 'var(--navy-900)' : 'var(--slate-500)',
                marginTop: '0.5rem',
                whiteSpace: 'nowrap',
                textAlign: 'center'
              }}>
                {step.title}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div style={{
                flex: 1,
                height: '3px',
                margin: '0 0.75rem',
                marginBottom: '1.5rem',
                backgroundColor: stepNum < currentStep ? 'var(--success-500)' : 'var(--slate-200)',
                borderRadius: '4px',
                transition: 'background-color 0.3s ease'
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
