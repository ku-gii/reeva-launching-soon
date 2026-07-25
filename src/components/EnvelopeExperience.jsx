import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SceneFrame from './SceneFrame'
import BrandLogo from './BrandLogo'

gsap.registerPlugin(useGSAP)

export default function EnvelopeExperience({ onEnterPortal }) {
  const root = useRef(null)
  const [opened, setOpened] = useState(false)
  const timelineRef = useRef(null)

  useGSAP(
    () => {
      gsap.to('.envelope-float', {
        y: -8,
        duration: 2.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      gsap.to('.seal-shine', {
        rotate: 360,
        duration: 9,
        ease: 'none',
        repeat: -1,
      })

      timelineRef.current = gsap
        .timeline({ paused: true, defaults: { overwrite: 'auto' } })
        .to('.phase-one', {
          scale: 1.035,
          filter: 'brightness(1.05)',
          duration: 0.45,
          ease: 'power2.out',
        })
        .to(
          '.custom-seal',
          {
            scale: 1.2,
            rotation: 8,
            duration: 0.2,
            ease: 'power2.out',
          },
          '<',
        )
        .to('.seal-fragment', {
          x: () => gsap.utils.random(-90, 90),
          y: () => gsap.utils.random(-100, 30),
          rotation: () => gsap.utils.random(-160, 160),
          scale: 0.25,
          opacity: 0,
          stagger: 0.025,
          duration: 0.65,
          ease: 'power3.out',
        })
        .to(
          '.phase-one',
          {
            opacity: 0,
            scale: 1.12,
            duration: 0.9,
            ease: 'power3.inOut',
          },
          '-=0.35',
        )
        .fromTo(
          '.phase-two',
          { opacity: 0, scale: 0.94, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.15,
            ease: 'power3.out',
          },
          '-=0.6',
        )
        .from(
          '.invitation-logo',
          {
            opacity: 0,
            scale: 0.76,
            y: 24,
            duration: 0.75,
            ease: 'back.out(1.45)',
          },
          '-=0.55',
        )
        .from(
          '.inside-button',
          {
            opacity: 0,
            y: 18,
            duration: 0.55,
            ease: 'power2.out',
          },
          '-=0.2',
        )
        .eventCallback('onComplete', () => setOpened(true))
    },
    { scope: root },
  )

  const unseal = () => {
    if (!timelineRef.current || timelineRef.current.isActive() || opened) return
    timelineRef.current.play(0)
  }

  return (
    <div ref={root} className={`envelope-experience ${opened ? "is-opened" : ""}`}>
      <SceneFrame
        image="./assets/phase-1.webp"
        className="phase-layer phase-one"
        label="Royal invitation envelope"
      >
        <div className="envelope-float">
          <div className="phase-one-logo-panel">
            <BrandLogo className="phase-one-logo" />
          </div>

          <button className="custom-seal" type="button" onClick={unseal} aria-label="Unseal invitation">
            <span className="seal-shine" />
            <BrandLogo markOnly className="seal-logo" />
            {Array.from({ length: 12 }, (_, index) => (
              <i
                key={index}
                className="seal-fragment"
                style={{ '--fragment-angle': `${index * 30}deg` }}
              />
            ))}
          </button>
        </div>

        <button className="tap-hotspot" type="button" onClick={unseal}>
          <span>Tap to unseal your</span>
          <strong>Royal Invitation</strong>
        </button>
      </SceneFrame>

      <SceneFrame
        image="./assets/phase-2.webp"
        className="phase-layer phase-two"
        label="Invitation unsealed"
      >
        <div className="invitation-brand-panel">
          <BrandLogo className="invitation-logo" />
          <span>Touch of Magic</span>
        </div>

        <button className="inside-button" type="button" onClick={onEnterPortal}>
          Step Inside the Palace
        </button>
      </SceneFrame>
    </div>
  )
}
