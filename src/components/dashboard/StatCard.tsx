import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  badge?: string;
  color?: 'blue' | 'yellow' | 'orange' | 'navy';
}

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  badge,
  color = 'blue',
}: StatCardProps) {
  const colorStyles = {
    blue: {
      bg: 'bg-white',
      iconBg: 'bg-[#EAF2FA] text-[#0C57A5]',
      border: 'border-[#E2E8F0]',
    },
    yellow: {
      bg: 'bg-white',
      iconBg: 'bg-[#FDE8B5] text-[#0B2A4A]',
      border: 'border-[#E2E8F0]',
    },
    orange: {
      bg: 'bg-white',
      iconBg: 'bg-[#E85338]/10 text-[#E85338]',
      border: 'border-[#E2E8F0]',
    },
    navy: {
      bg: 'bg-white',
      iconBg: 'bg-[#0B2A4A]/10 text-[#0B2A4A]',
      border: 'border-[#E2E8F0]',
    },
  }[color];

  return (
    <div className={`p-5 rounded-2xl ${colorStyles.bg} border ${colorStyles.border} shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
            {label}
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-[#0B2A4A] mt-1.5">
            {value}
          </div>
          {description && (
            <p className="text-xs text-[#64748B] mt-1 line-clamp-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorStyles.iconBg} group-hover:scale-105 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {badge && (
        <div className="mt-3 inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
          {badge}
        </div>
      )}
    </div>
  );
}
