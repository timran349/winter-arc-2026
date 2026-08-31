'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

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

      // Check if user has an active Arc
      const arcRes = await fetch('/api/arc');
      const arcData = await arcRes.json();

      if (arcData?.arc) {
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
    <div className="min-h-screen bg-[#0b0c0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md card-wise p-8 sm:p-10 space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-full bg-[#9fe870] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 text-[#163300]" />
            </div>
          </Link>
          <h1 className="font-display-wise text-4xl font-black text-slate-100 uppercase leading-[0.88]">Welcome back</h1>
          <p className="text-slate-400 text-xs font-semibold mt-2">Sign in to continue your 90-day Arc.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 font-mono-code leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider font-mono-code">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#161813] border border-white/10 rounded-full pl-10 pr-4 py-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870] transition-all font-medium"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider font-mono-code">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161813] border border-white/10 rounded-full pl-10 pr-4 py-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870] transition-all font-medium"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-wise-primary w-full py-4 text-sm font-extrabold gap-2 mt-4 disabled:opacity-50"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 text-[#163300]" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 border-t border-white/[0.08] pt-4 font-semibold">
          Don't have an Arc yet?{' '}
          <Link href="/signup" className="text-[#9fe870] hover:underline font-bold">
            Build My Arc
          </Link>
        </div>
      </div>
    </div>
  );
}
