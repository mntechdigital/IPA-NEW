'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ORGANIZATION } from '@/data/organization';
import { TEAM_MEMBERS } from '@/data/team';
import { DEFAULT_ABOUT_SETTINGS, AboutSettingData } from '@/lib/services/content';
import { ShieldCheck, Target, Eye, BookOpen, Users, Award, CheckCircle, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  settings?: any;
  teamMembers?: any[];
  values?: any[];
  aboutSettings?: AboutSettingData;
}

export function AboutView({ settings, teamMembers, values, aboutSettings }: AboutViewProps) {
  const currentSettings = settings || ORGANIZATION;
  const currentTeam = teamMembers && teamMembers.length > 0 ? teamMembers : TEAM_MEMBERS;
  const currentValues = values && values.length > 0 ? values : ORGANIZATION.values;
  const about = aboutSettings || DEFAULT_ABOUT_SETTINGS;

  return (
    <div className="bg-white">
      {/* Page Header / Hero in Brand Navy */}
      <section className="bg-[#0B2A4A] text-white py-14 sm:py-18 border-b border-[#0C57A5]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-[11px] uppercase tracking-widest font-mono text-[#F6B834] font-bold mb-2">
            {about.heroEyebrow || 'INSTITUTIONAL PROFILE & GOVERNANCE'}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight max-w-3xl mb-4 text-balance">
            {about.heroTitle || 'About the Institute of Public Affairs'}
          </h1>
          <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl font-normal leading-relaxed">
            {about.heroDescription ||
              'Strengthening public understanding, media integrity, and democratic participation through empirical research and inclusive civic dialogue.'}
          </p>
        </div>
      </section>

      {/* Main Narrative & Origins */}
      <section className="py-14 sm:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="text-[11px] uppercase tracking-widest font-mono text-[#0C57A5] font-bold">
                {about.mandateEyebrow || 'FOUNDATIONAL MANDATE'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2A4A] font-serif">
                {about.mandateTitle || 'An Independent Hub for Evidence and Public Deliberation'}
              </h2>

              <p className="editorial-dropcap text-base sm:text-lg text-[#1E293B] leading-relaxed">
                {about.mandateParagraph1}
              </p>

              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                {about.mandateParagraph2}
              </p>

              <div className="p-5 bg-[#F8FAFD] rounded-2xl border border-[#E2E8F0] space-y-2 text-xs text-[#1E293B]">
                <strong className="text-[#0C57A5] block font-bold text-sm">
                  {about.mandatePrinciplesTitle || 'Our Research Principles:'}
                </strong>
                <p className="text-[#64748B] leading-relaxed">
                  {about.mandatePrinciples}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-[#E2E8F0] p-3 bg-[#F8FAFD] rounded-3xl shadow-sm">
                <div className="relative aspect-4/3 w-full bg-slate-100 rounded-2xl overflow-hidden">
                  <Image
                    src={about.mandateImage || '/images/research_media_analysis.jpg'}
                    alt={about.mandateImageLabel || 'IPA Research Archive & Library'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 text-left">
                  <div className="text-xs font-bold text-[#0C57A5]">
                    {about.mandateImageLabel || 'IPA Research Archive & Library'}
                  </div>
                  <div className="text-[11px] font-serif italic text-[#64748B] mt-0.5">
                    {about.mandateImageCaption ||
                      'Scholars analyzing media monitoring datasets and municipal audit filings.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission & Values */}
      <section id="mission" className="py-14 sm:py-20 bg-[#F8FAFD] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
            {/* Vision */}
            <div className="p-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs">
              <div className="w-12 h-12 bg-[#EAF2FA] text-[#0C57A5] rounded-2xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#0B2A4A] mb-3">Our Vision</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                {currentSettings.vision}
              </p>
            </div>

            {/* Mission */}
            <div className="p-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs">
              <div className="w-12 h-12 bg-[#EAF2FA] text-[#0C57A5] rounded-2xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#0B2A4A] mb-3">Our Mission</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                {currentSettings.mission}
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div>
            <div className="text-[11px] uppercase tracking-widest font-mono text-[#0C57A5] font-bold mb-1">
              FOUNDATIONAL ETHICS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0B2A4A] mb-8">
              Core Institutional Values
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentValues.map((val: any) => (
                <div key={val.title} className="p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs">
                  <h4 className="text-base font-bold text-[#0C57A5] mb-2">{val.title}</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Research Team */}
      <section id="team" className="py-14 sm:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="max-w-3xl mb-12">
            <div className="text-[11px] uppercase tracking-widest font-mono text-[#0C57A5] font-bold mb-1">
              SCHOLARLY LEADERSHIP
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#0B2A4A]">
              Directors & Senior Research Fellows
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Scholars guiding IPA&apos;s empirical directorates and public deliberation programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentTeam.map((member: any) => (
              <div 
                key={member.id}
                className="p-7 bg-[#F8FAFD] rounded-2xl border border-[#E2E8F0] flex flex-col justify-between shadow-xs hover:border-[#0C57A5]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#64748B] mb-2">
                    <span className="font-bold text-[#0C57A5]">{member.division}</span>
                    <span className="font-mono">{member.publicationsCount} Publications</span>
                  </div>

                  <h3 className="text-xl font-bold font-serif text-[#1E293B] mb-1">
                    {member.name}
                  </h3>
                  <div className="text-xs font-semibold text-[#0C57A5] mb-3">
                    {member.role}
                  </div>

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-4">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] text-xs">
                  <span className="font-bold text-[#1E293B] block mb-1">Research Specializations:</span>
                  <div className="flex flex-wrap gap-2 text-[#64748B]">
                    {Array.isArray(member.focusAreas) &&
                      member.focusAreas.map((f: string, i: number) => (
                        <span key={f}>
                          {f}{i < member.focusAreas.length - 1 ? ' ·' : ''}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Timeline / Milestones */}
      <section id="history" className="py-14 sm:py-20 bg-[#F8FAFD] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="max-w-3xl mb-12">
            <div className="text-[11px] uppercase tracking-widest font-mono text-[#0C57A5] font-bold mb-1">
              INSTITUTIONAL EVOLUTION
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0B2A4A]">
              Key Developmental Milestones
            </h2>
          </div>

          <div className="space-y-6 max-w-4xl border-l-2 border-[#0C57A5] pl-6 sm:pl-8 ml-2 sm:ml-4">
            {(about.milestones || []).map((milestone, idx) => (
              <div key={milestone.year + idx} className="relative">
                <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#0C57A5]" />
                <span className="font-mono text-xs font-bold text-[#0C57A5] block">{milestone.year}</span>
                <h4 className="text-base font-bold text-[#0B2A4A] mt-0.5 mb-1">{milestone.title}</h4>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{milestone.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborators & Fellowship Network */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="max-w-3xl mb-10">
            <div className="text-[11px] uppercase tracking-widest font-mono text-[#0C57A5] font-bold mb-1">
              COLLABORATIVE NETWORK
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0B2A4A]">
              Academic & Civil Society Collaborators
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {(about.collaborators || []).map((collab, idx) => (
              <div
                key={collab + idx}
                className="p-4 bg-[#F8FAFD] rounded-2xl border border-[#E2E8F0] flex items-center justify-center hover:border-[#0C57A5]/40 transition-colors"
              >
                <span className="text-xs font-bold text-[#0C57A5]">{collab}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
