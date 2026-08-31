import React from 'react';
import { Flame } from 'lucide-react';

export default function Footer({ onOpenOnboarding }) {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#050608] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center">
            <Flame className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="font-editorial text-lg font-medium text-slate-200">WINTER ARC 2026</div>
            <div className="text-xs text-slate-500 font-mono-code">Start before January. Finish with proof.</div>
          </div>
        </div>

        <div className="text-center md:text-right">
          <p className="text-xs text-slate-500 max-w-md">
            Winter Arc is a 90-day personal accountability experience. No restart mechanics, no shaming, no excuses. Just pure momentum.
          </p>
          <div className="mt-3 flex items-center justify-center md:justify-end gap-4 text-xs text-slate-400">
            <button onClick={onOpenOnboarding} className="hover:text-sky-400 transition-colors">
              Build My Arc
            </button>
            <span>•</span>
            <span className="text-slate-600">MVP v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
