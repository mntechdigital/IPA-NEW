'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Search, Mail, Trash2, Download, RefreshCw, Send } from 'lucide-react';

export default function DashboardSubscribersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/subscribers');
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

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Remove subscriber ${email}?`)) return;
    try {
      await fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      alert('Failed to delete subscriber');
    }
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Email,SubscribedAt\n' +
      items.map((i) => `"${i.email}","${i.createdAt}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ipa_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = items.filter((item) =>
    item.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Community Outreach"
        title="Newsletter Subscribers"
        description="Active audience receiving periodic analytical digests and public policy notices."
        action={
          items.length > 0 ? (
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#EAF2FA] text-[#0C57A5] text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          ) : undefined
        }
      />

      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscribers by email..."
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0C57A5] mx-auto mb-2" />
            <p className="text-xs text-[#64748B] font-mono">Loading subscribers...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B]">No subscribers registered.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Email Address</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Subscribed Date</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[#0B2A4A] flex items-center gap-2">
                      <Send className="w-3.5 h-3.5 text-[#0C57A5]" />
                      <span>{item.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748B]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id, item.email)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
