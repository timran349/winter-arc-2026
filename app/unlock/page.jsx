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

  const [configMissing, setConfigMissing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      router.push('/signup');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setConfigMissing(false);

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

      if (data.configMissing) {
        setConfigMissing(true);
        setErrorMsg('Lemon Squeezy credentials have not been added to Vercel environment variables yet.');
        setLoading(false);
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

  const handleTestUnlock = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/test-unlock', { method: 'POST' });
      if (res.ok) {
        router.push('/payment/success');
      } else {
        setErrorMsg('Test unlock failed.');
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg('Network error during test unlock.');
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
    <div className="min-h-screen bg-[#07080a] text-slate-100 flex flex-col justify-between selection:bg-sky-500/20 selection:text-sky-400">
      {/* Header */}
      <header className="w-full border-b border-white/[0.08] bg-[#07080a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono-code text-xs mb-8">
          <Lock className="w-3.5 h-3.5" />
          <span>WINTER ARC 90-DAY SYSTEM</span>
        </div>

        <h1 className="font-editorial text-4xl sm:text-6xl font-normal text-slate-100 tracking-tight leading-[1.15] max-w-3xl">
          YOUR ARC IS READY. <br />
          <span className="italic font-light text-sky-400">Now make it real.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-xl font-sans leading-relaxed">
          Track 90 days. Review every week. See your progress. Finish with proof before the new year.
        </p>

        {/* Pricing Card */}
        <div className="mt-12 w-full max-w-md frost-glass rounded-3xl p-8 border border-white/10 glow-subtle text-left relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-[#07080a]">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-6 mb-6">
            <div>
              <div className="text-xs font-mono-code text-sky-400 uppercase tracking-widest">
                ONE-TIME ACCESS
              </div>
              <div className="font-editorial text-2xl text-slate-100 font-medium mt-1">
                Winter Arc 90-Day System
              </div>
            </div>
            <div className="text-right">
              <div className="font-editorial text-3xl text-slate-100 font-bold">$19</div>
              <div className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider">USD • ONE TIME</div>
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
              <div key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono-code leading-relaxed">
              {errorMsg}
            </div>
          )}

          {configMissing || errorMsg?.includes('Lemon Squeezy API Error') ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono-code leading-relaxed">
                💡 <strong>Founder Note:</strong> Lemon Squeezy API key is invalid/unauthenticated in Vercel. Generate a new key at <code>app.lemonsqueezy.com/settings/api-keys</code> and update Vercel. Or click below to test unlocking access right now:
              </div>
              <button
                onClick={handleTestUnlock}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Unlocking System...</span>
                  </>
                ) : (
                  <>
                    <span>SIMULATE $19 UNLOCK (TEST MODE)</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-[0_0_25px_rgba(56,189,248,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Opening Checkout...</span>
                </>
              ) : (
                <>
                  <span>START MY 90 DAYS — $19</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          <div className="mt-4 text-center text-[11px] text-slate-500 font-mono-code">
            🔒 Secure 256-bit payment via Lemon Squeezy • Instant activation
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.06] py-6 text-center text-xs text-slate-500 font-mono-code">
        WINTER ARC 2026 • START BEFORE JANUARY. FINISH WITH PROOF.
      </footer>
    </div>
  );
}
