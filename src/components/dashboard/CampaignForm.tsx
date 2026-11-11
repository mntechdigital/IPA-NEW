'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImageUploader } from '@/components/dashboard/ImageUploader';
import { RichTextEditor } from '@/components/dashboard/RichTextEditor';
import { CampaignResourcesUploader, CampaignResource } from '@/components/dashboard/CampaignResourcesUploader';
import {
  ArrowLeft,
  Save,
  ExternalLink,
  Check,
  AlertCircle,
  RefreshCw,
  Megaphone,
  FileText,
  Target,
  Users,
  Compass,
  Sparkles,
} from 'lucide-react';

const STATUS_OPTIONS = ['Active Campaign', 'Upcoming', 'Archived'] as const;

interface CampaignFormProps {
  initialId?: string;
}

export function CampaignForm({ initialId }: CampaignFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Card 1: Card Information & Meta
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [tagline, setTagline] = useState('');
  const [status, setStatus] = useState<string>('Active Campaign');
  const [coverImage, setCoverImage] = useState('');

  // Card 2: Narrative (Single Tiptap Rich Text Editor)
  const [introduction, setIntroduction] = useState('');

  // Card 3: Action Frameworks & Coalitions
  const [objectivesText, setObjectivesText] = useState('');
  const [actionsText, setActionsText] = useState('');
  const [partnersText, setPartnersText] = useState('');

  // Card 4: Downloadable PDF Resources (Max 10 MB each)
  const [resources, setResources] = useState<CampaignResource[]>([]);

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

  // Fetch initial campaign if editing
  useEffect(() => {
    if (!initialId) return;

    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/campaigns/${initialId}`);
        const data = await res.json();
        if (!res.ok || !data.item) {
          throw new Error(data.error || 'Failed to load campaign data');
        }

        const c = data.item;
        setTitle(c.title || '');
        setSlug(c.slug || '');
        setIsCustomSlug(Boolean(c.slug));
        setTagline(c.tagline || '');
        setStatus(c.status || 'Active Campaign');
        setCoverImage(c.coverImage || '');

        // Single rich text editor: prefer introduction, fallback to whyItMatters
        const initialNarrative = c.introduction || c.whyItMatters || '';
        setIntroduction(initialNarrative);

        setObjectivesText(Array.isArray(c.objectives) ? c.objectives.join('\n') : '');
        setActionsText(Array.isArray(c.coreActions) ? c.coreActions.join('\n') : '');
        setPartnersText(Array.isArray(c.partnerNetworks) ? c.partnerNetworks.join('\n') : '');

        // PDF Resources
        if (Array.isArray(c.resources)) {
          setResources(c.resources);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error loading campaign details');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [initialId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter a campaign title.');
      return;
    }

    const finalSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (!finalSlug) {
      setErrorMessage('A valid slug is required.');
      return;
    }

    if (!introduction.trim()) {
      setErrorMessage('Please provide a campaign narrative overview.');
      return;
    }

    const objectives = objectivesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const coreActions = actionsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const partnerNetworks = partnersText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      tagline: tagline.trim(),
      status,
      coverImage,
      introduction: introduction.trim(),
      whyItMatters: introduction.trim(),
      objectives,
      coreActions,
      partnerNetworks,
      resources,
      published: true,
    };

    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/campaigns/${initialId}` : '/api/admin/campaigns';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save campaign');
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push('/dashboard/campaigns');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while saving campaign');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-16 text-center space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-[#0C57A5] mx-auto" />
        <p className="text-sm text-[#64748B] font-mono">Loading campaign...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-2xs">
        <div className="space-y-1">
          <Link
            href="/dashboard/campaigns"
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0C57A5] transition-colors mb-1 font-mono font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Campaigns</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#0B2A4A]">
              {isEdit ? 'Edit Campaign' : 'Create Public Campaign'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FDE8B5] text-[#0B2A4A]">
              {status}
            </span>
          </div>
          <p className="text-xs text-[#64748B]">
            {isEdit
              ? 'Update public mobilization strategy, target benchmarks, and downloadable resources.'
              : 'Launch a nationwide civic advocacy campaign or reform mobilization movement.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {slug && (
            <Link
              href={`/campaigns/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#64748B] hover:text-[#0B2A4A] hover:bg-[#F8FAFD] transition-colors"
              title="Preview on live site"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live View</span>
            </Link>
          )}

          <Link
            href="/dashboard/campaigns"
            className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#64748B] hover:text-[#0B2A4A] hover:bg-[#F8FAFD] transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving || saveSuccess}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-300" />
                <span>Published!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{isEdit ? 'Save Changes' : 'Publish Campaign'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Cannot proceed: </span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* CARD 1: Identity & Card Details */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-xl bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center font-bold">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-serif text-[#0B2A4A]">
              1. Campaign Information & Card Presentation
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Primary headlines, public tagline, campaign lifecycle status, and hero image.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A] flex items-center gap-1.5">
              <span>Campaign Title</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Civic Oversight of Judicial Appointments"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] font-serif font-bold"
            />
          </div>

          {/* Slug */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A] flex items-center justify-between">
              <span>URL Slug</span>
              <span className="text-[10px] text-[#64748B] font-mono">
                /campaigns/<span className="text-[#0C57A5]">{slug || 'campaign-slug'}</span>
              </span>
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setIsCustomSlug(true);
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]+/g, '-')
                    .replace(/(^-|-$)/g, '')
                );
              }}
              placeholder="campaign-url-slug"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A]">
              Campaign Tagline / Subtitle
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Demanding constitutional transparency in high-court nominations."
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A]">
              Campaign Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Image */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-[#0B2A4A]">
              Campaign Banner / Cover Image
            </label>
            <ImageUploader
              value={coverImage}
              onChange={setCoverImage}
              label="Campaign Hero Image"
            />
          </div>
        </div>
      </div>

      {/* CARD 2: Campaign Narrative & Public Context (Single Rich Text Editor) */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-xl bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-serif text-[#0B2A4A]">
              2. Campaign Story & Context
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Comprehensive narrative, advocacy mission, and why public engagement is critical.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#0B2A4A] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0C57A5]" />
            <span>Campaign Narrative & Overview</span>
            <span className="text-red-500">*</span>
          </label>
          <p className="text-[11px] text-[#64748B]">
            Format paragraphs with headings, bold text, links, blockquotes, and lists for public readability.
          </p>
          <RichTextEditor
            content={introduction}
            onChange={setIntroduction}
            placeholder="Write the full campaign overview, urgency, and public rationale..."
            minHeight="280px"
          />
        </div>
      </div>

      {/* CARD 3: Action Frameworks & Mobilization */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-xl bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center font-bold">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-serif text-[#0B2A4A]">
              3. Strategic Targets, Citizen Steps & Coalitions
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Enter each point on a separate new line.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Strategic Objectives */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#0C57A5]" />
                <span>Strategic Campaign Targets</span>
              </span>
              <span className="text-[10px] text-[#64748B] font-mono">One target per line</span>
            </label>
            <textarea
              rows={4}
              value={objectivesText}
              onChange={(e) => setObjectivesText(e.target.value)}
              placeholder="Enact transparent nomination guidelines for supreme judicial seats&#10;Establish public parliamentary scrutiny hearings&#10;Publish open-source vetting dossiers"
              className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] font-mono leading-relaxed"
            />
          </div>

          {/* Citizen Core Actions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#0C57A5]" />
                <span>Citizen Action Steps</span>
              </span>
              <span className="text-[10px] text-[#64748B] font-mono">One step per line</span>
            </label>
            <textarea
              rows={4}
              value={actionsText}
              onChange={(e) => setActionsText(e.target.value)}
              placeholder="Download the Judicial Integrity Toolkit and citizen submission template&#10;Submit verified testimonies to parliamentary standing committees&#10;Host local civic watch forums in district associations"
              className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] font-mono leading-relaxed"
            />
          </div>

          {/* Partner Networks */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#0C57A5]" />
                <span>Partner Networks & Coalitions</span>
              </span>
              <span className="text-[10px] text-[#64748B] font-mono">One partner per line</span>
            </label>
            <textarea
              rows={3}
              value={partnersText}
              onChange={(e) => setPartnersText(e.target.value)}
              placeholder="National Bar Association Oversight Committee&#10;Transparency & Civil Rights Forum&#10;University Law Faculty Coalitions"
              className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] font-mono leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* CARD 4: Downloadable Campaign Toolkits & PDF Upload Area */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-xl bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-serif text-[#0B2A4A]">
              4. Downloadable Toolkits & PDF Resources
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Upload PDF toolkits, citizen submission guides, and dossiers (max 10 MB each).
            </p>
          </div>
        </div>

        <CampaignResourcesUploader
          resources={resources}
          onChange={setResources}
          maxSizeMB={10}
          label="Campaign PDF Toolkits"
        />
      </div>
    </form>
  );
}
