'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, CheckCircle2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    let intervalId;

    async function checkStatus() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (data.user && data.user.accessStatus === 'PAID') {
          setIsVerified(true);
          setChecking(false);
          if (intervalId) clearInterval(intervalId);
          return;
        }

        setPollCount((prev) => {
          if (prev >= 10) { // Stop polling after 30 seconds (10 x 3s)
            setChecking(false);
            if (intervalId) clearInterval(intervalId);
          }
          return prev + 1;
        });
      } catch (err) {
        console.error('Polling error:', err);
      }
    }

    checkStatus();
    intervalId = setInterval(checkStatus, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c0a] text-slate-100 flex flex-col justify-between">
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
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center flex flex-col justify-center items-center">
        {isVerified ? (
          /* VERIFIED PAID STATE */
          <div className="card-wise p-8 sm:p-12 w-full space-y-6 bg-gradient-to-b from-[#141712] to-[#0b0c0a]">
            <div className="w-14 h-14 rounded-full bg-[#9fe870] text-[#163300] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h1 className="font-display-wise text-4xl sm:text-5xl font-black text-slate-100 uppercase leading-[0.88]">
              WELCOME TO YOUR ARC.
            </h1>

            <p className="text-base text-[#9fe870] font-mono-code font-bold uppercase tracking-wider">
              Your 90 days start now.
            </p>

            <p className="text-xs text-slate-300 font-semibold max-w-md mx-auto leading-relaxed">
              Your payment has been verified. You now have full access to daily check-ins, weekly reviews, and progress tracking.
            </p>

            <div className="pt-4">
              <Link
                href="/dashboard"
                className="btn-wise-primary w-full py-4 text-sm font-extrabold gap-2"
              >
                <span>ENTER MY ARC</span>
                <ArrowRight className="w-4 h-4 text-[#163300]" />
              </Link>
            </div>
          </div>
        ) : (
          /* PENDING / VERIFYING STATE */
          <div className="card-wise p-8 sm:p-12 w-full space-y-6 bg-gradient-to-b from-[#141712] to-[#0b0c0a]">
            <div className="w-14 h-14 rounded-full bg-[#161813] border border-white/10 text-[#9fe870] flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin text-[#9fe870]" />
            </div>

            <h1 className="font-display-wise text-3xl sm:text-4xl font-black text-slate-100 uppercase leading-[0.88]">
              PAYMENT RECEIVED
            </h1>

            <p className="text-sm text-slate-200 font-bold">
              Your Winter Arc is ready.
            </p>

            <p className="text-xs text-slate-300 font-mono-code bg-[#141712] p-4 rounded-2xl border border-white/[0.08] font-semibold">
              Your access will unlock automatically once the payment is verified server-side.
            </p>

            <div className="pt-2 space-y-3">
              <Link
                href="/dashboard"
                className="btn-wise-secondary block w-full py-3.5 text-xs font-bold"
              >
                Continue to Dashboard
              </Link>

              {checking && (
                <div className="text-[11px] text-slate-400 font-mono-code flex items-center justify-center gap-2 font-bold">
                  <span>Checking confirmation...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-white/[0.06] py-6 text-center text-xs text-slate-400 font-mono-code font-bold">
        WINTER ARC 2026 • START BEFORE JANUARY. FINISH WITH PROOF.
      </footer>
    </div>
  );
}
