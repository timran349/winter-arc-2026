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
          <div className="frost-glass rounded-3xl p-6 sm:p-8 border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(56,189,248,0.15)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono-code text-xs mb-2">
                YOUR ARC IS READY
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl text-slate-100 font-normal">
                Now make it real.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl font-sans">
                Track 90 days. Review every week. See your progress. Finish with proof.
              </p>
            </div>
            <button
              onClick={() => router.push('/unlock')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] shrink-0 flex items-center justify-center gap-2"
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
