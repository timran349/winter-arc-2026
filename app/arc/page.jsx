'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import ContractModal from '@/src/components/ContractModal';
import AccountSection from '@/src/components/AccountSection';

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
      <div className="min-h-screen bg-white flex items-center justify-center text-xs text-zinc-500 font-mono-code">
        Loading Arc Contract...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-[#FF4500] selection:text-white font-sans">
      <Navbar
        currentView="contract"
        setCurrentView={(v) => router.push(`/${v === 'contract' ? 'arc' : v}`)}
        simulatedDay={simulatedDayNum}
        setSimulatedDay={setSimulatedDayNum}
        userProfile={{ name: user?.name }}
      />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {user?.accessStatus !== 'PAID' && (
          <div className="card-wise p-6 sm:p-8 bg-white border-2 border-[#FF4500] shadow-[0_20px_60px_-15px_rgba(255,69,0,0.12)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30 font-mono-code text-xs font-bold mb-3">
                YOUR ARC IS READY
              </div>
              <h2 className="font-funnel text-3xl sm:text-4xl text-zinc-900 font-semibold uppercase leading-tight">
                Now make it real.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-2 max-w-xl font-medium">
                Track 90 days. Review every week. See your progress. Finish with proof.
              </p>
            </div>
            <button
              onClick={() => router.push('/unlock')}
              className="btn-wise-orange w-full sm:w-auto px-6 py-3.5 text-xs font-semibold shrink-0"
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
