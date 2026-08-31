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
      colors: ['#9fe870', '#e2f6d5', '#163300']
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto text-center space-y-8 py-6">
      {/* CELEBRATION HERO */}
      <div className="card-wise p-8 sm:p-14 relative overflow-hidden bg-gradient-to-b from-[#141712] via-[#0e100c] to-[#0b0c0a]">
        <div className="w-16 h-16 rounded-full bg-[#9fe870] text-[#163300] flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-8 h-8 text-[#163300]" />
        </div>

        <div className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest mb-2 font-bold">
          90-DAY MILESTONE ACHIEVED
        </div>

        <h1 className="font-display-wise text-5xl sm:text-7xl font-black text-slate-100 uppercase tracking-tight leading-[0.85]">
          ARC COMPLETE.
        </h1>

        <p className="mt-4 text-lg text-[#9fe870] font-mono-code font-bold uppercase tracking-wide max-w-xl mx-auto">
          "You started before January. And you finished."
        </p>

        {/* METRICS ROW */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mt-8 pt-8 border-t border-white/[0.08]">
          <div className="p-4 rounded-[24px] bg-[#141712] border border-white/[0.08]">
            <div className="text-3xl font-display-wise font-black text-slate-100">90</div>
            <div className="text-[10px] font-mono-code text-slate-400 font-bold">DAYS</div>
          </div>

          <div className="p-4 rounded-[24px] bg-[#141712] border border-white/[0.08]">
            <div className="text-3xl font-display-wise font-black text-[#9fe870]">{commitments.length}</div>
            <div className="text-[10px] font-mono-code text-slate-400 font-bold">COMMITMENTS</div>
          </div>

          <div className="p-4 rounded-[24px] bg-[#141712] border border-white/[0.08]">
            <div className="text-3xl font-display-wise font-black text-[#9fe870]">94%</div>
            <div className="text-[10px] font-mono-code text-slate-400 font-bold">COMPLETION</div>
          </div>
        </div>

        {/* ORIGINAL COMMITMENTS LIST */}
        <div className="mt-8 text-left max-w-md mx-auto space-y-2">
          <div className="text-[11px] font-mono-code text-[#9fe870] uppercase text-center mb-3 font-bold">
            VERIFIED PROOF OF COMMITMENTS
          </div>
          {commitments.map((comm) => (
            <div
              key={comm.id}
              className="p-3.5 rounded-full bg-[#141712] border border-white/[0.08] flex items-center justify-between text-xs font-bold text-slate-200 px-5"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#9fe870] font-black">✓</span>
                <span>{comm.name}</span>
              </div>
              <span className="text-[10px] font-mono-code text-[#9fe870] font-bold">{comm.category || 'ARC'}</span>
            </div>
          ))}
        </div>

        {/* CTAS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="btn-wise-primary px-8 py-4 text-base font-extrabold gap-2 w-full sm:w-auto"
          >
            <Share2 className="w-5 h-5 text-[#163300]" /> <span>Share My Completion Card</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="btn-wise-secondary px-8 py-4 text-base font-bold gap-2 w-full sm:w-auto"
          >
            <ShieldCheck className="w-5 h-5 text-[#9fe870]" /> <span>View My Proof</span>
          </button>
        </div>
      </div>

      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        userProfile={userProfile}
        commitments={commitments}
        checkIns={checkIns}
        cardType="completion"
      />
    </div>
  );
}
