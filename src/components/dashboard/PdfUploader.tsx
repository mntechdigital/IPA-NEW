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

export function PdfUploader({
  value,
  onChange,
  label = 'Publication PDF Document',
  description = 'Upload the official full research report or policy brief in PDF format (up to 10MB).',
}: PdfUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

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
  };

  return (
    <div className="space-y-2 text-left">
      {label && (
        <label className="block text-xs font-semibold text-[#1E293B] uppercase tracking-wider">
          {label}
        </label>
      )}
      {description && (
        <p className="text-[11px] text-[#64748B] -mt-1 mb-2">{description}</p>
      )}

      {value ? (
        /* PDF Attached Card */
        <div className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#0B2A4A] truncate">
                  PDF Document Attached
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Ready to Download
                </span>
              </div>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-[#0C57A5] hover:underline truncate inline-flex items-center gap-1 mt-0.5"
              >
                <span className="truncate max-w-xs">{value}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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

            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty Dropzone for PDF */
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#CBD5E1] hover:border-[#0C57A5] rounded-2xl bg-[#F8FAFC] hover:bg-white text-center cursor-pointer transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 group-hover:scale-105 transition-transform flex items-center justify-center mb-2.5 border border-red-100">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-[#0C57A5]" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <p className="text-xs font-bold text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors">
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

      {error && (
        <div className="flex items-center gap-1.5 text-[11px] text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
