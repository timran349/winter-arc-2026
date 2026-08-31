'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Flame,
  ArrowRight,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Share2,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { trackEvent, ANALYTICS_EVENTS } from '@/src/utils/analytics';

export default function Home() {
  const router = useRouter();

  // Interactive Hero Preview Name state
  const [heroName, setHeroName] = useState('TUSHAR');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleHeroCtaClick = () => {
    trackEvent(ANALYTICS_EVENTS.CONTRACT_BUILDER_STARTED, { source: 'landing_hero' });
  };

  const faqs = [
    {
      q: 'What is Winter Arc?',
      a: 'Winter Arc is a 90-day personal accountability run. You choose 4–6 non-negotiable commitments to execute consistently before the new year.'
    },
    {
      q: 'How long is it?',
      a: 'Winter Arc lasts exactly 90 days.'
    },
    {
      q: 'How many commitments can I choose?',
      a: 'You choose between 4 and 6 commitments. Keeping it between 4 and 6 ensures your Arc remains focused and achievable without burnout.'
    },
    {
      q: 'What happens if I miss a day?',
      a: 'You keep going. There is no restart button, no streak reset, and no starting over from zero. Progress is cumulative.'
    },
    {
      q: 'Do I have to start October 1?',
      a: 'October 1, 2026 is the main launch date for the Winter Arc movement, but late joiners can start November 1, 2026 or any day they choose before January.'
    },
    {
      q: 'Is the contract really free?',
      a: 'Yes. Building, customizing, downloading, and sharing your personal Winter Arc contract card is 100% free with no account or credit card required.'
    },
    {
      q: 'What do I get for $19?',
      a: 'The $19 one-time purchase unlocks full access to the 90-day tracking dashboard, daily 20-second check-ins, consistency calendar grid, weekly reflection logs, and verified completion proof.'
    },
    {
      q: 'Is this 75 Hard?',
      a: 'No. Winter Arc is built for real-world consistency with your own rules, not arbitrary extreme constraints or forced restarts.'
    },
    {
      q: 'Can I join after October 1?',
      a: 'Yes. You can launch your 90-day Arc on October 1, November 1, or any date that fits your schedule.'
    },
    {
      q: 'What happens after 90 days?',
      a: 'You complete your Arc with a verified proof-of-execution card detailing your 90-day completion rate and consistency.'
    }
  ];

  return (
    <div className="w-full bg-[#0b0c0a] text-slate-100 min-h-screen flex flex-col justify-between selection:bg-[#9fe870] selection:text-[#163300]">
      {/* 13. NAVIGATION */}
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
                SYSTEM
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono-code font-bold text-slate-300">
            <a href="#how-it-works" className="hover:text-[#9fe870] transition-colors">
              How it works
            </a>
            <a href="#the-system" className="hover:text-[#9fe870] transition-colors">
              The System
            </a>
            <a href="#faq" className="hover:text-[#9fe870] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-full hover:bg-white/[0.05] transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/build"
              onClick={handleHeroCtaClick}
              className="btn-wise-primary text-xs px-5 py-2"
            >
              BUILD MY ARC
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* ====================================================================
           1. HERO SECTION & 2. LIVE HERO CONTRACT PREVIEW
           ==================================================================== */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e2f6d5] text-[#163300] font-mono-code text-xs font-black uppercase mb-6 tracking-wider">
            <Flame className="w-4 h-4 text-[#163300]" />
            <span>WINTER ARC 2026</span>
          </div>

          {/* Headline */}
          <h1 className="font-display-wise text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-100 uppercase max-w-5xl mx-auto leading-[0.85]">
            START BEFORE JANUARY. <br />
            <span className="text-[#9fe870]">FINISH WITH PROOF.</span>
          </h1>

          {/* Subhead */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-sans font-semibold leading-relaxed">
            Build your Winter Arc in 30 seconds. Choose 4–6 commitments, create your contract, and start your 90-day run.
          </p>

          {/* CTAs & Microcopy */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/build"
                onClick={handleHeroCtaClick}
                className="btn-wise-primary px-10 py-5 text-lg font-black gap-2 group w-full sm:w-auto shadow-[0_0_35px_rgba(159,232,112,0.4)]"
              >
                <span>BUILD MY WINTER ARC</span>
                <ArrowRight className="w-5 h-5 text-[#163300] group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#how-it-works"
                className="btn-wise-secondary px-8 py-5 text-base w-full sm:w-auto font-bold"
              >
                SEE HOW IT WORKS
              </a>
            </div>

            <div className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-wider pt-1">
              Free. No account required.
            </div>
          </div>

          {/* 2. DYNAMIC HERO CONTRACT POSTER PREVIEW */}
          <div className="mt-14 max-w-xl mx-auto text-left">
            <div className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-widest mb-3 flex items-center justify-between px-1">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9fe870] animate-pulse" />
                DIGITAL CONTRACT POSTER
              </span>
              <span className="text-slate-400">Click name to customize</span>
            </div>

            {/* HIGH-CONTRAST DIGITAL POSTER */}
            <div className="card-wise p-6 sm:p-10 space-y-6 bg-gradient-to-b from-[#141712] via-[#0e100c] to-[#0b0c0a] border border-[#9fe870]/40 shadow-2xl relative overflow-hidden">
              <div className="text-center border-b border-white/[0.08] pb-5">
                <div className="font-mono-code text-xs text-[#9fe870] tracking-widest font-bold uppercase mb-1">
                  MY WINTER ARC
                </div>

                {/* Editable Name Field inside Hero Poster */}
                <input
                  type="text"
                  value={heroName}
                  onChange={(e) => setHeroName(e.target.value.toUpperCase())}
                  className="font-display-wise text-3xl sm:text-4xl font-black text-slate-100 bg-transparent text-center focus:outline-none focus:border-b border-[#9fe870] w-full uppercase tracking-tight"
                />

                <div className="font-mono-code text-xs text-slate-300 font-bold mt-2 flex items-center justify-center gap-2">
                  <span>OCT 01</span>
                  <span className="text-[#9fe870]">→</span>
                  <span>DEC 29</span>
                </div>
                <div className="inline-block mt-2 px-3.5 py-0.5 rounded-full bg-[#e2f6d5] text-[#163300] text-[10px] font-mono-code font-black uppercase">
                  90 DAYS
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono-code text-[#9fe870] font-bold uppercase tracking-wider mb-3 text-center">
                  MY COMMITMENTS
                </div>
                <div className="space-y-2 max-w-sm mx-auto">
                  {[
                    { num: '01', name: 'TRAIN' },
                    { num: '02', name: 'READ' },
                    { num: '03', name: 'DEEP WORK' },
                    { num: '04', name: 'SLEEP 7+ HOURS' },
                    { num: '05', name: 'NO MORNING SCROLLING' }
                  ].map((item) => (
                    <div
                      key={item.num}
                      className="p-3 rounded-full bg-[#161813] border border-white/[0.08] flex items-center justify-between text-xs font-black text-slate-100 px-5"
                    >
                      <span className="font-mono-code text-[#9fe870]">{item.num}</span>
                      <span className="uppercase tracking-wider">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-4 border-t border-white/[0.08]">
                <div className="font-display-wise text-base font-black text-slate-100 uppercase tracking-wide">
                  START BEFORE JANUARY.
                </div>
                <div className="font-mono-code text-xs font-bold text-[#9fe870] uppercase tracking-widest mt-1">
                  WINTER ARC 2026
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/build"
                className="inline-flex items-center gap-2 text-xs font-black text-[#9fe870] hover:underline font-mono-code uppercase tracking-wider"
              >
                Create Your Customized Contract →
              </Link>
            </div>
          </div>
        </section>

        {/* ====================================================================
           3. FREE CONTRACT SECTION
           ==================================================================== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
              FREE ACQUISITION
            </span>
            <h2 className="font-display-wise text-4xl sm:text-6xl text-slate-100 font-black uppercase leading-[0.85]">
              BUILD YOUR ARC. <br />
              <span className="text-[#9fe870]">MAKE IT REAL.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-semibold leading-relaxed pt-1">
              Choose 4–6 commitments that actually fit your life. No extreme rules. No perfect streak required. No restarting from zero.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card-wise p-6 sm:p-8 space-y-3">
              <div className="font-mono-code text-2xl font-black text-[#9fe870]">01</div>
              <h3 className="font-display-wise text-2xl font-black text-slate-100 uppercase">CHOOSE</h3>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                Pick 4–6 commitments that fit your goals and schedule.
              </p>
            </div>

            <div className="card-wise p-6 sm:p-8 space-y-3">
              <div className="font-mono-code text-2xl font-black text-[#9fe870]">02</div>
              <h3 className="font-display-wise text-2xl font-black text-slate-100 uppercase">COMMIT</h3>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                Set your 90-day start date and lock in your window.
              </p>
            </div>

            <div className="card-wise p-6 sm:p-8 space-y-3">
              <div className="font-mono-code text-2xl font-black text-[#9fe870]">03</div>
              <h3 className="font-display-wise text-2xl font-black text-slate-100 uppercase">SHARE</h3>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                Generate your personal Arc contract to download and share.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/build"
              className="btn-wise-primary px-8 py-4 text-sm font-black"
            >
              BUILD MY WINTER ARC
            </Link>
          </div>
        </section>

        {/* ====================================================================
           4. FREE → PAID TRANSITION (CLEAN TWO-COLUMN COMPARISON)
           ==================================================================== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
              THE VALUE PROPOSITION
            </span>
            <h2 className="font-display-wise text-4xl sm:text-6xl text-slate-100 font-black uppercase leading-[0.85]">
              MAKE THE COMMITMENT. <br />
              <span className="text-[#9fe870]">THEN KEEP IT.</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-semibold">
              The free product helps you MAKE the commitment. The paid product helps you KEEP it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FREE CONTRACT COLUMN */}
            <div className="card-wise p-8 sm:p-10 space-y-6 bg-[#121510] border border-white/10 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-mono-code text-slate-400 font-bold uppercase">FREE CONTRACT</div>
                  <div className="text-4xl font-display-wise font-black text-slate-100 mt-1">$0</div>
                  <div className="text-xs text-slate-400 font-mono-code font-bold mt-1">100% free • No account required</div>
                </div>

                <div className="space-y-3 text-xs font-bold border-t border-white/[0.08] pt-6">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                    <span>Choose 4–6 commitments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                    <span>Create your Winter Arc</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                    <span>Generate your contract</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                    <span>Download high-res PNG</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                    <span>Share to Stories & TikTok</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/build"
                  className="btn-wise-secondary w-full py-4 text-xs font-extrabold text-center block"
                >
                  BUILD MY ARC
                </Link>
              </div>
            </div>

            {/* PAID 90-DAY SYSTEM COLUMN */}
            <div className="card-wise p-8 sm:p-10 space-y-6 bg-gradient-to-br from-[#192212] via-[#141712] to-[#0b0c0a] border-2 border-[#9fe870] flex flex-col justify-between shadow-2xl">
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#9fe870] text-[#163300] text-[10px] font-mono-code font-black uppercase mb-2">
                    90-DAY SYSTEM
                  </div>
                  <div className="text-4xl font-display-wise font-black text-slate-100">$19 <span className="text-xs font-mono-code text-[#9fe870] uppercase">ONE TIME</span></div>
                  <div className="text-xs text-slate-300 font-mono-code font-bold mt-1">Full 90-day tracking • Lifetime access</div>
                </div>

                <div className="space-y-3 text-xs font-bold border-t border-white/[0.08] pt-6">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                    <span>Everything in the free contract</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                    <span>Daily 20-second check-ins</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                    <span>90-day progress tracking grid</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                    <span>Weekly reflection & review log</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                    <span>Arc history archive</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                    <span>Verified Day 90 completion proof</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/unlock"
                  className="btn-wise-primary w-full py-4 text-xs font-black text-center block shadow-[0_0_25px_rgba(159,232,112,0.4)]"
                >
                  UNLOCK MY 90 DAYS — $19
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
           5. "YOUR ARC. YOUR RULES."
           ==================================================================== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
                CORE PHILOSOPHY
              </span>
              <h2 className="font-display-wise text-4xl sm:text-6xl text-slate-100 font-black uppercase leading-[0.85]">
                YOUR ARC. <br />
                <span className="text-[#9fe870]">YOUR RULES.</span>
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-300 font-semibold leading-relaxed">
                <p>
                  Winter Arc isn't a fixed challenge. You choose what you're working on.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-mono-code font-bold pt-1">
                  <span className="px-3 py-1 rounded-full bg-[#161813] border border-white/10 text-slate-200">Train</span>
                  <span className="px-3 py-1 rounded-full bg-[#161813] border border-white/10 text-slate-200">Read</span>
                  <span className="px-3 py-1 rounded-full bg-[#161813] border border-white/10 text-slate-200">Study</span>
                  <span className="px-3 py-1 rounded-full bg-[#161813] border border-white/10 text-slate-200">Build</span>
                  <span className="px-3 py-1 rounded-full bg-[#161813] border border-white/10 text-slate-200">Sleep better</span>
                  <span className="px-3 py-1 rounded-full bg-[#161813] border border-white/10 text-slate-200">Scroll less</span>
                  <span className="px-3 py-1 rounded-full bg-[#161813] border border-white/10 text-slate-200">Create something</span>
                </div>
                <p>
                  Pick what matters to you.
                </p>
              </div>
            </div>

            {/* CALLOUT CARD */}
            <div className="lg:col-span-6">
              <div className="card-wise p-8 sm:p-10 bg-gradient-to-br from-[#182113] to-[#0b0c0a] border-2 border-[#9fe870] space-y-4 text-center">
                <div className="font-mono-code text-xs text-[#9fe870] uppercase font-bold tracking-widest">
                  THE KEY DIFFERENTIATOR
                </div>
                <h3 className="font-display-wise text-4xl sm:text-5xl font-black text-slate-100 uppercase leading-[0.88]">
                  MISS A DAY? <br />
                  <span className="text-[#9fe870]">KEEP GOING.</span>
                </h3>
                <div className="text-xs font-mono-code text-slate-300 font-bold uppercase tracking-wider">
                  No restart button. No starting from zero.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
           6. "NOT ANOTHER EXTREME CHALLENGE" (75 HARD COMPARISON)
           ==================================================================== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
              DESIGN DIFFERENCE
            </span>
            <h2 className="font-display-wise text-4xl sm:text-6xl text-slate-100 font-black uppercase leading-[0.85]">
              NOT ANOTHER EXTREME CHALLENGE.
            </h2>
            <p className="text-slate-300 text-sm font-semibold">
              Winter Arc is built for consistency, not punishment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WINTER ARC */}
            <div className="card-wise p-8 bg-[#182113] border-2 border-[#9fe870] space-y-6">
              <div className="flex items-center justify-between border-b border-[#9fe870]/30 pb-4">
                <h3 className="font-display-wise text-2xl font-black text-slate-100 uppercase">WINTER ARC</h3>
                <span className="px-3 py-0.5 rounded-full bg-[#9fe870] text-[#163300] text-[10px] font-mono-code font-bold">BUILT FOR REAL LIFE</span>
              </div>
              <ul className="space-y-3 text-xs font-bold text-slate-200">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                  <span>4–6 personal commitments</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                  <span>Flexible around real life</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                  <span>Miss a day → continue</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                  <span>90 days</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#9fe870] shrink-0" />
                  <span>Your rules</span>
                </li>
              </ul>
            </div>

            {/* 75 HARD COMPARISON */}
            <div className="card-wise p-8 bg-[#141712] border border-white/10 space-y-6 opacity-80">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h3 className="font-display-wise text-2xl font-black text-slate-400 uppercase">75 HARD</h3>
                <span className="px-3 py-0.5 rounded-full bg-white/10 text-slate-400 text-[10px] font-mono-code font-bold">EXTREME PROGRAM</span>
              </div>
              <ul className="space-y-3 text-xs font-bold text-slate-400">
                <li className="flex items-center gap-3">
                  <X className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Fixed challenge structure</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Strict completion rules</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Restart requirements on failure</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>75 fixed days</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Rigid rules</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ====================================================================
           7. SIMPLE "HOW IT WORKS"
           ==================================================================== */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
          <div className="text-center mb-16">
            <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
              THE METHOD
            </span>
            <h2 className="font-display-wise text-4xl sm:text-6xl text-slate-100 font-black uppercase mt-2 leading-[0.85]">
              HOW IT WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="card-wise p-6 bg-[#141712] space-y-3">
              <div className="font-mono-code text-xs text-[#9fe870] font-bold">01 — BUILD</div>
              <h3 className="font-display-wise text-xl font-black text-slate-100 uppercase">BUILD</h3>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">Choose 4–6 commitments.</p>
            </div>

            <div className="card-wise p-6 bg-[#141712] space-y-3">
              <div className="font-mono-code text-xs text-[#9fe870] font-bold">02 — SHOW UP</div>
              <h3 className="font-display-wise text-xl font-black text-slate-100 uppercase">SHOW UP</h3>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">Check in every day.</p>
            </div>

            <div className="card-wise p-6 bg-[#141712] space-y-3">
              <div className="font-mono-code text-xs text-[#9fe870] font-bold">03 — REVIEW</div>
              <h3 className="font-display-wise text-xl font-black text-slate-100 uppercase">REVIEW</h3>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">Review your week and adjust.</p>
            </div>

            <div className="card-wise p-6 bg-[#141712] space-y-3">
              <div className="font-mono-code text-xs text-[#9fe870] font-bold">04 — FINISH</div>
              <h3 className="font-display-wise text-xl font-black text-slate-100 uppercase">FINISH</h3>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">Complete your 90 days with proof.</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/build"
              className="btn-wise-primary px-8 py-4 text-sm font-black"
            >
              BUILD MY WINTER ARC
            </Link>
          </div>
        </section>

        {/* ====================================================================
           8. "WHO IT'S FOR" & "NOT FOR YOU IF"
           ==================================================================== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* THIS IS FOR YOU IF */}
            <div className="card-wise p-8 sm:p-10 bg-[#141712] space-y-6 border border-[#9fe870]/30">
              <div className="space-y-2">
                <span className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-widest">
                  IDEAL ALIGNMENT
                </span>
                <h2 className="font-display-wise text-3xl font-black text-slate-100 uppercase leading-[0.88]">
                  THIS IS FOR YOU IF...
                </h2>
              </div>

              <ul className="space-y-3 text-xs font-bold text-slate-200">
                <li className="flex items-start gap-3">
                  <span className="text-[#9fe870] font-black text-sm">✓</span>
                  <span>You keep saying you'll start in January.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#9fe870] font-black text-sm">✓</span>
                  <span>You know what you want to improve but struggle with consistency.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#9fe870] font-black text-sm">✓</span>
                  <span>You want structure without an extreme challenge.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#9fe870] font-black text-sm">✓</span>
                  <span>You want something simple enough to actually use every day.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#9fe870] font-black text-sm">✓</span>
                  <span>You like the idea of publicly committing to your goals.</span>
                </li>
              </ul>
            </div>

            {/* NOT FOR YOU IF */}
            <div className="card-wise p-8 sm:p-10 bg-[#10120e] space-y-6 border border-white/[0.08] opacity-85">
              <div className="space-y-2">
                <span className="text-xs font-mono-code text-slate-400 font-bold uppercase tracking-widest">
                  DISQUALIFICATION
                </span>
                <h2 className="font-display-wise text-3xl font-black text-slate-300 uppercase leading-[0.88]">
                  NOT FOR YOU IF...
                </h2>
              </div>

              <ul className="space-y-3 text-xs font-bold text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="text-slate-500 font-black text-sm">✕</span>
                  <span>You're looking for medical or health treatment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-500 font-black text-sm">✕</span>
                  <span>You're looking for a crash diet.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-500 font-black text-sm">✕</span>
                  <span>You're looking for an extreme physical challenge.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-500 font-black text-sm">✕</span>
                  <span>You're looking for someone else to dictate your entire life.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ====================================================================
           9. THE $19 PRODUCT SECTION
           ==================================================================== */}
        <section id="the-system" className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
          <div className="card-wise p-8 sm:p-12 bg-gradient-to-br from-[#182113] via-[#141712] to-[#0b0c0a] border-2 border-[#9fe870]">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#9fe870] text-[#163300] font-mono-code text-xs font-black uppercase mb-6">
              <Sparkles className="w-4 h-4 text-[#163300]" /> THE 90-DAY SYSTEM
            </div>

            <div className="max-w-3xl space-y-4">
              <h2 className="font-display-wise text-4xl sm:text-6xl text-slate-100 font-black uppercase leading-[0.85]">
                Your contract is the commitment. <br />
                <span className="text-[#9fe870]">The dashboard is how you keep it.</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 text-xs font-bold">
                <div className="p-5 rounded-[24px] bg-[#161813] border border-white/[0.08] space-y-1">
                  <div className="text-[#9fe870] font-mono-code font-black uppercase">DAILY CHECK-INS</div>
                  <div className="text-slate-300 font-semibold">Mark what you showed up for.</div>
                </div>
                <div className="p-5 rounded-[24px] bg-[#161813] border border-white/[0.08] space-y-1">
                  <div className="text-[#9fe870] font-mono-code font-black uppercase">90-DAY PROGRESS</div>
                  <div className="text-slate-300 font-semibold">See the full Arc at a glance.</div>
                </div>
                <div className="p-5 rounded-[24px] bg-[#161813] border border-white/[0.08] space-y-1">
                  <div className="text-[#9fe870] font-mono-code font-black uppercase">WEEKLY REVIEWS</div>
                  <div className="text-slate-300 font-semibold">Reflect, reset, continue.</div>
                </div>
                <div className="p-5 rounded-[24px] bg-[#161813] border border-white/[0.08] space-y-1">
                  <div className="text-[#9fe870] font-mono-code font-black uppercase">MISSED DAYS</div>
                  <div className="text-slate-300 font-semibold">Missed days don't erase your progress.</div>
                </div>
              </div>

              <div className="p-5 rounded-[24px] bg-[#161813] border border-white/[0.08] space-y-1 mt-4">
                <div className="text-[#9fe870] font-mono-code font-black uppercase">COMPLETION PROOF</div>
                <div className="text-slate-300 font-semibold">Finish your Arc with something to show for it.</div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/[0.08]">
                <div>
                  <div className="text-3xl font-display-wise font-black text-slate-100">
                    $19 <span className="text-xs font-mono-code text-[#9fe870] uppercase font-bold">ONE TIME</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono-code font-bold">
                    Full 90-day system • Lifetime access
                  </div>
                </div>

                <Link
                  href="/unlock"
                  className="btn-wise-primary px-8 py-4 text-base font-black w-full sm:w-auto shadow-[0_0_30px_rgba(159,232,112,0.4)] text-center"
                >
                  UNLOCK MY 90 DAYS — $19
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
           10. SHAREABLE CONTRACT EMPHASIS ("MAKE IT PUBLIC.")
           ==================================================================== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
                PUBLIC ACCOUNTABILITY
              </span>
              <h2 className="font-display-wise text-4xl sm:text-6xl text-slate-100 font-black uppercase leading-[0.85]">
                MAKE IT <br />
                <span className="text-[#9fe870]">PUBLIC.</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-semibold leading-relaxed">
                Your contract isn't just a tracker. It's a commitment you can actually see. Generate a clean 9:16 version for Stories and TikTok.
              </p>

              <div>
                <Link
                  href="/build"
                  className="btn-wise-primary px-8 py-4 text-sm font-black inline-flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4 text-[#163300]" /> <span>CREATE MY CONTRACT</span>
                </Link>
              </div>
            </div>

            {/* LARGE MOBILE 9:16 CONTRACT GRAPHIC MOCKUP */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[320px] aspect-[9/16] card-wise p-6 bg-gradient-to-b from-[#141712] via-[#0e100c] to-[#0b0c0a] border-2 border-[#9fe870] shadow-2xl flex flex-col justify-between relative">
                <div className="text-center border-b border-white/[0.08] pb-4">
                  <div className="font-mono-code text-[10px] text-[#9fe870] tracking-widest font-bold uppercase">
                    WINTER ARC 2026
                  </div>
                  <div className="font-display-wise text-2xl font-black text-slate-100 uppercase tracking-tight mt-1">
                    TUSHAR
                  </div>
                  <div className="font-mono-code text-[11px] text-slate-300 font-bold mt-1">
                    OCT 01 → DEC 29
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[9px] font-mono-code text-[#9fe870] font-bold uppercase text-center">
                    MY 5 COMMITMENTS
                  </div>
                  {['TRAIN', 'READ 20 PAGES', 'DEEP WORK 60M', 'SLEEP 7+ HOURS', 'NO MORNING SCROLLING'].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-full bg-[#161813] border border-white/[0.08] flex items-center justify-between text-[11px] font-black text-slate-100 px-4"
                    >
                      <span className="text-[#9fe870]">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-3 border-t border-white/[0.08]">
                  <div className="font-display-wise text-sm font-black text-slate-100 uppercase">
                    START BEFORE JANUARY.
                  </div>
                  <div className="font-mono-code text-[10px] font-bold text-[#9fe870] uppercase tracking-wider mt-0.5">
                    FINISH WITH PROOF.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
           11. FAQ SECTION
           ==================================================================== */}
        <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
              QUESTIONS & ANSWERS
            </span>
            <h2 className="font-display-wise text-4xl sm:text-6xl text-slate-100 font-black uppercase leading-[0.85]">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="card-wise bg-[#141712] border border-white/[0.08] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display-wise text-lg sm:text-xl font-black text-slate-100 uppercase"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#9fe870] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed border-t border-white/[0.06] pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ====================================================================
           12. FINAL CTA
           ==================================================================== */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center border-t border-white/[0.06]">
          <h2 className="font-display-wise text-4xl sm:text-6xl font-black text-slate-100 uppercase leading-[0.85]">
            JANUARY IS COMING. <br />
            <span className="text-[#9fe870]">DON'T WAIT FOR IT.</span>
          </h2>
          <p className="mt-6 text-[#9fe870] font-display-wise text-2xl sm:text-3xl font-black uppercase">
            Build your Winter Arc today.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3">
            <Link
              href="/build"
              onClick={handleHeroCtaClick}
              className="btn-wise-primary px-10 py-5 text-lg font-black shadow-[0_0_35px_rgba(159,232,112,0.4)]"
            >
              BUILD MY WINTER ARC
            </Link>
            <div className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-wider pt-1">
              Free. Takes 30 seconds.
            </div>
            <div className="text-[11px] font-mono-code text-slate-400 font-bold uppercase tracking-wider">
              90 days. 4–6 commitments. No restart button.
            </div>
          </div>
        </section>
      </main>

      {/* STICKY MOBILE BOTTOM CTA BAR */}
      <div className="md:hidden sticky bottom-0 z-40 w-full p-3 bg-[#0b0c0a]/95 border-t border-white/[0.08] backdrop-blur-md">
        <Link
          href="/build"
          onClick={handleHeroCtaClick}
          className="btn-wise-primary w-full py-3.5 text-xs font-black text-center justify-center shadow-[0_0_20px_rgba(159,232,112,0.4)]"
        >
          BUILD MY WINTER ARC — FREE
        </Link>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.06] py-6 text-center text-xs text-slate-400 font-mono-code font-bold">
        WINTER ARC 2026 • START BEFORE JANUARY. FINISH WITH PROOF.
      </footer>
    </div>
  );
}
