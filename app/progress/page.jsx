'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import ProgressStats from '@/src/components/ProgressStats';
import { getCurrentArcDay } from '@/src/utils/dates';
import { useArc } from '@/src/context/ArcContext';
import { Loader2 } from 'lucide-react';

export default function ProgressPage() {
  const router = useRouter();
  const { user, arc, checkInsMap, loading } = useArc();
  const [simulatedDayNum, setSimulatedDayNum] = useState(1);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (user.accessStatus !== 'PAID') {
        router.push('/unlock');
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
        currentView="progress"
        simulatedDay={simulatedDayNum}
        userProfile={{ name: user?.name }}
      />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400 font-mono-code text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF4500]" />
            <span>Loading Progress...</span>
          </div>
        ) : (
          <ProgressStats
            startDateStr={arc?.startDate || '2026-10-01'}
            currentDayNum={simulatedDayNum}
            commitments={arc?.commitments || []}
            checkIns={checkInsMap}
          />
        )}
      </main>
      <Footer onOpenOnboarding={() => router.push('/onboarding')} />
    </div>
  );
}
