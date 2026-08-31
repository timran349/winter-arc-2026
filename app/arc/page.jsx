'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContractModal from '@/components/ContractModal';

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
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <ContractModal
          userProfile={{ name: user?.name, startDate: arc?.startDate, intention: arc?.intention }}
          commitments={arc?.commitments || []}
        />
      </main>
      <Footer onOpenOnboarding={() => router.push('/onboarding')} />
    </div>
  );
}
