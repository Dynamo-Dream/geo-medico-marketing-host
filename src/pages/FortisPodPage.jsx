import { useState } from 'react'
import styles from './FortisPodPage.module.css'

// ─── Ecosystem Map Constants ─────────────────────────────────────────────────
const VW = 700, VH = 580
const NODES = {
  fortis:   { cx: 350, cy: 72,  r: 64, color: '#4f7cff', border: '#ffd700', label: 'FORTIS HOSPITAL', sub: 'New Delhi', emoji: '🏛️' },
  geo:      { cx: 350, cy: 228, r: 52, color: '#0891b2', border: '#00e5cc', label: 'GeoMedico Bridge', sub: 'Cloud Platform', emoji: '☁️' },
  pod:      { cx: 118, cy: 385, r: 48, color: '#fb923c', border: '#fb923c', label: 'Fortis Diabetes POD', sub: 'Bhubaneswar', emoji: '📦' },
  pharmacy: { cx: 350, cy: 448, r: 48, color: '#4ade80', border: '#4ade80', label: 'Auth. Pharmacy', sub: 'Bhubaneswar', emoji: '💊' },
  lab:      { cx: 582, cy: 385, r: 48, color: '#c084fc', border: '#c084fc', label: 'Auth. Lab (NABL)', sub: 'Bhubaneswar', emoji: '🔬' },
  patient:  { cx: 350, cy: 530, r: 36, color: '#fbbf24', border: '#fbbf24', label: 'You', sub: 'Patient · BBSR', emoji: '🧑' },
}

const EDGES = [
  { from: 'fortis',   to: 'geo',      color: '#ffd700', label: '📹 Teleconsult + Rx', dur: 1.9, bidir: true  },
  { from: 'geo',      to: 'pod',      color: '#fb923c', label: '📋 Booking',          dur: 2.2, bidir: true  },
  { from: 'geo',      to: 'pharmacy', color: '#4ade80', label: '💊 e-Prescription',   dur: 2.0, bidir: true  },
  { from: 'geo',      to: 'lab',      color: '#c084fc', label: '🔬 Lab Orders',       dur: 2.3, bidir: true  },
  { from: 'pod',      to: 'patient',  color: '#fbbf24', label: '',                    dur: 1.6, bidir: false },
  { from: 'pharmacy', to: 'patient',  color: '#fbbf24', label: '',                    dur: 1.7, bidir: false },
  { from: 'lab',      to: 'patient',  color: '#fbbf24', label: '',                    dur: 1.8, bidir: false },
]

function trimPt(ax, ay, bx, by, d) {
  const dx = bx - ax, dy = by - ay, l = Math.sqrt(dx * dx + dy * dy)
  return { x: ax + dx * (d / l), y: ay + dy * (d / l) }
}

