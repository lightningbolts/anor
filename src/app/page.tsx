"use client"
import React, { useState } from "react";
import Heading from "../components/Heading";
import BurnForm from "../components/BurnForm";

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
          <Heading>Anor</Heading>
          <p className="text-lg sm:text-xl text-gray-300 font-ui font-medium">
            A flame that consumes its links.
            <br />
            <span className="text-amber-400">Burn after reading.</span>
          </p>
        </header>
        {/* Form */}
        <BurnForm />
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm opacity-70 font-ui">
        © 2025 Anor. Burn wisely.
      </footer>
    </div>
  );
}