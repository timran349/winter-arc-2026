import React from 'react';
import { Flame } from 'lucide-react';

export default function Footer({ onOpenOnboarding }) {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#090a08] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#9fe870] flex items-center justify-center">
            <Flame className="w-4 h-4 text-[#163300]" />
          </div>
          <div>
            <div className="font-editorial text-xl font-black text-slate-100">WINTER ARC 2026</div>
            <div className="text-xs text-[#9fe870] font-mono-code uppercase tracking-wider font-bold">Start before January. Finish with proof.</div>
          </div>
        </div>

        <div className="text-center md:text-right">
          <p className="text-xs text-slate-400 font-semibold max-w-md">
            Winter Arc is a 90-day personal accountability system. Bold goals, daily execution, and weekly reviews without borders.
          </p>
          <div className="mt-3 flex items-center justify-center md:justify-end gap-4 text-xs font-bold text-slate-300">
            <button onClick={onOpenOnboarding} className="text-[#9fe870] hover:underline hover:scale-105 transition-transform">
              Build My Arc
            </button>
            <span>•</span>
            <span className="text-slate-500">MVP v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
