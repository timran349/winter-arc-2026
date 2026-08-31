import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Calendar, Award, Flame, RefreshCw } from 'lucide-react';

export default function LandingPage({ onStartOnboarding, onDemoExplore }) {
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
    <div className="w-full bg-[#0b0c0a] text-slate-100">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e2f6d5] text-[#163300] text-xs font-mono-code font-bold mb-8">
          <Flame className="w-3.5 h-3.5 text-[#163300]" />
          <span>WINTER ARC 2026 • 90-DAY ACCOUNTABILITY</span>
        </div>

        <h1 className="font-display-wise text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-slate-100 leading-[0.85] max-w-4xl mx-auto">
          Start before January. <br />
          <span className="text-[#9fe870]">Finish with proof.</span>
        </h1>

        <p className="mt-8 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-semibold leading-relaxed">
          Choose 4–6 commitments. Track them for 90 days. Build momentum before the new year.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartOnboarding}
            className="btn-wise-primary w-full sm:w-auto px-8 py-4 text-base font-extrabold gap-2 group"
          >
            <span>Build My Winter Arc</span>
            <ArrowRight className="w-4 h-4 text-[#163300] group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('how-it-works');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-wise-secondary w-full sm:w-auto px-8 py-4 text-base font-bold"
          >
            See how it works
          </button>
        </div>

        {/* VISUAL DASHBOARD PREVIEW WIDGET */}
        <div className="mt-16 max-w-4xl mx-auto text-left">
          <div className="card-wise p-6 sm:p-8 relative overflow-hidden bg-gradient-to-b from-[#141712] to-[#0b0c0a]">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-5 mb-6">
              <div>
                <div className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-widest">
                  LIVE DASHBOARD PREVIEW
                </div>
                <div className="font-display-wise text-2xl text-slate-100 font-black uppercase mt-1">
                  MY WINTER ARC <span className="text-slate-400 text-sm font-bold ml-2">Day 18 of 90</span>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e2f6d5] text-[#163300] font-mono-code text-xs font-bold">
                  20% COMPLETE
                </div>
                <div className="text-[11px] text-slate-400 font-mono-code mt-1 font-bold">72 days remaining</div>
              </div>
            </div>

            {/* Commitments Interactive Checklist */}
            <div className="space-y-3">
              <div className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-wider mb-2">
                Today's Commitments ({completedCount} / 5 complete)
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
                    className={`flex items-center justify-between p-4 rounded-full border transition-all cursor-pointer select-none px-6 ${
                      checked
                        ? 'bg-[#9fe870]/10 border-[#9fe870]/40 text-slate-100 scale-105'
                        : 'bg-[#141712] border-white/[0.08] text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          checked
                            ? 'bg-[#9fe870] text-[#163300]'
                            : 'border border-slate-700 bg-slate-950'
                        }`}
                      >
                        {checked && <CheckCircle2 className="w-4 h-4 text-[#163300]" />}
                      </div>
                      <span className={`text-sm font-bold ${checked ? 'line-through text-slate-300' : ''}`}>
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-code px-3 py-1 rounded-full bg-[#e2f6d5] text-[#163300] font-bold">
                      {item.category}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Interactive Preview • Click toggles to test</span>
              <button
                onClick={onDemoExplore}
                className="text-[#9fe870] font-bold hover:underline"
              >
                Launch Demo App →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: WHAT IS WINTER ARC? */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-widest">
              01 • PHILOSOPHY
            </span>
            <h2 className="font-display-wise text-3xl sm:text-4xl text-slate-100 font-black uppercase mt-3 leading-[0.88]">
              What is Winter Arc?
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-slate-300 font-medium text-base sm:text-lg">
            <p>
              Winter Arc is your <strong className="text-[#9fe870]">90-day commitment</strong> to becoming more consistent before the new year.
            </p>
            <p className="text-slate-400">
              Your Arc can be about fitness, reading, sleep, studying, work, focus, personal projects, or whatever matters to you. It's an editorial framework for real personal growth.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center mb-16">
          <span className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-widest">
            02 • FRAMEWORK
          </span>
          <h2 className="font-display-wise text-4xl sm:text-6xl text-slate-100 font-black uppercase mt-2 leading-[0.85]">
            How it works
          </h2>
          <p className="text-slate-300 font-semibold text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Three simple steps to build undeniable momentum before January 1st.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Choose',
              desc: 'Pick 4–6 non-negotiable personal commitments across body, mind, focus, or life.'
            },
            {
              step: '02',
              title: 'Show up',
              desc: 'Check in every day in under 20 seconds and complete weekly reflections every 7 days.'
            },
            {
              step: '03',
              title: 'Finish',
              desc: 'Complete your 90 days with a verified record and a beautiful shareable proof card.'
            }
          ].map((card) => (
            <div
              key={card.step}
              className="card-wise p-6 sm:p-8 group hover:scale-105 bg-[#141712]"
            >
              <div className="font-mono-code text-[#9fe870] text-sm font-bold tracking-wider mb-4">
                {card.step} —
              </div>
              <h3 className="font-display-wise text-2xl text-slate-100 font-black uppercase mb-3 group-hover:text-[#9fe870] transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: BUILT FOR REAL LIFE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-white/[0.06]">
        <div className="card-wise p-8 sm:p-12 bg-gradient-to-b from-[#141712] to-[#0b0c0a]">
          <div className="max-w-3xl">
            <span className="text-xs font-mono-code text-[#9fe870] font-bold uppercase tracking-widest">
              03 • REALITY
            </span>
            <h2 className="font-display-wise text-4xl sm:text-5xl text-slate-100 font-black uppercase mt-2 leading-[0.88]">
              Built for real life.
            </h2>

            <div className="mt-8 space-y-4">
              <div className="text-xl sm:text-2xl text-[#9fe870] font-mono-code font-bold uppercase">
                "Miss a day? Keep going."
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-5 rounded-[24px] bg-[#161813] border border-white/[0.08]">
                  <div className="text-sm font-extrabold text-slate-200 uppercase">No punishment.</div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">Life happens. We celebrate consistency over artificial perfection.</div>
                </div>

                <div className="p-5 rounded-[24px] bg-[#161813] border border-white/[0.08]">
                  <div className="text-sm font-extrabold text-slate-200 uppercase">No restart from zero.</div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">One off-day will never erase the 20 days you showed up for.</div>
                </div>

                <div className="p-5 rounded-[24px] bg-[#161813] border border-white/[0.08]">
                  <div className="text-sm font-extrabold text-slate-200 uppercase">No streak anxiety.</div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">Focus on your 90-day trajectory, not fragile counter numbers.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center border-t border-white/[0.06]">
        <h2 className="font-display-wise text-4xl sm:text-6xl font-black text-slate-100 uppercase leading-[0.85]">
          Your January self doesn't need <br />
          another resolution.
        </h2>
        <p className="mt-4 text-[#9fe870] font-mono-code text-2xl font-bold uppercase tracking-wide">Start now.</p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartOnboarding}
            className="btn-wise-primary w-full sm:w-auto px-10 py-4 text-base font-extrabold gap-2 group"
          >
            <span>Build My Winter Arc</span>
            <ArrowRight className="w-4 h-4 text-[#163300] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
