import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Award, Globe, Shield, Sparkles } from 'lucide-react';
import { ORGANIZATION } from '@/data/organization';

interface OrgIntroSectionProps {
  settings?: any;
}

export function OrgIntroSection({ settings }: OrgIntroSectionProps) {
  return (
    <>
      {/* 1. Partner / Institutional Coalition Logo Strip */}
      <section className="py-10 sm:py-12 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#64748B] font-bold block mb-6">
            INSTITUTIONAL ALLIANCES & RESEARCH CONSORTIUMS
          </span>

          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 sm:gap-8 opacity-80 grayscale hover:grayscale-0 transition-all">
            {[
              { name: "UNITY ALLIANCE", symbol: "✦ UNITY" },
              { name: "ART. ACADEMY", symbol: "ART. academy" },
              { name: "WORLD CITIZEN", symbol: "WORLD media" },
              { name: "SWEET HOME", symbol: "SWEETHOME" },
              { name: "GLOBAL INQUIRY", symbol: "GLOBAL civic" },
              { name: "FINDR NETWORK", symbol: "■ Findr" }
            ].map((p) => (
              <div 
                key={p.name}
                className="text-xs sm:text-sm font-bold tracking-wider font-mono text-[#1E293B] px-3 py-1.5 border border-transparent hover:border-[#E2E8F0] rounded-md transition-all hover:text-[#0C57A5]"
              >
                {p.symbol}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. "Helping Others Improves World" Feature Split with Logo Brand Colors */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Visual Composition (2 Photos + Floating Quote Box) - 6 Cols */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 items-start text-left">
              
              {/* Left Sub-column: Top Photo + Floating Testimonial Quote */}
              <div className="space-y-4">
                <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden shadow-xs border border-[#E2E8F0] bg-slate-100">
                  <Image
                    src="/images/community_dialogue_civic.jpg"
                    alt="Community engagement and social support"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Floating Testimonial Quote Card */}
                <div className="p-4 sm:p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm text-left">
                  <p className="text-xs text-[#64748B] font-serif italic leading-relaxed mb-3">
                    &ldquo;This platform is awesome and huge! The empirical research was super clear and very pleasant. If you want meaningful change to deliver real impact to your community.&rdquo;
                  </p>
                  <div>
                    <h5 className="text-xs font-bold text-[#0C57A5]">Huyre Merry</h5>
                    <span className="text-[10px] text-[#64748B]">Independent Civic Researcher</span>
                  </div>
                </div>
              </div>

              {/* Right Sub-column: Tall Vertical Portrait with Rounded Corners */}
              <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden shadow-xs border border-[#E2E8F0] bg-slate-100 mt-2 sm:mt-6">
                <Image
                  src="/images/campaign_media_literacy.jpg"
                  alt="Young student and researcher in media literacy program"
                  fill
                  className="object-cover"
                />
              </div>

            </div>

            {/* Right Column: Editorial Narrative + Progress Bars - 6 Cols */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <div className="inline-block text-[11px] font-mono uppercase tracking-widest text-[#0C57A5] font-bold">
                KNOWLEDGE MANDATE · PUBLIC BENEFIT
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#0B2A4A] leading-tight">
                Helping Others Improves World Through Dialogue & Truth.
              </h2>

              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                {settings?.mission || "Ensures that communities, newsrooms, and youth have access to life-changing evidence, media verification tools, educational support, life skills, and open public dialogue before policy decisions are finalized."}
              </p>

              {/* Two Progress / Metric Bars in Logo Brand Blue */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-[#1E293B] mb-1.5">
                    <span>Media Literacy & Fact Verification Reach</span>
                    <span className="font-mono text-[#0C57A5] font-bold">59%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#EAF2FA] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0C57A5] rounded-full" 
                      style={{ width: '59%' }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-[#1E293B] mb-1.5">
                    <span>Democratic Governance & Public Policy Adoption</span>
                    <span className="font-mono text-[#0C57A5] font-bold">98%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#EAF2FA] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0C57A5] rounded-full" 
                      style={{ width: '98%' }} 
                    />
                  </div>
                </div>
              </div>

              {/* "ABOUT US" Rounded Pill Button */}
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full border-2 border-[#0C57A5] text-[#0C57A5] hover:bg-[#0C57A5] hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
                >
                  <span>About Us</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}
