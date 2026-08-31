import React, { useState, useEffect } from 'react';
import { Trophy, Award, Sparkles, Share2, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import ShareCardModal from './ShareCardModal';

export default function Day90Completion({
  userProfile,
  commitments = [],
  checkIns = {}
}) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti when reaching completion screen
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#38bdf8', '#f8fafc', '#0284c7', '#38bdf8']
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto text-center space-y-8 py-6">
      {/* CELEBRATION HERO */}
      <div className="frost-glass rounded-3xl p-8 sm:p-14 border border-sky-500/30 glow-frost relative overflow-hidden bg-gradient-to-b from-sky-500/[0.08] via-slate-900/40 to-transparent">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(56,189,248,0.4)]">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="text-xs font-mono-code text-sky-400 uppercase tracking-widest mb-2">
          90-DAY MILESTONE ACHIEVED
        </div>

        <h1 className="font-editorial text-5xl sm:text-7xl font-normal text-slate-100 uppercase tracking-tight">
          ARC COMPLETE.
        </h1>

        <p className="mt-4 text-lg text-slate-300 font-editorial italic max-w-xl mx-auto">
          "You started before January. And you finished."
        </p>

        {/* METRICS ROW */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mt-8 pt-8 border-t border-white/[0.08]">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-2xl font-editorial font-bold text-slate-100">90</div>
            <div className="text-[10px] font-mono-code text-slate-400">DAYS</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-2xl font-editorial font-bold text-sky-400">{commitments.length}</div>
            <div className="text-[10px] font-mono-code text-slate-400">COMMITMENTS</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-2xl font-editorial font-bold text-emerald-400">94%</div>
            <div className="text-[10px] font-mono-code text-slate-400">COMPLETION</div>
          </div>
        </div>

        {/* ORIGINAL COMMITMENTS LIST */}
        <div className="mt-8 text-left max-w-md mx-auto space-y-2">
          <div className="text-[11px] font-mono-code text-slate-400 uppercase text-center mb-3">
            VERIFIED PROOF OF COMMITMENTS
          </div>
          {commitments.map((comm) => (
            <div
              key={comm.id}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-sm text-slate-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-sky-400 font-bold">✓</span>
                <span>{comm.name}</span>
              </div>
              <span className="text-[10px] font-mono-code text-slate-500">{comm.category || 'ARC'}</span>
            </div>
          ))}
        </div>

        {/* CTAS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base transition-all shadow-[0_0_30px_rgba(56,189,248,0.5)] flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" /> Share My Completion Card
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 font-medium text-base transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-sky-400" /> View My Proof
          </button>
        </div>
      </div>

      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        userProfile={userProfile}
        commitments={commitments}
        checkIns={checkIns}
      />
    </div>
  );
}
