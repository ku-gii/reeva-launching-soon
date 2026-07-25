export default function ReevaLogo({ compact = false, className = '' }) {
  return (
    <div className={`reeva-logo ${compact ? 'reeva-logo--compact' : ''} ${className}`.trim()} aria-label="REEVA">
      <svg className="reeva-logo__mark" viewBox="0 0 120 120" aria-hidden="true">
        <path className="reeva-logo__lotus" d="M60 11c8 12 15 21 28 27-10 3-18 9-28 18-10-9-18-15-28-18 13-6 20-15 28-27Z" />
        <path className="reeva-logo__lotus-inner" d="M60 22c3 8 4 15 0 25-4-10-3-17 0-25Zm-15 11c8 3 13 8 15 14-8-3-13-7-15-14Zm30 0c-8 3-13 8-15 14 8-3 13-7 15-14Z" />
        <path className="reeva-logo__r" d="M36 101V48h26c16 0 27 9 27 23 0 10-6 18-16 22l19 8H75L58 93H50v8H36Zm14-20h11c8 0 13-4 13-10s-5-10-13-10H50v20Z" />
      </svg>
      <div className="reeva-logo__wording">
        <span className="reeva-logo__wordmark">REEVA</span>
        {!compact && <span className="reeva-logo__tagline">Touch of Magic</span>}
      </div>
    </div>
  )
}
