'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle, Mail, ShieldCheck } from 'lucide-react';
import { GetInvolvedModal } from '@/components/ui/GetInvolvedModal';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [involvedOpen, setInvolvedOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/forms/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('idle');
    }
  };

  return (
    <>
      <section className="py-14 sm:py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Bottom Banner in Signature Brand Blue/Navy (#0B2E56) */}
          <div className="bg-[#0B2E56] rounded-3xl sm:rounded-4xl p-8 sm:p-12 lg:p-16 text-white text-left relative overflow-hidden shadow-xl border border-[#0C57A5]/30">
            
            {/* Background sparkle decoration */}
            <div className="absolute top-8 right-8 text-[#F6B834] opacity-80 pointer-events-none">
              <Sparkles className="w-10 h-10 animate-spin-slow" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#F6B834] font-bold">
                  <span>PARTICIPATE IN PUBLIC AFFAIRS</span>
                  <span>✦</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight text-white max-w-xl">
                  Ready To Build An Informed Community Together?
                </h2>

                <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-lg">
                  Join our nationwide coalition of investigative researchers, civic leaders, student fact-checkers, and policy advocates.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setInvolvedOpen(true)}
                    className="px-8 py-3.5 bg-[#E85338] hover:bg-[#D44228] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Get Involved Today</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    href="/contact"
                    className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full transition-all"
                  >
                    Contact Secretariat
                  </Link>
                </div>
              </div>

              {/* Newsletter subscription box inside banner */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-white/20">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#F6B834] font-bold mb-2">
                  <Mail className="w-4 h-4" />
                  <span>Receive Monthly Research Digests</span>
                </div>

                <p className="text-xs text-blue-100 leading-relaxed mb-4">
                  Stay updated with our latest empirical reports, municipal audits, and civic town hall dates.
                </p>

                {status === 'success' ? (
                  <div className="p-3 bg-blue-950/70 border border-blue-300 text-blue-100 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#F6B834] shrink-0" />
                    <span>Subscribed successfully with {email}!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter institutional or personal email..."
                      className="w-full px-4 py-3 bg-white text-[#1E293B] placeholder-slate-400 text-xs rounded-full focus:outline-hidden focus:ring-2 focus:ring-[#F6B834]"
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-2.5 px-4 bg-[#F6B834] hover:bg-[#eab02e] text-[#0B2E56] text-xs font-bold uppercase tracking-wider rounded-full transition-all text-center cursor-pointer"
                    >
                      {status === 'loading' ? 'Joining...' : 'Subscribe to Bulletins'}
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>

        </div>
      </section>

      <GetInvolvedModal isOpen={involvedOpen} onClose={() => setInvolvedOpen(false)} />
    </>
  );
}
