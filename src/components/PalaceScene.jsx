import { ArrowRight } from 'lucide-react'

export default function PalaceScene({ phase, onContinue, children }) {
  const overlayOpen = phase === 'form' || phase === 'confirmed'

  return (
    <div className={`palace-scene ${overlayOpen ? 'has-overlay' : ''}`}>
      <div className="palace-sun" />
      <div className="palace-cloud cloud-one" />
      <div className="palace-cloud cloud-two" />
      <div className="bougainvillea left-bloom" />
      <div className="bougainvillea right-bloom" />

      <div className="palace-building" aria-hidden="true">
        <div className="dome dome-left" />
        <div className="dome dome-centre" />
        <div className="dome dome-right" />
        <div className="palace-level upper-level">
          {Array.from({ length: 7 }, (_, i) => <i key={i} className="arch small-arch" />)}
        </div>
        <div className="palace-level lower-level">
          {Array.from({ length: 5 }, (_, i) => <i key={i} className="arch large-arch" />)}
        </div>
      </div>

      <div className="curtain curtain-left" />
      <div className="curtain curtain-right" />

      <div className="water-court" aria-hidden="true">
        <div className="water-glint" />
        {Array.from({ length: 7 }, (_, i) => <i className="floating-lotus" key={i} style={{ left: `${10 + i * 13}%`, animationDelay: `${i * -0.6}s` }} />)}
      </div>

{phase === 'palace' && (
  <div className="palace-intro">
    <span className="eyebrow">Welcome to REEVA</span>
    <h1>A new royal chapter begins soon.</h1>
    <p>Be among the first to discover our debut collection.</p>

    <button
      className="primary-button"
      type="button"
      onClick={onContinue}
    >
      Request Exclusive Access <ArrowRight size={17} />
    </button>
  </div>
)}

{overlayOpen && (
  <div className="palace-overlay">
    {children}
  </div>
)}
