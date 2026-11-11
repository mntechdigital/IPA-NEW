'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Download, Quote, Share2, ArrowLeft, CheckCircle, FileText, ChevronRight } from 'lucide-react';
import { ResearchItem } from '@/types';
import { DownloadModal } from '@/components/ui/DownloadModal';
import { CitationModal } from '@/components/ui/CitationModal';
import { RESEARCH_ITEMS } from '@/data/research';

interface PublicationDetailViewProps {
  item: ResearchItem;
  relatedItems?: ResearchItem[];
}

function renderFormattedContent(text?: string, fallbackClass = "text-sm sm:text-base text-[#1E293B] leading-relaxed") {
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
  return <p className={fallbackClass}>{text}</p>;
}

export function PublicationDetailView({ item, relatedItems }: PublicationDetailViewProps) {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [citationOpen, setCitationOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const pool = (relatedItems && relatedItems.length > 0) ? relatedItems : RESEARCH_ITEMS;
  const related = pool.filter(
    r => r.id !== item.id && (r.category === item.category || r.type === item.type)
  ).slice(0, 3);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <article className="bg-white">
      {/* Header in Brand Navy */}
      <header className="bg-[#0B2A4A] text-white py-12 sm:py-16 border-b border-[#0C57A5]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <Link
            href="/research"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Research Archive</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs text-blue-200 mb-4 font-mono">
            <span className="font-bold text-[#F6B834] uppercase tracking-wider">{item.category}</span>
            <span aria-hidden="true">·</span>
            <span>{item.type}</span>
            <span aria-hidden="true">·</span>
            <span>{item.date}</span>
            <span aria-hidden="true">·</span>
            <span>{item.pages} Pages</span>
            {item.doi && (
              <>
                <span aria-hidden="true">·</span>
                <span>DOI: {item.doi}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight mb-6 leading-tight text-balance text-white">
            {item.title}
          </h1>

          {/* Authors Strip */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-blue-200/70 block font-mono">
                Principal Investigators
              </span>
              <div className="text-sm font-medium text-white flex flex-wrap gap-4">
                {item.authors.map((a) => (
                  <div key={a.name}>
                    <span className="font-bold">{a.name}</span>
                    <span className="text-xs text-blue-200 block font-normal">{a.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDownloadOpen(true)}
                className="px-5 py-2.5 bg-[#0C57A5] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#094787] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Report ({item.fileSize})</span>
              </button>

              <button
                onClick={() => setCitationOpen(true)}
                className="px-4 py-2.5 bg-white/10 text-white hover:bg-white/20 text-xs font-bold rounded-full border border-white/20 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Quote className="w-3.5 h-3.5" />
                <span>Cite</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 bg-white/10 text-white hover:bg-white/20 rounded-full border border-white/20 transition-colors cursor-pointer"
                aria-label="Share article"
                title="Copy link to clipboard"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </header>

      {copiedLink && (
        <div className="bg-[#0C57A5] text-white text-xs text-center py-2 font-medium">
          Publication URL copied to your clipboard.
        </div>
      )}

      {/* Main Reading Canvas */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 text-left">
          
          {/* Main Reading Column: 8 Cols */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Lead Image & Abstract */}
            {item.coverImage ? (
              <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFD] rounded-3xl overflow-hidden shadow-xs">
                <div className="relative aspect-16/9 w-full bg-slate-100 rounded-2xl overflow-hidden">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
                <div className="p-3 text-xs text-[#64748B] font-serif italic">
                  {item.title} — Empirical Research Publication
                </div>
              </div>
            ) : null}

            {/* Abstract */}
            <div className="p-6 bg-[#F8FAFD] border-l-4 border-[#0C57A5] border-y border-r border-[#E2E8F0] rounded-r-2xl">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#0C57A5] font-bold mb-2">
                Executive Abstract
              </h2>
              <p className="text-sm sm:text-base text-[#1E293B] leading-relaxed font-sans">
                {item.abstract}
              </p>
            </div>

            {/* Key Findings */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-serif text-[#0B2A4A]">
                Key Empirical Findings
              </h2>
              <div className="space-y-3">
                {item.keyFindings.map((finding, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-2xl border border-[#E2E8F0] flex items-start gap-3 shadow-2xs">
                    <span className="font-mono text-xs font-bold text-[#0C57A5] shrink-0 mt-0.5">
                      0{idx + 1}.
                    </span>
                    <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                      {finding}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            {item.content?.executiveSummary && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-serif text-[#0B2A4A]">
                  1. Executive Summary & Context
                </h2>
                {renderFormattedContent(item.content.executiveSummary, "editorial-dropcap text-base text-[#1E293B] leading-relaxed")}
              </div>
            )}

            {/* Section 2: Methodology */}
            {item.content?.methodology && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-serif text-[#0B2A4A]">
                  2. Methodological Design & Data Sources
                </h2>
                {renderFormattedContent(item.content.methodology)}
              </div>
            )}

            {/* Section 3: Discussion & Analysis */}
            {item.content?.discussion && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-serif text-[#0B2A4A]">
                  3. Analytical Discussion
                </h2>
                {renderFormattedContent(item.content.discussion)}

                {/* Editorial Pull Quote */}
                <div className="my-8 py-6 border-y border-[#E2E8F0] px-4 text-center">
                  <blockquote className="font-serif italic text-lg sm:text-xl text-[#0B2A4A] max-w-xl mx-auto leading-relaxed">
                    &ldquo;When news organizations prioritize public accountability over commercial sensationalism, citizen cynicism recedes, providing democratic governance with its most reliable foundation.&rdquo;
                  </blockquote>
                  <cite className="block text-xs font-mono uppercase tracking-wider text-[#0C57A5] font-bold mt-2 not-italic">
                    — IPA Institutional Research Directorate
                  </cite>
                </div>
              </div>
            )}

            {/* Section 4: Policy Recommendations */}
            {Array.isArray(item.content?.recommendations) && item.content.recommendations.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-serif text-[#0B2A4A]">
                  4. Strategic Policy Recommendations
                </h2>
                <ul className="space-y-2.5">
                  {item.content.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1E293B]">
                      <CheckCircle className="w-4 h-4 text-[#0C57A5] shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Right Sidebar: 4 Cols */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Publication Factsheet */}
            <div className="p-6 bg-[#F8FAFD] rounded-3xl border border-[#E2E8F0] text-xs space-y-3 shadow-xs">
              <h3 className="font-mono uppercase tracking-wider text-[#0B2A4A] font-bold pb-2 border-b border-[#E2E8F0]">
                Publication Metadata
              </h3>
              <div>
                <span className="text-[#64748B] block">Document ID:</span>
                <span className="font-mono font-medium text-[#1E293B]">{item.id}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Classification:</span>
                <span className="font-medium text-[#1E293B]">{item.type}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Research Category:</span>
                <span className="font-bold text-[#0C57A5]">{item.category}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Publication Date:</span>
                <span className="font-medium text-[#1E293B]">{item.date}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Pagination & Volume:</span>
                <span className="font-mono text-[#1E293B]">{item.pages} pages ({item.fileSize})</span>
              </div>
              {item.doi && (
                <div>
                  <span className="text-[#64748B] block">Digital Object Identifier:</span>
                  <span className="font-mono text-[#0C57A5] break-all">{item.doi}</span>
                </div>
              )}
              <div className="pt-2">
                <button
                  onClick={() => setDownloadOpen(true)}
                  className="w-full py-2.5 bg-[#0C57A5] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#094787] transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full Report</span>
                </button>
              </div>
            </div>

            {/* Citation Box */}
            <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] text-xs space-y-2 shadow-xs">
              <h3 className="font-mono uppercase tracking-wider text-[#0B2A4A] font-bold">
                Academic Citation
              </h3>
              <p className="text-[#64748B] text-[11px] leading-relaxed">
                Researchers and students are encouraged to cite this empirical study in policy briefs and academic theses.
              </p>
              <button
                onClick={() => setCitationOpen(true)}
                className="w-full py-2 bg-[#F8FAFD] border border-[#E2E8F0] rounded-full text-[#0B2A4A] hover:bg-slate-100 transition-colors font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Quote className="w-3.5 h-3.5 text-[#0C57A5]" />
                <span>Export APA / Chicago Citation</span>
              </button>
            </div>

            {/* Related Research */}
            {related.length > 0 && (
              <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] text-xs space-y-3 shadow-xs">
                <h3 className="font-mono uppercase tracking-wider text-[#0B2A4A] font-bold pb-2 border-b border-[#E2E8F0]">
                  Related Inquiries
                </h3>
                <div className="space-y-3">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/research/${rel.slug}`}
                      className="block group"
                    >
                      <div className="text-[11px] text-[#64748B] mb-0.5">{rel.type} · {rel.year}</div>
                      <div className="font-bold text-[#1E293B] group-hover:text-[#0C57A5] transition-colors leading-snug">
                        {rel.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </aside>

        </div>
      </div>

      {/* Modals */}
      <DownloadModal
        isOpen={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        title={item.title}
        category={item.category}
        type={item.type}
        fileSize={item.fileSize}
        pages={item.pages}
        doi={item.doi}
        downloadUrl={item.downloadUrl}
      />

      <CitationModal
        isOpen={citationOpen}
        onClose={() => setCitationOpen(false)}
        item={item}
      />
    </article>
  );
}
