import React from 'react';
import { calculatePasswordStrength } from '../../utils/passwordStrength';
import { cn } from '../../utils/cn';

interface PasswordStrengthMeterProps {
  password?: string;
  showFeedback?: boolean;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password = '',
  showFeedback = true,
}) => {
  if (!password) return null;

  const { score, label, color, feedback } = calculatePasswordStrength(password);

  return (
    <div className="w-full flex flex-col gap-1.5 mt-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">Password strength:</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      </div>

      {/* 4-segment indicator bar */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-full rounded-full transition-all duration-300',
              index < score ? color : 'bg-slate-200 dark:bg-slate-800'
            )}
          />
        ))}
      </div>

      {showFeedback && feedback.length > 0 && (
        <ul className="text-[11px] text-slate-500 dark:text-slate-400 list-disc list-inside mt-0.5 space-y-0.5">
          {feedback.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
