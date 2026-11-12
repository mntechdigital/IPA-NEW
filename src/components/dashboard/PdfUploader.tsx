'use client';

import React, { useState } from 'react';
import { Upload, Check, AlertCircle, Loader2, FileText, Trash2, RefreshCw, ExternalLink } from 'lucide-react';

interface PdfUploaderProps {
  value: string;
  onChange: (url: string, formattedSize?: string) => void;
  label?: string;
  description?: string;
}

const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

function getFileNameFromUrl(url: string): string {
  if (!url) return '';
  try {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    return decodeURIComponent(lastPart.split('?')[0]);
  } catch {
    return 'Document.pdf';
  }
}

export function PdfUploader({
  value,
  onChange,
  label = 'Publication PDF Document',
  description = 'Upload the official full research report or policy brief in PDF format (up to 10MB).',
}: PdfUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadedName, setUploadedName] = useState('');
  const [uploadedSize, setUploadedSize] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_PDF_SIZE) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 10MB limit.`);
      e.target.value = '';
      return;
    }

    if (file.type && !file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a valid PDF document (.pdf).');
      e.target.value = '';
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(false);
    setUploadedName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      if (data.fileSize) setUploadedSize(data.fileSize);
      onChange(data.url, data.fileSize);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'PDF upload failed. Please try a different file under 10MB.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    onChange('');
    setUploadedName('');
    setUploadedSize('');
  };

  const displayName = uploadedName || getFileNameFromUrl(value);

  return (
    <div className="space-y-2 text-left min-w-0 w-full">
      {label && (
        <label className="block text-xs font-semibold text-[#1E293B] uppercase tracking-wider">
          {label}
        </label>
      )}
      {description && (
        <p className="text-[11px] text-[#64748B] -mt-1 mb-2 break-words">{description}</p>
      )}

      {value ? (
        /* PDF Attached Card with Fully Responsive Layout */
        <div className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 sm:p-4 flex flex-col gap-3 shadow-2xs min-w-0 w-full">
          <div className="flex items-start gap-3 min-w-0 w-full">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs text-[#0B2A4A] truncate">
                  PDF Document Attached
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  Ready
                </span>
                {uploadedSize && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-[#475569] bg-slate-100 border border-slate-200 shrink-0">
                    {uploadedSize}
                  </span>
                )}
              </div>

              {/* Clean truncated filename */}
              <p
                className="text-xs font-semibold text-[#0B2A4A] truncate mt-1 text-left"
                title={displayName}
              >
                {displayName}
              </p>

              {/* Link with robust min-w-0 truncation */}
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-[#0C57A5] hover:underline inline-flex items-center gap-1 mt-0.5 max-w-full min-w-0 truncate"
                title={value}
              >
                <span className="truncate">{value}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#E2E8F0] flex-wrap min-w-0">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#0C57A5] text-[#0B2A4A] text-xs font-semibold transition-colors cursor-pointer shadow-2xs">
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : success ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-[#0C57A5]" />
                )}
                <span>{uploading ? 'Uploading...' : 'Replace PDF'}</span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0C57A5] text-xs font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open PDF</span>
              </a>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone for PDF */
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#CBD5E1] hover:border-[#0C57A5] rounded-2xl bg-[#F8FAFC] hover:bg-white text-center cursor-pointer transition-all group min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 group-hover:scale-105 transition-transform flex items-center justify-center mb-2.5 border border-red-100">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-[#0C57A5]" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <p className="text-xs font-bold text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors break-words">
            {uploading ? 'Uploading PDF Document...' : 'Click to Upload Publication PDF'}
          </p>
          <p className="text-[11px] text-[#64748B] mt-0.5">
            PDF document up to 10MB
          </p>
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {/* Responsive Error Alert */}
      {error && (
        <div className="flex items-start gap-2 text-[11px] text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-xl min-w-0 break-words break-all">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span className="min-w-0 flex-1">{error}</span>
        </div>
      )}
    </div>
  );
}
