'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, ShieldCheck, CheckCircle2, ArrowRight, Lock, Sparkles, Loader2 } from 'lucide-react';

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
    if (!user) {
      router.push('/signup');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (res.status === 401 && !data.lemonSqueezyError) {
        router.push('/login');
        return;
      }

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg(data.error || 'Unable to initiate checkout. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg('Network error. Please try again.');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#07080a] flex items-center justify-center text-xs text-slate-500 font-mono-code">
        Loading Winter Arc...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c0a] text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="w-full border-b border-white/[0.08] bg-[#0b0c0a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
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
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <span className="text-xs text-slate-400 font-mono-code">Signed in as {user.name}</span>
            ) : (
              <Link
                href="/login"
                className="text-xs font-medium text-slate-300 hover:text-slate-100 px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Unlock Hero */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e2f6d5] text-[#163300] font-mono-code text-xs font-bold mb-8">
          <Lock className="w-3.5 h-3.5 text-[#163300]" />
          <span>WINTER ARC 90-DAY SYSTEM</span>
        </div>

        <h1 className="font-display-wise text-5xl sm:text-7xl lg:text-8xl font-black text-slate-100 uppercase tracking-tight leading-[0.85] max-w-4xl">
          YOUR ARC IS READY. <br />
          <span className="text-[#9fe870]">Now make it real.</span>
        </h1>

        <p className="mt-8 text-base sm:text-xl text-slate-300 max-w-xl font-sans font-semibold leading-relaxed">
          Track 90 days. Review every week. See your progress. Finish with proof before the new year.
        </p>

        {/* Pricing Card */}
        <div className="mt-12 w-full max-w-md card-wise p-8 text-left relative overflow-hidden bg-gradient-to-b from-[#131610] to-[#0b0c0a]">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-6 mb-6">
            <div>
              <div className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
                ONE-TIME ACCESS
              </div>
              <div className="font-display-wise text-2xl text-slate-100 font-black uppercase mt-1">
                Winter Arc 90-Day System
              </div>
            </div>
            <div className="text-right">
              <div className="font-display-wise text-4xl text-[#9fe870] font-black">$19</div>
              <div className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider font-bold">USD • ONE TIME</div>
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
              <div key={idx} className="flex items-start gap-3 text-xs text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#9fe870] shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono-code leading-relaxed">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-wise-primary w-full py-4 text-base font-extrabold gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#163300]" />
                <span>Opening Checkout...</span>
              </>
            ) : (
              <>
                <span>START MY 90 DAYS — $19</span>
                <ArrowRight className="w-4 h-4 text-[#163300]" />
              </>
            )}
          </button>

          <div className="mt-4 text-center text-[11px] text-slate-400 font-mono-code font-bold">
            🔒 Secure 256-bit payment via Lemon Squeezy • Instant activation
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.06] py-6 text-center text-xs text-slate-400 font-mono-code font-bold">
        WINTER ARC 2026 • START BEFORE JANUARY. FINISH WITH PROOF.
      </footer>
    </div>
  );
}
