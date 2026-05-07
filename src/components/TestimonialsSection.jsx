import { useEffect, useState } from 'react'
import styles from './TestimonialsSection.module.css'

function Stars({ rating }) {
  return (
    <div className={styles.stars}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= rating ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  )
}

function TestimonialCard({ t }) {
  const initials = t.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className={styles.card}>
      <div className={styles.quote}>"</div>
      <p className={styles.content}>{t.content}</p>
      <Stars rating={t.rating} />
      <div className={styles.author}>
        <div className={styles.avatar}>
          {t.image_url
            ? <img src={t.image_url} alt={t.name} />
            : <span>{initials}</span>}
        </div>
        <div>
          <div className={styles.name}>{t.name}</div>
          {t.role && <div className={styles.role}>{t.role}</div>}
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (Array.isArray(data)) setTestimonials(data) })
      .catch(() => {})
  }, [])

  if (testimonials.length === 0) return null

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <h2 className={styles.heading}>What People Say</h2>
          <p className={styles.sub}>Real experiences from patients and healthcare partners across India</p>
        </div>
        <div className={styles.grid}>
          {testimonials.map(t => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
