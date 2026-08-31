'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContractModal from '@/components/ContractModal';
import AccountSection from '@/components/AccountSection';

export default function ArcPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [arc, setArc] = useState(null);
  const [simulatedDayNum, setSimulatedDayNum] = useState(18);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        if (!meData.user) {
          router.push('/login');
          return;
        }
        setUser(meData.user);

        const arcRes = await fetch('/api/arc');
        const arcData = await arcRes.json();
        if (!arcData.arc) {
          router.push('/onboarding');
          return;
        }

        setArc(arcData.arc);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080a] flex items-center justify-center text-xs text-slate-500 font-mono-code">
        Loading Arc Contract...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080a] text-slate-100 flex flex-col">
      <Navbar
        currentView="contract"
        setCurrentView={(v) => router.push(`/${v === 'contract' ? 'arc' : v}`)}
        simulatedDay={simulatedDayNum}
        setSimulatedDay={setSimulatedDayNum}
        userProfile={{ name: user?.name }}
      />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {user?.accessStatus !== 'PAID' && (
          <div className="card-wise p-6 sm:p-8 bg-gradient-to-r from-[#141712] via-[#0e100c] to-[#0b0c0a] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e2f6d5] text-[#163300] font-mono-code text-xs font-bold mb-3">
                YOUR ARC IS READY
              </div>
              <h2 className="font-display-wise text-3xl sm:text-4xl text-slate-100 font-black uppercase leading-[0.88]">
                Now make it real.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl font-semibold">
                Track 90 days. Review every week. See your progress. Finish with proof.
              </p>
            </div>
            <button
              onClick={() => router.push('/unlock')}
              className="btn-wise-primary w-full sm:w-auto px-6 py-3.5 text-xs font-extrabold shrink-0"
            >
              <span>UNLOCK MY ARC — $19</span>
            </button>
          </div>
        )}

        <ContractModal
          userProfile={{ name: user?.name, startDate: arc?.startDate, intention: arc?.intention }}
          commitments={arc?.commitments || []}
        />

        <AccountSection user={user} />
      </main>
      <Footer onOpenOnboarding={() => router.push('/onboarding')} />
    </div>
  );
}
