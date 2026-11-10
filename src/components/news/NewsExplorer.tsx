'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { NEWS_ITEMS } from '@/data/news';

import { NewsItem } from '@/types';

interface NewsExplorerProps {
  initialCategory?: string;
  items?: NewsItem[];
}

export function NewsExplorer({ initialCategory, items }: NewsExplorerProps) {
  const allNews = items || NEWS_ITEMS;
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'News', 'Events', 'Press Releases', 'Announcements'];

  const filteredNews = useMemo(() => {
    return allNews.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = 
        !search.trim() ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.summary.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search, allNews]);

  return (
    <div className="bg-white">
      {/* Header in Brand Navy */}
      <section className="bg-[#0B2A4A] text-white py-14 sm:py-18 border-b border-[#0C57A5]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-[11px] uppercase tracking-widest font-mono text-[#F6B834] font-bold mb-2">
            DISPATCHES, UPDATES & STATEMENTS
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight max-w-3xl mb-4 text-balance">
            News & Media Room
          </h1>
          <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl font-normal leading-relaxed">
            Official announcements, press statements, research symposium recaps, and community engagement dispatches from the Institute of Public Affairs.
          </p>
        </div>
      </section>

      {/* Main Listing */}
      <section className="py-12 sm:py-16 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E2E8F0]">
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 text-xs rounded-full font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0C57A5] text-white font-bold shadow-xs'
                      : 'bg-[#F8FAFD] text-[#1E293B] border border-[#E2E8F0] hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dispatches..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#F8FAFD] border border-[#E2E8F0] rounded-full focus:border-[#0C57A5] focus:bg-white focus:outline-hidden text-[#1E293B]"
              />
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {filteredNews.map((item) => (
              <article 
                key={item.id}
                className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-[#0C57A5]/50 transition-all overflow-hidden group"
              >
                <div>
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={item.coverImage || '/images/hero_public_dialogue.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0C57A5] text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-[#64748B] mb-2 font-mono">
                      <span>{item.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.readTime}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold font-serif text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors leading-snug mb-3">
                      <Link href={`/news/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#64748B] line-clamp-3 leading-relaxed mb-4">
                      {item.summary}
                    </p>

                    {item.location && (
                      <div className="flex items-center gap-1.5 text-xs text-[#64748B] pt-3 border-t border-slate-100">
                        <MapPin className="w-3.5 h-3.5 text-[#0C57A5] shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-[#F8FAFD] border-t border-[#E2E8F0]">
                  <Link
                    href={`/news/${item.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-[#0C57A5] group-hover:text-[#094787] inline-flex items-center gap-1"
                  >
                    <span>Read Full Dispatch</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="p-12 text-center bg-[#F8FAFD] rounded-3xl border border-[#E2E8F0]">
              <h3 className="text-base font-bold text-[#0B2A4A] mb-1">No dispatches found</h3>
              <p className="text-xs text-[#64748B]">Try resetting your search query or selecting &lsquo;All&rsquo;.</p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
