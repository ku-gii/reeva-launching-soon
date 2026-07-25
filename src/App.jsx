import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, Gem, Sparkles } from 'lucide-react'
import Scene from './components/Scene.jsx'
import ReevaLogo from './components/ReevaLogo.jsx'
import SubscriptionUI from './components/SubscriptionUI.jsx'

const PHASE = {
  SEALED: 'sealed',
  OPENING: 'opening',
  REVEALED: 'revealed',
  PORTAL: 'portal',
  PALACE: 'palace',
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  return reduced
}

export default function App() {
  const [phase, setPhase] = useState(PHASE.SEALED)
  const [celebrationSignal, setCelebrationSignal] = useState(0)
  const reducedMotion = useReducedMotion()

  const unseal = useCallback(() => {
    if (phase !== PHASE.SEALED) return
    setPhase(PHASE.OPENING)
  }, [phase])

  const enterPalace = useCallback(() => {
    if (phase !== PHASE.REVEALED) return
    setPhase(PHASE.PORTAL)
  }, [phase])

  const handleEnvelopeOpened = useCallback(() => {
    setPhase((current) => (current === PHASE.OPENING ? PHASE.REVEALED : current))
  }, [])

  const handlePortalComplete = useCallback(() => {
    setPhase(PHASE.PALACE)
  }, [])

  const celebrate = useCallback(() => {
    setCelebrationSignal((value) => value + 1)
  }, [])

  const isPalace = phase === PHASE.PALACE

  return (
    <main className={`app app--${phase}`}>
      <div className="app__backdrop" aria-hidden="true" />

      <Scene
        phase={phase}
        reducedMotion={reducedMotion}
        celebrationSignal={celebrationSignal}
        onEnvelopeOpened={handleEnvelopeOpened}
        onPortalComplete={handlePortalComplete}
      />

      <header className="topbar">
        <ReevaLogo compact />
        <div className="topbar__status">
          <Gem size={14} aria-hidden="true" />
          <span>Launching Soon</span>
        </div>
      </header>

      {!isPalace && (
        <section className={`invitation-layer invitation-layer--${phase}`} aria-live="polite">
          {phase === PHASE.SEALED && (
            <div className="hero-copy">
              <p className="eyebrow">A royal invitation awaits</p>
              <h1>Where heritage meets a touch of magic.</h1>
              <p className="hero-copy__body">
                Enter the world of REEVA — an upcoming expression of luxury Indian fashion, modern femininity and regal craft.
              </p>
              <button className="royal-button royal-button--primary" type="button" onClick={unseal}>
                <Sparkles size={18} aria-hidden="true" />
                <span>Tap to Unseal Your Royal Invitation</span>
              </button>
            </div>
          )}

          {phase === PHASE.OPENING && (
            <div className="opening-copy" role="status">
              <span className="opening-copy__spark" aria-hidden="true">✦</span>
              Unsealing your invitation
              <span className="opening-copy__dots" aria-hidden="true">...</span>
            </div>
          )}

          {phase === PHASE.REVEALED && (
            <article className="invitation-card-ui">
              <span className="invitation-card-ui__corner invitation-card-ui__corner--tl" aria-hidden="true" />
              <span className="invitation-card-ui__corner invitation-card-ui__corner--tr" aria-hidden="true" />
              <span className="invitation-card-ui__corner invitation-card-ui__corner--bl" aria-hidden="true" />
              <span className="invitation-card-ui__corner invitation-card-ui__corner--br" aria-hidden="true" />

              <p className="eyebrow eyebrow--dark">By royal request</p>
              <ReevaLogo />
              <p className="invitation-card-ui__message">
                Be among the first to witness a new collection shaped by Indian splendour and contemporary elegance.
              </p>
              <button className="royal-button royal-button--dark" type="button" onClick={enterPalace}>
                <span>Step Inside the Palace</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </article>
          )}

          {phase === PHASE.PORTAL && (
            <div className="portal-copy" role="status">
              <span>Entering the House of REEVA</span>
              <div className="portal-copy__line" aria-hidden="true" />
            </div>
          )}
        </section>
      )}

      {isPalace && <SubscriptionUI onCelebrate={celebrate} />}

      <footer className="footer-note">
        <span>REEVA</span>
        <span aria-hidden="true">•</span>
        <span>Luxury Indian Fashion</span>
      </footer>

      <div className="portal-veil" aria-hidden="true" />
    </main>
  )
}
