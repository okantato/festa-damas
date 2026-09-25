export function RoseGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="rose-gold" x1="8" y1="8" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0e0b0" />
          <stop offset="0.5" stopColor="#c5a059" />
          <stop offset="1" stopColor="#8a6d2f" />
        </linearGradient>
      </defs>
      <path d="M32 55c-9.5-3.8-15.6-11-15.6-18.4C16.4 26.8 23 21 32 21s15.6 5.8 15.6 15.6C47.6 44 41.5 51.2 32 55Z" fill="url(#rose-gold)" opacity=".25" />
      <path d="M32 52c-7.8-3.1-12.8-9-12.8-15.2 0-7.3 5.6-12.1 12.8-12.1s12.8 4.8 12.8 12.1C44.8 43 39.8 48.9 32 52Z" stroke="url(#rose-gold)" strokeWidth="1.6" />
      <path d="M32 44.5c-5.1-2.2-8.3-6.2-8.3-10.4 0-4.9 3.7-8.2 8.3-8.2s8.3 3.3 8.3 8.2c0 4.2-3.2 8.2-8.3 10.4Z" stroke="url(#rose-gold)" strokeWidth="1.6" />
      <path d="M32 37c-3-1.5-4.6-3.8-4.6-6.1 0-2.8 2-4.6 4.6-4.6s4.6 1.8 4.6 4.6c0 2.3-1.6 4.6-4.6 6.1Z" fill="url(#rose-gold)" />
      <path d="M32 8v7M18 13l4 6M46 13l-4 6" stroke="url(#rose-gold)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function RoseDivider({ label }: { label?: string }) {
  return (
    <div className="rose-divider">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c5a059]/50" />
      <RoseGlyph className="h-9 w-9" />
      {label ? <span className="ritual-kicker whitespace-nowrap">{label}</span> : null}
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c5a059]/50" />
    </div>
  );
}
