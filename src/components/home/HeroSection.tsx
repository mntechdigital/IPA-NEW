'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Play, Sparkles, X } from 'lucide-react';
import { GetInvolvedModal } from '@/components/ui/GetInvolvedModal';

interface HeroSectionProps {
  settings?: any;
}

function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = trimmed.match(regExp);
  return match && match[1] ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0` : null;
}

export function HeroSection({ settings }: HeroSectionProps) {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [involvedOpen, setInvolvedOpen] = useState(false);

  const displayTagline = settings?.tagline || 'Building an Informed Society Through Research, Dialogue & Action.';
  const displayLead = settings?.editorialLead || 'IPA — Institute of Public Affairs empowers citizens, newsrooms, and grassroots communities with empirical media research, democratic accountability tools, and civic dialogue forums.';
  const displayHeroImage = settings?.heroImage || '/images/hero_public_dialogue.jpg';

  const youtubeEmbedUrl = getYouTubeEmbedUrl(settings?.heroVideoUrl);
  const isVideoActive = Boolean(settings?.heroVideoActive);
  const showVideoOption = isVideoActive && Boolean(youtubeEmbedUrl);

  return (
    <>
      <section className="relative bg-white pt-4 pb-12 sm:pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Hero Container with Split Brand Deep Blue (#0B3463) and Warm Yellow Blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl sm:rounded-4xl shadow-sm border border-[#E2E8F0]">
            
            {/* Left Column: Signature IPA Brand Blue/Navy (6 Cols) */}
            <div className="lg:col-span-6 xl:col-span-6 bg-[#0B3463] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center text-left relative">
              
              {/* Subtle decorative sparkle */}
              <div className="absolute top-8 right-8 text-[#F6B834] opacity-80">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>

              {/* Sub-kicker */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#F6B834] font-bold">
                  INSTITUTE OF PUBLIC AFFAIRS · RESEARCH & DIALOGUE
                </span>
                <span className="text-[#F6B834]">✦</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight leading-[1.12] mb-6 text-balance text-white">
                {displayTagline}
              </h1>

              <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed mb-8 max-w-xl font-normal">
                {displayLead}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Coral-Orange Pill Button */}
                <Link
                  href="/research"
                  className="px-7 py-3.5 bg-[#E85338] hover:bg-[#D44228] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Our Work</span>
                </Link>

                {/* Video Option: Only rendered if video is active AND a valid video URL is configured */}
                {showVideoOption && (
                  <button
                    onClick={() => setVideoModalOpen(true)}
                    className="inline-flex items-center gap-3 px-4 py-3 text-white hover:text-[#F6B834] text-xs sm:text-sm font-semibold transition-colors group cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center group-hover:border-[#F6B834] group-hover:scale-105 transition-all bg-white/10">
                      <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5 group-hover:text-[#F6B834] group-hover:fill-[#F6B834]" />
                    </span>
                    <span className="uppercase tracking-wider text-xs font-bold">Watch Video Presentation</span>
                  </button>
                )}
              </div>

            </div>

            {/* Right Column: Warm Golden-Yellow Block with Portrait Composition (6 Cols) */}
            <div className="lg:col-span-6 xl:col-span-6 bg-[#F6B834] p-6 sm:p-8 lg:p-12 relative flex items-center justify-center">
              
              {/* Photo composition container with rounded border */}
              <div className="relative w-full aspect-4/3 sm:aspect-16/11 overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg border-4 border-white/40 bg-white">
                <Image
                  src={displayHeroImage}
                  alt="Public symposium and community dialogue convened by the Institute of Public Affairs"
                  fill
                  priority
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                {/* Caption badge */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                  <span className="font-mono text-[10px] uppercase tracking-wider bg-[#0C57A5] px-2.5 py-1 rounded-full text-white inline-block mb-1 shadow-sm">
                    National Forum 2026
                  </span>
                  <p className="font-semibold text-sm drop-shadow-sm">
                    Informed Dialogue Inspiring Meaningful Social Development
                  </p>
                </div>
              </div>

              {/* Decorative 16-point Starburst Icon in Bottom Right */}
              <div className="absolute -bottom-2 -right-2 sm:bottom-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 text-[#0C57A5] pointer-events-none animate-spin-slow">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full opacity-90 drop-shadow-sm">
                  <path d="M50 0 L55 35 L85 15 L65 45 L100 50 L65 55 L85 85 L55 65 L50 100 L45 65 L15 85 L35 55 L0 50 L35 45 L15 15 L45 35 Z" />
                </svg>
              </div>

            </div>

          </div>

          {/* Under-Hero 3 Horizontal Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 sm:mt-8">
            
            {/* Card 1: WHO WE ARE · Media Research Directorate */}
            <Link 
              href="/research"
              className="relative h-44 sm:h-48 rounded-2xl overflow-hidden group shadow-xs border border-[#E2E8F0] block text-left"
            >
              <Image
                src="/images/research_media_analysis.jpg"
                alt="Research and media analysis"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />
              
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#F6B834] font-semibold block mb-0.5">
                      WHO WE ARE
                    </span>
                    <h3 className="text-base sm:text-lg font-bold leading-tight group-hover:text-[#F6B834] transition-colors">
                      Media Research & Trust
                    </h3>
                  </div>

                  <span className="w-9 h-9 rounded-full bg-white text-[#0C57A5] flex items-center justify-center shrink-0 group-hover:bg-[#0C57A5] group-hover:text-white transition-all shadow-md">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 2: VOLUNTEER · Take Action & Dialogue */}
            <Link 
              href="/programs/community-dialogue-initiative"
              className="relative h-44 sm:h-48 rounded-2xl overflow-hidden group shadow-xs border border-[#E2E8F0] block text-left"
            >
              <Image
                src="/images/community_dialogue_civic.jpg"
                alt="Community dialogue and civic participation"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />
              
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#F6B834] font-semibold block mb-0.5">
                      VOLUNTEER & PARTICIPATE
                    </span>
                    <h3 className="text-base sm:text-lg font-bold leading-tight group-hover:text-[#F6B834] transition-colors">
                      Community Townhalls
                    </h3>
                  </div>

                  <span className="w-9 h-9 rounded-full bg-white text-[#0C57A5] flex items-center justify-center shrink-0 group-hover:bg-[#0C57A5] group-hover:text-white transition-all shadow-md">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Card 3: STORIES · Building A Future */}
            <Link 
              href="/programs/youth-public-affairs-engagement"
              className="relative h-44 sm:h-48 rounded-2xl overflow-hidden group shadow-xs border border-[#E2E8F0] block text-left"
            >
              <Image
                src="/images/campaign_media_literacy.jpg"
                alt="Youth and media literacy program"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />
              
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#F6B834] font-semibold block mb-0.5">
                      STORIES & INITIATIVES
                    </span>
                    <h3 className="text-base sm:text-lg font-bold leading-tight group-hover:text-[#F6B834] transition-colors">
                      Building Future Leadership
                    </h3>
                  </div>

                  <span className="w-9 h-9 rounded-full bg-white text-[#0C57A5] flex items-center justify-center shrink-0 group-hover:bg-[#0C57A5] group-hover:text-white transition-all shadow-md">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* Video Presentation Modal */}
      {videoModalOpen && showVideoOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-4xl bg-[#0B2A4A] text-white rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 relative border border-white/20">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-white hover:text-[#F6B834] rounded-full transition-colors cursor-pointer"
              aria-label="Close video player"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-left mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#F6B834] font-semibold">
                IPA Video Presentation
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                Strengthening Media Trust and Public Governance
              </h3>
            </div>
            
            <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
              <iframe
                src={youtubeEmbedUrl!}
                title="IPA Video Presentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      <GetInvolvedModal isOpen={involvedOpen} onClose={() => setInvolvedOpen(false)} />
    </>
  );
}
