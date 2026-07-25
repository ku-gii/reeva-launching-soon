import { useState } from 'react'
import { Mail, Phone, Sparkles } from 'lucide-react'

export default function SubscriptionPanel({ onSuccess }) {
  const [form, setForm] = useState({ email: '', phone: '' })
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const emailOk = /^\S+@\S+\.\S+$/.test(form.email)
    const phoneOk = /^[+\d][\d\s-]{7,}$/.test(form.phone)

    if (!emailOk || !phoneOk) {
      setError('Please enter a valid email address and phone number.')
      return
    }

    setError('')
    onSuccess()
  }

  return (
    <form className="subscription-card" onSubmit={submit}>
      <img src="./reeva-logo.png" alt="REEVA" className="form-logo" />
      <span className="eyebrow">Exclusive Access</span>
      <h2>Be the first to unveil the REEVA Royal Collection.</h2>
      <p>Join our private guest list and receive the launch announcement.</p>

      <label>
        <Mail size={18} />
        <input
          type="email"
          placeholder="Email address"
          autoComplete="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
      </label>

      <label>
        <Phone size={18} />
        <span className="country-code">+60</span>
        <input
          type="tel"
          placeholder="Phone number"
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
          required
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button className="primary-button form-submit" type="submit">
        Request Exclusive Access <Sparkles size={17} />
      </button>
      <small>Your details will only be used for the REEVA launch announcement.</small>
    </form>
  )
}
