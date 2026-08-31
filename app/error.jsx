'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Flame, RefreshCw, Home } from 'lucide-react';

export default function GlobalErrorPage({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled Client-Side Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0b0c0a] text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-[#9fe870] selection:text-[#163300]">
      <div className="w-full max-w-md card-wise p-8 sm:p-10 space-y-6 text-center bg-gradient-to-b from-[#141712] via-[#0e100c] to-[#0b0c0a] border border-[#9fe870]/30 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-[#9fe870]/10 border border-[#9fe870]/30 flex items-center justify-center mx-auto mb-2">
          <Flame className="w-6 h-6 text-[#9fe870]" />
        </div>

        <h1 className="font-display-wise text-3xl font-black uppercase text-slate-100 leading-tight">
          WINTER ARC 90
        </h1>

        <p className="text-xs text-slate-300 font-semibold leading-relaxed">
          Something went wrong while rendering this view. Your contract progress is saved.
        </p>

        <div className="pt-2 space-y-3">
          <button
            onClick={() => reset()}
            className="btn-wise-primary w-full py-4 text-xs font-black justify-center gap-2 shadow-[0_0_20px_rgba(159,232,112,0.4)]"
          >
            <RefreshCw className="w-4 h-4 text-[#163300]" />
            <span>Reload Page</span>
          </button>

          <Link
            href="/"
            className="btn-wise-secondary w-full py-3.5 text-xs font-bold justify-center gap-2 text-slate-300"
          >
            <Home className="w-4 h-4 text-[#9fe870]" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
