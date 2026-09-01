'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, CheckCircle2, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { trackEvent, ANALYTICS_EVENTS } from '@/src/utils/analytics';
import { getFreeContract } from '@/src/utils/freeContract';

export default function UnlockPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          if (data.user.accessStatus === 'PAID') {
            router.push('/dashboard');
            return;
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleCheckout = async () => {
    trackEvent(ANALYTICS_EVENTS.CHECKOUT_STARTED);
    setLoading(true);
    setErrorMsg('');

    try {
      let savedContract = null;
      try {
        savedContract = getFreeContract();
      } catch (e) {}

      const payload = {
        name: user?.name || savedContract?.name || '',
        email: user?.email || ''
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error('Failed to parse checkout JSON response:', jsonErr);
      }

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg(data.error || 'Unable to initiate checkout. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg(err?.message || 'Network error. Please try again.');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-xs text-zinc-500 font-mono-code">
        Loading Arc 90...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-[#FF4500] selection:text-white font-sans">
      {/* Header */}
      <header className="w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#FF4500]" />
            </div>
            <div>
              <span className="font-fraunces text-lg tracking-tight font-medium text-zinc-900">
                Arc 90
              </span>
              <span className="text-[10px] font-mono-code text-[#FF4500] block -mt-1 tracking-widest uppercase font-semibold">
                SYSTEM
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <span className="text-xs text-zinc-600 font-mono-code">Signed in as {user.name}</span>
            ) : (
              <Link
                href="/login"
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Unlock Hero */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-200 bg-white text-[#FF4500] font-mono-code text-xs font-bold mb-8 shadow-sm">
          <Lock className="w-3.5 h-3.5 text-[#FF4500]" />
          <span>ARC 90-DAY SYSTEM</span>
        </div>

        <h1 className="font-funnel text-5xl sm:text-7xl lg:text-8xl font-semibold text-zinc-900 uppercase tracking-tight leading-[0.95] max-w-4xl">
          YOUR ARC IS READY. <br />
          <span className="font-fraunces text-[#FF4500] normal-case italic font-normal">Now make it real.</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-zinc-500 max-w-xl font-sans font-medium leading-relaxed">
          Track 90 days. Review every week. See your progress. Finish with proof before the new year.
        </p>

        {/* Pricing Card */}
        <div className="mt-12 w-full max-w-md card-wise p-8 text-left relative overflow-hidden bg-white border-2 border-[#FF4500] shadow-[0_20px_60px_-15px_rgba(255,69,0,0.12)]">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-6 mb-6">
            <div>
              <div className="text-[11px] font-mono-code text-[#FF4500] uppercase tracking-widest font-bold">
                ONE-TIME ACCESS
              </div>
              <div className="font-funnel text-2xl text-zinc-900 font-bold uppercase mt-1">
                Arc 90-Day System
              </div>
            </div>
            <div className="text-right">
              <div className="font-funnel text-4xl text-[#FF4500] font-bold">$19</div>
              <div className="text-[10px] font-mono-code text-zinc-500 uppercase tracking-wider font-bold">USD • ONE TIME</div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {[
              'Full 90-day interactive accountability dashboard',
              'Daily commitment toggles & missed day tracking',
              'Weekly 7-day reflection & review system',
              '90-day progress analytics & calendar grid',
              'Verified completion certificate & share card generator',
              'Lifetime access to your completed Arc'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-zinc-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#FF4500] shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs font-mono-code leading-relaxed">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-wise-orange w-full py-4 text-base font-semibold gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Opening Checkout...</span>
              </>
            ) : (
              <>
                <span>START MY 90 DAYS — $19</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>

          <div className="mt-4 text-center text-[11px] text-zinc-500 font-mono-code font-medium">
            🔒 Secure 256-bit payment via Lemon Squeezy • Instant activation
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200/60 py-6 text-center text-xs text-zinc-500 font-mono-code">
        ARC 90 • START BEFORE JANUARY. FINISH WITH PROOF.
      </footer>
    </div>
  );
}
