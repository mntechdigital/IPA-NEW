'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ChevronDown, Menu, X, User, Heart } from 'lucide-react';
import { MAIN_NAVIGATION } from '@/data/navigation';
import { SearchModal } from '@/components/ui/SearchModal';
import { GetInvolvedModal } from '@/components/ui/GetInvolvedModal';

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [getInvolvedOpen, setGetInvolvedOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }

  return (
    <>
      <header 
        className={`sticky top-0 z-40 w-full bg-white transition-all duration-200 ${
          isScrolled 
            ? 'shadow-md border-b border-[#E2E8F0] py-2.5' 
            : 'border-b border-[#E2E8F0] py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            
            {/* Logo / Brand Zone */}
            <Link 
              href="/" 
              className="flex items-center gap-2 shrink-0 focus-visible:outline-hidden group"
              aria-label="IPA Institute of Public Affairs"
            >
              <div className="relative h-10 w-44 sm:h-12 sm:w-52">
                <Image
                  src="/assets/aistudio/ipa_logo_57767e2a.svg"
                  alt="IPA — Institute of Public Affairs"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link 
                href="/" 
                className={`text-xs xl:text-sm font-semibold transition-colors ${
                  pathname === '/' ? 'text-[#0C57A5] font-bold' : 'text-[#1E293B] hover:text-[#0C57A5]'
                }`}
              >
                Home
              </Link>

              <Link 
                href="/campaigns" 
                className={`text-xs xl:text-sm font-semibold transition-colors ${
                  pathname.startsWith('/campaigns') ? 'text-[#0C57A5] font-bold' : 'text-[#1E293B] hover:text-[#0C57A5]'
                }`}
              >
                Campaigns
              </Link>

              <Link 
                href="/about" 
                className={`text-xs xl:text-sm font-semibold transition-colors ${
                  pathname.startsWith('/about') ? 'text-[#0C57A5] font-bold' : 'text-[#1E293B] hover:text-[#0C57A5]'
                }`}
              >
                About Us
              </Link>

              {/* Research Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setOpenDropdown('research')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`text-xs xl:text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                    pathname.startsWith('/research') || openDropdown === 'research'
                      ? 'text-[#0C57A5] font-bold'
                      : 'text-[#1E293B] hover:text-[#0C57A5]'
                  }`}
                  aria-expanded={openDropdown === 'research'}
                >
                  <span>Research</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {openDropdown === 'research' && (
                  <div className="absolute top-full left-0 w-72 bg-white border border-[#E2E8F0] shadow-xl rounded-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1">
                    <Link href="/research" className="block p-2.5 rounded-xl hover:bg-[#F8FAFD] text-xs font-bold text-[#0C57A5]">
                      All Publications
                    </Link>
                    <Link href="/research?category=Media+Research" className="block p-2.5 rounded-xl hover:bg-[#F8FAFD] text-xs text-[#1E293B]">
                      Media Research & Trust
                    </Link>
                    <Link href="/research?category=Digital+Media" className="block p-2.5 rounded-xl hover:bg-[#F8FAFD] text-xs text-[#1E293B]">
                      Digital Media & Algorithms
                    </Link>
                    <Link href="/research?category=Governance" className="block p-2.5 rounded-xl hover:bg-[#F8FAFD] text-xs text-[#1E293B]">
                      Governance & Accountability
                    </Link>
                  </div>
                )}
              </div>

              {/* Programs Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setOpenDropdown('programs')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`text-xs xl:text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                    pathname.startsWith('/programs') || openDropdown === 'programs'
                      ? 'text-[#0C57A5] font-bold'
                      : 'text-[#1E293B] hover:text-[#0C57A5]'
                  }`}
                  aria-expanded={openDropdown === 'programs'}
                >
                  <span>Programs</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {openDropdown === 'programs' && (
                  <div className="absolute top-full left-0 w-80 bg-white border border-[#E2E8F0] shadow-xl rounded-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1">
                    <Link href="/programs" className="block p-2.5 rounded-xl hover:bg-[#F8FAFD] text-xs font-bold text-[#0C57A5]">
                      All Initiatives
                    </Link>
                    <Link href="/programs/media-literacy-public-awareness" className="block p-2.5 rounded-xl hover:bg-[#F8FAFD] text-xs text-[#1E293B]">
                      Media Literacy & Verification
                    </Link>
                    <Link href="/programs/community-dialogue-initiative" className="block p-2.5 rounded-xl hover:bg-[#F8FAFD] text-xs text-[#1E293B]">
                      Community Dialogue Townhalls
                    </Link>
                    <Link href="/programs/youth-public-affairs-engagement" className="block p-2.5 rounded-xl hover:bg-[#F8FAFD] text-xs text-[#1E293B]">
                      Youth Public Affairs Fellowship
                    </Link>
                  </div>
                )}
              </div>

              <Link 
                href="/news" 
                className={`text-xs xl:text-sm font-semibold transition-colors ${
                  pathname.startsWith('/news') ? 'text-[#0C57A5] font-bold' : 'text-[#1E293B] hover:text-[#0C57A5]'
                }`}
              >
                News & Media
              </Link>

              <Link 
                href="/contact" 
                className={`text-xs xl:text-sm font-semibold transition-colors ${
                  pathname.startsWith('/contact') ? 'text-[#0C57A5] font-bold' : 'text-[#1E293B] hover:text-[#0C57A5]'
                }`}
              >
                Contacts
              </Link>
            </nav>

            {/* Right Action Zone: Search + User + Solid Brand Blue Pill Button ("GET INVOLVED") */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="p-2 text-[#1E293B] hover:text-[#0C57A5] hover:bg-[#F8FAFD] rounded-full transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>

              <Link
                href="/dashboard"
                aria-label="Admin Portal"
                title="Admin CMS Portal"
                className="p-2 text-[#1E293B] hover:text-[#0C57A5] hover:bg-[#F8FAFD] rounded-full transition-colors hidden sm:inline-flex"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Exact Pill Button with Logo Blue (#0C57A5) */}
              <button
                onClick={() => setGetInvolvedOpen(true)}
                className="px-5 sm:px-6 py-2 sm:py-2.5 text-xs font-bold text-white bg-[#0C57A5] hover:bg-[#094787] rounded-full shadow-xs transition-all uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-[#F6B834] fill-[#F6B834]" />
                <span>Get Involved</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#1E293B] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 pt-4 pb-6 max-h-[85vh] overflow-y-auto space-y-3">
            <Link href="/" className="block py-2 text-sm font-semibold text-[#1E293B]">Home</Link>
            <Link href="/campaigns" className="block py-2 text-sm font-semibold text-[#1E293B]">Campaigns</Link>
            <Link href="/about" className="block py-2 text-sm font-semibold text-[#1E293B]">About Us</Link>
            <Link href="/research" className="block py-2 text-sm font-semibold text-[#1E293B]">Research & Publications</Link>
            <Link href="/programs" className="block py-2 text-sm font-semibold text-[#1E293B]">Programs & Initiatives</Link>
            <Link href="/news" className="block py-2 text-sm font-semibold text-[#1E293B]">News & Media</Link>
            <Link href="/resources" className="block py-2 text-sm font-semibold text-[#1E293B]">Resources Hub</Link>
            <Link href="/contact" className="block py-2 text-sm font-semibold text-[#1E293B]">Contacts</Link>

            <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setGetInvolvedOpen(true);
                }}
                className="w-full py-2.5 px-4 bg-[#0C57A5] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#094787] transition-colors text-center"
              >
                Get Involved / Participate
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <GetInvolvedModal isOpen={getInvolvedOpen} onClose={() => setGetInvolvedOpen(false)} />
    </>
  );
}
