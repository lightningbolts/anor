export default function Footer() {
  return (
    <footer className="w-full max-w-md mx-auto mt-16 mb-10 text-center text-gray-400 text-sm font-ui relative">
      <div className="w-full h-px bg-gradient-to-r from-amber-400/40 via-gray-700 to-amber-400/40 mb-6"></div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
        <span className="flex items-center gap-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline-block text-amber-400"><path d="M12 2v2m0 16v2m8-10h2M2 12H4m15.07-7.07l1.41 1.41M4.93 19.07l1.41-1.41m0-12.32L4.93 4.93m14.14 14.14l-1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          © 2025 Anor. Burn wisely.
        </span>
        <span className="opacity-70 hover:opacity-100 transition-opacity duration-200 flex flex-col sm:flex-row gap-2 items-center">
          <span>
            Interested in other projects? Check out
            <a href="https://statepulse.me" className="text-amber-400 hover:underline"> https://statepulse.me</a>
          </span>
          <a
            href="https://github.com/lightningbolts/anor"
            className="text-amber-400 hover:underline ml-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </span>
      </div>
    </footer>
  );
}
