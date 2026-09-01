'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, ArrowRight, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { getFreeContract } from '@/src/utils/freeContract';
import { trackEvent, ANALYTICS_EVENTS } from '@/src/utils/analytics';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    trackEvent(ANALYTICS_EVENTS.SIGNUP_STARTED);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account.');
        setLoading(false);
        return;
      }

      trackEvent(ANALYTICS_EVENTS.SIGNUP_COMPLETED);

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
        } catch (arcErr) {
          console.error('Failed to auto-save free contract to user account:', arcErr);
        }
      }

      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect') || '/onboarding';
      router.push(redirectUrl);
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
          <h1 className="font-fraunces text-3xl font-bold text-zinc-900 uppercase leading-tight">Start Your Arc</h1>
          <p className="text-zinc-500 text-xs font-medium mt-2">Create an account to begin your Arc 90 run.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs flex items-center gap-2 font-mono-code leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-600 mb-2 uppercase tracking-wider font-mono-code">Your Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Marcus Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-full pl-10 pr-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FF4500] transition-all font-medium"
              />
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

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
            <label className="block text-xs font-bold text-zinc-600 mb-2 uppercase tracking-wider font-mono-code">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Min 6 characters"
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
            <span>{loading ? 'Creating account...' : 'Build My Arc 90'}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500 border-t border-zinc-100 pt-4 font-medium">
          Already have an Arc account?{' '}
          <Link href="/login" className="text-[#FF4500] hover:underline font-bold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
