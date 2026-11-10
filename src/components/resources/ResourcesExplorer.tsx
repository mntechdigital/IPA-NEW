'use client';

import React, { useState, useMemo } from 'react';
import { Search, Download, FileText, ArrowUpDown, Filter } from 'lucide-react';
import { RESOURCES } from '@/data/resources';
import { DownloadModal } from '@/components/ui/DownloadModal';
import { ResourceItem } from '@/types';

interface ResourcesExplorerProps {
  items?: ResourceItem[];
}

export function ResourcesExplorer({ items }: ResourcesExplorerProps) {
  const allResources = items || RESOURCES;
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [downloadTarget, setDownloadTarget] = useState<ResourceItem | null>(null);
  const [sortBy, setSortBy] = useState<'downloads' | 'recent'>('downloads');

  const types = ['All', 'Research Report', 'Policy Brief', 'Media Resource', 'Discussion Paper', 'Dataset & Guide'];

  const filteredResources = useMemo(() => {
    return allResources.filter((res) => {
      const matchesSearch = 
        !search.trim() ||
        res.title.toLowerCase().includes(search.toLowerCase()) ||
        res.description.toLowerCase().includes(search.toLowerCase()) ||
        res.category.toLowerCase().includes(search.toLowerCase());

      const matchesType = selectedType === 'All' || res.type === selectedType;
      return matchesSearch && matchesType;
    }).sort((a, b) => {
      if (sortBy === 'downloads') {
        return b.downloadCount - a.downloadCount;
      }
      return b.year - a.year;
    });
  }, [search, selectedType, sortBy, allResources]);

  return (
    <div className="bg-white">
      {/* Header in Brand Navy */}
      <section className="bg-[#0B2A4A] text-white py-14 sm:py-18 border-b border-[#0C57A5]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-[11px] uppercase tracking-widest font-mono text-[#F6B834] font-bold mb-2">
            OPEN KNOWLEDGE & DOCUMENTATION
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight max-w-3xl mb-4 text-balance">
            Knowledge Hub & Public Resources
          </h1>
          <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl font-normal leading-relaxed">
            Downloadable research reports, Right to Information guides, media verification manuals, open survey datasets, and secondary school curriculums.
          </p>
        </div>
      </section>

      {/* Main Catalog View */}
      <section className="py-12 sm:py-16 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Controls */}
          <div className="bg-[#F8FAFD] border border-[#E2E8F0] rounded-3xl p-5 sm:p-7 mb-8 text-left space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search resources by topic, dataset name, or file format..."
                  className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-white border border-[#E2E8F0] rounded-full focus:border-[#0C57A5] focus:outline-hidden text-[#1E293B]"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-[#64748B] font-bold hidden sm:inline">Sort by:</span>
                <button
                  onClick={() => setSortBy(sortBy === 'downloads' ? 'recent' : 'downloads')}
                  className="px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-full text-xs font-bold text-[#0B2A4A] hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#0C57A5]" />
                  <span>{sortBy === 'downloads' ? 'Most Downloaded' : 'Most Recent'}</span>
                </button>
              </div>
            </div>

            {/* Type tabs in logo blue */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E2E8F0]">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3.5 py-1.5 text-xs rounded-full transition-colors cursor-pointer ${
                    selectedType === t
                      ? 'bg-[#0C57A5] text-white font-bold shadow-xs'
                      : 'bg-white text-[#1E293B] border border-[#E2E8F0] hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog List */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] divide-y divide-[#E2E8F0] overflow-hidden shadow-xs text-left">
            {filteredResources.map((res) => (
              <div 
                key={res.id}
                className="p-5 sm:p-6 hover:bg-[#F8FAFD] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                    <span className="font-bold text-[#0C57A5]">{res.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{res.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{res.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-500">{res.downloadCount.toLocaleString()} downloads</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors">
                    {res.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
                  <span className="font-mono text-xs text-[#64748B] px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                    {res.fileFormat} · {res.size}
                  </span>

                  <button
                    onClick={() => setDownloadTarget(res)}
                    className="px-5 py-2 bg-[#0C57A5] hover:bg-[#094787] text-white rounded-full transition-colors text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="p-12 text-center bg-[#F8FAFD] rounded-3xl border border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#0B2A4A] mb-1">No resources found</h3>
              <p className="text-xs text-[#64748B]">Try resetting your search query.</p>
            </div>
          )}

        </div>
      </section>

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
    </div>
  );
}
