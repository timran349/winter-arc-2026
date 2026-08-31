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
      <div className="card-wise p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isPaid
                ? 'bg-[#9fe870] text-[#163300]'
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}>
              {isPaid ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-mono-code text-[#9fe870] uppercase tracking-widest font-bold">
                WINTER ARC ACCESS
              </div>
              <div className="font-display-wise text-2xl font-black text-slate-100 uppercase mt-0.5">
                90-DAY SYSTEM
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-1.5 rounded-full text-xs font-mono-code font-bold uppercase tracking-wider ${
              isPaid
                ? 'bg-[#e2f6d5] text-[#163300]'
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}>
              Status: {isPaid ? 'ACTIVE' : 'NOT UNLOCKED'}
            </div>

            {!isPaid && (
              <Link
                href="/unlock"
                className="btn-wise-primary text-xs px-5 py-2 flex items-center gap-1 font-bold"
              >
                <span>Unlock — $19</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#163300]" />
              </Link>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-300 font-semibold leading-relaxed">
          {isPaid
            ? 'Your 90-day system is active. You have full access to daily check-ins, weekly reviews, progress tracking, and proof cards.'
            : 'Unlock your 90-day tracking system for $19 USD (one-time purchase).'
          }
        </p>

        {/* PURCHASE HISTORY */}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono-code text-[#9fe870] uppercase tracking-wider mb-4 font-bold">
            <CreditCard className="w-4 h-4 text-[#9fe870]" />
            <span>Purchase History</span>
          </div>

          {loading ? (
            <div className="text-xs font-mono-code text-slate-400 py-4">Loading purchases...</div>
          ) : purchases.length === 0 ? (
            <div className="text-xs font-mono-code text-slate-400 py-4 bg-[#141712] rounded-2xl border border-white/[0.08] text-center font-semibold">
              {isPaid ? 'Winter Arc 90-Day System (Active)' : 'No purchases found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-code text-slate-300 font-semibold">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[#9fe870] uppercase tracking-wider">
                    <th className="pb-2">Product</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {purchases.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 font-sans font-semibold text-slate-200">Winter Arc 90-Day System</td>
                      <td className="py-3">${(p.amount / 100).toFixed(2)} {p.currency}</td>
                      <td className="py-3">
                        <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'paid'
                            ? 'bg-[#e2f6d5] text-[#163300]'
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
