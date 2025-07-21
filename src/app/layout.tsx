import type { Metadata } from "next";
import { Cinzel, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

// Import fonts and set CSS variables
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "900"], // Bold for headings
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anor",
  description: "A flame that consumes its links. Burn after reading.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} className="h-full">
      <body
        className={`
          ${cinzel.variable} 
          ${inter.variable} 
          ${jetbrainsMono.variable} 
          h-full bg-gradient-to-br from-black via-gray-900 to-gray-800
        `}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}