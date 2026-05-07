import { useEffect, useState } from 'react'
import styles from './AboutPage.module.css'

const WHY_ITEMS = [
  { title:'Unified Health Records',   desc:'All your reports, prescriptions, and history in one secure place — accessible anytime, anywhere.' },
  { title:'Doctor Connectivity',       desc:'Specialists collaborate seamlessly across clinics, hospitals, and home care, so your care team stays aligned.' },
  { title:'Smart Emergency System',    desc:'Faster emergency response with pre-shared medical data, cutting critical response time when it matters most.' },
  { title:'Integrated Pharmacy & Labs',desc:'No delays, no lost reports. Prescriptions reach pharmacies instantly; lab results flow directly to your doctor.' },
  { title:'Reliable Home Care',        desc:'Verified, trained professionals deliver consistent care at your doorstep — scheduled, tracked, and reliable.' },
]

const STATS = [
  { value:'500,000+', label:'Patients Managed' },
  { value:'10,000+',  label:'Doctors Collaborating' },
  { value:'500+',     label:'Cities Covered' },
  { value:'25,000+',  label:'Pharmacies & Labs' },
]

const PROMISES = [
  'No family should struggle with scattered medical records.',
  'No patient should suffer due to lack of coordination.',
  'No emergency should be delayed because systems don\'t communicate.',
]

function TeamCard({ member }) {
  const initials = member.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
  return (
    <div className={styles.teamCard}>
      <div className={styles.teamPhoto}>
        {member.image_url
          ? <img src={member.image_url} alt={member.name} />
          : <span>{initials}</span>
        }
      </div>
      <h3 className={styles.teamName}>{member.name}</h3>
      <p className={styles.teamRole}>{member.role}</p>
    </div>
  )
}

