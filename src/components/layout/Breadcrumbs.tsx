import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 border-b border-[#E2E8F0] bg-[#F8FAFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-1.5 text-xs text-[#64748B] overflow-x-auto whitespace-nowrap">
          <li className="flex items-center gap-1.5">
            <Link 
              href="/" 
              className="hover:text-[#0C57A5] transition-colors flex items-center gap-1 font-medium"
              aria-label="Home"
            >
              <Home className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </li>

          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={idx} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                {item.href && !isLast ? (
                  <Link 
                    href={item.href} 
                    className="hover:text-[#0C57A5] transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#0B2A4A] font-bold truncate max-w-[200px] sm:max-w-md" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
