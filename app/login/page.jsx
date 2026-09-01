'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { getFreeContract } from '@/src/utils/freeContract';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to sign in.');
        setLoading(false);
        return;
      }

      let arcRes = await fetch('/api/arc');
      let arcData = await arcRes.json();

      if (!arcData?.arc) {
        const freeContract = getFreeContract();
        if (freeContract && freeContract.commitments && freeContract.commitments.length >= 4) {
          try {
            await fetch('/api/arc', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                startDate: freeContract.startDate || '2026-10-01',
                duration: freeContract.duration || 90,
                intention: freeContract.intention || 'Get focused',
                commitments: freeContract.commitments
              })
            });
            arcRes = await fetch('/api/arc');
            arcData = await arcRes.json();
          } catch (arcErr) {
            console.error('Failed to transfer free contract on login:', arcErr);
          }
        }
      }

      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect');

      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (arcData?.arc) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center p-4 selection:bg-[#FF4500] selection:text-white font-sans">
      <div className="w-full max-w-md card-wise p-8 sm:p-10 space-y-8 bg-white border border-zinc-200/80 shadow-[0_20px_60px_-20px_rgba(24,24,27,0.08)]">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 text-[#FF4500]" />
            </div>
          </Link>
          <h1 className="font-fraunces text-3xl font-bold text-zinc-900 uppercase leading-tight">Welcome back</h1>
          <p className="text-zinc-500 text-xs font-medium mt-2">Sign in to continue your Arc 90.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs flex items-center gap-2 font-mono-code leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-600 mb-2 uppercase tracking-wider font-mono-code">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-full pl-10 pr-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FF4500] transition-all font-medium"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider font-mono-code">Password</label>
              <Link href="/forgot-password" className="text-[11px] font-mono-code font-bold text-[#FF4500] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-full pl-10 pr-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FF4500] transition-all font-medium"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-wise-primary w-full py-4 text-xs font-semibold gap-2 mt-4 disabled:opacity-50"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500 border-t border-zinc-100 pt-4 font-medium">
          Don't have an Arc yet?{' '}
          <Link href="/signup" className="text-[#FF4500] hover:underline font-bold">
            Build My Arc 90
          </Link>
        </div>
      </div>
    </div>
  );
}
