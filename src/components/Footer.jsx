import React from 'react';
import { Flame } from 'lucide-react';

export default function Footer({ onOpenOnboarding }) {
  return (
    <footer className="w-full border-t border-zinc-200/60 bg-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
            <Flame className="w-4 h-4 text-[#FF4500]" />
          </div>
          <div>
            <div className="font-fraunces text-xl font-medium text-zinc-900">Arc 90</div>
            <div className="text-xs text-[#FF4500] font-mono-code uppercase tracking-wider font-bold">Start before January. Finish with proof.</div>
          </div>
        </div>

        <div className="text-center md:text-right">
          <p className="text-xs text-zinc-500 font-medium max-w-md">
            Arc 90 is a 90-day personal accountability system. Bold goals, daily execution, and weekly reviews.
          </p>
          <div className="mt-3 flex items-center justify-center md:justify-end gap-4 text-xs font-semibold text-zinc-600">
            <button onClick={onOpenOnboarding} className="text-[#FF4500] hover:underline font-bold">
              Build My Arc 90
            </button>
            <span>•</span>
            <span className="text-zinc-400 font-mono-code">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
