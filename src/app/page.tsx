"use client"
import React, { useState } from "react";
import Heading from "../components/Heading";
import BurnForm from "../components/BurnForm";
import FAQ from "../components/FAQ";
import Footer from "@/components/Footer";

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
    >
      <main className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
        <header className="text-center mt-12">
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
        <BurnForm />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}