import React, { useState } from "react";

interface BurnFormProps {
  onBurn?: (url: string) => void;
}

export default function BurnForm({ onBurn }: BurnFormProps) {
  const [url, setUrl] = useState("");
  const [isBurning, setIsBurning] = useState(false);
  const [error, setError] = useState("");

  const validateUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateUrl(url)) {
      setError("Please enter a valid URL.");
      return;
    }
    setIsBurning(true);
    if (onBurn) onBurn(url);
    setTimeout(() => {
      setIsBurning(false);
      setUrl("");
    }, 2000);
  };

  return (
    <form
      className="w-full flex flex-col gap-4 bg-black/60 rounded-xl p-6 shadow-lg"
      onSubmit={handleSubmit}
      aria-label="Burn a link"
    >
      <label htmlFor="url" className="text-gray-200 font-semibold mb-1 font-ui">
        Enter a URL to burn
      </label>
      <input
        id="url"
        name="url"
        type="url"
        required
        autoComplete="off"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-gray-900 text-gray-100 border border-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-500 transition font-ui"
        placeholder="https://example.com"
        aria-invalid={!!error}
        aria-describedby={error ? "url-error" : undefined}
        disabled={isBurning}
      />
      {error && (
        <span id="url-error" className="text-red-400 text-sm font-output" role="alert">
          {error}
        </span>
      )}
      <button
        type="submit"
        className={`w-full py-2 rounded-lg font-bold text-lg flex items-center justify-center transition
          bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600
          shadow-[0_0_16px_4px_rgba(255,153,0,0.3)]
          text-black
          hover:scale-105 hover:shadow-[0_0_24px_8px_rgba(255,153,0,0.5)]
          focus:outline-none focus:ring-2 focus:ring-amber-400
          ${isBurning ? "opacity-60 cursor-not-allowed" : ""}
          font-ui
        `}
        disabled={isBurning}
        aria-busy={isBurning}
      >
        {isBurning ? (
          <span className="flex items-center gap-2 font-output">
            <svg className="animate-spin h-5 w-5 text-amber-300" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Burning...
          </span>
        ) : (
          <>Burn Link <span aria-hidden>🔥</span></>
        )}
      </button>
    </form>
  );
}
