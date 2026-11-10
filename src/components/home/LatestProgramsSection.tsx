import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ProgramItem } from '@/types';
import { PROGRAMS } from '@/data/programs';

interface LatestProgramsSectionProps {
  programs?: ProgramItem[];
}

export function LatestProgramsSection({ programs }: LatestProgramsSectionProps) {
  const displayPrograms =
    programs && programs.length > 0 ? programs.slice(0, 3) : PROGRAMS.slice(0, 3);

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Signature Brand Blue Curved Container (#0B2E56) */}
        <div className="bg-[#0B2E56] rounded-3xl sm:rounded-4xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-xl border border-[#0C57A5]/30">
          {/* Header Row: Left Title & Right Description */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-12 text-left">
            <div className="lg:col-span-6 space-y-3">
              {/* Gold Outlined Tag */}
              <div className="inline-block px-3.5 py-1 rounded-full border border-white/40 text-[10px] font-mono uppercase tracking-widest text-[#F6B834] font-bold">
                ACTION & INITIATIVES
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-white">
                Delivering Solutions
              </h2>
            </div>

            <div className="lg:col-span-6 text-blue-100/90 text-xs sm:text-sm leading-relaxed lg:pt-6">
              We are a dedicated non-profit organization focused on creating sustainable democratic impact in communities. Discover our latest civic programs, town hall dialogues, and public engagement initiatives.
            </div>
          </div>

          {/* 3 Responsive Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
            {displayPrograms.map((program) => (
              <div
                key={program.id || program.slug}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between text-[#1E293B]"
              >
                <div>
                  {/* Photo with rounded top */}
                  <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={program.coverImage || '/images/campaign_media_literacy.jpg'}
                      alt={program.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Status Overlay Badge */}
                    {program.status && (
                      <div className="absolute top-3 left-3 bg-[#0B2E56]/90 backdrop-blur-xs text-[#F6B834] text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs border border-white/10">
                        {program.status}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {program.category && (
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#0C57A5] font-mono mb-2">
                        {program.category}
                      </div>
                    )}
                    <h3 className="text-base sm:text-lg font-bold text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors leading-snug mb-2.5 line-clamp-2">
                      <Link href={`/programs/${program.slug}`}>
                        {program.title}
                      </Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed line-clamp-3">
                      {program.subtitle || program.description}
                    </p>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="px-6 pb-6 pt-0">
                  <Link
                    href={`/programs/${program.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0C57A5] group-hover:text-[#094787] transition-colors"
                  >
                    <span>Explore Initiative Scope</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Centered Pill Button: VIEW ALL PROGRAMS */}
          <div className="text-center relative z-10">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/50 text-white hover:bg-white hover:text-[#0B2E56] transition-all text-xs font-bold uppercase tracking-widest shadow-xs font-mono"
            >
              <span>View All Programs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Abstract Wave Lines Motif */}
          <div className="absolute -bottom-6 -right-6 w-40 h-40 opacity-20 pointer-events-none text-[#F6B834]">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
              <path d="M 0 50 Q 25 30, 50 50 T 100 50" />
              <path d="M 0 65 Q 25 45, 50 65 T 100 65" />
              <path d="M 0 80 Q 25 60, 50 80 T 100 80" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export const FocusAreasSection = LatestProgramsSection;
