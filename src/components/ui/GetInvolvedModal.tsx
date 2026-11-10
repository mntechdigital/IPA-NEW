'use client';

import React, { useState } from 'react';
import { Users, CheckCircle, X, Send, Heart } from 'lucide-react';

interface GetInvolvedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GetInvolvedModal({ isOpen, onClose }: GetInvolvedModalProps) {
  const [role, setRole] = useState('Youth Public Affairs Fellowship');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/forms/involvement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          email,
          role,
          interests: affiliation,
          message: note,
        }),
      });
    } catch (err) {
      console.error(err);
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setAffiliation('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white border border-[#E2E8F0] shadow-2xl rounded-3xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto text-left"
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

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0C57A5] mb-1 font-mono">
          <Heart className="w-4 h-4 fill-[#0C57A5]" />
          <span>Institutional Public Engagement</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#0B2A4A] mb-1">
          Get Involved With IPA
        </h3>
        <p className="text-xs text-[#64748B] mb-5">
          Join our independent community of civic researchers, fact-checking champions, and dialogue facilitators across Bangladesh.
        </p>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-[#0C57A5] flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#0B2A4A]">Thank you for your commitment, {name}!</h4>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                Your demonstration submission for &ldquo;{role}&rdquo; has been registered. Our engagement directorate would reach out to you at {email}.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="py-2.5 px-7 bg-[#0C57A5] text-white text-xs uppercase tracking-wider font-bold rounded-full hover:bg-[#094787] transition-colors shadow-xs cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1">
                Engagement Pathway *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl focus:border-[#0C57A5] focus:outline-hidden"
              >
                <option value="Youth Public Affairs Fellowship">Youth Public Affairs Fellowship (Research)</option>
                <option value="Community Dialogue Facilitator">Community Dialogue Facilitator (Townhalls)</option>
                <option value="Media Literacy & Verification Ambassador">Media Literacy & Verification Ambassador</option>
                <option value="University Academic Collaborator">University Academic Collaborator</option>
                <option value="General Volunteer & Civic Supporter">General Volunteer & Civic Supporter</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ayesha Rahman"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl focus:border-[#0C57A5] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ayesha@university.edu"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl focus:border-[#0C57A5] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1">
                Institution / Organization
              </label>
              <input
                type="text"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="e.g. University of Dhaka, Faculty of Social Sciences"
                className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl focus:border-[#0C57A5] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1">
                Statement of Interest
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Briefly describe your motivation or prior experience with civic initiatives..."
                className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl focus:border-[#0C57A5] focus:outline-hidden resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-[#E2E8F0] text-xs font-medium text-[#64748B] hover:text-[#1E293B] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0C57A5] hover:bg-[#094787] text-white text-xs uppercase tracking-wider font-bold rounded-full transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Application</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
