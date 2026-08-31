import React, { useState, useEffect } from 'react';
import { Download, Share2, X, Sparkles, Check } from 'lucide-react';
import { generateShareCardCanvas } from '../utils/shareCardGenerator';
import { calculateEndDate } from '../utils/dates';

export default function ShareCardModal({
  isOpen,
  onClose,
  userProfile,
  commitments = [],
  checkIns = {}
}) {
  const [dataUrl, setDataUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && userProfile) {
      const endDateStr = calculateEndDate(userProfile.startDate, 90);
      const url = generateShareCardCanvas({
        name: userProfile.name,
        startDate: userProfile.startDate,
        endDate: endDateStr,
        commitments,
        completedStats: { daysCompleted: 90, totalPercentage: 94 },
        intention: userProfile.intention
      });
      setDataUrl(url);
    }
  }, [isOpen, userProfile, commitments, checkIns]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Winter_Arc_Proof_${(userProfile?.name || 'Arc').replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f1117] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <div className="text-xs font-mono-code text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> SHAREABLE PROOF CARD
            </div>
            <h3 className="font-editorial text-2xl text-slate-100 mt-0.5 font-normal">
              Instagram Story (9:16)
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* IMAGE PREVIEW DISPLAY */}
        <div className="flex justify-center my-4">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt="Winter Arc Completion Share Card"
              className="w-full max-w-[280px] h-auto rounded-2xl border border-white/15 shadow-[0_0_30px_rgba(56,189,248,0.2)] object-contain"
            />
          ) : (
            <div className="w-[280px] h-[480px] rounded-2xl bg-slate-900 flex items-center justify-center text-xs text-slate-500">
              Generating High-Res Card...
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleDownload}
            className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-[0_0_25px_rgba(56,189,248,0.4)] flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Share Card PNG
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-slate-400" />}
            {copied ? 'Copied to Clipboard!' : 'Share to Instagram / TikTok'}
          </button>
        </div>
      </div>
    </div>
  );
}
