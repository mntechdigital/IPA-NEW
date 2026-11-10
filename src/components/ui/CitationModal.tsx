'use client';

import React, { useState } from 'react';
import { Quote, Copy, Check, X } from 'lucide-react';
import { ResearchItem } from '@/types';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ResearchItem;
}

export function CitationModal({ isOpen, onClose, item }: CitationModalProps) {
  const [style, setStyle] = useState<'APA' | 'Chicago' | 'Harvard' | 'BibTeX'>('APA');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const authorsFormatted = item.authors.map(a => a.name).join(', ');
  const firstAuthorLast = item.authors[0]?.name.split(' ').slice(-1)[0] || 'IPA';

  const citations: Record<string, string> = {
    APA: `${item.authors.map(a => `${a.name.split(' ').slice(-1)[0]}, ${a.name.charAt(0)}.`).join(' & ')} (${item.year}). ${item.title}. Institute of Public Affairs. https://doi.org/${item.doi || '10.5281/ipa.res'}`,
    Chicago: `${authorsFormatted}. "${item.title}." ${item.type}, Institute of Public Affairs, ${item.year}. https://doi.org/${item.doi || '10.5281/ipa.res'}.`,
    Harvard: `${authorsFormatted}, ${item.year}. ${item.title}. [Online] Dhaka: Institute of Public Affairs. Available at: <https://ipa.org/research/${item.slug}> [Accessed ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}].`,
    BibTeX: `@techreport{ipa_${firstAuthorLast.toLowerCase()}_${item.year},
  author = {${item.authors.map(a => a.name).join(' and ')}},
  title = {${item.title}},
  institution = {Institute of Public Affairs (IPA)},
  year = {${item.year}},
  type = {${item.type}},
  doi = {${item.doi || '10.5281/ipa.res'}}
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(citations[style]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white border border-[#E5E9E2] shadow-2xl rounded-2xl p-6 relative text-left"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5E6E67] hover:text-[#172823] transition-colors p-1"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0C463C] mb-1 font-mono">
          <Quote className="w-4 h-4" />
          <span>Cite This Publication</span>
        </div>
        <h3 className="text-base font-bold text-[#0C463C] font-serif mb-4">
          Export Academic Citation
        </h3>

        {/* Style tabs */}
        <div className="flex border-b border-[#E5E9E2] mb-4 gap-4 text-xs font-semibold">
          {(['APA', 'Chicago', 'Harvard', 'BibTeX'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => { setStyle(fmt); setCopied(false); }}
              className={`pb-2 transition-colors relative ${
                style === fmt
                  ? 'text-[#0C463C] font-bold border-b-2 border-[#0C463C]'
                  : 'text-[#5E6E67] hover:text-[#172823]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Citation text */}
        <div className="p-4 bg-[#F8F9F6] border border-[#E5E9E2] rounded-xl font-mono text-xs text-[#172823] leading-relaxed break-words whitespace-pre-wrap select-all mb-4 max-h-48 overflow-y-auto">
          {citations[style]}
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#5E6E67]">
            Copy to clipboard for academic bibliography
          </span>
          <button
            onClick={handleCopy}
            className="py-2 px-5 bg-[#0C463C] text-white text-xs uppercase tracking-wider font-bold rounded-full hover:bg-[#08342C] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#F6B834]" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Citation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
