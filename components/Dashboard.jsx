import React, { useState } from 'react';
import { Flame, Calendar, BarChart3, BookOpen, ShieldCheck, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import DailyCheckIn from './DailyCheckIn';
import MissedDayBanner from './MissedDayBanner';
import CalendarGrid from './CalendarGrid';
import ProgressStats from './ProgressStats';
import WeeklyReviewModal from './WeeklyReviewModal';
import ContractModal from './ContractModal';
import Day90Completion from './Day90Completion';

import {
  getDateForDayNumber,
  getDaysRemaining,
  formatFullDate,
  getWeekForDay,
  TOTAL_ARC_DAYS
} from '../utils/dates';

export default function Dashboard({
  userProfile,
  commitments = [],
  checkIns = {},
  weeklyReviews = [],
  simulatedDayNum = 18,
  currentView = 'dashboard',
  setCurrentView,
  onSaveTodayCheckIn,
  onSavePastCheckIn,
  onSaveWeeklyReview
}) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const startDateStr = userProfile?.startDate || '2026-10-01';
  const currentDateStr = getDateForDayNumber(startDateStr, simulatedDayNum);
  const daysRemaining = getDaysRemaining(simulatedDayNum);

  // Compute progress percentage
  const totalCount = commitments.length;
  const todayCheckData = checkIns[currentDateStr];
  const todayCompletedCount = todayCheckData?.completedIds?.length || 0;

  // Percentage complete (Day 18 of 90 = 20% completion)
  const arcProgressPct = Math.round((simulatedDayNum / TOTAL_ARC_DAYS) * 100);

  // Check if yesterday was missed (e.g. Day 12 or yesterday check-in had 0 items)
  const yesterdayDateStr = getDateForDayNumber(startDateStr, Math.max(1, simulatedDayNum - 1));
  const yesterdayCheck = checkIns[yesterdayDateStr];
  const isYesterdayMissed = simulatedDayNum > 1 && yesterdayCheck && yesterdayCheck.isMissed;

  const currentWeekNum = getWeekForDay(simulatedDayNum);

  // Scroll helper
  const scrollToCheckIn = () => {
    const el = document.getElementById('today-checkin-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // If at Day 90, show Day 90 Completion Experience
  if (simulatedDayNum === 90 && currentView === 'dashboard') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Day90Completion
          userProfile={userProfile}
          commitments={commitments}
          checkIns={checkIns}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. MAIN HERO PROGRESS CARD */}
      <div className="card-wise p-6 sm:p-10 relative overflow-hidden bg-gradient-to-br from-[#131610] via-[#0e100c] to-[#0b0c0a]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e2f6d5] text-[#163300] font-mono-code text-xs font-bold mb-3">
              <Flame className="w-3.5 h-3.5 text-[#163300]" /> MY WINTER ARC
            </div>

            <h1 className="font-display-wise text-5xl sm:text-7xl font-black text-slate-100 uppercase tracking-tight leading-[0.85]">
              <span className="text-[#9fe870]">Day {simulatedDayNum}</span> <span className="text-slate-400 font-extrabold text-3xl sm:text-5xl">of 90</span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-slate-300 font-semibold mt-4">
              <span className="text-[#9fe870] font-bold">{daysRemaining} days remaining</span>
              <span>•</span>
              <span className="text-slate-300 font-bold">{formatFullDate(currentDateStr)}</span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm font-bold mt-4 font-mono-code uppercase tracking-wide border-l-2 border-[#9fe870] pl-3 py-0.5">
              "Start before January. Finish with proof."
            </p>
          </div>

          {/* LARGE PROGRESS INDICATOR */}
          <div className="flex items-center gap-6 p-6 rounded-[24px] bg-[#0b0c0a] border border-white/[0.08] shrink-0">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              {/* Circular Progress Ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[#9fe870] transition-all duration-1000"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * arcProgressPct) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display-wise font-black text-2xl sm:text-3xl text-slate-100">
                  {arcProgressPct}%
                </span>
                <span className="text-[9px] font-mono-code text-[#9fe870] uppercase tracking-widest font-bold -mt-1">
                  COMPLETE
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono-code text-slate-400 font-bold uppercase">Week {currentWeekNum} of 12</div>
              <div className="text-sm font-bold text-slate-200">
                You're still in the Arc.
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs text-[#9fe870] font-mono-code font-bold pt-1 hover:underline"
              >
                Week {currentWeekNum} Review <ArrowUpRight className="w-3.5 h-3.5 text-[#9fe870]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW CONTENT CONTROLLER */}
      {currentView === 'dashboard' && (
        <div className="space-y-10">
          {/* MISSED DAY NOTIFICATION (If applicable) */}
          {isYesterdayMissed && (
            <MissedDayBanner onScrollToCheckIn={scrollToCheckIn} />
          )}

          {/* 2. TODAY'S CHECK-IN (MOST PROMINENT COMPONENT) */}
          <div id="today-checkin-section">
            <DailyCheckIn
              currentDateStr={currentDateStr}
              commitments={commitments}
              checkInData={todayCheckData}
              onSaveCheckIn={onSaveTodayCheckIn}
            />
          </div>

          {/* 3. 90-DAY CALENDAR GRID */}
          <CalendarGrid
            startDateStr={startDateStr}
            currentDayNum={simulatedDayNum}
            commitments={commitments}
            checkIns={checkIns}
            onSavePastCheckIn={onSavePastCheckIn}
          />
        </div>
      )}

      {currentView === 'calendar' && (
        <CalendarGrid
          startDateStr={startDateStr}
          currentDayNum={simulatedDayNum}
          commitments={commitments}
          checkIns={checkIns}
          onSavePastCheckIn={onSavePastCheckIn}
        />
      )}

      {currentView === 'progress' && (
        <ProgressStats
          startDateStr={startDateStr}
          currentDayNum={simulatedDayNum}
          commitments={commitments}
          checkIns={checkIns}
        />
      )}

      {currentView === 'reviews' && (
        <div className="card-wise p-6 sm:p-10">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
            <div>
              <div className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-widest">
                WEEKLY REFLECTIONS ARCHIVE
              </div>
              <h3 className="font-display-wise text-3xl text-slate-100 font-black uppercase mt-1">
                Every 7 Days Review
              </h3>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="btn-wise-primary px-5 py-2.5 text-xs font-extrabold"
            >
              + New Review
            </button>
          </div>

          <div className="space-y-4">
            {weeklyReviews.length === 0 ? (
              <div className="text-xs text-slate-400 font-semibold py-12 text-center">
                No weekly reviews logged yet. Click "+ New Review" to add your reflection for Week {currentWeekNum}.
              </div>
            ) : (
              weeklyReviews.map((rev) => (
                <div
                  key={rev.weekNumber}
                  className="p-6 rounded-[24px] bg-[#141712] border border-white/[0.08] space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <span className="font-display-wise text-xl text-[#9fe870] font-black uppercase">
                      Week {rev.weekNumber} Review
                    </span>
                    <span className="text-xs font-mono-code text-slate-400 font-bold">
                      {formatFullDate(rev.createdAt)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                    <div className="p-4 rounded-2xl bg-[#0b0c0a] border border-white/[0.05]">
                      <div className="font-bold text-slate-200 mb-1">What went well:</div>
                      <div className="text-slate-300 leading-relaxed">{rev.wentWell || 'None noted'}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0b0c0a] border border-white/[0.05]">
                      <div className="font-bold text-slate-200 mb-1">What got in the way:</div>
                      <div className="text-slate-300 leading-relaxed">{rev.obstacles || 'None noted'}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0b0c0a] border border-white/[0.05]">
                      <div className="font-bold text-slate-200 mb-1">Next week change:</div>
                      <div className="text-slate-300 leading-relaxed">{rev.nextWeek || 'None noted'}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {currentView === 'contract' && (
        <ContractModal userProfile={userProfile} commitments={commitments} />
      )}

      {/* WEEKLY REVIEW MODAL */}
      <WeeklyReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        currentDayNum={simulatedDayNum}
        reviews={weeklyReviews}
        onSaveReview={onSaveWeeklyReview}
      />
    </div>
  );
}
