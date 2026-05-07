import styles from './AppCTA.module.css'

export default function AppCTA({ title, desc, accent, stats }) {
  return (
    <section className={styles.cta} style={{ '--cta-accent': accent, background: `linear-gradient(135deg, ${accent}15 0%, ${accent}05 100%)` }}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.desc}>{desc}</p>
            <div className={styles.actions}>
              <button className="btn btn-primary btn-lg" style={{ background: accent, boxShadow: `0 8px 32px ${accent}40` }}>
                📲 Download the App
              </button>
              <button className="btn btn-outline btn-lg" style={{ color: accent, borderColor: accent }}>
                Request a Demo
              </button>
            </div>
          </div>
          {stats && (
            <div className={styles.stats}>
              {stats.map(s => (
                <div key={s.lbl} className={styles.stat}>
                  <div className={styles.val} style={{ color: accent }}>{s.val}</div>
                  <div className={styles.lbl}>{s.lbl}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
