import React from 'react';
import { ShieldCheck, Calendar, Flame, Check } from 'lucide-react';
import { calculateEndDate, formatShortDate } from '../utils/dates';

export default function ContractModal({ userProfile, commitments = [] }) {
  if (!userProfile) return null;

  const endDateStr = calculateEndDate(userProfile.startDate, 90);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card-wise p-8 sm:p-12 space-y-8 bg-gradient-to-b from-[#141712] to-[#0b0c0a]">
        <div className="text-center border-b border-white/[0.08] pb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e2f6d5] text-[#163300] font-mono-code text-xs font-bold mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#163300]" /> OFFICIAL PLEDGE CONTRACT
          </div>

          <h2 className="font-display-wise text-4xl sm:text-6xl font-black text-slate-100 uppercase tracking-tight leading-[0.85]">
            MY WINTER ARC
          </h2>

          <div className="font-display-wise text-3xl font-black text-[#9fe870] mt-3 uppercase">
            {userProfile.name}
          </div>

          <div className="font-mono-code text-xs font-bold text-[#9fe870] mt-3 tracking-widest uppercase">
            {formatShortDate(userProfile.startDate)} → {formatShortDate(endDateStr)}
          </div>

          {userProfile.intention && (
            <div className="font-mono-code text-xs text-slate-300 font-semibold mt-3 uppercase border-l-2 border-[#9fe870] pl-3 py-1 inline-block">
              "{userProfile.intention}"
            </div>
          )}
        </div>

        <div>
          <div className="text-xs font-mono-code text-[#9fe870] uppercase tracking-wider mb-4 text-center font-bold">
            MY 90-DAY COMMITMENTS ({commitments.length})
          </div>

          <div className="space-y-3">
            {commitments.map((comm) => (
              <div
                key={comm.id}
                className="p-4 rounded-full bg-[#141712] border border-white/[0.08] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#9fe870] text-[#163300] flex items-center justify-center font-black text-xs">
                    ✓
                  </div>
                  <span className="text-sm font-bold text-slate-100">{comm.name}</span>
                </div>
                {comm.category && (
                  <span className="text-[10px] font-mono-code px-3 py-1 rounded-full bg-[#e2f6d5] text-[#163300] font-bold">
                    {comm.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-6 border-t border-white/[0.08] space-y-2">
          <div className="font-display-wise text-2xl font-black text-slate-200 uppercase tracking-tight">
            90 DAYS.
          </div>
          <div className="font-display-wise text-2xl font-black text-[#9fe870] uppercase tracking-tight">
            NO RESTARTS.
          </div>
          <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto pt-2">
            Start before January. Finish with proof. Missed days are part of the journey.
          </p>
        </div>
      </div>
    </div>
  );
}
