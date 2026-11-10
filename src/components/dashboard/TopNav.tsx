'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Globe, Sparkles } from 'lucide-react';

interface TopNavProps {
  setMobileOpen: (open: boolean) => void;
}

export function DashboardTopNav({ setMobileOpen }: TopNavProps) {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path === '/dashboard') return 'Overview & Analytics';
    if (path.includes('/dashboard/pages/home/resources')) return 'Home Page · Knowledge & Downloads';
    if (path.includes('/dashboard/pages/home/announcement')) return 'Home Page · Announcement Ticker';
    if (path.includes('/dashboard/pages/home/hero')) return 'Home Page · Hero & Media';
    if (path.includes('/dashboard/pages/home/impact')) return 'Home Page · Impact Metrics';
    if (path.includes('/dashboard/pages/home')) return 'Home Page Sections';
    if (path.includes('/dashboard/pages/about')) return 'About Page Sections';
    if (path.includes('/dashboard/research')) return 'Research & Publications';
    if (path.includes('/dashboard/programs')) return 'Programs & Initiatives';
    if (path.includes('/dashboard/campaigns')) return 'Advocacy Campaigns';
    if (path.includes('/dashboard/news')) return 'News & Media';
    if (path.includes('/dashboard/resources')) return 'Home Page Sections';
    if (path.includes('/dashboard/team')) return 'Team & Fellows';
    if (path.includes('/dashboard/inquiries')) return 'Contact Messages';
    if (path.includes('/dashboard/involvement')) return 'Involvement Requests';
    if (path.includes('/dashboard/subscribers')) return 'Newsletter Subscribers';
    if (path.includes('/dashboard/settings')) return 'Site Settings & Media';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-[#0B2A4A] hover:bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#0C57A5] tracking-widest">
              MANAGEMENT CONSOLE
            </span>
            <span className="text-[#F6B834]">✦</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold font-serif text-[#0B2A4A]">
            {getPageTitle(pathname)}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF2FA] hover:bg-[#3479B9]/15 text-[#0C57A5] text-xs font-semibold transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Live Site</span>
        </a>
      </div>
    </header>
  );
}
