'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, CheckCircle2, Loader2, ArrowRight, ShieldCheck, Lock, Sparkles, UserCheck } from 'lucide-react';
import { getFreeContract } from '@/src/utils/freeContract';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  // Guest Account Claim Form State
  const [savedContract, setSavedContract] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');

  useEffect(() => {
    const contract = getFreeContract();
    if (contract) {
      setSavedContract(contract);
      if (contract.name) setName(contract.name);
    }
  }, []);

  useEffect(() => {
    let intervalId;

    async function checkStatus() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (data.user) {
          setUser(data.user);
          if (data.user.accessStatus === 'PAID') {
            setIsVerified(true);
            setChecking(false);
            if (intervalId) clearInterval(intervalId);
            return;
          }
        }

        setChecking(false);
      } catch (err) {
        console.error('Polling error:', err);
        setChecking(false);
      }
    }

    checkStatus();
    intervalId = setInterval(checkStatus, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Claim Account & Transfer Saved Free Contract to Neon DB
  const handleClaimAccount = async (e) => {
    e.preventDefault();
    setClaimError('');
    setClaimLoading(true);

    try {
      // 1. Create or Login User
      const authRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Arc Traveler',
          email,
          password
        })
      });

      const authData = await authRes.json();

      if (!authRes.ok && !authData.error?.includes('already exists')) {
        throw new Error(authData.error || 'Account setup failed.');
      }

      // If user exists, log in
      if (!authRes.ok && authData.error?.includes('already exists')) {
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (!loginRes.ok) {
          throw new Error('An account with this email already exists. Please sign in with your password.');
        }
      }

      // 2. Transfer Saved Contract to DB
      if (savedContract && savedContract.commitments && savedContract.commitments.length >= 4) {
        try {
          await fetch('/api/arc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              startDate: savedContract.startDate || '2026-10-01',
              duration: savedContract.duration || 90,
              intention: savedContract.intention || 'Get focused',
              commitments: savedContract.commitments
            })
          });
        } catch (arcErr) {
          console.error('Contract transfer error:', arcErr);
        }
      }

      // 3. Redirect directly to Dashboard
      router.push('/dashboard');
    } catch (err) {
      setClaimError(err.message);
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c0a] text-slate-100 flex flex-col justify-between selection:bg-[#9fe870] selection:text-[#163300]">
      <header className="w-full border-b border-white/[0.08] bg-[#0b0c0a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#9fe870] flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#163300]" />
            </div>
            <div>
              <span className="font-editorial text-lg tracking-tight font-black text-slate-100">
                WINTER ARC 90
              </span>
              <span className="text-[10px] font-mono-code text-[#9fe870] block -mt-1 tracking-widest uppercase font-bold">
                SYSTEM
              </span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center flex flex-col justify-center items-center">
        {isVerified ? (
          /* VERIFIED PAID STATE */
          <div className="card-wise p-8 sm:p-12 w-full space-y-6 bg-gradient-to-b from-[#141712] to-[#0b0c0a] border border-[#9fe870]/30 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-[#9fe870] text-[#163300] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(159,232,112,0.4)]">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h1 className="font-display-wise text-4xl sm:text-5xl font-black text-slate-100 uppercase leading-[0.88]">
              WELCOME TO YOUR ARC.
            </h1>

            <p className="text-base text-[#9fe870] font-mono-code font-bold uppercase tracking-wider">
              Your 90 days start now.
            </p>

            <p className="text-xs text-slate-300 font-semibold max-w-md mx-auto leading-relaxed">
              Your payment has been verified. You have full access to daily check-ins, weekly reviews, and progress tracking.
            </p>

            <div className="pt-4">
              <Link
                href="/dashboard"
                className="btn-wise-primary w-full py-4 text-sm font-extrabold gap-2 shadow-[0_0_25px_rgba(159,232,112,0.4)]"
              >
                <span>ENTER MY DASHBOARD</span>
                <ArrowRight className="w-4 h-4 text-[#163300]" />
              </Link>
            </div>
          </div>
        ) : user ? (
          /* PENDING VERIFICATION FOR LOGGED IN USER */
          <div className="card-wise p-8 sm:p-12 w-full space-y-6 bg-gradient-to-b from-[#141712] to-[#0b0c0a] border border-white/10 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-[#161813] border border-white/10 text-[#9fe870] flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin text-[#9fe870]" />
            </div>

            <h1 className="font-display-wise text-3xl sm:text-4xl font-black text-slate-100 uppercase leading-[0.88]">
              PAYMENT RECEIVED
            </h1>

            <p className="text-sm text-slate-200 font-bold">
              Unlocking your Winter Arc System...
            </p>

            <div className="pt-2 space-y-3">
              <Link
                href="/dashboard"
                className="btn-wise-primary block w-full py-4 text-xs font-black"
              >
                Continue to Dashboard →
              </Link>
            </div>
          </div>
        ) : (
          /* GUEST ACCOUNT CREATION & CONTRACT CLAIM */
          <div className="card-wise p-8 sm:p-10 w-full space-y-6 bg-gradient-to-b from-[#141712] to-[#0b0c0a] border border-[#9fe870]/30 shadow-2xl text-left">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#9fe870]/10 border border-[#9fe870]/30 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6 text-[#9fe870]" />
              </div>
              <h1 className="font-display-wise text-3xl sm:text-4xl font-black text-slate-100 uppercase leading-[0.88]">
                PAYMENT SUCCESSFUL!
              </h1>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                Set a password to save your 90-day Arc contract and access your tracking dashboard.
              </p>
            </div>

            {claimError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold font-mono-code leading-relaxed">
                {claimError}
              </div>
            )}

            <form onSubmit={handleClaimAccount} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono-code text-[#9fe870] font-bold uppercase tracking-wider">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-[#0b0c0a] border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono-code text-[#9fe870] font-bold uppercase tracking-wider">
                  Checkout Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="The email used on Lemon Squeezy"
                  className="w-full bg-[#0b0c0a] border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono-code text-[#9fe870] font-bold uppercase tracking-wider">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#0b0c0a] border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870]"
                />
              </div>

              <button
                type="submit"
                disabled={claimLoading}
                className="btn-wise-primary w-full py-4 text-sm font-black justify-center gap-2 shadow-[0_0_25px_rgba(159,232,112,0.4)]"
              >
                {claimLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#163300]" />
                    <span>Setting up Dashboard...</span>
                  </>
                ) : (
                  <>
                    <span>CLAIM MY ARC & ENTER DASHBOARD</span>
                    <ArrowRight className="w-4 h-4 text-[#163300]" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-white/[0.06] py-6 text-center text-xs text-slate-400 font-mono-code font-bold">
        WINTER ARC 2026 • START BEFORE JANUARY. FINISH WITH PROOF.
      </footer>
    </div>
  );
}
