'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ImageUploader } from '@/components/dashboard/ImageUploader';
import { Save, Check, AlertCircle, RefreshCw, Globe, Mail, Phone, MapPin, Share2, UploadCloud, Copy } from 'lucide-react';

export default function DashboardSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // General Settings
  const [siteName, setSiteName] = useState('');
  const [shortName, setShortName] = useState('');
  const [tagline, setTagline] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // Media Sandbox Uploader
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.settings) {
        setSiteName(data.settings.siteName || '');
        setShortName(data.settings.shortName || '');
        setTagline(data.settings.tagline || '');
        setContactEmail(data.settings.contactEmail || '');
        setContactPhone(data.settings.contactPhone || '');
        setContactAddress(data.settings.contactAddress || '');
        setFacebookUrl(data.settings.facebookUrl || '');
        setTwitterUrl(data.settings.twitterUrl || '');
        setLinkedinUrl(data.settings.linkedinUrl || '');
        setYoutubeUrl(data.settings.youtubeUrl || '');
      }
    } catch {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName,
          shortName,
          tagline,
          contactEmail,
          contactPhone,
          contactAddress,
          facebookUrl,
          twitterUrl,
          linkedinUrl,
          youtubeUrl,
        }),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const copyUploadedUrl = () => {
    if (!uploadedUrl) return;
    navigator.clipboard.writeText(uploadedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="w-6 h-6 animate-spin text-[#0C57A5] mx-auto mb-2" />
        <p className="text-xs text-[#64748B] font-mono">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        badge="System Administration"
        title="Settings & Media Storage"
        description="Configure institutional identity, official correspondence channels, and test upload assets via media storage."
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold shadow-md transition-colors cursor-pointer disabled:opacity-60"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        }
      />

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Site settings saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Media Uploader Tool */}
      <div className="bg-white p-6 rounded-2xl border border-[#0C57A5]/30 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
          <div className="p-2 rounded-lg bg-[#EAF2FA] text-[#0C57A5]">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold font-serif text-[#0B2A4A] text-base">Media Asset Uploader</h3>
            <p className="text-xs text-[#64748B]">Direct upload to institutional cloud storage (<code>ipa_portal</code>)</p>
          </div>
        </div>

        <ImageUploader
          value={uploadedUrl}
          onChange={setUploadedUrl}
          label="Select File To Upload"
        />

        {uploadedUrl && (
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between gap-3">
            <span className="text-xs font-mono text-[#0B2A4A] truncate">{uploadedUrl}</span>
            <button
              onClick={copyUploadedUrl}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold hover:bg-[#EAF2FA] text-[#0C57A5] flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Media URL'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Organization Identity */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
          <Globe className="w-4 h-4 text-[#0C57A5]" />
          <h3 className="font-bold font-serif text-[#0B2A4A] text-sm">Site Identity</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
              Full Organization Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
              Short Name / Acronym
            </label>
            <input
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
            Institutional Tagline
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B]"
          />
        </div>
      </div>

      {/* Official Contact Info */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
          <Mail className="w-4 h-4 text-[#0C57A5]" />
          <h3 className="font-bold font-serif text-[#0B2A4A] text-sm">Official Contact Channels</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
            Physical Headquarters Address
          </label>
          <input
            type="text"
            value={contactAddress}
            onChange={(e) => setContactAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
          <Share2 className="w-4 h-4 text-[#0C57A5]" />
          <h3 className="font-bold font-serif text-[#0B2A4A] text-sm">Official Social Profiles</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Facebook</label>
            <input
              type="text"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Twitter / X</label>
            <input
              type="text"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              placeholder="https://x.com/..."
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">LinkedIn</label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/company/..."
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">YouTube</label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/@..."
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
