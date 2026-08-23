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
    <div className="w-full max-w-[490px] p-8 sm:p-11 bg-[#181926] rounded-3xl shadow-2xl shadow-black/90 space-y-7 relative z-10">
      {/* Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600/30 to-purple-600/20 text-violet-300 mb-1 shadow-inner">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Sign in to SprintDesk
        </h2>
        <p className="text-sm text-slate-300 font-medium">
          Streamlined agile project and sprint management
        </p>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/20 flex items-start gap-3 text-rose-200 text-xs font-medium shadow-sm animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-300" />
          <span>{error}</span>
        </div>
      )}

      {/* Demo Credentials Helper */}
      <div className="p-4.5 rounded-2xl bg-[#222436] shadow-sm space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Demo Accounts (Click to fill)
        </span>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => fillDemoUser('emilys', 'emilyspass')}
            className="text-xs px-3.5 py-2 rounded-xl bg-[#2d3148] hover:bg-[#383d5a] text-white transition-all font-semibold cursor-pointer shadow-xs active:scale-95 flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <span>Emily (Lead)</span>
          </button>
          <button
            type="button"
            onClick={() => fillDemoUser('michaelw', 'michaelwpass')}
            className="text-xs px-3.5 py-2 rounded-xl bg-[#2d3148] hover:bg-[#383d5a] text-white transition-all font-semibold cursor-pointer shadow-xs active:scale-95 flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-sky-400 shrink-0" />
            <span>Michael (Dev)</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
            Username <span className="text-rose-400 font-bold">*</span>
          </label>
          <Input
            placeholder="e.g. emilys"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={validationErrors.username}
            leftIcon={<User className="h-4 w-4 text-slate-400" />}
            disabled={isLoading}
            autoComplete="username"
            required
            className="h-12 bg-[#222436] focus:bg-[#282b40] text-white placeholder:text-slate-400 text-sm font-medium rounded-xl focus:ring-2 focus:ring-violet-400 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
            Password <span className="text-rose-400 font-bold">*</span>
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={validationErrors.password}
            leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
            disabled={isLoading}
            autoComplete="current-password"
            required
            className="h-12 bg-[#222436] focus:bg-[#282b40] text-white placeholder:text-slate-400 text-sm font-medium rounded-xl focus:ring-2 focus:ring-violet-400 shadow-sm"
          />
          {/* Password Strength Meter */}
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Remember Me Option */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4.5 w-4.5 rounded accent-violet-500 text-violet-600 bg-[#222436] focus:ring-violet-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-slate-200">
              Remember me (30-day session)
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2 h-12 text-base font-bold bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white rounded-xl shadow-xl shadow-violet-950/70 transition-all"
        >
          Sign In to Dashboard
        </Button>
      </form>
    </div>
  );
};
