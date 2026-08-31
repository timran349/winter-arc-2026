'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WeeklyReviewModal from '@/components/WeeklyReviewModal';
import { formatFullDate, getWeekForDay, getCurrentArcDay } from '@/lib/dates';

export default function ReviewsPage() {
  const router = useRouter();
  const [arc, setArc] = useState(null);
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

        const arcRes = await fetch('/api/arc');
        const arcData = await arcRes.json();
        if (!arcData.arc) {
          router.push('/onboarding');
          return;
        }

        setArc(arcData.arc);
        const todayStr = new Date().toISOString().split('T')[0];
        const currentDay = getCurrentArcDay(arcData.arc.startDate, todayStr);
        setSimulatedDayNum(currentDay);

        if (arcData.arc.reviews) setReviews(arcData.arc.reviews);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleSaveReview = async (reviewData) => {
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
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080a] flex items-center justify-center text-xs text-slate-500 font-mono-code">
        Loading Reviews...
      </div>
    );
  }

  const currentWeekNum = getWeekForDay(simulatedDayNum);

  return (
    <div className="min-h-screen bg-[#07080a] text-slate-100 flex flex-col">
      <Navbar
        currentView="reviews"
        setCurrentView={(v) => router.push(`/${v}`)}
        simulatedDay={simulatedDayNum}
        setSimulatedDay={setSimulatedDayNum}
      />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="frost-glass rounded-3xl p-6 sm:p-10 border border-white/10">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
            <div>
              <div className="text-xs font-mono-code text-sky-400 uppercase tracking-widest">
                WEEKLY REFLECTIONS LOG
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
            {reviews.length === 0 ? (
              <div className="text-xs text-slate-500 py-12 text-center">
                Your first review arrives after 7 days. Click "+ New Review" to add your reflection for Week {currentWeekNum}.
              </div>
            ) : (
              reviews.map((rev) => (
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
      </main>

      <WeeklyReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        currentDayNum={simulatedDayNum}
        reviews={reviews}
        onSaveReview={handleSaveReview}
      />

      <Footer onOpenOnboarding={() => router.push('/onboarding')} />
    </div>
  );
}
