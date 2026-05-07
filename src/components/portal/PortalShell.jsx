import { useState, useMemo } from 'react'
import { Download, Plus, Search, LayoutGrid, List, X, SearchX, CheckCircle2 } from 'lucide-react'
import styles from './PortalShell.module.css'

// ─── Status badge (re-exported for use in tab files) ──────────────────────────
export const STATUS_CFG = {
  active:     { label: 'Active',      dot: '●', color: '#16a34a', bg: '#dcfce7' },
  onboarding: { label: 'Onboarding',  dot: '◑', color: '#0a6ebd', bg: '#dbeafe' },
  lead:       { label: 'New Lead',    dot: '◆', color: '#d97706', bg: '#fef3c7' },
  inactive:   { label: 'Inactive',    dot: '○', color: '#6b7280', bg: '#f3f4f6' },
  online:     { label: 'Online',      dot: '●', color: '#16a34a', bg: '#dcfce7' },
  offline:    { label: 'Offline',     dot: '○', color: '#6b7280', bg: '#f3f4f6' },
}

export function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.lead
  return (
    <span className={styles.statusBadge}
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
      {cfg.dot} {cfg.label}
    </span>
  )
}

// ─── Lead stage mini-track ────────────────────────────────────────────────────
const STAGES = ['lead', 'onboarding', 'active']
export function StageTrack({ status }) {
  const idx = STAGES.indexOf(status)
  if (idx === -1) return null
  return (
    <div className={styles.stageTrack}>
      {STAGES.map((s, i) => (
        <span key={s} className={`${styles.stageDot} ${i <= idx ? styles.stageDotActive : ''}`}
          title={STATUS_CFG[s].label}
          style={i <= idx ? { background: STATUS_CFG[s].color } : {}} />
      ))}
    </div>
  )
}

