import { useEffect, useState } from 'react'
import styles from './Footer.module.css'

const SERVICE_LINKS   = ['Find a Doctor', 'Book Lab Tests', 'Order Medicines', 'Emergency Ambulance', 'Virtual Consultation', 'POD Kiosks']
const PROVIDER_LINKS  = ['Join as Doctor', 'Hospital Onboarding', 'Pharmacy Partner', 'Diagnostic Lab Partner', 'Ambulance Fleet Partner']
const PAGE_LINKS      = ['Home', 'Services', 'About', 'Network', 'Contact']
const SUPPORT_LINKS   = ['Help Centre', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'Grievance Redressal', 'DISHA Compliance']

const SOCIALS = [
  { key: 'youtube_url',   label: 'YouTube',   icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.8 15.5V8.5l6.3 3.5-6.3 3.5z"/>
    </svg>
  )},
  { key: 'linkedin_url',  label: 'LinkedIn',  icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
    </svg>
  )},
  { key: 'twitter_url',   label: 'X',         icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )},
  { key: 'instagram_url', label: 'Instagram', icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )},
]

export default function Footer() {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(setSettings)
      .catch(() => {})
  }, [])

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          {/* Brand column */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="GeoMedico" className={styles.logoImg} />
              ) : (
                <img src="/logo.jpg" alt="GeoMedico" className={styles.logoImg}
                  onError={e => { e.target.style.display='none' }} />
              )}
              <div>
                <div className={styles.logoName}>GeoMedico</div>
                <div className={styles.logoTag}>Healthcare Ecosystem</div>
              </div>
            </div>
            <p className={styles.tagline}>
              Connecting every Indian to quality healthcare — from the nearest clinic to the farthest village.
              Powered by AI. Driven by humanity.
            </p>
            <div className={styles.certBadges}>
              <span className={styles.cert}>✅ NABH Compliant</span>
              <span className={styles.cert}>🔒 ISO 27001</span>
              <span className={styles.cert}>🏥 DISHA Act</span>
              <span className={styles.cert}>♿ Accessible</span>
            </div>
            {/* Social icons — hardcoded icons, links from admin */}
            <div className={styles.socials}>
              {SOCIALS.map(s => (
                <a
                  key={s.key}
                  href={settings[s.key] || '#'}
                  className={styles.social}
                  aria-label={s.label}
                  target={settings[s.key] ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className={styles.links}>
            {/* Services */}
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Services</h4>
              <ul>{SERVICE_LINKS.map(item => <li key={item}><a href="#">{item}</a></li>)}</ul>
            </div>

            {/* For Providers */}
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>For Providers</h4>
              <ul>{PROVIDER_LINKS.map(item => <li key={item}><a href="#">{item}</a></li>)}</ul>
            </div>

            {/* Pages — nav pages */}
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Pages</h4>
              <ul>{PAGE_LINKS.map(item => <li key={item}><a href={`#${item.toLowerCase()}`}>{item}</a></li>)}</ul>
            </div>

            {/* Support */}
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Support</h4>
              <ul>{SUPPORT_LINKS.map(item => <li key={item}><a href="#">{item}</a></li>)}</ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 GeoMedico Health Technologies Pvt. Ltd. All rights reserved. CIN: U85100MH2020PTC123456</p>
          <div className={styles.stores}>
            <button className={styles.storeBtn}>
              <span>▶</span>
              <div>
                <div className={styles.storeSub}>Get it on</div>
                <div className={styles.storeName}>Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
