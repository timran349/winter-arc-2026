import React from 'react';
import { ShieldCheck, Calendar, Flame, Check } from 'lucide-react';
import { calculateEndDate, formatShortDate } from '../utils/dates';

export default function ContractModal({ userProfile, commitments = [] }) {
  if (!userProfile) return null;

  const endDateStr = calculateEndDate(userProfile.startDate, 90);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card-wise p-8 sm:p-12 space-y-8 bg-white border border-zinc-200/80 shadow-[0_20px_60px_-20px_rgba(24,24,27,0.08)]">
        <div className="text-center border-b border-zinc-100 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30 font-mono-code text-xs font-bold mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF4500]" /> OFFICIAL PLEDGE CONTRACT
          </div>

          <h2 className="font-funnel text-4xl sm:text-6xl font-bold text-zinc-900 uppercase tracking-tight leading-tight">
            MY ARC 90
          </h2>

          <div className="font-funnel text-3xl font-bold text-[#FF4500] mt-3 uppercase">
            {userProfile.name}
          </div>

          <div className="font-mono-code text-xs font-bold text-[#FF4500] mt-3 tracking-widest uppercase">
            {formatShortDate(userProfile.startDate)} → {formatShortDate(endDateStr)}
          </div>

          {userProfile.intention && (
            <div className="font-mono-code text-xs text-zinc-600 font-semibold mt-3 uppercase border-l-2 border-[#FF4500] pl-3 py-1 inline-block">
              "{userProfile.intention}"
            </div>
          )}
        </div>

        <div>
          <div className="text-xs font-mono-code text-[#FF4500] uppercase tracking-wider mb-4 text-center font-bold">
            MY 90-DAY COMMITMENTS ({commitments.length})
          </div>

          <div className="space-y-3">
            {commitments.map((comm) => (
              <div
                key={comm.id}
                className="p-4 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-between px-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF4500] text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span className="text-sm font-semibold text-zinc-900">{comm.name}</span>
                </div>
                {comm.category && (
                  <span className="text-[10px] font-mono-code px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[#FF4500] font-bold">
                    {comm.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-6 border-t border-zinc-100 space-y-2">
          <div className="font-funnel text-2xl font-bold text-zinc-900 uppercase tracking-tight">
            90 DAYS.
          </div>
          <div className="font-funnel text-2xl font-bold text-[#FF4500] uppercase tracking-tight">
            NO RESTARTS.
          </div>
          <p className="text-xs font-medium text-zinc-500 max-w-sm mx-auto pt-2">
            Start before January. Finish with proof. Missed days are part of the journey.
          </p>
        </div>
      </div>
    </div>
  );
}
