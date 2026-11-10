"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import {
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  Video,
  Play,
} from "lucide-react";

function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  const match = url
    .trim()
    .match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
    );
  return match && match[1]
    ? `https://www.youtube-nocookie.com/embed/${match[1]}`
    : null;
}

export default function HeroPageController() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [tagline, setTagline] = useState("");
  const [editorialLead, setEditorialLead] = useState("");
  const [heroImage, setHeroImage] = useState("/images/hero_public_dialogue.jpg");
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [heroVideoActive, setHeroVideoActive] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/home");
        const data = await res.json();
        if (data.settings) {
          setTagline(data.settings.tagline || "");
          setEditorialLead(data.settings.editorialLead || "");
          setHeroImage(
            data.settings.heroImage || "/images/hero_public_dialogue.jpg"
          );
          setHeroVideoUrl(data.settings.heroVideoUrl || "");
          setHeroVideoActive(Boolean(data.settings.heroVideoActive));
        }
      } catch {
        setError("Failed to load hero settings from database");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            tagline,
            editorialLead,
            heroImage,
            heroVideoUrl,
            heroVideoActive,
          },
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to save hero settings");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || "Error saving changes");
    } finally {
      setSaving(false);
    }
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(heroVideoUrl);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-3 border-[#0C57A5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-mono text-[#64748B]">Loading Hero & Media Controller...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Back navigation */}
      <div>
        <Link
          href="/dashboard/pages/home"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0C57A5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home Page Sections</span>
        </Link>
      </div>

      {/* Page Header */}
      <PageHeader
        badge="Section Controller"
        title="Hero Masthead & Multimedia"
        description="Configure display headlines, editorial mission copy, cover photograph, and optional YouTube documentary video presentation."
        action={
          <button
            onClick={() => handleSave()}
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
            <span>{saving ? "Saving..." : success ? "Saved!" : "Save Changes"}</span>
          </button>
        }
      />

      {/* Feedback alerts */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Hero and multimedia assets saved & synced to live database!</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-emerald-700 hover:text-emerald-900 underline text-xs font-bold inline-flex items-center gap-1"
          >
            View Live Site
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-6">
        {/* Headlines */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B] mb-1.5">
              Main Display Tagline / Headline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Building an Informed Society Through Research, Dialogue & Action"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B] mb-1.5">
              Editorial Mission Intro Paragraph
            </label>
            <textarea
              rows={3}
              value={editorialLead}
              onChange={(e) => setEditorialLead(e.target.value)}
              placeholder="IPA — Institute of Public Affairs empowers citizens, newsrooms, and grassroots communities..."
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-[#E2E8F0]">
          {/* Cover Photo */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold font-serif text-[#0B2A4A]">
                  Hero Cover Photograph
                </h4>
                <p className="text-[11px] text-[#64748B]">
                  Featured image composition rendered in the warm golden frame
                </p>
              </div>
            </div>

            <ImageUploader
              value={heroImage}
              onChange={(url) => setHeroImage(url)}
              label="Select or Upload Hero Image"
              hideUrlInput={true}
            />
          </div>

          {/* YouTube Video Controller */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#E85338]" />
                  <div>
                    <h4 className="text-xs font-bold font-serif text-[#0B2A4A]">
                      YouTube Video Presentation
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      Modal documentary player in hero section
                    </p>
                  </div>
                </div>

                {/* Video Switch Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#64748B]">
                    {heroVideoActive ? "Enabled" : "Disabled"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHeroVideoActive(!heroVideoActive)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                      heroVideoActive ? "bg-[#0C57A5]" : "bg-slate-300"
                    }`}
                    aria-pressed={heroVideoActive}
                    aria-label="Toggle YouTube video in Hero"
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-xs ${
                        heroVideoActive ? "translate-x-4.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B] mb-1.5">
                  YouTube Video Link
                </label>
                <input
                  type="text"
                  value={heroVideoUrl}
                  onChange={(e) => setHeroVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                />
                <p className="text-[10px] text-[#64748B] mt-1.5 leading-relaxed">
                  If empty or disabled, the &quot;Watch Video Presentation&quot; button will not be displayed on the public hero.
                </p>
              </div>
            </div>

            {/* Video preview */}
            {youtubeEmbedUrl ? (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-[#0B2A4A]">
                  <span>Player Preview:</span>
                  <span className="text-emerald-700 text-[10px] font-mono font-semibold">
                    Valid YouTube Link
                  </span>
                </div>
                <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden bg-black border border-[#E2E8F0] shadow-inner">
                  <iframe
                    src={youtubeEmbedUrl}
                    title="YouTube Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            ) : heroVideoUrl ? (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Please enter a valid YouTube link (e.g. https://youtu.be/VIDEO_ID)</span>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-[#CBD5E1] bg-white text-center text-xs text-[#94A3B8]">
                No video configured. The hero section displays in photo mode only.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
