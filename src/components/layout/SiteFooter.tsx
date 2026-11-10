"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FOOTER_LINKS } from "@/data/navigation";
import { ORGANIZATION } from "@/data/organization";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Heart,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

interface SiteFooterProps {
  settings?: any;
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const currentAddress =
    settings?.contactAddress ||
    "House 42, Road 11, Banani, Dhaka-1213, Bangladesh";
  const currentEmail = settings?.contactEmail || "info@ipa.org.bd";
  const currentPhone = settings?.contactPhone || "+880 (2) 987-6543";
  const currentMission =
    settings?.mission ||
    "The Institute of Public Affairs is an autonomous non-profit research institution dedicated to media integrity, evidence-based policy dialogue, and informed democratic participation.";

  const socialLinks = [
    { name: "LinkedIn", href: settings?.linkedinUrl || "https://linkedin.com" },
    { name: "X", href: settings?.twitterUrl || "https://x.com" },
    { name: "Facebook", href: settings?.facebookUrl || "https://facebook.com" },
    { name: "YouTube", href: settings?.youtubeUrl || "https://youtube.com" },
  ];
  return (
    <footer className="bg-[#0A233F] text-slate-300 border-t border-[#0C57A5]/30 text-sm relative overflow-hidden">
      {/* Subtle ambient gradient highlights in brand blue */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0C57A5]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F6B834]/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Top Quick-Contact Strip */}
      <div className="border-b border-white/10 bg-[#071C33]/90 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {/* Quick Contact 1: Location */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-[#F6B834]/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-[#0C57A5]/30 text-[#F6B834] flex items-center justify-center shrink-0 border border-[#0C57A5]/40 group-hover:bg-[#0C57A5] group-hover:text-white transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-200/70 block">
                  Central Secretariat
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white truncate block">
                  {currentAddress}
                </span>
              </div>
            </div>

            {/* Quick Contact 2: Email */}
            <a
              href={`mailto:${currentEmail}`}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-[#F6B834]/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0C57A5]/30 text-[#F6B834] flex items-center justify-center shrink-0 border border-[#0C57A5]/40 group-hover:bg-[#0C57A5] group-hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-200/70 block">
                  Email Inquiries
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white truncate block group-hover:text-[#F6B834] transition-colors">
                  {currentEmail}
                </span>
              </div>
            </a>

            {/* Quick Contact 3: Phone */}
            <a
              href={`tel:${currentPhone.replace(/\s+/g, "")}`}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-[#F6B834]/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0C57A5]/30 text-[#F6B834] flex items-center justify-center shrink-0 border border-[#0C57A5]/40 group-hover:bg-[#0C57A5] group-hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-200/70 block">
                  Telephone Desk
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white truncate block group-hover:text-[#F6B834] transition-colors">
                  {currentPhone}
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main 5-Column Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16 text-left relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1 & 2: Brand Identity & Mission (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block group">
              <div className="bg-white p-3.5 rounded-2xl border border-white/20 w-56 sm:w-64 shadow-md group-hover:shadow-lg transition-shadow">
                <div className="relative h-11 w-full">
                  <Image
                    src="/assets/aistudio/ipa_logo_57767e2a.svg"
                    alt="Institute of Public Affairs"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-sm">
              {currentMission}
            </p>

            {/* Badges strip */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-white border border-white/10 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[#F6B834]" />
                <span>Open Access 100%</span>
              </span>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-white border border-white/10 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-[#F6B834]" />
                <span>Non-Partisan</span>
              </span>
            </div>

            {/* Social media buttons */}
            <div className="pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-200/70 block mb-2.5">
                Official Channels
              </span>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0C57A5]/40 hover:bg-[#0C57A5] rounded-full transition-all border border-[#0C57A5]/60 flex items-center gap-1"
                  >
                    <span>{s.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-70" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Research & Publications (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F6B834] font-bold flex items-center gap-2 pb-2 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#0C57A5]" />
              <span>Research Directorate</span>
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              {FOOTER_LINKS.research.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all group"
                  >
                    <span className="text-blue-400 group-hover:text-[#F6B834]">
                      ›
                    </span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Programs & Action (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F6B834] font-bold flex items-center gap-2 pb-2 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#F6B834]" />
              <span>Programs & Initiatives</span>
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              {FOOTER_LINKS.programs.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all group"
                  >
                    <span className="text-blue-400 group-hover:text-[#F6B834]">
                      ›
                    </span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: About & Knowledge (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F6B834] font-bold flex items-center gap-2 pb-2 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#0C57A5]" />
              <span>Quick Access</span>
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              {FOOTER_LINKS.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all group"
                  >
                    <span className="text-blue-400 group-hover:text-[#F6B834]">
                      ›
                    </span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. Prototype Notice Banner */}
        <div className="mt-12 p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#F6B834] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">
                Institutional Demonstration Notice:
              </strong>{" "}
              {ORGANIZATION.disclaimer}
            </p>
          </div>
          <Link
            href="/contact"
            className="px-4 py-2 bg-[#0C57A5] hover:bg-[#094787] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shrink-0 transition-colors shadow-xs"
          >
            Inquire With Secretariat
          </Link>
        </div>
      </div>

      {/* 4. Bottom Modern Copyright Bar */}
      <div className="border-t border-white/10 bg-[#06182B] py-6 text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>
              © {new Date().getFullYear()} Institute of Public Affairs (IPA).
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/about" className="hover:text-white transition-colors">
              About Us
            </Link>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <Link
              href="/research"
              className="hover:text-white transition-colors"
            >
              Publications
            </Link>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <Link
              href="/resources"
              className="hover:text-white transition-colors"
            >
              Knowledge Hub
            </Link>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <Link
              href="/contact"
              className="hover:text-white transition-colors"
            >
              Contact Desk
            </Link>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <Link
              href="/dashboard"
              className="text-[#F6B834] hover:underline font-semibold transition-colors"
            >
              Admin Portal 🔒
            </Link>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <span className="text-slate-500">Privacy & Ethics</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
