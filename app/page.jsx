'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Flame } from 'lucide-react';

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
    <div className="w-full bg-[#0b0c0a] text-slate-100 min-h-screen">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0b0c0a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#9fe870] flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#163300]" />
            </div>
            <div>
              <span className="font-editorial text-lg tracking-tight font-black text-slate-100">
                WINTER ARC
              </span>
              <span className="text-[10px] font-mono-code text-[#9fe870] block -mt-1 tracking-widest uppercase font-bold">
                2026 MVP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded-full hover:bg-white/[0.05] transition-all hover:scale-105"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn-wise-primary text-xs px-5 py-2"
            >
              Build My Arc
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e2f6d5] text-[#163300] font-mono-code text-xs font-bold mb-8">
          <Flame className="w-4 h-4 text-[#163300]" />
          <span>WINTER ARC 2026 • 90-DAY SYSTEM</span>
        </div>

        <h1 className="font-display-wise text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-100 uppercase max-w-5xl mx-auto leading-[0.85]">
          Start before January. <br />
          <span className="text-[#9fe870]">Finish with proof.</span>
        </h1>

        <p className="mt-8 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-sans font-semibold leading-relaxed">
          Choose 4–6 non-negotiable commitments. Track them for 90 days. Build momentum before the new year.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="btn-wise-primary px-8 py-4 text-base gap-2 group w-full sm:w-auto"
          >
            <span>Build My Winter Arc</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="#how-it-works"
            className="btn-wise-secondary px-8 py-4 text-base w-full sm:w-auto"
          >
            See how it works
          </a>
        </div>

        {/* Sleek Product Showcase Card */}
        <div className="mt-16 max-w-4xl mx-auto text-left">
          <div className="card-wise p-6 sm:p-10 relative overflow-hidden bg-gradient-to-br from-[#121510] to-[#0b0c0a]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-5 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9fe870] animate-pulse" />
                <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
                  PRODUCT EXPERIENCE PREVIEW
                </span>
              </div>
              <span className="text-xs font-mono-code text-slate-400 font-semibold">90-Day Personal Arc</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <h3 className="font-display-wise text-3xl sm:text-4xl text-slate-100 font-black uppercase leading-[0.88]">
                  Track 4–6 personal commitments.
                </h3>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  Every day, check off what you completed. If life gets busy and you miss a day, your Arc never resets. Keep building forward.
                </p>
                <div className="pt-2">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#9fe870] hover:underline font-mono-code uppercase tracking-wider hover:scale-105 transition-transform"
                  >
                    Start Your Arc Now →
                  </Link>
                </div>
              </div>

              {/* Sample Interactive Checkbox Mock */}
              <div className="p-4 sm:p-5 rounded-[24px] bg-[#0e100c] border border-white/[0.08] space-y-2.5">
                <div className="text-[11px] font-mono-code text-[#9fe870] uppercase tracking-wider mb-3 font-bold">
                  Sample Daily Check-In ({completedCount} / 5 complete)
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
                      <span className="text-[9px] font-mono-code px-2 py-0.5 rounded-full bg-white/[0.06] text-[#9fe870] font-bold">
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

      {/* Section 1 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
              01 • PHILOSOPHY
            </span>
            <h2 className="font-display-wise text-4xl sm:text-5xl text-slate-100 font-black uppercase mt-3 leading-[0.88]">
              What is Winter Arc?
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-slate-300 leading-relaxed text-base sm:text-lg font-medium">
            <p>
              Winter Arc is your <strong>90-day commitment</strong> to becoming more consistent before the new year.
            </p>
            <p className="text-slate-400">
              Your Arc can be about fitness, reading, sleep, studying, work, focus, personal projects, or whatever matters to you.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center mb-16">
          <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
            02 • FRAMEWORK
          </span>
          <h2 className="font-display-wise text-4xl sm:text-6xl text-slate-100 font-black uppercase mt-2 leading-[0.85]">
            How it works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Choose', desc: 'Pick 4–6 non-negotiable personal commitments.' },
            { step: '02', title: 'Show up', desc: 'Check in every day and complete weekly reviews.' },
            { step: '03', title: 'Finish', desc: 'Complete 90 days with verified proof of execution.' }
          ].map((card) => (
            <div key={card.step} className="card-wise p-6 sm:p-8">
              <div className="font-mono-code text-[#9fe870] text-sm font-bold mb-4">{card.step} —</div>
              <h3 className="font-display-wise text-3xl text-slate-100 font-black uppercase mb-3 leading-[0.9]">{card.title}</h3>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
        <div className="card-wise p-8 sm:p-12">
          <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">03 • REALITY</span>
          <h2 className="font-display-wise text-4xl sm:text-6xl text-slate-100 font-black uppercase mt-2 leading-[0.85]">Built for real life.</h2>
          <div className="mt-6 text-2xl text-[#9fe870] font-display-wise uppercase font-black tracking-tight">"Miss a day? Keep going."</div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center border-t border-white/[0.06]">
        <h2 className="font-display-wise text-4xl sm:text-6xl font-black text-slate-100 uppercase leading-[0.85]">
          Your January self doesn't need another resolution.
        </h2>
        <p className="mt-6 text-[#9fe870] font-display-wise text-3xl font-black uppercase">Start now.</p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/signup"
            className="btn-wise-primary px-10 py-5 text-lg font-extrabold"
          >
            Build My Winter Arc
          </Link>
        </div>
      </section>
    </div>
  );
}
