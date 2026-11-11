'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ImageUploader } from '@/components/dashboard/ImageUploader';
import { Plus, Search, Edit2, Trash2, X, RefreshCw, UserCheck, Users } from 'lucide-react';

export default function DashboardTeamPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields - Clean without predefined data
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [division, setDivision] = useState('');
  const [bio, setBio] = useState('');
  const [focusAreasText, setFocusAreasText] = useState('');
  const [pubCount, setPubCount] = useState<number | string>(0);
  const [avatar, setAvatar] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/team');
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
    setName('');
    setRole('');
    setDivision('');
    setBio('');
    setFocusAreasText('');
    setPubCount(0);
    setAvatar('');
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setName(item.name || '');
    setRole(item.role || '');
    setDivision(item.division || '');
    setBio(item.bio || '');
    setFocusAreasText(Array.isArray(item.focusAreas) ? item.focusAreas.join(', ') : '');
    setPubCount(item.publicationsCount ?? 0);
    setAvatar(item.avatar || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: name.trim(),
      role: role.trim(),
      division: division.trim() || 'General Directorate',
      bio: bio.trim(),
      focusAreas: focusAreasText.split(',').map((s) => s.trim()).filter(Boolean),
      publicationsCount: Number(pubCount) || 0,
      avatar: avatar || null,
    };

    try {
      const url = editingId ? `/api/admin/team/${editingId}` : '/api/admin/team';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save team member');

      setModalOpen(false);
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Error saving team member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (!confirm(`Delete fellow "${memberName}"?`)) return;
    try {
      await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      alert('Failed to delete member');
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase()) ||
      item.division.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Institutional Leadership"
        title="Leadership & Research Fellows"
        description="Manage the directory of senior research fellows, policy directors, and unit leads."
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fellow</span>
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
            placeholder="Search fellows by name or division..."
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0C57A5] mx-auto mb-2" />
            <p className="text-xs text-[#64748B] font-mono">Loading team members...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B]">No fellows found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Fellow / Scholar</th>
                  <th className="py-3.5 px-4 font-bold">Role & Unit</th>
                  <th className="py-3.5 px-4 font-bold">Publications</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0C57A5] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 relative border border-[#E2E8F0]">
                          {item.avatar ? (
                            <Image
                              src={item.avatar}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span>{item.name ? item.name.slice(0, 2).toUpperCase() : 'FL'}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold font-serif text-[#0B2A4A] text-xs">{item.name}</p>
                          <p className="text-[11px] text-[#64748B] line-clamp-1">{item.bio}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-[#1E293B]">{item.role}</p>
                      <p className="text-[11px] text-[#64748B]">{item.division}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#0C57A5] font-bold">
                      {item.publicationsCount || 0} Studies
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-[#0C57A5] hover:bg-[#EAF2FA] cursor-pointer"
                          title="Edit fellow"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Delete fellow"
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
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
              <h3 className="text-xl font-bold font-serif text-[#0B2A4A]">
                {editingId ? 'Edit Fellow Profile' : 'Add Fellow Profile'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-[#64748B] hover:text-[#0B2A4A] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                  Full Name & Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Nazmul Huq"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-serif font-bold text-[#0B2A4A] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                    Role / Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Fellow"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                    Division / Directorate
                  </label>
                  <input
                    type="text"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    placeholder="e.g. Media Research Directorate"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                  />
                </div>
              </div>

              <ImageUploader
                value={avatar}
                onChange={setAvatar}
                label="Fellow Portrait / Photograph"
              />

              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                  Biographical Note <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Provide a biographical summary, research focus, and institutional affiliations..."
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                    Focus Areas (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={focusAreasText}
                    onChange={(e) => setFocusAreasText(e.target.value)}
                    placeholder="e.g. Press Freedom, RTI, Disinformation"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                    Publications Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={pubCount}
                    onChange={(e) => setPubCount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Fellow' : 'Add Fellow'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
