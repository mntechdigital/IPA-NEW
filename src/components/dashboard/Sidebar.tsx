'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Home,
  Info,
  BookOpen,
  Compass,
  Megaphone,
  Newspaper,
  Users,
  Mail,
  UserCheck,
  Send,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function DashboardSidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
      router.push('/login');
    }
  };

  const navGroups = [
    {
      title: 'Main',
      items: [
        { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Page Controllers',
      items: [
        { label: 'Home Page', href: '/dashboard/pages/home', icon: Home },
        { label: 'About Page', href: '/dashboard/pages/about', icon: Info },
      ],
    },
    {
      title: 'Content Modules',
      items: [
        { label: 'Research & Studies', href: '/dashboard/research', icon: BookOpen },
        { label: 'Programs & Initiatives', href: '/dashboard/programs', icon: Compass },
        { label: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
        { label: 'News & Media', href: '/dashboard/news', icon: Newspaper },
        { label: 'Team & Fellows', href: '/dashboard/team', icon: Users },
      ],
    },
    {
      title: 'Citizen Inquiries',
      items: [
        { label: 'Contact Messages', href: '/dashboard/inquiries', icon: Mail },
        { label: 'Involvement Requests', href: '/dashboard/involvement', icon: UserCheck },
        { label: 'Subscribers', href: '/dashboard/subscribers', icon: Send },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Settings & Media', href: '/dashboard/settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B2A4A] text-white select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 p-2 flex items-center justify-center group-hover:bg-[#0C57A5] transition-colors shadow-sm">
            <Image
              src="/assets/aistudio/ipa_logo_57767e2a.svg"
              alt="IPA Logo"
              width={28}
              height={28}
              className="w-full h-auto brightness-0 invert"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white font-sans">IPA Portal</span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-[#F6B834] text-[#0B2A4A]">CMS</span>
            </div>
            <p className="text-[11px] text-blue-200/80 font-mono">Control Center</p>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-200/50">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-[#0C57A5] text-white shadow-md shadow-[#0C57A5]/30'
                        : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#F6B834]' : 'text-blue-300/70 group-hover:text-white'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#F6B834]" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom User Strip */}
      <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-blue-100 hover:text-white transition-all border border-white/10"
        >
          <span className="flex items-center gap-2">
            <span>View Public Site</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-[#F6B834]" />
        </a>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#0C57A5] text-white font-bold text-xs flex items-center justify-center border border-white/20 flex-shrink-0">
              AD
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">Administrator</p>
              <p className="text-[10px] text-blue-200/70 font-mono truncate">ipa@gmail.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-blue-200 hover:text-[#E85338] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
