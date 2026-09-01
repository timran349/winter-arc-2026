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
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FF4500', '#18181b', '#ffffff']
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto text-center space-y-8 py-6">
      {/* CELEBRATION HERO */}
      <div className="card-wise p-8 sm:p-14 relative overflow-hidden bg-white border-2 border-[#FF4500] shadow-[0_20px_60px_-15px_rgba(255,69,0,0.12)]">
        <div className="w-16 h-16 rounded-full bg-[#FF4500] text-white flex items-center justify-center mx-auto mb-6 shadow-md">
          <Trophy className="w-8 h-8 text-white" />
        </div>

        <div className="text-xs font-mono-code text-[#FF4500] uppercase tracking-widest mb-2 font-bold">
          90-DAY MILESTONE ACHIEVED
        </div>

        <h1 className="font-funnel text-5xl sm:text-7xl font-bold text-zinc-900 uppercase tracking-tight leading-tight">
          ARC COMPLETE.
        </h1>

        <p className="mt-4 text-lg text-[#FF4500] font-mono-code font-bold uppercase tracking-wide max-w-xl mx-auto">
          "You started before January. And you finished."
        </p>

        {/* METRICS ROW */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mt-8 pt-8 border-t border-zinc-100">
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="text-3xl font-funnel font-bold text-zinc-900">90</div>
            <div className="text-[10px] font-mono-code text-zinc-500 font-bold">DAYS</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="text-3xl font-funnel font-bold text-[#FF4500]">{commitments.length}</div>
            <div className="text-[10px] font-mono-code text-zinc-500 font-bold">COMMITMENTS</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="text-3xl font-funnel font-bold text-[#FF4500]">94%</div>
            <div className="text-[10px] font-mono-code text-zinc-500 font-bold">COMPLETION</div>
          </div>
        </div>

        {/* ORIGINAL COMMITMENTS LIST */}
        <div className="mt-8 text-left max-w-md mx-auto space-y-2">
          <div className="text-[11px] font-mono-code text-[#FF4500] uppercase text-center mb-3 font-bold">
            VERIFIED PROOF OF COMMITMENTS
          </div>
          {commitments.map((comm) => (
            <div
              key={comm.id}
              className="p-3.5 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs font-semibold text-zinc-900 px-5"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#FF4500] font-bold">✓</span>
                <span>{comm.name}</span>
              </div>
              <span className="text-[10px] font-mono-code text-[#FF4500] font-bold">{comm.category || 'ARC'}</span>
            </div>
          ))}
        </div>

        {/* CTAS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="btn-wise-orange px-8 py-4 text-base font-semibold gap-2 w-full sm:w-auto"
          >
            <Share2 className="w-5 h-5 text-white" /> <span>Share My Completion Card</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="btn-wise-secondary px-8 py-4 text-base font-semibold gap-2 w-full sm:w-auto"
          >
            <ShieldCheck className="w-5 h-5 text-[#FF4500]" /> <span>View My Proof</span>
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
