'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  FileText,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  FolderDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  CheckCircle2,
  Download,
  FileCode,
  FileSpreadsheet,
  FileArchive,
} from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB strict limit
const PAGE_SIZE = 8;

interface ResourceItem {
  id: string;
  title: string;
  type: string;
  category: string;
  date: string;
  year: number;
  size: string;
  description: string;
  fileFormat: string;
  downloadUrl?: string | null;
  downloadCount: number;
}

const CATEGORIES = [
  'All Categories',
  'Media Research',
  'Public Affairs',
  'Digital Media',
  'Social Development',
  'Governance',
  'Public Awareness',
];

const TYPES = [
  'All Types',
  'Research Report',
  'Policy Brief',
  'Media Resource',
  'Discussion Paper',
  'Dataset & Guide',
];

const FORMATS = ['All Formats', 'PDF', 'DOCX', 'ZIP', 'XLSX'];

export function HomeResourcesManager() {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedFormat, setSelectedFormat] = useState('All Formats');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal & Edit State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Research Report');
  const [category, setCategory] = useState('Media Research');
  const [date, setDate] = useState('');
  const [year, setYear] = useState(2026);
  const [size, setSize] = useState('2.0 MB');
  const [description, setDescription] = useState('');
  const [fileFormat, setFileFormat] = useState('PDF');
  const [downloadUrl, setDownloadUrl] = useState('');

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/resources');
      const data = await res.json();
      if (data.items) setItems(data.items);
    } catch (e) {
      console.error('Error fetching resources:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedFormat]);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setType('Research Report');
    setCategory('Media Research');
    const now = new Date();
    setDate(now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    setYear(now.getFullYear());
    setSize('2.0 MB');
    setDescription('');
    setFileFormat('PDF');
    setDownloadUrl('');
    setUploadError('');
    setUploadSuccess(false);
    setModalOpen(true);
  };

  const openEditModal = (item: ResourceItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setType(item.type);
    setCategory(item.category);
    setDate(item.date);
    setYear(item.year);
    setSize(item.size);
    setDescription(item.description);
    setFileFormat(item.fileFormat);
    setDownloadUrl(item.downloadUrl || '');
    setUploadError('');
    setUploadSuccess(false);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setUploadError(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 10MB limit. Upload is strictly capped at 10MB.`
      );
      e.target.value = '';
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setDownloadUrl(data.url);
      if (data.fileSize) setSize(data.fileSize);

      // Detect format
      const ext = file.name.split('.').pop()?.toUpperCase();
      if (ext && ['PDF', 'DOCX', 'ZIP', 'XLSX'].includes(ext)) {
        setFileFormat(ext);
      } else if (file.type.includes('pdf')) {
        setFileFormat('PDF');
      }

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed. Ensure the file is under 10MB.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      type,
      category,
      date,
      year: Number(year),
      size,
      description,
      fileFormat,
      downloadUrl: downloadUrl.trim() || null,
    };

    try {
      const url = editingId ? `/api/admin/resources/${editingId}` : '/api/admin/resources';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save resource');

      setModalOpen(false);
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Error saving resource');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete resource "${name}"?`)) return;
    try {
      await fetch(`/api/admin/resources/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      alert('Failed to delete resource');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All Categories');
    setSelectedFormat('All Formats');
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All Categories' || item.category === selectedCategory;

      const matchesFormat =
        selectedFormat === 'All Formats' ||
        item.fileFormat.toUpperCase() === selectedFormat.toUpperCase();

      return matchesSearch && matchesCategory && matchesFormat;
    });
  }, [items, search, selectedCategory, selectedFormat]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, safeCurrentPage]);

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedCategory !== 'All Categories' ||
    selectedFormat !== 'All Formats';

  // Format icon helper
  const getFormatBadge = (fmt: string) => {
    const f = fmt.toUpperCase();
    if (f === 'PDF') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <FileText className="w-3 h-3" />
          PDF
        </span>
      );
    }
    if (f === 'XLSX' || f === 'XLS') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <FileSpreadsheet className="w-3 h-3" />
          XLSX
        </span>
      );
    }
    if (f === 'ZIP') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <FileArchive className="w-3 h-3" />
          ZIP
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
        <FileCode className="w-3 h-3" />
        {f}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-4 sm:p-6 lg:p-7 space-y-6 text-left">
      {/* Section Header - Responsive for Laptops */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[#0C57A5]/10 text-[#0C57A5] flex items-center justify-center shrink-0 mt-0.5 border border-[#0C57A5]/20">
            <FolderDown className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-[#0C57A5] tracking-wider">
                Home Page Section
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-[#0C57A5] border border-blue-200">
                {items.length} Documents
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#0B2A4A] mt-0.5 tracking-tight truncate">
              Knowledge Hub & Downloadable Resources
            </h2>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Manage open-access policy briefs, research datasets, civic toolkits, and codebooks displayed on the home page.
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer shrink-0 self-start lg:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Filter / Search Bar - Responsive on Laptop Screens (1024px - 1440px) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#F8FAFC] p-3 sm:p-4 rounded-2xl border border-[#E2E8F0]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 min-w-0">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, topic, or format..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1E293B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="w-full sm:w-44 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Format Dropdown */}
          <div className="w-full sm:w-36 shrink-0">
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] cursor-pointer"
            >
              {FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              title="Reset all filters"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0C57A5] bg-white border border-[#E2E8F0] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={fetchItems}
            title="Refresh list"
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0C57A5] hover:bg-white bg-white sm:bg-transparent border border-[#E2E8F0] sm:border-transparent transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0C57A5]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Resources Table - Engineered for Laptop Viewports */}
      <div className="rounded-2xl border border-[#E2E8F0] overflow-hidden bg-white shadow-2xs">
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0C57A5] mx-auto mb-2" />
            <p className="text-xs text-[#64748B] font-mono">Loading resources...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-14 text-center text-xs text-[#64748B] space-y-2">
            <FolderDown className="w-8 h-8 text-[#94A3B8] mx-auto mb-1 stroke-1" />
            <p className="font-semibold text-[#1E293B]">
              {hasActiveFilters ? 'No documents match your filter criteria.' : 'No downloadable resources added yet.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[#0C57A5] font-bold hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="py-3 px-4 font-bold min-w-[280px]">Document Title & Description</th>
                  <th className="py-3 px-4 font-bold min-w-[120px]">Format & Size</th>
                  <th className="py-3 px-4 font-bold min-w-[140px]">Category & Type</th>
                  <th className="py-3 px-4 font-bold min-w-[110px]">Audited Downloads</th>
                  <th className="py-3 px-4 font-bold text-right min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    {/* Title & Description */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-3 max-w-md lg:max-w-lg">
                        <div className="p-2 rounded-xl bg-[#EAF2FA] text-[#0C57A5] shrink-0 mt-0.5 border border-[#0C57A5]/10">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold font-serif text-[#0B2A4A] text-xs leading-snug line-clamp-1 hover:text-[#0C57A5] transition-colors">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                            {item.description || 'No description provided.'}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-[#94A3B8] font-mono mt-1">
                            <span>{item.date}</span>
                            <span>•</span>
                            <span>Year {item.year}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Format & Size */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div>{getFormatBadge(item.fileFormat)}</div>
                        <p className="text-[10px] text-[#64748B] font-mono">{item.size}</p>
                      </div>
                    </td>

                    {/* Category & Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAF2FA] text-[#0C57A5] border border-blue-200">
                          {item.category}
                        </span>
                        <p className="text-[11px] text-[#64748B] font-medium">{item.type}</p>
                      </div>
                    </td>

                    {/* Downloads */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold text-[#0B2A4A]">
                        {item.downloadCount}
                      </span>
                      <span className="text-[11px] text-[#64748B] ml-1">downloads</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.downloadUrl && (
                          <a
                            href={item.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Preview / download attached file"
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0C57A5] hover:bg-[#EAF2FA] transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-[#0C57A5] hover:bg-[#EAF2FA] transition-colors cursor-pointer"
                          title="Edit document"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar - Keeps Laptop Pages Compact & Organized */}
        {!loading && filteredItems.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-xs">
            <p className="text-[#64748B] font-mono text-[11px]">
              Showing <span className="font-bold text-[#0B2A4A]">{(safeCurrentPage - 1) * PAGE_SIZE + 1}</span> to{' '}
              <span className="font-bold text-[#0B2A4A]">
                {Math.min(safeCurrentPage * PAGE_SIZE, filteredItems.length)}
              </span>{' '}
              of <span className="font-bold text-[#0B2A4A]">{filteredItems.length}</span> documents
            </p>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0B2A4A] font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        safeCurrentPage === pageNum
                          ? 'bg-[#0C57A5] text-white shadow-2xs'
                          : 'bg-white text-[#64748B] border border-[#CBD5E1] hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0B2A4A] font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Studio Dialog - Optimized for Laptop Screens (Wide & Fixed Header/Footer) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-[#CBD5E1] flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Sticky Header */}
            <div className="shrink-0 flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#E2E8F0] bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0C57A5]/10 text-[#0C57A5] flex items-center justify-center shrink-0">
                  <FolderDown className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#0C57A5] tracking-wider block">
                    Resource Catalog Controller
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-[#0B2A4A] leading-tight">
                    {editingId ? 'Edit Downloadable Resource' : 'Add New Downloadable Resource'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-[#64748B] hover:text-[#1E293B] rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body - 2 Columns on Laptop Screens */}
            <form onSubmit={handleSave} id="resource-modal-form" className="flex-1 overflow-y-auto p-5 sm:p-7">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left Column (Metadata & Details) - 7 cols on laptop */}
                <div className="md:col-span-7 space-y-4 text-left">
                  {/* Document Title */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                      Document Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Media Diversity & Civic Discourse Audit"
                      className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-serif font-bold text-[#0B2A4A] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Type & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                        Resource Type
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white transition-all cursor-pointer"
                      >
                        <option>Research Report</option>
                        <option>Policy Brief</option>
                        <option>Media Resource</option>
                        <option>Discussion Paper</option>
                        <option>Dataset & Guide</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                        Knowledge Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white transition-all cursor-pointer"
                      >
                        <option>Media Research</option>
                        <option>Public Affairs</option>
                        <option>Digital Media</option>
                        <option>Social Development</option>
                        <option>Governance</option>
                        <option>Public Awareness</option>
                      </select>
                    </div>
                  </div>

                  {/* Format, Size, Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                        Format
                      </label>
                      <select
                        value={fileFormat}
                        onChange={(e) => setFileFormat(e.target.value)}
                        className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white cursor-pointer"
                      >
                        <option>PDF</option>
                        <option>DOCX</option>
                        <option>ZIP</option>
                        <option>XLSX</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                        File Size
                      </label>
                      <input
                        type="text"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        placeholder="e.g. 2.4 MB"
                        className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-mono text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                        Date Label
                      </label>
                      <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="e.g. October 2026"
                        className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                      Summary & Content Abstract <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Summary of research methodologies, findings, datasets, or civic guidelines contained in this document."
                      className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Right Column (File Upload & URL) - 5 cols on laptop */}
                <div className="md:col-span-5 space-y-4 text-left">
                  {/* File Upload Box */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase text-[#1E293B]">
                      Upload Document File
                    </label>

                    {downloadUrl ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3 shadow-2xs">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-[#0B2A4A]">File Attached</span>
                              <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                {fileFormat}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#64748B] font-mono mt-0.5">{size}</p>
                            <a
                              href={downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-mono text-[#0C57A5] hover:underline truncate inline-flex items-center gap-1 mt-1 max-w-[200px]"
                            >
                              <span className="truncate">{downloadUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-t border-emerald-200/60">
                          <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#0C57A5] text-[#0B2A4A] text-xs font-semibold transition-colors cursor-pointer shadow-2xs">
                            {uploading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : uploadSuccess ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Upload className="w-3.5 h-3.5 text-[#0C57A5]" />
                            )}
                            <span>{uploading ? 'Uploading...' : 'Replace File'}</span>
                            <input
                              type="file"
                              accept=".pdf,.docx,.doc,.zip,.xlsx,.xls,application/pdf"
                              onChange={handleFileUpload}
                              disabled={uploading}
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => setDownloadUrl('')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#CBD5E1] hover:border-[#0C57A5] rounded-2xl bg-[#F8FAFC] hover:bg-white text-center cursor-pointer transition-all group">
                        <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0C57A5] group-hover:scale-105 transition-transform flex items-center justify-center mb-2.5 border border-blue-100">
                          {uploading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[#0C57A5]" />
                          ) : (
                            <Upload className="w-5 h-5" />
                          )}
                        </div>
                        <p className="text-xs font-bold text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors">
                          {uploading ? 'Uploading Document to Server...' : 'Click to Upload Document'}
                        </p>
                        <p className="text-[11px] text-[#64748B] mt-1">
                          PDF, DOCX, ZIP, XLSX (Strict 10MB limit)
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.docx,.doc,.zip,.xlsx,.xls,application/pdf"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    )}

                    {uploadError && (
                      <div className="flex items-center gap-1.5 text-[11px] text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{uploadError}</span>
                      </div>
                    )}
                  </div>

                  {/* Direct Download URL Input */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#1E293B] mb-1">
                      Direct Download URL (Auto-filled on upload)
                    </label>
                    <input
                      type="text"
                      value={downloadUrl}
                      onChange={(e) => setDownloadUrl(e.target.value)}
                      placeholder="https://... or auto-filled"
                      className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-mono text-[#0B2A4A] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white transition-all"
                    />
                  </div>

                  {/* Document Guidelines Tip */}
                  <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100/80 text-[11px] text-[#475569] space-y-1">
                    <p className="font-bold text-[#0C57A5]">Institutional Guideline:</p>
                    <p className="leading-relaxed">
                      Files are hosted securely with public read access. Ensure documents contain no unredacted personal identification or confidential draft marks.
                    </p>
                  </div>
                </div>

              </div>
            </form>

            {/* Sticky Footer - Always visible on laptop screens without scrolling! */}
            <div className="shrink-0 flex items-center justify-end gap-3 px-5 sm:px-7 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] rounded-xl hover:bg-white border border-transparent hover:border-[#CBD5E1] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="resource-modal-form"
                disabled={saving || uploading}
                className="px-5 py-2.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs hover:shadow-md"
              >
                {saving ? 'Saving...' : editingId ? 'Update Resource' : 'Create Resource'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
