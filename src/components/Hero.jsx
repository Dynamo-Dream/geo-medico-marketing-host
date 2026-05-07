import styles from './Hero.module.css'

const QUICK_LINKS = [
  { label: 'Find Doctor', icon: '👨‍⚕️', tab: 'doctor', color: '#0a6ebd' },
  { label: 'Order Medicine', icon: '💊', tab: 'pharmacy', color: '#00b894' },
  { label: 'Book Lab Test', icon: '🔬', tab: 'lab', color: '#6c5ce7' },
  { label: 'Emergency SOS', icon: '🚑', tab: 'ambulance', color: '#fd7272' },
  { label: 'Virtual Consult', icon: '💻', tab: 'virtualcare', color: '#00cec9' },
  { label: 'POD Kiosk', icon: '📦', tab: 'pod', color: '#ff9f43' },
]

export default function Hero({ onTabChange }) {
  return (
    <section className={styles.hero}>
      <div className={styles.bg} />
      <div className={styles.bgGrid} />
      <div className="container">
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className="pill-tag">🌍 Geo-Location Powered Healthcare</span>
          </div>
          <h1 className={styles.heading}>
            Your Complete<br />
            <span className={styles.highlight}>Healthcare Ecosystem</span><br />
            <span className={styles.sub}>— Wherever You Are</span>
          </h1>
          <p className={styles.desc}>
            GeoMedico connects patients to the nearest doctors, hospitals, pharmacies, labs,
            and emergency services in real time. Accessible, affordable, intelligent healthcare
            at your fingertips — for every community, every need.
          </p>
          <div className={styles.actions}>
            <button className="btn btn-primary btn-lg">
              📍 Find Care Near Me
            </button>
            <button className="btn btn-ghost btn-lg">
              ▶ Watch How It Works
            </button>
          </div>

          <div className={styles.quickLinks}>
            {QUICK_LINKS.map(link => (
              <button
                key={link.tab}
                className={styles.quickBtn}
                style={{ '--ql-color': link.color }}
                onClick={() => onTabChange(link.tab)}
              >
                <span className={styles.quickIcon}>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.phoneFrame}>
            <div className={styles.phoneMock}>
              <div className={styles.phoneHeader}>
                <div className={styles.phoneStatus}>
                  <span>9:41</span>
                  <span>● ● ●</span>
                </div>
                <div className={styles.appBar}>
                  <div className={styles.appLogo}>G</div>
                  <span>GeoMedico</span>
                  <div className={styles.notifDot} />
                </div>
              </div>
              <div className={styles.mapArea}>
                <div className={styles.mapGrid} />
                <div className={`${styles.mapPin} ${styles.pinHospital}`}>🏥</div>
                <div className={`${styles.mapPin} ${styles.pinDoctor}`}>👨‍⚕️</div>
                <div className={`${styles.mapPin} ${styles.pinPharmacy}`}>💊</div>
                <div className={`${styles.mapPin} ${styles.pinAmbulance}`}>🚑</div>
                <div className={styles.userPin}>📍</div>
                <div className={styles.radar} />
              </div>
              <div className={styles.phoneCards}>
                <div className={styles.nearbyCard}>
                  <span>🏥</span>
                  <div>
                    <div className={styles.nearbyName}>City Hospital</div>
                    <div className={styles.nearbyDist}>0.8 km away • Open</div>
                  </div>
                  <button className={styles.navBtn}>→</button>
                </div>
                <div className={styles.nearbyCard}>
                  <span>👨‍⚕️</span>
                  <div>
                    <div className={styles.nearbyName}>Dr. Priya Sharma</div>
                    <div className={styles.nearbyDist}>Available in 10 min</div>
                  </div>
                  <button className={styles.navBtn}>→</button>
                </div>
              </div>
              <div className={styles.sosBar}>
                <span>🚨</span>
                <span>Emergency SOS</span>
                <button className={styles.sosBtn}>CALL</button>
              </div>
            </div>
          </div>

          <div className={`${styles.floatCard} ${styles.fc1}`}>
            <span>✅</span>
            <div>
              <div className={styles.fcTitle}>Appointment Confirmed</div>
              <div className={styles.fcSub}>Dr. Mehta · Today 3:30 PM</div>
            </div>
          </div>
          <div className={`${styles.floatCard} ${styles.fc2}`}>
            <span>🔬</span>
            <div>
              <div className={styles.fcTitle}>Lab Report Ready</div>
              <div className={styles.fcSub}>CBC Test · Download Now</div>
            </div>
          </div>
          <div className={`${styles.floatCard} ${styles.fc3}`}>
            <span>⚡</span>
            <div>
              <div className={styles.fcTitle}>Ambulance Dispatched</div>
              <div className={styles.fcSub}>ETA: 4 minutes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
