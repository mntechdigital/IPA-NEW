'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import {
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  Globe,
  Mail,
  Phone,
  MapPin,
  Share2,
} from 'lucide-react';

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

  if (loading) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="w-6 h-6 animate-spin text-[#0C57A5] mx-auto mb-2" />
        <p className="text-xs text-[#64748B] font-mono">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      <PageHeader
        badge="System Administration"
        title="Settings & Global Configuration"
        description="Configure institutional identity, official correspondence channels, and public social media links."
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
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Site settings saved successfully! Changes are live across the Site Footer, Contact page, and Home Hero.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Organization Identity */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-serif text-[#0B2A4A] text-base">1. Site & Organization Identity</h3>
              <p className="text-[11px] text-[#64748B]">Primary institutional name, acronym, and homepage banner tagline.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#EAF2FA] text-[#0C57A5] font-bold self-start sm:self-auto">
            Live on Home Hero & Footers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0B2A4A]">
              Full Organization Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="IPA — Institute of Public Affairs"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0B2A4A]">
              Short Name / Acronym
            </label>
            <input
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              placeholder="IPA"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm font-mono text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#0B2A4A]">
            Institutional Tagline / Slogan
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Building an Informed Society Through Research, Dialogue & Action"
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
          />
          <p className="text-[10px] text-[#64748B]">
            Displayed on the main homepage hero banner and public organization profile.
          </p>
        </div>
      </div>

      {/* 2. Official Contact Info */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-serif text-[#0B2A4A] text-base">2. Official Contact Coordinates</h3>
              <p className="text-[11px] text-[#64748B]">Central secretariat inbox, public phone, and physical address.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#EAF2FA] text-[#0C57A5] font-bold self-start sm:self-auto">
            Live on Site Footer & /contact
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#0C57A5]" />
              <span>Contact Email</span>
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="info@ipa.org.bd"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B2A4A] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#0C57A5]" />
              <span>Phone Number</span>
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+880 (2) 987-6543"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#0B2A4A] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0C57A5]" />
            <span>Central Secretariat Street Address</span>
          </label>
          <input
            type="text"
            value={contactAddress}
            onChange={(e) => setContactAddress(e.target.value)}
            placeholder="House 42, Road 11, Banani, Dhaka-1213, Bangladesh"
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
          />
        </div>
      </div>

      {/* 3. Social Media Links */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-serif text-[#0B2A4A] text-base">3. Official Social Profiles</h3>
              <p className="text-[11px] text-[#64748B]">External institutional channels displayed in the site footer.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#EAF2FA] text-[#0C57A5] font-bold self-start sm:self-auto">
            Live on Site Footer
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">Facebook</label>
            <input
              type="text"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/ipa.bangladesh"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">Twitter / X</label>
            <input
              type="text"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              placeholder="https://x.com/ipa_bangladesh"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">LinkedIn</label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/company/ipa-bangladesh"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E293B]">YouTube</label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/@ipa_bangladesh"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
