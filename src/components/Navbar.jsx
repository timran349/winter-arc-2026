import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, Calendar, BarChart3, BookOpen, ShieldCheck, UserCheck, LogOut } from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  userProfile,
  onLogout
}) {
  const router = useRouter();

  const handleNavClick = (viewId) => {
    if (setCurrentView) {
      setCurrentView(viewId);
    } else {
      router.push(`/${viewId === 'dashboard' ? 'dashboard' : viewId}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07080a]/90 backdrop-blur-md">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('dashboard')}
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
            { id: 'progress', label: 'Progress', icon: BarChart3 },
            { id: 'reviews', label: 'Weekly Reviews', icon: BookOpen },
            { id: 'arc', label: 'My Arc', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
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

        {/* User Profile / Logout */}
        <div className="flex items-center gap-3">
          {userProfile ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('arc')}
                className="flex items-center gap-2 text-xs text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-1.5 rounded-lg transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-medium">{userProfile.name}</span>
              </button>
              <button
                onClick={handleSignOut}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/signup"
              className="text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              Build My Arc
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#07080a]/95 border-t border-white/10 backdrop-blur-lg px-2 py-2 flex items-center justify-around">
        {[
          { id: 'dashboard', label: 'Home', icon: Flame },
          { id: 'progress', label: 'Progress', icon: BarChart3 },
          { id: 'reviews', label: 'Reviews', icon: BookOpen },
          { id: 'arc', label: 'Arc', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
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
