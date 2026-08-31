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

  const [mode, setMode] = useState(tokenParam ? 'reset' : 'request'); // 'request' | 'reset' | 'submitted'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (tokenParam) {
      setToken(tokenParam);
      setMode('reset');
    }
  }, [tokenParam]);

  // Request Reset Token API Call
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

  // Submit New Password API Call
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
    <div className="w-full max-w-md card-wise p-8 sm:p-10 space-y-6 bg-gradient-to-b from-[#141712] via-[#0e100c] to-[#0b0c0a] border border-[#9fe870]/30 shadow-2xl relative">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#9fe870]/10 border border-[#9fe870]/30 flex items-center justify-center mx-auto mb-3">
          {mode === 'submitted' ? (
            <MailCheck className="w-6 h-6 text-[#9fe870]" />
          ) : (
            <KeyRound className="w-6 h-6 text-[#9fe870]" />
          )}
        </div>
        <h1 className="font-display-wise text-3xl sm:text-4xl font-black text-slate-100 uppercase tracking-tight leading-[0.88]">
          {mode === 'reset' ? 'Reset Password' : mode === 'submitted' ? 'Check Your Email' : 'Forgot Password'}
        </h1>
        <p className="text-xs text-slate-300 font-semibold leading-relaxed">
          {mode === 'reset'
            ? 'Enter your new password below to regain access to your account.'
            : mode === 'submitted'
            ? 'If an account exists for that email address, a password reset link has been sent.'
            : 'Enter your email address and we will send you a secure password reset link.'}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold font-mono-code flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#e2f6d5] text-[#163300] text-xs font-bold font-mono-code flex items-center gap-2">
          <Check className="w-4 h-4 text-[#163300] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {mode === 'request' ? (
        /* REQUEST RESET LINK FORM */
        <form onSubmit={handleRequestReset} className="space-y-4 pt-2">
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-mono-code text-[#9fe870] font-bold uppercase tracking-wider">
              Account Email
            </label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0b0c0a] border border-white/10 rounded-2xl px-4 py-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-wise-primary w-full py-4 text-sm font-black justify-center gap-2 shadow-[0_0_25px_rgba(159,232,112,0.4)]"
          >
            <span>{loading ? 'Sending Instructions...' : 'Send Reset Link'}</span>
            <ArrowRight className="w-4 h-4 text-[#163300]" />
          </button>
        </form>
      ) : mode === 'submitted' ? (
        /* SUBMITTED CONFIRMATION */
        <div className="space-y-4 pt-2 text-center">
          <div className="p-4 rounded-2xl bg-[#161813] border border-white/[0.08] text-xs text-slate-300 font-medium leading-relaxed">
            Please check your email inbox and spam folder for instructions to reset your password.
          </div>
          <button
            type="button"
            onClick={() => setMode('request')}
            className="btn-wise-secondary w-full py-3.5 text-xs font-bold"
          >
            Try Another Email
          </button>
        </div>
      ) : (
        /* NEW PASSWORD RESET FORM */
        <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-mono-code text-[#9fe870] font-bold uppercase tracking-wider">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#0b0c0a] border border-white/10 rounded-2xl px-4 py-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870]"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-mono-code text-[#9fe870] font-bold uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#0b0c0a] border border-white/10 rounded-2xl px-4 py-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#9fe870]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-wise-primary w-full py-4 text-sm font-black justify-center gap-2 shadow-[0_0_25px_rgba(159,232,112,0.4)]"
          >
            <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
            <ShieldCheck className="w-4 h-4 text-[#163300]" />
          </button>
        </form>
      )}

      <div className="pt-4 border-t border-white/[0.08] text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white font-mono-code"
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
    <div className="min-h-screen bg-[#0b0c0a] text-slate-100 flex flex-col justify-between selection:bg-[#9fe870] selection:text-[#163300]">
      {/* Navigation Bar */}
      <header className="w-full border-b border-white/[0.08] bg-[#0b0c0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#9fe870] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 text-[#163300]" />
            </div>
            <div>
              <span className="font-editorial text-lg tracking-tight font-black text-slate-100">
                WINTER ARC 90
              </span>
            </div>
          </Link>

          <Link
            href="/login"
            className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded-full hover:bg-white/[0.05] transition-all"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content inside Suspense Boundary */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-xs text-[#9fe870] font-mono-code font-bold">Loading...</div>}>
          <ForgotPasswordForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.06] py-6 text-center text-xs text-slate-400 font-mono-code font-bold">
        WINTER ARC 90 • START BEFORE JANUARY. FINISH WITH PROOF.
      </footer>
    </div>
  );
}
