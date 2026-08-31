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

        if (meData.user.accessStatus !== 'PAID') {
          router.push('/unlock');
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
        <div className="card-wise p-6 sm:p-10">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
            <div>
              <div className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
                WEEKLY REFLECTIONS LOG
              </div>
              <h3 className="font-display-wise text-3xl sm:text-4xl text-slate-100 font-black uppercase mt-1 leading-[0.88]">
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
            {reviews.length === 0 ? (
              <div className="text-xs text-slate-400 font-semibold py-12 text-center">
                Your first review arrives after 7 days. Click "+ New Review" to add your reflection for Week {currentWeekNum}.
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.weekNumber}
                  className="p-6 rounded-[24px] bg-[#141712] border border-white/[0.08] space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <span className="font-display-wise text-xl text-[#9fe870] font-black uppercase">
                      Week {rev.weekNumber} Review
                    </span>
                    <span className="text-xs font-mono-code text-slate-400 font-semibold">
                      {formatFullDate(rev.createdAt)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                    <div className="p-4 rounded-2xl bg-[#0b0c0a] border border-white/[0.06]">
                      <div className="font-bold text-slate-200 mb-1">What went well:</div>
                      <div className="text-slate-300 leading-relaxed">{rev.wentWell || 'None noted'}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0b0c0a] border border-white/[0.06]">
                      <div className="font-bold text-slate-200 mb-1">What got in the way:</div>
                      <div className="text-slate-300 leading-relaxed">{rev.obstacles || 'None noted'}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0b0c0a] border border-white/[0.06]">
                      <div className="font-bold text-slate-200 mb-1">Next week change:</div>
                      <div className="text-slate-300 leading-relaxed">{rev.nextWeek || 'None noted'}</div>
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
