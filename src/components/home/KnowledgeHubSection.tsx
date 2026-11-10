'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Download, FileText } from 'lucide-react';
import { RESOURCES } from '@/data/resources';
import { DownloadModal } from '@/components/ui/DownloadModal';
import { ResourceItem } from '@/types';

interface KnowledgeHubSectionProps {
  resources?: ResourceItem[];
}

export function KnowledgeHubSection({ resources }: KnowledgeHubSectionProps) {
  const [downloadTarget, setDownloadTarget] = useState<ResourceItem | null>(null);
  const allResources = resources && resources.length > 0 ? resources : RESOURCES;
  const featuredResources = allResources.slice(0, 5);

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 text-left">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-mono text-[#0C57A5] font-bold mb-1 block">
              OPEN KNOWLEDGE INFRASTRUCTURE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#0B2A4A]">
              Resources & Knowledge Hub
            </h2>
          </div>
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0C57A5] hover:text-[#094787] transition-colors"
          >
            <span>Explore All Resources ({allResources.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Catalog Table Layout */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] divide-y divide-[#E2E8F0] overflow-hidden shadow-xs text-left">
          {featuredResources.map((res) => (
            <div 
              key={res.id}
              className="p-5 sm:p-6 hover:bg-[#F8FAFD] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                  <span className="font-bold text-[#0C57A5]">{res.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>{res.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{res.date}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{res.fileFormat} ({res.size})</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1E293B] hover:text-[#0C57A5] transition-colors">
                  {res.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] line-clamp-1">
                  {res.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
                <button
                  onClick={() => setDownloadTarget(res)}
                  className="px-5 py-2 rounded-full bg-[#0C57A5] text-white hover:bg-[#094787] transition-colors text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {downloadTarget && (
        <DownloadModal
          isOpen={!!downloadTarget}
          onClose={() => setDownloadTarget(null)}
          title={downloadTarget.title}
          category={downloadTarget.category}
          type={downloadTarget.type}
          fileSize={downloadTarget.size}
        />
      )}
    </section>
  );
}
