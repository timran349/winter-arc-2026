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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl card-wise p-6 sm:p-10 my-8 bg-white border border-zinc-200 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-[#FF4500]' : 'bg-zinc-200'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: DETAILS */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono-code text-[#FF4500] font-bold uppercase tracking-widest">STEP 01 OF 04</span>
              <h2 className="font-funnel text-3xl sm:text-4xl text-zinc-900 mt-1 font-semibold uppercase leading-tight">
                Let's build your Arc 90.
              </h2>
              <p className="text-zinc-500 text-xs font-medium mt-1">Set your foundation and launch window.</p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-2 uppercase font-mono-code">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full px-5 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FF4500] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-2 uppercase font-mono-code">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full px-5 py-3.5 text-zinc-900 focus:outline-none focus:border-[#FF4500] font-mono-code text-xs font-bold"
                />
                <span className="text-[11px] text-zinc-500 mt-1.5 block font-mono-code">Default: October 1, 2026</span>
              </div>

              <div className="p-4 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-between px-6">
                <div>
                  <div className="text-xs text-zinc-500 font-mono-code">Duration</div>
                  <div className="text-sm font-semibold text-zinc-900 font-funnel uppercase">90 Days</div>
                </div>
                <div className="text-right font-mono-code text-xs text-[#FF4500] font-bold">
                  {formatShortDate(startDate)} → {formatShortDate(endDate)}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="btn-wise-primary px-6 py-3 text-xs font-semibold gap-2"
              >
                <span>Next: Commitments</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: COMMITMENTS (4 to 6 required) */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-[#FF4500] font-bold uppercase tracking-widest">STEP 02 OF 04</span>
                <span
                  className={`text-xs font-mono-code px-3 py-1 rounded-full font-bold ${
                    isStep2Valid
                      ? 'bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30'
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}
                >
                  {selectedCommitments.length} / 6 SELECTED (MIN 4)
                </span>
              </div>
              <h2 className="font-funnel text-3xl sm:text-4xl text-zinc-900 mt-1 font-semibold uppercase leading-tight">
                What are you committing to?
              </h2>
              <p className="text-zinc-500 text-xs font-medium mt-1">Choose 4–6 things you want to show up for.</p>
            </div>

            {/* Selected Commitments Chips */}
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="text-xs font-mono-code text-[#FF4500] font-bold uppercase">Your Selected Arc ({selectedCommitments.length}):</div>
              {selectedCommitments.length === 0 && (
                <div className="text-xs text-zinc-400 italic font-medium">No commitments selected yet. Pick 4–6 below.</div>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedCommitments.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30 text-xs font-semibold"
                  >
                    <span>✓ {item.name}</span>
                    <button
                      onClick={() => handleRemoveCommitment(item.id)}
                      className="hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-[#FF4500]" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Categories */}
            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
              {Object.entries(SUGGESTED_COMMITMENTS).map(([cat, list]) => (
                <div key={cat}>
                  <div className="text-[11px] font-mono-code text-[#FF4500] font-bold mb-2">{cat}</div>
                  <div className="flex flex-wrap gap-2">
                    {list.map((item) => {
                      const active = isSelected(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleSuggested(item, cat)}
                          className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                            active
                              ? 'bg-[#FF4500] text-white shadow-sm'
                              : 'bg-zinc-50 text-zinc-700 border border-zinc-200 hover:border-zinc-300'
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
                className="btn-wise-primary px-6 py-3 text-xs font-semibold gap-2"
              >
                <span>Next: Intention</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INTENTION */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono-code text-[#FF4500] font-bold uppercase tracking-widest">STEP 03 OF 04</span>
              <h2 className="font-funnel text-3xl sm:text-4xl text-zinc-900 mt-1 font-semibold uppercase leading-tight">
                Make it yours.
              </h2>
              <p className="text-zinc-500 text-xs font-medium mt-1">Select a simple intention for your 90-day Arc.</p>
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
                        ? 'bg-[#FF4500]/10 border-[#FF4500] text-zinc-900 shadow-sm'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-white hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="text-xs font-semibold">{opt}</span>
                    {active && <Check className="w-4 h-4 text-[#FF4500]" />}
                  </button>
                );
              })}

              <button
                onClick={() => setIntention('Create my own')}
                className={`w-full p-4 rounded-full text-left border transition-all flex items-center justify-between px-6 ${
                  intention === 'Create my own'
                    ? 'bg-[#FF4500]/10 border-[#FF4500] text-zinc-900 shadow-sm'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-white hover:-translate-y-0.5'
                }`}
              >
                <span className="text-xs font-semibold">+ Create my own</span>
                {intention === 'Create my own' && <Check className="w-4 h-4 text-[#FF4500]" />}
              </button>

              {intention === 'Create my own' && (
                <input
                  type="text"
                  placeholder="Enter your custom intention..."
                  value={customIntention}
                  onChange={(e) => setCustomIntention(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full px-5 py-3 text-xs text-zinc-900 focus:outline-none focus:border-[#FF4500] font-medium"
                />
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="btn-wise-secondary px-5 py-2.5 text-xs font-semibold gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#FF4500]" /> Back
              </button>

              <button
                onClick={() => setStep(4)}
                className="btn-wise-primary px-6 py-3 text-xs font-semibold gap-2"
              >
                <span>Next: Review Pledge</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONTRACT PREVIEW */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono-code text-[#FF4500] font-bold uppercase tracking-widest">STEP 04 OF 04 • CONTRACT</span>
              <h2 className="font-funnel text-3xl sm:text-4xl text-zinc-900 mt-1 font-semibold uppercase leading-tight">
                Your Arc 90 Contract
              </h2>
            </div>

            {/* EDITORIAL PLEDGE CONTRACT CARD */}
            <div className="card-wise p-6 sm:p-8 space-y-6 bg-white border border-zinc-200">
              <div className="text-center border-b border-zinc-100 pb-4">
                <div className="font-funnel text-2xl tracking-tight text-zinc-900 font-bold uppercase">
                  MY ARC 90
                </div>
                <div className="text-xl font-funnel font-bold text-[#FF4500] uppercase mt-1">
                  {name || 'ARC TRAVELER'}
                </div>
                <div className="font-mono-code text-xs text-zinc-500 font-bold mt-2">
                  {formatShortDate(startDate)} → {formatShortDate(endDate)}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono-code text-[#FF4500] font-bold uppercase tracking-wider mb-3 text-center">
                  MY COMMITMENTS ({selectedCommitments.length})
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  {selectedCommitments.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-full bg-zinc-50 border border-zinc-200 flex items-center gap-3 text-xs font-semibold text-zinc-900 px-5"
                    >
                      <span className="text-[#FF4500] font-bold">✓</span>
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-2 border-t border-zinc-100">
                <div className="font-mono-code text-sm font-bold text-zinc-900 tracking-wider">
                  90 DAYS.
                </div>
                <div className="font-mono-code text-sm font-bold text-[#FF4500] tracking-wider mt-0.5">
                  NO RESTARTS.
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="btn-wise-secondary px-5 py-2.5 text-xs font-semibold gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#FF4500]" /> Back
              </button>

              <button
                onClick={handleFinalSubmit}
                className="btn-wise-orange px-8 py-3.5 text-xs font-semibold gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-white" /> <span>Start My Arc</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
