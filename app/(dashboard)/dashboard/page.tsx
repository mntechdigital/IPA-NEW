import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  BookOpen,
  Compass,
  Megaphone,
  Newspaper,
  FolderDown,
  Mail,
  UserCheck,
  Send,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
  // Fetch real counts from Neon DB
  const [
    researchCount,
    programsCount,
    campaignsCount,
    newsCount,
    resourcesCount,
    inquiriesCount,
    unreadInquiriesCount,
    involvementCount,
    subscribersCount,
    recentInquiries,
    recentResearch,
  ] = await Promise.all([
    prisma.researchItem.count().catch(() => 0),
    prisma.programItem.count().catch(() => 0),
    prisma.campaignItem.count().catch(() => 0),
    prisma.newsItem.count().catch(() => 0),
    prisma.resourceItem.count().catch(() => 0),
    prisma.contactInquiry.count().catch(() => 0),
    prisma.contactInquiry.count({ where: { status: 'unread' } }).catch(() => 0),
    prisma.involvementSubmission.count().catch(() => 0),
    prisma.newsletterSubscription.count().catch(() => 0),
    prisma.contactInquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }).catch(() => []),
    prisma.researchItem.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }).catch(() => []),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0B2A4A] via-[#0B3463] to-[#0C57A5] text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-4 right-4 text-[#F6B834] opacity-70">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F6B834] text-[11px] font-mono font-bold tracking-wider uppercase mb-3">
            <span>IPA LIVE PORTAL</span>
            <span>✦</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
            Institutional Content & Affairs Dashboard
          </h2>
          <p className="text-sm text-blue-100/90 mt-2 leading-relaxed">
            Manage peer-reviewed publications, community programs, nationwide advocacy campaigns, and review incoming citizen submissions from one unified control center.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Link
              href="/dashboard/research"
              className="px-4 py-2 bg-[#E85338] hover:bg-[#D44228] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Publication</span>
            </Link>
            <Link
              href="/dashboard/pages/home"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 border border-white/20"
            >
              <span>Edit Home Page</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-blue-200 hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#F6B834]" />
            </a>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#0B2A4A]">
            Platform Metrics & Repository Status
          </h3>
          <span className="text-xs text-[#64748B] font-mono">NeonDB Connected</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Research Studies"
            value={researchCount}
            description="Policy reports & papers"
            icon={BookOpen}
            color="blue"
            badge="Peer-reviewed"
          />
          <StatCard
            label="Active Programs"
            value={programsCount}
            description="Civic & media literacy"
            icon={Compass}
            color="navy"
          />
          <StatCard
            label="Advocacy Campaigns"
            value={campaignsCount}
            description="Nationwide initiatives"
            icon={Megaphone}
            color="yellow"
          />
          <StatCard
            label="News & Media"
            value={newsCount}
            description="Press releases & updates"
            icon={Newspaper}
            color="orange"
          />
          <StatCard
            label="Downloadable Docs"
            value={resourcesCount}
            description="PDFs, briefs & guides"
            icon={FolderDown}
            color="blue"
          />
          <StatCard
            label="Contact Messages"
            value={inquiriesCount}
            description={`${unreadInquiriesCount} pending response`}
            icon={Mail}
            color="orange"
            badge={unreadInquiriesCount > 0 ? `${unreadInquiriesCount} New` : 'All read'}
          />
          <StatCard
            label="Involvement Apps"
            value={involvementCount}
            description="Volunteer & partnership requests"
            icon={UserCheck}
            color="navy"
          />
          <StatCard
            label="Subscribers"
            value={subscribersCount}
            description="Public newsletter audience"
            icon={Send}
            color="yellow"
          />
        </div>
      </div>

      {/* Tables Row: Recent Inquiries + Recent Research */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold font-serif text-[#0B2A4A] text-base">Recent Citizen Inquiries</h3>
              <p className="text-xs text-[#64748B]">Messages received via the public contact form</p>
            </div>
            <Link
              href="/dashboard/inquiries"
              className="text-xs font-semibold text-[#0C57A5] hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#64748B]">
              No contact inquiries recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0C57A5]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-semibold text-xs text-[#0B2A4A]">{inq.name}</span>
                      {inq.organization && (
                        <span className="text-[11px] text-[#64748B] ml-1.5">({inq.organization})</span>
                      )}
                      <p className="text-xs font-medium text-[#1E293B] mt-0.5 line-clamp-1">{inq.subject}</p>
                      <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2">{inq.message}</p>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold flex-shrink-0 ${
                        inq.status === 'unread'
                          ? 'bg-[#E85338]/10 text-[#E85338]'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#E2E8F0]/60 text-[10px] text-[#64748B]">
                    <span>{inq.email}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Research Publications */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold font-serif text-[#0B2A4A] text-base">Recent Publications</h3>
              <p className="text-xs text-[#64748B]">Latest reports & analytical papers in Neon DB</p>
            </div>
            <Link
              href="/dashboard/research"
              className="text-xs font-semibold text-[#0C57A5] hover:underline inline-flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentResearch.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0C57A5]/40 transition-colors flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EAF2FA] text-[#0C57A5]">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-mono">{item.date}</span>
                  </div>
                  <p className="text-xs font-bold text-[#0B2A4A] mt-1 truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                    {item.type} • {item.pages} Pages
                  </p>
                </div>
                <Link
                  href={`/dashboard/research?edit=${item.id}`}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[#0C57A5] hover:bg-[#EAF2FA] transition-colors flex-shrink-0"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
