'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, FileText, Compass, Megaphone, Newspaper, ArrowRight, CornerDownLeft } from 'lucide-react';
import { RESEARCH_ITEMS } from '@/data/research';
import { PROGRAMS } from '@/data/programs';
import { CAMPAIGNS } from '@/data/campaigns';
import { NEWS_ITEMS } from '@/data/news';
import { RESOURCES } from '@/data/resources';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const research = RESEARCH_ITEMS.filter(
      r => r.title.toLowerCase().includes(q) || r.abstract.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    ).slice(0, 3);

    const programs = PROGRAMS.filter(
      p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    ).slice(0, 2);

    const campaigns = CAMPAIGNS.filter(
      c => c.title.toLowerCase().includes(q) || c.introduction.toLowerCase().includes(q)
    ).slice(0, 2);

    const news = NEWS_ITEMS.filter(
      n => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
    ).slice(0, 3);

    const resources = RESOURCES.filter(
      res => res.title.toLowerCase().includes(q) || res.description.toLowerCase().includes(q)
    ).slice(0, 3);

    return { research, programs, campaigns, news, resources };
  }, [query]);

  if (!isOpen) return null;

  const totalResults = results 
    ? results.research.length + results.programs.length + results.campaigns.length + results.news.length + results.resources.length
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white border border-[#E5E9E2] shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh] text-left"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-[#E5E9E2] bg-[#F8F9F6]">
          <Search className="w-5 h-5 text-[#0C463C] shrink-0 mr-3" />
          <input
            id="search-modal-title"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search research reports, programs, news, publications..."
            className="w-full bg-transparent text-sm sm:text-base text-[#172823] placeholder-[#5E6E67] focus:outline-hidden"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-[#5E6E67] hover:text-[#172823] transition-colors mr-1"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-mono text-[#5E6E67] bg-white border border-[#E5E9E2] rounded-full hover:bg-slate-100 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-5 space-y-6">
          {!query && (
            <div className="py-8 text-center">
              <p className="text-xs uppercase tracking-wider text-[#5E6E67] font-mono mb-3">Popular institutional topics</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Media Landscape', 'Right to Information', 'Youth Engagement', 'Fact-Checking', 'Algorithmic Bias'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setQuery(topic)}
                    className="px-3.5 py-1.5 text-xs text-[#0C463C] bg-[#0C463C]/10 hover:bg-[#0C463C]/20 transition-colors rounded-full font-medium"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-[#172823]">No documents found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[#5E6E67] mt-1">Try searching for keywords like &ldquo;trust&rdquo;, &ldquo;governance&rdquo;, or &ldquo;policy&rdquo;.</p>
            </div>
          )}

          {results && totalResults > 0 && (
            <div className="space-y-6">
              {/* Research Publications */}
              {results.research.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0C463C] mb-2 font-mono">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Research Publications ({results.research.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.research.map((item) => (
                      <Link
                        key={item.id}
                        href={`/research/${item.slug}`}
                        onClick={onClose}
                        className="block p-3 rounded-xl hover:bg-[#F8F9F6] border border-transparent hover:border-[#E5E9E2] transition-all group"
                      >
                        <div className="text-[11px] text-[#5E6E67] mb-0.5">
                          <span>{item.category}</span>
                          <span className="mx-1.5">·</span>
                          <span>{item.type}</span>
                          <span className="mx-1.5">·</span>
                          <span>{item.year}</span>
                        </div>
                        <div className="text-sm font-bold text-[#172823] group-hover:text-[#0C463C] transition-colors leading-snug">
                          {item.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Programs */}
              {results.programs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0C463C] mb-2 font-mono">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Programs & Initiatives</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.programs.map((item) => (
                      <Link
                        key={item.id}
                        href={`/programs/${item.slug}`}
                        onClick={onClose}
                        className="block p-3 rounded-xl hover:bg-[#F8F9F6] border border-transparent hover:border-[#E5E9E2] transition-all group"
                      >
                        <div className="text-[11px] text-[#5E6E67] mb-0.5">{item.category} · Status: {item.status}</div>
                        <div className="text-sm font-bold text-[#172823] group-hover:text-[#0C463C] transition-colors">
                          {item.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* News */}
              {results.news.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0C463C] mb-2 font-mono">
                    <Newspaper className="w-3.5 h-3.5" />
                    <span>News & Dispatches</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.news.map((item) => (
                      <Link
                        key={item.id}
                        href={`/news/${item.slug}`}
                        onClick={onClose}
                        className="block p-3 rounded-xl hover:bg-[#F8F9F6] border border-transparent hover:border-[#E5E9E2] transition-all group"
                      >
                        <div className="text-[11px] text-[#5E6E67] mb-0.5">{item.category} · {item.date}</div>
                        <div className="text-sm font-bold text-[#172823] group-hover:text-[#0C463C] transition-colors">
                          {item.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 bg-[#F8F9F6] border-t border-[#E5E9E2] flex items-center justify-between text-xs text-[#5E6E67]">
          <span>Institutional Research Archive</span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            Press ESC to exit
          </span>
        </div>
      </div>
    </div>
  );
}
