'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top of page"
      className="fixed bottom-6 right-6 z-40 p-3.5 bg-[#0C57A5] text-white rounded-full shadow-lg border border-white/20 hover:bg-[#094787] transition-all duration-200 focus:outline-hidden cursor-pointer"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
