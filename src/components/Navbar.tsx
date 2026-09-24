import React from 'react';
import { Shield, Activity, History, LogIn, LogOut, Cpu } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface NavbarProps {
  user: SupabaseUser | null;
  activeTab: 'dashboard' | 'history';
  setActiveTab: (tab: 'dashboard' | 'history') => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onStartScan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onSignOut,
  onStartScan
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-800/80 bg-[#0B0F17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-950 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">PC Care</span>
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                with AI
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">Automated Diagnostics & System Health</p>
          </div>
        </div>

        {/* Center Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Scan History</span>
          </button>
        </nav>

        {/* Actions & User Auth */}
        <div className="flex items-center gap-3">
          <button
            onClick={onStartScan}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-gray-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform active:scale-95"
          >
            <Cpu className="w-4 h-4" />
            <span>Scan PC Now</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold">
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-medium text-gray-200 truncate max-w-[130px]">{user.email}</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Authenticated</p>
                </div>
              </div>
              <button
                onClick={onSignOut}
                title="Sign Out"
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800/60 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
            >
              <LogIn className="w-4 h-4 text-emerald-400" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
