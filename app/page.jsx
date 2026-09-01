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
  Award,
  Search,
  CheckCircle2,
  Lock
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
      q: 'What is Winter Arc 90?',
      a: 'Winter Arc 90 is a 90-day personal accountability run. You choose 4–6 non-negotiable commitments to execute consistently before the new year.'
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
    <div className="relative w-full bg-white text-zinc-900 min-h-screen flex flex-col justify-between selection:bg-[#FF4500] selection:text-white font-sans overflow-x-hidden">
      {/* Background Stalkr Subtle Light Texture & Ambient Spotlight */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 stalkr-grain opacity-60 z-0"></div>
      <div aria-hidden="true" className="pointer-events-none absolute -top-64 left-1/2 h-[700px] w-[1200px] -translate-x-1/2 rounded-[9999px] bg-gradient-to-b from-zinc-100/80 to-transparent blur-3xl z-0"></div>

      {/* HEADER / NAVIGATION (STALKR LIGHT GLASS HEADER) */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="inline-flex items-center justify-center text-zinc-900 h-7 w-7 rounded-full bg-zinc-100 border border-zinc-200 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 text-[#FF4500]" />
            </span>
            <span className="font-fraunces font-medium tracking-[-0.01em] text-zinc-900 text-[18px]">
              Stalkr Arc
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[14px] text-zinc-500 font-medium">
            <a href="#how-it-works" className="transition-colors hover:text-zinc-900">
              How it works
            </a>
            <a href="#the-system" className="transition-colors hover:text-zinc-900">
              The System
            </a>
            <a href="#faq" className="transition-colors hover:text-zinc-900">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-[14px] text-zinc-500 transition-colors hover:text-zinc-900 hidden sm:inline font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/build"
              onClick={handleHeroCtaClick}
              className="group flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-[14px] font-medium text-white transition-all hover:bg-zinc-800 active:scale-95"
            >
              <span>Build My Arc</span>
              <ArrowRight className="w-3.5 h-3.5 text-white transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1">
        {/* ====================================================================
           1. HERO SECTION & LIVE HERO CONTRACT PREVIEW
           ==================================================================== */}
        <section className="max-w-[1200px] mx-auto px-6 pt-16 sm:pt-24 pb-20 text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-200 bg-white text-[#FF4500] text-[11px] font-semibold uppercase tracking-[0.18em] mb-6 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF4500] animate-pulse"></span>
            <span>WINTER ARC 2026 SYSTEM</span>
          </div>

          {/* Headline with Fraunces Accent */}
          <h1 className="font-funnel text-[32px] sm:text-[46px] md:text-[58px] lg:text-[64px] font-semibold leading-[1.01] tracking-[-0.035em] text-zinc-900 uppercase max-w-5xl mx-auto">
            START BEFORE JANUARY. <br />
            <span className="font-fraunces text-[#FF4500] normal-case italic font-normal tracking-tight">Finish with proof.</span>
          </h1>

          {/* Subhead */}
          <p className="mt-6 text-[16px] md:text-[17px] text-zinc-500 max-w-2xl mx-auto font-sans font-normal leading-[1.55]">
            Build your Winter Arc in 30 seconds. Choose 4–6 commitments, generate your contract, and lock in your 90-day run.
          </p>

          {/* CTAs & Microcopy */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/build"
                onClick={handleHeroCtaClick}
                className="group flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-7 text-[15px] font-medium bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 transition-all shadow-md w-full sm:w-auto"
              >
                <span>BUILD MY WINTER ARC</span>
                <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5" />
              </Link>

              <a
                href="#how-it-works"
                className="btn-wise-secondary px-7 py-3 text-[15px] w-full sm:w-auto font-medium"
              >
                See how it works
              </a>
            </div>

            <p className="text-[12.5px] text-zinc-400 font-mono-code pt-2">
              Free contract builder • 100% private • No credit card required
            </p>
          </div>

          {/* DYNAMIC HERO CONTRACT POSTER PREVIEW */}
          <div className="mt-14 max-w-xl mx-auto text-left">
            <div className="text-[11px] font-mono-code text-[#FF4500] font-semibold uppercase tracking-[0.18em] mb-3 flex items-center justify-between px-1">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse" />
                DIGITAL CONTRACT CARD
              </span>
              <span className="text-zinc-400 font-sans text-xs">Edit name below</span>
            </div>

            {/* STALKR LIGHT CARD POSTER */}
            <div className="card-wise p-6 sm:p-10 space-y-6 bg-white border border-zinc-200/80 shadow-[0_30px_80px_-30px_rgba(24,24,27,0.15)] relative overflow-hidden rounded-2xl">
              <div className="text-center border-b border-zinc-100 pb-5">
                <div className="font-mono-code text-[11px] text-[#FF4500] tracking-[0.18em] font-semibold uppercase mb-1">
                  WINTER ARC 90
                </div>

                {/* Stalkr Light Search Input Box Style inside Hero Poster */}
                <div className="flex h-12 w-full max-w-md mx-auto items-center gap-2.5 rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-[0_14px_38px_rgba(24,24,27,0.08)] focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-900/10 transition-all px-4 my-3">
                  <Flame className="w-4 h-4 text-[#FF4500] shrink-0" />
                  <input
                    type="text"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value.toUpperCase())}
                    className="w-full bg-transparent font-funnel text-xl font-bold text-zinc-900 text-center outline-none tracking-tight uppercase placeholder:text-zinc-400"
                    placeholder="ENTER YOUR NAME"
                  />
                </div>

                <div className="font-mono-code text-xs text-zinc-500 font-medium mt-2 flex items-center justify-center gap-2">
                  <span>OCT 01</span>
                  <span className="text-[#FF4500]">→</span>
                  <span>DEC 29</span>
                </div>
                <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/20 text-[10.5px] font-mono-code font-semibold uppercase">
                  90 DAYS
                </div>
              </div>

              <div>
                <div className="text-[10.5px] font-mono-code text-[#FF4500] font-semibold uppercase tracking-[0.18em] mb-3 text-center">
                  NON-NEGOTIABLE COMMITMENTS
                </div>
                <div className="space-y-2 max-w-sm mx-auto">
                  {[
                    { num: '01', name: 'TRAIN 5X / WEEK' },
                    { num: '02', name: 'READ 20 PAGES DAILY' },
                    { num: '03', name: 'DEEP WORK 90 MINUTES' },
                    { num: '04', name: 'SLEEP 7+ HOURS' },
                    { num: '05', name: 'NO MORNING SCROLLING' }
                  ].map((item) => (
                    <div
                      key={item.num}
                      className="p-3 rounded-full bg-zinc-50 border border-zinc-200/80 flex items-center justify-between text-xs font-semibold text-zinc-800 px-5 transition-all hover:border-zinc-300"
                    >
                      <span className="font-mono-code text-[#FF4500] text-[11px] font-bold">{item.num}</span>
                      <span className="uppercase tracking-wide">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-4 border-t border-zinc-100">
                <div className="font-fraunces text-base font-medium text-zinc-900 tracking-tight">
                  Start before January. Finish with proof.
                </div>
                <div className="font-mono-code text-[11px] font-semibold text-[#FF4500] uppercase tracking-[0.18em] mt-1">
                  WINTER ARC 2026
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/build"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#FF4500] hover:underline font-mono-code uppercase tracking-wider"
              >
                Create Your Customized Contract →
              </Link>
            </div>
          </div>
        </section>

        {/* STALKR TESTIMONIAL BANNER (LIGHT MODE) */}
        <section aria-label="Customer testimonial" className="relative z-10 border-y border-zinc-200/70 bg-zinc-50/70">
          <figure className="mx-auto grid max-w-[1180px] items-center gap-7 px-6 py-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-10 md:py-12">
            <blockquote className="relative max-w-[820px] border-l-2 border-[#FF4500] pl-5 text-[22px] font-fraunces font-medium leading-[1.35] tracking-[-0.025em] text-zinc-900 sm:pl-7 sm:text-[27px] md:text-[30px]">
              “I set my 90-day Winter Arc contract on October 1st. By January 1st, I had completed 90 straight days of execution with proof.”
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FF4500]/10 border border-[#FF4500]/30 flex items-center justify-center text-[#FF4500] font-bold font-fraunces text-lg">
                WA
              </div>
              <cite className="not-italic">
                <span className="block text-[14px] font-semibold leading-tight text-zinc-900">Jack F.</span>
                <span className="mt-1 block text-[12.5px] leading-none text-zinc-500">@jackfriks</span>
              </cite>
            </div>
          </figure>
        </section>

        {/* ====================================================================
           3. FREE CONTRACT SECTION
           ==================================================================== */}
        <section className="max-w-[1200px] mx-auto px-6 py-20 border-t border-zinc-200/60">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF4500] flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF4500]"></span>
              FREE ACQUISITION
            </span>
            <h2 className="font-funnel text-4xl sm:text-5xl text-zinc-900 font-semibold uppercase leading-[0.98] tracking-tight">
              BUILD YOUR ARC. <br />
              <span className="font-fraunces text-[#FF4500] normal-case italic font-normal">Make it real.</span>
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base font-medium leading-relaxed pt-1">
              Choose 4–6 commitments that actually fit your life. No extreme rules. No perfect streak required. No restarting from zero.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card-wise card-wise-hover p-6 sm:p-8 space-y-3 bg-white border border-zinc-200/80">
              <div className="font-mono-code text-sm font-bold text-[#FF4500]">01</div>
              <h3 className="font-funnel text-2xl font-semibold text-zinc-900 uppercase tracking-tight">CHOOSE</h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Pick 4–6 commitments that fit your goals and schedule.
              </p>
            </div>

            <div className="card-wise card-wise-hover p-6 sm:p-8 space-y-3 bg-white border border-zinc-200/80">
              <div className="font-mono-code text-sm font-bold text-[#FF4500]">02</div>
              <h3 className="font-funnel text-2xl font-semibold text-zinc-900 uppercase tracking-tight">COMMIT</h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Set your 90-day start date and lock in your window.
              </p>
            </div>

            <div className="card-wise card-wise-hover p-6 sm:p-8 space-y-3 bg-white border border-zinc-200/80">
              <div className="font-mono-code text-sm font-bold text-[#FF4500]">03</div>
              <h3 className="font-funnel text-2xl font-semibold text-zinc-900 uppercase tracking-tight">SHARE</h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Generate your personal Arc contract to download and share.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/build"
              className="btn-wise-primary px-8 py-4 text-sm font-medium active:scale-95"
            >
              <span>BUILD MY WINTER ARC</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </section>

        {/* ====================================================================
           4. FREE → PAID TRANSITION (CLEAN TWO-COLUMN COMPARISON)
           ==================================================================== */}
        <section className="max-w-[1200px] mx-auto px-6 py-20 border-t border-zinc-200/60">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF4500]">
              THE VALUE PROPOSITION
            </span>
            <h2 className="font-funnel text-4xl sm:text-5xl text-zinc-900 font-semibold uppercase leading-[0.98] tracking-tight">
              MAKE THE COMMITMENT. <br />
              <span className="font-fraunces text-[#FF4500] normal-case italic font-normal">Then keep it.</span>
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm font-medium">
              The free product helps you MAKE the commitment. The paid product helps you KEEP it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FREE CONTRACT COLUMN */}
            <div className="card-wise card-wise-hover p-8 sm:p-10 space-y-6 bg-white border border-zinc-200/80 flex flex-col justify-between shadow-[0_20px_60px_-20px_rgba(24,24,27,0.06)]">
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-mono-code text-zinc-400 font-semibold uppercase tracking-wider">FREE CONTRACT</div>
                  <div className="text-4xl font-funnel font-bold text-zinc-900 mt-1">$0</div>
                  <div className="text-xs text-zinc-500 font-mono-code font-medium mt-1">100% free • No account required</div>
                </div>

                <div className="space-y-3 text-xs font-medium border-t border-zinc-100 pt-6">
                  {[
                    'Choose 4–6 commitments',
                    'Create your Winter Arc',
                    'Generate your contract card',
                    'Download high-res PNG',
                    'Share to Stories & TikTok'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#FF4500] shrink-0" />
                      <span className="text-zinc-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/build"
                  className="btn-wise-secondary w-full py-4 text-xs font-semibold text-center block"
                >
                  BUILD MY ARC
                </Link>
              </div>
            </div>

            {/* PAID 90-DAY SYSTEM COLUMN (STALKR HIGHLIGHTED LIGHT CARD) */}
            <div className="card-wise card-wise-hover p-8 sm:p-10 space-y-6 bg-white border-2 border-[#FF4500] flex flex-col justify-between shadow-[0_20px_60px_-15px_rgba(255,69,0,0.12)]">
              <div className="space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#FF4500] text-white text-[10.5px] font-mono-code font-semibold uppercase mb-2">
                    90-DAY SYSTEM
                  </div>
                  <div className="text-4xl font-funnel font-bold text-zinc-900">$19 <span className="text-xs font-mono-code text-[#FF4500] uppercase font-bold">ONE TIME</span></div>
                  <div className="text-xs text-zinc-500 font-mono-code font-medium mt-1">Full 90-day tracking • Lifetime access</div>
                </div>

                <div className="space-y-3 text-xs font-medium border-t border-zinc-100 pt-6">
                  {[
                    'Everything in the free contract',
                    'Daily 20-second check-ins',
                    '90-day progress tracking grid',
                    'Weekly reflection & review log',
                    'Arc history archive',
                    'Verified Day 90 completion proof'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#FF4500] shrink-0" />
                      <span className="text-zinc-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/unlock"
                  className="btn-wise-orange w-full py-4 text-xs font-semibold text-center block"
                >
                  UNLOCK MY 90 DAYS — $19
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
           5. STALKR STEP-BY-STEP METHOD ("HOW IT WORKS" 01, 02, 03)
           ==================================================================== */}
        <section id="how-it-works" className="relative max-w-[1200px] mx-auto px-6 py-24 border-t border-zinc-200/60">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF4500]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF4500]"></span>
              From commitment to proof
            </div>
            <h2 className="mt-3 text-[32px] sm:text-[46px] md:text-[56px] font-semibold leading-[1.01] tracking-[-0.025em] text-zinc-900 font-funnel uppercase">
              Know your non-negotiables.<br />
              <span className="font-fraunces text-[#FF4500] normal-case italic font-normal">See what needs execution.</span>
            </h2>
            <p className="mt-5 max-w-[620px] text-[15px] leading-relaxed text-zinc-500 md:text-[17px]">
              Winter Arc watches your 90-day progress and turns raw daily check-ins into verified proof of consistency.
            </p>
          </div>

          {/* Stalkr Light Timeline Steps */}
          <div className="relative mt-16 md:mt-20">
            <ol className="space-y-12 md:space-y-16">
              <li className="relative grid grid-cols-[auto_1fr] gap-5 md:gap-10">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center md:h-[52px] md:w-[52px]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white ring-1 ring-zinc-200 text-zinc-900 font-mono-code font-bold text-xs md:text-sm shadow-sm">
                    01
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-2xl md:text-3xl font-semibold font-funnel text-zinc-900 uppercase tracking-tight">Choose 4–6 Commitments.</h3>
                  <p className="mt-2 max-w-xl text-zinc-500 text-sm md:text-base leading-relaxed">
                    Tell Winter Arc what to watch. Add your physical training, reading, deep work, sleep, and digital boundaries.
                  </p>
                </div>
              </li>

              <li className="relative grid grid-cols-[auto_1fr] gap-5 md:gap-10">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center md:h-[52px] md:w-[52px]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white ring-1 ring-zinc-200 text-zinc-900 font-mono-code font-bold text-xs md:text-sm shadow-sm">
                    02
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-2xl md:text-3xl font-semibold font-funnel text-zinc-900 uppercase tracking-tight">20-Second Daily Check-ins.</h3>
                  <p className="mt-2 max-w-xl text-zinc-500 text-sm md:text-base leading-relaxed">
                    Check in every evening. Toggle your completed non-negotiables in seconds and keep your momentum active.
                  </p>
                </div>
              </li>

              <li className="relative grid grid-cols-[auto_1fr] gap-5 md:gap-10">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center md:h-[52px] md:w-[52px]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white ring-1 ring-zinc-200 text-zinc-900 font-mono-code font-bold text-xs md:text-sm shadow-sm">
                    03
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-2xl md:text-3xl font-semibold font-funnel text-zinc-900 uppercase tracking-tight">Finish With Verified Proof.</h3>
                  <p className="mt-2 max-w-xl text-zinc-500 text-sm md:text-base leading-relaxed">
                    Complete your 90 days with an automated, shareable proof card showing your completion rate and milestone stats.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* ====================================================================
           6. FAQ SECTION
           ==================================================================== */}
        <section id="faq" className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-200/60">
          <div className="text-center mb-16 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF4500]">
              QUESTIONS & ANSWERS
            </span>
            <h2 className="font-funnel text-4xl sm:text-5xl text-zinc-900 font-semibold uppercase leading-[0.98] tracking-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="card-wise bg-white border border-zinc-200/80 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-funnel text-lg sm:text-xl font-semibold text-zinc-900 uppercase tracking-tight"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#FF4500] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed border-t border-zinc-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ====================================================================
           7. FINAL CTA
           ==================================================================== */}
        <section className="max-w-4xl mx-auto px-6 py-24 text-center border-t border-zinc-200/60">
          <h2 className="font-funnel text-4xl sm:text-6xl font-semibold text-zinc-900 uppercase leading-[0.95] tracking-tight">
            JANUARY IS COMING. <br />
            <span className="font-fraunces text-[#FF4500] normal-case italic font-normal">Don't wait for it.</span>
          </h2>
          <p className="mt-6 text-[#FF4500] font-funnel text-2xl sm:text-3xl font-bold uppercase tracking-tight">
            Build your Winter Arc today.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3">
            <Link
              href="/build"
              onClick={handleHeroCtaClick}
              className="group flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-8 text-[15px] font-medium bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 transition-all shadow-md"
            >
              <span>BUILD MY WINTER ARC</span>
              <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5" />
            </Link>
            <div className="text-xs font-mono-code text-zinc-500 font-medium pt-1">
              Free • Takes 30 seconds • No credit card
            </div>
          </div>
        </section>
      </main>

      {/* STICKY MOBILE BOTTOM CTA BAR */}
      <div className="md:hidden sticky bottom-0 z-40 w-full p-3 bg-white/95 border-t border-zinc-200 backdrop-blur-md">
        <Link
          href="/build"
          onClick={handleHeroCtaClick}
          className="btn-wise-primary w-full py-3.5 text-xs font-medium text-center justify-center"
        >
          BUILD MY WINTER ARC — FREE
        </Link>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200/60 py-6 text-center text-xs text-zinc-500 font-mono-code">
        WINTER ARC 2026 • START BEFORE JANUARY. FINISH WITH PROOF.
      </footer>
    </div>
  );
}
