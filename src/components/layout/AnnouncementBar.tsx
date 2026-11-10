'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { ORGANIZATION } from '@/data/organization';

interface AnnouncementBarProps {
  announcement?: {
    text: string;
    linkText: string;
    href: string;
    active?: boolean;
  };
}

export function AnnouncementBar({ announcement }: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);
  const data = announcement || ORGANIZATION.announcement;

  if (dismissed || announcement?.active === false) return null;

  return (
    <aside aria-label="Announcement" className="bg-[#0B2A4A] text-slate-200 text-xs border-b border-[#0C57A5]/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden text-left">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#F6B834] font-bold shrink-0">
            Announcement
          </span>
          <span className="text-blue-300 hidden sm:inline" aria-hidden="true">·</span>
          <p className="truncate text-blue-100">
            {data.text}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={data.href}
            className="inline-flex items-center gap-1 text-white hover:text-[#F6B834] font-medium transition-colors whitespace-nowrap text-xs group"
          >
            <span>{data.linkText}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-blue-300 hover:text-white transition-colors p-0.5 cursor-pointer"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
