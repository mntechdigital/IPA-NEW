import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { HomeResourcesManager } from '@/components/dashboard/HomeResourcesManager';

export const dynamic = 'force-dynamic';

export default function HomeResourcesPageController() {
  return (
    <div className="space-y-6 max-w-7xl w-full mx-auto pb-16">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/dashboard/pages/home"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0C57A5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home Page Sections</span>
        </Link>
      </div>

      <PageHeader
        badge="Section Controller"
        title="Knowledge Hub & Downloadable Resources"
        description="Manage open-access policy briefs, research datasets, civic toolkits, and codebooks displayed on the public home page."
      />

      <HomeResourcesManager />
    </div>
  );
}