// ─── PortalShell ─────────────────────────────────────────────────────────────
export default function PortalShell({
  config,            // { title, icon, color, accent, addLabel }
  stats,             // [{ icon, value, label, trend? }]
  items,             // array of data objects
  searchKeys = ['name'],
  renderCard,        // (item) => JSX
}) {
  const [search, setSearch]     = useState('')
  const [statusF, setStatusF]   = useState('all')
  const [cityF,   setCityF]     = useState('all')
  const [view,    setView]       = useState('grid')
  const [showAdd, setShowAdd]   = useState(false)

  const cities = useMemo(() => {
    const s = new Set(items.map(i => i.city).filter(Boolean))
    return ['all', ...s]
  }, [items])

  const counts = useMemo(() => ({
    all:        items.length,
    active:     items.filter(i => i.status === 'active' || i.status === 'online').length,
    onboarding: items.filter(i => i.status === 'onboarding').length,
    lead:       items.filter(i => i.status === 'lead').length,
    inactive:   items.filter(i => i.status === 'inactive' || i.status === 'offline').length,
  }), [items])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter(item => {
      const mQ = !q || searchKeys.some(k => String(item[k] || '').toLowerCase().includes(q))
      const mS = statusF === 'all' || item.status === statusF
      const mC = cityF  === 'all' || item.city  === cityF
      return mQ && mS && mC
    })
  }, [items, search, statusF, cityF, searchKeys])

  return (
    <div className={styles.shell}>

      {/* ── Portal header ── */}
      <div className={styles.portalHeader} style={{ '--pc': config.color }}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIconWrap} style={{ background: `${config.color}18`, borderColor: `${config.color}30` }}>
            <span>{config.icon}</span>
          </div>
          <div>
            <h2 className={styles.headerTitle}>{config.title}</h2>
            <p className={styles.headerSub}>
              {counts.all} total &nbsp;·&nbsp;
              <span style={{ color: '#16a34a', fontWeight: 700 }}>{counts.active} active</span> &nbsp;·&nbsp;
              <span style={{ color: '#d97706', fontWeight: 700 }}>{counts.lead} new leads</span> &nbsp;·&nbsp;
              {counts.onboarding} onboarding
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn} style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
            <Download size={14} /> Export
          </button>
          {config.addLabel && (
            <button className={styles.addBtn}
              style={{ background: config.color, boxShadow: `0 4px 16px ${config.color}40`, display:'inline-flex', alignItems:'center', gap:6 }}
              onClick={() => setShowAdd(true)}>
              <Plus size={14} /> {config.addLabel}
            </button>
          )}
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className={styles.statsStrip}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div className={styles.statVal}>{s.value}</div>
            <div className={styles.statLbl}>{s.label}</div>
            {s.trend != null && (
              <div className={s.trend >= 0 ? styles.trendUp : styles.trendDown}>
                {s.trend >= 0 ? '↑' : '↓'} {Math.abs(s.trend)}% this month
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Lead pipeline funnel ── */}
      <div className={styles.pipeline}>
        <span className={styles.pipelineTitle}>Lead Pipeline:</span>
        {[
          { key: 'lead',       label: 'New Leads',  color: '#d97706' },
          { key: 'onboarding', label: 'Onboarding', color: '#0a6ebd' },
          { key: 'active',     label: 'Active',     color: '#16a34a' },
          { key: 'inactive',   label: 'Inactive',   color: '#9ca3af' },
        ].map((p, i) => (
          <span key={p.key} className={styles.pipelineGroup}>
            <button
              className={`${styles.pipeBtn} ${statusF === p.key ? styles.pipeBtnOn : ''}`}
              style={{ '--pp': p.color }}
              onClick={() => setStatusF(statusF === p.key ? 'all' : p.key)}>
              <span className={styles.pipeCount} style={{ background: p.color }}>
                {counts[p.key]}
              </span>
              {p.label}
            </button>
            {i < 3 && <span className={styles.pipeArrow}>›</span>}
          </span>
        ))}
        {statusF !== 'all' && (
          <button className={styles.clearPipe} onClick={() => setStatusF('all')} style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}><Search size={15} /></span>
          <input className={styles.searchInput}
            type="text" placeholder={`Search ${config.title.toLowerCase()}…`}
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch('')}>
              <X size={13} />
            </button>
          )}
        </div>

        <select className={styles.sel} value={statusF} onChange={e => setStatusF(e.target.value)}>
          <option value="all">All Status</option>
          <option value="lead">New Lead</option>
          <option value="onboarding">Onboarding</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {cities.length > 2 && (
          <select className={styles.sel} value={cityF} onChange={e => setCityF(e.target.value)}>
            {cities.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All Cities' : c}</option>
            ))}
          </select>
        )}

        <div className={styles.viewToggle}>
          <button className={`${styles.vBtn} ${view === 'grid' ? styles.vBtnOn : ''}`}
            onClick={() => setView('grid')} title="Grid view"><LayoutGrid size={15} /></button>
          <button className={`${styles.vBtn} ${view === 'list' ? styles.vBtnOn : ''}`}
            onClick={() => setView('list')} title="List view"><List size={15} /></button>
        </div>
        <span className={styles.resultCount}>{filtered.length} / {items.length}</span>
      </div>

      {/* ── Card grid / list ── */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><SearchX size={40} /></div>
          <h3>No results found</h3>
          <p>Try adjusting your search or filters</p>
          <button className={styles.clearAll}
            onClick={() => { setSearch(''); setStatusF('all'); setCityF('all') }}>
            Clear all filters
          </button>
        </div>
      ) : (
        <div className={view === 'grid' ? styles.cardGrid : styles.cardList}>
          {filtered.map(item => renderCard(item))}
        </div>
      )}

      {/* ── Add toast ── */}
      {showAdd && (
        <div className={styles.addToast}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
            <CheckCircle2 size={15} color="#16a34a" /> Opening onboarding form for {config.addLabel}…
          </span>
          <button onClick={() => setShowAdd(false)}><X size={14} /></button>
        </div>
      )}
    </div>
  )
}
