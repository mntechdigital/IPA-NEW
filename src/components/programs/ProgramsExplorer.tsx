'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Compass, Calendar, Users, Filter } from 'lucide-react';
import { PROGRAMS } from '@/data/programs';

import { ProgramItem } from '@/types';

interface ProgramsExplorerProps {
  items?: ProgramItem[];
}

export function ProgramsExplorer({ items }: ProgramsExplorerProps) {
  const allPrograms = items || PROGRAMS;
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredPrograms = allPrograms.filter((p) => {
    if (statusFilter === 'All') return true;
    return p.status === statusFilter;
  });

  return (
    <div className="bg-white">
      {/* Page Header in Brand Navy */}
      <section className="bg-[#0B2A4A] text-white py-14 sm:py-18 border-b border-[#0C57A5]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-[11px] uppercase tracking-widest font-mono text-[#F6B834] font-bold mb-2">
            INSTITUTIONAL ACTION FRAMEWORKS
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight max-w-3xl mb-4 text-balance">
            Programs & Initiatives
          </h1>
          <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl font-normal leading-relaxed">
            Bridging research and societal change through community dialogue clinics, media literacy training, and youth public policy fellowships.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-12 sm:py-16 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Status Filter Bar */}
          <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#64748B] font-bold">
                Filter Status:
              </span>
              {(['All', 'Ongoing', 'Upcoming', 'Completed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-1.5 text-xs rounded-full transition-colors cursor-pointer ${
                    statusFilter === s
                      ? 'bg-[#0C57A5] text-white font-bold shadow-xs'
                      : 'bg-[#F8FAFD] text-[#1E293B] border border-[#E2E8F0] hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#64748B] hidden sm:block font-mono">
              {filteredPrograms.length} Active Frameworks
            </div>
          </div>

          {/* Programs Catalog */}
          <div className="space-y-10 text-left">
            {filteredPrograms.map((prog, idx) => (
              <div 
                key={prog.id}
                className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:border-[#0C57A5]/50 transition-all group shadow-xs"
              >
                <div className="lg:col-span-5 relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-slate-100 border border-[#E2E8F0]">
                  <Image
                    src={prog.coverImage || '/images/community_dialogue_civic.jpg'}
                    alt={prog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0C57A5] text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    Status: {prog.status}
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#0C57A5] font-mono">
                    {prog.category}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors leading-snug">
                    <Link href={`/programs/${prog.slug}`}>
                      {prog.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm font-serif italic text-[#64748B]">
                    &ldquo;{prog.subtitle}&rdquo;
                  </p>

                  <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
                    <div>
                      <strong className="text-[#1E293B]">Audience:</strong> {prog.targetAudience}
                    </div>
                    <span aria-hidden="true">·</span>
                    <div>
                      <strong className="text-[#1E293B]">Lead Unit:</strong> {prog.leadFellow}
                    </div>
                  </div>

                  <div className="pt-3">
                    <Link
                      href={`/programs/${prog.slug}`}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0C57A5] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#094787] transition-colors shadow-xs"
                    >
                      <span>Explore Program Scope & Activities</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
