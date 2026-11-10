'use client';

import React, { useState } from 'react';
import { Download, CheckCircle, FileText, X, AlertCircle } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  type: string;
  fileSize: string;
  pages?: number;
  doi?: string;
  downloadUrl?: string;
}

export function DownloadModal({
  isOpen,
  onClose,
  title,
  category,
  type,
  fileSize,
  pages,
  doi,
  downloadUrl,
}: DownloadModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  const [prevOpen, setPrevOpen] = useState(isOpen);
  if (prevOpen !== isOpen) {
    setPrevOpen(isOpen);
    if (!isOpen) {
      setDownloading(false);
      setCompleted(false);
      setProgress(0);
    }
  }

  if (!isOpen) return null;

  const triggerActualDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleStartDownload = () => {
    setDownloading(true);
    setProgress(15);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          setCompleted(true);
          triggerActualDownload();
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white border border-[#E2E8F0] shadow-2xl rounded-3xl p-6 sm:p-7 relative text-left"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#64748B] hover:text-[#1E293B] transition-colors p-1 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-[#EAF2FA] text-[#0C57A5] rounded-xl flex items-center justify-center shrink-0 border border-[#0C57A5]/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-[#0C57A5] font-bold font-mono">
              {type} · {category}
            </span>
            <h3 className="text-base font-bold text-[#0B2A4A] leading-snug mt-0.5 font-serif">
              {title}
            </h3>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="p-3.5 bg-[#F8FAFD] rounded-xl border border-[#E2E8F0] text-xs text-[#1E293B] space-y-1.5 mb-5">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Document Format:</span>
            <span className="font-mono font-medium">PDF (Open Access Document)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Estimated File Size:</span>
            <span className="font-mono font-bold text-[#0C57A5]">{fileSize}</span>
          </div>
          {pages && (
            <div className="flex justify-between">
              <span className="text-[#64748B]">Pagination:</span>
              <span className="font-mono">{pages} pages</span>
            </div>
          )}
          {doi && (
            <div className="flex justify-between">
              <span className="text-[#64748B]">DOI Reference:</span>
              <span className="font-mono text-[#0C57A5]">{doi}</span>
            </div>
          )}
        </div>

        {/* Progress or Actions */}
        {downloading ? (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-[#64748B]">
              <span>Generating document package...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0C57A5] rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : completed ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-xs font-medium">
              <CheckCircle className="w-4 h-4 text-[#0C57A5] shrink-0" />
              <span>Document package downloaded successfully. Check your browser downloads folder.</span>
            </div>
            {downloadUrl && (
              <div className="text-center">
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="text-xs text-[#0C57A5] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>Click here if the download didn&apos;t start automatically</span>
                </a>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#0C57A5] text-white text-xs uppercase tracking-wider font-bold rounded-full hover:bg-[#094787] transition-colors cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleStartDownload}
              className="flex-1 py-2.5 px-4 bg-[#E85338] hover:bg-[#D44228] text-white text-xs uppercase tracking-wider font-bold rounded-full transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Report ({fileSize})</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-full border border-[#E2E8F0] text-xs font-medium text-[#64748B] hover:text-[#1E293B] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
