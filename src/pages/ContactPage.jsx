import { useState, useEffect } from 'react'
import styles from './ContactPage.module.css'

function InfoCard({ icon, title, value }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardIcon}>{icon}</div>
      <p className={styles.cardTitle}>{title}</p>
      <p className={styles.cardValue}>{value || '—'}</p>
    </div>
  )
}

export default function ContactPage() {
  const [info, setInfo]   = useState({})
  const [form, setForm]   = useState({ name:'', email:'', phone:'', comment:'' })
  const [status, setStatus] = useState(null) // 'sending' | 'success' | 'error'

  useEffect(() => {
    fetch('/api/contact').then(r => r.json()).then(d => { if (d) setInfo(d) }).catch(() => {})
  }, [])

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name:'', email:'', phone:'', comment:'' })
        setTimeout(() => setStatus(null), 5000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Get in Touch</h1>
        <p className={styles.heroSub}>
          We're here to help! Reach out to us for inquiries, support, or product information.
        </p>
      </div>

      {/* ── Info cards ── */}
      <div className={styles.cardsSection}>
        <div className={styles.cardsGrid}>
          <InfoCard
            title="EMAIL"
            value={info.email || 'info@geomedico.in'}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                <rect x="2" y="4" width="20" height="16" rx="3"/>
                <path d="m22 7-10 7L2 7"/>
              </svg>
            }
          />
          <InfoCard
            title="PHONE"
            value={info.phone || '+91 XXXXX XXXXX'}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.96-.96a2 2 0 0 1 2.12-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            }
          />
          <InfoCard
            title="ADDRESS"
            value={info.address || 'GeoMedico Health Technologies Pvt. Ltd.'}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            }
          />
        </div>
      </div>

      {/* ── Contact form ── */}
      <div className={styles.formSection}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Send Us a Message</h2>
          <p className={styles.formSub}>Fill in the form below and we'll get back to you as soon as possible.</p>

          {status === 'success' && (
            <div className={styles.successMsg}>
              ✓ Message sent successfully! We'll respond within 24 hours.
            </div>
          )}
          {status === 'error' && (
            <div className={styles.errorMsg}>
              Something went wrong. Please try again or email us directly.
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <input
                  type="text" placeholder="Name" required
                  value={form.name} onChange={set('name')}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="email" placeholder="Email" required
                  value={form.email} onChange={set('email')}
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <input
                type="tel" placeholder="Phone"
                value={form.phone} onChange={set('phone')}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <textarea
                placeholder="Comment"
                rows={7} required
                value={form.comment} onChange={set('comment')}
                className={`${styles.input} ${styles.textarea}`}
              />
            </div>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending…' : 'Submit'}
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}
