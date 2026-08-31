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
      <div className="frost-glass rounded-3xl p-6 sm:p-8 border border-white/10 glow-subtle">
        <div className="text-xs font-mono-code text-sky-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
          <BarChart3 className="w-3.5 h-3.5" /> OVERVIEW
        </div>
        <h3 className="font-editorial text-3xl text-slate-100 font-normal">
          Progress & Consistency
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-xs font-mono-code text-slate-400">Days completed</div>
            <div className="text-3xl font-editorial font-bold text-slate-100 mt-2">
              {daysCompletedCount} <span className="text-slate-500 text-lg font-mono-code">/ {currentDayNum}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono-code mt-1">Days shown up for</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-xs font-mono-code text-slate-400">Commitments completed</div>
            <div className="text-3xl font-editorial font-bold text-sky-400 mt-2">
              {overallPercentage}%
            </div>
            <div className="text-[11px] text-slate-500 font-mono-code mt-1">Overall completion rate</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-xs font-mono-code text-slate-400">Days remaining</div>
            <div className="text-3xl font-editorial font-bold text-slate-100 mt-2">
              {daysRemaining}
            </div>
            <div className="text-[11px] text-slate-500 font-mono-code mt-1">Out of {TOTAL_ARC_DAYS} total days</div>
          </div>
        </div>
      </div>

      {/* INDIVIDUAL COMMITMENTS BREAKDOWN */}
      <div className="frost-glass rounded-3xl p-6 sm:p-8 border border-white/10">
        <div className="text-xs font-mono-code text-slate-400 uppercase tracking-widest mb-6">
          Consistency Per Commitment
        </div>

        <div className="space-y-6">
          {commitmentStats.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-200">{item.name}</span>
                <span className="font-mono-code font-bold text-sky-400">{item.percentage}%</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/[0.06]">
                <div
                  className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                  style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono-code text-slate-500">
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
