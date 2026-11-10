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
  Handshake,
  Building2,
} from 'lucide-react';

export default function AboutCollaboratorsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [collaborators, setCollaborators] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/about');
        const data = await res.json();
        if (data.aboutSettings && Array.isArray(data.aboutSettings.collaborators)) {
          setCollaborators(data.aboutSettings.collaborators);
        }
      } catch {
        setError('Failed to load collaborators');
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
            collaborators: collaborators.filter((c) => c.trim().length > 0),
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to save collaborators');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || 'Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  const addCollaborator = () => {
    setCollaborators([...collaborators, 'New Partner Organization']);
  };

  const updateCollaborator = (idx: number, value: string) => {
    const updated = [...collaborators];
    updated[idx] = value;
    setCollaborators(updated);
  };

  const removeCollaborator = (idx: number) => {
    setCollaborators(collaborators.filter((_, i) => i !== idx));
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-[#0C57A5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-[#64748B]">Loading collaborators...</p>
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
        title="Academic & Civil Society Collaborators"
        description="Manage the institutional partners, press club federations, and university networks featured on the About page."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={addCollaborator}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#0C57A5] text-xs font-bold text-[#0B2A4A] transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#0C57A5]" />
              <span>Add Partner</span>
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
          <span>Collaborators network updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Collaborators Grid */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <Handshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-serif text-[#0B2A4A] text-base">Network Partners</h3>
              <p className="text-xs text-[#64748B]">These organizations render in the Collaborators grid on the About page</p>
            </div>
          </div>
          <span className="font-mono text-xs text-[#64748B] font-bold">
            {collaborators.length} Total
          </span>
        </div>

        {collaborators.length === 0 ? (
          <div className="p-12 text-center bg-white border border-dashed border-[#CBD5E1] rounded-2xl">
            <Building2 className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#0B2A4A]">No Collaborators Added</p>
            <p className="text-xs text-[#64748B] mt-1 mb-4">Click below to add your first partner organization.</p>
            <button
              onClick={addCollaborator}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0C57A5] text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Partner</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {collaborators.map((name, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0C57A5]/40 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shrink-0">
                  <Building2 className="w-3.5 h-3.5 text-[#0C57A5]" />
                </div>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => updateCollaborator(idx, e.target.value)}
                  placeholder="Partner organization name"
                  className="flex-1 bg-transparent text-xs font-semibold text-[#0B2A4A] focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => removeCollaborator(idx)}
                  title="Remove collaborator"
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
