import styles from './FeatureGrid.module.css'

export default function FeatureGrid({ features }) {
  return (
    <div className={styles.grid}>
      {features.map((f, i) => (
        <div key={i} className={styles.card} style={{ '--card-bg': f.color, '--icon-bg': f.iconBg }}>
          <div className={styles.iconWrap}>
            <span>{f.icon}</span>
          </div>
          <h3 className={styles.title}>{f.title}</h3>
          <p className={styles.desc}>{f.desc}</p>
        </div>
      ))}
    </div>
  )
}
