"use client";

import React, { useEffect, useState, useRef } from 'react';
import FAQ from '@/components/FAQ';
import { useParams } from 'next/navigation';
import { emberGlow } from '@/utils/styles';
import { generateKeyFromPassword, decryptString, decodeBase64 } from '@/utils/e2ee';
import Footer from '@/components/Footer';

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
    const fetchEncrypted = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/burn/${id}`);
        const result = await res.json();
        if (!res.ok) {
          setError(result.error || 'Invalid or burned link');
          setLoading(false);
          return;
        }
        setData(result);
        setShowPasswordPrompt(true);
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
    fetchEncrypted();
  }, [id]);

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

  if (loading) {
    return (
      <>
        <div className={`p-8 rounded-xl ${emberGlow} max-w-lg mx-auto mt-20 text-white text-center`}>Loading...</div>
        <Footer />
      </>
    );
  }
  if (error) {
    let burnedMaxViews = false;
    if (data?.burnedReason === 'maxViews' || error.toLowerCase().includes('max views')) {
      burnedMaxViews = true;
    }
    return (
      <>
        <div className="max-w-lg mx-auto mt-10 mb-2 text-center">
          <a href="/" className="inline-block px-4 py-2 rounded bg-yellow-500 text-black font-bold shadow hover:bg-yellow-400 transition-colors duration-150">Create your own burner link.</a>
        </div>
        <div className={`p-8 rounded-xl ${emberGlow} max-w-lg mx-auto mt-20 text-white-600 text-center font-bold`}>
          {burnedMaxViews
            ? 'This link has been burned (maximum views reached).'
            : error}
        </div>
        <Footer />
      </>
    );
  }

  // Password prompt and decryption logic
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!password) {
      setPasswordError('Password required.');
      return;
    }
    try {
      const salt = decodeBase64(data.salt);
      const key = await generateKeyFromPassword(password, salt);
      let decryptedMessage = undefined;
      let decryptedUrl = undefined;
      if (data.message && data.ivMsg) {
        decryptedMessage = await decryptString(data.message, data.ivMsg, key);
      }
      if (data.targetUrl && data.ivUrl) {
        decryptedUrl = await decryptString(data.targetUrl, data.ivUrl, key);
      }
      setData({
        ...data,
        message: decryptedMessage,
        targetUrl: decryptedUrl,
      });
      setShowPasswordPrompt(false);
      setPassword('');
    } catch {
      setPasswordError('Incorrect password or corrupted data.');
    }
  };

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
        ) : (
          <>
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
          </>
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
        {data?.burned && <div className="mt-4 text-white-400 font-bold">This link has been burned.</div>}
      </div>

      <Footer />
    </>
  );
}
