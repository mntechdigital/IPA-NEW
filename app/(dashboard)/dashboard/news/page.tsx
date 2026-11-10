'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ImageUploader } from '@/components/dashboard/ImageUploader';
import { Plus, Search, Edit2, Trash2, X, RefreshCw, Newspaper } from 'lucide-react';

export default function DashboardNewsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('News');
  const [date, setDate] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [summary, setSummary] = useState('');
  const [location, setLocation] = useState('');
  const [readTime, setReadTime] = useState('4 min read');
  const [contentText, setContentText] = useState('');
  const [topicsText, setTopicsText] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/news');
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
    setCategory('News');
    setDate('November 2026');
    setCoverImage('');
    setSummary('');
    setLocation('Dhaka, Bangladesh');
    setReadTime('4 min read');
    setContentText('');
    setTopicsText('Public Policy, Civic Affairs, Media Research');
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSlug(item.slug);
    setCategory(item.category);
    setDate(item.date);
    setCoverImage(item.coverImage || '');
    setSummary(item.summary);
    setLocation(item.location || '');
    setReadTime(item.readTime);
    setContentText(Array.isArray(item.content) ? item.content.join('\n\n') : '');
    setTopicsText(Array.isArray(item.relatedTopics) ? item.relatedTopics.join(', ') : '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category,
      date,
      coverImage,
      summary,
      location,
      readTime,
      content: contentText.split('\n\n').map((s) => s.trim()).filter(Boolean),
      relatedTopics: topicsText.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      const url = editingId ? `/api/admin/news/${editingId}` : '/api/admin/news';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save news article');

      setModalOpen(false);
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Error saving article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete article "${name}"?`)) return;
    try {
      await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      alert('Failed to delete news article');
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
        badge="Press & Newsroom"
        title="News & Media Releases"
        description="Publish institutional press statements, symposium announcements, and public statements."
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Press Release</span>
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
            placeholder="Search news & press..."
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0C57A5] mx-auto mb-2" />
            <p className="text-xs text-[#64748B] font-mono">Loading press updates...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B]">No news articles found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Article Title</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Date & Location</th>
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
                            <Newspaper className="w-5 h-5 text-[#94A3B8]" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold font-serif text-[#0B2A4A] text-xs">{item.title}</p>
                          <p className="text-[11px] text-[#64748B] line-clamp-1">{item.summary}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAF2FA] text-[#0C57A5]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] text-[11px]">
                      <p className="font-medium text-[#1E293B]">{item.date}</p>
                      <p>{item.location || 'Dhaka'}</p>
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
                {editingId ? 'Edit Press Release' : 'New Press Release'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-2 text-[#64748B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                  Article Title
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
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                  >
                    <option>News</option>
                    <option>Events</option>
                    <option>Press Releases</option>
                    <option>Announcements</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="October 28, 2026"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Dhaka, Bangladesh"
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">Read Time</label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                  />
                </div>
              </div>

              <ImageUploader value={coverImage} onChange={setCoverImage} label="Article Feature Image" />

              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">Summary</label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                  Article Body (separate paragraphs with blank lines)
                </label>
                <textarea
                  rows={5}
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs leading-relaxed"
                />
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
                  {saving ? 'Saving...' : editingId ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
