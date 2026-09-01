'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import WeeklyReviewModal from '@/src/components/WeeklyReviewModal';
import { formatFullDate, getWeekForDay, getCurrentArcDay } from '@/src/utils/dates';

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
      <div className="min-h-screen bg-white flex items-center justify-center text-xs text-zinc-500 font-mono-code">
        Loading Reviews...
      </div>
    );
  }

  const currentWeekNum = getWeekForDay(simulatedDayNum);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-[#FF4500] selection:text-white font-sans">
      <Navbar
        currentView="reviews"
        setCurrentView={(v) => router.push(`/${v}`)}
        simulatedDay={simulatedDayNum}
        setSimulatedDay={setSimulatedDayNum}
      />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="card-wise p-6 sm:p-10 bg-white border border-zinc-200/80 shadow-[0_20px_60px_-20px_rgba(24,24,27,0.06)]">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
            <div>
              <div className="text-xs font-mono-code text-[#FF4500] uppercase tracking-widest font-bold">
                WEEKLY REFLECTIONS LOG
              </div>
              <h3 className="font-funnel text-3xl sm:text-4xl text-zinc-900 font-semibold uppercase mt-1 leading-tight">
                Every 7 Days Review
              </h3>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="btn-wise-primary px-5 py-2.5 text-xs font-semibold"
            >
              + New Review
            </button>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-xs text-zinc-500 font-medium py-12 text-center">
                Your first review arrives after 7 days. Click "+ New Review" to add your reflection for Week {currentWeekNum}.
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.weekNumber}
                  className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                    <span className="font-funnel text-xl text-[#FF4500] font-bold uppercase">
                      Week {rev.weekNumber} Review
                    </span>
                    <span className="text-xs font-mono-code text-zinc-500 font-semibold">
                      {formatFullDate(rev.createdAt)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                    <div className="p-4 rounded-xl bg-white border border-zinc-200">
                      <div className="font-bold text-zinc-900 mb-1">What went well:</div>
                      <div className="text-zinc-600 leading-relaxed">{rev.wentWell || 'None noted'}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-zinc-200">
                      <div className="font-bold text-zinc-900 mb-1">What got in the way:</div>
                      <div className="text-zinc-600 leading-relaxed">{rev.obstacles || 'None noted'}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-zinc-200">
                      <div className="font-bold text-zinc-900 mb-1">Next week change:</div>
                      <div className="text-zinc-600 leading-relaxed">{rev.nextWeek || 'None noted'}</div>
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
