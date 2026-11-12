'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Upload,
  Check,
  AlertCircle,
  Loader2,
  Trash2,
  RefreshCw,
  Eye,
  Maximize2,
  Minimize2,
  X,
  ExternalLink,
} from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  hideUrlInput?: boolean; // Kept for backwards compatibility
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB limit

function getFileNameFromUrl(url: string): string {
  if (!url) return '';
  try {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    return decodeURIComponent(lastPart.split('?')[0]);
  } catch {
    return 'Image file';
  }
}

export function ImageUploader({
  value,
  onChange,
  label = 'Cover Image',
  description,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadedName, setUploadedName] = useState('');
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
    setUploadedName('');
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
        /* Image Preview Card with Action Buttons */
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#CBD5E1] bg-[#F8FAFC] shadow-2xs group min-w-0">
          {/* Preview Container: Supports Contain (Whole Image) and Cover (Banner) */}
          <div className="relative w-full h-64 sm:h-72 bg-slate-900/5 flex items-center justify-center overflow-hidden">
            {/* Subtle checkered backdrop for transparent or contained images */}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  'radial-gradient(#94A3B8 0.75px, transparent 0.75px), radial-gradient(#94A3B8 0.75px, #F8FAFC 0.75px)',
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 8px 8px',
              }}
            />

            <Image
              src={value}
              alt="Uploaded Preview"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`transition-all duration-300 ${
                fitMode === 'contain' ? 'object-contain p-2' : 'object-cover'
              }`}
            />

            {/* Top Overlay Controls */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
              <div className="bg-[#0B2A4A]/85 backdrop-blur-xs text-white text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5 border border-white/10 pointer-events-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{fitMode === 'contain' ? 'Full Preview (Fit)' : 'Banner View (Cover)'}</span>
              </div>

              <div className="flex items-center gap-1 pointer-events-auto">
                {/* Fit Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setFitMode((m) => (m === 'contain' ? 'cover' : 'contain'))}
                  className="px-2 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[10px] font-mono font-medium backdrop-blur-xs transition-colors flex items-center gap-1 cursor-pointer border border-white/10 shadow-xs"
                  title={fitMode === 'contain' ? 'Switch to Fill Banner (Cover)' : 'Switch to Whole Image (Fit)'}
                >
                  {fitMode === 'contain' ? (
                    <>
                      <Maximize2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Fill</span>
                    </>
                  ) : (
                    <>
                      <Minimize2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Fit</span>
                    </>
                  )}
                </button>

                {/* Lightbox Trigger */}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer border border-white/10 shadow-xs"
                  title="View Full Resolution"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom Filename Chip */}
            {displayName && (
              <div className="absolute bottom-2 left-2 right-2 max-w-[calc(100%-16px)] pointer-events-none">
                <span className="inline-block max-w-full truncate rounded-md bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[10px] font-mono text-white/90 border border-white/10 pointer-events-auto">
                  {displayName}
                </span>
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="p-3 bg-white border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0C57A5] hover:bg-[#0B2A4A] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs">
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
                onClick={() => setFitMode((m) => (m === 'contain' ? 'cover' : 'contain'))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0B2A4A] text-xs font-medium transition-colors cursor-pointer"
                title={fitMode === 'contain' ? 'Switch to Cover Crop' : 'Switch to Full Contain'}
              >
                {fitMode === 'contain' ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Fit Mode</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Fill Mode</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[#0C57A5] hover:bg-[#EAF2FA] border border-transparent hover:border-[#CBD5E1] text-xs font-medium transition-colors cursor-pointer"
                title="Open full view modal"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#CBD5E1] hover:border-[#0C57A5] rounded-2xl bg-[#F8FAFC] hover:bg-white text-center cursor-pointer transition-all group min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#0C57A5]/10 text-[#0C57A5] group-hover:scale-105 transition-transform flex items-center justify-center mb-2.5">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <p className="text-xs font-bold text-[#0B2A4A] group-hover:text-[#0C57A5] transition-colors break-words">
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

      {/* Responsive Error Alert */}
      {error && (
        <div className="flex items-start gap-2 text-[11px] text-[#E85338] bg-rose-50 border border-rose-100 p-2.5 rounded-xl min-w-0 break-words break-all">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span className="min-w-0 flex-1">{error}</span>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && value && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-950/80 border-b border-white/10 flex items-center justify-between gap-3 text-white">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono font-bold truncate text-slate-200" title={displayName}>
                  {displayName}
                </p>
                <span className="text-[10px] text-slate-400 font-mono">Full-Resolution Preview</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Open original in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Image Body */}
            <div className="relative flex-1 min-h-[300px] max-h-[75vh] w-full bg-black/50 flex items-center justify-center p-4 overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Full Preview"
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
