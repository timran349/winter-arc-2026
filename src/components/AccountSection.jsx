'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, CreditCard, ExternalLink, ArrowRight } from 'lucide-react';

export default function AccountSection({ user }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const res = await fetch('/api/user/purchases');
        const data = await res.json();
        if (data.purchases) {
          setPurchases(data.purchases);
        }
      } catch (err) {
        console.error('Failed to fetch purchases:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPurchases();
  }, []);

  const isPaid = user?.accessStatus === 'PAID';

  return (
    <div className="mt-12 space-y-6">
      {/* ACCESS STATUS CARD */}
      <div className="frost-glass rounded-3xl p-6 sm:p-8 border border-white/10 glow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isPaid
                ? 'bg-sky-500/10 border border-sky-500/20 text-sky-400'
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}>
              {isPaid ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-mono-code text-slate-400 uppercase tracking-widest">
                WINTER ARC ACCESS
              </div>
              <div className="font-editorial text-xl font-medium text-slate-100 mt-0.5">
                90-DAY SYSTEM
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold uppercase tracking-wider ${
              isPaid
                ? 'bg-sky-500/10 border border-sky-500/20 text-sky-400'
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}>
              Status: {isPaid ? 'ACTIVE' : 'NOT UNLOCKED'}
            </div>

            {!isPaid && (
              <Link
                href="/unlock"
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] flex items-center gap-1"
              >
                <span>Unlock — $19</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400 font-sans">
          {isPaid
            ? 'Your 90-day system is active. You have full access to daily check-ins, weekly reviews, progress tracking, and proof cards.'
            : 'Unlock your 90-day tracking system for $19 USD (one-time purchase).'
          }
        </p>

        {/* PURCHASE HISTORY */}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono-code text-slate-400 uppercase tracking-wider mb-4">
            <CreditCard className="w-4 h-4 text-sky-400" />
            <span>Purchase History</span>
          </div>

          {loading ? (
            <div className="text-xs font-mono-code text-slate-500 py-4">Loading purchases...</div>
          ) : purchases.length === 0 ? (
            <div className="text-xs font-mono-code text-slate-500 py-4 bg-white/[0.01] rounded-xl border border-white/[0.04] text-center">
              {isPaid ? 'Winter Arc 90-Day System (Active)' : 'No purchases found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-code text-slate-300">
                <thead>
                  <tr className="border-b border-white/[0.06] text-slate-500 uppercase tracking-wider">
                    <th className="pb-2">Product</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {purchases.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 font-sans font-medium text-slate-200">Winter Arc 90-Day System</td>
                      <td className="py-3">${(p.amount / 100).toFixed(2)} {p.currency}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'paid'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">{new Date(p.purchasedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
