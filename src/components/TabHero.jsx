import styles from './TabHero.module.css'

export default function TabHero({ badge, badgeColor, heading, subheading, desc, emoji, accent, tags = [], urgent }) {
  const isRed = badgeColor === 'red' || urgent
  return (
    <section
      className={styles.hero}
      style={{
        '--accent': accent,
        background: isRed
          ? 'linear-gradient(135deg, #1a0505 0%, #2d0a0a 100%)'
          : 'linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%)',
      }}
    >
      <div className={styles.glow} style={{ background: `radial-gradient(ellipse at 30% 60%, ${accent}30 0%, transparent 60%)` }} />
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <span className={styles.badgeWrap}>
              <span className="pill-tag">{emoji} {badge}</span>
            </span>
            <h1 className={styles.heading}>
              {heading}
              {subheading && <span className={styles.sub}><br />{subheading}</span>}
            </h1>
            <p className={styles.desc}>{desc}</p>
            {tags.length > 0 && (
              <div className={styles.tags}>
                {tags.map(t => (
                  <span key={t} className={styles.tag} style={{ borderColor: `${accent}40`, color: accent }}>
                    ✓ {t}
                  </span>
                ))}
              </div>
            )}
            <div className={styles.actions}>
              <button className="btn btn-primary btn-lg" style={{ background: accent, boxShadow: `0 8px 32px ${accent}40` }}>
                Get Started
              </button>
              <button className="btn btn-ghost btn-lg">Learn More</button>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.emojiCircle} style={{ boxShadow: `0 0 60px ${accent}40` }}>
              <span className={styles.bigEmoji}>{emoji}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
