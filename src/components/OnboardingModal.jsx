import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Plus, Trash2, ShieldCheck, Flame, AlertCircle } from 'lucide-react';
import { calculateEndDate, formatShortDate } from '../utils/dates';

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

export default function OnboardingModal({ isOpen, onClose, onCompleteOnboarding }) {
  const [step, setStep] = useState(1);

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

  if (!isOpen) return null;

  const endDate = calculateEndDate(startDate, 90);

  // Handlers for commitments
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

  // Submission handler
  const handleFinalSubmit = () => {
    const finalIntention = intention === 'Create my own' ? (customIntention || 'Become consistent') : intention;
    const finalName = name.trim() || 'Arc Traveler';

    onCompleteOnboarding({
      name: finalName,
      startDate,
      duration: 90,
      intention: finalIntention,
      commitments: selectedCommitments
    });
  };

  const isStep2Valid = selectedCommitments.length >= 4 && selectedCommitments.length <= 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f1117] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'bg-white/[0.08]'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: DETAILS */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono-code text-sky-400 uppercase tracking-widest">STEP 01 OF 04</span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-slate-100 mt-1 font-normal">
                Let's build your Arc.
              </h2>
              <p className="text-slate-400 text-sm mt-1">Set your foundation and launch window.</p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-slate-100 focus:outline-none focus:border-sky-500 font-mono-code text-sm transition-colors"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Default: October 1, 2026</span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Duration</div>
                  <div className="text-sm font-semibold text-slate-200">90 Days</div>
                </div>
                <div className="text-right font-mono-code text-xs text-sky-400 font-medium">
                  {formatShortDate(startDate)} → {formatShortDate(endDate)}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all flex items-center gap-2"
              >
                Next: Commitments
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: COMMITMENTS (4 to 6 required) */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-sky-400 uppercase tracking-widest">STEP 02 OF 04</span>
                <span
                  className={`text-xs font-mono-code px-2.5 py-1 rounded-md ${
                    isStep2Valid
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {selectedCommitments.length} / 6 SELECTED (MIN 4)
                </span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl text-slate-100 mt-1 font-normal">
                What are you committing to?
              </h2>
              <p className="text-slate-400 text-sm mt-1">Choose 4–6 things you want to show up for.</p>
            </div>

            {/* Selected Commitments Chips */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
              <div className="text-xs font-mono-code text-slate-400 uppercase">Your Selected Arc ({selectedCommitments.length}):</div>
              {selectedCommitments.length === 0 && (
                <div className="text-xs text-slate-600 italic">No commitments selected yet. Pick 4–6 below.</div>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedCommitments.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs font-medium"
                  >
                    <span>✓ {item.name}</span>
                    <button
                      onClick={() => handleRemoveCommitment(item.id)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Categories */}
            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
              {Object.entries(SUGGESTED_COMMITMENTS).map(([cat, list]) => (
                <div key={cat}>
                  <div className="text-[11px] font-mono-code text-slate-500 mb-2">{cat}</div>
                  <div className="flex flex-wrap gap-2">
                    {list.map((item) => {
                      const active = isSelected(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleSuggested(item, cat)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            active
                              ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                              : 'bg-white/[0.03] text-slate-300 border border-white/[0.08] hover:border-white/20'
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

            {/* Custom Input */}
            <form onSubmit={handleAddCustom} className="flex gap-2">
              <input
                type="text"
                placeholder="+ Create your own commitment..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                disabled={selectedCommitments.length >= 6}
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!customInput.trim() || selectedCommitments.length >= 6}
                className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 text-xs font-medium disabled:opacity-40 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>

            {!isStep2Valid && (
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono-code">
                <AlertCircle className="w-4 h-4" /> Please select between 4 and 6 commitments to continue.
              </div>
            )}

            <div className="pt-2 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-white/[0.04] text-slate-300 text-xs font-medium hover:bg-white/[0.08] transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                disabled={!isStep2Valid}
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 font-bold text-sm transition-all flex items-center gap-2"
              >
                Next: Intention
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INTENTION */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono-code text-sky-400 uppercase tracking-widest">STEP 03 OF 04</span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-slate-100 mt-1 font-normal">
                Make it yours.
              </h2>
              <p className="text-slate-400 text-sm mt-1">Select a simple intention for your 90-day Arc.</p>
            </div>

            <div className="space-y-3 pt-2">
              {SUGGESTED_INTENTIONS.map((opt) => {
                const active = intention === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setIntention(opt)}
                    className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                      active
                        ? 'bg-sky-500/[0.08] border-sky-500/40 text-slate-100'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span className="text-sm font-medium">{opt}</span>
                    {active && <Check className="w-4 h-4 text-sky-400" />}
                  </button>
                );
              })}

              <button
                onClick={() => setIntention('Create my own')}
                className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                  intention === 'Create my own'
                    ? 'bg-sky-500/[0.08] border-sky-500/40 text-slate-100'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/20'
                }`}
              >
                <span className="text-sm font-medium">+ Create my own</span>
                {intention === 'Create my own' && <Check className="w-4 h-4 text-sky-400" />}
              </button>

              {intention === 'Create my own' && (
                <input
                  type="text"
                  placeholder="Enter your custom intention..."
                  value={customIntention}
                  onChange={(e) => setCustomIntention(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-white/[0.04] text-slate-300 text-xs font-medium hover:bg-white/[0.08] transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all flex items-center gap-2"
              >
                Next: Review Pledge
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONTRACT PREVIEW */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono-code text-sky-400 uppercase tracking-widest">STEP 04 OF 04 • CONTRACT</span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-slate-100 mt-1 font-normal">
                Your Winter Arc Contract
              </h2>
            </div>

            {/* EDITORIAL PLEDGE CONTRACT CARD */}
            <div className="frost-glass rounded-2xl p-6 sm:p-8 border border-white/15 bg-gradient-to-b from-white/[0.03] to-transparent space-y-6">
              <div className="text-center border-b border-white/[0.08] pb-4">
                <div className="font-editorial text-2xl tracking-widest text-slate-100 font-light uppercase">
                  MY WINTER ARC
                </div>
                <div className="text-xl font-editorial font-bold text-sky-400 mt-1">
                  {name || 'ARC TRAVELER'}
                </div>
                <div className="font-mono-code text-xs text-slate-400 mt-2">
                  {formatShortDate(startDate)} → {formatShortDate(endDate)}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider mb-3 text-center">
                  MY COMMITMENTS ({selectedCommitments.length})
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  {selectedCommitments.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-3 text-sm text-slate-200"
                    >
                      <span className="text-sky-400 font-bold">✓</span>
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-2 border-t border-white/[0.08]">
                <div className="font-mono-code text-sm font-bold text-slate-300 tracking-wider">
                  90 DAYS.
                </div>
                <div className="font-mono-code text-sm font-bold text-sky-400 tracking-wider mt-0.5">
                  NO RESTARTS.
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-white/[0.04] text-slate-300 text-xs font-medium hover:bg-white/[0.08] transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                onClick={handleFinalSubmit}
                className="px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base transition-all shadow-[0_0_25px_rgba(56,189,248,0.5)] flex items-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" /> Start My Arc
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
