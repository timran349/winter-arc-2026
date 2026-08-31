'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DailyCheckIn from '@/components/DailyCheckIn';
import MissedDayBanner from '@/components/MissedDayBanner';
import CalendarGrid from '@/components/CalendarGrid';
import WeeklyReviewModal from '@/components/WeeklyReviewModal';
import { MessageSquare, Flame, ArrowUpRight, Sparkles } from 'lucide-react';

import {
  getDateForDayNumber,
  getCurrentArcDay,
  getDaysRemaining,
  formatFullDate,
  getWeekForDay,
  TOTAL_ARC_DAYS
} from '@/lib/dates';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [arc, setArc] = useState(null);
  const [checkInsMap, setCheckInsMap] = useState({});
  const [reviews, setReviews] = useState([]);
  const [simulatedDayNum, setSimulatedDayNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();

        if (!meData.user) {
          router.push('/login');
          return;
        }

        if (meData.user.accessStatus !== 'PAID') {
          router.push('/unlock');
          return;
        }

        setUser(meData.user);

        const arcRes = await fetch('/api/arc');
        const arcData = await arcRes.json();

        if (!arcData.arc) {
          router.push('/onboarding');
          return;
        }

        setArc(arcData.arc);

        // Calculate real day number based on start date
        const todayStr = new Date().toISOString().split('T')[0];
        const currentDay = getCurrentArcDay(arcData.arc.startDate, todayStr);
        setSimulatedDayNum(currentDay);

        // Format checkIns into object map by date
        const cMap = {};
        if (arcData.arc.checkIns) {
          arcData.arc.checkIns.forEach((c) => {
            if (!cMap[c.date]) {
              cMap[c.date] = { completedIds: [], saved: true, isMissed: false };
            }
            if (c.completed) {
              cMap[c.date].completedIds.push(c.commitmentId);
            }
          });
        }
        setCheckInsMap(cMap);

        if (arcData.arc.reviews) {
          setReviews(arcData.arc.reviews);
        }

        setLoading(false);
      } catch (err) {
        console.error('Dashboard load error:', err);
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleSaveTodayCheckIn = async (dateStr, completedIds) => {
    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr, completedCommitmentIds: completedIds })
      });

      const data = await res.json();
      if (data.checkIns) {
        const cMap = {};
        data.checkIns.forEach((c) => {
          if (!cMap[c.date]) {
            cMap[c.date] = { completedIds: [], saved: true, isMissed: false };
          }
          if (c.completed) {
            cMap[c.date].completedIds.push(c.commitmentId);
          }
        });
        setCheckInsMap(cMap);
      }
    } catch (err) {
      console.error('Failed to save check-in:', err);
    }
  };

  const handleSaveWeeklyReview = async (reviewData) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      const data = await res.json();
      if (data.review) {
        setReviews((prev) => {
          const filtered = prev.filter((r) => r.weekNumber !== data.review.weekNumber);
          return [...filtered, data.review].sort((a, b) => a.weekNumber - b.weekNumber);
        });
      }
    } catch (err) {
      console.error('Failed to save review:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080a] flex items-center justify-center text-xs text-slate-500 font-mono-code">
        Loading Winter Arc...
      </div>
    );
  }

  const startDateStr = arc?.startDate || '2026-10-01';
  const currentDateStr = getDateForDayNumber(startDateStr, simulatedDayNum);
  const daysRemaining = getDaysRemaining(simulatedDayNum);
  const arcProgressPct = Math.round((simulatedDayNum / TOTAL_ARC_DAYS) * 100);

  const yesterdayDateStr = getDateForDayNumber(startDateStr, Math.max(1, simulatedDayNum - 1));
  const yesterdayCheck = checkInsMap[yesterdayDateStr];
  const isYesterdayMissed = simulatedDayNum > 1 && yesterdayCheck && yesterdayCheck.completedIds.length === 0;

  const currentWeekNum = getWeekForDay(simulatedDayNum);

  const scrollToCheckIn = () => {
    const el = document.getElementById('today-checkin-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-slate-100 flex flex-col">
      <Navbar
        currentView="dashboard"
        setCurrentView={(v) => router.push(`/${v === 'dashboard' ? 'dashboard' : v}`)}
        simulatedDay={simulatedDayNum}
        setSimulatedDay={setSimulatedDayNum}
        userProfile={{ name: user?.name }}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 w-full">
        {/* HERO PROGRESS CARD */}
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
                "{arc?.intention || 'Start before January. Finish with proof.'}"
              </p>
            </div>

            {/* CIRCULAR PROGRESS RING */}
            <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] shrink-0">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="stroke-slate-800" strokeWidth="8" fill="none" />
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

        {/* MISSED DAY NOTIFICATION */}
        {isYesterdayMissed && (
          <MissedDayBanner onScrollToCheckIn={scrollToCheckIn} />
        )}

        {/* TODAY'S CHECK-IN */}
        <div id="today-checkin-section">
          <DailyCheckIn
            currentDateStr={currentDateStr}
            commitments={arc?.commitments || []}
            checkInData={checkInsMap[currentDateStr]}
            onSaveCheckIn={handleSaveTodayCheckIn}
          />
        </div>

        {/* 90-DAY CALENDAR GRID */}
        <CalendarGrid
          startDateStr={startDateStr}
          currentDayNum={simulatedDayNum}
          commitments={arc?.commitments || []}
          checkIns={checkInsMap}
          onSavePastCheckIn={handleSaveTodayCheckIn}
        />

        {/* DISCORD COMMUNITY PLACEHOLDER */}
        <div className="p-6 rounded-3xl border border-white/[0.08] bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="font-editorial text-lg font-medium text-slate-200">
                Join the Winter Arc Community
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Connect with fellow Arc travelers showing up every day before the new year.
              </div>
            </div>
          </div>
          <button
            onClick={() => alert('Winter Arc Discord invitation link coming soon!')}
            className="px-4 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors shrink-0"
          >
            Discord Community (Coming Soon)
          </button>
        </div>
      </main>

      <WeeklyReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        currentDayNum={simulatedDayNum}
        reviews={reviews}
        onSaveReview={handleSaveWeeklyReview}
      />

      <Footer onOpenOnboarding={() => router.push('/onboarding')} />
    </div>
  );
}
