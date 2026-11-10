'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ImageUploader } from '@/components/dashboard/ImageUploader';
import { Plus, Search, Edit2, Trash2, X, RefreshCw, Layers } from 'lucide-react';

export default function DashboardProgramsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [status, setStatus] = useState('Ongoing');
  const [category, setCategory] = useState('Public Awareness & Education');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [overview, setOverview] = useState('');
  const [objectivesText, setObjectivesText] = useState('');
  const [activitiesText, setActivitiesText] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [outcomesText, setOutcomesText] = useState('');
  const [leadFellow, setLeadFellow] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/programs');
      const data = await res.json();
      if (data.items) setItems(data.items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setSubtitle('');
    setStatus('Ongoing');
    setCategory('Public Awareness & Education');
    setDescription('');
    setCoverImage('');
    setOverview('');
    setObjectivesText('');
    setActivitiesText('');
    setTargetAudience('Community activists, researchers, university students');
    setOutcomesText('');
    setLeadFellow('IPA Program Directorate');
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSlug(item.slug);
    setSubtitle(item.subtitle);
    setStatus(item.status);
    setCategory(item.category);
    setDescription(item.description);
    setCoverImage(item.coverImage || '');
    setOverview(item.overview || '');
    setObjectivesText(Array.isArray(item.objectives) ? item.objectives.join('\n') : '');
    setActivitiesText(Array.isArray(item.activities) ? item.activities.join('\n') : '');
    setTargetAudience(item.targetAudience);
    setOutcomesText(Array.isArray(item.expectedOutcomes) ? item.expectedOutcomes.join('\n') : '');
    setLeadFellow(item.leadFellow);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      subtitle,
      status,
      category,
      description,
      coverImage,
      overview: overview || description,
      objectives: objectivesText.split('\n').map((s) => s.trim()).filter(Boolean),
      activities: activitiesText.split('\n').map((s) => s.trim()).filter(Boolean),
      targetAudience,
      expectedOutcomes: outcomesText.split('\n').map((s) => s.trim()).filter(Boolean),
      leadFellow,
    };

    try {
      const url = editingId ? `/api/admin/programs/${editingId}` : '/api/admin/programs';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save program');

      setModalOpen(false);
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Error saving program');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete program "${name}"?`)) return;
    try {
      await fetch(`/api/admin/programs/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      alert('Failed to delete program');
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Institutional Initiatives"
        title="Programs & Initiatives"
        description="Organize, publish, and schedule civic education and media literacy programs."
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Program</span>
          </button>
        }
      />

      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs..."
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0C57A5] mx-auto mb-2" />
            <p className="text-xs text-[#64748B] font-mono">Loading programs...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B]">No programs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Program</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Lead Fellow</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F1F5F9] relative flex-shrink-0 border border-[#E2E8F0] flex items-center justify-center">
                          {item.coverImage ? (
                            <Image src={item.coverImage} alt={item.title} fill className="object-cover" />
                          ) : (
                            <Layers className="w-5 h-5 text-[#94A3B8]" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold font-serif text-[#0B2A4A] text-xs">{item.title}</p>
                          <p className="text-[11px] text-[#64748B] line-clamp-1">{item.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#1E293B]">{item.category}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAF2FA] text-[#0C57A5]">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] text-[11px]">{item.leadFellow}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-[#0C57A5] hover:bg-[#EAF2FA]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
              <h3 className="text-xl font-bold font-serif text-[#0B2A4A]">
                {editingId ? 'Edit Program' : 'New Program'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-2 text-[#64748B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                  Program Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-serif font-bold text-[#0B2A4A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                  >
                    <option>Ongoing</option>
                    <option>Upcoming</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                />
              </div>

              <ImageUploader value={coverImage} onChange={setCoverImage} label="Cover Image" />

              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                    Objectives (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={objectivesText}
                    onChange={(e) => setObjectivesText(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                    Activities (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={activitiesText}
                    onChange={(e) => setActivitiesText(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">Lead Fellow</label>
                  <input
                    type="text"
                    value={leadFellow}
                    onChange={(e) => setLeadFellow(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Program' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
