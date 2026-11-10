import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { prisma } from "@/lib/prisma";
import {
  Megaphone,
  Sparkles,
  BarChart2,
  ArrowRight,
  ArrowLeft,
  Compass,
  AlertCircle,
  FolderDown,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  let isDbConnected = true;
  let settings: any = null;
  let impactIndicators: any[] = [];
  let rawMedia: any[] = [];
  let resourcesCount = 0;

  try {
    [settings, impactIndicators, rawMedia, resourcesCount] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { id: "default" } }),
      prisma.impactIndicator.findMany({ orderBy: { order: "asc" } }),
      prisma.$queryRaw<any[]>`SELECT "heroImage", "heroVideoUrl", "heroVideoActive" FROM "SiteSetting" WHERE "id" = 'default' LIMIT 1`.catch(() => []),
      prisma.resourceItem.count().catch(() => 0),
    ]);
  } catch {
    isDbConnected = false;
  }

  const media = rawMedia[0] || {};
  const announcementActive = settings?.announcementActive !== false;
  const isVideoActive = Boolean(
    (media.heroVideoActive ?? (settings as any)?.heroVideoActive) &&
    (media.heroVideoUrl ?? (settings as any)?.heroVideoUrl)
  );

  const sections = [
    {
      title: "Top Announcement",
      subtitle: "Banner ticker & CTA link",
      href: "/dashboard/pages/home/announcement",
      icon: Megaphone,
      iconBg: "bg-[#FDE8B5] text-[#0B2A4A] group-hover:bg-[#0B2A4A] group-hover:text-[#F6B834]",
      badge: announcementActive ? "Active" : "Inactive",
      badgeColor: announcementActive
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-slate-100 text-slate-600 border-slate-200",
    },
    {
      title: "Hero & Media",
      subtitle: "Masthead, photo & video",
      href: "/dashboard/pages/home/hero",
      icon: Sparkles,
      iconBg: "bg-[#EAF2FA] text-[#0C57A5] group-hover:bg-[#0C57A5] group-hover:text-white",
      badge: isVideoActive ? "Video On" : "Photo Mode",
      badgeColor: isVideoActive
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-blue-50 text-[#0C57A5] border-blue-200",
    },
    {
      title: "Impact Metrics",
      subtitle: "Audited figures & benchmarks",
      href: "/dashboard/pages/home/impact",
      icon: BarChart2,
      iconBg: "bg-[#0B2A4A]/10 text-[#0B2A4A] group-hover:bg-[#0B2A4A] group-hover:text-white",
      badge: `${impactIndicators.length} Metrics`,
      badgeColor: "bg-indigo-50 text-[#0B2A4A] border-indigo-200",
    },
    {
      title: "Knowledge & Downloads",
      subtitle: "Policy briefs, data & guides",
      href: "/dashboard/pages/home/resources",
      icon: FolderDown,
      iconBg: "bg-[#0C57A5]/10 text-[#0C57A5] group-hover:bg-[#0C57A5] group-hover:text-white",
      badge: `${resourcesCount} Docs`,
      badgeColor: "bg-blue-50 text-[#0C57A5] border-blue-200",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/dashboard/pages"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0C57A5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Page Controllers</span>
        </Link>
      </div>

      {/* Header */}
      <PageHeader
        badge="Page Controller"
        title="Home Page Sections"
        description="Select a section to manage its content, media assets, or settings."
      />

      {!isDbConnected && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Database connection is temporarily unreachable. The server is attempting to reconnect to Neon PostgreSQL.
          </span>
        </div>
      )}

      {/* Clean, Compact Responsive Card Grid (4 section cards in 1 row on large displays) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <Link
              key={sec.href}
              href={sec.href}
              className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs hover:shadow-md hover:border-[#0C57A5]/50 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Icon & Badge Header */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${sec.iconBg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${sec.badgeColor}`}
                  >
                    {sec.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-base font-bold font-serif text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors">
                  {sec.title}
                </h3>
                <p className="text-xs text-[#64748B] mt-1 line-clamp-1">
                  {sec.subtitle}
                </p>
              </div>

              {/* Action Prompt */}
              <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#0C57A5] group-hover:text-[#0B2A4A]">
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Dynamic Programs Info Callout */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0C57A5]/10 text-[#0C57A5] flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1E293B]">
              Latest Programs & Initiatives
            </p>
            <p className="text-[11px] text-[#64748B]">
              The home page automatically synchronizes and displays the 3 latest programs created in Programs & Initiatives.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/programs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0C57A5] hover:text-[#0B2A4A] transition-colors shrink-0 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs"
        >
          <span>Open Programs Manager</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
