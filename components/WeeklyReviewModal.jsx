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
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'archive'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl card-wise p-6 sm:p-8 space-y-6 my-8 bg-gradient-to-b from-[#141712] to-[#0b0c0a]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <div className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <BookOpen className="w-3.5 h-3.5 text-[#9fe870]" /> WEEKLY REFLECTION
            </div>
            <h3 className="font-display-wise text-3xl text-slate-100 mt-1 font-black uppercase leading-[0.88]">
              Week {currentWeek} complete.
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'new'
                ? 'bg-[#9fe870] text-[#163300] scale-105'
                : 'text-slate-300 hover:text-white bg-white/[0.04]'
            }`}
          >
            Week {currentWeek} Review
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'archive'
                ? 'bg-[#9fe870] text-[#163300] scale-105'
                : 'text-slate-300 hover:text-white bg-white/[0.04]'
            }`}
          >
            Previous Reviews ({reviews.length})
          </button>
        </div>

        {/* TAB 1: FORM */}
        {activeTab === 'new' && (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase font-mono-code">
                What went well?
              </label>
              <textarea
                rows={3}
                placeholder="What victories or strong routines did you build this week?"
                value={wentWell}
                onChange={(e) => setWentWell(e.target.value)}
                className="w-full bg-[#161813] border border-white/10 rounded-2xl p-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase font-mono-code">
                What got in the way?
              </label>
              <textarea
                rows={3}
                placeholder="Distractions, fatigue, or friction points that slowed you down..."
                value={obstacles}
                onChange={(e) => setObstacles(e.target.value)}
                className="w-full bg-[#161813] border border-white/10 rounded-2xl p-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase font-mono-code">
                What will you change next week?
              </label>
              <textarea
                rows={3}
                placeholder="One small adjustment to improve execution next week..."
                value={nextWeek}
                onChange={(e) => setNextWeek(e.target.value)}
                className="w-full bg-[#161813] border border-white/10 rounded-2xl p-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870] font-medium"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-wise-secondary px-5 py-2.5 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-wise-primary px-6 py-2.5 text-xs font-extrabold gap-2"
              >
                <Save className="w-3.5 h-3.5 text-[#163300]" /> <span>Save Weekly Review</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: ARCHIVE */}
        {activeTab === 'archive' && (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {reviews.length === 0 ? (
              <div className="text-xs text-slate-400 font-semibold py-8 text-center">
                No saved weekly reviews yet. Complete Week {currentWeek}'s review to build your log.
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.weekNumber}
                  className="p-5 rounded-[24px] bg-[#161813] border border-white/[0.08] space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="font-display-wise text-lg text-[#9fe870] font-black uppercase">
                      Week {rev.weekNumber} Review
                    </span>
                    <span className="text-[10px] font-mono-code text-slate-400 font-bold">
                      {formatShortDate(rev.createdAt)}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-medium">
                    <div>
                      <span className="font-bold text-slate-300">Went Well: </span>
                      <span className="text-slate-300">{rev.wentWell || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-300">Obstacles: </span>
                      <span className="text-slate-300">{rev.obstacles || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-300">Next Week Action: </span>
                      <span className="text-slate-300">{rev.nextWeek || 'N/A'}</span>
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
