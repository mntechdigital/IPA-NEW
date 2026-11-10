'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Download, Quote, ArrowRight, RotateCcw } from 'lucide-react';
import { RESEARCH_ITEMS } from '@/data/research';
import { DownloadModal } from '@/components/ui/DownloadModal';
import { CitationModal } from '@/components/ui/CitationModal';
import { Category, PublicationType, ResearchItem } from '@/types';

interface ResearchExplorerProps {
  initialCategory?: string;
  initialType?: string;
  items?: ResearchItem[];
}

export function ResearchExplorer({ initialCategory, initialType, items }: ResearchExplorerProps) {
  const allItems = items ?? RESEARCH_ITEMS;
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedType, setSelectedType] = useState<string>(initialType || 'All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [downloadTarget, setDownloadTarget] = useState<ResearchItem | null>(null);
  const [citationTarget, setCitationTarget] = useState<ResearchItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const categories = useMemo(() => {
    const defaultCats = ['Media Research', 'Public Affairs', 'Digital Media', 'Social Development', 'Governance', 'Public Awareness'];
    const itemCats = allItems.map((i) => i.category).filter(Boolean);
    return ['All', ...Array.from(new Set([...defaultCats, ...itemCats]))];
  }, [allItems]);

  const types = useMemo(() => {
    const defaultTypes = ['Research Report', 'Policy Brief', 'Discussion Paper', 'Working Paper'];
    const itemTypes = allItems.map((i) => i.type).filter(Boolean);
    return ['All', ...Array.from(new Set([...defaultTypes, ...itemTypes]))];
  }, [allItems]);

  const years = useMemo(() => {
    const itemYears = Array.from(new Set(allItems.map((i) => i.year?.toString()).filter(Boolean))).sort().reverse();
    return ['All', ...(itemYears.length > 0 ? itemYears : ['2026'])];
  }, [allItems]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allItems.filter((item) => {
      const authors = Array.isArray(item.authors) ? item.authors : [];
      const matchesSearch = 
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.abstract && item.abstract.toLowerCase().includes(q)) ||
        authors.some((a) => a?.name && a.name.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesType = selectedType === 'All' || item.type === selectedType;
      const matchesYear = selectedYear === 'All' || (item.year && item.year.toString() === selectedYear);

      return matchesSearch && matchesCategory && matchesType && matchesYear;
    });
  }, [search, selectedCategory, selectedType, selectedYear, allItems]);

  const displayedItems = filteredItems.slice(0, visibleCount);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedType('All');
    setSelectedYear('All');
  };

  return (
    <div className="bg-white">
      {/* Header Banner in Brand Navy */}
      <section className="bg-[#0B2A4A] text-white py-14 sm:py-18 border-b border-[#0C57A5]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-[11px] uppercase tracking-widest font-mono text-[#F6B834] font-bold mb-2">
            INSTITUTIONAL RESEARCH DIRECTORATE
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight max-w-3xl mb-4 text-balance">
            Research & Publications Archive
          </h1>
          <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl font-normal leading-relaxed">
            Peer-reviewed empirical studies, policy briefs, and working papers addressing media accountability, information ecosystems, and democratic governance.
          </p>
        </div>
      </section>

      {/* Main Library Controls & Grid */}
      <section className="py-10 sm:py-14 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filter Bar */}
          <div className="bg-[#F8FAFD] border border-[#E2E8F0] rounded-3xl p-5 sm:p-7 mb-8 text-left space-y-4 shadow-xs">
            
            {/* Search Input Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search publications by title, abstract keyword, or author..."
                  className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-white border border-[#E2E8F0] rounded-full focus:border-[#0C57A5] focus:outline-hidden text-[#1E293B]"
                />
              </div>

              {/* Reset button if active */}
              {(search || selectedCategory !== 'All' || selectedType !== 'All' || selectedYear !== 'All') && (
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-3 bg-white border border-[#E2E8F0] text-xs font-bold uppercase tracking-wider text-[#64748B] hover:text-[#0C57A5] rounded-full transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Filter Buttons: Categories (Segmented pill buttons in logo blue) */}
            <div>
              <span className="block text-[11px] font-mono uppercase tracking-wider text-[#64748B] mb-2 font-bold">
                Filter by Category:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#0C57A5] text-white font-bold shadow-xs'
                        : 'bg-white text-[#1E293B] border border-[#E2E8F0] hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Buttons: Publication Type & Year */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#E2E8F0]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] mr-1 font-bold">
                  Type:
                </span>
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors cursor-pointer ${
                      selectedType === t
                        ? 'bg-[#0B2A4A] text-white font-bold'
                        : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#1E293B]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-bold">
                  Year:
                </span>
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors cursor-pointer ${
                      selectedYear === y
                        ? 'bg-[#0B2A4A] text-white font-bold'
                        : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#1E293B]'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Result Statistics */}
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-6 text-left">
            <span>
              Showing <strong className="text-[#0B2A4A] font-mono">{displayedItems.length}</strong> of <strong className="text-[#0B2A4A] font-mono">{filteredItems.length}</strong> archived publications
            </span>
            <span className="font-mono text-[11px]">Creative Commons BY-NC 4.0</span>
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="p-12 text-center bg-[#F8FAFD] rounded-3xl border border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#0B2A4A] mb-1">No publications matched your criteria</h3>
              <p className="text-xs text-[#64748B] mb-4">Try clearing active category filters or adjusting search terms.</p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#0C57A5] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#094787] transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Publications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {displayedItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-[#0C57A5]/50 transition-all p-6 sm:p-7 group"
              >
                <div>
                  {item.coverImage ? (
                    <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-[#E2E8F0]">
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mb-2.5">
                    <span className="font-bold text-[#0C57A5]">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{item.pages} pp</span>
                  </div>

                  <h3 className="text-lg font-bold font-serif text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors leading-snug mb-3">
                    <Link href={`/research/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h3>

                  {Array.isArray(item.authors) && item.authors.length > 0 && (
                    <div className="text-xs text-[#64748B] mb-3">
                      <span className="font-bold text-[#1E293B]">Authors: </span>
                      {item.authors.map(a => a?.name).filter(Boolean).join(', ')}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed line-clamp-3 mb-4">
                    {item.abstract}
                  </p>

                  {Array.isArray(item.keyFindings) && item.keyFindings.length > 0 && item.keyFindings[0] && (
                    <div className="p-3.5 bg-[#F8FAFD] rounded-xl border border-[#E2E8F0] text-xs text-[#64748B] mb-4">
                      <strong className="text-[#0B2A4A] block font-bold mb-0.5">Key Finding:</strong>
                      <p className="leading-normal">{item.keyFindings[0]}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <Link
                    href={`/research/${item.slug}`}
                    className="text-[#0C57A5] font-bold uppercase tracking-wider hover:underline flex items-center gap-1.5"
                  >
                    <span>Read Full Paper</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCitationTarget(item)}
                      className="text-[#64748B] hover:text-[#0B2A4A] transition-colors flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Quote className="w-3 h-3" />
                      <span>Cite</span>
                    </button>
                    <button
                      onClick={() => setDownloadTarget(item)}
                      className="px-3.5 py-1.5 bg-[#EAF2FA] text-[#0C57A5] hover:bg-blue-100 font-bold rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF ({item.fileSize})</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredItems.length && (
            <div className="pt-10 text-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 4)}
                className="px-7 py-3 bg-white border border-[#E2E8F0] text-[#0B2A4A] hover:bg-[#F8FAFD] text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer shadow-xs"
              >
                Load Additional Publications
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Modals */}
      {downloadTarget && (
        <DownloadModal
          isOpen={!!downloadTarget}
          onClose={() => setDownloadTarget(null)}
          title={downloadTarget.title}
          category={downloadTarget.category}
          type={downloadTarget.type}
          fileSize={downloadTarget.fileSize}
          pages={downloadTarget.pages}
          doi={downloadTarget.doi}
          downloadUrl={downloadTarget.downloadUrl}
        />
      )}

      {citationTarget && (
        <CitationModal
          isOpen={!!citationTarget}
          onClose={() => setCitationTarget(null)}
          item={citationTarget}
        />
      )}
    </div>
  );
}
