import { useState, useEffect } from 'react'
import styles from './EcosystemHero.module.css'

// ─── SVG canvas constants ──────────────────────────────────────────────────
const VW = 740, VH = 600
const CX = 370, CY = 295
const SPOKE_R = 208
const NODE_R = 52
const HUB_R  = 72

const NODES = [
  { id: 'doctor',    label: 'Doctor',      emoji: '👨‍⚕️', color: '#38bdf8', glow: 'rgba(56,189,248,0.55)',   angle: -90,  tab: 'doctor',    desc: 'Verified Specialists',  why: 'Connect instantly to 1,20,000+ licensed doctors — nearest first.' },
  { id: 'lab',       label: 'LAB',         emoji: '🔬',   color: '#c084fc', glow: 'rgba(192,132,252,0.55)', angle: -30,  tab: 'lab',       desc: 'Home Diagnostics',      why: 'NABL labs. Home sample collection. Digital reports in hours.' },
  { id: 'pod',       label: 'POD Virtual', emoji: '📦',   color: '#fb923c', glow: 'rgba(251,146,60,0.55)',  angle: 30,   tab: 'pod',       desc: 'AI Kiosk + Telehealth', why: 'Solar-powered kiosks bring a full clinic to every village.' },
  { id: 'ambulance', label: 'Ambulance',   emoji: '🚑',   color: '#f87171', glow: 'rgba(248,113,113,0.7)',  angle: 90,   tab: 'ambulance', desc: '4-Min Emergency SOS',   why: 'GPS-dispatched BLS/ALS. Paramedic-to-ER teleconsult en route.' },
  { id: 'hospital',  label: 'Hospital',    emoji: '🏥',   color: '#4ade80', glow: 'rgba(74,222,128,0.55)',  angle: 150,  tab: 'hospital',  desc: 'Smart Hospital OS',     why: 'Beds, OPD, IPD, labs, billing — one intelligent platform.' },
  { id: 'pharmacy',  label: 'Pharmacy',    emoji: '💊',   color: '#60a5fa', glow: 'rgba(96,165,250,0.55)',  angle: 210,  tab: 'pharmacy',  desc: 'Medicines Delivered',   why: '25,000+ pharmacies. Same-day delivery. AI prescription check.' },
]

function r(deg) { return (deg * Math.PI) / 180 }
function nx(angle) { return CX + SPOKE_R * Math.cos(r(angle)) }
function ny(angle) { return CY + SPOKE_R * Math.sin(r(angle)) }
function trimPt(x1, y1, x2, y2, dist) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx*dx + dy*dy)
  return { x: x1 + dx*(dist/len), y: y1 + dy*(dist/len) }
}

