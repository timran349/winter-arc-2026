'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProgressStats from '@/components/ProgressStats';

export default function ProgressPage() {
  const router = useRouter();
  const [arc, setArc] = useState(null);
  const [checkInsMap, setCheckInsMap] = useState({});
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

        const arcRes = await fetch('/api/arc');
        const arcData = await arcRes.json();
        if (!arcData.arc) {
          router.push('/onboarding');
          return;
        }

        setArc(arcData.arc);

        const cMap = {};
        if (arcData.arc.checkIns) {
          arcData.arc.checkIns.forEach((c) => {
            if (!cMap[c.date]) cMap[c.date] = { completedIds: [], saved: true };
            if (c.completed) cMap[c.date].completedIds.push(c.commitmentId);
          });
        }
        setCheckInsMap(cMap);
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
        Loading Progress...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080a] text-slate-100 flex flex-col">
      <Navbar
        currentView="progress"
        setCurrentView={(v) => router.push(`/${v}`)}
        simulatedDay={simulatedDayNum}
        setSimulatedDay={setSimulatedDayNum}
      />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <ProgressStats
          startDateStr={arc?.startDate || '2026-10-01'}
          currentDayNum={simulatedDayNum}
          commitments={arc?.commitments || []}
          checkIns={checkInsMap}
        />
      </main>
      <Footer onOpenOnboarding={() => router.push('/onboarding')} />
    </div>
  );
}
