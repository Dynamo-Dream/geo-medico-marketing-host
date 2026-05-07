import { useEffect, useMemo, useState } from 'react'
import styles from './DirectoryTab.module.css'

const ACCENT = '#7c3aed'

const IcPin = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IcGlobe = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)
const IcMap = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
)

function LabCard({ item }) {
  const cert  = Array.isArray(item.cert)  ? item.cert  : []
  const tests = Array.isArray(item.tests) ? item.tests : []
  const location = item.area ? `${item.area}, ${[item.city, item.state].filter(Boolean).join(', ')}` : [item.city, item.state].filter(Boolean).join(', ') || '—'

  return (
    <div className={styles.card} style={{ '--accent': ACCENT }}>
      <div className={styles.cardImg}>
        {item.image_url
          ? <img src={item.image_url} alt={item.name} />
          : <div className={styles.cardImgPlaceholder}>🔬</div>
        }
        <div className={styles.cardImgBadge}>
          {cert.map(c => (
            <span key={c} className={styles.badge} style={{ background:'rgba(124,58,237,.85)', color:'white' }}>{c}</span>
          ))}
          {item.home_collection && (
            <span className={styles.badge} style={{ background:'rgba(0,184,148,.9)', color:'white' }}>Home Collection</span>
          )}
        </div>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{item.name}</h3>
        <p className={styles.cardLocation}>
          <IcPin />{location}
        </p>

        <div className={styles.infoRows}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Contact</span>
            <span className={styles.infoValue}>{item.contact || '—'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Phone</span>
            <span className={styles.infoValue}>{item.phone || '—'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Key Tests</span>
            <span className={styles.infoValue}>{tests.length > 0 ? tests.slice(0, 3).join(', ') : '—'}</span>
          </div>
        </div>

        {item.justdial_rating && (
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12.5, fontWeight:700, color:'#e85d04', background:'#fff7ed', border:'1px solid #fed7aa', padding:'4px 10px', borderRadius:8, width:'fit-content' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#e85d04" stroke="#e85d04" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {Number(item.justdial_rating).toFixed(1)} JustDial
          </div>
        )}
        <div className={styles.linkRow}>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.websiteLink} style={{ color: ACCENT, background:'#f5f3ff', borderColor:'#ddd6fe' }}>
              <IcGlobe />{item.url.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          )}
          {item.map_url && (
            <a href={item.map_url} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
              <IcMap />Map
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterPanel({ items, filters, onChange, open, onClose }) {
  const states = useMemo(() => [...new Set(items.map(i => i.state).filter(Boolean))].sort(), [items])
  const cities = useMemo(() => [...new Set(items.map(i => i.city).filter(Boolean))].sort(), [items])
  const certs  = useMemo(() => {
    const all = []
    items.forEach(i => { if (Array.isArray(i.cert)) i.cert.forEach(c => { if (c && !all.includes(c)) all.push(c) }) })
    return all.sort()
  }, [items])

  function toggle(key, val) {
    const cur = filters[key] || []
    onChange({ ...filters, [key]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] })
  }
  const Grp = ({ title, opts, filterKey }) => (
    <div className={styles.filterGroup}>
      <div className={styles.filterGroupTitle}>{title}</div>
      <div className={styles.filterOptions}>
        {opts.map(o => (
          <label key={o} className={styles.filterOption}>
            <input type="checkbox" checked={(filters[filterKey]||[]).includes(o)} onChange={() => toggle(filterKey, o)} />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </div>
  )
  return (
    <>
      {open && <div className={styles.filterOverlay} onClick={onClose} />}
      <aside className={`${styles.filterPanel} ${open ? styles.filterPanelOpen : ''}`} style={{ '--accent': ACCENT }}>
        <div className={styles.filterHeader}><span>Filters</span><button className={styles.filterClose} onClick={onClose}>✕</button></div>
        <div className={styles.filterBody}>
          <Grp title="State"          opts={states} filterKey="states" />
          <Grp title="City"           opts={cities} filterKey="cities" />
          <Grp title="Certification"  opts={certs}  filterKey="certs"  />
          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Services</div>
            <div className={styles.filterOptions}>
              <label className={styles.filterOption}><input type="checkbox" checked={filters.homeOnly||false} onChange={e => onChange({...filters, homeOnly: e.target.checked})} /><span>Home Collection</span></label>
            </div>
          </div>
        </div>
        <button className={styles.filterClear} onClick={() => onChange({ states:[], cities:[], certs:[], homeOnly:false })}>Clear All</button>
      </aside>
    </>
  )
}

export default function LabTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ states:[], cities:[], certs:[], homeOnly:false })
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    fetch('/api/labs').then(r => r.ok ? r.json() : Promise.reject()).then(d => { setItems(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => items.filter(l => {
    const q = search.toLowerCase()
    if (q && !`${l.name} ${l.city} ${l.area} ${l.state}`.toLowerCase().includes(q)) return false
    if (filters.states.length && !filters.states.includes(l.state)) return false
    if (filters.cities.length && !filters.cities.includes(l.city))  return false
    if (filters.certs.length) {
      const c = Array.isArray(l.cert) ? l.cert : []
      if (!filters.certs.some(x => c.includes(x))) return false
    }
    if (filters.homeOnly && !l.home_collection) return false
    return true
  }), [items, search, filters])

  const activeCount = filters.states.length + filters.cities.length + filters.certs.length + (filters.homeOnly?1:0)

  if (loading) return <div className={styles.loadingWrap}><div className={styles.loadingSpinner} style={{ '--accent':ACCENT }} /><p>Loading labs…</p></div>

  return (
    <div className={styles.page} style={{ '--accent': ACCENT }}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h2 className={styles.pageTitle}>Lab & Diagnostics Directory</h2>
          <span className={styles.pageCount}>{filtered.length} labs</span>
        </div>
        <div className={styles.topBarRight}>
          <div className={styles.searchBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Search name, city, certifications…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className={styles.filterBtn} onClick={() => setFilterOpen(o => !o)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            Filters {activeCount > 0 && <span className={styles.filterCount}>{activeCount}</span>}
          </button>
        </div>
      </div>
      <div className={styles.layout}>
        <FilterPanel items={items} filters={filters} onChange={setFilters} open={filterOpen} onClose={() => setFilterOpen(false)} />
        <div className={styles.grid}>
          {filtered.length === 0
            ? <div className={styles.empty}><span>🔍</span><p>No labs match your filters.</p><button onClick={() => { setSearch(''); setFilters({ states:[], cities:[], certs:[], homeOnly:false }) }}>Clear filters</button></div>
            : filtered.map(l => <LabCard key={l.id} item={l} />)
          }
        </div>
      </div>
    </div>
  )
}
