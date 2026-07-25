import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SceneFrame from './SceneFrame'
import BrandLogo from './BrandLogo'

gsap.registerPlugin(useGSAP)

export default function SubscriptionExperience({ onConfirmed }) {
  const root = useRef(null)
  const [submitting, setSubmitting] = useState(false)

  useGSAP(
    () => {
      gsap.from('.access-card', {
        opacity: 0,
        y: 30,
        scale: 0.94,
        duration: 0.9,
        ease: 'power3.out',
      })
    },
    { scope: root },
  )

  const submit = (event) => {
    event.preventDefault()
    if (submitting) return

    const form = event.currentTarget
    if (!form.reportValidity()) return

    setSubmitting(true)

    const timeline = gsap.timeline({
      onComplete: onConfirmed,
    })

    timeline
      .to('.submit-button', {
        scale: 0.97,
        duration: 0.16,
        ease: 'power2.out',
      })
      .to('.spark-burst i', {
        opacity: 1,
        scale: 1,
        x: () => gsap.utils.random(-155, 155),
        y: () => gsap.utils.random(-125, 125),
        rotation: () => gsap.utils.random(-180, 180),
        stagger: 0.018,
        duration: 0.75,
        ease: 'power3.out',
      })
      .to(
        '.access-card',
        {
          opacity: 0,
          y: -20,
          scale: 0.96,
          duration: 0.55,
          ease: 'power2.in',
        },
        '-=0.2',
      )
  }

  return (
    <div ref={root} className="subscription-experience">
      <SceneFrame
        image="./assets/phase-5.webp"
        className="subscription-stage"
        label="Exclusive access form"
      >
        <form className="access-card" onSubmit={submit}>
          <BrandLogo className="form-logo" />
          <span className="eyebrow">Exclusive Access</span>
          <h2>
            Be the First to Unveil
            <strong>the REEVA Royal Collection.</strong>
          </h2>

          <label>
            <span>Email address</span>
            <input
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Email Address"
              required
            />
          </label>

          <label>
            <span>Phone number</span>
            <div className="phone-control">
              <select name="countryCode" aria-label="Country code" defaultValue="+60">
                <option value="+60">🇲🇾 +60</option>
                <option value="+65">🇸🇬 +65</option>
                <option value="+91">🇮🇳 +91</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+1">🇺🇸 +1</option>
              </select>
              <input
                type="tel"
                name="phone"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Phone Number"
                minLength="7"
                required
              />
            </div>
          </label>

          <button className="primary-button submit-button" type="submit" disabled={submitting}>
            {submitting ? 'Preparing your invitation…' : 'Request Exclusive Access'}
          </button>

          <small>Your information is private and will only be used to notify you at launch.</small>
          <div className="spark-burst" aria-hidden="true">
            {Array.from({ length: 26 }, (_, index) => <i key={index} />)}
          </div>
        </form>
      </SceneFrame>
    </div>
  )
}
