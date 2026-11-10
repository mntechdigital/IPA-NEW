'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="p-8 text-center bg-white rounded-2xl border border-red-200 my-8">
      <h2 className="text-lg font-bold text-red-600 mb-2">Dashboard Error</h2>
      <p className="text-xs text-[#64748B] mb-4">{error?.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-[#0C57A5] text-white text-xs font-bold rounded-xl"
      >
        Try Again
      </button>
    </div>
  );
}
