import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SceneFrame from './SceneFrame'
import BrandLogo from './BrandLogo'

gsap.registerPlugin(useGSAP)

export default function PortalTransition({ onComplete }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        onComplete,
      })

      timeline
        .fromTo(
          '.portal-stage',
          { opacity: 0, scale: 0.82, filter: 'brightness(1.35) blur(7px)' },
          {
            opacity: 1,
            scale: 1,
            filter: 'brightness(1) blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
          },
        )
        .from(
          '.portal-logo',
          {
            opacity: 0,
            scale: 0.62,
            duration: 0.65,
            ease: 'back.out(1.5)',
          },
          '-=0.45',
        )
        .to('.portal-glow', {
          opacity: 0.92,
          scale: 1.4,
          duration: 1.1,
          ease: 'power2.in',
        })
        .to(
          '.portal-stage',
          {
            scale: 3.25,
            opacity: 0,
            filter: 'brightness(1.75) blur(4px)',
            duration: 1.45,
            ease: 'power3.in',
          },
          '-=0.9',
        )
    },
    { scope: root },
  )

  return (
    <div ref={root} className="portal-transition">
      <SceneFrame
        image="./assets/phase-3.webp"
        className="portal-stage"
        label="Portal transition"
      >
        <div className="portal-glow" />
        <div className="portal-logo-panel">
          <BrandLogo className="portal-logo" />
          <span>Touch of Magic</span>
        </div>
      </SceneFrame>
    </div>
  )
}
