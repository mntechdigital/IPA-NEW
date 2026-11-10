import React from 'react';
import { ORGANIZATION } from '@/data/organization';
import { ShieldAlert, Award, BookOpen, Users, Compass } from 'lucide-react';

interface ImpactSectionProps {
  indicators?: any[];
}

export function ImpactSection({ indicators }: ImpactSectionProps) {
  const currentIndicators = indicators && indicators.length > 0 ? indicators : ORGANIZATION.impactIndicators;
  return (
    <section className="py-14 sm:py-20 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 text-left">
          <div className="text-[11px] uppercase tracking-widest font-mono text-[#0C57A5] font-bold mb-1">
            INSTITUTIONAL METRICS
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#0B2A4A]">
            Knowledge, Engagement & Public Impact
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Empirical data tracking research outputs, citizen deliberation, and democratic literacy nationwide.
          </p>
        </div>

        {/* 4 Quantitative Blocks in Logo Blue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left mb-8">
          {currentIndicators.map((stat, idx) => (
            <div 
              key={stat.label}
              className="p-6 bg-[#F8FAFD] rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-[#0C57A5]/40 transition-all"
            >
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-[#0C57A5] font-mono tabular-nums mb-2">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#0B2A4A] mb-2 font-mono">
                  {stat.label}
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {stat.descriptor}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E2E8F0] font-mono text-[10px] text-slate-400">
                INDICATOR 0{idx + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Transparency Disclaimer */}
        <div className="p-4 bg-[#F8FAFD] rounded-2xl border border-[#E2E8F0] text-xs text-[#64748B] flex items-start gap-3 text-left">
          <ShieldAlert className="w-4 h-4 text-[#0C57A5] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#1E293B]">Demonstration Disclosure:</strong> The metrics and activity counts listed above are realistic prototype representations designed for this frontend institutional release. They serve to demonstrate the data architecture and will be populated with audited empirical figures upon full institutional audit.
          </p>
        </div>

      </div>
    </section>
  );
}
