import styles from './HowItWorks.module.css'

export default function HowItWorks({ steps, title, accent }) {
  return (
    <section className="section" style={{ background: 'white' }}>
      <div className="container">
        <div className="section-heading text-center">
          <h2>{title}</h2>
        </div>
        <div className={styles.steps}>
          {steps.map((s, i) => (
            <div key={i} className={styles.step}>
              {i < steps.length - 1 && <div className={styles.connector} style={{ background: `linear-gradient(90deg, ${accent}, ${accent}40)` }} />}
              <div className={styles.circle} style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)` }}>
                {s.icon}
              </div>
              <div className={styles.num} style={{ color: accent }}>Step {s.num}</div>
              <h4 className={styles.title}>{s.title}</h4>
              <p className={styles.desc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
