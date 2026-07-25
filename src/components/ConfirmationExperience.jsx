import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SceneFrame from './SceneFrame'
import BrandLogo from './BrandLogo'

gsap.registerPlugin(useGSAP)

export default function ConfirmationExperience({ onRestart }) {
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.from('.confirmation-card', {
        opacity: 0,
        scale: 0.82,
        y: 24,
        duration: 0.95,
        ease: 'back.out(1.35)',
      })

      gsap.from('.confirmation-card > *', {
        opacity: 0,
        y: 12,
        stagger: 0.1,
        duration: 0.55,
        ease: 'power2.out',
        delay: 0.3,
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="confirmation-experience">
      <SceneFrame
        image="./assets/phase-6.webp"
        className="confirmation-stage"
        label="Subscription confirmed"
      >
        <div className="confirmation-card">
          <BrandLogo className="confirmation-logo" />
          <span className="confirmation-check">✓</span>
          <h2>Your presence is requested.</h2>
          <p>REEVA will notify you at launch.</p>
          <button className="text-button" type="button" onClick={onRestart}>
            Replay the invitation
          </button>
        </div>
      </SceneFrame>
    </div>
  )
}
