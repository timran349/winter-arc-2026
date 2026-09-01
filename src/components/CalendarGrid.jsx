import React, { useState } from 'react';
import { Calendar, Check, X, Edit3, ShieldAlert, Sparkles } from 'lucide-react';
import { getDateForDayNumber, formatShortDate, formatFullDate } from '../utils/dates';

export default function CalendarGrid({
  startDateStr,
  currentDayNum,
  commitments = [],
  checkIns = {},
  onSavePastCheckIn
}) {
  const [selectedDayNum, setSelectedDayNum] = useState(null);
  const [editingCompletedIds, setEditingCompletedIds] = useState([]);

  const handleDayClick = (dayNum) => {
    if (dayNum > currentDayNum) return;
    setSelectedDayNum(dayNum);
    const dateStr = getDateForDayNumber(startDateStr, dayNum);
    const existing = checkIns[dateStr];
    setEditingCompletedIds(existing?.completedIds || []);
  };

  const handleSaveModal = () => {
    if (!selectedDayNum) return;
    const dateStr = getDateForDayNumber(startDateStr, selectedDayNum);
    onSavePastCheckIn(dateStr, editingCompletedIds);
    setSelectedDayNum(null);
  };

  const toggleModalCommitment = (id) => {
    setEditingCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="card-wise p-6 sm:p-8 bg-white border border-zinc-200/80 shadow-[0_20px_60px_-20px_rgba(24,24,27,0.06)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5 mb-6">
        <div>
          <div className="text-xs font-mono-code text-[#FF4500] uppercase tracking-widest flex items-center gap-1.5 font-bold">
            <Calendar className="w-3.5 h-3.5 text-[#FF4500]" /> 90-DAY CALENDAR GRID
          </div>
          <h3 className="font-funnel text-2xl sm:text-3xl text-zinc-900 mt-1 font-semibold uppercase leading-tight">
            90 Days of Consistency
          </h3>
        </div>

        {/* LEGEND */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-code text-zinc-600 font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF4500]" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF4500]/20 border border-[#FF4500]" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-900" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-zinc-100 border border-zinc-200" />
            <span>Future</span>
          </div>
        </div>
      </div>

      {/* 90 TILES GRID */}
      <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-10 gap-2 sm:gap-2.5">
        {Array.from({ length: 90 }, (_, i) => i + 1).map((dayNum) => {
          const dateStr = getDateForDayNumber(startDateStr, dayNum);
          const cData = checkIns[dateStr];
          const isToday = dayNum === currentDayNum;
          const isFuture = dayNum > currentDayNum;

          const completedCount = cData?.completedIds?.length || 0;
          const totalCount = commitments.length;

          let tileState = 'future';
          if (isToday) tileState = 'today';
          else if (!isFuture) {
            if (completedCount === totalCount && totalCount > 0) tileState = 'completed';
            else if (completedCount > 0) tileState = 'partial';
            else tileState = 'missed';
          }

          return (
            <button
              key={dayNum}
              onClick={() => handleDayClick(dayNum)}
              disabled={isFuture}
              className={`relative group aspect-square rounded-2xl flex flex-col items-center justify-center p-1 font-mono-code transition-all select-none active:scale-95 ${
                isFuture
                  ? 'bg-zinc-100 border border-zinc-200 text-zinc-400 cursor-not-allowed'
                  : isToday
                  ? 'bg-zinc-900 text-white font-bold border-2 border-[#FF4500] cursor-pointer hover:scale-105 shadow-md'
                  : tileState === 'completed'
                  ? 'bg-[#FF4500] text-white font-bold cursor-pointer hover:scale-105 shadow-sm'
                  : tileState === 'partial'
                  ? 'bg-[#FF4500]/15 border border-[#FF4500] text-[#FF4500] font-bold cursor-pointer hover:scale-105'
                  : 'bg-amber-50 border border-amber-200 text-amber-700 font-bold cursor-pointer hover:scale-105'
              }`}
            >
              <span className="text-[11px] sm:text-xs">Day {dayNum}</span>

              <span className="text-[9px] mt-0.5 font-bold">
                {tileState === 'completed' && '✓'}
                {tileState === 'partial' && `${completedCount}/${totalCount}`}
                {tileState === 'missed' && '—'}
                {tileState === 'today' && 'TODAY'}
              </span>
            </button>
          );
        })}
      </div>

      {/* PAST DAY DETAIL MODAL */}
      {selectedDayNum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg card-wise p-6 sm:p-8 space-y-6 bg-white border border-zinc-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <div className="text-xs font-mono-code text-[#FF4500] font-bold">
                  DAY {selectedDayNum} OF 90
                </div>
                <div className="font-funnel text-2xl text-zinc-900 font-bold uppercase mt-0.5">
                  {formatFullDate(getDateForDayNumber(startDateStr, selectedDayNum))}
                </div>
              </div>
              <button
                onClick={() => setSelectedDayNum(null)}
                className="p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono-code text-[#FF4500] font-bold uppercase">Check-in Status:</div>
              {commitments.map((comm) => {
                const checked = editingCompletedIds.includes(comm.id);
                return (
                  <div
                    key={comm.id}
                    onClick={() => toggleModalCommitment(comm.id)}
                    className={`flex items-center justify-between p-3.5 rounded-full border transition-all cursor-pointer px-5 active:scale-95 ${
                      checked
                        ? 'bg-[#FF4500]/10 border-[#FF4500] text-zinc-900 scale-105'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          checked ? 'bg-[#FF4500] text-white font-bold' : 'border border-zinc-300'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                      </div>
                      <span className="text-sm font-semibold">{comm.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
              <button
                onClick={() => setSelectedDayNum(null)}
                className="btn-wise-secondary px-5 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="btn-wise-primary px-5 py-2 text-xs font-semibold"
              >
                Save Day {selectedDayNum}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
