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
      <div className="card-wise p-6 sm:p-8 bg-white border border-zinc-200/80 shadow-[0_20px_60px_-20px_rgba(24,24,27,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isPaid
                ? 'bg-[#FF4500] text-white'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {isPaid ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-mono-code text-[#FF4500] uppercase tracking-widest font-bold">
                ARC 90 ACCESS
              </div>
              <div className="font-funnel text-2xl font-bold text-zinc-900 uppercase mt-0.5">
                90-DAY SYSTEM
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-1.5 rounded-full text-xs font-mono-code font-bold uppercase tracking-wider ${
              isPaid
                ? 'bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30'
                : 'bg-amber-100 text-amber-700 border border-amber-200'
            }`}>
              Status: {isPaid ? 'ACTIVE' : 'NOT UNLOCKED'}
            </div>

            {!isPaid && (
              <Link
                href="/unlock"
                className="btn-wise-primary text-xs px-5 py-2 flex items-center gap-1 font-semibold"
              >
                <span>Unlock — $19</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </Link>
            )}
          </div>
        </div>

        <p className="text-xs text-zinc-600 font-medium leading-relaxed">
          {isPaid
            ? 'Your 90-day system is active. You have full access to daily check-ins, weekly reviews, progress tracking, and proof cards.'
            : 'Unlock your 90-day tracking system for $19 USD (one-time purchase).'
          }
        </p>

        {/* PURCHASE HISTORY */}
        <div className="mt-8 pt-6 border-t border-zinc-100">
          <div className="flex items-center gap-2 text-xs font-mono-code text-[#FF4500] uppercase tracking-wider mb-4 font-bold">
            <CreditCard className="w-4 h-4 text-[#FF4500]" />
            <span>Purchase History</span>
          </div>

          {loading ? (
            <div className="text-xs font-mono-code text-zinc-400 py-4">Loading purchases...</div>
          ) : purchases.length === 0 ? (
            <div className="text-xs font-mono-code text-zinc-500 py-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-center font-medium">
              {isPaid ? 'Arc 90 90-Day System (Active)' : 'No purchases found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-code text-zinc-700 font-semibold">
                <thead>
                  <tr className="border-b border-zinc-200 text-[#FF4500] uppercase tracking-wider">
                    <th className="pb-2">Product</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {purchases.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 font-sans font-semibold text-zinc-900">Arc 90 90-Day System</td>
                      <td className="py-3">${(p.amount / 100).toFixed(2)} {p.currency}</td>
                      <td className="py-3">
                        <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'paid'
                            ? 'bg-[#FF4500]/10 text-[#FF4500]'
                            : 'bg-rose-500/10 text-rose-600 border border-rose-200'
                        }`}>
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-zinc-500">{new Date(p.purchasedAt).toLocaleDateString()}</td>
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
