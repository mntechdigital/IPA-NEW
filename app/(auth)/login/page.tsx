'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  // Fields start clean and empty (not prefilled)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fillDemoCredentials = () => {
    setEmail('ipa@gmail.com');
    setPassword('admin@123');
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
      }

      // Full document navigation guarantees the browser commits the cookie and passes it to middleware
      window.location.href = redirectPath;
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#0C57A5] selection:text-white">
      {/* Decorative Brand Top Border */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0B2A4A] via-[#0C57A5] via-[#F6B834] to-[#E85338]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0B2A4A] border border-[#0C57A5]/30 flex items-center justify-center p-2 shadow-sm group-hover:scale-105 transition-transform">
              <Image
                src="/assets/aistudio/ipa_logo_57767e2a.svg"
                alt="IPA Logo"
                width={36}
                height={36}
                className="w-full h-auto brightness-0 invert"
              />
            </div>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2FA] text-[#0C57A5] text-[11px] font-mono font-bold tracking-wider uppercase mb-2">
            <span>IPA CMS PORTAL</span>
            <span>✦</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0B2A4A] tracking-tight">
            Administrator Sign In
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#64748B] max-w-sm mx-auto">
            Authorized administrative access for managing public research, programs, campaigns, and institutional publications.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg shadow-[#0B2A4A]/5 rounded-3xl border border-[#E2E8F0]">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs sm:text-sm animate-shake">
              <AlertCircle className="w-5 h-5 text-[#E85338] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#E85338]">Authentication Failed</p>
                <p className="text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@ipa.org.bd"
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E293B]">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0C57A5] focus:bg-white transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#0B2A4A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#0C57A5] hover:bg-[#0B2A4A] shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In To Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-5 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#EAF2FA] text-[#0C57A5] flex items-center justify-center flex-shrink-0">
                <KeyRound className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <div className="font-semibold text-[#0B2A4A] text-[11px] uppercase tracking-wider">Demo Admin Account</div>
                <div className="text-[#64748B] text-[11px] font-mono truncate">
                  ipa@gmail.com • admin@123
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="px-2.5 py-1.5 text-[11px] font-semibold text-[#0C57A5] hover:text-white bg-white hover:bg-[#0C57A5] border border-[#CBD5E1] hover:border-[#0C57A5] rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              Fill In
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-[#E2E8F0] flex items-center justify-center gap-2 text-xs text-[#64748B]">
            <ShieldCheck className="w-4 h-4 text-[#0C57A5]" />
            <span>Encrypted Session • HMAC-SHA256 Token Protection</span>
          </div>
        </div>

        {/* Back to Public Site */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-[#0C57A5] hover:text-[#0B2A4A] transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#0C57A5] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
