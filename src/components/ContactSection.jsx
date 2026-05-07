import { useEffect, useState } from 'react'
import styles from './ContactSection.module.css'

export default function ContactSection() {
  const [info, setInfo] = useState(null)

  useEffect(() => {
    fetch('/api/contact')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (data && (data.email || data.phone || data.address)) setInfo(data) })
      .catch(() => {})
  }, [])

  if (!info) return null

  return (
    <div className={styles.wrap} id="contact">
      <div className="container">
        <div className={styles.head}>
          <h2 className={styles.heading}>Get In Touch</h2>
          <p className={styles.sub}>We're here to help. Reach out to us through any of the channels below.</p>
        </div>
        <div className={styles.grid}>
          {info.email && (
            <a href={`mailto:${info.email}`} className={styles.card}>
              <span className={styles.cardIcon}>📧</span>
              <div className={styles.cardLabel}>Email Us</div>
              <div className={styles.cardValue}>{info.email}</div>
            </a>
          )}
          {info.phone && (
            <a href={`tel:${info.phone.replace(/\s/g, '')}`} className={styles.card}>
              <span className={styles.cardIcon}>📞</span>
              <div className={styles.cardLabel}>Call Us</div>
              <div className={styles.cardValue}>{info.phone}</div>
            </a>
          )}
          {info.address && (
            <div className={styles.card}>
              <span className={styles.cardIcon}>📍</span>
              <div className={styles.cardLabel}>Our Office</div>
              <div className={styles.cardValue}>{info.address}</div>
            </div>
          )}
          {info.working_hours && (
            <div className={styles.card}>
              <span className={styles.cardIcon}>🕐</span>
              <div className={styles.cardLabel}>Working Hours</div>
              <div className={styles.cardValue}>{info.working_hours}</div>
            </div>
          )}
        </div>
        {info.map_url && (
          <a href={info.map_url} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
            📌 View on Google Maps →
          </a>
        )}
      </div>
    </div>
  )
}
