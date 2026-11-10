import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Home, Info, ArrowRight, Layout, Sparkles, Megaphone, Target, BarChart2, FolderDown } from 'lucide-react';

export default function DashboardPagesIndex() {
  const pages = [
    {
      title: 'Home Page Controller',
      href: '/dashboard/pages/home',
      icon: Home,
      badge: 'Main Landing',
      badgeColor: 'bg-[#EAF2FA] text-[#0C57A5] border-[#0C57A5]/20',
      description:
        'Manage top institutional announcement ticker, hero display masthead, cover image, YouTube presentation video, core thematic focus pillars, audited impact metrics, and downloadable resources.',
      features: [
        { label: 'Announcement Ticker', icon: Megaphone },
        { label: 'Hero Image & Video', icon: Sparkles },
        { label: 'Impact Indicators', icon: BarChart2 },
        { label: 'Downloadable Resources', icon: FolderDown },
      ],
    },
    {
      title: 'About Page Controller',
      href: '/dashboard/pages/about',
      icon: Info,
      badge: 'Institutional Identity',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description:
        'Manage the hero masthead, foundational mandate narrative, research principles, institutional milestones timeline, and academic partner network.',
      features: [
        { label: 'Hero & Mandate Story', icon: Layout },
        { label: 'Mission & Core Values', icon: Target },
        { label: 'Milestones Timeline', icon: Sparkles },
        { label: 'Collaborators Network', icon: BarChart2 },
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <PageHeader
        badge="Page Controllers"
        title="Web Page Controllers"
        description="Select a page to customize its dynamic sections, editorial content, and multimedia components."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pages.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.href}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#0C57A5]/10 text-[#0C57A5] flex items-center justify-center group-hover:bg-[#0C57A5] group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full border ${p.badgeColor}`}
                  >
                    {p.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-serif text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F1F5F9] flex flex-wrap gap-2">
                  {p.features.map((feat) => {
                    const FeatIcon = feat.icon;
                    return (
                      <span
                        key={feat.label}
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-lg"
                      >
                        <FeatIcon className="w-3 h-3 text-[#0C57A5]" />
                        <span>{feat.label}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#F1F5F9]">
                <Link
                  href={p.href}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold transition-colors shadow-2xs group/btn"
                >
                  <span>Configure Page Content</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
