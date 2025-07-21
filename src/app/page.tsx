"use client"
import React, { useState } from "react";
import Heading from "../components/Heading";
import BurnForm from "../components/BurnForm";
import FAQ from "../components/FAQ";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isBurning, setIsBurning] = useState(false);
  const [error, setError] = useState("");

  // Simple URL validation
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
    // Simulate burn process
    setTimeout(() => {
      setIsBurning(false);
      setUrl("");
    }, 2000);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4"
      style={{
        background: "linear-gradient(135deg, #000 0%, #232323 100%)",
      }}
    >
      <main className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
        {/* Title & Description */}
        <header className="text-center">
          <Heading>
            <span className="inline-block animate-fade-in-up text-4xl sm:text-5xl font-bold tracking-tight text-amber-400 drop-shadow-lg relative shimmer-glow">
              Anor
            </span>
          </Heading>
          <p className="text-lg sm:text-xl text-gray-300 font-ui font-medium animate-fade-in-up delay-150">
            A flame that consumes its links.
            <br />
            <span className="text-amber-400 animate-fade-in-up delay-300">Burn after reading.</span>
          </p>
        </header>
        {/* Form */}
        <BurnForm />
        {/* FAQ */}
        <FAQ />
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto mt-16 mb-10 text-center text-gray-400 text-sm font-ui relative">
        <div className="w-full h-px bg-gradient-to-r from-amber-400/40 via-gray-700 to-amber-400/40 mb-6"></div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
          <span className="flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline-block text-amber-400"><path d="M12 2v2m0 16v2m8-10h2M2 12H4m15.07-7.07l1.41 1.41M4.93 19.07l1.41-1.41m0-12.32L4.93 4.93m14.14 14.14l-1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            © 2025 Anor. Burn wisely.
          </span>
          <span className="opacity-70 hover:opacity-100 transition-opacity duration-200">Interested in other projects? Check out
            <a href="https://statepulse.me" className="text-amber-400 hover:underline"> https://statepulse.me</a>
          </span>
        </div>
      </footer>
    </div>
  );
}