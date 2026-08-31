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
        <div className="card-wise p-6 sm:p-10 relative overflow-hidden bg-gradient-to-br from-[#131610] via-[#0e100c] to-[#0b0c0a]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e2f6d5] text-[#163300] font-mono-code text-xs font-bold mb-4">
                <Flame className="w-3.5 h-3.5 text-[#163300]" /> MY WINTER ARC
              </div>

              <h1 className="font-display-wise text-5xl sm:text-7xl font-black text-slate-100 uppercase tracking-tight leading-[0.85]">
                <span className="text-[#9fe870]">Day {simulatedDayNum}</span> <span className="text-slate-400 font-extrabold text-3xl sm:text-5xl">of 90</span>
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-slate-300 font-semibold mt-4">
                <span className="text-[#9fe870] font-bold">{daysRemaining} days remaining</span>
                <span>•</span>
                <span className="text-slate-300">{formatFullDate(currentDateStr)}</span>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm font-semibold mt-4 font-mono-code uppercase tracking-wide border-l-2 border-[#9fe870] pl-3 py-0.5">
                "{arc?.intention || 'Start before January. Finish with proof.'}"
              </p>
            </div>

            {/* CIRCULAR PROGRESS RING */}
            <div className="flex items-center gap-6 p-6 rounded-[24px] bg-[#0b0c0a] border border-white/[0.08] shrink-0">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="stroke-slate-800" strokeWidth="8" fill="none" />
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
