'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/dashboard/PageHeader';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  RefreshCw,
  FileText,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const PAGE_SIZE = 8;

export default function DashboardResearchPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/research');
      const data = await res.json();
      if (data.items) setItems(data.items);
    } catch (err) {
      console.error('Failed to load publications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${itemTitle}"?`)) return;

    try {
      const res = await fetch(`/api/admin/research/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete publication');
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Error deleting publication');
    }
  };

  const filteredItems = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return list.filter((item) => {
      if (!item) return false;
      const titleMatches = item.title?.toLowerCase().includes(search.toLowerCase());
      const catMatches = item.category?.toLowerCase().includes(search.toLowerCase());
      const absMatches = item.abstract?.toLowerCase().includes(search.toLowerCase());
      const matchesSearch = !search || Boolean(titleMatches || catMatches || absMatches);
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, filterCategory]);

  // Reset pagination on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const paginatedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const startIndex = filteredItems.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, filteredItems.length);

  const categories = [
    'All',
    'Media Research',
    'Public Affairs',
    'Digital Media',
    'Social Development',
    'Governance',
    'Public Awareness',
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Publication Repository"
        title="Research & Studies"
        description="Publish, curate, and update peer-reviewed empirical reports, policy briefs, and working papers with downloadable PDF documents."
        action={
          <Link
            href="/dashboard/research/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Publication</span>
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by title or keyword..."
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#0B2A4A] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#EAF2FA] hover:text-[#0C57A5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Publications Table Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0C57A5] mx-auto mb-2" />
            <p className="text-xs text-[#64748B] font-mono">Loading publications from Neon DB...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B]">
            No publications found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Publication</th>
                  <th className="py-3.5 px-4 font-bold">Category & Type</th>
                  <th className="py-3.5 px-4 font-bold">PDF Document</th>
                  <th className="py-3.5 px-4 font-bold">Date / DOI</th>
                  <th className="py-3.5 px-4 font-bold text-center">Featured</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-3 max-w-md">
                        <div className="w-12 h-14 rounded-lg overflow-hidden bg-[#F1F5F9] relative flex-shrink-0 border border-[#E2E8F0] flex items-center justify-center">
                          {item.coverImage ? (
                            <Image
                              src={item.coverImage}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <BookOpen className="w-5 h-5 text-[#94A3B8]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/research/${item.id}/edit`}
                            className="font-bold font-serif text-[#0B2A4A] text-xs leading-snug line-clamp-2 hover:text-[#0C57A5] transition-colors"
                          >
                            {item.title}
                          </Link>
                          <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1">
                            {item.abstract}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAF2FA] text-[#0C57A5] mb-1">
                        {item.category}
                      </span>
                      <p className="text-[11px] text-[#64748B]">{item.type} • {item.pages} pp</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.downloadUrl ? (
                        <a
                          href={item.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          title="Click to view attached PDF document"
                        >
                          <FileText className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span>PDF ({item.fileSize || 'Attached'})</span>
                        </a>
                      ) : (
                        <span className="text-[10px] font-mono text-[#94A3B8]">No PDF</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-[#1E293B]">{item.date}</p>
                      <p className="text-[10px] text-[#64748B] font-mono">{item.doi || 'No DOI'}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.featured ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FDE8B5] text-[#0B2A4A]">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[#94A3B8]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/research/${item.slug}`}
                          target="_blank"
                          title="View on Live Site"
                          className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100 hover:text-[#0B2A4A] transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/dashboard/research/${item.id}/edit`}
                          title="Edit Publication"
                          className="p-1.5 rounded-lg text-[#0C57A5] hover:bg-[#EAF2FA] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          title="Delete Publication"
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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

        {/* Pagination Bar */}
        {filteredItems.length > 0 && (
          <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
            <div>
              Showing <span className="font-semibold text-[#1E293B]">{startIndex}</span> to{' '}
              <span className="font-semibold text-[#1E293B]">{endIndex}</span> of{' '}
              <span className="font-semibold text-[#1E293B]">{filteredItems.length}</span> publications
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#0C57A5] text-white shadow-xs'
                        : 'bg-white border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
