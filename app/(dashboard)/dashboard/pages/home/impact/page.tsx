"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  BarChart2,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

export default function ImpactPageController() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [impactIndicators, setImpactIndicators] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/admin/home");
        const data = await res.json();
        if (data.impactIndicators) setImpactIndicators(data.impactIndicators);
      } catch {
        setError("Failed to load impact indicators from database");
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
        body: JSON.stringify({ impactIndicators }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to save impact indicators");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || "Error saving changes");
    } finally {
      setSaving(false);
    }
  };

  const updateImpactIndicator = (index: number, field: string, val: string) => {
    const updated = [...impactIndicators];
    updated[index][field] = val;
    setImpactIndicators(updated);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-3 border-[#0C57A5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-mono text-[#64748B]">Loading Impact Indicators...</p>
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
        title="Impact Indicators & Metrics"
        description="Configure the audited numerical benchmarks and explanatory descriptors displayed in the prominent Impact section of the homepage."
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
            <span>Impact metrics saved & synced to live database!</span>
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

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
        {impactIndicators.map((ind, idx) => (
          <div
            key={ind.id || idx}
            className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-2xs space-y-4 hover:border-[#0C57A5]/40 transition-colors"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <span className="text-xs font-mono font-bold uppercase text-[#0C57A5] bg-[#EAF2FA] px-2.5 py-1 rounded-lg">
                Benchmark #{idx + 1}
              </span>
              <span className="text-xs text-[#64748B] font-mono">
                Audited Metric
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1.5 uppercase tracking-wider">
                Audited Value / Figure
              </label>
              <input
                type="text"
                value={ind.value}
                onChange={(e) =>
                  updateImpactIndicator(idx, "value", e.target.value)
                }
                placeholder="e.g. 100K+"
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-lg font-bold font-serif text-[#0B2A4A] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1.5 uppercase tracking-wider">
                Label / Headline
              </label>
              <input
                type="text"
                value={ind.label}
                onChange={(e) =>
                  updateImpactIndicator(idx, "label", e.target.value)
                }
                placeholder="e.g. Citizens Reached"
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1.5 uppercase tracking-wider">
                Descriptor Narrative
              </label>
              <textarea
                rows={3}
                value={ind.descriptor}
                onChange={(e) =>
                  updateImpactIndicator(idx, "descriptor", e.target.value)
                }
                placeholder="Explanatory sentence describing what this metric measures..."
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
