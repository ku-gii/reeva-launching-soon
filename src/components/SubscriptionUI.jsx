import { useState } from 'react'
import { ArrowRight, Check, Crown, Mail, Phone, Sparkles } from 'lucide-react'
import ReevaLogo from './ReevaLogo.jsx'

const COUNTRY_CODES = [
  { code: '+60', label: 'MY' },
  { code: '+91', label: 'IN' },
  { code: '+65', label: 'SG' },
  { code: '+971', label: 'AE' },
  { code: '+44', label: 'UK' },
  { code: '+1', label: 'US' },
]

export default function SubscriptionUI({ onCelebrate }) {
  const [form, setForm] = useState({ email: '', countryCode: '+60', phone: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (error) setError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    const email = form.email.trim()
    const phone = form.phone.replace(/[^0-9]/g, '')

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (phone.length < 7) {
      setError('Please enter a valid phone number.')
      return
    }

    setStatus('submitting')
    setError('')

    const payload = {
      email,
      countryCode: form.countryCode,
      phone,
      source: 'REEVA Launching Soon',
    }

    try {
      const endpoint = import.meta.env.VITE_FORM_ENDPOINT

      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error('The invitation request could not be submitted.')
        }
      } else {
        // Demo mode keeps the project functional before a form backend is connected.
        await new Promise((resolve) => window.setTimeout(resolve, 650))
      }

      setStatus('success')
      onCelebrate?.()
    } catch (submissionError) {
      setStatus('idle')
      setError(submissionError.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <section className="subscription-layer" aria-labelledby="subscription-title">
      <div className="subscription-panel">
        <div className="subscription-panel__halo" aria-hidden="true" />
        <div className="subscription-panel__content">
          <div className="subscription-panel__crest" aria-hidden="true">
            <Crown size={22} />
          </div>

          <ReevaLogo className="subscription-panel__logo" />
          <p className="eyebrow">The royal list</p>
          <h1 id="subscription-title">Be the First to Unveil the REEVA Royal Collection.</h1>
          <p className="subscription-panel__intro">
            Request exclusive access to private previews, launch announcements and the first release from the House of REEVA.
          </p>

          {status === 'success' ? (
            <div className="success-state" role="status" aria-live="polite">
              <span className="success-state__icon" aria-hidden="true">
                <Check size={28} strokeWidth={1.8} />
              </span>
              <h2>Your presence is requested.</h2>
              <p>REEVA will notify you at launch.</p>
              <div className="success-state__ornament" aria-hidden="true">
                <span />
                <Sparkles size={18} />
                <span />
              </div>
            </div>
          ) : (
            <form className="subscription-form" onSubmit={submit} noValidate>
              <label className="field">
                <span className="field__label">Email Address</span>
                <span className="field__control">
                  <Mail size={18} aria-hidden="true" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={update}
                    placeholder="yourname@example.com"
                    autoComplete="email"
                    required
                  />
                </span>
              </label>

              <label className="field">
                <span className="field__label">Phone Number</span>
                <span className="field__control field__control--phone">
                  <Phone size={18} aria-hidden="true" />
                  <select
                    name="countryCode"
                    value={form.countryCode}
                    onChange={update}
                    aria-label="Country code"
                  >
                    {COUNTRY_CODES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.label} {country.code}
                      </option>
                    ))}
                  </select>
                  <span className="field__divider" aria-hidden="true" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={update}
                    placeholder="12 345 6789"
                    autoComplete="tel-national"
                    inputMode="tel"
                    required
                  />
                </span>
              </label>

              {error && <p className="form-error" role="alert">{error}</p>}

              <button className="royal-button royal-button--form" type="submit" disabled={status === 'submitting'}>
                <span>{status === 'submitting' ? 'Preparing Your Invitation' : 'Request Exclusive Access'}</span>
                {status === 'submitting' ? <span className="button-loader" aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
              </button>

              <p className="privacy-note">
                By requesting access, you agree to receive REEVA launch updates. You may unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
