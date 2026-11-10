import React from 'react';

interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ badge, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-[#E2E8F0]">
      <div>
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF2FA] text-[#0C57A5] text-[10px] font-mono font-bold tracking-wider uppercase mb-1.5">
            <span>{badge}</span>
            <span>✦</span>
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#0B2A4A] tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
