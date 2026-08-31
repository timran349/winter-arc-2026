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
    if (dayNum > currentDayNum) return; // Future day
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
    <div className="card-wise p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 mb-6">
        <div>
          <div className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest flex items-center gap-1.5 font-bold">
            <Calendar className="w-3.5 h-3.5 text-[#9fe870]" /> 90-DAY CALENDAR GRID
          </div>
          <h3 className="font-display-wise text-2xl sm:text-3xl text-slate-100 mt-1 font-black uppercase leading-[0.88]">
            90 Days of Consistency
          </h3>
        </div>

        {/* LEGEND */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-code text-slate-300 font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#9fe870]" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#e2f6d5] border border-[#9fe870]" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-white border border-white" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-white/[0.03] border border-white/[0.06]" />
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
              className={`relative group aspect-square rounded-2xl flex flex-col items-center justify-center p-1 font-mono-code transition-all select-none ${
                isFuture
                  ? 'bg-[#141712] border border-white/[0.04] text-slate-700 cursor-not-allowed'
                  : isToday
                  ? 'bg-white text-[#163300] font-black border-2 border-[#9fe870] cursor-pointer hover:scale-105'
                  : tileState === 'completed'
                  ? 'bg-[#9fe870] text-[#163300] font-extrabold cursor-pointer hover:scale-105'
                  : tileState === 'partial'
                  ? 'bg-[#e2f6d5] border border-[#9fe870] text-[#163300] font-bold cursor-pointer hover:scale-105'
                  : 'bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold cursor-pointer hover:scale-105'
              }`}
            >
              <span className="text-[11px] sm:text-xs">Day {dayNum}</span>

              {/* Status Indicator inside tile */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg card-wise p-6 sm:p-8 space-y-6 bg-gradient-to-b from-[#141712] to-[#0b0c0a]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="text-xs font-mono-code text-[#9fe870] font-bold">
                  DAY {selectedDayNum} OF 90
                </div>
                <div className="font-display-wise text-2xl text-slate-100 font-black uppercase mt-0.5">
                  {formatFullDate(getDateForDayNumber(startDateStr, selectedDayNum))}
                </div>
              </div>
              <button
                onClick={() => setSelectedDayNum(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono-code text-[#9fe870] font-bold uppercase">Check-in Status:</div>
              {commitments.map((comm) => {
                const checked = editingCompletedIds.includes(comm.id);
                return (
                  <div
                    key={comm.id}
                    onClick={() => toggleModalCommitment(comm.id)}
                    className={`flex items-center justify-between p-3.5 rounded-full border transition-all cursor-pointer px-5 ${
                      checked
                        ? 'bg-[#9fe870]/10 border-[#9fe870]/50 text-slate-100 scale-105'
                        : 'bg-[#141712] border-white/[0.08] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          checked ? 'bg-[#9fe870] text-[#163300] font-bold' : 'border border-slate-700'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5 stroke-[3] text-[#163300]" />}
                      </div>
                      <span className="text-sm font-bold">{comm.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => setSelectedDayNum(null)}
                className="btn-wise-secondary px-5 py-2 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="btn-wise-primary px-5 py-2 text-xs font-extrabold"
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
