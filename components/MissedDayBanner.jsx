import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';

export default function MissedDayBanner({ onScrollToCheckIn }) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/[0.08] via-slate-900/60 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-6">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <Flame className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-editorial text-lg text-slate-100 font-medium">
            Yesterday was missed. That's okay. Keep going.
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Your Arc doesn't reset for missing a day. Show up today and build forward.
          </p>
        </div>
      </div>

      <button
        onClick={onScrollToCheckIn}
        className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
      >
        Check in today
        <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
      </button>
    </div>
  );
}
