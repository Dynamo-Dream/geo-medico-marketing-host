import { useEffect, useMemo, useState } from 'react'
import styles from './HospitalTab.module.css'

function StarBar({ value, max = 5 }) {
  if (!value) return <span style={{ color:'#94a3b8', fontSize:12 }}>N/A</span>
  const pct = (parseFloat(value) / max) * 100
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
      <div style={{ width:60, height:6, background:'#e2e8f0', borderRadius:4, overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, height:'100%', background:'#f59e0b', borderRadius:4 }} />
      </div>
      <span style={{ fontSize:12, fontWeight:700, color:'#1e293b' }}>{parseFloat(value).toFixed(1)}</span>
    </div>
  )
}

function RatingBlock({ label, value, color }) {
  return (
    <div className={styles.ratingBlock}>
      <div className={styles.ratingLabel} style={{ color }}>{label}</div>
      <div className={styles.ratingValue} style={{ color: value ? '#1e293b' : '#94a3b8' }}>
        {value ? `${parseFloat(value).toFixed(1)} ★` : '—'}
      </div>
      <StarBar value={value} />
    </div>
  )
}

function HospitalCard({ item }) {
  const sp = Array.isArray(item.specialties) ? item.specialties : []
  return (
    <div className={styles.card}>
      {/* Image */}
      <div className={styles.cardImg}>
        {item.image_url
          ? <img src={item.image_url} alt={item.name} />
          : <div className={styles.cardImgPlaceholder}>🏥</div>
        }
        <div className={styles.typePill}>{item.type}</div>
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{item.name}</h3>
        <p className={styles.cardLocation}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {[item.city, item.state, item.country].filter(Boolean).join(', ')}
        </p>
        {item.address && <p className={styles.cardAddress}>{item.address}</p>}

        {/* Details row */}
        <div className={styles.cardMeta}>
          {item.beds > 0 && (
            <span className={styles.metaPill}>🛏️ {item.beds} Beds</span>
          )}
          {item.phone && (
            <a href={`tel:${item.phone}`} className={styles.metaPill} style={{ textDecoration:'none' }}>
              📞 {item.phone}
            </a>
          )}
        </div>

        {/* Specialties */}
        {sp.length > 0 && (
          <div className={styles.tags}>
            {sp.slice(0, 4).map(s => <span key={s} className={styles.tag}>{s}</span>)}
            {sp.length > 4 && <span className={styles.tagMore}>+{sp.length - 4}</span>}
          </div>
        )}

        {/* 3 Ratings */}
        <div className={styles.ratingsRow}>
          <RatingBlock label="JustDial"   value={item.justdial_rating} color="#e85d04" />
          <RatingBlock label="Quora"      value={item.quora_rating}    color="#b92b27" />
          <RatingBlock label="GeoMedico"  value={item.own_rating}      color="#0a6ebd" />
        </div>

        {/* Website */}
        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            {item.url.replace(/^https?:\/\/(www\.)?/, '')}
          </a>
        )}
      </div>
    </div>
  )
}

