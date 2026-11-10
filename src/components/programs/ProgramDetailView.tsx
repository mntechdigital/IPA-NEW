'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, Target, Users, Calendar, ArrowRight, Share2 } from 'lucide-react';
import { ProgramItem } from '@/types';
import { GetInvolvedModal } from '@/components/ui/GetInvolvedModal';

interface ProgramDetailViewProps {
  program: ProgramItem;
}

export function ProgramDetailView({ program }: ProgramDetailViewProps) {
  const [involvedModalOpen, setInvolvedModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="bg-white">
      {/* Header in Brand Navy */}
      <header className="bg-[#0B2A4A] text-white py-12 sm:py-16 border-b border-[#0C57A5]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <Link
            href="/programs"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Programs</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs text-blue-200 mb-3 font-mono">
            <span className="font-bold text-[#F6B834] uppercase tracking-wider">{program.category}</span>
            <span aria-hidden="true">·</span>
            <span>Status: {program.status}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight mb-4 leading-tight text-balance text-white">
            {program.title}
          </h1>

          <p className="text-sm sm:text-base text-blue-100 font-serif italic max-w-2xl leading-relaxed mb-6">
            &ldquo;{program.subtitle}&rdquo;
          </p>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-blue-100">
              <span className="text-blue-300 block font-mono">Lead Directorate</span>
              <span className="font-bold text-white">{program.leadFellow}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setInvolvedModalOpen(true)}
                className="px-5 py-2.5 bg-[#0C57A5] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#094787] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Participate in Program</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 bg-white/10 text-white hover:bg-white/20 rounded-full border border-white/20 transition-colors cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </header>

      {copied && (
        <div className="bg-[#0C57A5] text-white text-xs text-center py-2 font-medium">
          Program link copied to clipboard.
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          <div className="lg:col-span-8 space-y-10">
            {/* Visual Overview */}
            {program.coverImage ? (
              <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFD] rounded-3xl overflow-hidden shadow-xs">
                <div className="relative aspect-16/9 w-full bg-slate-100 rounded-2xl overflow-hidden">
                  <Image
                    src={program.coverImage}
                    alt={program.title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
                <div className="p-3 text-xs text-[#64748B] font-serif italic">
                  Fig 2.1 — Field engagement and participants during the {program.title}.
                </div>
              </div>
            ) : null}

            {/* Overview Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-serif text-[#0B2A4A]">
                1. Program Overview & Rationale
              </h2>
              <p className="editorial-dropcap text-base text-[#1E293B] leading-relaxed">
                {program.overview}
              </p>
            </div>

            {/* Strategic Objectives */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-serif text-[#0B2A4A]">
                2. Strategic Objectives
              </h2>
              <div className="space-y-2.5">
                {program.objectives.map((obj, i) => (
                  <div key={i} className="p-4 bg-[#F8FAFD] rounded-2xl border border-[#E2E8F0] flex items-start gap-3 text-xs sm:text-sm text-[#1E293B] shadow-2xs">
                    <CheckCircle className="w-4 h-4 text-[#0C57A5] shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Activities */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-serif text-[#0B2A4A]">
                3. Core Program Activities
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-[#1E293B] list-disc pl-5">
                {program.activities.map((act, i) => (
                  <li key={i} className="leading-relaxed">
                    {act}
                  </li>
                ))}
              </ul>
            </div>

            {/* Expected Outcomes */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-serif text-[#0B2A4A]">
                4. Expected Civic & Policy Outcomes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {program.expectedOutcomes.map((out, i) => (
                  <div key={i} className="p-5 bg-white rounded-2xl border border-[#E2E8F0] text-xs text-[#1E293B] shadow-xs">
                    <strong className="text-[#0B2A4A] block font-bold mb-1">Impact Marker 0{i + 1}:</strong>
                    <p className="leading-relaxed text-[#64748B]">{out}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-[#F8FAFD] rounded-3xl border border-[#E2E8F0] text-xs space-y-3 shadow-xs">
              <h3 className="font-mono uppercase tracking-wider text-[#0B2A4A] font-bold pb-2 border-b border-[#E2E8F0]">
                Program Specifications
              </h3>
              <div>
                <span className="text-[#64748B] block">Operational Status:</span>
                <span className="font-bold text-[#0C57A5]">{program.status}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Primary Target Group:</span>
                <span className="text-[#1E293B]">{program.targetAudience}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Supervising Fellow:</span>
                <span className="text-[#1E293B]">{program.leadFellow}</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setInvolvedModalOpen(true)}
                  className="w-full py-2.5 bg-[#0C57A5] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#094787] transition-colors cursor-pointer shadow-xs"
                >
                  Join / Partner With Program
                </button>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] text-xs space-y-2 shadow-xs">
              <h3 className="font-mono uppercase tracking-wider text-[#0B2A4A] font-bold">
                Institutional Support
              </h3>
              <p className="text-[#64748B] leading-relaxed">
                Organizations, university departments, and student clubs interested in hosting a regional workshop can submit an institutional partnership inquiry.
              </p>
              <Link
                href="/contact?intent=program"
                className="inline-block text-[#0C57A5] font-bold hover:underline pt-1"
              >
                Submit Collaboration Request →
              </Link>
            </div>
          </aside>

        </div>
      </div>

      <GetInvolvedModal isOpen={involvedModalOpen} onClose={() => setInvolvedModalOpen(false)} />
    </article>
  );
}