function PulseDot({ edge, idx }) {
  const f = NODES[edge.from], t = NODES[edge.to]
  const fwd = `M${f.cx},${f.cy} L${t.cx},${t.cy}`
  const bwd = `M${t.cx},${t.cy} L${f.cx},${f.cy}`
  const b = idx * 0.28
  return (
    <g>
      {[0, edge.dur * 0.46].map((d, i) => (
        <circle key={`f${i}`} r="4.5" fill={edge.color}
          style={{ filter: `drop-shadow(0 0 5px ${edge.color})` }}>
          <animateMotion dur={`${edge.dur}s`} begin={`${b + d}s`} repeatCount="indefinite" path={fwd} />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.88;1"
            dur={`${edge.dur}s`} begin={`${b + d}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="1.5;4.5;4.5;1.5" keyTimes="0;0.12;0.85;1"
            dur={`${edge.dur}s`} begin={`${b + d}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {edge.bidir && [edge.dur * 0.23, edge.dur * 0.7].map((d, i) => (
        <circle key={`b${i}`} r="3.5" fill={edge.color} opacity="0.7"
          style={{ filter: `drop-shadow(0 0 4px ${edge.color})` }}>
          <animateMotion dur={`${edge.dur * 0.85}s`} begin={`${b + d}s`} repeatCount="indefinite" path={bwd} />
          <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.1;0.86;1"
            dur={`${edge.dur * 0.85}s`} begin={`${b + d}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  )
}

// ─── HbA1c Chart ─────────────────────────────────────────────────────────────
function HbA1cChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const values = [9.8, 9.1, 8.3, 7.8, 7.2, 6.9]
  const cW = 440, cH = 170, padL = 48, padB = 28, padT = 14
  const yMin = 6, yMax = 11
  const xs = months.map((_, i) => padL + i * (cW / 5))
  const ys = values.map(v => padT + cH - ((v - yMin) / (yMax - yMin)) * cH)
  const polyPts = xs.map((x, i) => `${x},${ys[i]}`).join(' ')
  const areaPath = `M${xs[0]},${padT + cH} L${xs.map((x, i) => `${x},${ys[i]}`).join(' L')} L${xs[5]},${padT + cH} Z`
  const svgW = cW + padL + 16, svgH = cH + padT + padB + 8

  return (
    <div className={styles.chartWrap}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className={styles.chart}>
        <defs>
          <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
          <filter id="chartGlow">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* grid lines */}
        {[6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(v => {
          const yg = padT + cH - ((v - yMin) / (yMax - yMin)) * cH
          return (
            <g key={v}>
              <line x1={padL} y1={yg} x2={svgW - 16} y2={yg}
                stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x={padL - 6} y={yg} textAnchor="end" dominantBaseline="middle"
                fill="rgba(255,255,255,0.35)" fontSize="9"
                fontFamily="Plus Jakarta Sans, Inter, sans-serif">{v.toFixed(1)}</text>
            </g>
          )
        })}
        {/* target band */}
        {(() => {
          const y1 = padT + cH - ((7 - yMin) / (yMax - yMin)) * cH
          const y2 = padT + cH - ((6 - yMin) / (yMax - yMin)) * cH
          return <rect x={padL} y={y1} width={cW} height={y2 - y1}
            fill="rgba(74,222,128,0.08)" />
        })()}
        <text x={padL + cW - 4} y={padT + cH - 2}
          textAnchor="end" fill="rgba(74,222,128,0.5)" fontSize="8"
          fontFamily="Plus Jakarta Sans, Inter, sans-serif">Target Zone</text>
        {/* area fill */}
        <path d={areaPath} fill="url(#chartArea)" />
        {/* line */}
        <polyline points={polyPts} fill="none" stroke="url(#chartLine)"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          filter="url(#chartGlow)"
          className={styles.chartLine}
        />
        {/* data points */}
        {xs.map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={ys[i]} r="5" fill="#0f1a2d"
              stroke={i === 0 ? '#f87171' : '#4ade80'} strokeWidth="2" />
            <text x={x} y={ys[i] - 10} textAnchor="middle"
              fill={i === 0 ? '#f87171' : '#4ade80'} fontSize="9.5" fontWeight="800"
              fontFamily="Plus Jakarta Sans, Inter, sans-serif">{values[i]}%</text>
            <text x={x} y={padT + cH + 16} textAnchor="middle"
              fill="rgba(255,255,255,0.45)" fontSize="9"
              fontFamily="Plus Jakarta Sans, Inter, sans-serif">{months[i]}</text>
          </g>
        ))}
        {/* Y label */}
        <text x={10} y={padT + cH / 2} textAnchor="middle" dominantBaseline="middle"
          fill="rgba(255,255,255,0.35)" fontSize="8.5"
          fontFamily="Plus Jakarta Sans, Inter, sans-serif"
          transform={`rotate(-90 10 ${padT + cH / 2})`}>HbA1c %</text>
      </svg>
    </div>
  )
}

// ─── Step data ────────────────────────────────────────────────────────────────
const STEPS = [
  { icon: '🚶', title: 'Walk Into the POD', desc: 'Patient walks into Fortis Diabetes POD kiosk at the nearest GeoMedico partner location in Bhubaneswar — no appointment needed.', color: '#fb923c' },
  { icon: '🤖', title: 'AI Vitals Capture', desc: 'POD kiosk measures Blood Glucose, HbA1c, BP, SpO2, Weight, BMI, and ECG in under 3 minutes. Data auto-synced to Fortis EHR.', color: '#c084fc' },
  { icon: '📹', title: 'Connect to Fortis Doctor', desc: "Live HD video consultation with a Fortis-certified diabetologist — based in Delhi or any Fortis centre. Doctor reviews vitals + full history.", color: '#4f7cff' },
  { icon: '📋', title: 'Fortis Prescription Issued', desc: 'Doctor writes a Fortis-branded digital prescription — MCI-valid and Fortis quality-certified. Sent to authorized pharmacy instantly.', color: '#ffd700' },
  { icon: '💊', title: 'Medicines from Auth. Pharmacy', desc: 'Authorized GeoMedico pharmacy in Bhubaneswar fills the Fortis prescription. Home delivery available. Auto-refill for chronic meds.', color: '#4ade80' },
  { icon: '🔬', title: 'Tests at Auth. Lab', desc: 'Lab orders sent to the nearest NABL-accredited Fortis-empaneled lab in Bhubaneswar. Home sample collection available.', color: '#c084fc' },
  { icon: '📊', title: 'Continuous Monitoring', desc: "Digital reports go directly to your Fortis doctor. AI detects trends, alerts you before complications. Monthly POD follow-ups ensure you're always on track.", color: '#4ade80' },
]

// ─── Diabetes features ────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '📊', title: 'HbA1c & Glucose Tracking',   desc: 'Automatic 3-month HbA1c charting from POD kiosk. Fasting, PP, and random glucose logged after every visit.', color: '#f87171' },
  { icon: '📡', title: 'CGM Integration',             desc: 'Connect FreeStyle Libre and Dexcom G6/G7 to the GeoMedico app. Fortis doctor monitors your 24-hr glucose curve in real time.', color: '#c084fc' },
  { icon: '💉', title: 'Insulin & Medication Mgmt',   desc: 'Fortis diabetologist adjusts insulin doses remotely. Smart reminders, adherence tracking, and auto-refill from Bhubaneswar pharmacy.', color: '#4ade80' },
  { icon: '🥗', title: 'Odia Diet Counselling',       desc: 'Fortis dietitian prescribes a personalized plan for Odia cuisine — pakhala, dalma, and local staples. Video sessions available via POD.', color: '#fb923c' },
  { icon: '🦶', title: 'Diabetic Foot Screening',     desc: 'Annual foot neuropathy and ABI assessments at the POD kiosk. Instant referral to Fortis foot specialist if risk is detected.', color: '#60a5fa' },
  { icon: '👁️', title: 'Retinal Screening (AI)',      desc: 'AI-powered diabetic retinopathy screening using POD retinal camera. Fortis ophthalmologist reviews high-risk cases within 24 hrs.', color: '#fbbf24' },
  { icon: '🫘', title: 'Kidney Function Monitoring',  desc: 'Regular serum creatinine, eGFR, and urine microalbumin tracked. Fortis nephrologist notified automatically if values cross thresholds.', color: '#4ade80' },
  { icon: '🚨', title: 'Hypo/Hyper Emergency Protocol',desc: 'Fortis 24/7 emergency line. GeoMedico app shows nearest glucose source. Auto-dispatch protocol for severe hypoglycemia events.', color: '#f87171' },
]

// ─── Authorized network data ──────────────────────────────────────────────────
const DOCTORS = [
  { name: 'Dr. Rajiv Mehta', spec: 'Senior Diabetologist', qual: 'MD (Endo), FRCP', org: 'Fortis Hospital, New Delhi', mode: '📹 Via POD Teleconsult', exp: '18 yrs', badge: 'Fortis Lead' },
  { name: 'Dr. Deepika Nair', spec: 'Endocrinologist', qual: 'DM (Endocrinology)', org: 'Fortis Hospital, Bangalore', mode: '📹 Via POD Teleconsult', exp: '12 yrs', badge: 'Fortis Certified' },
  { name: 'Dr. Santosh Mishra', spec: 'Diabetes & Obesity', qual: 'MBBS, MD (Med)', org: 'Fortis Partner Clinic, BBSR', mode: '🏥 In-person + POD', exp: '9 yrs', badge: 'Fortis Partner' },
]

const PHARMACIES = [
  { name: 'MedPlus – Saheed Nagar', area: 'Saheed Nagar, BBSR', dist: '0.8 km from POD', hours: 'Open 24×7', badge: 'Fortis Rx Partner', feature: 'Same-day home delivery' },
  { name: 'Apollo Pharmacy', area: 'Master Canteen Sq', dist: '1.2 km from POD', hours: 'Open till 10 PM', badge: 'Fortis Partner', feature: 'Cold-chain insulin storage' },
  { name: 'Jan Aushadhi Centre', area: 'Jaydev Vihar, BBSR', dist: '1.9 km from POD', hours: 'Open 9AM–8PM', badge: 'Fortis Generic Program', feature: 'Up to 80% savings on meds' },
]

const LABS = [
  { name: 'Neuberg Diagnostics', area: 'Ashok Nagar, BBSR', dist: '0.5 km from POD', cert: 'NABL + ISO 15189', badge: 'Fortis Protocol Lab', tests: 'HbA1c, FBS, PPBS, Lipids, eGFR' },
  { name: 'Redcliffe Labs', area: 'Nayapalli, BBSR', dist: '2.1 km from POD', cert: 'NABL Accredited', badge: 'Fortis Empanelled', tests: 'Home collection available' },
  { name: 'Thyrocare (Agilus)', area: 'Kalpana Sq, BBSR', dist: '1.6 km from POD', cert: 'NABL + CAP', badge: 'Fortis Certified', tests: 'Diabetes Panel ₹599' },
]

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FortisPodPage({ onBack }) {
  const [hovered, setHovered] = useState(null)
  const [netTab, setNetTab] = useState('doctors')

  return (
    <div className={styles.page}>

      {/* ── Back bar ── */}
      <div className={styles.backBar}>
        <div className="container">
          <button className={styles.backBtn} onClick={onBack}>
            ← Back to GeoMedico
          </button>
          <div className={styles.breadcrumb}>
            <span>GeoMedico</span>
            <span>›</span>
            <span>POD Healthcare</span>
            <span>›</span>
            <span className={styles.breadActive}>Fortis Diabetes POD · Bhubaneswar</span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrid} />
        <div className="container">
          <div className={styles.cobrands}>
            <div className={styles.fortisLogo}>
              <span>🏛️</span>
              <div>
                <div className={styles.fortisName}>FORTIS</div>
                <div className={styles.fortisSub}>Healthcare · New Delhi</div>
              </div>
            </div>
            <div className={styles.cobrandX}>✕</div>
            <div className={styles.geoLogo}>
              <div className={styles.geoIcon}>G</div>
              <div>
                <div className={styles.geoName}>GeoMedico</div>
                <div className={styles.geoSub}>POD Platform</div>
              </div>
            </div>
          </div>

          <div className={styles.heroPill}>
            <span className="pill-tag">📦 Fortis Diabetes POD — Bhubaneswar, Odisha</span>
          </div>

          <h1 className={styles.heroH1}>
            Fortis Diabetes Care.<br />
            <span className={styles.heroHl}>Now in Bhubaneswar.</span>
          </h1>
          <p className={styles.heroDesc}>
            Patients in Bhubaneswar now access <strong>Fortis-authorized endocrinologists</strong>,
            <strong> Fortis-certified pharmacies</strong>, and <strong>Fortis-empanelled NABL labs</strong>
            — all through a GeoMedico Diabetes POD kiosk in your city.
            No travel to Delhi. No compromise on quality.
          </p>

          <div className={styles.heroStats}>
            {[
              { v: '1,20,000+', l: 'Diabetics in Odisha' },
              { v: '₹38,500',   l: 'Avg annual savings/patient' },
              { v: '< 3 Min',   l: 'Full vitals at POD kiosk' },
              { v: '6.9%',      l: 'Avg HbA1c after 6 months' },
            ].map(s => (
              <div key={s.l} className={styles.heroStat}>
                <div className={styles.heroStatVal}>{s.v}</div>
                <div className={styles.heroStatLbl}>{s.l}</div>
              </div>
            ))}
          </div>

          <div className={styles.heroActions}>
            <button className={`btn btn-lg ${styles.bookBtn}`}>
              📅 Book POD Appointment
            </button>
            <button className="btn btn-ghost btn-lg">
              📞 Call Fortis POD BBSR
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 2 — ECOSYSTEM MAP
      ════════════════════════════════════════ */}
      <section className={styles.mapSection}>
        <div className="container">
          <div className={`section-heading text-center ${styles.mapHeading}`}>
            <span className="badge badge-blue">How the Ecosystem Works</span>
            <h2 style={{ marginTop: 12 }}>
              Delhi's Best. Delivered to Bhubaneswar.
            </h2>
            <p>
              Fortis Hospital Delhi and GeoMedico form an unbreakable digital bridge —
              bringing Fortis-quality diabetes care to every patient in Bhubaneswar
              without them ever leaving the city.
            </p>
          </div>

          <div className={styles.mapWrap}>
            <svg viewBox={`0 0 ${VW} ${VH}`} className={styles.mapSvg}>
              <defs>
                <radialGradient id="fortisGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#0a1228" />
                </radialGradient>
                <radialGradient id="geoGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0c4a6e" />
                  <stop offset="100%" stopColor="#060d1a" />
                </radialGradient>
                {['pod', 'pharmacy', 'lab', 'patient'].map(k => (
                  <radialGradient key={k} id={`ng-${k}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={NODES[k].color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={NODES[k].color} stopOpacity="0.04" />
                  </radialGradient>
                ))}
                <filter id="mapGlow">
                  <feGaussianBlur stdDeviation="5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="mapGlowSm">
                  <feGaussianBlur stdDeviation="2.5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Delhi region backdrop */}
              <rect x={240} y={4} width={220} height={152} rx={20}
                fill="rgba(255,215,0,0.04)" stroke="rgba(255,215,0,0.12)" strokeWidth="1" />
              <text x={350} y={20} textAnchor="middle" fill="rgba(255,215,0,0.45)"
                fontSize="9" fontWeight="700" letterSpacing="2"
                fontFamily="Plus Jakarta Sans, Inter, sans-serif">🏙️ NEW DELHI</text>

              {/* Bhubaneswar region backdrop */}
              <rect x={36} y={320} width={628} height={246} rx={24}
                fill="rgba(56,189,248,0.03)" stroke="rgba(56,189,248,0.1)" strokeWidth="1" />
              <text x={80} y={340} fill="rgba(56,189,248,0.5)"
                fontSize="9" fontWeight="700" letterSpacing="2"
                fontFamily="Plus Jakarta Sans, Inter, sans-serif">🏙️ BHUBANESWAR</text>

              {/* ── Spoke glow ── */}
              {EDGES.map(e => {
                const f = NODES[e.from], t = NODES[e.to]
                return (
                  <line key={`sg-${e.from}-${e.to}`}
                    x1={f.cx} y1={f.cy} x2={t.cx} y2={t.cy}
                    stroke={e.color} strokeWidth="10" strokeOpacity="0.07"
                    filter="url(#mapGlow)" />
                )
              })}

              {/* ── Spoke lines ── */}
              {EDGES.map((e, i) => {
                const f = NODES[e.from], t = NODES[e.to]
                const a = trimPt(f.cx, f.cy, t.cx, t.cy, f.r + 4)
                const b = trimPt(t.cx, t.cy, f.cx, f.cy, t.r + 4)
                const mx = (f.cx + t.cx) / 2, my = (f.cy + t.cy) / 2
                return (
                  <g key={`sl-${i}`}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      stroke={e.color}
                      strokeWidth={hovered === e.from || hovered === e.to ? 1.8 : 1}
                      strokeOpacity={hovered === e.from || hovered === e.to ? 0.65 : 0.25}
                      strokeDasharray="5 3"
                      style={{ transition: 'all 0.3s' }}
                    />
                    {e.label && (
                      <text x={mx} y={my - 9} textAnchor="middle"
                        fill={e.color} fontSize="9.5" fontWeight="700" opacity="0.8"
                        fontFamily="Plus Jakarta Sans, Inter, sans-serif">
                        {e.label}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* ── Animated pulse dots ── */}
              {EDGES.map((e, idx) => <PulseDot key={idx} edge={e} idx={idx} />)}

              {/* ═══ FORTIS NODE ═══ */}
              <g transform={`translate(${NODES.fortis.cx},${NODES.fortis.cy})`}
                className={styles.fortisNode}
                onMouseEnter={() => setHovered('fortis')}
                onMouseLeave={() => setHovered(null)}>
                {/* Outer gold orbit */}
                <g className={styles.goldOrbit}>
                  <circle r={NODES.fortis.r + 22} fill="none"
                    stroke="rgba(255,215,0,0.35)" strokeWidth="1.5" strokeDasharray="8 6" />
                </g>
                {/* Glow */}
                <circle r={NODES.fortis.r + 10}
                  fill="rgba(255,215,0,0.08)"
                  stroke="rgba(255,215,0,0.2)" strokeWidth="0.5"
                  className={styles.fortisGlow} />
                {/* Body */}
                <circle r={NODES.fortis.r}
                  fill="url(#fortisGrad)"
                  stroke="#ffd700" strokeWidth="2.5"
                  filter="url(#mapGlowSm)" />
                {/* Inner ring */}
                <circle r={NODES.fortis.r - 12} fill="none"
                  stroke="rgba(255,215,0,0.2)" strokeWidth="1" strokeDasharray="3 3" />
                {/* Text */}
                <text y={-14} textAnchor="middle" dominantBaseline="middle"
                  fill="#ffd700" fontSize="13.5" fontWeight="900" letterSpacing="2"
                  fontFamily="Plus Jakarta Sans, Inter, sans-serif">FORTIS</text>
                <text y={4} textAnchor="middle" dominantBaseline="middle"
                  fill="rgba(255,255,255,0.75)" fontSize="10" fontWeight="700"
                  fontFamily="Plus Jakarta Sans, Inter, sans-serif">HEALTHCARE</text>
                <text y={20} textAnchor="middle" dominantBaseline="middle"
                  fill="rgba(255,215,0,0.5)" fontSize="8" fontWeight="500"
                  fontFamily="Plus Jakarta Sans, Inter, sans-serif">New Delhi</text>
                {/* Label below */}
                <text y={NODES.fortis.r + 18} textAnchor="middle"
                  fill="rgba(255,215,0,0.7)" fontSize="10" fontWeight="600"
                  fontFamily="Plus Jakarta Sans, Inter, sans-serif">
                  Authorizing Hospital
                </text>
              </g>

              {/* ═══ GeoMedico Bridge NODE ═══ */}
              <g transform={`translate(${NODES.geo.cx},${NODES.geo.cy})`}
                className={styles.geoNode}>
                <g className={styles.tealOrbit}>
                  <circle r={NODES.geo.r + 18} fill="none"
                    stroke="rgba(0,229,204,0.3)" strokeWidth="1" strokeDasharray="6 8" />
                </g>
                <circle r={NODES.geo.r + 8}
                  fill="rgba(8,145,178,0.1)" className={styles.geoAura} />
                <circle r={NODES.geo.r}
                  fill="url(#geoGrad)"
                  stroke="#00cec9" strokeWidth="2"
                  filter="url(#mapGlowSm)" />
                <text y={-8} textAnchor="middle" dominantBaseline="middle"
                  fill="#7dd3fc" fontSize="11" fontWeight="800" letterSpacing="1.5"
                  fontFamily="Plus Jakarta Sans, Inter, sans-serif">GeoMedico</text>
                <text y={8} textAnchor="middle" dominantBaseline="middle"
                  fill="rgba(255,255,255,0.5)" fontSize="8.5" fontWeight="600"
                  fontFamily="Plus Jakarta Sans, Inter, sans-serif">Digital Bridge</text>
                <text y={NODES.geo.r + 16} textAnchor="middle"
                  fill="rgba(0,229,204,0.65)" fontSize="10" fontWeight="600"
                  fontFamily="Plus Jakarta Sans, Inter, sans-serif">AI Platform</text>
              </g>

              {/* ═══ BBSR NODES (POD, Pharmacy, Lab, Patient) ═══ */}
              {['pod', 'pharmacy', 'lab', 'patient'].map(key => {
                const n = NODES[key]
                const isHov = hovered === key
                return (
                  <g key={key}
                    transform={`translate(${n.cx},${n.cy})`}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: 'default' }}>
                    <g className={styles.nodeFloat} style={{ '--fd': `${Object.keys(NODES).indexOf(key) * 0.5}s` }}>
                      <circle r={n.r + (isHov ? 12 : 0)}
                        fill={`url(#ng-${key})`}
                        style={{ transition: 'r 0.3s' }} />
                      <circle r={n.r}
                        fill={`${n.color}16`}
                        stroke={n.color}
                        strokeWidth={isHov ? 2.5 : 1.5}
                        style={{
                          transition: 'all 0.3s',
                          filter: isHov ? `drop-shadow(0 0 12px ${n.color})` : `drop-shadow(0 0 4px ${n.color}60)`,
                        }}
                      />
                      <text y={-5} textAnchor="middle" dominantBaseline="middle"
                        fontSize={n.r > 44 ? 24 : 20}
                        style={{ userSelect: 'none' }}>{n.emoji}</text>
                      <text y={n.r + 16} textAnchor="middle"
                        fill={isHov ? n.color : 'rgba(255,255,255,0.8)'}
                        fontSize="10.5" fontWeight="800"
                        fontFamily="Plus Jakarta Sans, Inter, sans-serif"
                        style={{ transition: 'fill 0.3s' }}>
                        {n.label}
                      </text>
                      <text y={n.r + 28} textAnchor="middle"
                        fill={n.color} fontSize="9" fontWeight="500" opacity="0.7"
                        fontFamily="Plus Jakarta Sans, Inter, sans-serif">
                        {n.sub}
                      </text>
                    </g>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 3 — HOW IT WORKS (7 steps)
      ════════════════════════════════════════ */}
      <section className={`section ${styles.stepsSection}`}>
        <div className="container">
          <div className="section-heading text-center">
            <span className="badge badge-blue">Patient Journey</span>
            <h2 style={{ marginTop: 12 }}>
              From Your Doorstep in Bhubaneswar<br />to Fortis-Quality Diabetes Care
            </h2>
            <p>Seven seamless steps — all managed by GeoMedico, all Fortis-certified.</p>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map((s, i) => (
              <div key={i} className={styles.stepCard}>
                <div className={styles.stepNum} style={{ background: s.color, boxShadow: `0 6px 20px ${s.color}40` }}>
                  {i + 1}
                </div>
                <div className={styles.stepIcon}>{s.icon}</div>
                <h4 className={styles.stepTitle}>{s.title}</h4>
                <p className={styles.stepDesc}>{s.desc}</p>
                {i < STEPS.length - 1 && <div className={styles.stepArrow} style={{ color: s.color }}>↓</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 4 — DIABETES FEATURES
      ════════════════════════════════════════ */}
      <section className={`section ${styles.featuresSection}`}>
        <div className="container">
          <div className="section-heading text-center">
            <span className="badge" style={{ background: '#ffe8e8', color: '#c0392b' }}>
              Diabetes-Specific Care
            </span>
            <h2 style={{ marginTop: 12 }}>
              Complete Diabetes Management Protocol
            </h2>
            <p>
              Every feature of the Fortis Diabetes POD is designed around the clinical
              requirements of type 1 and type 2 diabetes — powered by Fortis protocols,
              delivered via GeoMedico.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureCard}
                style={{ '--fc': f.color }}>
                <div className={styles.featureIconWrap} style={{ background: `${f.color}18` }}>
                  <span>{f.icon}</span>
                </div>
                <h4 className={styles.featureTitle}>{f.title}</h4>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 5 — AUTHORIZED NETWORK
      ════════════════════════════════════════ */}
      <section className={`section ${styles.networkSection}`}>
        <div className="container">
          <div className="section-heading text-center">
            <span className="badge badge-green">Authorized Network · Bhubaneswar</span>
            <h2 style={{ marginTop: 12 }}>Every Partner. Fortis Certified.</h2>
            <p>
              Every doctor, pharmacy, and lab in the Fortis Diabetes POD network
              undergoes Fortis quality audits and operates under Fortis clinical protocols.
            </p>
          </div>

          <div className={styles.netTabs}>
            {[['doctors', '👨‍⚕️  Doctors'], ['pharmacies', '💊  Pharmacies'], ['labs', '🔬  Labs']].map(([id, lbl]) => (
              <button key={id}
                className={`${styles.netTab} ${netTab === id ? styles.netTabActive : ''}`}
                onClick={() => setNetTab(id)}>
                {lbl}
              </button>
            ))}
          </div>

          {netTab === 'doctors' && (
            <div className={styles.netGrid}>
              {DOCTORS.map((d, i) => (
                <div key={i} className={styles.netCard}>
                  <div className={styles.netCardTop}>
                    <div className={styles.docAvatar}>{['👨‍⚕️','👩‍⚕️','👨‍⚕️'][i]}</div>
                    <div className={styles.fortisBadge}>✅ {d.badge}</div>
                  </div>
                  <h4 className={styles.netName}>{d.name}</h4>
                  <div className={styles.netSpec}>{d.spec} · {d.qual}</div>
                  <div className={styles.netOrg}>🏥 {d.org}</div>
                  <div className={styles.netMode}>{d.mode}</div>
                  <div className={styles.netExp}>⭐ {d.exp} experience</div>
                  <button className={`btn btn-primary btn-sm ${styles.consultBtn}`}>
                    Book Consultation
                  </button>
                </div>
              ))}
            </div>
          )}
          {netTab === 'pharmacies' && (
            <div className={styles.netGrid}>
              {PHARMACIES.map((p, i) => (
                <div key={i} className={styles.netCard}>
                  <div className={styles.netCardTop}>
                    <span style={{ fontSize: 36 }}>💊</span>
                    <div className={styles.fortisBadge} style={{ background: '#e0fff8', color: '#00806a' }}>
                      ✅ {p.badge}
                    </div>
                  </div>
                  <h4 className={styles.netName}>{p.name}</h4>
                  <div className={styles.netSpec}>📍 {p.area}</div>
                  <div className={styles.netOrg}>📏 {p.dist}</div>
                  <div className={styles.netMode}>🕐 {p.hours}</div>
                  <div className={styles.netExp}>🚴 {p.feature}</div>
                  <button className={`btn btn-secondary btn-sm ${styles.consultBtn}`}>
                    Order Medicines
                  </button>
                </div>
              ))}
            </div>
          )}
          {netTab === 'labs' && (
            <div className={styles.netGrid}>
              {LABS.map((l, i) => (
                <div key={i} className={styles.netCard}>
                  <div className={styles.netCardTop}>
                    <span style={{ fontSize: 36 }}>🔬</span>
                    <div className={styles.fortisBadge} style={{ background: '#f0edff', color: '#5a4fcf' }}>
                      ✅ {l.badge}
                    </div>
                  </div>
                  <h4 className={styles.netName}>{l.name}</h4>
                  <div className={styles.netSpec}>📍 {l.area}</div>
                  <div className={styles.netOrg}>📏 {l.dist}</div>
                  <div className={styles.netMode}>🏅 {l.cert}</div>
                  <div className={styles.netExp}>🧪 {l.tests}</div>
                  <button className={`btn btn-sm ${styles.consultBtn}`}
                    style={{ background: '#6c5ce7', color: 'white' }}>
                    Book Lab Test
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 6 — PATIENT SUCCESS STORY
      ════════════════════════════════════════ */}
      <section className={`section ${styles.successSection}`}>
        <div className="container">
          <div className="section-heading text-center">
            <span className="badge badge-green">Real Patient Story</span>
            <h2 style={{ marginTop: 12 }}>Bhubaneswar Patient. Fortis Results.</h2>
          </div>

          <div className={styles.storyGrid}>
            <div className={styles.storyLeft}>
              <div className={styles.patientCard}>
                <span className={styles.patientEmoji}>🧑</span>
                <div>
                  <div className={styles.patientName}>Ramesh Panda</div>
                  <div className={styles.patientMeta}>52 years · Teacher · Bhubaneswar</div>
                  <div className={styles.patientDx}>Diagnosed: Type 2 Diabetes (2019)</div>
                </div>
              </div>

              <div className={styles.beforeAfter}>
                <div className={`${styles.baBlock} ${styles.before}`}>
                  <div className={styles.baLabel}>BEFORE  — Flying to Delhi</div>
                  <ul className={styles.baList}>
                    <li>🔴 HbA1c: <strong>9.8%</strong> (Dangerously high)</li>
                    <li>🔴 2 trips/year to Fortis Delhi</li>
                    <li>🔴 Cost per trip: <strong>₹40,000+</strong></li>
                    <li>🔴 Annual spend: <strong>₹1,20,000</strong></li>
                    <li>🔴 Medication compliance: 60%</li>
                    <li>🔴 No between-visit monitoring</li>
                  </ul>
                </div>
                <div className={`${styles.baBlock} ${styles.after}`}>
                  <div className={styles.baLabel}>AFTER — GeoMedico Fortis POD</div>
                  <ul className={styles.baList}>
                    <li>🟢 HbA1c: <strong>6.9%</strong> in 6 months</li>
                    <li>🟢 Monthly POD visits in BBSR</li>
                    <li>🟢 Cost per visit: <strong>₹1,500</strong></li>
                    <li>🟢 Annual spend: <strong>₹18,000</strong></li>
                    <li>🟢 Medication compliance: 95%</li>
                    <li>🟢 Continuous AI monitoring</li>
                  </ul>
                </div>
              </div>

              <div className={styles.savingsBanner}>
                <div className={styles.savingsVal}>₹1,02,000</div>
                <div className={styles.savingsLbl}>saved by Ramesh in Year 1 alone</div>
              </div>
            </div>

            <div className={styles.storyRight}>
              <h4 className={styles.chartTitle}>HbA1c Improvement Over 6 Months</h4>
              <p className={styles.chartSub}>Ramesh's journey — from 9.8% to 6.9% under Fortis care at Bhubaneswar POD</p>
              <HbA1cChart />
              <div className={styles.chartLegend}>
                <span className={styles.legendDot} style={{ background: '#f87171' }} />
                <span>High Risk (≥7.5%)</span>
                <span className={styles.legendDot} style={{ background: '#4ade80', marginLeft: 16 }} />
                <span>Target Zone (≤7.0%)</span>
              </div>
              <div className={styles.chartQuote}>
                <span>💬</span>
                <p>
                  "I used to dread the journey to Delhi. Now I just walk 10 minutes to the
                  GeoMedico POD. My Fortis doctor knows my numbers better than before —
                  because she sees them every month, not twice a year."
                </p>
                <div className={styles.quoteAuthor}>— Ramesh Panda, Bhubaneswar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 7 — FOR HOSPITALS / PARTNERS
      ════════════════════════════════════════ */}
      <section className={`section ${styles.partnerSection}`}>
        <div className="container">
          <div className={styles.partnerGrid}>
            <div className={styles.partnerCard}>
              <div className={styles.partnerIcon}>🏥</div>
              <h3>Are You a Hospital Like Fortis?</h3>
              <p>
                Extend your brand to Tier-2 and Tier-3 cities without building new hospitals.
                GeoMedico POD lets you serve patients in new geographies through an
                authorized franchise model — maintaining your quality standards via AI audits.
              </p>
              <ul className={styles.partnerList}>
                <li>✅ Zero capital investment for expansion</li>
                <li>✅ Fortis/brand-certified care quality enforced</li>
                <li>✅ Revenue from new cities from Day 1</li>
                <li>✅ Proprietary clinical data from new markets</li>
              </ul>
              <button className={`btn btn-primary btn-lg ${styles.partnerBtn}`}>
                Launch Your Branded POD
              </button>
            </div>
            <div className={styles.partnerCard}>
              <div className={styles.partnerIcon}>💊</div>
              <h3>Pharmacy in Bhubaneswar?</h3>
              <p>
                Become a Fortis-authorized pharmacy partner. Fill Fortis prescriptions,
                get preferential listing on GeoMedico, and tap into a steady stream of
                diabetes patients managed by Fortis doctors.
              </p>
              <ul className={styles.partnerList}>
                <li>✅ Guaranteed prescription volume</li>
                <li>✅ Fortis Partner badge on GeoMedico app</li>
                <li>✅ Access to generic medicine program</li>
                <li>✅ Digital prescription management system</li>
              </ul>
              <button className={`btn btn-secondary btn-lg ${styles.partnerBtn}`}>
                Apply as Pharmacy Partner
              </button>
            </div>
            <div className={styles.partnerCard}>
              <div className={styles.partnerIcon}>🔬</div>
              <h3>NABL Lab in Bhubaneswar?</h3>
              <p>
                Join the Fortis-empanelled lab network. Receive Fortis doctor-ordered
                test requisitions directly on GeoMedico, follow Fortis SOPs, and build
                credibility as a Fortis-certified diagnostic partner.
              </p>
              <ul className={styles.partnerList}>
                <li>✅ Direct doctor-referred test orders</li>
                <li>✅ Fortis Protocol certification</li>
                <li>✅ Digital report integration</li>
                <li>✅ Home collection territory rights</li>
              </ul>
              <button className={`btn btn-lg ${styles.partnerBtn}`}
                style={{ background: '#6c5ce7', color: 'white' }}>
                Apply as Lab Partner
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA BAR
      ════════════════════════════════════════ */}
      <section className={styles.ctaBar}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <div className={styles.ctaTitle}>
                Fortis Diabetes POD — Bhubaneswar
              </div>
              <div className={styles.ctaSub}>
                Powered by GeoMedico · Open Mon–Sat, 8 AM – 8 PM · Call: 1800-GEO-POD
              </div>
            </div>
            <div className={styles.ctaActions}>
              <button className={`btn btn-lg ${styles.bookBtn}`}>
                📅 Book POD Appointment
              </button>
              <button className="btn btn-ghost btn-lg">
                📞 1800-GEO-MEDICO
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
