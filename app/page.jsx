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
    <div className="w-full bg-[#07080a] text-slate-100 min-h-screen">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07080a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center">
              <Flame className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <span className="font-editorial text-lg tracking-wide font-medium text-slate-100">
                WINTER ARC
              </span>
              <span className="text-[10px] font-mono-code text-slate-500 block -mt-1 tracking-widest">
                2026 MVP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-medium text-slate-300 hover:text-slate-100 px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              Build My Arc
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-slate-300 font-mono-code mb-8">
          <Flame className="w-3.5 h-3.5 text-sky-400" />
          <span>WINTER ARC 2026 • 90-DAY ACCOUNTABILITY</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-slate-100 leading-[1.1] max-w-4xl mx-auto">
          Start before January. <br />
          <span className="italic font-light text-sky-400">Finish with proof.</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
          Choose 4–6 commitments. Track them for 90 days. Build momentum before the new year.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base transition-all shadow-[0_0_30px_rgba(56,189,248,0.4)] flex items-center justify-center gap-2 group"
          >
            Build My Winter Arc
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-slate-300 font-medium text-base transition-all flex items-center justify-center text-center"
          >
            See how it works
          </a>
        </div>

        {/* Sleek Product Showcase Card */}
        <div className="mt-16 max-w-4xl mx-auto text-left">
          <div className="frost-glass rounded-3xl p-6 sm:p-10 border border-white/10 glow-subtle relative overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-950">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-5 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-xs font-mono-code text-sky-400 uppercase tracking-widest">
                  PRODUCT EXPERIENCE PREVIEW
                </span>
              </div>
              <span className="text-xs font-mono-code text-slate-500">90-Day Personal Arc</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <h3 className="font-editorial text-2xl sm:text-3xl text-slate-100 font-normal">
                  Track 4–6 non-negotiable personal commitments.
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every day, check off what you completed. If life gets busy and you miss a day, your Arc never resets. Keep building forward.
                </p>
                <div className="pt-2">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 font-mono-code uppercase tracking-wider"
                  >
                    Start Your Arc Now →
                  </Link>
                </div>
              </div>

              {/* Sample Interactive Checkbox Mock */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                <div className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider mb-3">
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
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        checked
                          ? 'bg-sky-500/[0.08] border-sky-500/30 text-slate-100'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                            checked ? 'bg-sky-400 text-slate-950' : 'border border-slate-700 bg-slate-900'
                          }`}
                        >
                          {checked && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                        </div>
                        <span className={`text-xs font-medium ${checked ? 'line-through text-slate-300' : ''}`}>
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono-code px-2 py-0.5 rounded bg-white/[0.04] text-slate-400">
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
            <span className="text-xs font-mono-code text-sky-400 uppercase tracking-widest">
              01 • PHILOSOPHY
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-slate-100 font-normal mt-3 leading-snug">
              What is Winter Arc?
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-slate-300 leading-relaxed text-base sm:text-lg">
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
          <span className="text-xs font-mono-code text-sky-400 uppercase tracking-widest">
            02 • FRAMEWORK
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-slate-100 mt-2">
            How it works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Choose', desc: 'Pick 4–6 non-negotiable personal commitments.' },
            { step: '02', title: 'Show up', desc: 'Check in every day and complete weekly reviews.' },
            { step: '03', title: 'Finish', desc: 'Complete 90 days with verified proof of execution.' }
          ].map((card) => (
            <div key={card.step} className="frost-glass rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="font-mono-code text-sky-400 text-sm font-bold mb-4">{card.step} —</div>
              <h3 className="font-editorial text-2xl text-slate-100 mb-3">{card.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
        <div className="frost-glass rounded-3xl p-8 sm:p-12 border border-white/10">
          <span className="text-xs font-mono-code text-sky-400 uppercase tracking-widest">03 • REALITY</span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-slate-100 mt-2">Built for real life.</h2>
          <div className="mt-6 text-xl text-sky-400 font-editorial italic">"Miss a day? Keep going."</div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center border-t border-white/[0.06]">
        <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-slate-100">
          Your January self doesn't need another resolution.
        </h2>
        <p className="mt-4 text-sky-400 font-editorial text-2xl italic">Start now.</p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/signup"
            className="px-10 py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base transition-all shadow-[0_0_35px_rgba(56,189,248,0.5)]"
          >
            Build My Winter Arc
          </Link>
        </div>
      </section>
    </div>
  );
}
