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
        colors: ['#38bdf8', '#e2e8f0', '#0284c7']
      });
    }
  };

  const totalCount = commitments.length;
  const doneCount = completedIds.length;
  const isAllDone = doneCount === totalCount && totalCount > 0;

  return (
    <div className="frost-glass rounded-3xl p-6 sm:p-8 border border-white/10 glow-subtle relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 mb-6">
        <div>
          <div className="text-xs font-mono-code text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> TODAY'S CHECK-IN
          </div>
          <h3 className="font-editorial text-2xl sm:text-3xl text-slate-100 mt-1 font-normal">
            Today's commitments
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono-code">
            <span className="font-bold text-sky-400">{doneCount}</span> / {totalCount} complete
          </div>

          {isSaved && (
            <span className="text-[11px] font-mono-code px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Saved
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
              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                checked
                  ? 'bg-sky-500/[0.08] border-sky-500/35 text-slate-100 shadow-[0_0_20px_rgba(56,189,248,0.1)]'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    checked
                      ? 'bg-sky-400 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                      : 'border border-slate-700 bg-slate-950 group-hover:border-slate-500'
                  }`}
                >
                  {checked && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
                </div>
                <span className={`text-sm sm:text-base font-medium ${checked ? 'line-through text-slate-300' : ''}`}>
                  {comm.name}
                </span>
              </div>

              {comm.category && (
                <span className="text-[10px] font-mono-code px-2.5 py-1 rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.05]">
                  {comm.category}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          {isAllDone ? (
            <span className="text-sky-400 font-medium font-editorial text-sm italic">
              "You showed up for everything today."
            </span>
          ) : (
            <span>Check off each item as you complete it. Edits allowed anytime.</span>
          )}
        </div>

        <button
          onClick={handleSave}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            isSaved
              ? 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/10'
              : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
          }`}
        >
          {isSaved ? <Edit3 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {isSaved ? 'Update Today\'s Check-in' : 'Save Today\'s Check-in'}
        </button>
      </div>
    </div>
  );
}
