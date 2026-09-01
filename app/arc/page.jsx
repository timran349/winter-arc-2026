'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import ContractModal from '@/src/components/ContractModal';
import AccountSection from '@/src/components/AccountSection';
import { useArc } from '@/src/context/ArcContext';
import { getCurrentArcDay } from '@/src/utils/dates';
import { Loader2 } from 'lucide-react';

export default function ArcPage() {
  const router = useRouter();
  const { user, arc, loading } = useArc();
  const [simulatedDayNum, setSimulatedDayNum] = useState(1);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (!arc) {
        router.push('/onboarding');
        return;
      }

      const todayStr = new Date().toISOString().split('T')[0];
      const currentDay = getCurrentArcDay(arc.startDate, todayStr);
      setSimulatedDayNum(currentDay);
    }
  }, [loading, user, arc, router]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-[#FF4500] selection:text-white font-sans">
      <Navbar
        currentView="arc"
        simulatedDay={simulatedDayNum}
        userProfile={{ name: user?.name }}
      />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400 font-mono-code text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF4500]" />
            <span>Loading Arc Contract...</span>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
      <Footer onOpenOnboarding={() => router.push('/onboarding')} />
    </div>
  );
}
