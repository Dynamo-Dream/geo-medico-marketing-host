import { useEffect, useState } from 'react'
import styles from './StatsStrip.module.css'

const FALLBACK = [
  { id: 1, value: '50M+',      label: 'Patients Served',        icon: '👥' },
  { id: 2, value: '1,20,000+', label: 'Verified Doctors',       icon: '👨‍⚕️' },
  { id: 3, value: '8,500+',    label: 'Hospitals On Network',   icon: '🏥' },
  { id: 4, value: '25,000+',   label: 'Pharmacies & Labs',      icon: '💊' },
  { id: 5, value: '4 Min',     label: 'Avg Ambulance Response', icon: '🚑' },
  { id: 6, value: '500+',      label: 'Cities Covered',         icon: '🌍' },
]

export default function StatsStrip() {
  const [stats, setStats] = useState(FALLBACK)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (Array.isArray(data) && data.length) setStats(data) })
      .catch(() => {})
  }, [])

  return (
    <section className={styles.strip}>
      <div className="container">
        <div className={styles.grid}>
          {stats.map(s => (
            <div key={s.id} className={styles.item}>
              <span className={styles.icon}>{s.icon}</span>
              <div className={styles.value}>{s.value}</div>
              <div className={styles.label}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
