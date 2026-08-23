import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { CheckCircle2, ShieldCheck, Zap, BarChart2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Left side: Branding & Value Props (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-indigo-900 dark:bg-indigo-950 text-white overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center font-black shadow-lg">
            SD
          </div>
          <span className="text-xl font-bold tracking-tight">SprintDesk</span>
        </div>

        {/* Center Hero Copy */}
        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
            High-velocity agile management built for modern engineering teams.
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed">
            Drag-and-drop kanban boards, live sprint metrics, tab-aware real-time notifications, and automated JWT lifecycle auth.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>@dnd-kit powered board with undo history</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Silent token refresh & 401 interceptor</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <BarChart2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Real-time velocity and completion trend analytics</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <Zap className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>100% custom handcrafted UI design system</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-indigo-300">
          © 2026 SprintDesk Pro. All rights reserved.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
