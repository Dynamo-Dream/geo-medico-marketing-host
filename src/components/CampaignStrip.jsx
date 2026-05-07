import { useEffect, useRef, useState } from 'react'
import styles from './CampaignStrip.module.css'

function CampaignCard({ campaign }) {
  function handleViewMore() {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardImg}>
        {campaign.image_url ? (
          <img src={campaign.image_url} alt={campaign.title} />
        ) : (
          <div className={styles.placeholder}>
            <span>📢</span>
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{campaign.title}</h3>
        <p className={styles.cardDesc}>{campaign.description}</p>
        <button className={styles.viewMore} onClick={handleViewMore}>
          View More →
        </button>
      </div>
    </div>
  )
}

const CARD_W = 296
const GAP = 24

export default function CampaignStrip() {
  const [campaigns, setCampaigns] = useState([])
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    fetch('/api/campaigns')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (Array.isArray(data)) setCampaigns(data) })
      .catch(() => {})
  }, [])

  const total = campaigns.length

  function scrollTo(i) {
    setIdx(i)
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: i * (CARD_W + GAP), behavior: 'smooth' })
    }
  }

  function startTimer() {
    if (total < 2) return
    timerRef.current = setInterval(() => {
      setIdx(prev => {
        const next = (prev + 1) % total
        if (trackRef.current) {
          trackRef.current.scrollTo({ left: next * (CARD_W + GAP), behavior: 'smooth' })
        }
        return next
      })
    }, 4000)
  }

  useEffect(() => {
    if (paused) {
      clearInterval(timerRef.current)
    } else {
      startTimer()
    }
    return () => clearInterval(timerRef.current)
  }, [total, paused])

  function go(dir) {
    const next = (idx + dir + total) % total
    scrollTo(next)
    clearInterval(timerRef.current)
    startTimer()
  }

  if (total === 0) return null

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h2 className={styles.heading}>Our Campaigns</h2>
            <p className={styles.sub}>Initiatives making healthcare accessible across India</p>
          </div>
          <div className={styles.controls}>
            <button
              className={styles.pauseBtn}
              onClick={() => setPaused(p => !p)}
              title={paused ? 'Resume' : 'Pause'}
            >
              {paused ? '▶' : '⏸'}
            </button>
            <button className={styles.arrow} onClick={() => go(-1)} aria-label="Previous">‹</button>
            <button className={styles.arrow} onClick={() => go(1)} aria-label="Next">›</button>
          </div>
        </div>
      </div>

      <div
        className={styles.viewport}
        ref={trackRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={styles.track}>
          {campaigns.map(c => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className={styles.dots}>
          {campaigns.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
              onClick={() => { scrollTo(i); clearInterval(timerRef.current); startTimer() }}
              aria-label={`Campaign ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
