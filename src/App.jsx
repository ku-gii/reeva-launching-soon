import { useMemo, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useAssetPreloader } from './hooks/useAssetPreloader'
import PetalCanvas from './components/PetalCanvas'
import BrandLogo from './components/BrandLogo'
import EnvelopeExperience from './components/EnvelopeExperience'
import PortalTransition from './components/PortalTransition'
import PalaceExperience from './components/PalaceExperience'
import SubscriptionExperience from './components/SubscriptionExperience'
import ConfirmationExperience from './components/ConfirmationExperience'

gsap.registerPlugin(useGSAP)

const assets = [
  './assets/phase-1.webp',
  './assets/phase-2.webp',
  './assets/phase-3.webp',
  './assets/phase-4.webp',
  './assets/phase-5.webp',
  './assets/phase-6.webp',
  './assets/reeva-logo-final.png',
  './assets/reeva-mark-final.png',
]

export default function App() {
  const stableAssets = useMemo(() => assets, [])
  const { ready, progress } = useAssetPreloader(stableAssets)
  const [phase, setPhase] = useState('invitation')

  if (!ready) {
    return (
      <main className="loading-screen">
        <BrandLogo className="loading-logo" />
        <div className="loading-line">
          <i style={{ width: `${progress}%` }} />
        </div>
        <span>Preparing your royal invitation… {progress}%</span>
      </main>
    )
  }

  return (
    <main className={`app phase-${phase}`}>
      <header className="brand-header">
        <BrandLogo className="header-logo" />
        <div>
          <span>House of REEVA</span>
          <strong>Launching Soon</strong>
        </div>
      </header>

      <PetalCanvas intensity={phase === 'portal' ? 1.35 : 0.9} />

      <div className="experience-shell">
        {phase === 'invitation' && (
          <EnvelopeExperience onEnterPortal={() => setPhase('portal')} />
        )}

        {phase === 'portal' && (
          <PortalTransition onComplete={() => setPhase('palace')} />
        )}

        {phase === 'palace' && (
          <PalaceExperience onContinue={() => setPhase('form')} />
        )}

        {phase === 'form' && (
          <SubscriptionExperience onConfirmed={() => setPhase('confirmed')} />
        )}

        {phase === 'confirmed' && (
          <ConfirmationExperience onRestart={() => setPhase('invitation')} />
        )}
      </div>

      <footer className="brand-footer">
        <span>Touch of Magic</span>
        <i />
        <span>REEVA © 2026</span>
      </footer>
    </main>
  )
}
