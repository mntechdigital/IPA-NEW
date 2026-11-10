'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Search, Mail, Phone, Trash2, Clock, RefreshCw } from 'lucide-react';

export default function DashboardInvolvementPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/involvement');
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

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this involvement record?')) return;
    try {
      await fetch(`/api/admin/involvement/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      (item.interests && item.interests.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Civic Participation"
        title="Get Involved Applications"
        description="Review submissions from students, volunteer fact-checkers, and civil society partners wishing to join IPA initiatives."
      />

      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or interests..."
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
          />
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#E2E8F0]">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0C57A5] mx-auto mb-2" />
            <p className="text-xs text-[#64748B] font-mono">Loading submissions...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B] bg-white rounded-2xl border border-[#E2E8F0]">
            No participation applications received yet.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0B2A4A] font-serif">{item.fullName}</span>
                    {item.role && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAF2FA] text-[#0C57A5]">
                        {item.role}
                      </span>
                    )}
                  </div>
                  {item.interests && (
                    <p className="text-xs text-[#64748B] mt-0.5">Interests: <span className="font-semibold text-[#1E293B]">{item.interests}</span></p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {item.message && (
                <p className="text-xs text-[#1E293B] bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                  {item.message}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0]/60 text-[11px] text-[#64748B]">
                <div className="flex items-center gap-4">
                  <a href={`mailto:${item.email}`} className="text-[#0C57A5] hover:underline flex items-center gap-1 font-semibold">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{item.email}</span>
                  </a>
                  {item.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{item.phone}</span>
                    </span>
                  )}
                </div>
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
