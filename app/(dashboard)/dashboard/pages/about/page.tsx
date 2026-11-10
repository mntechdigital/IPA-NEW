import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { prisma } from "@/lib/prisma";
import { getAboutSettings } from "@/lib/services/content";
import {
  BookOpen,
  Target,
  Clock,
  Handshake,
  ArrowRight,
  ArrowLeft,
  Users,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardAboutPage() {
  let isDbConnected = true;
  let settings: any = null;
  let coreValues: any[] = [];
  let aboutSettings: any = null;
  let teamCount = 0;

  try {
    [settings, coreValues, aboutSettings, teamCount] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { id: "default" } }),
      prisma.coreValue.findMany({ orderBy: { order: "asc" } }),
      getAboutSettings(),
      prisma.teamMember.count(),
    ]);
  } catch {
    isDbConnected = false;
  }

  const milestonesCount = aboutSettings?.milestones?.length || 0;
  const collaboratorsCount = aboutSettings?.collaborators?.length || 0;

  const sections = [
    {
      title: "Hero & Mandate",
      subtitle: "Narrative, principles & archive photo",
      href: "/dashboard/pages/about/mandate",
      icon: BookOpen,
      iconBg: "bg-[#EAF2FA] text-[#0C57A5] group-hover:bg-[#0C57A5] group-hover:text-white",
      badge: "Mandate",
      badgeColor: "bg-blue-50 text-[#0C57A5] border-blue-200",
    },
    {
      title: "Mission & Values",
      subtitle: "Strategic vision & 4 core ethics",
      href: "/dashboard/pages/about/mission",
      icon: Target,
      iconBg: "bg-[#FDE8B5] text-[#0B2A4A] group-hover:bg-[#0B2A4A] group-hover:text-[#F6B834]",
      badge: `${coreValues.length} Values`,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      title: "Milestones Timeline",
      subtitle: "Historical developmental timeline",
      href: "/dashboard/pages/about/timeline",
      icon: Clock,
      iconBg: "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
      badge: `${milestonesCount} Milestones`,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Collaborators",
      subtitle: "Academic & civil society network",
      href: "/dashboard/pages/about/collaborators",
      icon: Handshake,
      iconBg: "bg-purple-50 text-purple-700 group-hover:bg-purple-700 group-hover:text-white",
      badge: `${collaboratorsCount} Partners`,
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
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
        title="About Page Sections"
        description="Select a section to configure institutional profile, narrative origins, timeline milestones, or network partners."
      />

      {!isDbConnected && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Database connection is temporarily unreachable. The server is attempting to reconnect to Neon PostgreSQL.
          </span>
        </div>
      )}

      {/* Clean, Compact 1-Row Responsive Card Grid (4 cards in 1 row on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Team Leadership Callout */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0C57A5]/10 text-[#0C57A5] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1E293B]">
              Scholarly Leadership & Fellows ({teamCount} Members)
            </p>
            <p className="text-[11px] text-[#64748B]">
              Directors, senior fellows, and researchers displayed on the About page are managed in the Team Directory.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/team"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0C57A5] hover:text-[#0B2A4A] transition-colors shrink-0 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs"
        >
          <span>Open Team Manager</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
