"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  Megaphone,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AnnouncementPageController() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [announcementActive, setAnnouncementActive] = useState(true);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementLinkText, setAnnouncementLinkText] = useState("");
  const [announcementHref, setAnnouncementHref] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/home");
        const data = await res.json();
        if (data.settings) {
          setAnnouncementActive(data.settings.announcementActive !== false);
          setAnnouncementText(data.settings.announcementText || "");
          setAnnouncementLinkText(data.settings.announcementLinkText || "");
          setAnnouncementHref(data.settings.announcementHref || "");
        }
      } catch {
        setError("Failed to load announcement settings from database");
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
            announcementActive,
            announcementText,
            announcementLinkText,
            announcementHref,
          },
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to save announcement settings");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || "Error saving changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-3 border-[#0C57A5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-mono text-[#64748B]">Loading Announcement Controller...</p>
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
        title="Top Announcement Ticker"
        description="Configure the site-wide institutional ticker banner displayed at the very top of all public pages, with independent on/off display control."
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
            <span>Announcement settings saved & synced to live database!</span>
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
        {/* Toggle Switch */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                announcementActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {announcementActive ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold font-serif text-[#0B2A4A]">
                Display Status on Website
              </h4>
              <p className="text-xs text-[#64748B]">
                {announcementActive
                  ? "Active — Currently visible at the top of all public pages"
                  : "Inactive — Currently hidden from the website"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <span
              className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded-full ${
                announcementActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {announcementActive ? "Active" : "Disabled"}
            </span>

            <button
              type="button"
              onClick={() => setAnnouncementActive(!announcementActive)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                announcementActive ? "bg-[#0C57A5]" : "bg-slate-300"
              }`}
              aria-pressed={announcementActive}
              aria-label="Toggle Announcement visibility"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                  announcementActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B] mb-1.5">
              Announcement Message
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g. Now Available: Annual Report on Media Landscape & Public Trust in Bangladesh"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Link Button Label
              </label>
              <input
                type="text"
                value={announcementLinkText}
                onChange={(e) => setAnnouncementLinkText(e.target.value)}
                placeholder="e.g. Read Publication"
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Target Route / URL
              </label>
              <input
                type="text"
                value={announcementHref}
                onChange={(e) => setAnnouncementHref(e.target.value)}
                placeholder="/research/media-landscape-public-trust-bangladesh"
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
              />
            </div>
          </div>
        </div>

        {/* Live Visual Preview */}
        <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-semibold text-[#1E293B]">Live Website Banner Preview:</span>
            {!announcementActive && (
              <span className="text-amber-600 font-mono text-[11px]">
                (Preview only — Banner is currently disabled on live site)
              </span>
            )}
          </div>

          <div
            className={`rounded-2xl p-3 border transition-opacity ${
              announcementActive
                ? "bg-[#0B2A4A] text-slate-200 border-[#0C57A5]/40"
                : "bg-slate-800 text-slate-400 border-slate-700 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#F6B834] font-bold shrink-0">
                  Announcement
                </span>
                <span className="text-blue-300">·</span>
                <p className="truncate text-blue-100 text-xs">
                  {announcementText || "No announcement text entered yet..."}
                </p>
              </div>

              <div className="inline-flex items-center gap-1 text-white font-medium text-xs whitespace-nowrap shrink-0">
                <span>{announcementLinkText || "Learn More"}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F6B834]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
