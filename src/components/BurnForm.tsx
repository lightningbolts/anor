import React, { useState } from "react";
import { emberGlow } from "@/utils/styles";

export default function BurnForm() {
  const [targetUrl, setTargetUrl] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [burnAfterSeconds, setBurnAfterSeconds] = useState(300);
  const [burnAfterRead, setBurnAfterRead] = useState(true);
  const [maxViews, setMaxViews] = useState<number | "">("");
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [burnerUrl, setBurnerUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setBurnerUrl("");
    try {
      const res = await fetch("/api/burn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUrl: targetUrl || undefined,
          message: message || undefined,
          password: password || undefined,
          burnAfterSeconds,
          burnAfterRead,
          maxViews: maxViews === "" ? undefined : maxViews,
          analyticsEnabled,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBurnerUrl(data.url);
      } else {
        setError(data.error || "Error creating burner link");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <form
      className={`p-8 rounded-xl ${emberGlow} max-w-lg mx-auto`}
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
        Create Burner Link
      </h2>
      <div className="mb-4">
        <label className="block text-white mb-2">Target URL</label>
        <input
          type="url"
          className="w-full p-2 rounded bg-black bg-opacity-40 text-white"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Message (optional)</label>
        <textarea
          className="w-full p-2 rounded bg-black bg-opacity-40 text-white"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Show a message instead of redirect"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Password (optional)</label>
        <input
          type="password"
          className="w-full p-2 rounded bg-black bg-opacity-40 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Protect with password"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Burn After Seconds</label>
        <input
          type="number"
          min={10}
          max={86400}
          className="w-full p-2 rounded bg-black bg-opacity-40 text-white"
          value={burnAfterSeconds}
          onChange={(e) =>
            setBurnAfterSeconds(Number(e.target.value))
          }
        />
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={burnAfterRead}
          onChange={(e) => setBurnAfterRead(e.target.checked)}
          className="mr-2"
        />
        <span className="text-white">Burn After Read</span>
      </div>
      <div className="mb-4">
        <span className="text-yellow-300">Tip: Fill either Target URL or Message. If both are filled, Message will be shown instead of redirect.</span>
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Max Views (optional)</label>
        <input
          type="number"
          min={1}
          className="w-full p-2 rounded bg-black bg-opacity-40 text-white"
          value={maxViews}
          onChange={(e) =>
            setMaxViews(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder="Burn after X views"
        />
        <span className="text-orange-300 text-xs">Link will burn after this many accesses.</span>
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={analyticsEnabled}
          onChange={(e) => setAnalyticsEnabled(e.target.checked)}
          className="mr-2"
        />
        <span className="text-white">Show Access Count (analytics)</span>
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded bg-yellow-500 text-black font-bold text-xl shadow-lg hover:bg-orange-600 transition"
      >
        {loading ? "Burning..." : "Create Burner Link"}
      </button>
      {burnerUrl && (
        <div className="mt-6 p-4 bg-black bg-opacity-60 rounded text-white text-center">
          <span className="block mb-2">Burner Link:</span>
          <a
            href={burnerUrl}
            className="font-mono text-lg underline break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {burnerUrl}
          </a>
          <button
            type="button"
            className="ml-4 px-3 py-1 bg-orange-600 rounded text-white"
            onClick={() => navigator.clipboard.writeText(burnerUrl)}
          >
            Copy
          </button>
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-400 font-bold">{error}</div>
      )}
    </form>
  );
}
