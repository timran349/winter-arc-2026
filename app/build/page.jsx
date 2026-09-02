'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Flame,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Download,
  Share2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';

import { calculateEndDate, formatShortDate } from '@/src/utils/dates';
import { generateShareCardCanvas } from '@/src/utils/shareCardGenerator';
import { saveFreeContract, getFreeContract } from '@/src/utils/freeContract';
import { trackEvent, ANALYTICS_EVENTS } from '@/src/utils/analytics';

const SUGGESTED_COMMITMENTS = {
  BODY: ['Train', 'Walk', 'Run', 'Stretch', 'Sleep 7+ hours'],
  MIND: ['Read', 'Journal', 'Meditate', 'Learn'],
  FOCUS: ['Deep work', 'Study', 'No morning scrolling', 'Limit social media'],
  LIFE: ['Clean/reset', 'Cook', 'Personal project', 'Financial check-in']
};

const SUGGESTED_INTENTIONS = [
  'Get stronger',
  'Get focused',
  'Build something',
  'Become consistent',
  'Take control of my time'
];

export default function FreeContractBuilderPage() {
  const router = useRouter();

  // Builder Mode: 'form' | 'loading' | 'result'
  const [mode, setMode] = useState('form');
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [selectedCommitments, setSelectedCommitments] = useState([
    { id: '1', name: 'Train', category: 'BODY' },
    { id: '2', name: 'Read', category: 'MIND' },
    { id: '3', name: 'Deep work', category: 'FOCUS' },
    { id: '4', name: 'No morning scrolling', category: 'FOCUS' }
  ]);
  const [customInput, setCustomInput] = useState('');
  const [intention, setIntention] = useState('Get focused');
  const [customIntention, setCustomIntention] = useState('');

  // Calendar State for Step 3
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date(2026, 9, 1)); // Oct 2026

  // Simulated Generation State
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessageIndex, setGenerationMessageIndex] = useState(0);

  // Result / Lead Capture State
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSaved, setLeadSaved] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareDataUrl, setShareDataUrl] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.CONTRACT_BUILDER_STARTED);

    const saved = getFreeContract();
    if (saved) {
      setName(saved.name || '');
      setStartDate(saved.startDate || '2026-10-01');
      if (saved.commitments && saved.commitments.length >= 4) {
        setSelectedCommitments(saved.commitments);
      }
      setIntention(saved.intention || 'Get focused');
    }
  }, []);

  const endDate = calculateEndDate(startDate, 90);
  const isStep2Valid = selectedCommitments.length >= 4 && selectedCommitments.length <= 6;

  const isSelected = (nameStr) =>
    selectedCommitments.some(
      (c) => (c?.name || '').toLowerCase() === (nameStr || '').toLowerCase()
    );

  const toggleSuggested = (item, cat) => {
    if (isSelected(item)) {
      setSelectedCommitments((prev) =>
        prev.filter((c) => (c?.name || '').toLowerCase() !== (item || '').toLowerCase())
      );
    } else {
      if (selectedCommitments.length >= 6) return;
      setSelectedCommitments((prev) => [
        ...prev,
        { id: 'c_' + Date.now() + Math.random(), name: item, category: cat }
      ]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customInput.trim() || selectedCommitments.length >= 6) return;
    setSelectedCommitments((prev) => [
      ...prev,
      { id: 'c_' + Date.now(), name: customInput.trim(), category: 'CUSTOM' }
    ]);
    setCustomInput('');
  };

  const handleRemoveCommitment = (id) => {
    setSelectedCommitments((prev) => prev.filter((c) => c.id !== id));
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handleSelectDate = (year, month, day) => {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    setStartDate(`${year}-${mStr}-${dStr}`);
  };

  const handlePresetDate = (type) => {
    const today = new Date();
    if (type === 'official') {
      setStartDate('2026-10-01');
      setCurrentCalendarMonth(new Date(2026, 9, 1));
    } else if (type === 'today') {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setStartDate(`${year}-${month}-${day}`);
      setCurrentCalendarMonth(new Date(year, today.getMonth(), 1));
    } else if (type === 'tomorrow') {
      const tmrw = new Date(today);
      tmrw.setDate(today.getDate() + 1);
      const year = tmrw.getFullYear();
      const month = String(tmrw.getMonth() + 1).padStart(2, '0');
      const day = String(tmrw.getDate()).padStart(2, '0');
      setStartDate(`${year}-${month}-${day}`);
      setCurrentCalendarMonth(new Date(year, tmrw.getMonth(), 1));
    } else if (type === 'next_monday') {
      const nextMon = new Date(today);
      nextMon.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7));
      const year = nextMon.getFullYear();
      const month = String(nextMon.getMonth() + 1).padStart(2, '0');
      const day = String(nextMon.getDate()).padStart(2, '0');
      setStartDate(`${year}-${month}-${day}`);
      setCurrentCalendarMonth(new Date(year, nextMon.getMonth(), 1));
    }
  };

  const handleGenerateContract = () => {
    try {
      const finalIntention =
        intention === 'Create my own' ? customIntention || 'Become consistent' : intention;
      const finalName = name.trim() || 'Arc Traveler';

      const contractData = {
        name: finalName,
        startDate,
        endDate,
        duration: 90,
        intention: finalIntention,
        commitments: selectedCommitments
      };

      saveFreeContract(contractData);
      trackEvent(ANALYTICS_EVENTS.CONTRACT_GENERATED, {
        commitmentsCount: selectedCommitments.length,
        intention: finalIntention
      });

      if (typeof window !== 'undefined') {
        try {
          const url = generateShareCardCanvas({
            name: finalName,
            startDate,
            endDate,
            commitments: selectedCommitments,
            completedStats: { daysCompleted: 90, totalPercentage: 100 },
            intention: finalIntention,
            cardType: 'contract'
          });
          if (url) setShareDataUrl(url);
        } catch (canvasErr) {
          console.error('Canvas error:', canvasErr);
        }
      }

      setMode('loading');
      setGenerationProgress(0);
      setGenerationMessageIndex(0);

      const messages = [
        'Analyzing 90-day commitment trajectory...',
        'Calculating execution density & milestone dates...',
        'Forging official Arc 90 digital seal...',
        'Rendering 9:16 high-res poster card...'
      ];

      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 80);

      const msgInterval = setInterval(() => {
        setGenerationMessageIndex((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
        clearInterval(msgInterval);
        setMode('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 4100);
    } catch (err) {
      console.error('Error handling generate contract:', err);
      setMode('result');
    }
  };

  const handleDownloadCard = () => {
    if (!shareDataUrl) return;
    trackEvent(ANALYTICS_EVENTS.CONTRACT_DOWNLOADED);
    const a = document.createElement('a');
    a.href = shareDataUrl;
    a.download = `Arc_90_Contract_${(name || 'Arc').replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareCard = () => {
    trackEvent(ANALYTICS_EVENTS.CONTRACT_SHARED);
    setIsShareModalOpen(true);
  };

  const handleSaveLead = (e) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;
    setLeadSaved(true);
    trackEvent('lead_email_captured', { email: leadEmail });
  };

  const handleUnlockPaid = async () => {
    trackEvent(ANALYTICS_EVENTS.UPGRADE_CLICKED);
    trackEvent(ANALYTICS_EVENTS.CHECKOUT_STARTED);

    saveFreeContract({
      name: name.trim() || 'Arc Traveler',
      startDate,
      endDate,
      duration: 90,
      intention: intention === 'Create my own' ? customIntention || 'Become consistent' : intention,
      commitments: selectedCommitments
    });

    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();

      if (data.user && data.user.accessStatus === 'PAID') {
        router.push('/dashboard');
        return;
      }
      router.push('/unlock');
    } catch (err) {
      router.push('/unlock');
    }
  };

  const handleUpgradeToPaid = handleUnlockPaid;

  const loadingMessages = [
    'Analyzing 90-day commitment trajectory...',
    'Calculating execution density & milestone dates...',
    'Forging official Arc 90 digital seal...',
    'Rendering 9:16 high-res poster card...'
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-[#FF4500] selection:text-white font-sans">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 text-[#FF4500]" />
            </div>
            <div>
              <span className="font-fraunces text-lg tracking-tight font-medium text-zinc-900">
                Arc 90
              </span>
              <span className="text-[10px] font-mono-code text-[#FF4500] block -mt-1 tracking-widest uppercase font-semibold">
                BUILDER
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 px-4 py-2 rounded-full hover:bg-zinc-100 transition-all"
            >
              Sign In
            </Link>
            <button
              onClick={handleUnlockPaid}
              className="btn-wise-primary text-xs px-5 py-2 font-medium"
            >
              Unlock $19 System
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        {mode === 'form' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: INTERACTIVE BUILDER FORM */}
            <div className="lg:col-span-7 card-wise p-6 sm:p-10 space-y-6 bg-white border border-zinc-200/80 shadow-[0_20px_60px_-20px_rgba(24,24,27,0.06)]">
              {/* Progress Bar */}
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      s <= step ? 'bg-[#FF4500]' : 'bg-zinc-200'
                    }`}
                  />
                ))}
              </div>

              {/* STEP 1: NAME */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-mono-code text-[#FF4500] font-bold uppercase tracking-widest">
                      STEP 01 OF 04
                    </span>
                    <h1 className="font-funnel text-4xl sm:text-5xl font-semibold uppercase tracking-tight leading-[0.95] text-zinc-900 mt-1">
                      Build your Arc 90.
                    </h1>
                    <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-2">
                      Pick what you're committing to before January. Free. Takes 30 seconds.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-zinc-600 mb-2 uppercase font-mono-code">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your name (e.g. Alex)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-full px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FF4500] font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      className="btn-wise-primary px-6 py-3.5 text-xs font-semibold gap-2"
                    >
                      <span>Next: Choose Commitments</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: COMMITMENTS */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-code text-[#FF4500] font-bold uppercase tracking-widest">
                        STEP 02 OF 04
                      </span>
                      <span
                        className={`text-xs font-mono-code font-bold px-2.5 py-0.5 rounded-full ${
                          isStep2Valid
                            ? 'bg-[#FF4500]/10 text-[#FF4500]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {selectedCommitments.length}/6 selected (min 4)
                      </span>
                    </div>
                    <h2 className="font-funnel text-3xl sm:text-4xl font-semibold uppercase leading-[0.95] text-zinc-900 mt-1">
                      Choose non-negotiables
                    </h2>
                    <p className="text-zinc-500 text-xs font-medium mt-1">
                      Select 4 to 6 commitments to execute for 90 days.
                    </p>
                  </div>

                  {/* Selected Pills */}
                  {selectedCommitments.length > 0 && (
                    <div className="p-4 sm:p-5 rounded-[20px] bg-zinc-50 border border-zinc-200/80 space-y-2">
                      <div className="text-[10px] font-mono-code text-zinc-400 font-bold uppercase tracking-wider">
                        YOUR 90-DAY CONTRACT ITEMS ({selectedCommitments.length})
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {selectedCommitments.map((comm) => (
                          <div
                            key={comm.id}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30 text-xs font-semibold"
                          >
                            <span>{comm.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCommitment(comm.id)}
                              className="hover:text-red-500 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Grid */}
                  <div className="space-y-4 pt-1">
                    {Object.entries(SUGGESTED_COMMITMENTS).map(([catKey, items]) => (
                      <div key={catKey} className="space-y-2">
                        <div className="text-[11px] font-mono-code text-[#FF4500] font-bold uppercase tracking-wider">
                          {catKey}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {items.map((item) => {
                            const active = isSelected(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => toggleSuggested(item, catKey)}
                                disabled={!active && selectedCommitments.length >= 6}
                                className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-150 ${
                                  active
                                    ? 'bg-[#FF4500] text-white shadow-sm'
                                    : 'bg-zinc-50 text-zinc-700 border border-zinc-200 hover:border-zinc-400 hover:bg-white disabled:opacity-40'
                                }`}
                              >
                                {active ? '✓ ' : '+ '}
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom Add */}
                  <form onSubmit={handleAddCustom} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="+ Create your own commitment..."
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      disabled={selectedCommitments.length >= 6}
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-full px-5 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FF4500] disabled:opacity-50 font-medium"
                    />
                    <button
                      type="submit"
                      disabled={!customInput.trim() || selectedCommitments.length >= 6}
                      className="btn-wise-secondary px-5 py-2.5 text-xs font-semibold gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#FF4500]" /> Add
                    </button>
                  </form>

                  {!isStep2Valid && (
                    <div className="flex items-center gap-2 text-amber-600 text-xs font-mono-code font-bold">
                      <AlertCircle className="w-4 h-4" /> Please select between 4 and 6 commitments to continue.
                    </div>
                  )}

                  <div className="pt-2 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="btn-wise-secondary px-5 py-2.5 text-xs font-semibold gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-[#FF4500]" /> Back
                    </button>

                    <button
                      disabled={!isStep2Valid}
                      onClick={() => setStep(3)}
                      className="btn-wise-primary px-6 py-3.5 text-xs font-semibold gap-2"
                    >
                      <span>Next: Start Date</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: START DATE */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-mono-code text-[#FF4500] font-bold uppercase tracking-widest">
                      STEP 03 OF 04
                    </span>
                    <h2 className="font-funnel text-3xl sm:text-4xl font-semibold uppercase leading-[0.95] text-zinc-900 mt-1">
                      When do you start?
                    </h2>
                    <p className="text-zinc-500 text-xs font-medium mt-1">
                      Select your launch date from quick presets or the calendar grid below.
                    </p>
                  </div>

                  {/* PRESET CHIPS */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono-code text-zinc-500 font-bold uppercase">
                      Quick Launch Presets:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handlePresetDate('official')}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                          startDate === '2026-10-01'
                            ? 'bg-[#FF4500] text-white scale-105'
                            : 'bg-zinc-50 text-zinc-700 border border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        🗓️ Official Launch (Oct 1, 2026)
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePresetDate('today')}
                        className="px-3.5 py-2 rounded-full text-xs font-bold bg-zinc-50 text-zinc-700 border border-zinc-200 hover:border-zinc-300"
                      >
                        ⚡ Today
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePresetDate('tomorrow')}
                        className="px-3.5 py-2 rounded-full text-xs font-bold bg-zinc-50 text-zinc-700 border border-zinc-200 hover:border-zinc-300"
                      >
                        🚀 Tomorrow
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePresetDate('next_monday')}
                        className="px-3.5 py-2 rounded-full text-xs font-bold bg-zinc-50 text-zinc-700 border border-zinc-200 hover:border-zinc-300"
                      >
                        🎯 Next Monday
                      </button>
                    </div>
                  </div>

                  {/* INTERACTIVE CALENDAR SELECTOR */}
                  <div className="p-5 rounded-[20px] bg-zinc-50 border border-zinc-200/80 space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-[#FF4500]" />
                        <span className="text-xs font-mono-code text-zinc-900 font-extrabold uppercase">
                          {currentCalendarMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentCalendarMonth(
                              new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1)
                            )
                          }
                          className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-600 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentCalendarMonth(
                              new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1)
                            )
                          }
                          className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-600 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center font-mono-code text-[10px] text-zinc-400 font-bold">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <div key={i} className="py-1">{day}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({
                        length: getFirstDayOfMonth(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth())
                      }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="h-9" />
                      ))}

                      {Array.from({
                        length: getDaysInMonth(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth())
                      }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const yr = currentCalendarMonth.getFullYear();
                        const mo = currentCalendarMonth.getMonth();
                        const mStr = String(mo + 1).padStart(2, '0');
                        const dStr = String(dayNum).padStart(2, '0');
                        const dateString = `${yr}-${mStr}-${dStr}`;
                        const isCurrentSelected = dateString === startDate;

                        return (
                          <button
                            key={dayNum}
                            type="button"
                            onClick={() => handleSelectDate(yr, mo, dayNum)}
                            className={`h-9 rounded-full text-xs font-mono-code font-bold transition-all flex items-center justify-center ${
                              isCurrentSelected
                                ? 'bg-[#FF4500] text-white scale-105 shadow-sm'
                                : 'bg-white text-zinc-800 border border-zinc-200 hover:border-[#FF4500]/50 hover:text-zinc-900'
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 rounded-[20px] bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-zinc-500 font-mono-code uppercase font-bold">Calculated Trajectory</div>
                      <div className="text-2xl font-bold text-zinc-900 font-funnel uppercase">
                        {formatShortDate(startDate)} → {formatShortDate(endDate)}
                      </div>
                    </div>
                    <div className="text-right font-mono-code text-xs text-[#FF4500] font-bold">
                      90 DAYS
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="btn-wise-secondary px-5 py-2.5 text-xs font-semibold gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-[#FF4500]" /> Back
                    </button>

                    <button
                      onClick={() => setStep(4)}
                      className="btn-wise-primary px-6 py-3.5 text-xs font-semibold gap-2"
                    >
                      <span>Next: Intent & Purpose</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: INTENTION */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-mono-code text-[#FF4500] font-bold uppercase tracking-widest">
                      STEP 04 OF 04
                    </span>
                    <h2 className="font-funnel text-3xl sm:text-4xl font-semibold uppercase leading-[0.95] text-zinc-900 mt-1">
                      Why are you doing this?
                    </h2>
                    <p className="text-zinc-500 text-xs font-medium mt-1">
                      Select your core intent for this 90-day run.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {SUGGESTED_INTENTIONS.map((item) => {
                      const active = intention === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setIntention(item)}
                          className={`w-full p-4 rounded-2xl border text-left text-xs font-semibold transition-all duration-200 flex items-center justify-between active:scale-[0.99] ${
                            active
                              ? 'bg-[#FF4500]/10 border-[#FF4500] text-zinc-900 shadow-sm'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(24,24,27,0.06)]'
                          }`}
                        >
                          <span>"{item}"</span>
                          {active && <Check className="w-4 h-4 text-[#FF4500]" />}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setIntention('Create my own')}
                      className={`w-full p-4 rounded-2xl border text-left text-xs font-semibold transition-all duration-200 flex items-center justify-between active:scale-[0.99] ${
                        intention === 'Create my own'
                          ? 'bg-[#FF4500]/10 border-[#FF4500] text-zinc-900 shadow-sm'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(24,24,27,0.06)]'
                      }`}
                    >
                      <span>+ Create my own intention</span>
                      {intention === 'Create my own' && <Check className="w-4 h-4 text-[#FF4500]" />}
                    </button>

                    {intention === 'Create my own' && (
                      <input
                        type="text"
                        placeholder="Type your personal intention..."
                        value={customIntention}
                        onChange={(e) => setCustomIntention(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-full px-5 py-3 text-xs text-zinc-900 focus:outline-none focus:border-[#FF4500] font-medium"
                      />
                    )}
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      onClick={() => setStep(3)}
                      className="btn-wise-secondary px-5 py-2.5 text-xs font-semibold gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-[#FF4500]" /> Back
                    </button>

                    <button
                      onClick={handleGenerateContract}
                      className="btn-wise-orange px-8 py-4 text-xs font-semibold gap-2 shadow-lg"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>GENERATE MY CONTRACT</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: LIVE CONTRACT CARD PREVIEW */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="text-xs font-mono-code text-[#FF4500] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse" />
                LIVE PREVIEW
              </div>

              <div className="card-wise p-6 sm:p-8 space-y-6 bg-white border border-zinc-200/80 shadow-[0_20px_60px_-20px_rgba(24,24,27,0.08)] relative overflow-hidden rounded-2xl">
                <div className="text-center border-b border-zinc-100 pb-5">
                  <div className="font-mono-code text-xs text-[#FF4500] tracking-widest font-bold uppercase mb-1">
                    ARC 90
                  </div>
                  <div className="font-funnel text-3xl font-bold text-zinc-900 uppercase tracking-tight">
                    {name.trim() || 'YOUR NAME'}
                  </div>
                  <div className="font-mono-code text-xs text-zinc-500 font-bold mt-2 flex items-center justify-center gap-2">
                    <span>{formatShortDate(startDate)}</span>
                    <span className="text-[#FF4500]">→</span>
                    <span>{formatShortDate(endDate)}</span>
                  </div>
                  <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30 text-[10px] font-mono-code font-extrabold uppercase">
                    90 DAYS
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono-code text-[#FF4500] font-bold uppercase tracking-wider mb-3 text-center">
                    PROMISED COMMITMENTS
                  </div>
                  <div className="space-y-2">
                    {selectedCommitments.map((comm) => (
                      <div
                        key={comm.id}
                        className="p-3 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs font-bold text-zinc-800 px-4"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[#FF4500] font-black">✓</span>
                          <span className="uppercase">{comm.name}</span>
                        </div>
                        {comm.category && (
                          <span className="text-[9px] font-mono-code text-[#FF4500] font-bold">
                            {comm.category}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {intention && (
                  <div className="text-center italic text-xs text-[#FF4500] font-mono-code font-bold uppercase">
                    "{intention === 'Create my own' ? customIntention || 'Become consistent' : intention}"
                  </div>
                )}

                <div className="text-center pt-4 border-t border-zinc-100">
                  <div className="font-fraunces text-xs font-medium text-zinc-900 tracking-tight">
                    Start before January. Finish with proof.
                  </div>
                  <div className="font-funnel text-sm font-bold text-[#FF4500] uppercase tracking-wide mt-0.5">
                    ARC 90
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : mode === 'loading' ? (
          /* SIMULATED GENERATION SCREEN */
          <div className="max-w-xl mx-auto py-16 text-center space-y-8 card-wise p-8 sm:p-12 bg-white border border-zinc-200/80 shadow-[0_30px_80px_-30px_rgba(24,24,27,0.12)]">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full bg-[#FF4500]/20 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-[#FF4500] text-white flex items-center justify-center shadow-lg">
                <Flame className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-mono-code text-xs text-[#FF4500] font-black uppercase tracking-widest">
                GENERATING CONTRACT
              </div>
              <h2 className="font-funnel text-3xl sm:text-4xl font-bold text-zinc-900 uppercase leading-[0.95]">
                Forging your Arc 90...
              </h2>
              <p className="text-xs font-mono-code text-zinc-500 h-6 font-bold flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-[#FF4500] animate-spin" />
                <span>{loadingMessages[generationMessageIndex]}</span>
              </p>
            </div>

            {/* SaaS Progress Bar */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200">
                <div
                  className="h-full bg-[#FF4500] rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono-code text-zinc-400 font-semibold px-1">
                <span>Rendering High-Res Poster</span>
                <span className="text-[#FF4500] font-bold">{generationProgress}%</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 space-y-2 text-left max-w-sm mx-auto">
              {[
                'Verifying non-negotiable count (4-6)',
                'Calculating 90-day timeline & end date',
                'Generating shareable 9:16 Instagram Story card'
              ].map((msg, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-zinc-600 font-medium">
                  <span className="text-[#FF4500] font-bold">✓</span>
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* RESULT / DOWNLOAD / UPGRADE SCREEN */
          <div className="max-w-4xl mx-auto space-y-8 py-4">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30 font-mono-code text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4500]" />
                <span>ARC 90 CONTRACT GENERATED</span>
              </div>

              <h1 className="font-funnel text-4xl sm:text-6xl font-bold uppercase tracking-tight text-zinc-900 leading-[0.95]">
                YOUR ARC IS FORGED.
              </h1>

              <p className="text-sm text-zinc-500 font-medium max-w-md mx-auto">
                Download your official Arc 90 contract card or unlock full 90-day tracking access.
              </p>
            </div>

            {/* ACTION CARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* LEFT: CONTRACT CARD DOWNLOAD & SHARE */}
              <div className="card-wise p-6 sm:p-8 space-y-6 bg-white border border-zinc-200/80 shadow-[0_20px_60px_-20px_rgba(24,24,27,0.08)]">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <div>
                    <h3 className="font-funnel text-xl font-bold text-zinc-900 uppercase">
                      Official Contract Card
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono-code">9:16 Instagram & TikTok Format</p>
                  </div>
                  <button
                    onClick={() => setMode('form')}
                    className="text-xs font-mono-code text-[#FF4500] hover:underline font-bold"
                  >
                    Edit Contract
                  </button>
                </div>

                {shareDataUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-md max-w-xs mx-auto">
                    <img
                      src={shareDataUrl}
                      alt="Arc 90 Contract Card"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleDownloadCard}
                    className="btn-wise-primary w-full py-4 text-xs font-semibold gap-2"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>DOWNLOAD CONTRACT CARD (PNG)</span>
                  </button>

                  <button
                    onClick={handleShareCard}
                    className="btn-wise-secondary w-full py-3.5 text-xs font-semibold gap-2"
                  >
                    <Share2 className="w-4 h-4 text-[#FF4500]" />
                    <span>SHARE TO INSTAGRAM STORIES / TIKTOK</span>
                  </button>
                </div>
              </div>

              {/* RIGHT: UPGRADE TO $19 SYSTEM */}
              <div className="card-wise p-6 sm:p-8 space-y-6 bg-white border-2 border-[#FF4500] shadow-[0_20px_60px_-15px_rgba(255,69,0,0.12)]">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#FF4500] text-white text-[10px] font-mono-code font-bold uppercase mb-2">
                    RECOMMENDED NEXT STEP
                  </div>
                  <h3 className="font-funnel text-2xl font-bold text-zinc-900 uppercase leading-tight">
                    Unlock the 90-Day System
                  </h3>
                  <div className="text-3xl font-funnel font-bold text-[#FF4500] mt-1">$19 <span className="text-xs font-mono-code text-zinc-400 uppercase font-bold">ONE TIME</span></div>
                </div>

                <div className="space-y-3 border-t border-zinc-100 pt-4">
                  {[
                    'Interactive daily check-in dashboard',
                    'Missed day tracking & consistency analytics',
                    '7-day reflection & weekly review log',
                    'Verified Day 90 completion certificate proof'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700 font-medium">
                      <Check className="w-4 h-4 text-[#FF4500] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleUpgradeToPaid}
                  className="btn-wise-orange w-full py-4 text-xs font-semibold gap-2 shadow-md"
                >
                  <span>START MY 90 DAYS — $19</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200/60 py-6 text-center text-xs text-zinc-500 font-mono-code">
        ARC 90 • START BEFORE JANUARY. FINISH WITH PROOF.
      </footer>
    </div>
  );
}