export default function AboutPage() {
  const [team,       setTeam]       = useState([])
  const [storyImage, setStoryImage] = useState(null)

  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(setTeam).catch(() => {})
    fetch('/api/settings').then(r => r.json()).then(s => { if (s.story_image_url) setStoryImage(s.story_image_url) }).catch(() => {})
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={styles.page}>

      {/* ── 1. Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <span className={styles.heroBadge}>India's Healthcare Ecosystem</span>
            <h1 className={styles.heroH1}>
              About GEO-Medico —<br />
              <span className={styles.heroAccent}>Your Complete Healthcare Ecosystem.</span>
              <br />One Platform.
            </h1>
            <p className={styles.heroSub}>
              GEO-Medico is India's first integrated digital healthcare ecosystem that connects patients,
              doctors, pharmacies, labs, home care providers, and emergency services into one unified experience.
            </p>
            <a href="#why" className={styles.heroCta}>Explore Platform →</a>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroCollage}>
              <div className={`${styles.heroFrame} ${styles.heroFrame1}`}>
                <div className={styles.heroFrameInner}>
                  <span>👨‍⚕️</span><p>Verified Doctors</p>
                </div>
              </div>
              <div className={`${styles.heroFrame} ${styles.heroFrame2}`}>
                <div className={styles.heroFrameInner}>
                  <span>🏥</span><p>Partner Hospitals</p>
                </div>
              </div>
              <div className={`${styles.heroFrame} ${styles.heroFrame3}`}>
                <div className={styles.heroFrameInner}>
                  <span>🔬</span><p>Diagnostic Labs</p>
                </div>
              </div>
              <div className={`${styles.heroFrame} ${styles.heroFrame4}`}>
                <div className={styles.heroFrameInner}>
                  <span>💊</span><p>Pharmacies</p>
                </div>
              </div>
              <svg className={styles.heroLines} viewBox="0 0 400 360" fill="none">
                <line x1="100" y1="80" x2="220" y2="80" stroke="#0a6ebd" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4"/>
                <line x1="220" y1="80" x2="310" y2="180" stroke="#00b894" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4"/>
                <line x1="100" y1="280" x2="220" y2="280" stroke="#0a6ebd" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4"/>
                <line x1="220" y1="280" x2="310" y2="180" stroke="#00b894" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4"/>
                <circle cx="220" cy="180" r="22" fill="url(#hubg)" stroke="#0a6ebd" strokeWidth="1.5"/>
                <text x="220" y="176" textAnchor="middle" fontSize="9" fill="#0a6ebd" fontWeight="700">GEO</text>
                <text x="220" y="187" textAnchor="middle" fontSize="8" fill="#00b894" fontWeight="600">MEDICO</text>
                <defs>
                  <radialGradient id="hubg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#e8f4fd"/>
                    <stop offset="100%" stopColor="#f0fdf9"/>
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Impact Stats ── */}
      <section className={styles.stats}>
        <div className={styles.statsInner}>
          {STATS.map(s => (
            <div key={s.label} className={styles.statItem}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Our Story ── */}
      <section className={styles.story}>
        <div className={styles.storyInner}>
          <div className={styles.storyImg}>
            {storyImage ? (
              <img src={storyImage} alt="Our Story" className={styles.storyImgReal} />
            ) : (
              <div className={styles.storyImgBox}>
                <span>🏥</span>
                <p>The moment that changed everything</p>
              </div>
            )}
          </div>
          <div className={styles.storyText}>
            <p className={styles.sectionTag}>Our Story</p>
            <h2 className={styles.sectionH2}>How GEO-Medico Began</h2>
            <blockquote className={styles.storyQuote}>
              "My mother died because her medical records were scattered across three hospitals. Her home nurse didn't show. Her doctors didn't communicate."
              <cite>— Amitav, Founder</cite>
            </blockquote>
            <p className={styles.storyBody}>
              Sitting in a hospital parking lot, holding a coffee-stained folder filled with disconnected reports,
              Amitav realized the problem wasn't a lack of healthcare — it was a <strong>lack of connection</strong>.
            </p>
            <p className={styles.storyBody}>
              That night, he called his partners Tapan and Mohan: <em>"We cannot fix this system. But we can build a new one."</em>
            </p>
            <p className={styles.storyBody}>
              What started as grief turned into a mission — to ensure no family ever suffers because healthcare systems fail to work together.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. Mission & Vision ── */}
      <section className={styles.missionSection}>
        <div className={styles.sectionContainer}>
          <p className={styles.sectionTagCenter}>Purpose</p>
          <h2 className={styles.sectionH2Center}>Mission & Vision</h2>
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>🎯</div>
              <h3>Our Mission</h3>
              <p>To eliminate fragmentation in healthcare by building a single, intelligent platform that connects patients, providers, and services — making healthcare faster, simpler, and more reliable.</p>
            </div>
            <div className={`${styles.missionCard} ${styles.missionCardAlt}`}>
              <div className={styles.missionIcon}>🔭</div>
              <h3>Our Vision</h3>
              <p>To create a future where every life receives timely, coordinated, and high-quality care — regardless of location or circumstance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Why GeoMedico ── */}
      <section className={styles.whySection} id="why">
        <div className={styles.sectionContainer}>
          <p className={styles.sectionTagCenter}>Our Solution</p>
          <h2 className={styles.sectionH2Center}>Why GEO-Medico?</h2>
          <p className={styles.sectionSubCenter}>
            Healthcare today is complex, disconnected, and stressful. GEO-Medico solves this by creating a complete ecosystem.
          </p>
          <div className={styles.whyGrid}>
            {WHY_ITEMS.map(item => (
              <div key={item.title} className={styles.whyCard}>
                <div className={styles.whyBar} />
                <h3 className={styles.whyTitle}>{item.title}</h3>
                <p className={styles.whyDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Team ── */}
      <section className={styles.teamSection}>
        <div className={styles.sectionContainer}>
          <p className={styles.sectionTagCenter}>People</p>
          <h2 className={styles.sectionH2Center}>The Team Behind GEO-Medico</h2>
          <p className={styles.sectionSubCenter}>
            Driven by purpose, technology, and real-world impact.
          </p>
          {team.length > 0 ? (
            <div className={styles.teamGrid}>
              {team.map(m => <TeamCard key={m.id} member={m} />)}
            </div>
          ) : (
            <div className={styles.teamGrid}>
              {[
                { name:'Amitav', role:'Founder & CEO',       initials:'AM' },
                { name:'Tapan',  role:'Co-Founder & CTO',    initials:'TP' },
                { name:'Mohan',  role:'Co-Founder & COO',    initials:'MH' },
              ].map(p => (
                <div key={p.name} className={styles.teamCard}>
                  <div className={styles.teamPhoto}><span>{p.initials}</span></div>
                  <h3 className={styles.teamName}>{p.name}</h3>
                  <p className={styles.teamRole}>{p.role}</p>
                </div>
              ))}
            </div>
          )}
          <p className={styles.teamQuote}>
            "Healthcare should work as one system — not a collection of disconnected parts."
          </p>
        </div>
      </section>

      {/* ── 7. Promise ── */}
      <section className={styles.promiseSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.promiseH2}>Our Promise</h2>
          <p className={styles.promiseSub}>GEO-Medico is built on an unwavering commitment:</p>
          <div className={styles.promiseList}>
            {PROMISES.map((p, i) => (
              <div key={i} className={styles.promiseItem}>
                <div className={styles.promiseCheck}>✓</div>
                <p>{p}</p>
              </div>
            ))}
          </div>
          <p className={styles.promiseEnd}>We are building a healthcare system that <strong>simply works.</strong></p>
        </div>
      </section>

    </div>
  )
}
