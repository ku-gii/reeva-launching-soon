import { ArrowRight, MousePointerClick } from "lucide-react"

export default function RoyalEnvelope({ phase, onUnseal, onEnter }) {
  const isOpening = phase === 'opening'
  const isInvitation = phase === 'invitation'

  return (
    <div className={`invitation-scene ${isOpening ? 'is-opening' : ''} ${isInvitation ? 'is-open' : ''}`}>
      <div className="scene-title">
        <span className="eyebrow">A Royal Invitation</span>
        <h1>Something magical is about to bloom.</h1>
        <p>From the House of REEVA</p>
      </div>

      <div className="envelope-wrap">
        <div className="envelope-shadow" />
        <div className="envelope">
          <div className="envelope-back" />
          <div className="envelope-lining" />

          <article className="invitation-card">
            <div className="card-border">
              <img src="./reeva-logo.png" alt="REEVA final logo" className="card-logo" />
              <div className="card-divider" />
              <p className="card-kicker">You are invited to witness</p>
              <h2>The unveiling of the REEVA Royal Collection</h2>
              <p className="card-copy">Timeless grace, Indian artistry and a touch of magic — arriving soon.</p>
              <button className="primary-button" type="button" onClick={onEnter}>
                Step Inside the Palace <ArrowRight size={17} />
              </button>
            </div>
          </article>

          <div className="envelope-front-left" />
          <div className="envelope-front-right" />
          <div className="envelope-front-bottom" />
          <div className="envelope-flap" />

          <button className="seal-button" type="button" onClick={onUnseal} aria-label="Unseal the REEVA royal invitation">
            <span className="seal-aura" />
            <span className="seal-core">
              <img src="./reeva-logo.png" alt="" />
            </span>
          </button>
        </div>
      </div>

      {!isInvitation && (
        <button className="unseal-prompt" type="button" onClick={onUnseal} disabled={isOpening}>
          <MousePointerClick size={20} />
          <span>{isOpening ? 'Unsealing your invitation…' : 'Tap to unseal your royal invitation'}</span>
        </button>
      )}
    </div>
  )
}
