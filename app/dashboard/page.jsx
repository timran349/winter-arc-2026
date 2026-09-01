'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import DailyCheckIn from '@/src/components/DailyCheckIn';
import MissedDayBanner from '@/src/components/MissedDayBanner';
import CalendarGrid from '@/src/components/CalendarGrid';
import WeeklyReviewModal from '@/src/components/WeeklyReviewModal';
import { MessageSquare, Flame, ArrowUpRight, Sparkles } from 'lucide-react';

import {
  getDateForDayNumber,
  getCurrentArcDay,
  getDaysRemaining,
  formatFullDate,
  getWeekForDay,
  TOTAL_ARC_DAYS
} from '@/src/utils/dates';

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
        const [meRes, arcRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/arc')
        ]);
        const meData = await meRes.json();
        const arcData = await arcRes.json();

        if (!meData.user) {
          router.push('/login');
          return;
        }

        if (meData.user.accessStatus !== 'PAID') {
          router.push('/unlock');
          return;
        }

        setUser(meData.user);

        if (!arcData.arc) {
          router.push('/onboarding');
          return;
        }

        setArc(arcData.arc);

        const todayStr = new Date().toISOString().split('T')[0];
        const currentDay = getCurrentArcDay(arcData.arc.startDate, todayStr);
        setSimulatedDayNum(currentDay);

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
      <div className="min-h-screen bg-white flex items-center justify-center text-xs text-zinc-500 font-mono-code">
        Loading Arc 90...
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
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-[#FF4500] selection:text-white font-sans">
      <Navbar
        currentView="dashboard"
        setCurrentView={(v) => router.push(`/${v === 'dashboard' ? 'dashboard' : v}`)}
        simulatedDay={simulatedDayNum}
        setSimulatedDay={setSimulatedDayNum}
        userProfile={{ name: user?.name }}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 w-full">
        {/* HERO PROGRESS CARD */}
        <div className="card-wise p-6 sm:p-10 relative overflow-hidden bg-white border-2 border-[#FF4500] shadow-[0_20px_60px_-15px_rgba(255,69,0,0.12)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30 font-mono-code text-xs font-bold mb-4">
                <Flame className="w-3.5 h-3.5 text-[#FF4500]" /> MY ARC 90 RUN
              </div>

              <h1 className="font-funnel text-5xl sm:text-7xl font-bold text-zinc-900 uppercase tracking-tight leading-[0.95]">
                <span className="text-[#FF4500]">Day {simulatedDayNum}</span> <span className="text-zinc-400 font-bold text-3xl sm:text-5xl">of 90</span>
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-zinc-600 font-semibold mt-4">
                <span className="text-[#FF4500] font-bold">{daysRemaining} days remaining</span>
                <span>•</span>
                <span className="text-zinc-500">{formatFullDate(currentDateStr)}</span>
              </div>

              <p className="text-zinc-600 text-xs sm:text-sm font-medium mt-4 font-mono-code uppercase tracking-wide border-l-2 border-[#FF4500] pl-3 py-0.5">
                "{arc?.intention || 'Start before January. Finish with proof.'}"
              </p>
            </div>

            {/* CIRCULAR PROGRESS RING */}
            <div className="flex items-center gap-6 p-6 rounded-2xl bg-zinc-50 border border-zinc-200 shrink-0">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="stroke-zinc-200" strokeWidth="8" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="stroke-[#FF4500] transition-all duration-1000"
                    strokeWidth="8"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * arcProgressPct) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-funnel font-bold text-2xl sm:text-3xl text-zinc-900">
                    {arcProgressPct}%
                  </span>
                  <span className="text-[9px] font-mono-code text-[#FF4500] uppercase tracking-widest font-bold -mt-1">
                    COMPLETE
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-mono-code text-zinc-500 font-bold uppercase">Week {currentWeekNum} of 12</div>
                <div className="text-sm font-semibold text-zinc-800">
                  You're still in the Arc.
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="inline-flex items-center gap-1 text-xs text-[#FF4500] font-mono-code font-bold pt-1 hover:underline"
                >
                  Week {currentWeekNum} Review <ArrowUpRight className="w-3.5 h-3.5 text-[#FF4500]" />
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
        <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF4500]/10 border border-[#FF4500]/20 text-[#FF4500] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="font-fraunces text-lg font-medium text-zinc-900">
                Join the Arc 90 Community
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                Connect with fellow travelers showing up every day before the new year.
              </div>
            </div>
          </div>
          <button
            onClick={() => alert('Arc 90 Discord invitation link coming soon!')}
            className="px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors shrink-0"
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
