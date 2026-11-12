'use client';

import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

export interface CampaignResource {
  title: string;
  type: string;
  size: string;
  url?: string;
}

interface CampaignResourcesUploaderProps {
  resources: CampaignResource[];
  onChange: (resources: CampaignResource[]) => void;
  maxSizeMB?: number;
  label?: string;
}

export function CampaignResourcesUploader({
  resources,
  onChange,
  maxSizeMB = 10,
  label = 'Campaign PDF Toolkits & Resources',
}: CampaignResourcesUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxBytes = maxSizeMB * 1024 * 1024;

  const handleUpload = async (file: File) => {
    setError('');
    setSuccessMsg('');

    // Check PDF type
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setError('Only PDF documents (.pdf) are allowed.');
      return;
    }

    // Check size <= 10MB
    if (file.size > maxBytes) {
      const actualMB = (file.size / (1024 * 1024)).toFixed(1);
      setError(`File size (${actualMB} MB) exceeds the maximum allowed limit of ${maxSizeMB} MB.`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload PDF');
      }

      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const newResource: CampaignResource = {
        title: cleanTitle,
        type: 'PDF Toolkit',
        size: data.fileSize || `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: data.url,
      };

      onChange([...resources, newResource]);
      setSuccessMsg(`"${file.name}" uploaded successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error uploading PDF file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleRemove = (index: number) => {
    const updated = resources.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleTitleChange = (index: number, newTitle: string) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], title: newTitle };
    onChange(updated);
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-[#0B2A4A] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#0C57A5]" />
            <span>{label}</span>
          </label>
          <p className="text-[11px] text-[#64748B]">
            Upload downloadable guides, advocacy kits, or dossiers (PDF format, max {maxSizeMB} MB each).
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B] font-bold">
          Max {maxSizeMB} MB
        </span>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#0C57A5] bg-[#EAF2FA]/50 scale-[1.005]'
            : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#0C57A5] hover:bg-[#F8FAFD]'
        } ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-center text-[#0C57A5]">
            {uploading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-[#0B2A4A]">
              {uploading ? 'Uploading PDF to cloud...' : 'Click or drag PDF toolkit here to upload'}
            </p>
            <p className="text-[11px] text-[#64748B]">
              Accepts .pdf files up to {maxSizeMB} MB
            </p>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs min-w-0 break-words break-all">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="min-w-0 flex-1">{error}</span>
        </div>
      )}

      {/* Success alert */}
      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2 text-green-700 text-xs min-w-0 break-words break-all">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="min-w-0 flex-1">{successMsg}</span>
        </div>
      )}

      {/* List of Attached PDF Resources */}
      {resources.length > 0 && (
        <div className="space-y-2.5 pt-2 min-w-0 w-full">
          <div className="text-[11px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
            Attached Resources ({resources.length})
          </div>
          <div className="space-y-2 min-w-0">
            {resources.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 border border-red-200 shrink-0 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleTitleChange(idx, e.target.value)}
                      placeholder="Resource Title..."
                      className="w-full text-xs font-bold text-[#0B2A4A] bg-transparent border-b border-transparent hover:border-[#CBD5E1] focus:border-[#0C57A5] focus:outline-none transition-colors py-0.5 truncate"
                    />
                    <div className="flex items-center gap-2 text-[10px] text-[#64748B] font-mono mt-0.5 flex-wrap min-w-0">
                      <span className="truncate">{item.type || 'PDF Toolkit'}</span>
                      <span>·</span>
                      <span className="font-semibold text-[#0B2A4A] shrink-0">{item.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] text-[11px] font-medium text-[#0C57A5] hover:bg-[#EAF2FA] transition-colors"
                      title="Preview PDF in new tab"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Preview</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
