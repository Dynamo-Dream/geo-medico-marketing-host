import { useEffect, useMemo, useState } from 'react'
import styles from './DoctorTab.module.css'

// ── SVG icons (inline, no emoji) ──────────────────────────────────────────
const IcLocation = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IcClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IcFee = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)
const IcStar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

// ── Doctor Profile Popup ───────────────────────────────────────────────────
function ProfilePopup({ doctor, onClose }) {
  const initials = doctor.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className={styles.popupOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.popup}>

        {/* ── Hero banner strip ── */}
        <div className={styles.popupBanner}>
          <button className={styles.popupClose} onClick={onClose}>✕</button>
        </div>

        {/* ── Avatar lifted over banner ── */}
        <div className={styles.popupAvatarWrap}>
          <div className={styles.popupAvatar}>
            {doctor.image_url
              ? <img src={doctor.image_url} alt={doctor.name} />
              : <span>{initials}</span>
            }
          </div>
          {doctor.verified && <span className={styles.verifiedBadge}>✓ Verified</span>}
        </div>

        {/* ── Identity ── */}
        <div className={styles.popupIdentity}>
          <h2 className={styles.popupName}>{doctor.name}</h2>
          <p className={styles.popupSpecialty}>{doctor.specialty}</p>
          {doctor.qual && <p className={styles.popupQual}>{doctor.qual}</p>}
        </div>

        {/* ── Stats row ── */}
        <div className={styles.popupStats}>
          {(doctor.city || doctor.state) && (
            <div className={styles.popupStat}>
              <IcLocation />
              <span>{[doctor.city, doctor.state].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {doctor.exp > 0 && (
            <div className={styles.popupStat}>
              <span>{doctor.exp} yrs experience</span>
            </div>
          )}
          {doctor.fee && (
            <div className={styles.popupStat}>
              <span>{doctor.fee}</span>
            </div>
          )}
          {doctor.justdial_rating && (
            <div className={styles.popupStat}>
              <IcStar />
              <span>{Number(doctor.justdial_rating).toFixed(1)} JustDial</span>
            </div>
          )}
        </div>

        {/* ── Content sections ── */}
        <div className={styles.popupSections}>
          {doctor.address && (
            <div className={styles.popupSection}>
              <div className={styles.popupSectionLabel}>Current Practice</div>
              <p className={styles.popupSectionBody}>{doctor.address}</p>
            </div>
          )}
          {doctor.education && (
            <div className={styles.popupSection}>
              <div className={styles.popupSectionLabel}>Education</div>
              <p className={styles.popupSectionBody}>{doctor.education}</p>
            </div>
          )}
          {doctor.achievements && (
            <div className={styles.popupSection}>
              <div className={styles.popupSectionLabel}>Achievements</div>
              <p className={styles.popupSectionBody}>{doctor.achievements}</p>
            </div>
          )}
          {doctor.past_experience && (
            <div className={styles.popupSection}>
              <div className={styles.popupSectionLabel}>Past Experience</div>
              <p className={styles.popupSectionBody}>{doctor.past_experience}</p>
            </div>
          )}
        </div>

        {/* ── Email ── */}
        {doctor.email && (
          <div className={styles.popupEmail}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-10 7L2 7"/>
            </svg>
            {doctor.email}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Doctor Card ────────────────────────────────────────────────────────────
function DoctorCard({ item, onProfile }) {
  const initials = item.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const location = item.address || [item.city, item.state].filter(Boolean).join(', ') || '—'

  return (
    <div className={styles.card}>
      {/* ── Header: avatar left, identity right ── */}
      <div className={styles.cardTop}>
        <div className={styles.avatarWrap}>
          {item.image_url
            ? <img src={item.image_url} alt={item.name} className={styles.avatarImg} />
            : <div className={styles.avatarFallback}>{initials}</div>
          }
        </div>
        <div className={styles.cardIdentity}>
          <h3 className={styles.cardName}>{item.name}</h3>
          <p className={styles.cardSpecialty}>{item.specialty || '—'}</p>
          {item.qual && <p className={styles.cardQual}>{item.qual}</p>}
          {item.justdial_rating && (
            <span className={styles.ratingBadge}>
              <IcStar />{Number(item.justdial_rating).toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* ── Info rows — always 3, gives uniform height ── */}
      <div className={styles.infoRows}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}><IcLocation /> Location</span>
          <span className={styles.infoValue}>{location}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Experience</span>
          <span className={styles.infoValue}>{item.exp > 0 ? `${item.exp} years` : '—'}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Consultant Fee</span>
          <span className={styles.infoValue}>{item.fee || '—'}</span>
        </div>
      </div>

      {/* ── Button always at bottom ── */}
      <button className={styles.profileBtn} onClick={() => onProfile(item)}>
        View Profile
      </button>
    </div>
  )
}

// ── Filter Panel ───────────────────────────────────────────────────────────
function FilterPanel({ doctors, filters, onChange, open, onClose }) {
  const specialties = useMemo(() => [...new Set(doctors.map(d => d.specialty).filter(Boolean))].sort(), [doctors])
  const states      = useMemo(() => [...new Set(doctors.map(d => d.state).filter(Boolean))].sort(), [doctors])
  const cities      = useMemo(() => [...new Set(doctors.map(d => d.city).filter(Boolean))].sort(), [doctors])

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
            <input type="checkbox"
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
          <FilterGroup title="Specialty"  items={specialties} filterKey="specialties" />
          <FilterGroup title="State"      items={states}      filterKey="states"      />
          <FilterGroup title="City"       items={cities}      filterKey="cities"      />

          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Verified Only</div>
            <label className={styles.filterOption}>
              <input type="checkbox"
                checked={filters.verifiedOnly || false}
                onChange={e => onChange({ ...filters, verifiedOnly: e.target.checked })}
              />
              <span>Show verified doctors</span>
            </label>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Min Rating</div>
            <input type="range" min="0" max="5" step="0.5"
              value={filters.minRating || 0}
              onChange={e => onChange({ ...filters, minRating: parseFloat(e.target.value) })}
              className={styles.filterRange}
            />
            <div className={styles.filterRangeVal}>{filters.minRating || 0}+ ★</div>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterGroupTitle}>Min Experience</div>
            <input type="range" min="0" max="30" step="1"
              value={filters.minExp || 0}
              onChange={e => onChange({ ...filters, minExp: parseInt(e.target.value) })}
              className={styles.filterRange}
            />
            <div className={styles.filterRangeVal}>{filters.minExp || 0}+ years</div>
          </div>
        </div>
        <button className={styles.filterClear}
          onClick={() => onChange({ specialties:[], states:[], cities:[], verifiedOnly:false, minRating:0, minExp:0 })}>
          Clear All Filters
        </button>
      </aside>
    </>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function DoctorTab() {
  const [doctors,    setDoctors]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [filters,    setFilters]    = useState({ specialties:[], states:[], cities:[], verifiedOnly:false, minRating:0, minExp:0 })
  const [filterOpen, setFilterOpen] = useState(false)
  const [profileDoc, setProfileDoc] = useState(null)

  useEffect(() => {
    fetch('/api/doctors')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setDoctors(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return doctors.filter(d => {
      const q = search.toLowerCase()
      if (q && !`${d.name} ${d.specialty} ${d.city} ${d.qual}`.toLowerCase().includes(q)) return false
      if (filters.specialties.length && !filters.specialties.includes(d.specialty)) return false
      if (filters.states.length      && !filters.states.includes(d.state))          return false
      if (filters.cities.length      && !filters.cities.includes(d.city))           return false
      if (filters.verifiedOnly       && !d.verified)                                 return false
      if (filters.minRating > 0      && (!d.rating || Number(d.rating) < filters.minRating)) return false
      if (filters.minExp > 0         && d.exp < filters.minExp)                      return false
      return true
    })
  }, [doctors, search, filters])

  const activeFilterCount = filters.specialties.length + filters.states.length + filters.cities.length
    + (filters.verifiedOnly ? 1 : 0) + (filters.minRating > 0 ? 1 : 0) + (filters.minExp > 0 ? 1 : 0)

  if (loading) return (
    <div className={styles.loadingWrap}>
      <div className={styles.loadingSpinner} />
      <p>Loading doctors…</p>
    </div>
  )

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h2 className={styles.pageTitle}>Doctor Directory</h2>
          <span className={styles.pageCount}>{filtered.length} doctors</span>
        </div>
        <div className={styles.topBarRight}>
          <div className={styles.searchBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input placeholder="Search name, specialty, city…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className={styles.filterBtn} onClick={() => setFilterOpen(o => !o)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filters
            {activeFilterCount > 0 && <span className={styles.filterCount}>{activeFilterCount}</span>}
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        <FilterPanel doctors={doctors} filters={filters} onChange={setFilters}
          open={filterOpen} onClose={() => setFilterOpen(false)} />

        <div className={styles.grid}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <span>🔍</span>
              <p>No doctors match your filters.</p>
              <button onClick={() => { setSearch(''); setFilters({ specialties:[], states:[], cities:[], verifiedOnly:false, minRating:0, minExp:0 }) }}>
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map(d => <DoctorCard key={d.id} item={d} onProfile={setProfileDoc} />)
          )}
        </div>
      </div>

      {profileDoc && <ProfilePopup doctor={profileDoc} onClose={() => setProfileDoc(null)} />}
    </div>
  )
}
