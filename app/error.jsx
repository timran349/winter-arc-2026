'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';

export default function GlobalErrorPage({ error, reset }) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error('Unhandled Client-Side Error:', error);
  }, [error]);

  const handleHardReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    } else {
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-4 selection:bg-[#FF4500] selection:text-white font-sans">
      <div className="w-full max-w-md card-wise p-8 sm:p-10 space-y-6 text-center bg-white border border-zinc-200/80 shadow-[0_20px_60px_-20px_rgba(24,24,27,0.08)]">
        <div className="w-12 h-12 rounded-full bg-[#FF4500]/10 border border-[#FF4500]/30 flex items-center justify-center mx-auto mb-2">
          <Flame className="w-6 h-6 text-[#FF4500]" />
        </div>

        <h1 className="font-fraunces text-3xl font-bold uppercase text-zinc-900 leading-tight">
          Arc 90
        </h1>

        <p className="text-xs text-zinc-500 font-medium leading-relaxed">
          Something went wrong while rendering this view. Your contract progress is saved.
        </p>

        {error?.message && (
          <div className="text-left pt-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[11px] font-mono-code font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 mx-auto"
            >
              <span>{showDetails ? 'Hide Error Details' : 'Show Error Details'}</span>
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showDetails && (
              <div className="mt-2 p-3 rounded-xl bg-zinc-50 border border-rose-200 text-rose-700 text-[10px] font-mono-code overflow-x-auto max-h-32">
                {error.message}
              </div>
            )}
          </div>
        )}

        <div className="pt-2 space-y-3">
          <button
            onClick={handleHardReload}
            className="btn-wise-primary w-full py-4 text-xs font-semibold justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-white" />
            <span>Reload Page</span>
          </button>

          <Link
            href="/"
            className="btn-wise-secondary w-full py-3.5 text-xs font-medium justify-center gap-2 text-zinc-700"
          >
            <Home className="w-4 h-4 text-[#FF4500]" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
