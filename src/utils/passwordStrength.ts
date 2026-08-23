export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  feedback: string[];
}

/**
 * Calculates password strength based on entropy, length, and character diversity.
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      score: 0,
      label: 'Very Weak',
      color: 'bg-slate-300 dark:bg-slate-700',
      feedback: ['Enter a password'],
    };
  }

  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Mix of uppercase and lowercase letters');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one number');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one special character (!@#$%^&*)');
  }

  const scoreMap: Record<number, { label: PasswordStrengthResult['label']; color: string }> = {
    0: { label: 'Very Weak', color: 'bg-rose-500' },
    1: { label: 'Weak', color: 'bg-rose-500' },
    2: { label: 'Fair', color: 'bg-amber-500' },
    3: { label: 'Good', color: 'bg-indigo-500' },
    4: { label: 'Strong', color: 'bg-emerald-500' },
  };

  return {
    score,
    label: scoreMap[score].label,
    color: scoreMap[score].color,
    feedback,
  };
}
