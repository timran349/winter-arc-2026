import React from 'react';
import { BarChart3, Target, Calendar, CheckCircle2, TrendingUp } from 'lucide-react';
import { getDateForDayNumber, getDaysRemaining, TOTAL_ARC_DAYS } from '../utils/dates';

export default function ProgressStats({
  startDateStr,
  currentDayNum,
  commitments = [],
  checkIns = {}
}) {
  // Calculate completed days
  let daysCompletedCount = 0;
  let totalPossibleChecks = 0;
  let actualChecksCount = 0;

  const commitmentStats = commitments.map((c) => ({
    ...c,
    completedDays: 0,
    percentage: 0
  }));

  for (let day = 1; day <= currentDayNum; day++) {
    const dateStr = getDateForDayNumber(startDateStr, day);
    const cData = checkIns[dateStr];
    if (cData && cData.completedIds && cData.completedIds.length > 0) {
      daysCompletedCount++;
      actualChecksCount += cData.completedIds.length;

      cData.completedIds.forEach((id) => {
        const found = commitmentStats.find((item) => item.id === id);
        if (found) found.completedDays++;
      });
    }
    totalPossibleChecks += commitments.length;
  }

  // Compute percentages
  const overallPercentage = totalPossibleChecks > 0
    ? Math.round((actualChecksCount / totalPossibleChecks) * 100)
    : 0;

  commitmentStats.forEach((item) => {
    item.percentage = currentDayNum > 0
      ? Math.round((item.completedDays / currentDayNum) * 100)
      : 0;
  });

  const daysRemaining = getDaysRemaining(currentDayNum);

  return (
    <div className="space-y-8">
      {/* OVERALL METRICS HEADER */}
      <div className="card-wise p-6 sm:p-8">
        <div className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest flex items-center gap-1.5 mb-2 font-bold">
          <BarChart3 className="w-3.5 h-3.5 text-[#9fe870]" /> OVERVIEW
        </div>
        <h3 className="font-display-wise text-3xl sm:text-4xl text-slate-100 font-black uppercase leading-[0.88]">
          Progress & Consistency
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-5 rounded-[24px] bg-[#141712] border border-white/[0.08]">
            <div className="text-xs font-mono-code text-slate-400 font-bold uppercase">Days completed</div>
            <div className="text-3xl font-display-wise font-black text-slate-100 mt-2">
              {daysCompletedCount} <span className="text-slate-500 text-lg font-mono-code">/ {currentDayNum}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono-code mt-1 font-semibold">Days shown up for</div>
          </div>

          <div className="p-5 rounded-[24px] bg-[#141712] border border-white/[0.08]">
            <div className="text-xs font-mono-code text-slate-400 font-bold uppercase">Commitments completed</div>
            <div className="text-3xl font-display-wise font-black text-[#9fe870] mt-2">
              {overallPercentage}%
            </div>
            <div className="text-[11px] text-slate-400 font-mono-code mt-1 font-semibold">Overall completion rate</div>
          </div>

          <div className="p-5 rounded-[24px] bg-[#141712] border border-white/[0.08]">
            <div className="text-xs font-mono-code text-slate-400 font-bold uppercase">Days remaining</div>
            <div className="text-3xl font-display-wise font-black text-slate-100 mt-2">
              {daysRemaining}
            </div>
            <div className="text-[11px] text-slate-400 font-mono-code mt-1 font-semibold">Out of {TOTAL_ARC_DAYS} total days</div>
          </div>
        </div>
      </div>

      {/* INDIVIDUAL COMMITMENTS BREAKDOWN */}
      <div className="card-wise p-6 sm:p-8">
        <div className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest mb-6 font-bold">
          Consistency Per Commitment
        </div>

        <div className="space-y-6">
          {commitmentStats.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-200">{item.name}</span>
                <span className="font-mono-code font-bold text-[#9fe870]">{item.percentage}%</span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full bg-[#141712] rounded-full overflow-hidden border border-white/[0.08]">
                <div
                  className="h-full bg-[#9fe870] rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono-code text-slate-400 font-semibold">
                <span>Category: {item.category || 'GENERAL'}</span>
                <span>{item.completedDays} of {currentDayNum} days completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
