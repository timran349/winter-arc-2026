import React from 'react';
import { ShieldCheck, Calendar, Flame, Check } from 'lucide-react';
import { calculateEndDate, formatShortDate } from '../utils/dates';

export default function ContractModal({ userProfile, commitments = [] }) {
  if (!userProfile) return null;

  const endDateStr = calculateEndDate(userProfile.startDate, 90);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="frost-glass rounded-3xl p-8 sm:p-12 border border-white/15 glow-subtle space-y-8 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="text-center border-b border-white/[0.08] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono-code text-xs mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> OFFICIAL PLEDGE CONTRACT
          </div>

          <h2 className="font-editorial text-4xl sm:text-5xl font-light text-slate-100 uppercase tracking-widest">
            MY WINTER ARC
          </h2>

          <div className="font-editorial text-2xl font-bold text-sky-400 mt-2">
            {userProfile.name}
          </div>

          <div className="font-mono-code text-sm text-slate-400 mt-3">
            {formatShortDate(userProfile.startDate)} → {formatShortDate(endDateStr)}
          </div>

          {userProfile.intention && (
            <div className="font-editorial italic text-slate-300 text-lg mt-2">
              "{userProfile.intention}"
            </div>
          )}
        </div>

        <div>
          <div className="text-xs font-mono-code text-slate-400 uppercase tracking-wider mb-4 text-center">
            MY 90-DAY COMMITMENTS ({commitments.length})
          </div>

          <div className="space-y-3">
            {commitments.map((comm) => (
              <div
                key={comm.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span className="text-base font-medium text-slate-100">{comm.name}</span>
                </div>
                {comm.category && (
                  <span className="text-[10px] font-mono-code px-2.5 py-1 rounded bg-white/[0.04] text-slate-400">
                    {comm.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-6 border-t border-white/[0.08] space-y-2">
          <div className="font-mono-code text-lg font-bold text-slate-200 tracking-wider">
            90 DAYS.
          </div>
          <div className="font-mono-code text-lg font-bold text-sky-400 tracking-wider">
            NO RESTARTS.
          </div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto pt-2">
            Start before January. Finish with proof. Missed days are part of the journey.
          </p>
        </div>
      </div>
    </div>
  );
}
