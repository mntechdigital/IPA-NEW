'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImageUploader } from '@/components/dashboard/ImageUploader';
import { PdfUploader } from '@/components/dashboard/PdfUploader';
import { RichTextEditor } from '@/components/dashboard/RichTextEditor';
import {
  ArrowLeft,
  Save,
  ExternalLink,
  Plus,
  Trash2,
  FileText,
  CheckCircle,
  Calendar,
  Sparkles,
  AlertCircle,
  Check,
  RefreshCw,
  BookOpen,
  Info,
  Sliders,
} from 'lucide-react';

interface ResearchFormProps {
  initialId?: string; // If provided, edit mode
}

export function ResearchForm({ initialId }: ResearchFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Primary Metadata
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [category, setCategory] = useState('Media Research');
  const [type, setType] = useState('Research Report');
  const [date, setDate] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [pages, setPages] = useState<number>(1);
  const [fileSize, setFileSize] = useState('');
  const [doi, setDoi] = useState('');
  const [featured, setFeatured] = useState(false);

  // Media & Files
  const [coverImage, setCoverImage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  // Authors & Abstract
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [authorAffiliation, setAuthorAffiliation] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keyFindings, setKeyFindings] = useState<string[]>([]);
  const [newFindingInput, setNewFindingInput] = useState('');

  // Full Study Content
  const [execSummary, setExecSummary] = useState('');
  const [methodology, setMethodology] = useState('');
  const [discussion, setDiscussion] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [newRecInput, setNewRecInput] = useState('');

  // Fetch initial data if editing
  useEffect(() => {
    if (!initialId) return;

    const fetchPublication = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/research/${initialId}`);
        const data = await res.json();
        if (!res.ok || !data.item) {
          throw new Error(data.error || 'Failed to load publication');
        }

        const item = data.item;
        setTitle(item.title || '');
        setSlug(item.slug || '');
        setIsCustomSlug(Boolean(item.slug));
        setCategory(item.category || 'Media Research');
        setType(item.type || 'Research Report');
        setDate(item.date || '');
        setYear(item.year || new Date().getFullYear());
        setPages(item.pages || 1);
        setFileSize(item.fileSize || '');
        setDoi(item.doi || '');
        setFeatured(Boolean(item.featured));
        setCoverImage(item.coverImage || '');
        setDownloadUrl(item.downloadUrl || '');
        setAbstract(item.abstract || '');

        const firstAuthor = Array.isArray(item.authors) ? item.authors[0] : null;
        setAuthorName(firstAuthor?.name || '');
        setAuthorRole(firstAuthor?.role || '');
        setAuthorAffiliation(firstAuthor?.affiliation || '');

        if (Array.isArray(item.keyFindings)) {
          setKeyFindings(item.keyFindings.filter(Boolean));
        }

        setExecSummary(item.executiveSummary || item.content?.executiveSummary || '');
        setMethodology(item.methodology || item.content?.methodology || '');
        setDiscussion(item.discussion || item.content?.discussion || '');

        const recs = Array.isArray(item.recommendations)
          ? item.recommendations
          : Array.isArray(item.content?.recommendations)
          ? item.content.recommendations
          : [];
        setRecommendations(recs.filter(Boolean));
      } catch (err: any) {
        setErrorMessage(err.message || 'Error loading publication');
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [initialId]);

  // Handle title change & auto-generate slug if not manually customized
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isCustomSlug && !isEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    setIsCustomSlug(true);
    setSlug(
      val
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
    );
  };

  const handleRegenerateSlug = () => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generated);
    setIsCustomSlug(false);
  };

  const handleAddFinding = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newFindingInput.trim();
    if (!trimmed) return;
    setKeyFindings((prev) => [...prev, trimmed]);
    setNewFindingInput('');
  };

  const handleRemoveFinding = (index: number) => {
    setKeyFindings((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddRecommendation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newRecInput.trim();
    if (!trimmed) return;
    setRecommendations((prev) => [...prev, trimmed]);
    setNewRecInput('');
  };

  const handleRemoveRecommendation = (index: number) => {
    setRecommendations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetTodayDate = () => {
    const today = new Date();
    const formatted = today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    setDate(formatted);
    setYear(today.getFullYear());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter a publication title.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!abstract.trim()) {
      setErrorMessage('Please enter an executive abstract.');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setSaving(true);

    const finalSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const finalDate =
      date.trim() ||
      new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

    const authors = authorName.trim()
      ? [
          {
            name: authorName.trim(),
            role: authorRole.trim(),
            affiliation: authorAffiliation.trim(),
          },
        ]
      : [];

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      category,
      type,
      date: finalDate,
      year: Number(year) || new Date().getFullYear(),
      pages: Number(pages) || 1,
      fileSize: fileSize.trim() || '2.0 MB',
      doi: doi.trim() || null,
      featured,
      coverImage: coverImage.trim() || '',
      downloadUrl: downloadUrl.trim() || null,
      abstract: abstract.trim(),
      authors,
      keyFindings: keyFindings.filter(Boolean),
      executiveSummary: execSummary.trim() || null,
      methodology: methodology.trim() || null,
      discussion: discussion.trim() || null,
      recommendations: recommendations.filter(Boolean),
    };

    try {
      const url = isEdit ? `/api/admin/research/${initialId}` : '/api/admin/research';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save publication');
      }

      setSaveSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/research');
        router.refresh();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while saving publication.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[#0C57A5] mx-auto mb-3" />
        <h3 className="text-base font-serif font-bold text-[#0B2A4A]">Loading publication details...</h3>
        <p className="text-xs text-[#64748B] mt-1 font-mono">Fetching record from repository...</p>
      </div>
    );
  }

  const categories = [
    'Media Research',
    'Public Affairs',
    'Digital Media',
    'Social Development',
    'Governance',
    'Public Awareness',
  ];

  const publicationTypes = [
    'Research Report',
    'Policy Brief',
    'Discussion Paper',
    'Working Paper',
    'Article',
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Breadcrumb & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <Link
            href="/dashboard/research"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#64748B] hover:text-[#0C57A5] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Research Archive</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0B2A4A] tracking-tight">
              {isEdit ? 'Edit Publication' : 'Create New Publication'}
            </h1>
            {isEdit && slug && (
              <a
                href={`/research/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono text-[#0C57A5] bg-[#EAF2FA] hover:bg-[#D4E6F8] transition-colors"
                title="View on Live Site"
              >
                <span>Live View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            {isEdit
              ? 'Update the research methodology, editorial text, PDF document, and public access metadata.'
              : 'Add an empirical study, policy brief, or working paper with rich text content and downloadable PDF.'}
          </p>
        </div>

        {/* Floating / Sticky Save Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/dashboard/research"
            className="px-4 py-2.5 text-xs font-bold text-[#64748B] hover:text-[#0B2A4A] bg-white border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold shadow-md transition-all disabled:opacity-60 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? 'Update Publication' : 'Publish Publication'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications / Errors */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span className="font-medium">
            Publication successfully saved to repository! Redirecting to archive...
          </span>
        </div>
      )}

      {/* Main 2-Column Responsive Workspace */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT COLUMN: PRIMARY EDITORIAL CANVAS (8 cols) ================= */}
        <div className="lg:col-span-8 space-y-8">
          {/* Card 1: Primary Overview */}
          <section className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
              <div className="w-7 h-7 rounded-lg bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-sm font-bold text-[#0B2A4A] uppercase tracking-wider">
                Publication Identification
              </h2>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
                Publication Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Media Landscape and Public Trust in Bangladesh: An Empirical Investigation"
                className="w-full px-4 py-3 bg-[#F8FAFD] border border-[#CBD5E1] rounded-2xl text-sm text-[#0B2A4A] font-serif font-bold placeholder:text-[#94A3B8] placeholder:font-sans placeholder:font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
              />
            </div>

            {/* URL Slug with Auto-Generator */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase text-[#1E293B]">
                  URL Web Slug
                </label>
                {title && (
                  <button
                    type="button"
                    onClick={handleRegenerateSlug}
                    className="text-[11px] font-mono font-medium text-[#0C57A5] hover:underline cursor-pointer"
                  >
                    Reset from Title
                  </button>
                )}
              </div>
              <div className="flex items-center rounded-2xl border border-[#CBD5E1] bg-[#F8FAFD] overflow-hidden focus-within:ring-2 focus-within:ring-[#0C57A5] focus-within:bg-white">
                <span className="px-3.5 py-2.5 text-xs font-mono text-[#64748B] bg-[#F1F5F9] border-r border-[#CBD5E1] select-none">
                  /research/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="media-landscape-public-trust-bangladesh"
                  className="w-full px-3.5 py-2.5 bg-transparent text-xs font-mono text-[#1E293B] focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-[#64748B] mt-1.5">
                Canonical web path for this study. Lowercase letters, numbers, and dashes only.
              </p>
            </div>

            {/* Category & Type Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
                  Research Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#CBD5E1] rounded-2xl text-xs text-[#1E293B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
                  Publication Format / Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFD] border border-[#CBD5E1] rounded-2xl text-xs text-[#1E293B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                >
                  {publicationTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Card 2: Abstract & Empirical Findings */}
          <section className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
              <div className="w-7 h-7 rounded-lg bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-sm font-bold text-[#0B2A4A] uppercase tracking-wider">
                Abstract & Key Empirical Findings
              </h2>
            </div>

            {/* Executive Abstract */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase text-[#1E293B]">
                  Executive Abstract <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-[#94A3B8] font-mono">
                  {abstract.length} characters
                </span>
              </div>
              <textarea
                required
                rows={4}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Comprehensive executive abstract outlining the study rationale, survey demographics, methodology, and central findings for researchers and policymakers..."
                className="w-full px-4 py-3 bg-[#F8FAFD] border border-[#CBD5E1] rounded-2xl text-xs sm:text-sm text-[#1E293B] leading-relaxed placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
              />
              <p className="text-[11px] text-[#64748B] mt-1.5">
                Displayed in search indexing, cards on the Research Archive page, and top callout banner on the single study page.
              </p>
            </div>

            {/* Interactive Key Findings List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B]">
                    Key Empirical Findings
                  </label>
                  <p className="text-[11px] text-[#64748B]">
                    Rendered as high-impact numbered highlights (01, 02, etc.) on the study details page.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#0C57A5] bg-[#EAF2FA] px-2 py-0.5 rounded-full">
                  {keyFindings.length} Items
                </span>
              </div>

              {/* Existing Findings Cards */}
              {keyFindings.length > 0 && (
                <div className="space-y-2">
                  {keyFindings.map((finding, index) => (
                    <div
                      key={index}
                      className="group flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all"
                    >
                      <span className="font-mono text-xs font-bold text-[#0C57A5] shrink-0 mt-0.5">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <p className="flex-1 text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                        {finding}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveFinding(index)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#94A3B8] hover:text-red-500 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        title="Remove Finding"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Finding Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFindingInput}
                  onChange={(e) => setNewFindingInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFinding();
                    }
                  }}
                  placeholder="Type a key finding (e.g. 78% of young readers express concern regarding unverified viral social media aggregators)..."
                  className="flex-1 px-3.5 py-2.5 bg-[#F8FAFD] border border-[#CBD5E1] rounded-2xl text-xs text-[#1E293B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                />
                <button
                  type="button"
                  onClick={() => handleAddFinding()}
                  disabled={!newFindingInput.trim()}
                  className="px-4 py-2.5 rounded-2xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </section>

          {/* Card 3: Deep-Dive Study Content & Tiptap Rich Text */}
          <section className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#0B2A4A] uppercase tracking-wider">
                    Deep-Dive Study Content & Analysis
                  </h2>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#FDE8B5] text-[#0B2A4A]">
                <Sparkles className="w-3 h-3 text-[#0C57A5]" />
                Tiptap Rich Text Enabled
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EAF2FA]/70 border border-[#0C57A5]/20 flex items-start gap-2.5 text-xs text-[#0B2A4A]">
              <Info className="w-4 h-4 text-[#0C57A5] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#334155] leading-relaxed">
                These four sections populate the full reading canvas on the single publication page (e.g.{' '}
                <span className="font-mono font-semibold text-[#0C57A5]">
                  /research/{slug || 'media-literacy-secondary-education-curriculum'}
                </span>
                ).
              </p>
            </div>

            {/* Section 1: Executive Summary */}
            <div>
              <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
                1. Executive Summary & Context
              </label>
              <textarea
                rows={3}
                value={execSummary}
                onChange={(e) => setExecSummary(e.target.value)}
                placeholder="The media landscape in Bangladesh is experiencing rapid structural transformation characterized by shrinking print circulations..."
                className="w-full px-4 py-3 bg-[#F8FAFD] border border-[#CBD5E1] rounded-2xl text-xs sm:text-sm text-[#1E293B] leading-relaxed placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
              />
            </div>

            {/* Section 2: Methodological Design */}
            <div>
              <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
                2. Methodological Design & Data Sources
              </label>
              <textarea
                rows={3}
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                placeholder="A mixed-methods empirical design was executed between February and August 2026. A randomized stratified survey across seven administrative divisions..."
                className="w-full px-4 py-3 bg-[#F8FAFD] border border-[#CBD5E1] rounded-2xl text-xs sm:text-sm text-[#1E293B] leading-relaxed placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
              />
            </div>

            {/* Section 3: Analytical Discussion - Tiptap Rich Text Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B]">
                    3. Analytical Discussion (Tiptap Rich-Text Editor)
                  </label>
                  <p className="text-[11px] text-[#64748B]">
                    Supports headings, bold, italics, formatted blockquotes, bullet points, numbered lists, links, and code blocks.
                  </p>
                </div>
              </div>
              <RichTextEditor
                content={discussion}
                onChange={setDiscussion}
                placeholder="Compose the full analytical discussion, research findings, and thematic inquiry..."
                minHeight="300px"
              />
            </div>

            {/* Section 4: Strategic Policy Recommendations */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B]">
                    4. Strategic Policy Recommendations
                  </label>
                  <p className="text-[11px] text-[#64748B]">
                    Displayed with checkmark icons at the conclusion of the research study.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#0C57A5] bg-[#EAF2FA] px-2 py-0.5 rounded-full">
                  {recommendations.length} Recommendations
                </span>
              </div>

              {recommendations.length > 0 && (
                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="group flex items-start gap-3 p-3 rounded-2xl bg-[#F8FAFD] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all"
                    >
                      <CheckCircle className="w-4 h-4 text-[#0C57A5] shrink-0 mt-0.5" />
                      <p className="flex-1 text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                        {rec}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveRecommendation(index)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#94A3B8] hover:text-red-500 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        title="Remove Recommendation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Recommendation Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRecInput}
                  onChange={(e) => setNewRecInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRecommendation();
                    }
                  }}
                  placeholder="Type a strategic policy recommendation (e.g. Institutionalize independent news ombudsman bodies)..."
                  className="flex-1 px-3.5 py-2.5 bg-[#F8FAFD] border border-[#CBD5E1] rounded-2xl text-xs text-[#1E293B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                />
                <button
                  type="button"
                  onClick={() => handleAddRecommendation()}
                  disabled={!newRecInput.trim()}
                  className="px-4 py-2.5 rounded-2xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ================= RIGHT COLUMN: MEDIA, FILES & PUBLISHING CONTROLS (4 cols) ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Publish Box */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <h3 className="text-xs font-bold text-[#0B2A4A] uppercase tracking-wider">
                Publication Status
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active / Published
              </span>
            </div>

            {/* Prominent Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-2xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Record...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Save Changes' : 'Publish Publication'}</span>
                </>
              )}
            </button>

            {/* Featured on Home Switch */}
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-[#0C57A5] rounded focus:ring-[#0C57A5] mt-0.5"
              />
              <div>
                <span className="text-xs font-bold text-[#0B2A4A] block">
                  Featured on Home Showcase
                </span>
                <span className="text-[11px] text-[#64748B] block mt-0.5 leading-snug">
                  Pin this study on the public home page research highlight gallery.
                </span>
              </div>
            </label>

            {/* Date & Year Controls */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-[#1E293B] uppercase">
                    Publication Date
                  </label>
                  <button
                    type="button"
                    onClick={handleSetTodayDate}
                    className="text-[10px] font-mono font-semibold text-[#0C57A5] hover:underline cursor-pointer"
                  >
                    Set to Today
                  </button>
                </div>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. October 24, 2026"
                    className="w-full pl-8 pr-3 py-2 bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] uppercase mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] uppercase mb-1">
                    Pages
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={pages}
                    onChange={(e) => setPages(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: PDF Document Attachment (10MB limit) */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-bold text-[#0B2A4A] uppercase tracking-wider">
                  Full Report PDF
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                Max 10MB
              </span>
            </div>

            <PdfUploader
              value={downloadUrl}
              onChange={(url, formattedSize) => {
                setDownloadUrl(url);
                if (formattedSize && !fileSize) {
                  setFileSize(formattedSize);
                }
              }}
              label=""
              description="Upload the official full research publication in PDF format. Limit is 10MB."
            />

            <div>
              <label className="block text-[11px] font-semibold text-[#1E293B] uppercase mb-1">
                Display File Size
              </label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="e.g. 3.2 MB"
                className="w-full px-3 py-2 bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl text-xs font-mono text-[#1E293B]"
              />
              <p className="text-[10px] text-[#64748B] mt-1 font-mono">
                Auto-detected during upload or customizable manually.
              </p>
            </div>
          </div>

          {/* Card 3: Cover / Feature Image */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-4">
            <div className="pb-3 border-b border-[#F1F5F9]">
              <h3 className="text-xs font-bold text-[#0B2A4A] uppercase tracking-wider">
                Cover / Header Image
              </h3>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Optional feature photo shown in cards and report banner.
              </p>
            </div>

            <ImageUploader
              value={coverImage}
              onChange={setCoverImage}
              label=""
              description="Leave empty if this report uses the brand default graphic."
            />
          </div>

          {/* Card 4: Academic Identifiers & DOI */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-[#0B2A4A] uppercase tracking-wider pb-2 border-b border-[#F1F5F9]">
              Academic Identifiers
            </h3>
            <div>
              <label className="block text-[11px] font-semibold text-[#1E293B] uppercase mb-1">
                Digital Object Identifier (DOI)
              </label>
              <input
                type="text"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="e.g. 10.5281/ipa.res.2026.015"
                className="w-full px-3 py-2 bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl text-xs font-mono text-[#1E293B]"
              />
              <p className="text-[10px] text-[#64748B] mt-1">
                Used for formal APA / Chicago academic citation exports.
              </p>
            </div>
          </div>

          {/* Card 5: Principal Investigators & Authors */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-[#0B2A4A] uppercase tracking-wider pb-2 border-b border-[#F1F5F9]">
              Principal Investigator
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                Author Full Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Dr. Nazmul Huq"
                className="w-full px-3 py-2 bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                Academic / Research Role
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g. Senior Fellow in Media Studies"
                className="w-full px-3 py-2 bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                Institutional Affiliation
              </label>
              <input
                type="text"
                value={authorAffiliation}
                onChange={(e) => setAuthorAffiliation(e.target.value)}
                placeholder="e.g. IPA Research Directorate"
                className="w-full px-3 py-2 bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
