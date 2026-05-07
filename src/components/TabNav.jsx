import { useRef } from 'react'
import styles from './TabNav.module.css'

export default function TabNav({ tabs, active, onChange }) {
  const scrollRef = useRef(null)

  return (
    <nav className={styles.tabNav} id="services">
      <div className={styles.wrapper}>
        <div className={styles.tabs} ref={scrollRef}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
              onClick={() => {
                onChange(tab.id)
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              <span className={styles.label}>{tab.label}</span>
              {active === tab.id && <span className={styles.dot} />}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
