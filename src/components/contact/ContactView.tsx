'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, ShieldCheck, MessageSquare } from 'lucide-react';
import { ORGANIZATION } from '@/data/organization';

interface ContactViewProps {
  initialIntent?: string;
  settings?: any;
}

export function ContactView({ initialIntent, settings }: ContactViewProps) {
  const currentAddress = settings?.contactAddress || 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh';
  const currentEmail = settings?.contactEmail || 'info@ipa.org.bd';
  const currentPhone = settings?.contactPhone || '+880 (2) 987-6543';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(
    initialIntent === 'participate'
      ? 'Public Participation & Community Dialogue'
      : initialIntent === 'program'
      ? 'Institutional Program Partnership'
      : 'General Research Inquiry'
  );
  const [organizationName, setOrganizationName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!name.trim()) {
      setStatus('error');
      setErrorText('Please enter your full name.');
      return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setErrorText('Please provide a valid email address.');
      return;
    }

    if (!message.trim() || message.length < 15) {
      setStatus('error');
      setErrorText('Please provide an inquiry message of at least 15 characters.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          organization: organizationName,
          subject,
          message,
        }),
      });

      if (!res.ok) throw new Error('Submission failed');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorText('Failed to transmit message. Please try again or email us directly.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setName('');
    setEmail('');
    setOrganizationName('');
    setMessage('');
  };

  return (
    <div className="bg-white">
      {/* Header in Brand Navy */}
      <section className="bg-[#0B2A4A] text-white py-14 sm:py-18 border-b border-[#0C57A5]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-[11px] uppercase tracking-widest font-mono text-[#F6B834] font-bold mb-2">
            INSTITUTIONAL COMMUNICATIONS DESK
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight max-w-3xl mb-4 text-balance">
            Contact the Institute
          </h1>
          <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl font-normal leading-relaxed">
            Reach our research directorate, media relations officer, or community dialogue team for academic inquiries, speaking requests, or civic partnerships.
          </p>
        </div>
      </section>

      {/* Main Grid: Form (7 Cols) + Coordinates & Map (5 Cols) */}
      <section className="py-14 sm:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
            
            {/* Left: Interactive Form (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="text-[11px] uppercase tracking-widest font-mono text-[#0C57A5] font-bold mb-1">
                  SEND A MESSAGE
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0B2A4A]">
                  Inquiry & Collaboration Form
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                  All correspondence is reviewed by the designated directorate and addressed within two business days.
                </p>
              </div>

              {status === 'success' ? (
                <div className="p-8 bg-[#F8FAFD] rounded-3xl border border-[#E2E8F0] space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-serif text-[#0B2A4A]">Inquiry Dispatched Successfully</h3>
                    <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-md mx-auto">
                      Thank you, <strong className="text-[#1E293B]">{name}</strong>. Your message regarding &ldquo;{subject}&rdquo; has been routed to our secretariat. Confirmation sent to <span className="font-mono">{email}</span>.
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-[#0C57A5] text-white text-xs uppercase tracking-wider font-bold rounded-full hover:bg-[#094787] transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 bg-[#F8FAFD] p-6 sm:p-8 rounded-3xl border border-[#E2E8F0]">
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                      Subject / Inquiry Category *
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E2E8F0] rounded-xl focus:border-[#0C57A5] focus:outline-hidden text-[#1E293B]"
                    >
                      <option value="General Research Inquiry">General Research Inquiry</option>
                      <option value="Media & Press Interview Request">Media & Press Interview Request</option>
                      <option value="Institutional Program Partnership">Institutional Program Partnership</option>
                      <option value="Public Participation & Community Dialogue">Public Participation & Community Dialogue</option>
                      <option value="Academic Citation / Data Access Request">Academic Citation / Data Access Request</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. / Mr. / Ms. Full Name"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E2E8F0] rounded-xl focus:border-[#0C57A5] focus:outline-hidden text-[#1E293B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@organization.org"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E2E8F0] rounded-xl focus:border-[#0C57A5] focus:outline-hidden text-[#1E293B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                      Organization / Affiliation (Optional)
                    </label>
                    <input
                      type="text"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="e.g. Department of Sociology / Press Club"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E2E8F0] rounded-xl focus:border-[#0C57A5] focus:outline-hidden text-[#1E293B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                      Message / Inquiries *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please articulate the specific background of your inquiry..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E2E8F0] rounded-xl focus:border-[#0C57A5] focus:outline-hidden text-[#1E293B] resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
                      {errorText}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0C57A5]" />
                      <span>Data protected under strict institutional standards.</span>
                    </span>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="px-7 py-3 bg-[#0C57A5] hover:bg-[#094787] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{status === 'loading' ? 'Dispatching...' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right: Coordinates & Institutional Location (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Coordinates Box */}
              <div className="p-7 bg-[#F8FAFD] rounded-3xl border border-[#E2E8F0] space-y-4 shadow-xs">
                <h3 className="font-mono uppercase tracking-wider text-[#0C57A5] font-bold text-xs pb-2 border-b border-[#E2E8F0]">
                  Institutional Desks & Contacts
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#0C57A5] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1E293B] block">Central Secretariat</strong>
                      <span className="text-[#64748B]">{currentAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#0C57A5] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1E293B] block">General & Academic Inquiries</strong>
                      <a href={`mailto:${currentEmail}`} className="text-[#64748B] hover:text-[#0C57A5] transition-colors">{currentEmail}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-[#0C57A5] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1E293B] block">Media & Press Desk</strong>
                      <span className="text-[#64748B]">{currentEmail}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#0C57A5] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1E293B] block">Telephone Inquiries</strong>
                      <a href={`tel:${currentPhone.replace(/\s+/g, '')}`} className="text-[#64748B] hover:text-[#0C57A5] transition-colors">{currentPhone}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#0C57A5] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1E293B] block">Office Hours</strong>
                      <span className="text-[#64748B]">Sunday – Thursday: 09:30 – 17:30 (BST)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Styled Location Map Placeholder */}
              <div className="border border-[#E2E8F0] rounded-3xl overflow-hidden bg-white shadow-xs">
                <div className="p-3.5 bg-[#0B2A4A] text-white flex items-center justify-between text-xs">
                  <span className="font-mono uppercase tracking-wider font-bold">Institutional Map</span>
                  <span className="text-[11px] text-[#F6B834]">Dhaka Secretariat Area</span>
                </div>

                <div className="p-6 text-center space-y-3 bg-[#F8FAFD] border-b border-[#E2E8F0]">
                  <div className="w-12 h-12 rounded-full bg-[#0C57A5] text-white flex items-center justify-center mx-auto shadow-sm">
                    <MapPin className="w-5 h-5 text-[#F6B834]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1E293B]">Institute of Public Affairs Secretariat</h4>
                    <p className="text-xs text-[#64748B] mt-0.5">Adjacent to National Press Club & High Court Annex</p>
                  </div>
                  <div className="text-[11px] font-mono text-[#0C57A5] font-semibold">
                    GPS Coordinates: 23.7314° N, 90.4072° E
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
