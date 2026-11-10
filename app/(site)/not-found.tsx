import Link from 'next/link';
import { FileQuestion, ArrowRight, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#F8FAFD] py-20 sm:py-28 text-center px-4">
      <div className="max-w-md mx-auto bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-10 shadow-xs">
        <div className="w-14 h-14 bg-[#EAF2FA] text-[#0C57A5] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#0C57A5]/20">
          <FileQuestion className="w-7 h-7" />
        </div>

        <span className="font-mono text-xs text-[#0C57A5] font-bold uppercase tracking-wider block mb-1">
          Error 404 · Archival Notice
        </span>

        <h1 className="text-2xl font-bold font-serif text-[#0B2A4A] mb-3">
          Document or Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
          The requested document, research paper, or institutional URL could not be located in the current Institute of Public Affairs repository index.
        </p>

        <div className="space-y-2.5">
          <Link
            href="/"
            className="w-full py-3 px-5 bg-[#0C57A5] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#094787] transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Institutional Homepage</span>
          </Link>

          <Link
            href="/research"
            className="w-full py-2.5 px-5 bg-white border border-[#E2E8F0] text-[#0B2A4A] hover:bg-slate-50 text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <span>Browse Research Archive</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0C57A5]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
