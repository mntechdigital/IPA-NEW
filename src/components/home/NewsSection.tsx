'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { NEWS_ITEMS } from '@/data/news';
import { NewsItem } from '@/types';

interface NewsSectionProps {
  news?: NewsItem[];
}

export function NewsSection({ news }: NewsSectionProps) {
  const allNews = news && news.length > 0 ? news : NEWS_ITEMS;
  const primaryNews = allNews.slice(0, 2);
  const secondaryNews = allNews.slice(2, 5);

  return (
    <section className="py-14 sm:py-20 bg-[#F8FAFD] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10 text-left">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#0C57A5] font-bold block mb-1">
              DISPATCHES & PUBLIC UPDATES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#0B2A4A]">
              Latest News & Public Updates
            </h2>
          </div>

          <Link
            href="/news"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0C57A5] hover:text-[#094787] transition-colors"
          >
            <span>View All News</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Asymmetrical Grid: 2 Large Cards on Left + 3 Compact Rows on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left: 2 Large News Cards (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {primaryNews.map((item) => (
              <article 
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0C57A5] text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-2 font-mono">
                      <span>{item.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.readTime}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors leading-snug line-clamp-2 mb-2">
                      <Link href={`/news/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#0C57A5] group-hover:text-[#094787] transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Right: 3 Compact Horizontal Rows (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {secondaryNews.map((item) => (
              <div 
                key={item.id}
                className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-[#0C57A5]/40 transition-all flex items-center gap-4 group"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono text-[#64748B] mb-1">
                    {item.category} · {item.date}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1E293B] group-hover:text-[#0C57A5] transition-colors line-clamp-2 leading-snug">
                    <Link href={`/news/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h4>
                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#0C57A5] hover:underline mt-1"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
