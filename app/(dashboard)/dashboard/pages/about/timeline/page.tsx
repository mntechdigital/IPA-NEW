'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/PageHeader';
import {
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  ArrowLeft,
  Clock,
  Calendar,
} from 'lucide-react';

interface Milestone {
  year: string;
  title: string;
  desc: string;
}

export default function AboutTimelinePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/about');
        const data = await res.json();
        if (data.aboutSettings && Array.isArray(data.aboutSettings.milestones)) {
          setMilestones(data.aboutSettings.milestones);
        }
      } catch {
        setError('Failed to load timeline milestones');
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
            milestones,
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to save milestones');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || 'Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        year: new Date().getFullYear().toString(),
        title: 'New Milestone Initiative',
        desc: 'Description of key developmental achievement or institutional milestone.',
      },
    ]);
  };

  const updateMilestone = (idx: number, field: keyof Milestone, value: string) => {
    const updated = [...milestones];
    updated[idx] = { ...updated[idx], [field]: value };
    setMilestones(updated);
  };

  const removeMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-[#0C57A5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-[#64748B]">Loading timeline milestones...</p>
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
        title="Developmental Milestones Timeline"
        description="Configure the chronological history and milestones displayed on the institutional timeline."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={addMilestone}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#0C57A5] text-xs font-bold text-[#0B2A4A] transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#0C57A5]" />
              <span>Add Milestone</span>
            </button>
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
          </div>
        }
      />

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Milestones timeline saved and live on the About page!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Milestones Card List */}
      <div className="space-y-4">
        {milestones.length === 0 ? (
          <div className="p-12 text-center bg-white border border-dashed border-[#CBD5E1] rounded-2xl">
            <Clock className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#0B2A4A]">No Milestones Recorded</p>
            <p className="text-xs text-[#64748B] mt-1 mb-4">Click below to add your first milestone event.</p>
            <button
              onClick={addMilestone}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0C57A5] text-white text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Milestone</span>
            </button>
          </div>
        ) : (
          milestones.map((milestone, idx) => (
            <div
              key={idx}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4 transition-all hover:border-[#0C57A5]/40"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0C57A5]/10 text-[#0C57A5] flex items-center justify-center font-mono font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <span className="text-xs font-bold text-[#0B2A4A]">Timeline Event</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeMilestone(idx)}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                    Year / Era
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={milestone.year}
                      onChange={(e) => updateMilestone(idx, 'year', e.target.value)}
                      placeholder="e.g. 2026"
                      className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono font-bold text-[#0C57A5] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                    Milestone Title
                  </label>
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(idx, 'title', e.target.value)}
                    placeholder="Headline for this milestone"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0B2A4A] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Narrative Description
                </label>
                <textarea
                  rows={3}
                  value={milestone.desc}
                  onChange={(e) => updateMilestone(idx, 'desc', e.target.value)}
                  placeholder="Detail the developments and achievements in this milestone"
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