function SpokeFlow({ node, idx }) {
  const x = nx(node.angle), y = ny(node.angle)
  const outPath = `M${CX},${CY} L${x},${y}`
  const inPath  = `M${x},${y} L${CX},${CY}`
  const base = idx * 0.22
  return (
    <g>
      {[0, 0.85, 1.7].map((d, i) => (
        <circle key={`o${i}`} r="4.5" fill={node.color} style={{ filter:`drop-shadow(0 0 5px ${node.color})` }}>
          <animateMotion dur="2.5s" begin={`${base+d}s`} repeatCount="indefinite" path={outPath} />
          <animate attributeName="r" values="1;4.5;4.5;1" keyTimes="0;0.12;0.85;1" dur="2.5s" begin={`${base+d}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.85;1" dur="2.5s" begin={`${base+d}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {[0.42, 1.27].map((d, i) => (
        <circle key={`in${i}`} r="3.5" fill={node.color} style={{ filter:`drop-shadow(0 0 4px ${node.color})` }}>
          <animateMotion dur="2.1s" begin={`${base+d}s`} repeatCount="indefinite" path={inPath} />
          <animate attributeName="opacity" values="0;0.75;0.75;0" keyTimes="0;0.1;0.85;1" dur="2.1s" begin={`${base+d}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  )
}

export default function EcosystemHero({ onTabChange }) {
  const [hovered, setHovered] = useState(null)
  const [bgImages, setBgImages] = useState([])
  const [bgIdx,    setBgIdx]    = useState(0)
  const [bgFade,   setBgFade]   = useState(true)
  const hNode = NODES.find(n => n.id === hovered)

  useEffect(() => {
    fetch('/api/hero-images')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setBgImages(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (bgImages.length < 2) return
    const timer = setInterval(() => {
      setBgFade(false)
      setTimeout(() => { setBgIdx(i => (i + 1) % bgImages.length); setBgFade(true) }, 600)
    }, 5000)
    return () => clearInterval(timer)
  }, [bgImages.length])

  const bgImage = bgImages[bgIdx]?.image_url || null

  return (
    <section
      className={styles.section}
      style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize:'cover', backgroundPosition:'center', transition:'opacity .6s ease', opacity: bgFade ? 1 : 0.6 } : {}}
    >
      {/* Animated dot-grid background */}
      <div className={styles.bgGrid} />
      {/* Dark overlay for text readability */}
      <div className={styles.bgOverlay} />

      {/* ── Main hero row ── */}
      <div className={styles.heroContainer}>
        <div className={styles.heroRow}>

          {/* ── LEFT: marketing copy ── */}
          <div className={styles.heroLeft}>
            <span className={styles.badge}>
              🌏 &nbsp;India's Geo-Powered Healthcare Ecosystem
            </span>

            <h1 className={styles.h1}>
              One Hub.{' '}
              <span className={styles.hl}>All Healthcare.</span>
            </h1>

            <p className={styles.sub}>
              GeoMedico is the intelligence layer connecting every pillar of India's
              healthcare — real-time, geo-located, and AI-powered.
            </p>

            <div className={styles.heroCta}>
              <button className={styles.ctaPrimary}>
                📍 Book Appointment →
              </button>
              <button className={styles.ctaGhost}>
                ▶&nbsp; How It Works
              </button>
            </div>

            <p className={styles.trustLine}>
              Trusted by&nbsp;<strong>50M+&nbsp;patients</strong>
              &nbsp;·&nbsp;<strong>1,20,000+&nbsp;doctors</strong>
              &nbsp;·&nbsp;<strong>500+&nbsp;cities</strong>&nbsp;across India
            </p>
          </div>

          {/* ── RIGHT: ecosystem SVG animation ── */}
          <div className={styles.diagramWrap}>
            <svg
              viewBox={`0 0 ${VW} ${VH}`}
              className={styles.svg}
              aria-label="GeoMedico ecosystem diagram"
            >
              <defs>
                <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#060d1a" />
                </radialGradient>
                <radialGradient id="hubAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
                {NODES.map(n => (
                  <radialGradient key={n.id} id={`ng-${n.id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor={n.color} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={n.color} stopOpacity="0.04" />
                  </radialGradient>
                ))}
                <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
                <filter id="tinyBlur"><feGaussianBlur stdDeviation="2.5" /></filter>
                <filter id="hubGlowF" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="10" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              <circle cx={CX} cy={CY} r={SPOKE_R+NODE_R+22} fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
              <circle cx={CX} cy={CY} r={SPOKE_R-NODE_R-8}  fill="none" stroke="rgba(255,255,255,0.03)"  strokeWidth="1" />
              <circle cx={CX} cy={CY} r="140"               fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />

              {NODES.map(n => {
                const x = nx(n.angle), y = ny(n.angle)
                return <line key={`sg-${n.id}`} x1={CX} y1={CY} x2={x} y2={y} stroke={n.color} strokeWidth="12" strokeOpacity={hovered===n.id?0.18:0.07} filter="url(#softBlur)" style={{ transition:'stroke-opacity 0.3s' }} />
              })}

              {NODES.map(n => {
                const x = nx(n.angle), y = ny(n.angle)
                const a = trimPt(CX,CY,x,y,HUB_R+5), b = trimPt(x,y,CX,CY,NODE_R+5)
                return <line key={`sl-${n.id}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={n.color} strokeWidth={hovered===n.id?1.8:1} strokeOpacity={hovered===n.id?0.65:0.22} style={{ transition:'all 0.35s' }} />
              })}

              {NODES.map((n,idx) => <SpokeFlow key={n.id} node={n} idx={idx} />)}

              <circle cx={CX} cy={CY} r={HUB_R+36} fill="url(#hubAura)" className={styles.hubAura} />
              <g className={styles.orbitRingWrap}>
                <circle cx={CX} cy={CY} r={HUB_R+20} fill="none" stroke="rgba(147,197,253,0.35)" strokeWidth="1.5" strokeDasharray="10 7" />
              </g>
              <g className={styles.orbitRingWrapRev}>
                <circle cx={CX} cy={CY} r={HUB_R+12} fill="none" stroke="rgba(99,179,237,0.18)" strokeWidth="1" strokeDasharray="5 9" />
              </g>
              <circle cx={CX} cy={CY} r={HUB_R} fill="url(#hubGrad)" stroke="#3b82f6" strokeWidth="2.5" filter="url(#hubGlowF)" className={styles.hubBody} />
              <circle cx={CX} cy={CY} r={HUB_R-12} fill="none" stroke="rgba(147,197,253,0.18)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1={CX-20} y1={CY} x2={CX+20} y2={CY} stroke="rgba(147,197,253,0.15)" strokeWidth="1" />
              <line x1={CX} y1={CY-20} x2={CX} y2={CY+20} stroke="rgba(147,197,253,0.15)" strokeWidth="1" />
              <text x={CX} y={CY-14} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="15" fontWeight="900" letterSpacing="3" fontFamily="Plus Jakarta Sans, Inter, sans-serif">GEO</text>
              <text x={CX} y={CY+5}  textAnchor="middle" dominantBaseline="middle" fill="#93c5fd" fontSize="13" fontWeight="800" letterSpacing="2" fontFamily="Plus Jakarta Sans, Inter, sans-serif">MEDICO</text>
              <text x={CX} y={CY+24} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.3)" fontSize="7.5" fontWeight="600" letterSpacing="1.5" fontFamily="Plus Jakarta Sans, Inter, sans-serif">● CONNECTED ●</text>

              {NODES.map((n, idx) => {
                const x = nx(n.angle), y = ny(n.angle)
                const isHov = hovered === n.id
                return (
                  <g key={n.id} transform={`translate(${x},${y})`} style={{ cursor:'pointer' }}
                    onMouseEnter={() => setHovered(n.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => { onTabChange(n.tab); document.getElementById('services')?.scrollIntoView({ behavior:'smooth' }) }}
                    role="button" tabIndex={0} aria-label={n.label}
                    onKeyDown={e => e.key==='Enter' && onTabChange(n.tab)}
                  >
                    <g className={styles.nodeFloat} style={{ '--fd':`${idx*0.45}s` }}>
                      <circle r={NODE_R+(isHov?14:0)} fill={`url(#ng-${n.id})`} style={{ transition:'r 0.35s' }} />
                      <circle r={NODE_R+(isHov?7:0)} fill="none" stroke={n.color} strokeWidth={isHov?1.5:0} strokeOpacity={isHov?0.55:0} filter="url(#tinyBlur)" style={{ transition:'all 0.35s' }} />
                      <circle r={NODE_R} fill={`${n.color}14`} stroke={n.color} strokeWidth={isHov?2.5:1.5} strokeOpacity={isHov?1:0.75}
                        style={{ transition:'all 0.35s', filter:isHov?`drop-shadow(0 0 14px ${n.color})`:`drop-shadow(0 0 4px ${n.color}60)` }} />
                      <text textAnchor="middle" dominantBaseline="middle" y={-5} fontSize={isHov?30:26} style={{ transition:'font-size 0.25s', userSelect:'none' }}>{n.emoji}</text>
                      <text textAnchor="middle" y={NODE_R+17} fill={isHov?n.color:'rgba(255,255,255,0.82)'} fontSize="12.5" fontWeight="800" fontFamily="Plus Jakarta Sans, Inter, sans-serif" style={{ transition:'fill 0.3s' }}>{n.label}</text>
                      <text textAnchor="middle" y={NODE_R+31} fill={n.color} fontSize="10" fontWeight="600" fontFamily="Plus Jakarta Sans, Inter, sans-serif" opacity={isHov?0.85:0} style={{ transition:'opacity 0.3s' }}>{n.desc}</text>
                      {isHov && <text textAnchor="middle" y={NODE_R+44} fill={n.color} fontSize="9" fontWeight="600" fontFamily="Plus Jakarta Sans, Inter, sans-serif" opacity="0.7">tap to explore →</text>}
                    </g>
                  </g>
                )
              })}
            </svg>

            {hNode && (
              <div className={styles.infoCard} style={{ '--nc':hNode.color, '--nglow':hNode.glow }}>
                <span className={styles.infoEmoji}>{hNode.emoji}</span>
                <div>
                  <div className={styles.infoTitle} style={{ color:hNode.color }}>{hNode.label}</div>
                  <div className={styles.infoWhy}>{hNode.why}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  )
}
