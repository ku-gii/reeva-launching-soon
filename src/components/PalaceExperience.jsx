import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SceneFrame from './SceneFrame'

gsap.registerPlugin(useGSAP)

export default function PalaceExperience({ onContinue }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const media = gsap.matchMedia()

      media.add(
        {
          normal: '(prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { normal } = context.conditions

          gsap.from('.palace-stage', {
            opacity: 0,
            scale: normal ? 1.08 : 1,
            duration: normal ? 1.35 : 0.25,
            ease: 'power3.out',
          })

          gsap.from('.palace-copy > *', {
            opacity: 0,
            y: normal ? 24 : 0,
            stagger: normal ? 0.12 : 0,
            duration: normal ? 0.8 : 0.2,
            ease: 'power3.out',
            delay: 0.25,
          })

          if (normal) {
            gsap.to('.palace-art', {
              scale: 1.035,
              duration: 8,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
            })
            gsap.to('.left-silk', {
              x: 7,
              rotation: 0.8,
              duration: 4.5,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
            })
            gsap.to('.right-silk', {
              x: -7,
              rotation: -0.8,
              duration: 5.1,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
            })
            gsap.to('.water-light', {
              backgroundPositionX: '180%',
              duration: 7,
              ease: 'none',
              repeat: -1,
            })
          }
        },
      )

      return () => media.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className="palace-experience">
      <SceneFrame
        image="./assets/phase-4.webp"
        className="palace-stage"
        label="Magical palace courtyard"
      >
        <div className="palace-art" />
        <div className="silk-overlay left-silk" />
        <div className="silk-overlay right-silk" />
        <div className="water-light" />

        <div className="palace-copy">
          <span className="eyebrow">Welcome to the House of REEVA</span>
          <h1>A New Royal Chapter Begins Soon.</h1>
          <p>Timeless. Graceful. Unapologetically you.</p>
          <button type="button" className="primary-button" onClick={onContinue}>
            Request Exclusive Access
          </button>
        </div>
      </SceneFrame>
    </div>
  )
}
