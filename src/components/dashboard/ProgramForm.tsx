'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImageUploader } from '@/components/dashboard/ImageUploader';
import { RichTextEditor } from '@/components/dashboard/RichTextEditor';
import {
  ArrowLeft,
  Save,
  ExternalLink,
  Check,
  AlertCircle,
  RefreshCw,
  Layers,
  Sparkles,
  Users,
  Target,
  FileText,
  Compass,
  CheckCircle2,
} from 'lucide-react';

const CATEGORY_SUGGESTIONS = [
  'Public Awareness & Education',
  'Civic Deliberation & Governance',
  'Youth Leadership & Policy Fellowship',
  'Institutional Deliberation',
  'Media Research & Transparency',
];

interface ProgramFormProps {
  initialId?: string; // If provided, edit mode
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

export function ProgramForm({ initialId }: ProgramFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Card & Header Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [status, setStatus] = useState('Ongoing');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [leadFellow, setLeadFellow] = useState('');

  // Rich Text Description (Tiptap)
  const [richContent, setRichContent] = useState('');

  // Structured Action Frameworks
  const [objectivesText, setObjectivesText] = useState('');
  const [activitiesText, setActivitiesText] = useState('');
  const [outcomesText, setOutcomesText] = useState('');

  // Auto-generate slug from title unless manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isCustomSlug && !isEdit) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  // Fetch initial program if editing
  useEffect(() => {
    if (!initialId) return;

    const fetchProgram = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/programs/${initialId}`);
        const data = await res.json();
        if (!res.ok || !data.item) {
          throw new Error(data.error || 'Failed to load program data');
        }

        const p = data.item;
        setTitle(p.title || '');
        setSlug(p.slug || '');
        setIsCustomSlug(Boolean(p.slug));
        setSubtitle(p.subtitle || '');
        setStatus(p.status || 'Ongoing');
        setCategory(p.category || '');
        setCoverImage(p.coverImage || '');
        setTargetAudience(p.targetAudience || '');
        setLeadFellow(p.leadFellow || '');

        // Rich text content: prefer overview, fallback to description
        const initialBody = p.overview || p.description || '';
        setRichContent(initialBody);

        setObjectivesText(Array.isArray(p.objectives) ? p.objectives.join('\n') : '');
        setActivitiesText(Array.isArray(p.activities) ? p.activities.join('\n') : '');
        setOutcomesText(Array.isArray(p.expectedOutcomes) ? p.expectedOutcomes.join('\n') : '');
      } catch (err: any) {
        setErrorMessage(err.message || 'Error loading program details');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [initialId]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSaveSuccess(false);

    if (!title.trim()) {
      setErrorMessage('Please enter a program title.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);

    const finalSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // Generate concise plain-text description for cards from subtitle or rich content
    const cardDescription = subtitle.trim() || stripHtml(richContent).slice(0, 240) || title.trim();

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      subtitle: subtitle.trim(),
      status,
      category: category.trim() || 'Civic Initiative',
      coverImage: coverImage.trim() || '',
      description: cardDescription,
      overview: richContent.trim() || cardDescription,
      objectives: objectivesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      activities: activitiesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      targetAudience: targetAudience.trim(),
      expectedOutcomes: outcomesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      leadFellow: leadFellow.trim(),
      published: true,
    };

    try {
      const url = isEdit ? `/api/admin/programs/${initialId}` : '/api/admin/programs';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save program');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);

      if (!isEdit && result.item?.id) {
        router.push(`/dashboard/programs/${result.item.id}/edit`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving program');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[#0C57A5] mx-auto mb-3" />
        <p className="text-xs text-[#64748B] font-mono">Loading program details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24 text-left">
      {/* Top Breadcrumb & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <Link
            href="/dashboard/programs"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#64748B] hover:text-[#0C57A5] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Programs</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0B2A4A] tracking-tight">
              {isEdit ? 'Edit Program' : 'New Program'}
            </h1>
            {isEdit && slug && (
              <a
                href={`/programs/${slug}`}
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
              ? 'Update initiative card metadata, rich description, and action components.'
              : 'Add a new program with card information and rich formatted description.'}
          </p>
        </div>

        {/* Action Buttons Top Bar */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/dashboard/programs"
            className="px-4 py-2.5 text-xs font-bold text-[#64748B] hover:text-[#0B2A4A] bg-white border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{isEdit ? 'Update Program' : 'Publish Program'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Program successfully saved and published live!</span>
          </div>
          {slug && (
            <a
              href={`/programs/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold underline text-emerald-900 inline-flex items-center gap-1"
            >
              <span>View live on website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* 1. Card Information (Public Display & Cards) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#F1F5F9]">
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-[#0B2A4A]">Card Information</h2>
              <p className="text-xs text-[#64748B]">
                The key details displayed on program cards across the website (homepage, catalog, search).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
                Program Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Media Literacy and Public Awareness Initiative"
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-sm font-serif font-bold text-[#0B2A4A] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
                  URL Slug Key *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setIsCustomSlug(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="e.g. media-literacy-public-awareness"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-mono text-[#0B2A4A] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white"
                />
                <span className="text-[10px] text-[#64748B] mt-1 block">
                  Public page link: /programs/{slug || 'initiative-slug'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
                  Operational Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white"
                >
                  <option value="Ongoing">Ongoing (Active Initiative)</option>
                  <option value="Upcoming">Upcoming (Scheduled Cohort)</option>
                  <option value="Completed">Completed (Archived Phase)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
                Thematic Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Public Awareness & Education"
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white"
              />
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] font-mono text-[#64748B] mr-1">Suggestions:</span>
                {CATEGORY_SUGGESTIONS.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors cursor-pointer border ${
                      category === cat
                        ? 'bg-[#0C57A5] text-white border-[#0C57A5]'
                        : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0] hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
                Subtitle / Short Card Summary
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Empowering citizens with critical inquiry and verification tools in a complex information era."
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white"
              />
              <span className="text-[10px] text-[#64748B] mt-1 block">
                Short 1-2 sentence tagline shown on cards and in the page header.
              </span>
            </div>

            <div>
              <ImageUploader
                value={coverImage}
                onChange={setCoverImage}
                label="Card & Banner Cover Image"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F1F5F9]">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. University students, civic volunteers"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
                  Lead Directorate / Fellow
                </label>
                <input
                  type="text"
                  value={leadFellow}
                  onChange={(e) => setLeadFellow(e.target.value)}
                  placeholder="e.g. Tahsin Rahman (Engagement Directorate)"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Detailed Program Content (Tiptap Rich Text Editor) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#F1F5F9]">
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-[#0B2A4A]">Full Program Description & Overview</h2>
              <p className="text-xs text-[#64748B]">
                Write formatted content with headings, lists, quotes, and links. This appears as the main body on the single program page.
              </p>
            </div>
          </div>

          <div>
            <RichTextEditor
              content={richContent}
              onChange={setRichContent}
              placeholder="Write the full program rationale, background, training modules, participant stories, and methodology..."
              minHeight="260px"
            />
          </div>
        </div>

        {/* 3. Action Components & Outcomes (Optional Details) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#F1F5F9]">
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-[#0B2A4A]">Objectives & Expected Outcomes (Optional)</h2>
              <p className="text-xs text-[#64748B]">
                Optional bullet lists that render as checklist items and outcome cards on the single page.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
                Strategic Objectives (one per line)
              </label>
              <textarea
                rows={4}
                value={objectivesText}
                onChange={(e) => setObjectivesText(e.target.value)}
                placeholder="Train university students in verification...&#10;Distribute media literacy toolkits...&#10;Facilitate community clinics..."
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white leading-relaxed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
                Core Program Activities (one per line)
              </label>
              <textarea
                rows={4}
                value={activitiesText}
                onChange={(e) => setActivitiesText(e.target.value)}
                placeholder="Bi-weekly weekend clinics...&#10;Inter-university hackathons...&#10;Digital learning modules..."
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white leading-relaxed font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1.5">
              Expected Civic & Policy Outcomes (one per line)
            </label>
            <textarea
              rows={3}
              value={outcomesText}
              onChange={(e) => setOutcomesText(e.target.value)}
              placeholder="Measurable 40% reduction in unverified rumors...&#10;Establishment of 24 campus media literacy circles..."
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white leading-relaxed font-mono"
            />
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0]">
          <Link
            href="/dashboard/programs"
            className="px-5 py-2.5 text-xs font-bold text-[#64748B] hover:text-[#0B2A4A] bg-white border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel & Return
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Initiative...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? 'Update Program Details' : 'Publish Program'}</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
