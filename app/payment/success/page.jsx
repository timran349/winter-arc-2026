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

  const handleClaimAccount = async (e) => {
    e.preventDefault();
    setClaimError('');
    setClaimLoading(true);

    try {
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

      router.push('/dashboard');
    } catch (err) {
      setClaimError(err.message);
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between selection:bg-[#FF4500] selection:text-white font-sans">
      <header className="w-full border-b border-zinc-800/80 bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FF4500] flex items-center justify-center shadow-[0_0_20px_rgba(255,69,0,0.4)]">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-fraunces text-lg tracking-tight font-bold text-white">
                Stalkr Arc
              </span>
              <span className="text-[10px] font-mono-code text-[#FF4500] block -mt-1 tracking-widest uppercase font-bold">
                SYSTEM
              </span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center flex flex-col justify-center items-center">
        {isVerified ? (
          <div className="card-wise p-8 sm:p-12 w-full space-y-6 bg-zinc-900 border border-[#FF4500]/40 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-[#FF4500] text-white flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(255,69,0,0.4)]">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h1 className="font-fraunces text-4xl sm:text-5xl font-bold text-white uppercase leading-tight">
              WELCOME TO YOUR ARC.
            </h1>

            <p className="text-base text-[#FF4500] font-mono-code font-bold uppercase tracking-wider">
              Your 90 days start now.
            </p>

            <p className="text-xs text-zinc-400 font-medium max-w-md mx-auto leading-relaxed">
              Your payment has been verified. You have full access to daily check-ins, weekly reviews, and progress tracking.
            </p>

            <div className="pt-4">
              <Link
                href="/dashboard"
                className="btn-wise-primary w-full py-4 text-sm font-semibold gap-2"
              >
                <span>ENTER MY DASHBOARD</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>
        ) : user ? (
          <div className="card-wise p-8 sm:p-12 w-full space-y-6 bg-zinc-900 border border-zinc-800 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-zinc-950 border border-zinc-800 text-[#FF4500] flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF4500]" />
            </div>

            <h1 className="font-fraunces text-3xl sm:text-4xl font-bold text-white uppercase leading-tight">
              PAYMENT RECEIVED
            </h1>

            <p className="text-sm text-zinc-300 font-medium">
              Unlocking your Winter Arc System...
            </p>

            <div className="pt-2 space-y-3">
              <Link
                href="/dashboard"
                className="btn-wise-primary block w-full py-4 text-xs font-semibold"
              >
                Continue to Dashboard →
              </Link>
            </div>
          </div>
        ) : (
          <div className="card-wise p-8 sm:p-10 w-full space-y-6 bg-zinc-900 border border-[#FF4500]/40 shadow-2xl text-left">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#FF4500]/10 border border-[#FF4500]/30 flex items-center justify-center mx-auto mb-2 shadow-[0_0_20px_rgba(255,69,0,0.3)]">
                <Sparkles className="w-6 h-6 text-[#FF4500]" />
              </div>
              <h1 className="font-fraunces text-3xl sm:text-4xl font-bold text-white uppercase leading-tight">
                PAYMENT SUCCESSFUL!
              </h1>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
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
                <label className="text-[10px] font-mono-code text-[#FF4500] font-bold uppercase tracking-wider">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-full px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4500]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono-code text-[#FF4500] font-bold uppercase tracking-wider">
                  Checkout Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="The email used on Lemon Squeezy"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-full px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4500]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono-code text-[#FF4500] font-bold uppercase tracking-wider">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-full px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4500]"
                />
              </div>

              <button
                type="submit"
                disabled={claimLoading}
                className="btn-wise-primary w-full py-4 text-sm font-semibold justify-center gap-2"
              >
                {claimLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Setting up Dashboard...</span>
                  </>
                ) : (
                  <>
                    <span>CLAIM MY ARC & ENTER DASHBOARD</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-zinc-800/60 py-6 text-center text-xs text-zinc-500 font-mono-code">
        WINTER ARC 2026 • START BEFORE JANUARY. FINISH WITH PROOF.
      </footer>
    </div>
  );
}
