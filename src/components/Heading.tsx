import React from "react";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export default function Heading({ children, className = "" }: HeadingProps) {
  return (
    <h1
      className={`font-heading text-4xl sm:text-5xl font-extrabold text-amber-500 glow tracking-tight mb-2 text-center ${className}`}
    >
      {children}
    </h1>
  );
}
