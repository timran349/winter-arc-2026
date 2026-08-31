'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowRight, ArrowLeft, Check, Plus, ShieldCheck, AlertCircle } from 'lucide-react';
import { calculateEndDate, formatShortDate } from '@/lib/dates';

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

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);

  // Step 1 State
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('2026-10-01');

  // Step 2 State
  const [selectedCommitments, setSelectedCommitments] = useState([
    { id: '1', name: 'Train 4× / week', category: 'BODY' },
    { id: '2', name: 'Read 20 pages', category: 'MIND' },
    { id: '3', name: 'No morning scrolling', category: 'FOCUS' },
    { id: '4', name: 'Deep work 60 min', category: 'FOCUS' }
  ]);
  const [customInput, setCustomInput] = useState('');

  // Step 3 State
  const [intention, setIntention] = useState('Get focused');
  const [customIntention, setCustomIntention] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push('/login');
        } else {
          setUser(data.user);
          if (data.user.name) setName(data.user.name);
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const endDate = calculateEndDate(startDate, 90);

  const isSelected = (nameStr) => selectedCommitments.some(c => c.name.toLowerCase() === nameStr.toLowerCase());

  const toggleSuggested = (item, cat) => {
    if (isSelected(item)) {
      setSelectedCommitments(prev => prev.filter(c => c.name.toLowerCase() !== item.toLowerCase()));
    } else {
      if (selectedCommitments.length >= 6) return;
      setSelectedCommitments(prev => [...prev, { id: 'c_' + Date.now() + Math.random(), name: item, category: cat }]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customInput.trim() || selectedCommitments.length >= 6) return;
    setSelectedCommitments(prev => [...prev, { id: 'c_' + Date.now(), name: customInput.trim(), category: 'CUSTOM' }]);
    setCustomInput('');
  };

  const handleRemoveCommitment = (id) => {
    setSelectedCommitments(prev => prev.filter(c => c.id !== id));
  };

  const handleFinalSubmit = async () => {
    setError('');
    setSubmitting(true);
    const finalIntention = intention === 'Create my own' ? (customIntention || 'Become consistent') : intention;

    try {
      const res = await fetch('/api/arc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate,
          duration: 90,
          intention: finalIntention,
          commitments: selectedCommitments.map(c => ({ name: c.name, category: c.category }))
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create Arc.');
        setSubmitting(false);
        return;
      }

      router.push(user?.accessStatus === 'PAID' ? '/dashboard' : '/arc');
    } catch (err) {
      setError('Something went wrong creating your Arc.');
      setSubmitting(false);
    }
  };

  const isStep2Valid = selectedCommitments.length >= 4 && selectedCommitments.length <= 6;

  return (
    <div className="min-h-screen bg-[#0b0c0a] flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl card-wise p-6 sm:p-10 shadow-2xl my-8 bg-gradient-to-b from-[#141712] to-[#0b0c0a]">
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-[#9fe870]' : 'bg-white/[0.08]'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 font-mono-code leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: DETAILS */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">STEP 01 OF 04</span>
              <h2 className="font-display-wise text-3xl sm:text-4xl text-slate-100 font-black uppercase mt-1 leading-[0.88]">
                Let's build your Arc.
              </h2>
              <p className="text-slate-300 text-sm mt-1 font-semibold">Set your foundation and launch window.</p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider font-mono-code">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#161813] border border-white/10 rounded-full px-5 py-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870] transition-all font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider font-mono-code">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#161813] border border-white/10 rounded-full px-5 py-3.5 text-slate-100 focus:outline-none focus:border-[#9fe870] font-mono-code text-sm transition-all font-medium"
                />
                <span className="text-[11px] text-slate-400 mt-1 block font-mono-code font-semibold">Default: October 1, 2026</span>
              </div>

              <div className="p-4 rounded-full bg-[#161813] border border-white/[0.08] flex items-center justify-between px-6">
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase font-mono-code">Duration</div>
                  <div className="text-sm font-bold text-slate-200">90 Days</div>
                </div>
                <div className="font-mono-code text-xs text-[#9fe870] font-bold">
                  {formatShortDate(startDate)} → {formatShortDate(endDate)}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="btn-wise-primary px-6 py-3.5 text-sm font-extrabold gap-2"
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
                <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">STEP 02 OF 04</span>
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
              <h2 className="font-display-wise text-3xl sm:text-4xl text-slate-100 font-black uppercase mt-1 leading-[0.88]">
                What are you committing to?
              </h2>
              <p className="text-slate-300 text-sm mt-1 font-semibold">Choose 4–6 non-negotiables you will show up for.</p>
            </div>

            <div className="p-4 rounded-[24px] bg-[#161813] border border-white/10 space-y-2">
              <div className="text-xs font-mono-code text-[#9fe870] uppercase font-bold">Selected Commitments:</div>
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
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 max-h-[260px] overflow-y-auto pr-2">
              {Object.entries(SUGGESTED_COMMITMENTS).map(([cat, list]) => (
                <div key={cat}>
                  <div className="text-[11px] font-mono-code text-[#9fe870] mb-2 font-bold uppercase">{cat}</div>
                  <div className="flex flex-wrap gap-2">
                    {list.map((item) => {
                      const active = isSelected(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleSuggested(item, cat)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                            active
                              ? 'bg-[#9fe870] text-[#163300] scale-105'
                              : 'bg-white/[0.04] text-slate-300 border border-white/[0.08] hover:border-white/20 hover:scale-105'
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

            <form onSubmit={handleAddCustom} className="flex gap-2">
              <input
                type="text"
                placeholder="+ Create your own commitment..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                disabled={selectedCommitments.length >= 6}
                className="flex-1 bg-[#161813] border border-white/10 rounded-full px-5 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870] disabled:opacity-50 font-medium"
              />
              <button
                type="submit"
                disabled={!customInput.trim() || selectedCommitments.length >= 6}
                className="btn-wise-secondary px-5 py-3 text-xs font-bold disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5 text-[#9fe870]" /> Add
              </button>
            </form>

            <div className="pt-2 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="btn-wise-secondary px-5 py-2.5 text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                disabled={!isStep2Valid}
                onClick={() => setStep(3)}
                className="btn-wise-primary px-6 py-3 text-sm font-extrabold gap-2 disabled:opacity-40"
              >
                <span>Next: Intention</span>
                <ArrowRight className="w-4 h-4 text-[#163300]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INTENTION */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">STEP 03 OF 04</span>
              <h2 className="font-display-wise text-3xl sm:text-4xl text-slate-100 font-black uppercase mt-1 leading-[0.88]">
                Make it yours.
              </h2>
              <p className="text-slate-300 text-sm mt-1 font-semibold">Select a simple intention for your 90-day Arc.</p>
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
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <span className="text-sm font-bold">{opt}</span>
                    {active && <Check className="w-4 h-4 text-[#9fe870]" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="btn-wise-secondary px-5 py-2.5 text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                onClick={() => setStep(4)}
                className="btn-wise-primary px-6 py-3 text-sm font-extrabold gap-2"
              >
                <span>Next: Review Pledge</span>
                <ArrowRight className="w-4 h-4 text-[#163300]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONTRACT PREVIEW */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">STEP 04 OF 04 • CONTRACT</span>
              <h2 className="font-display-wise text-3xl sm:text-4xl text-slate-100 font-black uppercase mt-1 leading-[0.88]">
                Your Winter Arc Contract
              </h2>
            </div>

            <div className="card-wise p-6 sm:p-8 bg-gradient-to-b from-[#141712] to-[#0b0c0a] space-y-6">
              <div className="text-center border-b border-white/[0.08] pb-4">
                <div className="font-display-wise text-2xl tracking-widest text-slate-100 font-black uppercase">
                  MY WINTER ARC
                </div>
                <div className="text-2xl font-display-wise font-black text-[#9fe870] mt-1 uppercase">
                  {name || 'ARC TRAVELER'}
                </div>
                <div className="font-mono-code text-xs text-[#9fe870] font-bold mt-2 tracking-widest uppercase">
                  {formatShortDate(startDate)} → {formatShortDate(endDate)}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono-code text-[#9fe870] uppercase tracking-wider mb-3 text-center font-bold">
                  MY COMMITMENTS ({selectedCommitments.length})
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  {selectedCommitments.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-full bg-[#161813] border border-white/[0.06] flex items-center gap-3 text-xs text-slate-200 font-bold px-4"
                    >
                      <span className="text-[#9fe870] font-bold">✓</span>
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-2 border-t border-white/[0.08]">
                <div className="font-display-wise text-xl font-black text-slate-200 uppercase">
                  90 DAYS.
                </div>
                <div className="font-display-wise text-xl font-black text-[#9fe870] uppercase mt-0.5">
                  NO RESTARTS.
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="btn-wise-secondary px-5 py-2.5 text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="btn-wise-primary px-8 py-3.5 text-base font-black gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-5 h-5 text-[#163300]" /> <span>{submitting ? 'Creating Arc...' : 'Start My Arc'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
