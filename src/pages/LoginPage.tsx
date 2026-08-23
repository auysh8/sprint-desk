import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { BrandLogo } from '../components/ui/BrandLogo';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex bg-[#0e0f14] text-slate-100 selection:bg-violet-500/30 selection:text-white">
      {/* Left side: Clean Minimalist Branding (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 bg-[#12131b] overflow-hidden">
        {/* Subtle ambient background glow */}
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none" />

        {/* Top Logo Brand */}
        <div className="relative z-10">
          <BrandLogo size="lg" />
        </div>

        {/* Center Hero Copy (Ultra-clean, uncluttered) */}
        <div className="relative z-10 max-w-md space-y-4 my-auto">
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
            Plan, track, and ship high-velocity sprints.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Streamlined agile project management built for modern engineering teams.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-500 font-medium">
          © 2026 SprintDesk. All rights reserved.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-1/4 right-1/4 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
