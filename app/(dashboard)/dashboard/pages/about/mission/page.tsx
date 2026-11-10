'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/PageHeader';
import {
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  Compass,
  Award,
  Shield,
  ArrowLeft,
} from 'lucide-react';

export default function AboutMissionPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [coreValues, setCoreValues] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/about');
        const data = await res.json();
        if (data.settings) {
          setMission(data.settings.mission || '');
          setVision(data.settings.vision || '');
        }
        if (data.coreValues) setCoreValues(data.coreValues);
      } catch {
        setError('Failed to load mission and core values');
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
          settings: { mission, vision },
          coreValues,
        }),
      });

      if (!res.ok) throw new Error('Failed to save changes');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || 'Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  const updateValue = (idx: number, field: string, val: string) => {
    const updated = [...coreValues];
    updated[idx][field] = val;
    setCoreValues(updated);
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-[#0C57A5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-[#64748B]">Loading mission & values...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Top Breadcrumb */}
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
        title="Mission, Vision & Core Values"
        description="Configure the guiding institutional mission statement, strategic vision, and core ethical principles."
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
          <span>Mission, Vision & Core Values updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Mission & Vision Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F1F5F9]">
            <Compass className="w-4 h-4 text-[#0C57A5]" />
            <h3 className="font-bold font-serif text-[#0B2A4A] text-sm">Institutional Mission</h3>
          </div>
          <p className="text-xs text-[#64748B]">
            The foundational driving mandate and ongoing operational purpose of IPA.
          </p>
          <textarea
            rows={5}
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] leading-relaxed"
          />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F1F5F9]">
            <Award className="w-4 h-4 text-[#F6B834]" />
            <h3 className="font-bold font-serif text-[#0B2A4A] text-sm">Strategic Vision</h3>
          </div>
          <p className="text-xs text-[#64748B]">
            The long-term transformation IPA seeks to accomplish in civic and public society.
          </p>
          <textarea
            rows={5}
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] leading-relaxed"
          />
        </div>
      </div>

      {/* Core Values Matrix */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
          <div className="p-2 rounded-lg bg-[#0C57A5]/10 text-[#0C57A5]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold font-serif text-[#0B2A4A] text-base">Core Organizational Values</h3>
            <p className="text-xs text-[#64748B]">The guiding ethics defining IPA research standards and dialogue practices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coreValues.map((val, idx) => (
            <div key={val.id || idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase text-[#0C57A5]">
                Ethical Value #{idx + 1}
              </span>
              <div>
                <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">Principle Title</label>
                <input
                  type="text"
                  value={val.title}
                  onChange={(e) => updateValue(idx, 'title', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0B2A4A] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={val.description}
                  onChange={(e) => updateValue(idx, 'description', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#64748B] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
