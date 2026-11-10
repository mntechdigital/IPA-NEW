'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, Check, AlertCircle, Loader2, ImageIcon, Trash2, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  hideUrlInput?: boolean; // Kept for backwards compatibility
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB limit

export function ImageUploader({
  value,
  onChange,
  label = 'Cover Image',
  description,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 10MB limit.`);
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

      onChange(data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Image upload failed. Please try a different image under 10MB.');
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
        /* Image Preview Card with Action Buttons (No raw paths displayed) */
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] shadow-2xs group">
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full max-h-56 bg-slate-100 overflow-hidden">
            <Image
              src={value}
              alt="Uploaded Preview"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-102"
            />
            {/* Top Badge */}
            <div className="absolute top-3 left-3 bg-[#0B2A4A]/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Current Photograph</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="p-3 bg-white border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
            <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs">
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : success ? (
                <Check className="w-3.5 h-3.5 text-[#F6B834]" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>{uploading ? 'Uploading...' : success ? 'Uploaded!' : 'Replace Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#CBD5E1] hover:border-[#0C57A5] rounded-2xl bg-[#F8FAFC] hover:bg-white text-center cursor-pointer transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-[#0C57A5]/10 text-[#0C57A5] group-hover:scale-105 transition-transform flex items-center justify-center mb-2.5">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <p className="text-xs font-bold text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors">
            {uploading ? 'Uploading Image to Server...' : 'Click to Upload Image'}
          </p>
          <p className="text-[11px] text-[#64748B] mt-0.5">
            PNG, JPG, WEBP up to 10MB
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#E85338] bg-rose-50 border border-rose-100 p-2 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
