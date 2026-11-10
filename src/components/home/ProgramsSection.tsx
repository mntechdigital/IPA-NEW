import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Compass, Calendar, Users } from 'lucide-react';
import { PROGRAMS } from '@/data/programs';
import { ProgramItem } from '@/types';

interface ProgramsSectionProps {
  programs?: ProgramItem[];
}

export function ProgramsSection({ programs }: ProgramsSectionProps) {
  const allPrograms = programs && programs.length > 0 ? programs.slice(0, 4) : PROGRAMS;

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 text-left">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-widest font-mono text-[#0C57A5] font-bold mb-1">
              ACTION & PUBLIC PROGRAMS
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#0B2A4A]">
              Turning Research Into Meaningful Engagement
            </h2>
          </div>
          <Link
            href="/programs"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0C57A5] hover:text-[#094787] transition-colors"
          >
            <span>View All Programs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2x2 Distinct Editorial Grid with Rounded-2xl Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {allPrograms.map((program, index) => (
            <div 
              key={program.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-16/9 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={program.coverImage}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Status Overlay in Logo Blue */}
                  <div className="absolute top-3 left-3 bg-[#0C57A5] text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    Status: {program.status}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#0C57A5] mb-1.5 font-mono">
                    {program.category}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors leading-snug mb-2.5">
                    <Link href={`/programs/${program.slug}`}>
                      {program.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-4">
                    {program.subtitle}
                  </p>

                  <div className="text-xs text-[#64748B] space-y-1 pt-3 border-t border-slate-100">
                    <div>
                      <strong className="text-[#1E293B]">Target Audience:</strong> {program.targetAudience}
                    </div>
                    <div>
                      <strong className="text-[#1E293B]">Lead Unit:</strong> {program.leadFellow}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-6 py-3.5 bg-[#F8FAFD] border-t border-[#E2E8F0] flex items-center justify-between">
                <Link
                  href={`/programs/${program.slug}`}
                  className="text-xs font-bold uppercase tracking-wider text-[#0C57A5] group-hover:text-[#094787] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Explore Initiative Scope</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <span className="font-mono text-xs text-[#64748B]">0{index + 1} / 04</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
