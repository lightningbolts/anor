"use client";

import React, { useEffect, useState, useRef } from 'react';
import FAQ from '@/components/FAQ';
import { useParams } from 'next/navigation';
import { emberGlow } from '@/utils/styles';

export default function BurnerLinkPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [passwordError, setPasswordError] = useState('');
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async (pw?: string) => {
    setLoading(true);
    setError('');
    if (pw) setPasswordError('');
    let url = `/api/burn/${id}`;
    if (pw) url += `?password=${encodeURIComponent(pw)}`;
    try {
      const res = await fetch(url);
      const result = await res.json();
      if (res.status === 401) {
        setShowPasswordPrompt(true);
        setLoading(false);
        if (pw) setPasswordError('Incorrect password entered.');
        return;
      }
      if (!res.ok) {
        setError(result.error || 'Invalid or burned link');
        setLoading(false);
        return;
      }
      setData(result);
      setShowPasswordPrompt(false);
      setLoading(false);
      if (result.burned) {
        setError('This link has been burned.');
      }
      if (result.expiresAt) {
        const expires = new Date(result.expiresAt).getTime();
        const now = Date.now();
        setCountdown(Math.max(0, Math.floor((expires - now) / 1000)));
      }
    } catch {
      setError('Network error');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setError('Link expired and burned');
      return;
    }
    const timer = setInterval(() => {
      setCountdown(c => (c && c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(password);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
        copyTimeoutRef.current = null;
      }, 1500);
    } catch {
      // Optionally handle error
    }
  };

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  if (loading) return <div className={`p-8 rounded-xl ${emberGlow} max-w-lg mx-auto mt-20 text-white text-center`}>Loading...</div>;
  if (error) return <div className={`p-8 rounded-xl ${emberGlow} max-w-lg mx-auto mt-20 text-red-400 text-center font-bold`}>{error}</div>;

  return (
    <>
      <div className="max-w-lg mx-auto mt-10 mb-2 text-center">
        <a href="/" className="inline-block px-4 py-2 rounded bg-yellow-500 text-black font-bold shadow hover:bg-yellow-400 transition-colors duration-150">Create your own burner link.</a>
      </div>
      <div className={`p-8 rounded-xl ${emberGlow} max-w-lg mx-auto mt-4`}>
        {showPasswordPrompt ? (
          <form onSubmit={handlePasswordSubmit} className="mb-6">
            <label className="block text-white mb-2">Password Required</label>
            <input
              ref={passwordInputRef}
              type="password"
              className="w-full p-2 rounded bg-black bg-opacity-40 text-white mb-2"
              value={password}
              onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
            />
            {passwordError && <div className="text-black mb-2 font-bold p-2 text-left">{passwordError}</div>}
            <button type="submit" className="w-full py-2 rounded bg-yellow-500 text-black font-bold">Unlock</button>
          </form>
        ) : null}
        {data?.message && (
          <div className="text-white text-xl mb-4 border-2 border-yellow-500 bg-black bg-opacity-40 p-4 rounded shadow-lg">
            <span className="block text-orange-300 font-bold mb-2">Burner Message:</span>
            {data.message}
          </div>
        )}
        {data?.targetUrl && (
          <div className="mb-4 border-2 border-orange-500 bg-black bg-opacity-40 p-4 rounded shadow-lg">
            <span className="block text-orange-300 font-bold mb-2">Redirect Link:</span>
            <a href={data.targetUrl} className="font-mono text-lg underline break-all text-white" target="_blank" rel="noopener noreferrer">{data.targetUrl}</a>
            <button
              type="button"
              className="ml-4 px-3 py-1 bg-orange-600 rounded text-white"
              onClick={() => handleCopy(data.targetUrl)}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
        {countdown !== null && (
          <div className="mb-4 text-yellow-200 text-lg">Expires in: <span className="font-mono">{countdown}s</span></div>
        )}
        {data?.maxViews && (
          <div className="mb-2 text-orange-200">Burns after <span className="font-mono">{data.maxViews}</span> views</div>
        )}
        {data?.clicks !== undefined && data?.analyticsEnabled && (
          <div className="mb-2 text-white">Accesses: <span className="font-mono">{data.clicks}</span></div>
        )}
        {data?.burned && <div className="mt-4 text-red-400 font-bold">This link has been burned.</div>}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto mt-16 mb-10 text-center text-gray-400 text-sm font-ui relative">
        <div className="w-full h-px bg-gradient-to-r from-amber-400/40 via-gray-700 to-amber-400/40 mb-6"></div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
          <span className="flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline-block text-amber-400"><path d="M12 2v2m0 16v2m8-10h2M2 12H4m15.07-7.07l1.41 1.41M4.93 19.07l1.41-1.41m0-12.32L4.93 4.93m14.14 14.14l-1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            © 2025 Anor. Burn wisely.
          </span>
          <span className="opacity-70 hover:opacity-100 transition-opacity duration-200">Interested in other projects? Check out
            <a href="https://statepulse.me" className="text-amber-400 hover:underline"> https://statepulse.me</a>
          </span>
        </div>
      </footer>
    </>
  );
}
