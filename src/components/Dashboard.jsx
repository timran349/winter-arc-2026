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
      <div className="frost-glass rounded-3xl p-6 sm:p-10 border border-white/10 glow-subtle relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-[#0f1117]/90 to-[#07080a]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono-code text-xs mb-3">
              <Flame className="w-3.5 h-3.5" /> MY WINTER ARC
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl font-normal text-slate-100 tracking-tight">
              Day {simulatedDayNum} <span className="text-slate-500 text-3xl sm:text-5xl font-light">of 90</span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-slate-400 mt-2">
              <span>{daysRemaining} days remaining</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">{formatFullDate(currentDateStr)}</span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm font-editorial italic mt-4">
              "Start before January. Finish with proof."
            </p>
          </div>

          {/* LARGE PROGRESS INDICATOR */}
          <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] shrink-0">
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
                  className="stroke-sky-400 transition-all duration-1000"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * arcProgressPct) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono-code font-bold text-xl sm:text-2xl text-slate-100">
                  {arcProgressPct}%
                </span>
                <span className="text-[9px] font-mono-code text-sky-400 uppercase tracking-widest -mt-1">
                  COMPLETE
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono-code text-slate-400">Week {currentWeekNum} of 12</div>
              <div className="text-sm font-semibold text-slate-200 font-editorial">
                You're still in the Arc.
              </div>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-mono-code pt-1 underline underline-offset-4"
              >
                Week {currentWeekNum} Review <ArrowUpRight className="w-3 h-3" />
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
        <div className="frost-glass rounded-3xl p-6 sm:p-10 border border-white/10">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
            <div>
              <div className="text-xs font-mono-code text-sky-400 uppercase tracking-widest">
                WEEKLY REFLECTIONS ARCHIVE
              </div>
              <h3 className="font-editorial text-3xl text-slate-100 font-normal mt-0.5">
                Every 7 Days Review
              </h3>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
            >
              + New Review
            </button>
          </div>

          <div className="space-y-4">
            {weeklyReviews.length === 0 ? (
              <div className="text-xs text-slate-500 py-12 text-center">
                No weekly reviews logged yet. Click "+ New Review" to add your reflection for Week {currentWeekNum}.
              </div>
            ) : (
              weeklyReviews.map((rev) => (
                <div
                  key={rev.weekNumber}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <span className="font-editorial text-xl text-sky-400 font-medium">
                      Week {rev.weekNumber} Review
                    </span>
                    <span className="text-xs font-mono-code text-slate-500">
                      {formatFullDate(rev.createdAt)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05]">
                      <div className="font-semibold text-slate-200 mb-1">What went well:</div>
                      <div className="text-slate-400 leading-relaxed">{rev.wentWell || 'None noted'}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05]">
                      <div className="font-semibold text-slate-200 mb-1">What got in the way:</div>
                      <div className="text-slate-400 leading-relaxed">{rev.obstacles || 'None noted'}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.05]">
                      <div className="font-semibold text-slate-200 mb-1">Next week change:</div>
                      <div className="text-slate-400 leading-relaxed">{rev.nextWeek || 'None noted'}</div>
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
