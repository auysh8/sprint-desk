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
    <div className="w-full flex flex-col gap-2 mt-2.5">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-300">Password strength:</span>
        <span className="text-slate-100 font-bold">{label}</span>
      </div>

      {/* 4-segment indicator bar */}
      <div className="grid grid-cols-4 gap-2 h-2 w-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-full rounded-full transition-all duration-300',
              index < score ? color : 'bg-[#222226]'
            )}
          />
        ))}
      </div>

      {showFeedback && feedback.length > 0 && (
        <ul className="text-xs text-slate-300 list-disc list-inside mt-1 space-y-1">
          {feedback.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
