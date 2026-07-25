import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react'
import RoyalEnvelope from './components/RoyalEnvelope'
import PalaceScene from './components/PalaceScene'
import SubscriptionPanel from './components/SubscriptionPanel'

const PHASES = {
  SEALED: 'sealed',
  OPENING: 'opening',
  INVITATION: 'invitation',
  PORTAL: 'portal',
  PALACE: 'palace',
  FORM: 'form',
  CONFIRMED: 'confirmed',
}

export default function App() {
  const [phase, setPhase] = useState(PHASES.SEALED)
  const [busy, setBusy] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' })
  }, [])

  const unseal = useCallback(() => {
    if (busy || phase !== PHASES.SEALED) return
    setBusy(true)
    setPhase(PHASES.OPENING)
    window.setTimeout(() => {
      setPhase(PHASES.INVITATION)
      setBusy(false)
    }, 1850)
  }, [busy, phase])

  const enterPortal = useCallback(() => {
    if (busy) return
    setBusy(true)
    setPhase(PHASES.PORTAL)
    window.setTimeout(() => {
      setPhase(PHASES.PALACE)
      setBusy(false)
    }, 2100)
  }, [busy])

  const openForm = useCallback(() => setPhase(PHASES.FORM), [])
  const confirm = useCallback(() => setPhase(PHASES.CONFIRMED), [])
  const restart = useCallback(() => setPhase(PHASES.SEALED), [])

  const showEnvelope = [PHASES.SEALED, PHASES.OPENING, PHASES.INVITATION].includes(phase)
  const showPalace = [PHASES.PALACE, PHASES.FORM, PHASES.CONFIRMED].includes(phase)

  return (
    <main ref={rootRef} className={`app phase-${phase}`}>
      <div className="spring-sky" aria-hidden="true" />
      <div className="sun-glow" aria-hidden="true" />
      <PetalField />
      <GoldDust />

      <header className="brand-header">
        <img src="./reeva-logo.png" alt="REEVA" className="header-logo" />
        <div className="header-copy">
          <span>House of REEVA</span>
          <strong>Launching Soon</strong>
        </div>
      </header>

      <section className="stage" aria-live="polite">
        {showEnvelope && (
          <RoyalEnvelope
            phase={phase}
            onUnseal={unseal}
            onEnter={enterPortal}
          />
        )}

        {phase === PHASES.PORTAL && <PortalTransition />}

        {showPalace && (
          <PalaceScene phase={phase} onContinue={openForm}>
            {phase === PHASES.FORM && <SubscriptionPanel onSuccess={confirm} />}
            {phase === PHASES.CONFIRMED && <Confirmation onRestart={restart} />}
          </PalaceScene>
        )}
      </section>

      <footer className="footer-mark">
        <Sparkles size={14} />
        <span>Touch of Magic</span>
        <Sparkles size={14} />
      </footer>
    </main>
  )
}

function PetalField() {
  const petals = Array.from({ length: 24 }, (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    delay: `${(index % 9) * -1.6}s`,
    duration: `${10 + (index % 7) * 1.1}s`,
    scale: 0.55 + (index % 5) * 0.14,
  }))

  return (
    <div className="petal-field" aria-hidden="true">
      {petals.map((petal) => (
        <span
          className="petal"
          key={petal.id}
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            transform: `scale(${petal.scale})`,
          }}
        />
      ))}
    </div>
  )
}

function GoldDust() {
  return (
    <div className="gold-dust" aria-hidden="true">
      {Array.from({ length: 40 }, (_, index) => (
        <i key={index} style={{ '--x': `${(index * 29) % 100}%`, '--y': `${(index * 47) % 95}%`, '--d': `${(index % 8) * -0.7}s` }} />
      ))}
    </div>
  )
}

function PortalTransition() {
  return (
    <div className="portal-transition">
      <div className="portal-rings" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
      <img src="./reeva-logo.png" alt="REEVA" className="portal-logo" />
      <p>Step inside the palace</p>
    </div>
  )
}

function Confirmation({ onRestart }) {
  return (
    <div className="confirmation-card">
      <div className="confirmation-ring">✓</div>
      <p className="eyebrow">Your presence is requested</p>
      <h2>REEVA will notify you at launch.</h2>
      <p>Thank you for joining the royal guest list.</p>
      <button className="ghost-button" type="button" onClick={onRestart}>
        <RotateCcw size={17} /> Replay invitation
      </button>
    </div>
  )
}
