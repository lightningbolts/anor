# Anor Burner Link System

A modern burner link system built with Next.js App Router, TypeScript, MongoDB (native driver), and Tailwind CSS.

## Features
- Create burner links for URLs or messages
- Optional password protection (bcryptjs)
- Burn after read, after X seconds, or after X views
- TTL auto-deletion of expired links (MongoDB)
- Glowing ember UI aesthetic (Tailwind CSS)
- Copy-to-clipboard, countdown timer, and toasts
- Analytics: access count (optional)
- Message-only and redirect link support

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment:**
   - Add your MongoDB URI to `.env` as `MONGODB_URI`
3. **Set up MongoDB TTL index:**
   ```bash
   npm run setup:ttl
   # or run src/utils/setupTTLIndex.ts manually
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Usage
- Use the burner link form to create a new link.
- Share the generated burner URL.
- Access the burner link to view the message or redirect.
- Links expire and burn based on your settings.

## Project Structure
- `src/app/api/burn/route.ts` — POST API to create burner links
- `src/app/api/burn/[id]/route.ts` — GET API to access burner links
- `src/app/b/[id]/page.tsx` — Burner link page UI
- `src/components/BurnForm.tsx` — Burner link creation form
- `src/utils/mongoClient.ts` — MongoDB connection utility
- `src/utils/styles.ts` — Shared Tailwind style constants
- `src/utils/setupTTLIndex.ts` — TTL index setup script

## Deployment
Deploy easily on [Vercel](https://vercel.com/). See Next.js docs for details.

## License
MIT
