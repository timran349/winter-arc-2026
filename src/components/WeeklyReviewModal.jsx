import React, { useState, useEffect } from 'react';
import { BookOpen, Check, Save, Sparkles, X, Plus } from 'lucide-react';
import { getWeekForDay, formatShortDate } from '../utils/dates';

export default function WeeklyReviewModal({
  currentDayNum,
  reviews = [],
  onSaveReview,
  isOpen,
  onClose
}) {
  const currentWeek = getWeekForDay(currentDayNum);
  const existingReview = reviews.find((r) => r.weekNumber === currentWeek);

  const [wentWell, setWentWell] = useState('');
  const [obstacles, setObstacles] = useState('');
  const [nextWeek, setNextWeek] = useState('');
  const [activeTab, setActiveTab] = useState('new');

  useEffect(() => {
    if (existingReview) {
      setWentWell(existingReview.wentWell || '');
      setObstacles(existingReview.obstacles || '');
      setNextWeek(existingReview.nextWeek || '');
    } else {
      setWentWell('');
      setObstacles('');
      setNextWeek('');
    }
  }, [existingReview, currentWeek]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveReview({
      weekNumber: currentWeek,
      wentWell,
      obstacles,
      nextWeek,
      createdAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl card-wise p-6 sm:p-8 space-y-6 my-8 bg-white border border-zinc-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <div className="text-xs font-mono-code text-[#FF4500] uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <BookOpen className="w-3.5 h-3.5 text-[#FF4500]" /> WEEKLY REFLECTION
            </div>
            <h3 className="font-funnel text-3xl text-zinc-900 mt-1 font-semibold uppercase leading-tight">
              Week {currentWeek} complete.
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 ${
              activeTab === 'new'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 bg-zinc-100'
            }`}
          >
            Week {currentWeek} Review
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 ${
              activeTab === 'archive'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 bg-zinc-100'
            }`}
          >
            Previous Reviews ({reviews.length})
          </button>
        </div>

        {/* TAB 1: FORM */}
        {activeTab === 'new' && (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-2 uppercase font-mono-code">
                What went well?
              </label>
              <textarea
                rows={3}
                placeholder="What victories or strong routines did you build this week?"
                value={wentWell}
                onChange={(e) => setWentWell(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FF4500] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-2 uppercase font-mono-code">
                What got in the way?
              </label>
              <textarea
                rows={3}
                placeholder="Distractions, fatigue, or friction points that slowed you down..."
                value={obstacles}
                onChange={(e) => setObstacles(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FF4500] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-2 uppercase font-mono-code">
                What will you change next week?
              </label>
              <textarea
                rows={3}
                placeholder="One small adjustment to improve execution next week..."
                value={nextWeek}
                onChange={(e) => setNextWeek(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FF4500] font-medium"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-wise-secondary px-5 py-2.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-wise-primary px-6 py-2.5 text-xs font-semibold gap-2"
              >
                <Save className="w-3.5 h-3.5 text-white" /> <span>Save Weekly Review</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: ARCHIVE */}
        {activeTab === 'archive' && (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {reviews.length === 0 ? (
              <div className="text-xs text-zinc-500 font-medium py-8 text-center">
                No saved weekly reviews yet. Complete Week {currentWeek}'s review to build your log.
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.weekNumber}
                  className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                    <span className="font-funnel text-lg text-[#FF4500] font-bold uppercase">
                      Week {rev.weekNumber} Review
                    </span>
                    <span className="text-[10px] font-mono-code text-zinc-400 font-bold">
                      {formatShortDate(rev.createdAt)}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-medium text-zinc-700">
                    <div>
                      <span className="font-bold text-zinc-900">Went Well: </span>
                      <span>{rev.wentWell || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-zinc-900">Obstacles: </span>
                      <span>{rev.obstacles || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-zinc-900">Next Week Action: </span>
                      <span>{rev.nextWeek || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
