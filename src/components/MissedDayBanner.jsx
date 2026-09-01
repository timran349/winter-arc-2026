import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';

export default function MissedDayBanner({ onScrollToCheckIn }) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-6 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 font-bold">
          <Flame className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-funnel text-xl text-zinc-900 font-bold uppercase">
            Yesterday was missed. That's okay. Keep going.
          </h4>
          <p className="text-xs text-zinc-600 font-medium mt-1">
            Your Arc doesn't reset for missing a day. Show up today and build forward.
          </p>
        </div>
      </div>

      <button
        onClick={onScrollToCheckIn}
        className="btn-wise-secondary px-5 py-2.5 text-xs font-semibold shrink-0 gap-1.5 active:scale-95"
      >
        <span>Check in today</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#FF4500]" />
      </button>
    </div>
  );
}
