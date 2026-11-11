'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, Download, Share2, Megaphone, Users, ArrowRight } from 'lucide-react';
import { CampaignItem } from '@/types';
import { DownloadModal } from '@/components/ui/DownloadModal';
import { GetInvolvedModal } from '@/components/ui/GetInvolvedModal';

interface CampaignDetailViewProps {
  campaign: CampaignItem;
}

function renderFormattedContent(text?: string, isDropcap = false) {
  if (!text) return null;
  const isHtml = /<[a-z][\s\S]*>/i.test(text);
  if (isHtml) {
    return (
      <div 
        className="prose prose-sm sm:prose-base max-w-none text-[#1E293B] prose-headings:font-serif prose-headings:text-[#0B2A4A] prose-a:text-[#0C57A5] prose-strong:text-[#0B2A4A] prose-blockquote:border-l-[#0C57A5] prose-blockquote:text-[#475569] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }
  const paragraphs = text.split('\n\n').map((p) => p.trim()).filter(Boolean);
  return (
    <div className="space-y-4 text-base text-[#1E293B] leading-relaxed">
      {paragraphs.map((p, idx) => (
        <p key={idx} className={idx === 0 && isDropcap ? "editorial-dropcap leading-relaxed" : "leading-relaxed"}>
          {p}
        </p>
      ))}
    </div>
  );
}

export function CampaignDetailView({ campaign }: CampaignDetailViewProps) {
  const [downloadTarget, setDownloadTarget] = useState<{ title: string; size: string; url?: string } | null>(null);
  const [involvedOpen, setInvolvedOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasObjectives = Array.isArray(campaign.objectives) && campaign.objectives.length > 0;
  const hasCoreActions = Array.isArray(campaign.coreActions) && campaign.coreActions.length > 0;
  const hasResources = Array.isArray(campaign.resources) && campaign.resources.length > 0;
  const hasPartners = Array.isArray(campaign.partnerNetworks) && campaign.partnerNetworks.length > 0;

  return (
    <article className="bg-white">
      {/* Header in Brand Navy */}
      <header className="bg-[#0B2A4A] text-white py-12 sm:py-16 border-b border-[#0C57A5]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Campaigns</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-blue-200 mb-3 font-mono">
            <span className="font-bold text-[#F6B834] uppercase tracking-wider">{campaign.status || 'Active Campaign'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight mb-4 leading-tight text-balance text-white">
            {campaign.title}
          </h1>

          {campaign.tagline && (
            <p className="text-sm sm:text-base text-blue-100 font-serif italic max-w-2xl leading-relaxed mb-6">
              &ldquo;{campaign.tagline}&rdquo;
            </p>
          )}

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-blue-100">
              <span className="text-blue-300 block font-mono">Status & Mobilization</span>
              <span className="font-bold text-white">{campaign.status || 'Active Initiative'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setInvolvedOpen(true)}
                className="px-5 py-2.5 bg-[#0C57A5] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#094787] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Join Campaign</span>
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
          Campaign URL copied to clipboard.
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          <div className="lg:col-span-8 space-y-10">
            {/* Lead Image */}
            {campaign.coverImage ? (
              <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFD] rounded-3xl overflow-hidden shadow-xs">
                <div className="relative aspect-16/9 w-full bg-slate-100 rounded-2xl overflow-hidden">
                  <Image
                    src={campaign.coverImage}
                    alt={campaign.title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
                <div className="p-3 text-xs text-[#64748B] font-serif italic">
                  {campaign.title} — Public Campaign
                </div>
              </div>
            ) : null}

            {/* Introduction */}
            {campaign.introduction && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-serif text-[#0B2A4A]">
                  Campaign Introduction
                </h2>
                {renderFormattedContent(campaign.introduction, true)}
              </div>
            )}

            {/* Why It Matters (rendered if distinct from introduction) */}
            {campaign.whyItMatters && campaign.whyItMatters !== campaign.introduction && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-serif text-[#0B2A4A]">
                  Why This Campaign Matters
                </h2>
                {renderFormattedContent(campaign.whyItMatters)}
              </div>
            )}

            {/* Campaign Objectives */}
            {hasObjectives && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-serif text-[#0B2A4A]">
                  Strategic Campaign Targets
                </h2>
                <div className="space-y-2.5">
                  {campaign.objectives.map((obj, i) => (
                    <div key={i} className="p-4 bg-[#F8FAFD] rounded-2xl border border-[#E2E8F0] flex items-start gap-3 text-xs sm:text-sm text-[#1E293B] shadow-2xs">
                      <CheckCircle className="w-4 h-4 text-[#0C57A5] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Actions */}
            {hasCoreActions && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-serif text-[#0B2A4A]">
                  What Citizens Can Do: Action Steps
                </h2>
                <div className="space-y-3">
                  {campaign.coreActions.map((act, i) => (
                    <div key={i} className="p-4 bg-white rounded-2xl border border-[#E2E8F0] flex items-start gap-3 shadow-xs">
                      <span className="font-mono text-xs font-bold text-[#0C57A5] shrink-0 mt-0.5">
                        STEP 0{i + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                        {act}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Downloadable Toolkits */}
            {hasResources && (
              <div className="p-6 bg-[#F8FAFD] rounded-3xl border border-[#E2E8F0] text-xs space-y-3 shadow-xs">
                <h3 className="font-mono uppercase tracking-wider text-[#0B2A4A] font-bold pb-2 border-b border-[#E2E8F0]">
                  Downloadable Campaign Resources
                </h3>
                <div className="space-y-2.5">
                  {campaign.resources.map((res, i) => (
                    <div key={i} className="p-3.5 bg-white rounded-2xl border border-[#E2E8F0] space-y-2 shadow-2xs">
                      <div>
                        <div className="font-bold text-[#0B2A4A] leading-snug">{res.title}</div>
                        <div className="text-[11px] text-[#64748B]">{res.type} · {res.size}</div>
                      </div>
                      <button
                        onClick={() => setDownloadTarget({ title: res.title, size: res.size, url: res.url })}
                        className="w-full py-1.5 px-3 bg-[#EAF2FA] text-[#0C57A5] hover:bg-blue-100 rounded-full transition-colors font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download Toolkit</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Partner Networks */}
            {hasPartners && (
              <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] text-xs space-y-3 shadow-xs">
                <h3 className="font-mono uppercase tracking-wider text-[#0B2A4A] font-bold pb-2 border-b border-[#E2E8F0]">
                  Partner Coalitions
                </h3>
                <ul className="space-y-2 text-[#64748B]">
                  {campaign.partnerNetworks.map((partner, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#0C57A5] rounded-full shrink-0" />
                      <span>{partner}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action CTA in Brand Navy */}
            <div className="p-6 bg-[#0B2A4A] rounded-3xl text-white text-xs space-y-3 shadow-md border border-[#0C57A5]/30">
              <h3 className="font-mono uppercase tracking-wider text-[#F6B834] font-bold">
                Get Involved Locally
              </h3>
              <p className="text-blue-100 leading-relaxed text-[11px]">
                Organize a verification clinic or community listening circle at your school, college, or neighborhood association.
              </p>
              <button
                onClick={() => setInvolvedOpen(true)}
                className="w-full py-2.5 bg-[#0C57A5] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#094787] transition-colors cursor-pointer shadow-xs"
              >
                Become an Ambassador
              </button>
            </div>

          </aside>

        </div>
      </div>

      {downloadTarget && (
        <DownloadModal
          isOpen={!!downloadTarget}
          onClose={() => setDownloadTarget(null)}
          title={downloadTarget.title}
          category="Campaign Toolkit"
          type="Public Resource"
          fileSize={downloadTarget.size}
          downloadUrl={downloadTarget.url}
        />
      )}

      <GetInvolvedModal isOpen={involvedOpen} onClose={() => setInvolvedOpen(false)} />
    </article>
  );
}
