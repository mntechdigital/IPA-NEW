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
  Newspaper,
  FileText,
  Sparkles,
  Calendar,
  MapPin,
  Tag,
} from 'lucide-react';

const CATEGORIES = ['News', 'Events', 'Press Releases', 'Announcements'] as const;

interface NewsFormProps {
  initialId?: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

export function NewsForm({ initialId }: NewsFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Identity & Meta
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [category, setCategory] = useState<string>('News');
  const [date, setDate] = useState('');
  const [existingReadTime, setExistingReadTime] = useState('');
  const [location, setLocation] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [topicsText, setTopicsText] = useState('');

  // Content
  const [summary, setSummary] = useState('');
  const [richContent, setRichContent] = useState('');

  // Auto-generate slug from title unless manually modified
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

  // Fetch initial article if editing
  useEffect(() => {
    if (!initialId) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/news/${initialId}`);
        const data = await res.json();
        if (!res.ok || !data.item) {
          throw new Error(data.error || 'Failed to load article data');
        }

        const item = data.item;
        setTitle(item.title || '');
        setSlug(item.slug || '');
        setIsCustomSlug(Boolean(item.slug));
        setCategory(item.category || 'News');
        setDate(item.date || '');
        setExistingReadTime(item.readTime || '');
        setLocation(item.location || '');
        setCoverImage(item.coverImage || '');
        setSummary(item.summary || '');

        // Topics
        if (Array.isArray(item.relatedTopics)) {
          setTopicsText(item.relatedTopics.join(', '));
        } else if (typeof item.relatedTopics === 'string') {
          setTopicsText(item.relatedTopics);
        }

        // Content
        if (Array.isArray(item.content)) {
          setRichContent(item.content.join('\n\n'));
        } else if (typeof item.content === 'string') {
          setRichContent(item.content);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error loading article details');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [initialId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter an article title.');
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

    // Auto-derive summary if empty from rich content
    let finalSummary = summary.trim();
    if (!finalSummary && richContent) {
      const stripped = stripHtml(richContent);
      finalSummary = stripped.length > 200 ? stripped.slice(0, 197) + '...' : stripped;
    }

    if (!finalSummary) {
      setErrorMessage('Please provide a short summary for listings and card previews.');
      return;
    }

    // Wrap richContent into an array if string, or split if plain text without HTML
    let finalContent: string[] = [];
    if (richContent.trim()) {
      if (/<[a-z][\s\S]*>/i.test(richContent)) {
        finalContent = [richContent.trim()];
      } else {
        finalContent = richContent.split('\n\n').map((s) => s.trim()).filter(Boolean);
      }
    }

    const relatedTopics = topicsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Auto-calculate read time based on word count
    const strippedRich = stripHtml(richContent);
    const totalWords = (finalSummary + ' ' + strippedRich).trim().split(/\s+/).filter(Boolean).length;
    const computedReadTime = `${Math.max(1, Math.ceil(totalWords / 200))} min read`;
    const finalReadTime = existingReadTime || computedReadTime;

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      category,
      date: date.trim() || new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
      readTime: finalReadTime,
      location: location.trim() || null,
      coverImage,
      summary: finalSummary,
      content: finalContent,
      relatedTopics,
      published: true,
    };

    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/news/${initialId}` : '/api/admin/news';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save article');
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push('/dashboard/news');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while saving article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-16 text-center space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-[#0C57A5] mx-auto" />
        <p className="text-sm text-[#64748B] font-mono">Loading dispatch...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-2xs">
        <div className="space-y-1">
          <Link
            href="/dashboard/news"
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#0C57A5] transition-colors mb-1 font-mono font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Dispatches</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#0B2A4A]">
              {isEdit ? 'Edit Press Release' : 'Publish New Dispatch'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAF2FA] text-[#0C57A5]">
              {category}
            </span>
          </div>
          <p className="text-xs text-[#64748B]">
            {isEdit
              ? 'Refine article body, publication dates, and media attachments.'
              : 'Draft and publish official institutional statements and media articles.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {slug && (
            <Link
              href={`/news/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#64748B] hover:text-[#0B2A4A] hover:bg-[#F8FAFD] transition-colors"
              title="Preview on live site"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live View</span>
            </Link>
          )}

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
                <span>{isEdit ? 'Save Changes' : 'Publish Article'}</span>
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

      {/* CARD 1: Identity & Presentation */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-xl bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center font-bold">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-serif text-[#0B2A4A]">
              1. Article Metadata & Placement
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Primary headlines, news category, timestamps, and cover photograph.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A] flex items-center gap-1.5">
              <span>Headline Title</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. National Symposium on Judicial Integrity Concludes with 12 Reform Recommendations"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] font-serif font-bold"
            />
          </div>

          {/* Slug */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A] flex items-center justify-between">
              <span>URL Slug</span>
              <span className="text-[10px] text-[#64748B] font-mono">
                /news/<span className="text-[#0C57A5]">{slug || 'article-slug'}</span>
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
              placeholder="article-url-slug"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#0C57A5]" />
              <span>Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Publication Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0C57A5]" />
              <span>Publication Date</span>
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. October 2026 or October 24, 2026"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0C57A5]" />
              <span>Event / Dispatch Location</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Dhaka, Bangladesh"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>

          {/* Related Themes / Topics */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A]">
              Related Themes / Tags (comma-separated)
            </label>
            <input
              type="text"
              value={topicsText}
              onChange={(e) => setTopicsText(e.target.value)}
              placeholder="e.g. Judicial Reform, Citizen Rights, Press Freedom, Transparency"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>

          {/* Cover Image */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-[#0B2A4A]">
              Featured Cover Image
            </label>
            <ImageUploader
              value={coverImage}
              onChange={setCoverImage}
              label="Article Hero Photograph"
            />
          </div>
        </div>
      </div>

      {/* CARD 2: Article Narrative & Rich Content */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
          <div className="w-8 h-8 rounded-xl bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-serif text-[#0B2A4A]">
              2. Article Narrative & Content
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Lead summary statement and rich formatted body text (headings, bullet points, blockquotes).
            </p>
          </div>
        </div>

        {/* Lead Summary */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0B2A4A] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0C57A5]" />
              <span>Executive Lead / Summary</span>
              <span className="text-red-500">*</span>
            </span>
            <span className="text-[11px] text-[#64748B] font-mono">
              Displayed as dropcap lead & on article cards
            </span>
          </label>
          <textarea
            required
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="A concise 2-3 sentence overview introducing the dispatch or announcement..."
            className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] leading-relaxed"
          />
        </div>

        {/* Rich Text Editor */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#0B2A4A]">
            Full Article Body (Rich Text)
          </label>
          <p className="text-[11px] text-[#64748B]">
            Format paragraphs with headings, bold text, links, blockquotes, and lists for public readability.
          </p>
          <RichTextEditor
            content={richContent}
            onChange={setRichContent}
            placeholder="Write the comprehensive article dispatch here..."
            minHeight="260px"
          />
        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E2E8F0] shadow-lg flex items-center justify-between gap-4">
        <div className="text-xs text-[#64748B]">
          {isEdit ? (
            <span>Editing article: <strong className="text-[#0B2A4A]">{title || 'Untitled'}</strong></span>
          ) : (
            <span>Ready to publish new article to the public newsroom</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/news"
            className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-medium text-[#64748B] hover:text-[#0B2A4A] hover:bg-[#F8FAFD] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || saveSuccess}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-300" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{isEdit ? 'Save Changes' : 'Publish Article'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
