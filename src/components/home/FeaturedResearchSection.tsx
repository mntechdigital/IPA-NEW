'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, BookOpen, Users, Compass, CheckCircle } from 'lucide-react';
import { CampaignItem, ResearchItem } from '@/types';
import { DownloadModal } from '@/components/ui/DownloadModal';

interface FeaturedResearchSectionProps {
  items?: ResearchItem[];
  campaigns?: CampaignItem[];
}

export function FeaturedResearchSection({ items, campaigns }: FeaturedResearchSectionProps) {
  const [downloadTarget, setDownloadTarget] = useState<any>(null);

  const defaultCampaignCards = [
    {
      id: "camp-01",
      title: "Think Before You Share: Media Literacy Drive",
      percentage: "78%",
      progressVal: 78,
      goal: "$50,000 / 25,000 Youths",
      raised: "$39,200",
      image: "/images/campaign_media_literacy.jpg",
      href: "/campaigns/think-before-you-share"
    },
    {
      id: "camp-02",
      title: "Voices for Informed Communities: RTI Audit",
      percentage: "94%",
      progressVal: 94,
      goal: "$35,000 / 45 Districts",
      raised: "$32,900",
      image: "/images/community_dialogue_civic.jpg",
      href: "/campaigns/voices-for-informed-communities"
    },
    {
      id: "camp-03",
      title: "Raising Standards for Public Accountability",
      percentage: "85%",
      progressVal: 85,
      goal: "$40,000 / 120 Forums",
      raised: "$34,000",
      image: "/images/hero_public_dialogue.jpg",
      href: "/campaigns/media-literacy-next-generation"
    }
  ];

  const campaignCards = (campaigns && campaigns.length > 0)
    ? campaigns.slice(0, 3).map((camp, idx) => {
        const percentages = [78, 94, 85];
        const val = percentages[idx % percentages.length];
        return {
          id: camp.id || `camp-${idx}`,
          title: camp.title,
          percentage: `${val}%`,
          progressVal: val,
          goal: camp.tagline || "$50,000 / 25,000 Youths",
          raised: `${camp.partnerNetworks?.length || 12}+ Partners`,
          image: camp.coverImage || "/images/campaign_media_literacy.jpg",
          href: `/campaigns/${camp.slug}`
        };
      })
    : defaultCampaignCards;

  return (
    <>
      {/* 1. Secondary Feature Split: 4 Bullet Features on Left + Tall Photo on Right */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: 4 Feature Items (6 Cols) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#0C57A5] font-bold block mb-2">
                  OUR CORE PILLARS
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#0B2A4A] leading-tight">
                  Helping Others Improves The World
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0C57A5]" />
                    <h4 className="text-sm font-bold text-[#1E293B]">Media Literacy & Verification</h4>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Equipping students, teachers, and civic leaders with open verification toolkits.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E85338]" />
                    <h4 className="text-sm font-bold text-[#1E293B]">Public Affairs Dialogues</h4>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Convening townhalls connecting local residents directly with municipal administrators.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F6B834]" />
                    <h4 className="text-sm font-bold text-[#1E293B]">Empirical Governance Audits</h4>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Auditing Right to Information compliance and municipal budget disclosures.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0C57A5]" />
                    <h4 className="text-sm font-bold text-[#1E293B]">Safe Democratic Spaces</h4>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Providing an independent, non-partisan platform for constructive civic inquiry.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Tall Photo with Joyful Community Portrait (6 Cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-4/3 sm:aspect-16/11 w-full rounded-3xl overflow-hidden shadow-lg border border-[#E2E8F0]">
                <Image
                  src="/images/community_dialogue_civic.jpg"
                  alt="Community members participating together in public awareness dialogue"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. "Featured Campaigns" Section with Logo Brand Colors */}
      <section className="py-14 sm:py-20 bg-[#F8FAFD] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Row with Arrows */}
          <div className="flex items-end justify-between mb-10 text-left">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#0C57A5] font-bold block mb-1">
                CIVIC MOBILIZATION · PUBLIC ACTION
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#0B2A4A]">
                Featured Campaigns & Public Initiatives
              </h2>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button 
                className="w-9 h-9 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#1E293B] hover:bg-[#0C57A5] hover:text-white transition-all shadow-xs cursor-pointer"
                aria-label="Previous campaigns"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                className="w-9 h-9 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#1E293B] hover:bg-[#0C57A5] hover:text-white transition-all shadow-xs cursor-pointer"
                aria-label="Next campaigns"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3 Campaign Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {campaignCards.map((camp) => (
              <div 
                key={camp.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with Circular Percentage Badge */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={camp.image}
                      alt={camp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Circular Percentage Badge with Logo Blue */}
                    <div className="absolute top-3 right-3 w-12 h-12 rounded-full bg-white/95 text-[#0C57A5] flex flex-col items-center justify-center shadow-md border-2 border-[#0C57A5]">
                      <span className="text-xs font-bold font-mono">{camp.percentage}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors leading-snug mb-3">
                      <Link href={camp.href}>
                        {camp.title}
                      </Link>
                    </h3>

                    {/* Progress Bar with Logo Blue */}
                    <div className="space-y-1.5 mb-4">
                      <div className="w-full h-2.5 bg-[#EAF2FA] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#0C57A5] rounded-full" 
                          style={{ width: `${camp.progressVal}%` }} 
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-[#64748B] font-mono">
                        <span>Goal: {camp.goal}</span>
                        <span className="font-bold text-[#0C57A5]">Reached: {camp.raised}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coral-Orange Pill Action Button */}
                <div className="p-5 pt-0">
                  <Link
                    href={camp.href}
                    className="w-full py-2.5 px-4 bg-[#E85338] hover:bg-[#D44228] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Support Action / Read</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {downloadTarget && (
        <DownloadModal
          isOpen={!!downloadTarget}
          onClose={() => setDownloadTarget(null)}
          title={downloadTarget.title}
          category="Research"
          type="Report"
          fileSize="3.5 MB"
        />
      )}
    </>
  );
}
