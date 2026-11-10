'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Search, Mail, Trash2, CheckCircle, Clock, RefreshCw } from 'lucide-react';

export default function DashboardInquiriesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
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

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchItems();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      alert('Failed to delete inquiry');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  
  return (
    <div className="space-y-6">
      <PageHeader
        badge="Citizen Inquiries"
        title="Contact Form Messages"
        description="Review, respond to, and manage communications submitted via the public contact interface."
      />

      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or message..."
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'unread', 'read'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-colors ${
                statusFilter === s
                  ? 'bg-[#0B2A4A] text-white'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#EAF2FA]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#E2E8F0]">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0C57A5] mx-auto mb-2" />
            <p className="text-xs text-[#64748B] font-mono">Loading inquiries...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B] bg-white rounded-2xl border border-[#E2E8F0]">
            No messages found.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all bg-white ${
                item.status === 'unread'
                  ? 'border-[#0C57A5]/40 shadow-xs'
                  : 'border-[#E2E8F0] opacity-90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0B2A4A] font-serif">{item.name}</span>
                    {item.organization && (
                      <span className="text-xs text-[#64748B]">({item.organization})</span>
                    )}
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'unread'
                          ? 'bg-[#E85338]/10 text-[#E85338]'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#0C57A5] mt-1">{item.subject}</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => toggleStatus(item.id, item.status)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0B2A4A] transition-colors cursor-pointer"
                  >
                    {item.status === 'unread' ? 'Mark as Read' : 'Mark Unread'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="py-3 text-xs text-[#1E293B] leading-relaxed whitespace-pre-line">
                {item.message}
              </div>

              <div className="pt-3 border-t border-[#E2E8F0]/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B]">
                <a
                  href={`mailto:${item.email}`}
                  className="text-[#0C57A5] font-semibold hover:underline inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply to: {item.email}</span>
                </a>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
