import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Megaphone, CheckCircle } from 'lucide-react';
import { CAMPAIGNS } from '@/data/campaigns';

import { CampaignItem } from '@/types';

interface CampaignsExplorerProps {
  items?: CampaignItem[];
}

export function CampaignsExplorer({ items }: CampaignsExplorerProps) {
  const allCampaigns = items || CAMPAIGNS;
  return (
    <div className="bg-white">
      {/* Header in Brand Navy */}
      <section className="bg-[#0B2A4A] text-white py-14 sm:py-18 border-b border-[#0C57A5]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-[11px] uppercase tracking-widest font-mono text-[#F6B834] font-bold mb-2">
            CIVIC AWARENESS & PUBLIC ADVOCACY
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight max-w-3xl mb-4 text-balance">
            Campaigns for an Informed Society
          </h1>
          <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl font-normal leading-relaxed">
            Non-partisan public awareness initiatives and grassroots advocacy tools aimed at countering disinformation, demanding administrative transparency, and fostering media literacy.
          </p>
        </div>
      </section>

      {/* Campaigns Listing */}
      <section className="py-12 sm:py-16 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 text-left">
            {allCampaigns.map((camp, idx) => (
              <div 
                key={camp.id}
                className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:border-[#0C57A5]/50 transition-all group shadow-xs"
              >
                <div className="lg:col-span-5 relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-slate-100 border border-[#E2E8F0]">
                  <Image
                    src={camp.coverImage || '/images/campaign_media_literacy.jpg'}
                    alt={camp.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0C57A5] text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    {camp.status}
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#0C57A5] font-bold">
                    CAMPAIGN 0{idx + 1}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors leading-snug">
                    <Link href={`/campaigns/${camp.slug}`}>
                      {camp.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm font-serif italic text-[#0C57A5]">
                    &ldquo;{camp.tagline}&rdquo;
                  </p>

                  <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                    {camp.introduction}
                  </p>

                  <div className="p-4 bg-[#F8FAFD] rounded-2xl border border-[#E2E8F0] text-xs text-[#1E293B]">
                    <strong className="text-[#0B2A4A] block font-bold mb-1">Key Civic Action:</strong>
                    <p className="text-[#64748B]">{camp.coreActions[0]}</p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/campaigns/${camp.slug}`}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#0C57A5] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#094787] transition-colors shadow-xs"
                    >
                      <span>Explore Campaign Guide & Toolkit</span>
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
