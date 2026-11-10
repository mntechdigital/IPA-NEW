'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ImageUploader } from '@/components/dashboard/ImageUploader';
import {
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  BookOpen,
  FileText,
  ShieldCheck,
  ImageIcon,
} from 'lucide-react';

export default function AboutMandatePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Hero Fields
  const [heroEyebrow, setHeroEyebrow] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');

  // Mandate Story Fields
  const [mandateEyebrow, setMandateEyebrow] = useState('');
  const [mandateTitle, setMandateTitle] = useState('');
  const [mandateParagraph1, setMandateParagraph1] = useState('');
  const [mandateParagraph2, setMandateParagraph2] = useState('');

  // Principles Fields
  const [mandatePrinciplesTitle, setMandatePrinciplesTitle] = useState('');
  const [mandatePrinciples, setMandatePrinciples] = useState('');

  // Image & Caption Fields
  const [mandateImage, setMandateImage] = useState('');
  const [mandateImageLabel, setMandateImageLabel] = useState('');
  const [mandateImageCaption, setMandateImageCaption] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/about');
        const data = await res.json();
        if (data.aboutSettings) {
          const a = data.aboutSettings;
          setHeroEyebrow(a.heroEyebrow || '');
          setHeroTitle(a.heroTitle || '');
          setHeroDescription(a.heroDescription || '');

          setMandateEyebrow(a.mandateEyebrow || '');
          setMandateTitle(a.mandateTitle || '');
          setMandateParagraph1(a.mandateParagraph1 || '');
          setMandateParagraph2(a.mandateParagraph2 || '');

          setMandatePrinciplesTitle(a.mandatePrinciplesTitle || '');
          setMandatePrinciples(a.mandatePrinciples || '');

          setMandateImage(a.mandateImage || '');
          setMandateImageLabel(a.mandateImageLabel || '');
          setMandateImageCaption(a.mandateImageCaption || '');
        }
      } catch {
        setError('Failed to load about mandate data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aboutSettings: {
            heroEyebrow,
            heroTitle,
            heroDescription,
            mandateEyebrow,
            mandateTitle,
            mandateParagraph1,
            mandateParagraph2,
            mandatePrinciplesTitle,
            mandatePrinciples,
            mandateImage,
            mandateImageLabel,
            mandateImageCaption,
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to save mandate settings');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || 'Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-[#0C57A5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-[#64748B]">Loading mandate settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Back to About Index */}
      <div>
        <Link
          href="/dashboard/pages/about"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0C57A5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to About Sections</span>
        </Link>
      </div>

      {/* Header */}
      <PageHeader
        badge="About Section"
        title="Hero & Foundational Mandate"
        description="Configure the masthead header, foundational story narrative, research principles, and library archive photograph."
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold shadow-md transition-colors disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : success ? (
              <Check className="w-4 h-4 text-[#F6B834]" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}</span>
          </button>
        }
      />

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Hero & Mandate settings saved and updated live!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Hero Masthead */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
          <div className="p-2 rounded-lg bg-[#0C57A5]/10 text-[#0C57A5]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold font-serif text-[#0B2A4A] text-base">Hero Header</h3>
            <p className="text-xs text-[#64748B]">Top masthead title and lead summary on the About page</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Eyebrow Tag
            </label>
            <input
              type="text"
              value={heroEyebrow}
              onChange={(e) => setHeroEyebrow(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono font-bold text-[#0C57A5] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
              placeholder="e.g. INSTITUTIONAL PROFILE & GOVERNANCE"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Page Main Title
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-serif font-bold text-[#0B2A4A] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
              placeholder="e.g. About the Institute of Public Affairs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Lead Statement / Subheading
            </label>
            <textarea
              rows={3}
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] leading-relaxed"
              placeholder="Summary explaining the institute's role and purpose"
            />
          </div>
        </div>
      </div>

      {/* 2. Foundational Mandate Narrative */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
          <div className="p-2 rounded-lg bg-[#0C57A5]/10 text-[#0C57A5]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold font-serif text-[#0B2A4A] text-base">Origins & Mandate Story</h3>
            <p className="text-xs text-[#64748B]">Editorial narrative detailing the origin, purpose, and scope of IPA</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Mandate Eyebrow
              </label>
              <input
                type="text"
                value={mandateEyebrow}
                onChange={(e) => setMandateEyebrow(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono font-bold text-[#0C57A5] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Mandate Heading
              </label>
              <input
                type="text"
                value={mandateTitle}
                onChange={(e) => setMandateTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-serif font-bold text-[#0B2A4A] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Opening Paragraph (Editorial Dropcap)
            </label>
            <textarea
              rows={4}
              value={mandateParagraph1}
              onChange={(e) => setMandateParagraph1(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Secondary Context Paragraph
            </label>
            <textarea
              rows={4}
              value={mandateParagraph2}
              onChange={(e) => setMandateParagraph2(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* 3. Research Principles Highlight Box */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
          <div className="p-2 rounded-lg bg-[#0C57A5]/10 text-[#0C57A5]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold font-serif text-[#0B2A4A] text-base">Research Principles Callout</h3>
            <p className="text-xs text-[#64748B]">Highlighted institutional commitment box shown alongside the story</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Callout Title
            </label>
            <input
              type="text"
              value={mandatePrinciplesTitle}
              onChange={(e) => setMandatePrinciplesTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0C57A5] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
              placeholder="e.g. Our Research Principles:"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Principles Description
            </label>
            <textarea
              rows={3}
              value={mandatePrinciples}
              onChange={(e) => setMandatePrinciples(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* 4. Archive Photograph & Caption */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
          <div className="p-2 rounded-lg bg-[#0C57A5]/10 text-[#0C57A5]">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold font-serif text-[#0B2A4A] text-base">Mandate Photograph & Caption</h3>
            <p className="text-xs text-[#64748B]">Side photo card illustrating researchers, archive, or library</p>
          </div>
        </div>

        <div className="space-y-4">
          <ImageUploader
            value={mandateImage}
            onChange={setMandateImage}
            label="Archive Photograph"
            description="Upload a high-quality photograph of researchers, library archives, or symposium discussions."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Photo Card Label
              </label>
              <input
                type="text"
                value={mandateImageLabel}
                onChange={(e) => setMandateImageLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0C57A5] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                placeholder="e.g. IPA Research Archive & Library"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Photo Caption
              </label>
              <input
                type="text"
                value={mandateImageCaption}
                onChange={(e) => setMandateImageCaption(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                placeholder="e.g. Scholars analyzing datasets and municipal audit filings."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