function FilterPanel({ hospitals, filters, onChange, open, onClose }) {
  const types   = useMemo(() => [...new Set(hospitals.map(h => h.type).filter(Boolean))].sort(), [hospitals])
  const states  = useMemo(() => [...new Set(hospitals.map(h => h.state).filter(Boolean))].sort(), [hospitals])
  const cities  = useMemo(() => [...new Set(hospitals.map(h => h.city).filter(Boolean))].sort(), [hospitals])
  const specs   = useMemo(() => {
    const all = []
    hospitals.forEach(h => { if (Array.isArray(h.specialties)) h.specialties.forEach(s => { if (s && !all.includes(s)) all.push(s) }) })
    return all.sort()
  }, [hospitals])

  function toggle(key, val) {
    const cur = filters[key] || []
    onChange({ ...filters, [key]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] })
  }

  const FilterGroup = ({ title, items, filterKey }) => (
    <div className={styles.filterGroup}>
      <div className={styles.filterGroupTitle}>{title}</div>
      <div className={styles.filterOptions}>
        {items.map(item => (
          <label key={item} className={styles.filterOption}>
            <input
              type="checkbox"
              checked={(filters[filterKey] || []).includes(item)}
              onChange={() => toggle(filterKey, item)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {open && <div className={styles.filterOverlay} onClick={onClose} />}
      <aside className={`${styles.filterPanel} ${open ? styles.filterPanelOpen : ''}`}>
        <div className={styles.filterHeader}>
          <span>Filters</span>
          <button className={styles.filterClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.filterBody}>
          <FilterGroup title="Hospital Type" items={types}  filterKey="types"  />
          <FilterGroup title="State"         items={states} filterKey="states" />
          <FilterGroup title="City"          items={cities} filterKey="cities" />
          <FilterGroup title="Specialty"     items={specs}  filterKey="specs"  />

          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Min Rating (GeoMedico)</div>
            <input type="range" min="0" max="5" step="0.5"
              value={filters.minRating || 0}
              onChange={e => onChange({ ...filters, minRating: parseFloat(e.target.value) })}
              className={styles.filterRange}
            />
            <div className={styles.filterRangeVal}>{filters.minRating || 0}+ ★</div>
          </div>
        </div>

        <button className={styles.filterClear}
          onClick={() => onChange({ types:[], states:[], cities:[], specs:[], minRating:0 })}>
          Clear All Filters
        </button>
      </aside>
    </>
  )
}

export default function HospitalTab() {
  const [hospitals, setHospitals] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [filters,   setFilters]   = useState({ types:[], states:[], cities:[], specs:[], minRating:0 })
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    fetch('/api/hospitals')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setHospitals(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return hospitals.filter(h => {
      const q = search.toLowerCase()
      if (q && !`${h.name} ${h.city} ${h.state} ${h.type}`.toLowerCase().includes(q)) return false
      if (filters.types.length  && !filters.types.includes(h.type))   return false
      if (filters.states.length && !filters.states.includes(h.state)) return false
      if (filters.cities.length && !filters.cities.includes(h.city))  return false
      if (filters.specs.length) {
        const sp = Array.isArray(h.specialties) ? h.specialties : []
        if (!filters.specs.some(s => sp.includes(s))) return false
      }
      if (filters.minRating > 0 && (!h.own_rating || parseFloat(h.own_rating) < filters.minRating)) return false
      return true
    })
  }, [hospitals, search, filters])

  const activeFilterCount = (filters.types.length + filters.states.length + filters.cities.length + filters.specs.length) + (filters.minRating > 0 ? 1 : 0)

  if (loading) return (
    <div className={styles.loadingWrap}>
      <div className={styles.loadingSpinner} />
      <p>Loading hospitals…</p>
    </div>
  )

  return (
    <div className={styles.page}>
      {/* Header bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h2 className={styles.pageTitle}>🏥 Hospital Directory</h2>
          <span className={styles.pageCount}>{filtered.length} hospitals</span>
        </div>
        <div className={styles.topBarRight}>
          <div className={styles.searchBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              placeholder="Search hospitals, city, type…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className={styles.filterBtn} onClick={() => setFilterOpen(o => !o)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filters
            {activeFilterCount > 0 && <span className={styles.filterCount}>{activeFilterCount}</span>}
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        <FilterPanel
          hospitals={hospitals}
          filters={filters}
          onChange={setFilters}
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
        />

        <div className={styles.grid}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <span>🔍</span>
              <p>No hospitals match your filters.</p>
              <button onClick={() => { setSearch(''); setFilters({ types:[], states:[], cities:[], specs:[], minRating:0 }) }}>
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map(h => <HospitalCard key={h.id} item={h} />)
          )}
        </div>
      </div>
    </div>
  )
}
