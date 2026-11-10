'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ImageUploader } from '@/components/dashboard/ImageUploader';
import { Plus, Search, Edit2, Trash2, X, RefreshCw, Megaphone } from 'lucide-react';

export default function DashboardCampaignsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [status, setStatus] = useState('Active Campaign');
  const [coverImage, setCoverImage] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [objectivesText, setObjectivesText] = useState('');
  const [actionsText, setActionsText] = useState('');
  const [partnersText, setPartnersText] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/campaigns');
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
    setTagline('');
    setStatus('Active Campaign');
    setCoverImage('');
    setIntroduction('');
    setWhyItMatters('');
    setObjectivesText('');
    setActionsText('');
    setPartnersText('');
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSlug(item.slug);
    setTagline(item.tagline);
    setStatus(item.status);
    setCoverImage(item.coverImage || '');
    setIntroduction(item.introduction);
    setWhyItMatters(item.whyItMatters);
    setObjectivesText(Array.isArray(item.objectives) ? item.objectives.join('\n') : '');
    setActionsText(Array.isArray(item.coreActions) ? item.coreActions.join('\n') : '');
    setPartnersText(Array.isArray(item.partnerNetworks) ? item.partnerNetworks.join('\n') : '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      tagline,
      status,
      coverImage,
      introduction,
      whyItMatters: whyItMatters || introduction,
      objectives: objectivesText.split('\n').map((s) => s.trim()).filter(Boolean),
      coreActions: actionsText.split('\n').map((s) => s.trim()).filter(Boolean),
      partnerNetworks: partnersText.split('\n').map((s) => s.trim()).filter(Boolean),
    };

    try {
      const url = editingId ? `/api/admin/campaigns/${editingId}` : '/api/admin/campaigns';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save campaign');

      setModalOpen(false);
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Error saving campaign');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete campaign "${name}"?`)) return;
    try {
      await fetch(`/api/admin/campaigns/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      alert('Failed to delete campaign');
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.tagline.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Advocacy & Public Mobilization"
        title="Public Campaigns"
        description="Oversee nationwide public interest initiatives, digital literacy movements, and community oversight toolkits."
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Campaign</span>
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
            placeholder="Search campaigns..."
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0C57A5] mx-auto mb-2" />
            <p className="text-xs text-[#64748B] font-mono">Loading campaigns...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B]">No campaigns found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Campaign</th>
                  <th className="py-3.5 px-4 font-bold">Tagline</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
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
                            <Megaphone className="w-5 h-5 text-[#94A3B8]" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold font-serif text-[#0B2A4A] text-xs">{item.title}</p>
                          <p className="text-[11px] text-[#64748B] line-clamp-1">{item.introduction}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#1E293B] max-w-xs truncate">{item.tagline}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FDE8B5] text-[#0B2A4A]">
                        {item.status}
                      </span>
                    </td>
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
                {editingId ? 'Edit Campaign' : 'New Campaign'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-2 text-[#64748B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                  Campaign Title
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
                    <option>Active Campaign</option>
                    <option>Archived</option>
                    <option>Upcoming</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                />
              </div>

              <ImageUploader value={coverImage} onChange={setCoverImage} label="Campaign Cover" />

              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">Introduction</label>
                <textarea
                  rows={3}
                  required
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">Why It Matters</label>
                <textarea
                  rows={3}
                  value={whyItMatters}
                  onChange={(e) => setWhyItMatters(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                    Core Actions (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={actionsText}
                    onChange={(e) => setActionsText(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                    Partner Networks (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={partnersText}
                    onChange={(e) => setPartnersText(e.target.value)}
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
                  {saving ? 'Saving...' : editingId ? 'Update Campaign' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
