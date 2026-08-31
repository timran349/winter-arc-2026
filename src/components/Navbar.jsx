import React from 'react';
import { Flame, Calendar, BarChart3, BookOpen, ShieldCheck, RefreshCw, Sparkles, UserCheck } from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  simulatedDay,
  setSimulatedDay,
  onResetDemo,
  onOpenOnboarding,
  userProfile
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07080a]/90 backdrop-blur-md">
      {/* Time-Travel Sandbox Banner */}
      <div className="bg-[#0f121a] border-b border-white/[0.05] px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono-code text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
              <Sparkles className="w-3 h-3" /> DEMO SANDBOX
            </span>
            <span>Jump to Day:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {[1, 18, 45, 90].map((d) => (
              <button
                key={d}
                onClick={() => setSimulatedDay(d)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-code transition-all ${
                  simulatedDay === d
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                }`}
              >
                Day {d} {d === 90 ? '🏆' : ''}
              </button>
            ))}

            <select
              value={simulatedDay}
              onChange={(e) => setSimulatedDay(Number(e.target.value))}
              className="bg-slate-900 text-slate-300 border border-slate-800 rounded px-2 py-0.5 text-[11px] font-mono-code focus:outline-none focus:border-sky-500"
            >
              {Array.from({ length: 90 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  Day {d} of 90
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onResetDemo}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              title="Reset data to default demo state"
            >
              <RefreshCw className="w-3 h-3" /> Reset Demo
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-sky-500/50 transition-colors">
            <Flame className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <span className="font-editorial text-lg tracking-wide font-medium text-slate-100 group-hover:text-sky-300 transition-colors">
              WINTER ARC
            </span>
            <span className="text-[10px] font-mono-code text-slate-500 block -mt-1 tracking-widest">
              2026 MVP
            </span>
          </div>
        </div>

        {/* View Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] p-1 rounded-xl">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Flame },
            { id: 'calendar', label: '90-Day Grid', icon: Calendar },
            { id: 'progress', label: 'Progress', icon: BarChart3 },
            { id: 'reviews', label: 'Weekly Reviews', icon: BookOpen },
            { id: 'contract', label: 'My Arc', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/[0.08] text-slate-100 border border-white/10 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Actions / User Profile */}
        <div className="flex items-center gap-3">
          {userProfile ? (
            <button
              onClick={() => setCurrentView('contract')}
              className="flex items-center gap-2 text-xs text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-1.5 rounded-lg transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline font-medium">{userProfile.name}</span>
            </button>
          ) : (
            <button
              onClick={onOpenOnboarding}
              className="text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              Build My Arc
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#07080a]/95 border-t border-white/10 backdrop-blur-lg px-2 py-2 flex items-center justify-around">
        {[
          { id: 'dashboard', label: 'Home', icon: Flame },
          { id: 'calendar', label: 'Grid', icon: Calendar },
          { id: 'progress', label: 'Progress', icon: BarChart3 },
          { id: 'reviews', label: 'Reviews', icon: BookOpen },
          { id: 'contract', label: 'Arc', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                isActive ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
