"use client";

import React, { useEffect, useState } from 'react';
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async (pw?: string) => {
    setLoading(true);
    setError('');
    let url = `/api/burn/${id}`;
    if (pw) url += `?password=${encodeURIComponent(pw)}`;
    try {
      const res = await fetch(url);
      const result = await res.json();
      if (res.status === 401) {
        setShowPasswordPrompt(true);
        setLoading(false);
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

  if (loading) return <div className={`p-8 rounded-xl ${emberGlow} max-w-lg mx-auto mt-20 text-white text-center`}>Loading...</div>;
  if (error) return <div className={`p-8 rounded-xl ${emberGlow} max-w-lg mx-auto mt-20 text-red-400 text-center font-bold`}>{error}</div>;

  return (
    <div className={`p-8 rounded-xl ${emberGlow} max-w-lg mx-auto mt-20`}>
      {showPasswordPrompt ? (
        <form onSubmit={handlePasswordSubmit} className="mb-6">
          <label className="block text-white mb-2">Password Required</label>
          <input type="password" className="w-full p-2 rounded bg-black bg-opacity-40 text-white mb-2" value={password} onChange={e => setPassword(e.target.value)} />
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
          <button type="button" className="ml-4 px-3 py-1 bg-orange-600 rounded text-white" onClick={() => {navigator.clipboard.writeText(data.targetUrl);setCopied(true);setTimeout(()=>setCopied(false),1500);}}>{copied ? 'Copied!' : 'Copy'}</button>
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
  );
}
