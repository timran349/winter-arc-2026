import React, { useState, useEffect } from 'react';
import { Check, Save, Edit3, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DailyCheckIn({
  currentDateStr,
  commitments = [],
  checkInData,
  onSaveCheckIn
}) {
  const [completedIds, setCompletedIds] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (checkInData) {
      setCompletedIds(checkInData.completedIds || []);
      setIsSaved(!!checkInData.saved);
    } else {
      setCompletedIds([]);
      setIsSaved(false);
    }
  }, [checkInData, currentDateStr]);

  const toggleCommitment = (id) => {
    setCompletedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      return next;
    });
    setIsSaved(false);
  };

  const handleSave = () => {
    onSaveCheckIn(currentDateStr, completedIds);
    setIsSaved(true);

    if (completedIds.length === commitments.length && commitments.length > 0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF4500', '#18181b', '#ffffff']
      });
    }
  };

  const totalCount = commitments.length;
  const doneCount = completedIds.length;
  const isAllDone = doneCount === totalCount && totalCount > 0;

  return (
    <div className="card-wise p-6 sm:p-8 relative overflow-hidden bg-white border border-zinc-200/80 shadow-[0_20px_60px_-20px_rgba(24,24,27,0.06)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5 mb-6">
        <div>
          <div className="text-xs font-mono-code text-[#FF4500] uppercase tracking-widest flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4500]" /> TODAY'S CHECK-IN
          </div>
          <h3 className="font-funnel text-2xl sm:text-3xl text-zinc-900 mt-1 font-semibold uppercase leading-tight">
            Today's commitments
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-mono-code font-bold text-zinc-700">
            <span className="font-bold text-[#FF4500]">{doneCount}</span> / {totalCount} complete
          </div>

          {isSaved && (
            <span className="text-[11px] font-mono-code px-3 py-1 rounded-full bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#FF4500]" /> Saved
            </span>
          )}
        </div>
      </div>

      {/* COMMITMENTS TOGGLE LIST */}
      <div className="space-y-3">
        {commitments.map((comm) => {
          const checked = completedIds.includes(comm.id);
          return (
            <div
              key={comm.id}
              onClick={() => toggleCommitment(comm.id)}
              className={`group flex items-center justify-between p-4 rounded-full border transition-all cursor-pointer select-none px-6 active:scale-95 ${
                checked
                  ? 'bg-[#FF4500]/10 border-[#FF4500]/40 text-zinc-900 scale-105 shadow-sm'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:scale-105'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    checked
                      ? 'bg-[#FF4500] text-white'
                      : 'border border-zinc-300 bg-white group-hover:border-zinc-500'
                  }`}
                >
                  {checked && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </div>
                <span className={`text-sm sm:text-base font-semibold ${checked ? 'line-through text-zinc-400' : ''}`}>
                  {comm.name}
                </span>
              </div>

              {comm.category && (
                <span className="text-[10px] font-mono-code px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[#FF4500] font-bold">
                  {comm.category}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-zinc-500 font-medium">
          {isAllDone ? (
            <span className="text-[#FF4500] font-bold font-mono-code text-xs uppercase">
              "You showed up for everything today."
            </span>
          ) : (
            <span>Check off each item as you complete it. Edits allowed anytime.</span>
          )}
        </div>

        <button
          onClick={handleSave}
          className={`w-full sm:w-auto px-6 py-3 rounded-full font-semibold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 ${
            isSaved
              ? 'btn-wise-secondary'
              : 'btn-wise-orange'
          }`}
        >
          {isSaved ? <Edit3 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5 text-white" />}
          <span>{isSaved ? "Update Today's Check-in" : "Save Today's Check-in"}</span>
        </button>
      </div>
    </div>
  );
}
