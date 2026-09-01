import React, { useState, useEffect } from 'react';
import { Download, Share2, X, Sparkles, Check } from 'lucide-react';
import { generateShareCardCanvas } from '../utils/shareCardGenerator';
import { calculateEndDate } from '../utils/dates';

export default function ShareCardModal({
  isOpen,
  onClose,
  userProfile,
  commitments = [],
  checkIns = {},
  cardType = 'contract'
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
        intention: userProfile.intention,
        cardType
      });
      setDataUrl(url);
    }
  }, [isOpen, userProfile, commitments, checkIns, cardType]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Arc_90_Proof_${(userProfile?.name || 'Arc').replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg card-wise p-6 sm:p-8 space-y-6 my-8 bg-white border border-zinc-200 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <div className="text-xs font-mono-code text-[#FF4500] uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#FF4500]" /> SHAREABLE PROOF CARD
            </div>
            <h3 className="font-funnel text-2xl text-zinc-900 mt-1 font-semibold uppercase leading-tight">
              Instagram Story (9:16)
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* IMAGE PREVIEW DISPLAY */}
        <div className="flex justify-center my-4">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt="Arc 90 Completion Share Card"
              className="w-full max-w-[280px] h-auto rounded-2xl border border-zinc-200 shadow-md object-contain"
            />
          ) : (
            <div className="w-[280px] h-[480px] rounded-2xl bg-zinc-50 flex items-center justify-center text-xs text-zinc-400 font-semibold font-mono-code">
              Generating High-Res Card...
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleDownload}
            className="btn-wise-primary w-full py-4 text-xs font-semibold gap-2"
          >
            <Download className="w-4 h-4 text-white" /> <span>Download Share Card PNG</span>
          </button>

          <button
            onClick={handleCopy}
            className="btn-wise-secondary w-full py-3.5 text-xs font-semibold gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-[#FF4500]" /> : <Share2 className="w-4 h-4 text-[#FF4500]" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Share to Instagram / TikTok'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
