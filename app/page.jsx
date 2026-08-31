'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Flame, Sparkles, ShieldCheck, Check } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const [mockChecks, setMockChecks] = useState({
    c1: true,
    c2: true,
    c3: false,
    c4: true,
    c5: true
  });

  const toggleMock = (id) => {
    setMockChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(mockChecks).filter(Boolean).length;

  return (
    <div className="w-full bg-[#0b0c0a] text-slate-100 min-h-screen flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0b0c0a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#9fe870] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 text-[#163300]" />
            </div>
            <div>
              <span className="font-editorial text-lg tracking-tight font-black text-slate-100">
                WINTER ARC
              </span>
              <span className="text-[10px] font-mono-code text-[#9fe870] block -mt-1 tracking-widest uppercase font-bold">
                2026 SYSTEM
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
            <Link
              href="/build"
              className="btn-wise-primary text-xs px-5 py-2"
            >
              Build My Arc Free
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e2f6d5] text-[#163300] font-mono-code text-xs font-bold mb-8">
            <Flame className="w-4 h-4 text-[#163300]" />
            <span>WINTER ARC 2026 • 90-DAY ACCOUNTABILITY</span>
          </div>

          <h1 className="font-display-wise text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-100 uppercase max-w-5xl mx-auto leading-[0.85]">
            START BEFORE JANUARY. <br />
            <span className="text-[#9fe870]">FINISH WITH PROOF.</span>
          </h1>

          <p className="mt-8 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-sans font-semibold leading-relaxed">
            Build your Winter Arc in 30 seconds. Choose 4–6 commitments. Create your contract. Then track your next 90 days.
          </p>

          {/* PRIMARY CTA FOR FREE CONTRACT BUILDER */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/build"
                className="btn-wise-primary px-10 py-5 text-lg font-black gap-2 group w-full sm:w-auto shadow-[0_0_35px_rgba(159,232,112,0.4)]"
              >
                <span>Build My Winter Arc</span>
                <ArrowRight className="w-5 h-5 text-[#163300] group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#how-it-works"
                className="btn-wise-secondary px-8 py-5 text-base w-full sm:w-auto font-bold"
              >
                See how it works
              </a>
            </div>

            <div className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-wider flex items-center gap-1.5 pt-1">
              <span>Free to create • Takes 30 seconds • No credit card required</span>
            </div>
          </div>

          {/* Sleek Product Showcase Card */}
          <div className="mt-16 max-w-4xl mx-auto text-left">
            <div className="card-wise p-6 sm:p-10 relative overflow-hidden bg-gradient-to-br from-[#121510] to-[#0b0c0a]">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-5 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9fe870] animate-pulse" />
                  <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
                    FREE CONTRACT PREVIEW
                  </span>
                </div>
                <span className="text-xs font-mono-code text-slate-400 font-semibold">Instant Poster Generator</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <h3 className="font-display-wise text-3xl sm:text-4xl text-slate-100 font-black uppercase leading-[0.88]">
                    Make your commitment official.
                  </h3>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    Build a crisp shareable contract card with your name, selected commitments, and 90-day trajectory.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/build"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#9fe870] hover:underline font-mono-code uppercase tracking-wider hover:scale-105 transition-transform"
                    >
                      Generate Free Contract Now →
                    </Link>
                  </div>
                </div>

                {/* Sample Checklist Mock */}
                <div className="p-4 sm:p-5 rounded-[24px] bg-[#0e100c] border border-white/[0.08] space-y-2.5">
                  <div className="text-[11px] font-mono-code text-[#9fe870] uppercase tracking-wider mb-3 font-bold">
                    Sample Contract ({completedCount} / 5 complete)
                  </div>

                  {[
                    { id: 'c1', label: 'Train 45 mins', category: 'BODY' },
                    { id: 'c2', label: 'Read 20 pages', category: 'MIND' },
                    { id: 'c3', label: 'No phone before 9 AM', category: 'FOCUS' },
                    { id: 'c4', label: 'Deep work 60 mins', category: 'FOCUS' },
                    { id: 'c5', label: 'Sleep 7+ hours', category: 'BODY' }
                  ].map((item) => {
                    const checked = mockChecks[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleMock(item.id)}
                        className={`flex items-center justify-between p-3 rounded-full border transition-all cursor-pointer select-none ${
                          checked
                            ? 'bg-[#9fe870]/10 border-[#9fe870]/40 text-slate-100'
                            : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                              checked ? 'bg-[#9fe870] text-[#163300]' : 'border border-slate-700 bg-slate-900'
                            }`}
                          >
                            {checked && <CheckCircle2 className="w-3.5 h-3.5 text-[#163300]" />}
                          </div>
                          <span className={`text-xs font-semibold ${checked ? 'line-through text-slate-300' : ''}`}>
                            {item.label}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono-code px-2 py-0.5 rounded-full bg-[#e2f6d5] text-[#163300] font-bold">
                          {item.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: HOW IT WORKS (FREE ACQUISITION MECHANISM PROMINENT) */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
          <div className="text-center mb-16">
            <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
              01 • FRAMEWORK
            </span>
            <h2 className="font-display-wise text-4xl sm:text-6xl text-slate-100 font-black uppercase mt-2 leading-[0.85]">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 01 - BUILD (FREE PROMINENT) */}
            <div className="card-wise p-6 sm:p-8 bg-[#182113] border-2 border-[#9fe870] hover:scale-105 transition-transform">
              <div className="inline-block px-3 py-1 rounded-full bg-[#9fe870] text-[#163300] font-mono-code text-[11px] font-black uppercase mb-4">
                FREE STEP 01
              </div>
              <h3 className="font-display-wise text-3xl text-slate-100 font-black uppercase mb-3 leading-[0.9]">
                BUILD
              </h3>
              <p className="text-sm text-slate-200 font-bold leading-relaxed mb-4">
                Choose 4–6 commitments and create your Arc contract in 30 seconds.
              </p>
              <Link
                href="/build"
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#9fe870] hover:underline font-mono-code uppercase tracking-wider"
              >
                Create Free Contract →
              </Link>
            </div>

            {/* Step 02 - SHOW UP */}
            <div className="card-wise p-6 sm:p-8 bg-[#141712]">
              <div className="font-mono-code text-[#9fe870] text-sm font-bold mb-4">02 —</div>
              <h3 className="font-display-wise text-3xl text-slate-100 font-black uppercase mb-3 leading-[0.9]">
                SHOW UP
              </h3>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Track your commitments every day and review progress every 7 days.
              </p>
            </div>

            {/* Step 03 - FINISH */}
            <div className="card-wise p-6 sm:p-8 bg-[#141712]">
              <div className="font-mono-code text-[#9fe870] text-sm font-bold mb-4">03 —</div>
              <h3 className="font-display-wise text-3xl text-slate-100 font-black uppercase mb-3 leading-[0.9]">
                FINISH
              </h3>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Complete your 90 days with verified proof of your transformation.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: PAID PRODUCT SECTION (THE 90-DAY SYSTEM) */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
          <div className="card-wise p-8 sm:p-12 bg-gradient-to-br from-[#182113] via-[#141712] to-[#0b0c0a] border-2 border-[#9fe870]">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#9fe870] text-[#163300] font-mono-code text-xs font-black uppercase mb-4">
              <Sparkles className="w-4 h-4 text-[#163300]" /> THE 90-DAY SYSTEM
            </div>

            <div className="max-w-3xl space-y-4">
              <h2 className="font-display-wise text-4xl sm:text-6xl text-slate-100 font-black uppercase leading-[0.85]">
                Your contract is the commitment. <br />
                <span className="text-[#9fe870]">The dashboard is how you keep it.</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-200 font-semibold leading-relaxed">
                Unlock full access to daily check-ins, 90-day progress tracking, weekly reflection logs, and missed-day recovery.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 text-xs font-bold">
                <div className="p-4 rounded-full bg-[#161813] border border-white/[0.08] flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#9fe870] stroke-[3]" />
                  <span>Daily 20-second check-ins</span>
                </div>
                <div className="p-4 rounded-full bg-[#161813] border border-white/[0.08] flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#9fe870] stroke-[3]" />
                  <span>90-day consistency calendar grid</span>
                </div>
                <div className="p-4 rounded-full bg-[#161813] border border-white/[0.08] flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#9fe870] stroke-[3]" />
                  <span>Weekly reflection log & review</span>
                </div>
                <div className="p-4 rounded-full bg-[#161813] border border-white/[0.08] flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#9fe870] stroke-[3]" />
                  <span>Verified Day 90 completion proof</span>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/[0.08]">
                <div>
                  <div className="text-3xl font-display-wise font-black text-slate-100">
                    $19 <span className="text-xs font-mono-code text-[#9fe870] uppercase font-bold">ONE TIME</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono-code font-bold">
                    Full 90-day system • Lifetime access
                  </div>
                </div>

                <Link
                  href="/build"
                  className="btn-wise-primary px-8 py-4 text-base font-black w-full sm:w-auto shadow-[0_0_30px_rgba(159,232,112,0.4)]"
                >
                  UNLOCK FOR $19
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL HERO CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center border-t border-white/[0.06]">
          <h2 className="font-display-wise text-4xl sm:text-6xl font-black text-slate-100 uppercase leading-[0.85]">
            Your January self doesn't need another resolution.
          </h2>
          <p className="mt-6 text-[#9fe870] font-display-wise text-3xl font-black uppercase">Start now.</p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/build"
              className="btn-wise-primary px-10 py-5 text-lg font-extrabold"
            >
              Build My Winter Arc
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.06] py-6 text-center text-xs text-slate-400 font-mono-code font-bold">
        WINTER ARC 2026 • START BEFORE JANUARY. FINISH WITH PROOF.
      </footer>
    </div>
  );
}
