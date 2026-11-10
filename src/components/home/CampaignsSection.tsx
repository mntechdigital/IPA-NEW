'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { CampaignItem } from '@/types';

interface CampaignsSectionProps {
  campaigns?: CampaignItem[];
}

export function CampaignsSection({ campaigns }: CampaignsSectionProps) {
  const featured = campaigns && campaigns.length > 0 ? campaigns[0] : null;

  const defaultBullets = [
    "36 Municipal Townhall Sessions Conducted Annually",
    "Direct Citizen Engagement with Administrative Officers",
    "Open-Source Digital Forensics & Fact Verification Clinics",
    "Community-Subsidized Public Interest Journalism Grants"
  ];

  const bullets = featured?.coreActions && Array.isArray(featured.coreActions) && featured.coreActions.length > 0
    ? featured.coreActions.map((a: any) => typeof a === 'string' ? a : a.title || a.description || defaultBullets[0])
    : defaultBullets;
  return (
    <section className="py-14 sm:py-20 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Layout: Left Brand Blue Box (#0B2E56) + Right 4-Photo Collage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
          
          {/* Left Column: Brand Blue Container with Star Motif (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0B2E56] text-white p-8 sm:p-12 rounded-3xl flex flex-col justify-between relative shadow-lg border border-[#0C57A5]/30">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#F6B834]">
                <Sparkles className="w-5 h-5" />
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold">
                  FEATURED INITIATIVE
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif leading-tight text-white">
                {featured?.title || "Building A Future In Informed Communities"}
              </h2>

              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed pt-1">
                {featured?.introduction || "Through our decentralized grassroots civic labs, IPA pairs academic fellows with local community leaders to investigate regional governance challenges, track public expenditure, and promote verified local reporting."}
              </p>

              <div className="space-y-2.5 pt-3">
                {bullets.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-blue-100">
                    <CheckCircle2 className="w-4 h-4 text-[#F6B834] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link
                href={featured ? `/campaigns/${featured.slug}` : "/campaigns"}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0C57A5] text-white hover:bg-white hover:text-[#0C57A5] text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                <span>Read Full Campaign</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* Right Column: 4-Photo Collage Layout (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-xs border border-[#E2E8F0] bg-slate-100">
              <Image
                src="/images/community_dialogue_civic.jpg"
                alt="Community members at townhall hearing"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-xs border border-[#E2E8F0] bg-slate-100">
              <Image
                src="/images/campaign_media_literacy.jpg"
                alt="Youth digital verification workshop"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-xs border border-[#E2E8F0] bg-slate-100">
              <Image
                src="/images/research_media_analysis.jpg"
                alt="Researchers analyzing policy manuscripts"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-xs border border-[#E2E8F0] bg-slate-100">
              <Image
                src="/images/about_institute_symposium.jpg"
                alt="Keynote speech at institutional symposium"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
