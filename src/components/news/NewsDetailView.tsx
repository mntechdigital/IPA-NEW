'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Share2 } from 'lucide-react';
import { NewsItem } from '@/types';
import { NEWS_ITEMS } from '@/data/news';

interface NewsDetailViewProps {
  item: NewsItem;
  relatedNews?: NewsItem[];
}

function renderFormattedContent(content?: string[] | string) {
  if (!content) return null;
  const rawText = Array.isArray(content) ? content.join('\n\n') : content;
  if (!rawText.trim()) return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(rawText);
  if (isHtml) {
    return (
      <div 
        className="prose prose-sm sm:prose-base max-w-none text-[#1E293B] prose-headings:font-serif prose-headings:text-[#0B2A4A] prose-a:text-[#0C57A5] prose-strong:text-[#0B2A4A] prose-blockquote:border-l-[#0C57A5] prose-blockquote:text-[#475569] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: rawText }}
      />
    );
  }

  const paragraphs = Array.isArray(content)
    ? content
    : rawText.split('\n\n').map((p) => p.trim()).filter(Boolean);

  return (
    <div className="space-y-6 text-sm sm:text-base text-[#1E293B] leading-relaxed">
      {paragraphs.map((p, idx) => (
        <p key={idx}>
          {p}
        </p>
      ))}
    </div>
  );
}

export function NewsDetailView({ item, relatedNews }: NewsDetailViewProps) {
  const [copied, setCopied] = useState(false);

  const newsPool = relatedNews && relatedNews.length > 0 ? relatedNews : NEWS_ITEMS;
  const related = newsPool.filter(n => n.id !== item.id).slice(0, 3);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="bg-white">
      {/* Header in Brand Navy */}
      <header className="bg-[#0B2A4A] text-white py-12 sm:py-16 border-b border-[#0C57A5]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Dispatches</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs text-blue-200 mb-3 font-mono">
            <span className="font-bold text-[#F6B834] uppercase tracking-wider">{item.category}</span>
            <span aria-hidden="true">·</span>
            <span>{item.date}</span>
            <span aria-hidden="true">·</span>
            <span>{item.readTime}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight mb-4 leading-tight text-balance text-white">
            {item.title}
          </h1>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            {item.location && (
              <div className="flex items-center gap-1.5 text-xs text-blue-100">
                <MapPin className="w-4 h-4 text-[#F6B834]" />
                <span>{item.location}</span>
              </div>
            )}

            <button
              onClick={handleShare}
              className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-full transition-colors text-xs font-bold flex items-center gap-1.5 ml-auto cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Dispatch'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Reading Column */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-left">
        
        {/* Cover Image */}
        {item.coverImage ? (
          <div className="border border-[#E2E8F0] p-2 bg-[#F8FAFD] rounded-3xl overflow-hidden shadow-xs mb-10">
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
              {item.title} — Official Dispatch
            </div>
          </div>
        ) : null}

        {/* Lead Summary */}
        {item.summary && (
          <p className="editorial-dropcap text-lg sm:text-xl text-[#0B2A4A] leading-relaxed font-sans mb-8">
            {item.summary}
          </p>
        )}

        {/* Body Paragraphs / Formatted Content */}
        {renderFormattedContent(item.content)}

        {/* Topic tags */}
        {item.relatedTopics && item.relatedTopics.length > 0 && (
          <div className="mt-12 pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
            <span className="font-bold text-[#0B2A4A]">Related Themes:</span>
            {item.relatedTopics.map((topic) => (
              <span key={topic} className="px-2.5 py-1 bg-[#F8FAFD] border border-[#E2E8F0] rounded-full text-[#0C57A5] font-medium">
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Related Stories */}
        {related.length > 0 && (
          <div className="mt-14 pt-10 border-t border-[#E2E8F0]">
            <h3 className="text-xl font-bold font-serif text-[#0B2A4A] mb-6">
              More Recent Dispatches
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <div key={rel.id} className="p-5 bg-[#F8FAFD] rounded-2xl border border-[#E2E8F0] space-y-2 shadow-xs hover:border-[#0C57A5]/40 transition-all">
                  <div className="text-[11px] font-mono text-[#0C57A5] font-bold">{rel.category} · {rel.date}</div>
                  <h4 className="text-sm font-bold text-[#0B2A4A] hover:text-[#0C57A5] transition-colors leading-snug">
                    <Link href={`/news/${rel.slug}`}>
                      {rel.title}
                    </Link>
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
}
