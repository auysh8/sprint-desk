import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { Input, Button } from '../ui';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../ui/Toast/ToastContext';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();
  const { success } = useToast();

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [rememberMe, setRememberMe] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{ username?: string; password?: string }>({});

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const validate = () => {
    const errors: { username?: string; password?: string } = {};
    if (!username.trim()) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    try {
      await login({ username, password, rememberMe });
      success('Welcome back!', 'You have successfully logged in.');
      navigate(from, { replace: true });
    } catch {
      // Error handled by store
    }
  };

  const fillDemoUser = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setValidationErrors({});
    clearError();
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-3">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Sign in to SprintDesk
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Streamlined agile project and sprint management
        </p>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Demo Credentials Helper */}
      <div className="mb-6 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
          Demo Accounts (Click to fill)
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fillDemoUser('emilys', 'emilyspass')}
            className="text-xs px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-colors font-medium cursor-pointer"
          >
            👤 Emily (Lead)
          </button>
          <button
            type="button"
            onClick={() => fillDemoUser('michaelw', 'michaelwpass')}
            className="text-xs px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-colors font-medium cursor-pointer"
          >
            👤 Michael (Dev)
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          placeholder="e.g. emilys"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={validationErrors.username}
          leftIcon={<User className="h-4 w-4" />}
          disabled={isLoading}
          autoComplete="username"
          required
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={validationErrors.password}
            leftIcon={<Lock className="h-4 w-4" />}
            disabled={isLoading}
            autoComplete="current-password"
            required
          />
          {/* Password Strength Meter */}
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Remember Me Option */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
            />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Remember me (30-day session)
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Sign In to Dashboard
        </Button>
      </form>
    </div>
  );
};
