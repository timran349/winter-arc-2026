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

  // Handlers for commitments
  const isSelected = (nameStr) =>
    selectedCommitments.some((c) => c.name.toLowerCase() === nameStr.toLowerCase());

  const toggleSuggested = (item, cat) => {
    if (isSelected(item)) {
      setSelectedCommitments((prev) =>
        prev.filter((c) => c.name.toLowerCase() !== item.toLowerCase())
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

  // Calendar Helpers for Step 3
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Mon = 0
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

  // Simulated Contract Generation Flow (2.5 seconds SaaS loading sequence)
  const handleGenerateContract = () => {
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

    // Render share card canvas URL (cardType: 'contract')
    const url = generateShareCardCanvas({
      name: finalName,
      startDate,
      endDate,
      commitments: selectedCommitments,
      completedStats: { daysCompleted: 90, totalPercentage: 100 },
      intention: finalIntention,
      cardType: 'contract'
    });
    setShareDataUrl(url);

    // Switch to Simulated Loading Mode
    setMode('loading');
    setGenerationProgress(0);
    setGenerationMessageIndex(0);

    // Simulated Contract Generation Flow (4.0 seconds SaaS loading sequence)
    const messages = [
      'Analyzing 90-day commitment trajectory...',
      'Calculating execution density & milestone dates...',
      'Forging official Winter Arc 2026 digital seal...',
      'Rendering 9:16 high-res poster card...'
    ];

    // Progress timer over 4000ms (4 seconds)
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

    // Transition to Result Screen at 4000ms (4 seconds)
    setTimeout(() => {
      clearInterval(interval);
      clearInterval(msgInterval);
      setMode('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 4100);
  };

  // Download contract image
  const handleDownloadCard = () => {
    if (!shareDataUrl) return;
    trackEvent(ANALYTICS_EVENTS.CONTRACT_DOWNLOADED);
    const a = document.createElement('a');
    a.href = shareDataUrl;
    a.download = `Winter_Arc_Contract_${(name || 'Arc').replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Directly open Instagram Story Card Modal (no OS share popup)
  const handleShareCard = () => {
    trackEvent(ANALYTICS_EVENTS.CONTRACT_SHARED);
    setIsShareModalOpen(true);
  };

  // Lead Email Save
  const handleSaveLead = (e) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;
    setLeadSaved(true);
    trackEvent('lead_email_captured', { email: leadEmail });
  };

  // Paid Upgrade Flow
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

      if (data.user) {
        if (data.user.accessStatus === 'PAID') {
          router.push('/dashboard');
          return;
        }
        router.push('/unlock');
      } else {
        router.push('/signup?redirect=/unlock');
      }
    } catch (err) {
      router.push('/signup?redirect=/unlock');
    }
  };

  const loadingMessages = [
    'Analyzing 90-day commitment trajectory...',
    'Calculating execution density & milestone dates...',
    'Forging official Winter Arc 2026 digital seal...',
    'Rendering 9:16 high-res poster card...'
  ];

  return (
    <div className="min-h-screen bg-[#0b0c0a] text-slate-100 flex flex-col justify-between">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0b0c0a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#9fe870] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 text-[#163300]" />
            </div>
            <div>
              <span className="font-editorial text-lg tracking-tight font-black text-slate-100">
                WINTER ARC 90
              </span>
              <span className="text-[10px] font-mono-code text-[#9fe870] block -mt-1 tracking-widest uppercase font-bold">
                FREE CONTRACT BUILDER
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded-full hover:bg-white/[0.05] transition-all"
            >
              Sign In
            </Link>
            <button
              onClick={handleUnlockPaid}
              className="btn-wise-primary text-xs px-5 py-2"
            >
              Unlock $19 System
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        {mode === 'form' ? (
          /* ====================================================================
             BUILDER FORM MODE (WITH LIVE CONTRACT PREVIEW)
             ==================================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: INTERACTIVE BUILDER FORM */}
            <div className="lg:col-span-7 card-wise p-6 sm:p-10 space-y-6">
              {/* Progress Bar */}
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      s <= step ? 'bg-[#9fe870]' : 'bg-white/[0.08]'
                    }`}
                  />
                ))}
              </div>

              {/* STEP 1: NAME */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-widest">
                      STEP 01 OF 04
                    </span>
                    <h1 className="font-display-wise text-4xl sm:text-5xl font-black uppercase tracking-tight leading-[0.85] text-slate-100 mt-1">
                      Build your Winter Arc.
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-sm font-semibold mt-2">
                      Pick what you're committing to before January. Free. Takes 30 seconds.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2 uppercase font-mono-code">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your name (e.g. Alex)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#161813] border border-white/10 rounded-full px-5 py-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870] font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      className="btn-wise-primary px-8 py-3.5 text-sm font-extrabold gap-2"
                    >
                      <span>Next: Commitments</span>
                      <ArrowRight className="w-4 h-4 text-[#163300]" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: COMMITMENTS */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-widest">
                        STEP 02 OF 04
                      </span>
                      <span
                        className={`text-xs font-mono-code px-3 py-1 rounded-full font-bold ${
                          isStep2Valid
                            ? 'bg-[#e2f6d5] text-[#163300]'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {selectedCommitments.length} / 6 SELECTED (MIN 4)
                      </span>
                    </div>
                    <h2 className="font-display-wise text-3xl sm:text-4xl font-black uppercase leading-[0.88] text-slate-100 mt-1">
                      What are you committing to?
                    </h2>
                    <p className="text-slate-300 text-xs font-semibold mt-1">
                      Choose 4–6 things you want to show up for.
                    </p>
                  </div>

                  {/* Selected Commitments Chips */}
                  <div className="p-4 sm:p-5 rounded-[24px] bg-[#161813] border border-white/[0.08] space-y-2">
                    <div className="text-xs font-mono-code text-[#9fe870] font-bold uppercase">
                      Selected Commitments ({selectedCommitments.length} / 6):
                    </div>
                    {selectedCommitments.length === 0 && (
                      <div className="text-xs text-slate-400 italic font-semibold">
                        No commitments selected yet. Choose 4–6 below.
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedCommitments.map((item) => (
                        <span
                          key={item.id}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e2f6d5] text-[#163300] text-xs font-bold"
                        >
                          <span>✓ {item.name}</span>
                          <button
                            onClick={() => handleRemoveCommitment(item.id)}
                            className="hover:text-red-600 transition-colors"
                          >
                            <X className="w-3.5 h-3.5 text-[#163300]" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Category Options */}
                  <div className="space-y-4 max-h-[260px] overflow-y-auto pr-2">
                    {Object.entries(SUGGESTED_COMMITMENTS).map(([cat, list]) => (
                      <div key={cat}>
                        <div className="text-[11px] font-mono-code text-[#9fe870] font-bold mb-2 uppercase">
                          {cat}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {list.map((item) => {
                            const active = isSelected(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => toggleSuggested(item, cat)}
                                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                                  active
                                    ? 'bg-[#9fe870] text-[#163300] scale-105'
                                    : 'bg-[#161813] text-slate-300 border border-white/[0.08] hover:border-white/20'
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

                  {/* Custom Commitment Add */}
                  <form onSubmit={handleAddCustom} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="+ Create your own commitment..."
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      disabled={selectedCommitments.length >= 6}
                      className="flex-1 bg-[#161813] border border-white/10 rounded-full px-5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870] disabled:opacity-50 font-medium"
                    />
                    <button
                      type="submit"
                      disabled={!customInput.trim() || selectedCommitments.length >= 6}
                      className="btn-wise-secondary px-5 py-2.5 text-xs font-bold gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#9fe870]" /> Add
                    </button>
                  </form>

                  {!isStep2Valid && (
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-mono-code font-bold">
                      <AlertCircle className="w-4 h-4" /> Please select between 4 and 6 commitments to continue.
                    </div>
                  )}

                  <div className="pt-2 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="btn-wise-secondary px-5 py-2.5 text-xs font-bold gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-[#9fe870]" /> Back
                    </button>

                    <button
                      disabled={!isStep2Valid}
                      onClick={() => setStep(3)}
                      className="btn-wise-primary px-6 py-3 text-xs font-extrabold gap-2"
                    >
                      <span>Next: Start Date</span>
                      <ArrowRight className="w-4 h-4 text-[#163300]" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: START DATE WITH INTERACTIVE VISUAL CALENDAR SELECTOR */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-widest">
                      STEP 03 OF 04
                    </span>
                    <h2 className="font-display-wise text-3xl sm:text-4xl font-black uppercase leading-[0.88] text-slate-100 mt-1">
                      When do you start?
                    </h2>
                    <p className="text-slate-300 text-xs font-semibold mt-1">
                      Select your launch date from quick presets or the calendar grid below.
                    </p>
                  </div>

                  {/* PRESET CHIPS */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono-code text-slate-400 font-bold uppercase">
                      Quick Launch Presets:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handlePresetDate('official')}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                          startDate === '2026-10-01'
                            ? 'bg-[#9fe870] text-[#163300] scale-105'
                            : 'bg-[#161813] text-slate-300 border border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        🗓️ Official Launch (Oct 1, 2026)
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePresetDate('today')}
                        className="px-3.5 py-2 rounded-full text-xs font-bold bg-[#161813] text-slate-300 border border-white/[0.08] hover:border-white/20"
                      >
                        ⚡ Today
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePresetDate('tomorrow')}
                        className="px-3.5 py-2 rounded-full text-xs font-bold bg-[#161813] text-slate-300 border border-white/[0.08] hover:border-white/20"
                      >
                        🚀 Tomorrow
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePresetDate('next_monday')}
                        className="px-3.5 py-2 rounded-full text-xs font-bold bg-[#161813] text-slate-300 border border-white/[0.08] hover:border-white/20"
                      >
                        🎯 Next Monday
                      </button>
                    </div>
                  </div>

                  {/* VISUAL INTERACTIVE CALENDAR GRID WIDGET */}
                  <div className="p-5 rounded-[24px] bg-[#161813] border border-white/[0.08] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-[#9fe870]" />
                        <span className="text-xs font-mono-code text-slate-100 font-extrabold uppercase">
                          {currentCalendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
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
                          className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200"
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
                          className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* WEEKDAY HEADERS */}
                    <div className="grid grid-cols-7 gap-1 text-center font-mono-code text-[10px] text-slate-500 font-bold">
                      <div>MON</div>
                      <div>TUE</div>
                      <div>WED</div>
                      <div>THU</div>
                      <div>FRI</div>
                      <div>SAT</div>
                      <div>SUN</div>
                    </div>

                    {/* CALENDAR DAYS */}
                    <div className="grid grid-cols-7 gap-1.5">
                      {/* Empty leading padding days */}
                      {Array.from({
                        length: getFirstDayOfMonth(
                          currentCalendarMonth.getFullYear(),
                          currentCalendarMonth.getMonth()
                        )
                      }).map((_, i) => (
                        <div key={'empty_' + i} className="h-8" />
                      ))}

                      {/* Month Days */}
                      {Array.from({
                        length: getDaysInMonth(
                          currentCalendarMonth.getFullYear(),
                          currentCalendarMonth.getMonth()
                        )
                      }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const year = currentCalendarMonth.getFullYear();
                        const month = currentCalendarMonth.getMonth();
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        const isSelectedDate = startDate === dateStr;

                        return (
                          <button
                            key={'day_' + dayNum}
                            type="button"
                            onClick={() => handleSelectDate(year, month, dayNum)}
                            className={`h-8 rounded-full text-xs font-mono-code font-bold transition-all flex items-center justify-center ${
                              isSelectedDate
                                ? 'bg-[#9fe870] text-[#163300] scale-110 shadow-md'
                                : 'bg-[#0b0c0a] text-slate-300 border border-white/[0.05] hover:border-[#9fe870]/50 hover:text-white'
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* COMPUTED TRAJECTORY summary */}
                  <div className="p-5 rounded-[24px] bg-[#161813] border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-mono-code uppercase font-bold">Calculated Trajectory</div>
                      <div className="text-2xl font-black text-slate-100 font-display-wise uppercase">
                        90 DAYS
                      </div>
                    </div>
                    <div className="text-right font-mono-code text-xs text-[#9fe870] font-bold">
                      {formatShortDate(startDate)} → {formatShortDate(endDate)}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="btn-wise-secondary px-5 py-2.5 text-xs font-bold gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-[#9fe870]" /> Back
                    </button>

                    <button
                      onClick={() => setStep(4)}
                      className="btn-wise-primary px-6 py-3 text-xs font-extrabold gap-2"
                    >
                      <span>Next: Intention</span>
                      <ArrowRight className="w-4 h-4 text-[#163300]" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: OPTIONAL INTENTION & GENERATE */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-widest">
                      STEP 04 OF 04 • INTENTION (OPTIONAL)
                    </span>
                    <h2 className="font-display-wise text-3xl sm:text-4xl font-black uppercase leading-[0.88] text-slate-100 mt-1">
                      What is this Arc about?
                    </h2>
                    <p className="text-slate-300 text-xs font-semibold mt-1">
                      Select a statement to keep you anchored for 90 days.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {SUGGESTED_INTENTIONS.map((opt) => {
                      const active = intention === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setIntention(opt)}
                          className={`w-full p-4 rounded-full text-left border transition-all flex items-center justify-between px-6 ${
                            active
                              ? 'bg-[#9fe870]/10 border-[#9fe870]/50 text-slate-100 scale-105'
                              : 'bg-[#161813] border-white/[0.08] text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <span className="text-xs font-bold">{opt}</span>
                          {active && <Check className="w-4 h-4 text-[#9fe870]" />}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setIntention('Create my own')}
                      className={`w-full p-4 rounded-full text-left border transition-all flex items-center justify-between px-6 ${
                        intention === 'Create my own'
                          ? 'bg-[#9fe870]/10 border-[#9fe870]/50 text-slate-100 scale-105'
                          : 'bg-[#161813] border-white/[0.08] text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold">+ Create my own</span>
                      {intention === 'Create my own' && <Check className="w-4 h-4 text-[#9fe870]" />}
                    </button>

                    {intention === 'Create my own' && (
                      <input
                        type="text"
                        placeholder="Enter your custom intention..."
                        value={customIntention}
                        onChange={(e) => setCustomIntention(e.target.value)}
                        className="w-full bg-[#161813] border border-white/10 rounded-full px-5 py-3 text-xs text-slate-100 focus:outline-none focus:border-[#9fe870] font-medium"
                      />
                    )}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setStep(3)}
                      className="btn-wise-secondary px-5 py-2.5 text-xs font-bold gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-[#9fe870]" /> Back
                    </button>

                    <button
                      onClick={handleGenerateContract}
                      className="btn-wise-primary px-8 py-3.5 text-sm font-black gap-2 shadow-[0_0_30px_rgba(159,232,112,0.4)]"
                    >
                      <Sparkles className="w-4 h-4 text-[#163300]" /> <span>Generate My Arc</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: LIVE CONTRACT POSTER PREVIEW */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9fe870] animate-pulse" />
                LIVE CONTRACT PREVIEW
              </div>

              {/* POSTER CARD */}
              <div className="card-wise p-6 sm:p-8 space-y-6 bg-gradient-to-b from-[#141712] via-[#0e100c] to-[#0b0c0a] border border-[#9fe870]/30 shadow-2xl relative overflow-hidden">
                <div className="text-center border-b border-white/[0.08] pb-5">
                  <div className="font-mono-code text-xs text-[#9fe870] tracking-widest font-bold uppercase mb-1">
                    MY WINTER ARC
                  </div>
                  <div className="font-display-wise text-3xl font-black text-slate-100 uppercase tracking-tight">
                    {name.trim() || 'YOUR NAME'}
                  </div>
                  <div className="font-mono-code text-xs text-slate-300 font-bold mt-2 flex items-center justify-center gap-2">
                    <span>{formatShortDate(startDate)}</span>
                    <span className="text-[#9fe870]">→</span>
                    <span>{formatShortDate(endDate)}</span>
                  </div>
                  <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#e2f6d5] text-[#163300] text-[10px] font-mono-code font-extrabold uppercase">
                    90 DAYS
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono-code text-[#9fe870] font-bold uppercase tracking-wider mb-3 text-center">
                    MY COMMITMENTS ({selectedCommitments.length})
                  </div>
                  <div className="space-y-2">
                    {selectedCommitments.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-full bg-[#161813] border border-white/[0.08] flex items-center justify-between text-xs font-bold text-slate-200 px-4"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-[#9fe870] font-black">✓</span>
                          <span className="uppercase">{c.name}</span>
                        </div>
                        <span className="text-[9px] font-mono-code text-[#9fe870] font-bold">
                          {c.category || 'ARC'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {intention && (
                  <div className="text-center italic text-xs text-[#9fe870] font-mono-code font-bold uppercase">
                    "{intention === 'Create my own' ? customIntention || 'Become consistent' : intention}"
                  </div>
                )}

                <div className="text-center pt-4 border-t border-white/[0.08]">
                  <div className="font-display-wise text-base font-black text-slate-100 uppercase tracking-wide">
                    START BEFORE JANUARY.
                  </div>
                  <div className="font-display-wise text-sm font-black text-[#9fe870] uppercase tracking-wide mt-0.5">
                    FINISH WITH PROOF.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : mode === 'loading' ? (
          /* ====================================================================
             HIGH-TECH SIMULATED GENERATION LOADING SCREEN (2.5 SECONDS)
             ==================================================================== */
          <div className="max-w-xl mx-auto py-16 text-center space-y-8 card-wise p-8 sm:p-12 bg-gradient-to-b from-[#141712] via-[#0e100c] to-[#0b0c0a] border border-[#9fe870]/40 shadow-2xl">
            {/* Glowing Flame Icon Loader */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#9fe870]/20 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-[#9fe870] text-[#163300] flex items-center justify-center shadow-[0_0_40px_rgba(159,232,112,0.6)]">
                <Flame className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-mono-code text-xs text-[#9fe870] font-black uppercase tracking-widest">
                FORGING DIGITAL CONTRACT
              </div>
              <h2 className="font-display-wise text-3xl sm:text-4xl font-black text-slate-100 uppercase leading-[0.88]">
                Creating Your Winter Arc...
              </h2>
              <p className="text-xs font-mono-code text-slate-300 h-6 font-bold flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-[#9fe870] animate-spin" />
                <span>{loadingMessages[generationMessageIndex]}</span>
              </p>
            </div>

            {/* HIGH-TECH PROGRESS BAR */}
            <div className="space-y-2 max-w-md mx-auto">
              <div className="h-3 w-full bg-[#161813] border border-white/10 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#9fe870] rounded-full transition-all duration-100 ease-out shadow-[0_0_15px_rgba(159,232,112,0.8)]"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono-code text-slate-400 font-bold px-1">
                <span>SYSTEM PROCESS</span>
                <span className="text-[#9fe870] font-extrabold">{generationProgress}%</span>
              </div>
            </div>

            {/* VERIFICATION CHECKLIST BADGES */}
            <div className="pt-4 border-t border-white/[0.08] space-y-2 text-left max-w-sm mx-auto">
              <div className="flex items-center gap-2 text-xs font-mono-code text-slate-300 font-bold">
                <span className="text-[#9fe870] font-black">✓</span>
                <span>Name & 90-day window locked</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono-code text-slate-300 font-bold">
                <span className="text-[#9fe870] font-black">✓</span>
                <span>{selectedCommitments.length} non-negotiable commitments verified</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono-code text-slate-300 font-bold">
                <span className="text-[#9fe870] font-black">✓</span>
                <span>High-resolution 9:16 poster rendered</span>
              </div>
            </div>
          </div>
        ) : (
          /* ====================================================================
             CONTRACT RESULT SCREEN & PAID CONVERSION FUNNEL
             ==================================================================== */
          <div className="max-w-3xl mx-auto space-y-10 py-4 animate-fade-in">
            {/* HERO SUCCESS HEADER */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#9fe870] text-[#163300] flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(159,232,112,0.5)]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="font-display-wise text-4xl sm:text-6xl font-black text-slate-100 uppercase leading-[0.85]">
                YOUR ARC IS SET.
              </h1>
              <p className="text-base text-slate-300 font-semibold max-w-lg mx-auto">
                90 days. 4–6 commitments. One promise to yourself.
              </p>
            </div>

            {/* PROMINENT COMPLETED CONTRACT CARD */}
            <div className="card-wise p-8 sm:p-12 space-y-6 bg-gradient-to-b from-[#141712] via-[#0e100c] to-[#0b0c0a] border border-[#9fe870]/40 shadow-2xl relative">
              <div className="text-center border-b border-white/[0.08] pb-6">
                <div className="font-mono-code text-xs text-[#9fe870] tracking-widest font-bold uppercase mb-1">
                  WINTER ARC 2026 • OFFICIAL CONTRACT
                </div>
                <div className="font-display-wise text-4xl sm:text-5xl font-black text-slate-100 uppercase tracking-tight">
                  {name || 'ARC TRAVELER'}
                </div>
                <div className="font-mono-code text-sm text-slate-300 font-bold mt-3 flex items-center justify-center gap-3">
                  <span>{formatShortDate(startDate)}</span>
                  <span className="text-[#9fe870]">→</span>
                  <span>{formatShortDate(endDate)}</span>
                </div>
                <div className="inline-block mt-3 px-4 py-1 rounded-full bg-[#e2f6d5] text-[#163300] text-xs font-mono-code font-black uppercase">
                  90 DAYS
                </div>
              </div>

              <div>
                <div className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-wider mb-4 text-center">
                  PROMISED COMMITMENTS ({selectedCommitments.length})
                </div>
                <div className="space-y-2.5 max-w-md mx-auto">
                  {selectedCommitments.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-full bg-[#161813] border border-white/[0.08] flex items-center justify-between text-sm font-extrabold text-slate-100 px-6"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#9fe870] font-black text-base">✓</span>
                        <span className="uppercase">{c.name}</span>
                      </div>
                      <span className="text-[10px] font-mono-code text-[#9fe870] font-bold">
                        {c.category || 'ARC'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {intention && (
                <div className="text-center text-xs text-[#9fe870] font-mono-code font-bold uppercase pt-2">
                  "{intention === 'Create my own' ? customIntention || 'Become consistent' : intention}"
                </div>
              )}

              <div className="text-center pt-5 border-t border-white/[0.08]">
                <div className="font-display-wise text-xl font-black text-slate-100 uppercase tracking-wide">
                  START BEFORE JANUARY.
                </div>
                <div className="font-display-wise text-lg font-black text-[#9fe870] uppercase tracking-wide mt-1">
                  FINISH WITH PROOF.
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS: SHARE & DOWNLOAD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleShareCard}
                className="btn-wise-primary py-4 text-sm font-extrabold gap-2"
              >
                <Share2 className="w-4 h-4 text-[#163300]" /> <span>Share My Arc</span>
              </button>

              <button
                onClick={handleDownloadCard}
                className="btn-wise-secondary py-4 text-sm font-bold gap-2"
              >
                <Download className="w-4 h-4 text-[#9fe870]" /> <span>Download Card</span>
              </button>
            </div>

            {/* OPTIONAL LEAD CAPTURE */}
            <div className="p-6 rounded-[24px] bg-[#141712] border border-white/[0.08] text-center space-y-4">
              <div className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-wider">
                WANT US TO SAVE YOUR ARC?
              </div>
              <p className="text-xs text-slate-300 font-semibold max-w-sm mx-auto">
                Enter your email to receive a backup copy of your contract card.
              </p>
              {leadSaved ? (
                <div className="p-3 rounded-full bg-[#e2f6d5] text-[#163300] text-xs font-bold font-mono-code">
                  ✓ Contract saved to {leadEmail}!
                </div>
              ) : (
                <form onSubmit={handleSaveLead} className="flex gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="flex-1 bg-[#0b0c0a] border border-white/10 rounded-full px-5 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870]"
                  />
                  <button
                    type="submit"
                    className="btn-wise-secondary px-5 py-3 text-xs font-bold shrink-0"
                  >
                    Save My Arc
                  </button>
                </form>
              )}
            </div>

            {/* ====================================================================
               HIGH-CONVERSION MOMENT CARD (PAID UPGRADE PROMPT)
               ==================================================================== */}
            <div className="card-wise p-8 sm:p-10 space-y-6 bg-gradient-to-br from-[#192212] via-[#141712] to-[#0b0c0a] border-2 border-[#9fe870]">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#9fe870] text-[#163300] font-mono-code text-xs font-black uppercase">
                <Sparkles className="w-4 h-4 text-[#163300]" /> 90-DAY SYSTEM
              </div>

              <div className="space-y-2">
                <h2 className="font-display-wise text-3xl sm:text-5xl font-black text-slate-100 uppercase leading-[0.85]">
                  YOUR ARC IS READY. <br />
                  <span className="text-[#9fe870]">NOW ACTUALLY LIVE IT.</span>
                </h2>
                <p className="text-sm text-slate-200 font-bold pt-1">
                  Your contract is the commitment. The dashboard is how you keep it.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold pt-2">
                <div className="p-3.5 rounded-full bg-[#161813] border border-white/[0.08] flex items-center gap-3">
                  <span className="text-[#9fe870] font-black text-base">✓</span>
                  <span>Daily 20-second check-ins</span>
                </div>
                <div className="p-3.5 rounded-full bg-[#161813] border border-white/[0.08] flex items-center gap-3">
                  <span className="text-[#9fe870] font-black text-base">✓</span>
                  <span>90-day consistency grid</span>
                </div>
                <div className="p-3.5 rounded-full bg-[#161813] border border-white/[0.08] flex items-center gap-3">
                  <span className="text-[#9fe870] font-black text-base">✓</span>
                  <span>Every 7 days reflection log</span>
                </div>
                <div className="p-3.5 rounded-full bg-[#161813] border border-white/[0.08] flex items-center gap-3">
                  <span className="text-[#9fe870] font-black text-base">✓</span>
                  <span>Verified Day 90 completion proof</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/[0.08]">
                <div>
                  <div className="text-2xl sm:text-3xl font-display-wise font-black text-slate-100">
                    $19 <span className="text-xs font-mono-code text-[#9fe870] uppercase font-bold">ONE TIME</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono-code font-bold">
                    Full 90-day tracking system • Lifetime access
                  </div>
                </div>

                <button
                  onClick={handleUnlockPaid}
                  className="btn-wise-primary py-4 px-8 text-base font-black w-full sm:w-auto shadow-[0_0_30px_rgba(159,232,112,0.5)] gap-2"
                >
                  <span>Unlock My 90 Days — $19</span>
                  <ArrowRight className="w-5 h-5 text-[#163300]" />
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setMode('form')}
                  className="text-xs font-mono-code text-slate-400 hover:text-slate-200 underline font-bold"
                >
                  Edit My Contract
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FALLBACK SHARE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg card-wise p-6 sm:p-8 space-y-6 bg-gradient-to-b from-[#141712] to-[#0b0c0a]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
                  SHAREABLE CONTRACT CARD
                </div>
                <h3 className="font-display-wise text-2xl text-slate-100 font-black uppercase">
                  Instagram Story (9:16)
                </h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {shareDataUrl && (
              <div className="flex justify-center my-4">
                <img
                  src={shareDataUrl}
                  alt="Winter Arc Contract Share Card"
                  className="w-full max-w-[280px] rounded-[24px] border border-white/15 object-contain"
                />
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={handleDownloadCard}
                className="btn-wise-primary w-full py-4 text-sm font-extrabold gap-2"
              >
                <Download className="w-4 h-4 text-[#163300]" /> <span>Download PNG</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="btn-wise-secondary w-full py-3.5 text-xs font-bold gap-2"
              >
                <span>{copiedLink ? 'Link Copied!' : 'Copy Contract Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.06] py-6 text-center text-xs text-slate-400 font-mono-code font-bold">
        WINTER ARC 2026 • START BEFORE JANUARY. FINISH WITH PROOF.
      </footer>
    </div>
  );
}
