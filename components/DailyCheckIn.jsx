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

    // Fire subtle celebratory confetti if all commitments completed!
    if (completedIds.length === commitments.length && commitments.length > 0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#9fe870', '#e2f6d5', '#163300']
      });
    }
  };

  const totalCount = commitments.length;
  const doneCount = completedIds.length;
  const isAllDone = doneCount === totalCount && totalCount > 0;

  return (
    <div className="card-wise p-6 sm:p-8 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 mb-6">
        <div>
          <div className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#9fe870]" /> TODAY'S CHECK-IN
          </div>
          <h3 className="font-display-wise text-2xl sm:text-3xl text-slate-100 mt-1 font-black uppercase leading-[0.88]">
            Today's commitments
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 rounded-full bg-[#141712] border border-white/[0.08] text-xs font-mono-code font-bold">
            <span className="font-bold text-[#9fe870]">{doneCount}</span> / {totalCount} complete
          </div>

          {isSaved && (
            <span className="text-[11px] font-mono-code px-3 py-1 rounded-full bg-[#e2f6d5] text-[#163300] font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#163300]" /> Saved
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
              className={`group flex items-center justify-between p-4 rounded-full border transition-all cursor-pointer select-none px-6 ${
                checked
                  ? 'bg-[#9fe870]/10 border-[#9fe870]/40 text-slate-100 scale-105'
                  : 'bg-[#141712] border-white/[0.08] text-slate-300 hover:border-white/20 hover:scale-105'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    checked
                      ? 'bg-[#9fe870] text-[#163300]'
                      : 'border border-slate-700 bg-slate-950 group-hover:border-slate-500'
                  }`}
                >
                  {checked && <Check className="w-4 h-4 text-[#163300] stroke-[3]" />}
                </div>
                <span className={`text-sm sm:text-base font-bold ${checked ? 'line-through text-slate-300' : ''}`}>
                  {comm.name}
                </span>
              </div>

              {comm.category && (
                <span className="text-[10px] font-mono-code px-3 py-1 rounded-full bg-[#e2f6d5] text-[#163300] font-bold">
                  {comm.category}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400 font-semibold">
          {isAllDone ? (
            <span className="text-[#9fe870] font-bold font-mono-code text-xs uppercase">
              "You showed up for everything today."
            </span>
          ) : (
            <span>Check off each item as you complete it. Edits allowed anytime.</span>
          )}
        </div>

        <button
          onClick={handleSave}
          className={`w-full sm:w-auto px-6 py-3 rounded-full font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
            isSaved
              ? 'btn-wise-secondary'
              : 'btn-wise-primary'
          }`}
        >
          {isSaved ? <Edit3 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5 text-[#163300]" />}
          <span>{isSaved ? 'Update Today\'s Check-in' : 'Save Today\'s Check-in'}</span>
        </button>
      </div>
    </div>
  );
}
