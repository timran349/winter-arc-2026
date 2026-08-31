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
    <div className="frost-glass rounded-3xl p-6 sm:p-8 border border-white/10 glow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 mb-6">
        <div>
          <div className="text-xs font-mono-code text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> 90-DAY CALENDAR GRID
          </div>
          <h3 className="font-editorial text-2xl sm:text-3xl text-slate-100 mt-1 font-normal">
            90 Days of Consistency
          </h3>
        </div>

        {/* LEGEND */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-code text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-sky-500/20 border border-sky-400" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/40" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-white border border-white" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-white/[0.03] border border-white/[0.06]" />
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
              className={`relative group aspect-square rounded-xl flex flex-col items-center justify-center p-1 font-mono-code transition-all select-none ${
                isFuture
                  ? 'bg-white/[0.02] border border-white/[0.04] text-slate-700 cursor-not-allowed'
                  : isToday
                  ? 'bg-white text-slate-950 font-bold border-2 border-sky-400 shadow-[0_0_15px_rgba(255,255,255,0.6)] cursor-pointer hover:scale-105'
                  : tileState === 'completed'
                  ? 'bg-sky-500 text-slate-950 font-bold border border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)] cursor-pointer hover:scale-105'
                  : tileState === 'partial'
                  ? 'bg-sky-500/15 border border-sky-500/40 text-sky-200 cursor-pointer hover:bg-sky-500/25 hover:scale-105'
                  : 'bg-amber-500/10 border border-amber-500/20 text-amber-400/80 cursor-pointer hover:bg-amber-500/20 hover:scale-105'
              }`}
            >
              <span className="text-[11px] sm:text-xs">Day {dayNum}</span>

              {/* Status Indicator inside tile */}
              <span className="text-[9px] mt-0.5 opacity-80">
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
          <div className="relative w-full max-w-lg bg-[#0f1117] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="text-xs font-mono-code text-sky-400">
                  DAY {selectedDayNum} OF 90
                </div>
                <div className="font-editorial text-2xl text-slate-100 mt-0.5">
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
              <div className="text-xs font-mono-code text-slate-400">Check-in Status:</div>
              {commitments.map((comm) => {
                const checked = editingCompletedIds.includes(comm.id);
                return (
                  <div
                    key={comm.id}
                    onClick={() => toggleModalCommitment(comm.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      checked
                        ? 'bg-sky-500/10 border-sky-500/40 text-slate-100'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center ${
                          checked ? 'bg-sky-400 text-slate-950 font-bold' : 'border border-slate-700'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-medium">{comm.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => setSelectedDayNum(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.04] text-slate-300 text-xs font-medium hover:bg-white/[0.08]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
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
