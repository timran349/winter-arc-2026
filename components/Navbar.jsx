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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0b0c0a]/90 backdrop-blur-md">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#9fe870] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <Flame className="w-4 h-4 text-[#163300]" />
          </div>
          <div>
            <span className="font-editorial text-lg tracking-tight font-black text-slate-100 group-hover:text-[#9fe870] transition-colors">
              WINTER ARC
            </span>
            <span className="text-[10px] font-mono-code text-[#9fe870] block -mt-1 tracking-widest uppercase font-bold">
              2026 MVP
            </span>
          </div>
        </div>

        {/* View Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#141712] border border-white/[0.08] p-1.5 rounded-full">
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
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#9fe870] text-[#163300] shadow-sm scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06] hover:scale-105'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#163300]' : 'text-slate-400'}`} />
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
                className="flex items-center gap-2 text-xs text-slate-200 bg-[#161a13] hover:bg-[#1f241a] border border-[#9fe870]/20 px-4 py-1.5 rounded-full transition-all hover:scale-105"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#9fe870]" />
                <span className="font-bold">{userProfile.name}</span>
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-all hover:scale-110"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/signup"
              className="btn-wise-primary text-xs px-5 py-2"
            >
              Build My Arc
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0b0c0a]/95 border-t border-white/10 backdrop-blur-lg px-2 py-2 flex items-center justify-around">
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
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                isActive ? 'text-[#9fe870]' : 'text-slate-400 hover:text-slate-200'
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
