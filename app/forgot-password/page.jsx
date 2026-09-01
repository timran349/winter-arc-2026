'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Flame, ArrowRight, ArrowLeft, KeyRound, Check, ShieldCheck, AlertCircle, MailCheck } from 'lucide-react';

function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [token, setToken] = useState(tokenParam || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [mode, setMode] = useState(tokenParam ? 'reset' : 'request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (tokenParam) {
      setToken(tokenParam);
      setMode('reset');
    }
  }, [tokenParam]);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process password reset.');
      }

      setMode('submitted');
      setSuccessMsg(data.message || 'Check your email inbox for password reset instructions.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setSuccessMsg('Password updated successfully! Redirecting to sign in...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md card-wise p-8 sm:p-10 space-y-6 bg-white border border-zinc-200/80 shadow-[0_20px_60px_-20px_rgba(24,24,27,0.08)] relative">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#FF4500]/10 border border-[#FF4500]/30 flex items-center justify-center mx-auto mb-3">
          {mode === 'submitted' ? (
            <MailCheck className="w-6 h-6 text-[#FF4500]" />
          ) : (
            <KeyRound className="w-6 h-6 text-[#FF4500]" />
          )}
        </div>
        <h1 className="font-fraunces text-3xl font-bold text-zinc-900 uppercase leading-tight">
          {mode === 'reset' ? 'Reset Password' : mode === 'submitted' ? 'Check Your Email' : 'Forgot Password'}
        </h1>
        <p className="text-xs text-zinc-500 font-medium leading-relaxed">
          {mode === 'reset'
            ? 'Enter your new password below to regain access to your account.'
            : mode === 'submitted'
            ? 'If an account exists for that email address, a password reset link has been sent.'
            : 'Enter your email address and we will send you a secure password reset link.'}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 text-xs font-bold font-mono-code flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30 text-xs font-bold font-mono-code flex items-center gap-2">
          <Check className="w-4 h-4 text-[#FF4500] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {mode === 'request' ? (
        <form onSubmit={handleRequestReset} className="space-y-4 pt-2">
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-mono-code text-[#FF4500] font-bold uppercase tracking-wider">
              Account Email
            </label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-full px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FF4500]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-wise-primary w-full py-4 text-xs font-semibold justify-center gap-2"
          >
            <span>{loading ? 'Sending Instructions...' : 'Send Reset Link'}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>
      ) : mode === 'submitted' ? (
        <div className="space-y-4 pt-2 text-center">
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 font-medium leading-relaxed">
            Please check your email inbox and spam folder for instructions to reset your password.
          </div>
          <button
            type="button"
            onClick={() => setMode('request')}
            className="btn-wise-secondary w-full py-3.5 text-xs font-medium"
          >
            Try Another Email
          </button>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-mono-code text-[#FF4500] font-bold uppercase tracking-wider">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-full px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FF4500]"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-mono-code text-[#FF4500] font-bold uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-full px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FF4500]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-wise-primary w-full py-4 text-xs font-semibold justify-center gap-2"
          >
            <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
            <ShieldCheck className="w-4 h-4 text-white" />
          </button>
        </form>
      )}

      <div className="pt-4 border-t border-zinc-100 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 font-mono-code"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-[#FF4500] selection:text-white font-sans">
      <header className="w-full border-b border-zinc-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 text-[#FF4500]" />
            </div>
            <div>
              <span className="font-fraunces text-lg tracking-tight font-medium text-zinc-900">
                Arc 90
              </span>
            </div>
          </Link>

          <Link
            href="/login"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 px-4 py-2 rounded-full hover:bg-zinc-100 transition-all"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-xs text-[#FF4500] font-mono-code font-bold">Loading...</div>}>
          <ForgotPasswordForm />
        </Suspense>
      </main>

      <footer className="w-full border-t border-zinc-200/60 py-6 text-center text-xs text-zinc-500 font-mono-code">
        ARC 90 • START BEFORE JANUARY. FINISH WITH PROOF.
      </footer>
    </div>
  );
}
