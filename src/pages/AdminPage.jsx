import { useEffect, useRef, useState } from 'react'
import styles from './AdminPage.module.css'

const ADMIN_PASSWORD = 'GeoAdmin@2024'

// ─── Reusable primitives ──────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className={styles.fieldGroup}>
      <label>{label}</label>
      {children}
    </div>
  )
}

function Inp({ ...props }) {
  return <input className={styles.input} {...props} />
}

function Sel({ children, ...props }) {
  return <select className={styles.input} {...props}>{children}</select>
}

function Txa({ ...props }) {
  return <textarea className={`${styles.input} ${styles.textarea}`} {...props} />
}

function Check({ label, checked, onChange }) {
  return (
    <label className={styles.checkLabel}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  )
}

function SaveBtn({ saving, saved, onClick, label = 'Save' }) {
  return (
    <button
      className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`}
      onClick={onClick}
      disabled={saving}
    >
      {saving ? '…' : saved ? '✓ Saved' : label}
    </button>
  )
}

function DeleteBtn({ onClick }) {
  return <button className={styles.deleteBtn} onClick={onClick}>🗑️ Delete</button>
}

function EditBtn({ onClick }) {
  return <button className={styles.editBtn} onClick={onClick}>✏️ Edit</button>
}

function CancelBtn({ onClick }) {
  return <button className={styles.cancelBtn} onClick={onClick}>Cancel</button>
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem('gm_admin', '1'); onLogin() }
    else { setErr(true); setPw('') }
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <div className={styles.loginIcon}>🔐</div>
        <h1 className={styles.loginTitle}>GeoMedico Admin</h1>
        <p className={styles.loginSub}>Enter admin password to continue</p>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <input type="password" placeholder="Admin password" value={pw}
            onChange={e => { setPw(e.target.value); setErr(false) }}
            className={`${styles.loginInput} ${err ? styles.loginInputErr : ''}`} autoFocus />
          {err && <p className={styles.loginErr}>Incorrect password.</p>}
          <button type="submit" className={styles.loginBtn}>Sign In</button>
        </form>
      </div>
    </div>
  )
}

// ─── Site Logo section ────────────────────────────────────────────────────────
function SiteLogoSection() {
  const [logoUrl, setLogoUrl] = useState(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(s => { if (s.logo_url) setLogoUrl(s.logo_url) }).catch(() => {})
  }, [])

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('logo', file)
      const res = await fetch('/api/settings/logo', { method: 'POST', body: fd })
      const data = await res.json()
      setLogoUrl(data.logo_url); setFile(null); setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch { alert('Upload failed.') } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!window.confirm('Remove the current logo?')) return
    await fetch('/api/settings/logo', { method: 'DELETE' })
    setLogoUrl(null)
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🎨 Site Logo</h2>
        <p className={styles.sectionDesc}>
          This logo appears in the navigation bar and the footer. Accepted formats: PNG, SVG, JPG. Max size: 5 MB.
        </p>
      </div>
      <div className={styles.addForm}>
        <div style={{ background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:10, padding:'12px 16px', marginBottom:20, fontSize:13 }}>
          <strong style={{ color:'#0369a1' }}>📐 Recommended size:</strong>
          <span style={{ marginLeft:8, color:'#1e3a5f' }}>Height 80–120 px, any width (transparent background preferred)</span>
          <br />
          <span style={{ color:'#64748b', fontSize:12, display:'block', marginTop:4 }}>PNG or SVG with a transparent background looks best on both light and dark backgrounds.</span>
        </div>
        {logoUrl && (
          <div style={{ marginBottom:20, padding:16, background:'#0c1c3a', borderRadius:12, display:'inline-flex', alignItems:'center', gap:16 }}>
            <img src={logoUrl} alt="Current logo" style={{ height:60, objectFit:'contain' }} />
            <div>
              <div style={{ color:'rgba(255,255,255,.6)', fontSize:12, marginBottom:8 }}>Current logo</div>
              <button className={styles.deleteBtn} onClick={handleDelete}>🗑️ Remove Logo</button>
            </div>
          </div>
        )}
        <form onSubmit={handleUpload} style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml" style={{ display:'none' }}
            onChange={e => { const f = e.target.files[0]; if(f){ setFile(f); setPreview(URL.createObjectURL(f)) } }} />
          {preview && <img src={preview} alt="preview" style={{ height:50, objectFit:'contain', borderRadius:8, border:'1px solid #e2e8f0' }} />}
          <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
            {file ? '📷 Change Selection' : '📷 Select Logo File'}
          </button>
          <SaveBtn saving={saving} saved={false} onClick={handleUpload} label="Upload Logo" />
        </form>
      </div>
    </div>
  )
}

// ─── About Story Image section ────────────────────────────────────────────────
function StoryImageSection() {
  const [imageUrl, setImageUrl] = useState(null)
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [saving, setSaving]     = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(s => { if (s.story_image_url) setImageUrl(s.story_image_url) }).catch(() => {})
  }, [])

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return
    setSaving(true)
    try {
      const fd = new FormData(); fd.append('image', file)
      const res  = await fetch('/api/settings/story-image', { method:'POST', body:fd })
      const data = await res.json()
      setImageUrl(data.story_image_url); setFile(null); setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch { alert('Upload failed.') } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!window.confirm('Remove the story image?')) return
    await fetch('/api/settings/story-image', { method:'DELETE' })
    setImageUrl(null)
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📸 About Page — Our Story Image</h2>
        <p className={styles.sectionDesc}>
          This image appears on the left side of the "Our Story" section on the About page.
          Recommended: 800 × 600 px (4:3 ratio), JPG/PNG. Max 5 MB.
        </p>
      </div>
      <div className={styles.addForm}>
        {imageUrl && (
          <div style={{ marginBottom:20 }}>
            <img src={imageUrl} alt="Story" style={{ width:'100%', maxWidth:360, borderRadius:12, objectFit:'cover', border:'1px solid #e2e8f0', display:'block' }} />
            <button className={styles.deleteBtn} onClick={handleDelete} style={{ marginTop:10 }}>🗑️ Remove Image</button>
          </div>
        )}
        <form onSubmit={handleUpload} style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" style={{ display:'none' }}
            onChange={e => { const f=e.target.files[0]; if(f){ setFile(f); setPreview(URL.createObjectURL(f)) } }} />
          {preview && <img src={preview} alt="preview" style={{ height:60, borderRadius:8, border:'1px solid #e2e8f0', objectFit:'cover' }} />}
          <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
            {file ? '📷 Change Selection' : '📷 Select Story Image'}
          </button>
          <SaveBtn saving={saving} saved={false} onClick={handleUpload} label="Upload Story Image" />
        </form>
      </div>
    </div>
  )
}

// ─── Social Links section ─────────────────────────────────────────────────────
const SOCIAL_FIELDS = [
  { key: 'youtube_url',   label: 'YouTube',   placeholder: 'https://youtube.com/@yourchannel' },
  { key: 'linkedin_url',  label: 'LinkedIn',  placeholder: 'https://linkedin.com/company/yourcompany' },
  { key: 'twitter_url',   label: 'X (Twitter)', placeholder: 'https://x.com/yourhandle' },
  { key: 'instagram_url', label: 'Instagram', placeholder: 'https://instagram.com/yourprofile' },
]

function SocialLinksSection() {
  const [form, setForm] = useState({ youtube_url:'', linkedin_url:'', twitter_url:'', instagram_url:'' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(s => {
      setForm(f => ({ ...f, ...Object.fromEntries(SOCIAL_FIELDS.map(sf => [sf.key, s[sf.key]||''])) }))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/settings', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(form) })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch { alert('Save failed.') } finally { setSaving(false) }
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🔗 Social Media Links</h2>
        <p className={styles.sectionDesc}>These links are attached to the social icons in the footer. Leave blank to disable a link.</p>
      </div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : (
        <div className={styles.addForm}>
          <div className={styles.formGrid}>
            {SOCIAL_FIELDS.map(sf => (
              <Field key={sf.key} label={sf.label}>
                <input
                  className={styles.input}
                  type="url"
                  value={form[sf.key]}
                  onChange={e => setForm(f => ({ ...f, [sf.key]: e.target.value }))}
                  placeholder={sf.placeholder}
                />
              </Field>
            ))}
            <SaveBtn saving={saving} saved={saved} onClick={handleSave} label="Save Social Links" />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Hero Images section ──────────────────────────────────────────────────────
const HERO_IMG_SPEC = {
  width: 1920, height: 900, label: '1920 × 900 px (landscape, ~2:1 ratio)',
}

function HeroImagesSection() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    fetch('/api/hero-images/all')
      .then(r => r.json())
      .then(d => { setImages(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('caption', caption)
      const res = await fetch('/api/hero-images', { method: 'POST', body: fd })
      const created = await res.json()
      setImages(p => [created, ...p])
      setFile(null); setPreview(null); setCaption('')
      if (fileRef.current) fileRef.current.value = ''
    } catch { alert('Upload failed.') } finally { setSaving(false) }
  }

  async function handleToggle(img) {
    const res = await fetch(`/api/hero-images/${img.id}/toggle`, { method: 'PATCH' })
    const updated = await res.json()
    setImages(p => p.map(x => x.id === updated.id ? updated : x))
  }

  async function handleDelete(img) {
    if (!window.confirm(`Delete this banner image?`)) return
    await fetch(`/api/hero-images/${img.id}`, { method: 'DELETE' })
    setImages(p => p.filter(x => x.id !== img.id))
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🖼️ Hero Background Image</h2>
        <p className={styles.sectionDesc}>
          This image is used as the full-width background of the hero section on the homepage. Only the first active image is shown.
        </p>
      </div>

      {/* Upload form */}
      <form className={styles.addForm} onSubmit={handleUpload}>
        <h3 className={styles.addTitle}>Upload New Banner Photo</h3>

        {/* Pixel spec notice */}
        <div style={{
          background: 'linear-gradient(135deg,#eff6ff,#ecfdf5)',
          border: '1px solid #bfdbfe',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 16,
          fontSize: 13,
        }}>
          <strong style={{ color:'#1d4ed8' }}>📐 Required image size:</strong>
          <span style={{ marginLeft: 8, color:'#1e3a5f' }}>{HERO_IMG_SPEC.label}</span>
          <br />
          <span style={{ color:'#64748b', fontSize:12, marginTop:4, display:'block' }}>
            Please crop/resize your photo to exactly {HERO_IMG_SPEC.width} × {HERO_IMG_SPEC.height} px before uploading
            for the best display quality. Max file size: 8 MB. Formats: JPG, PNG, WebP.
          </span>
        </div>

        <div className={styles.addGrid}>
          <div className={styles.addImgWrap}>
            <div
              className={styles.addImgPreview}
              onClick={() => fileRef.current?.click()}
              style={{ aspectRatio: `${HERO_IMG_SPEC.width}/${HERO_IMG_SPEC.height}`, maxWidth: 160 }}
            >
              {preview
                ? <img src={preview} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <div className={styles.addImgPlaceholder}><span>🖼️</span><span>Click to upload</span></div>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
              onChange={e => {
                const f = e.target.files[0]
                if (!f) return
                setFile(f); setPreview(URL.createObjectURL(f))
              }} />
            <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
              {file ? '📷 Change Image' : '📷 Select Image'}
            </button>
          </div>
          <div className={styles.addFields}>
            <Field label="Caption (optional)">
              <input
                className={styles.input}
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="e.g. World Diabetes Day — Free Screening"
              />
            </Field>
            <button type="submit" className={styles.addBtn} disabled={saving || !file}>
              {saving ? 'Uploading…' : '+ Upload Banner Photo'}
            </button>
          </div>
        </div>
      </form>

      {/* Existing images */}
      <div className={styles.campListHeader}>
        <h3>Banner Photos ({images.length}) — shown in order below</h3>
      </div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : images.length === 0 ? (
        <div className={styles.emptyState}><span>🖼️</span><p>No banner photos yet. Upload one above.</p></div>
      ) : (
        <div className={styles.campList}>
          {images.map(img => (
            <div key={img.id} className={styles.campItem}>
              <div className={styles.campThumb} style={{ width: 90, height: 120, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                <img src={img.image_url} alt={img.caption || ''} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
              <div className={styles.campInfo}>
                <h4 className={styles.campTitle}>{img.caption || <em style={{ opacity:.4 }}>No caption</em>}</h4>
                <span className={styles.campDate}>
                  {new Date(img.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                  &nbsp;·&nbsp;
                  <span style={{ color: img.active ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                    {img.active ? '● Visible' : '○ Hidden'}
                  </span>
                </span>
              </div>
              <div className={styles.campActions}>
                <button
                  className={styles.editBtn}
                  onClick={() => handleToggle(img)}
                  title={img.active ? 'Hide from homepage' : 'Show on homepage'}
                >
                  {img.active ? '👁️ Hide' : '👁️ Show'}
                </button>
                <DeleteBtn onClick={() => handleDelete(img)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Stats section ────────────────────────────────────────────────────────────
function StatRow({ stat, onSaved }) {
  const [form, setForm] = useState({ value: stat.value, label: stat.label, icon: stat.icon })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/stats/${stat.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      onSaved(await res.json())
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch { alert('Save failed.') }
    finally { setSaving(false) }
  }

  return (
    <div className={styles.statRow}>
      <input className={`${styles.input} ${styles.inputIcon}`} value={form.icon}
        onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} title="Emoji icon" />
      <input className={`${styles.input} ${styles.inputVal}`} value={form.value}
        onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="Value" />
      <input className={`${styles.input} ${styles.inputLabel}`} value={form.label}
        onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="Label" />
      <SaveBtn saving={saving} saved={saved} onClick={handleSave} />
    </div>
  )
}

function StatsSection() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => { setStats(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📊 Stats Strip</h2>
        <p className={styles.sectionDesc}>Edit the headline numbers shown on the public site.</p>
      </div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : (
        <div className={styles.statsList}>
          <div className={styles.statRowHead}><span>Icon</span><span>Value</span><span>Label</span><span /></div>
          {stats.map(s => <StatRow key={s.id} stat={s} onSaved={u => setStats(prev => prev.map(x => x.id === u.id ? u : x))} />)}
        </div>
      )}
    </div>
  )
}

// ─── Campaigns section ────────────────────────────────────────────────────────
function CampaignItem({ campaign, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: campaign.title, description: campaign.description })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  async function handleSave() {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title); fd.append('description', form.description)
      if (file) fd.append('image', file)
      const res = await fetch(`/api/campaigns/${campaign.id}`, { method: 'PUT', body: fd })
      onUpdated(await res.json()); setEditing(false); setFile(null); setPreview(null)
    } catch { alert('Save failed.') } finally { setSaving(false) }
  }

  const imgSrc = preview || campaign.image_url
  return (
    <div className={styles.campItem}>
      <div className={styles.campThumb}>
        {imgSrc ? <img src={imgSrc} alt={campaign.title} /> : <div className={styles.campThumbPlaceholder}>📢</div>}
      </div>
      {editing ? (
        <div className={styles.campEdit}>
          <Inp value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" />
          <Txa value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Description" />
          <div className={styles.campEditActions}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
              onChange={e => { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])) }} />
            <button className={styles.uploadBtn} type="button" onClick={() => fileRef.current?.click()}>
              {file ? '📷 Image selected' : '📷 Change Image'}
            </button>
            <SaveBtn saving={saving} saved={false} onClick={handleSave} />
            <CancelBtn onClick={() => { setEditing(false); setFile(null); setPreview(null) }} />
          </div>
        </div>
      ) : (
        <div className={styles.campInfo}>
          <h4 className={styles.campTitle}>{campaign.title}</h4>
          <p className={styles.campDesc}>{campaign.description || <em style={{ opacity:.4 }}>No description</em>}</p>
          <span className={styles.campDate}>{new Date(campaign.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
        </div>
      )}
      {!editing && (
        <div className={styles.campActions}>
          <EditBtn onClick={() => setEditing(true)} />
          <DeleteBtn onClick={async () => {
            if (!window.confirm(`Delete "${campaign.title}"?`)) return
            await fetch(`/api/campaigns/${campaign.id}`, { method:'DELETE' })
            onDeleted(campaign.id)
          }} />
        </div>
      )}
    </div>
  )
}

function AddCampaignForm({ onAdded }) {
  const [form, setForm] = useState({ title: '', description: '' })
  const [file, setFile] = useState(null); const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  async function handleSubmit(e) {
    e.preventDefault(); if (!form.title.trim()) return; setSaving(true)
    try {
      const fd = new FormData(); fd.append('title', form.title); fd.append('description', form.description)
      if (file) fd.append('image', file)
      const res = await fetch('/api/campaigns', { method: 'POST', body: fd })
      onAdded(await res.json()); setForm({ title:'', description:'' }); setFile(null); setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch { alert('Failed to add.') } finally { setSaving(false) }
  }

  return (
    <form className={styles.addForm} onSubmit={handleSubmit}>
      <h3 className={styles.addTitle}>Add New Campaign</h3>
      <div className={styles.addGrid}>
        <div className={styles.addImgWrap}>
          <div className={styles.addImgPreview} onClick={() => fileRef.current?.click()}>
            {preview ? <img src={preview} alt="preview" /> : <div className={styles.addImgPlaceholder}><span>🖼️</span><span>Click to upload</span></div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
            onChange={e => { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])) }} />
          <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
            {file ? '📷 Change Image' : '📷 Upload Image'}
          </button>
        </div>
        <div className={styles.addFields}>
          <Field label="Campaign Title *"><Inp value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Free Diabetes Screening Camp" required /></Field>
          <Field label="Description"><Txa value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} placeholder="Brief description…" /></Field>
          <button type="submit" className={styles.addBtn} disabled={saving}>{saving ? 'Adding…' : '+ Add Campaign'}</button>
        </div>
      </div>
    </form>
  )
}

function CampaignsSection() {
  const [campaigns, setCampaigns] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/campaigns').then(r => r.json()).then(d => { setCampaigns(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📢 Campaign Cards</h2>
        <p className={styles.sectionDesc}>These cards appear in the rotating carousel on the homepage.</p>
      </div>
      <AddCampaignForm onAdded={c => setCampaigns(p => [c, ...p])} />
      <div className={styles.campListHeader}><h3>Existing Campaigns ({campaigns.length})</h3></div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : campaigns.length === 0 ? (
        <div className={styles.emptyState}><span>📭</span><p>No campaigns yet.</p></div>
      ) : (
        <div className={styles.campList}>
          {campaigns.map(c => (
            <CampaignItem key={c.id} campaign={c}
              onUpdated={u => setCampaigns(p => p.map(x => x.id === u.id ? u : x))}
              onDeleted={id => setCampaigns(p => p.filter(x => x.id !== id))} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Testimonials section ─────────────────────────────────────────────────────
function AddTestimonialForm({ onAdded }) {
  const [form, setForm] = useState({ name:'', role:'', content:'', rating:'5' })
  const [file, setFile] = useState(null); const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  async function handleSubmit(e) {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => fd.append(k,v))
      if (file) fd.append('image', file)
      const res = await fetch('/api/testimonials', { method:'POST', body: fd })
      onAdded(await res.json()); setForm({ name:'', role:'', content:'', rating:'5' }); setFile(null); setPreview(null)
    } catch { alert('Failed to add.') } finally { setSaving(false) }
  }

  return (
    <form className={styles.addForm} onSubmit={handleSubmit}>
      <h3 className={styles.addTitle}>Add Testimonial</h3>
      <div className={styles.addGrid2}>
        <Field label="Name *"><Inp value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Patient / Partner name" required /></Field>
        <Field label="Role / Location"><Inp value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Patient, Mumbai" /></Field>
        <Field label="Rating (1–5)">
          <Sel value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
          </Sel>
        </Field>
        <Field label="Avatar (optional)">
          <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
            onChange={e => { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])) }} />
          <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
            {preview ? '✓ Image selected' : '📷 Upload Photo'}
          </button>
        </Field>
        <div style={{ gridColumn:'1/-1' }}>
          <Field label="Testimonial Content *">
            <Txa value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3} placeholder="What did they say about GeoMedico?" required />
          </Field>
        </div>
        <button type="submit" className={styles.addBtn} disabled={saving}>{saving ? 'Adding…' : '+ Add Testimonial'}</button>
      </div>
    </form>
  )
}

function TestimonialsSection() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/testimonials').then(r => r.json()).then(d => { setItems(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>💬 Testimonials</h2>
        <p className={styles.sectionDesc}>These appear below the registration form on the homepage.</p>
      </div>
      <AddTestimonialForm onAdded={t => setItems(p => [t, ...p])} />
      <div className={styles.campListHeader}><h3>Existing Testimonials ({items.length})</h3></div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : items.length === 0 ? (
        <div className={styles.emptyState}><span>💬</span><p>No testimonials yet.</p></div>
      ) : (
        <div className={styles.entityList}>
          {items.map(t => (
            <div key={t.id} className={styles.entityRow}>
              <div className={styles.entityAvatar}>{t.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}</div>
              <div className={styles.entityInfo}>
                <strong>{t.name}</strong>
                {t.role && <span style={{ color:'#64748b', marginLeft:8, fontSize:12 }}>{t.role}</span>}
                <span style={{ marginLeft:8 }}>{'★'.repeat(t.rating)}</span>
                <p className={styles.entityDesc}>{t.content}</p>
              </div>
              <div className={styles.campActions}>
                <DeleteBtn onClick={async () => {
                  if (!window.confirm('Delete this testimonial?')) return
                  await fetch(`/api/testimonials/${t.id}`, { method:'DELETE' })
                  setItems(p => p.filter(x => x.id !== t.id))
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Generic entity CRUD helper ───────────────────────────────────────────────
function useEntityCRUD(endpoint) {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(endpoint).then(r => r.json()).then(d => { setItems(d); setLoading(false) }).catch(() => setLoading(false))
  }, [endpoint])
  async function remove(id) {
    await fetch(`${endpoint}/${id}`, { method:'DELETE' }); setItems(p => p.filter(x => x.id !== id))
  }
  async function save(id, body) {
    const res = await fetch(`${endpoint}/${id}`, { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) })
    const updated = await res.json(); setItems(p => p.map(x => x.id === updated.id ? updated : x)); return updated
  }
  async function create(body) {
    const res = await fetch(endpoint, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) })
    const created = await res.json(); setItems(p => [created, ...p]); return created
  }
  function prepend(item) { setItems(p => [item, ...p]) }
  return { items, loading, remove, save, create, prepend }
}

// ─── Doctors section ──────────────────────────────────────────────────────────
function DoctorAddForm({ onCreated }) {
  const EMPTY = { name:'', specialty:'', city:'', state:'', exp:'', justdial_rating:'', fee:'', qual:'', verified:false, joined:'', email:'', address:'', phone:'', education:'', achievements:'', past_experience:'' }
  const [form, setForm] = useState(EMPTY)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const fileRef = useRef()
  const csvRef  = useRef()
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => fd.append(k, String(v)))
      if (file) fd.append('image', file)
      const res = await fetch('/api/doctors', { method:'POST', body: fd })
      const created = await res.json()
      onCreated(created)
      setForm(EMPTY); setFile(null); setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch { alert('Failed to add.') } finally { setSaving(false) }
  }

  async function handleImport(e) {
    e.preventDefault()
    if (!importFile) return
    setImporting(true); setImportResult(null)
    try {
      const fd = new FormData(); fd.append('file', importFile)
      const res = await fetch('/api/doctors/import', { method:'POST', body: fd })
      setImportResult(await res.json())
      setImportFile(null)
      if (csvRef.current) csvRef.current.value = ''
    } catch { alert('Import failed.') } finally { setImporting(false) }
  }

  return (
    <div>
      {/* Manual add form */}
      <form className={styles.addForm} onSubmit={handleAdd}>
        <h3 className={styles.addTitle}>Add Doctor Manually</h3>
        <div style={{ background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:10, padding:'10px 16px', marginBottom:16, fontSize:12.5, color:'#0369a1' }}>
          📸 <strong>Photo:</strong> Upload a clear face photo (passport-style). Supported: JPG, PNG. Max 5 MB.
        </div>
        <div className={styles.formGrid}>
          <Field label="Name *"><Inp value={form.name} onChange={s('name')} required placeholder="Dr. Full Name" /></Field>
          <Field label="Specialty *"><Inp value={form.specialty} onChange={s('specialty')} required placeholder="e.g. Cardiologist" /></Field>
          <Field label="Qualification"><Inp value={form.qual} onChange={s('qual')} placeholder="e.g. MD, MBBS (AIIMS)" /></Field>
          <Field label="City"><Inp value={form.city} onChange={s('city')} placeholder="City" /></Field>
          <Field label="State"><Inp value={form.state} onChange={s('state')} placeholder="State" /></Field>
          <Field label="Experience (years)"><Inp type="number" value={form.exp} onChange={s('exp')} placeholder="e.g. 10" /></Field>
          <Field label="Consultation Fee"><Inp value={form.fee} onChange={s('fee')} placeholder="e.g. ₹800" /></Field>
          <Field label="JustDial Rating (0–5)"><Inp type="number" step="0.1" min="0" max="5" value={form.justdial_rating} onChange={s('justdial_rating')} placeholder="e.g. 4.3" /></Field>
          <Field label="Phone"><Inp value={form.phone} onChange={s('phone')} placeholder="+91-XXXXX-XXXXX" /></Field>
          <Field label="Email"><Inp type="email" value={form.email} onChange={s('email')} placeholder="doctor@email.com" /></Field>
          <Field label="Joined"><Inp value={form.joined} onChange={s('joined')} placeholder="e.g. Jan 2024" /></Field>
          <div style={{ gridColumn:'1/-1' }}>
            <Field label="Current Practice Address"><Inp value={form.address} onChange={s('address')} placeholder="Clinic / Hospital name, Street, City" /></Field>
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <Field label="Education (degrees, institutions, years)"><Txa value={form.education} onChange={s('education')} rows={3} placeholder="MBBS – AIIMS Delhi (2005)&#10;MD Cardiology – PGI Chandigarh (2009)" /></Field>
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <Field label="Achievements & Awards"><Txa value={form.achievements} onChange={s('achievements')} rows={3} placeholder="Best Cardiologist Award 2022…" /></Field>
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <Field label="Past Experience"><Txa value={form.past_experience} onChange={s('past_experience')} rows={3} placeholder="Senior Consultant, Apollo Hospitals (2015–2020)…" /></Field>
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <Check label="Verified doctor" checked={form.verified} onChange={e => setForm(f => ({ ...f, verified: e.target.checked }))} />
          </div>
          <Field label="Doctor Photo (face only)">
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
              onChange={e => { const f = e.target.files[0]; if(f){ setFile(f); setPreview(URL.createObjectURL(f)) } }} />
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              {preview && <img src={preview} alt="preview" style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', objectPosition:'top', border:'2px solid #e2e8f0' }} />}
              <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
                {file ? '📷 Change Photo' : '📷 Upload Photo'}
              </button>
            </div>
          </Field>
          <button type="submit" className={styles.addBtn} disabled={saving}>{saving ? 'Adding…' : '+ Add Doctor'}</button>
        </div>
      </form>

      {/* CSV / Excel bulk import */}
      <div className={styles.addForm} style={{ marginTop:0, borderTop:'2px dashed #e2e8f0', paddingTop:24 }}>
        <h3 className={styles.addTitle}>📥 Bulk Import via CSV / Excel</h3>
        <div style={{ background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:10, padding:'10px 16px', marginBottom:16, fontSize:12.5 }}>
          <strong style={{ color:'#0369a1' }}>Supported columns:</strong>
          <span style={{ marginLeft:8, color:'#1e3a5f' }}>Name*, Specialty, Qualification, City, State, Experience, Fee, Phone, Email, Address, Rating, Education, Achievements, Past Experience, Verified, Joined</span>
          <br /><span style={{ color:'#64748b', fontSize:12, display:'block', marginTop:3 }}>* mandatory · Accepted: .csv, .xlsx, .xls · Doctor photos must be uploaded individually after import.</span>
        </div>
        <form onSubmit={handleImport} style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <input ref={csvRef} type="file" accept=".csv,.xlsx,.xls" style={{ display:'none' }}
            onChange={e => setImportFile(e.target.files[0]||null)} />
          <button type="button" className={styles.uploadBtn} onClick={() => csvRef.current?.click()}>
            {importFile ? `📄 ${importFile.name}` : '📄 Select CSV / Excel'}
          </button>
          <button type="submit" className={styles.addBtn} disabled={importing||!importFile} style={{ margin:0 }}>
            {importing ? 'Importing…' : '📥 Import'}
          </button>
        </form>
        {importResult && (
          <div style={{ marginTop:14, padding:'12px 16px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, fontSize:13 }}>
            <p style={{ fontWeight:700, marginBottom:6, color:'#1e3a5f' }}>Import Results</p>
            <p style={{ color:'#16a34a', marginBottom:3 }}>✅ Inserted: <strong>{importResult.inserted ?? 0}</strong></p>
            <p style={{ color:'#d97706', marginBottom:3 }}>⚠️ Skipped: <strong>{importResult.skipped ?? 0}</strong></p>
            {importResult.errors?.length > 0 && (
              <ul style={{ paddingLeft:16, margin:'6px 0 0', color:'#dc2626' }}>
                {importResult.errors.map((e,i) => <li key={i} style={{ fontSize:12 }}>{e}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function EntityRowDoctor({ item, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name:item.name||'', specialty:item.specialty||'', city:item.city||'', state:item.state||'',
    exp:String(item.exp||''), justdial_rating:item.justdial_rating!=null?String(item.justdial_rating):'',
    fee:item.fee||'', qual:item.qual||'',
    verified:item.verified||false, joined:item.joined||'', email:item.email||'',
    address:item.address||'', phone:item.phone||'', education:item.education||'',
    achievements:item.achievements||'', past_experience:item.past_experience||'',
  })
  const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handle() {
    setSaving(true)
    try { await onSave(item.id, form); setSaved(true); setTimeout(() => { setSaved(false); setEditing(false) }, 1200) }
    catch { alert('Save failed.') } finally { setSaving(false) }
  }

  if (!editing) return (
    <div className={styles.entityRow}>
      <div className={styles.entityInfo}>
        <strong>{item.name}</strong>
        <span className={styles.entityMeta}>{item.specialty}{item.city ? ` · ${item.city}` : ''}{item.state ? `, ${item.state}` : ''}</span>
      </div>
      <div className={styles.campActions}><EditBtn onClick={() => setEditing(true)} /><DeleteBtn onClick={() => { if(window.confirm('Delete?')) onDelete(item.id) }} /></div>
    </div>
  )

  return (
    <div className={styles.entityEditWrap}>
      <div className={styles.formGrid}>
        <Field label="Name"><Inp value={form.name} onChange={s('name')} /></Field>
        <Field label="Specialty"><Inp value={form.specialty} onChange={s('specialty')} /></Field>
        <Field label="Qualification"><Inp value={form.qual} onChange={s('qual')} /></Field>
        <Field label="City"><Inp value={form.city} onChange={s('city')} /></Field>
        <Field label="State"><Inp value={form.state} onChange={s('state')} /></Field>
        <Field label="Exp (yrs)"><Inp type="number" value={form.exp} onChange={s('exp')} /></Field>
        <Field label="Fee"><Inp value={form.fee} onChange={s('fee')} /></Field>
        <Field label="JustDial Rating"><Inp type="number" step="0.1" value={form.justdial_rating} onChange={s('justdial_rating')} /></Field>
        <Field label="Phone"><Inp value={form.phone} onChange={s('phone')} /></Field>
        <Field label="Email"><Inp type="email" value={form.email} onChange={s('email')} /></Field>
        <Field label="Joined"><Inp value={form.joined} onChange={s('joined')} /></Field>
        <div style={{ gridColumn:'1/-1' }}><Field label="Address"><Inp value={form.address} onChange={s('address')} /></Field></div>
        <div style={{ gridColumn:'1/-1' }}><Field label="Education"><Txa value={form.education} onChange={s('education')} rows={3} /></Field></div>
        <div style={{ gridColumn:'1/-1' }}><Field label="Achievements"><Txa value={form.achievements} onChange={s('achievements')} rows={2} /></Field></div>
        <div style={{ gridColumn:'1/-1' }}><Field label="Past Experience"><Txa value={form.past_experience} onChange={s('past_experience')} rows={2} /></Field></div>
        <div style={{ gridColumn:'1/-1' }}><Check label="Verified" checked={form.verified} onChange={e => setForm(f => ({ ...f, verified: e.target.checked }))} /></div>
      </div>
      <div className={styles.campEditActions}><SaveBtn saving={saving} saved={saved} onClick={handle} /><CancelBtn onClick={() => setEditing(false)} /></div>
    </div>
  )
}

function DoctorsSection() {
  const { items, loading, remove, save, prepend } = useEntityCRUD('/api/doctors')
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>👨‍⚕️ Doctors</h2>
        <p className={styles.sectionDesc}>Manage doctors shown in the Doctor tab. Add manually or import via CSV/Excel below.</p>
      </div>
      <DoctorAddForm onCreated={prepend} />
      <div className={styles.campListHeader}><h3>Doctors ({items.length})</h3></div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : (
        <div className={styles.entityList}>
          {items.map(item => <EntityRowDoctor key={item.id} item={item} onSave={save} onDelete={remove} />)}
        </div>
      )}
    </div>
  )
}

// ─── Hospitals section ────────────────────────────────────────────────────────

function HospitalAddForm({ onCreated }) {
  const EMPTY = {
    name: '', address: '', city: '', state: '', country: 'India',
    type: '', beds: '', specialties: '', contact: '', phone: '',
    joined: '', url: '', justdial_url: '',
    justdial_rating: '', quora_rating: '', geomedico_rating: '',
  }
  const [form, setForm] = useState(EMPTY)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handle(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (file) fd.append('image', file)
      const res = await fetch('/api/hospitals', { method: 'POST', body: fd })
      const created = await res.json()
      onCreated(created)
      setForm(EMPTY)
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch { alert('Failed to add hospital.') } finally { setSaving(false) }
  }

  return (
    <form className={styles.addForm} onSubmit={handle}>
      <h3 className={styles.addTitle}>Add Hospital</h3>
      <div className={styles.formGrid}>
        <Field label="Name *"><Inp value={form.name} onChange={s('name')} required placeholder="Hospital name" /></Field>
        <Field label="Address"><Inp value={form.address} onChange={s('address')} placeholder="Street address" /></Field>
        <Field label="City"><Inp value={form.city} onChange={s('city')} placeholder="City" /></Field>
        <Field label="State"><Inp value={form.state} onChange={s('state')} placeholder="State" /></Field>
        <Field label="Country"><Inp value={form.country} onChange={s('country')} placeholder="Country" /></Field>
        <Field label="Type"><Inp value={form.type} onChange={s('type')} placeholder="e.g. Multi-Specialty / Private" /></Field>
        <Field label="Number of Beds"><Inp type="number" value={form.beds} onChange={s('beds')} placeholder="e.g. 500" /></Field>
        <Field label="Specialties (comma-separated)"><Inp value={form.specialties} onChange={s('specialties')} placeholder="Cardio, Ortho, Neuro" /></Field>
        <Field label="Contact Person"><Inp value={form.contact} onChange={s('contact')} placeholder="Name" /></Field>
        <Field label="Phone *"><Inp value={form.phone} onChange={s('phone')} required placeholder="+91-xx-xxxx-xxxx" /></Field>
        <Field label="Joined Date"><Inp value={form.joined} onChange={s('joined')} placeholder="e.g. Jan 2024" /></Field>
        <Field label="Website URL"><Inp type="url" value={form.url} onChange={s('url')} placeholder="https://…" /></Field>
        <Field label="JustDial URL"><Inp type="url" value={form.justdial_url} onChange={s('justdial_url')} placeholder="https://justdial.com/…" /></Field>
        <Field label="JustDial Rating (0–5)"><Inp type="number" min="0" max="5" step="0.1" value={form.justdial_rating} onChange={s('justdial_rating')} placeholder="e.g. 4.2" /></Field>
        <Field label="Quora Rating (0–5)"><Inp type="number" min="0" max="5" step="0.1" value={form.quora_rating} onChange={s('quora_rating')} placeholder="e.g. 3.8" /></Field>
        <Field label="GeoMedico Rating (0–5)"><Inp type="number" min="0" max="5" step="0.1" value={form.geomedico_rating} onChange={s('geomedico_rating')} placeholder="e.g. 4.5" /></Field>
        <Field label="Hospital Image">
          <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
            onChange={e => { const f = e.target.files[0]; if (f) setFile(f) }} />
          <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
            {file ? `📷 ${file.name}` : '📷 Upload Image'}
          </button>
        </Field>
        <button type="submit" className={styles.addBtn} disabled={saving}>{saving ? 'Adding…' : '+ Add Hospital'}</button>
      </div>
    </form>
  )
}

function EntityRowHospital({ item, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: item.name || '',
    address: item.address || '',
    city: item.city || '',
    state: item.state || '',
    country: item.country || 'India',
    type: item.type || '',
    beds: String(item.beds || ''),
    specialties: Array.isArray(item.specialties) ? item.specialties.join(', ') : (item.specialties || ''),
    contact: item.contact || '',
    phone: item.phone || '',
    joined: item.joined || '',
    url: item.url || '',
    justdial_url: item.justdial_url || '',
    justdial_rating: item.justdial_rating != null ? String(item.justdial_rating) : '',
    quora_rating: item.quora_rating != null ? String(item.quora_rating) : '',
    geomedico_rating: item.geomedico_rating != null ? String(item.geomedico_rating) : '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handle() {
    setSaving(true)
    try {
      await onSave(item.id, form)
      setSaved(true)
      setTimeout(() => { setSaved(false); setEditing(false) }, 1200)
    } catch { alert('Save failed.') } finally { setSaving(false) }
  }

  if (!editing) return (
    <div className={styles.entityRow}>
      <div className={styles.entityInfo}>
        <strong>{item.name}</strong>
        <span className={styles.entityMeta}>
          {[item.city, item.state, item.type].filter(Boolean).join(' · ')}
        </span>
      </div>
      <div className={styles.campActions}>
        <EditBtn onClick={() => setEditing(true)} />
        <DeleteBtn onClick={() => { if (window.confirm('Delete?')) onDelete(item.id) }} />
      </div>
    </div>
  )

  return (
    <div className={styles.entityEditWrap}>
      <div className={styles.formGrid}>
        <Field label="Name"><Inp value={form.name} onChange={s('name')} /></Field>
        <Field label="Address"><Inp value={form.address} onChange={s('address')} /></Field>
        <Field label="City"><Inp value={form.city} onChange={s('city')} /></Field>
        <Field label="State"><Inp value={form.state} onChange={s('state')} /></Field>
        <Field label="Country"><Inp value={form.country} onChange={s('country')} /></Field>
        <Field label="Type"><Inp value={form.type} onChange={s('type')} /></Field>
        <Field label="Number of Beds"><Inp type="number" value={form.beds} onChange={s('beds')} /></Field>
        <Field label="Specialties (comma-sep)"><Inp value={form.specialties} onChange={s('specialties')} /></Field>
        <Field label="Contact Person"><Inp value={form.contact} onChange={s('contact')} /></Field>
        <Field label="Phone"><Inp value={form.phone} onChange={s('phone')} /></Field>
        <Field label="Joined Date"><Inp value={form.joined} onChange={s('joined')} /></Field>
        <Field label="Website URL"><Inp value={form.url} onChange={s('url')} /></Field>
        <Field label="JustDial URL"><Inp value={form.justdial_url} onChange={s('justdial_url')} /></Field>
        <Field label="JustDial Rating (0–5)"><Inp type="number" min="0" max="5" step="0.1" value={form.justdial_rating} onChange={s('justdial_rating')} /></Field>
        <Field label="Quora Rating (0–5)"><Inp type="number" min="0" max="5" step="0.1" value={form.quora_rating} onChange={s('quora_rating')} /></Field>
        <Field label="GeoMedico Rating (0–5)"><Inp type="number" min="0" max="5" step="0.1" value={form.geomedico_rating} onChange={s('geomedico_rating')} /></Field>
      </div>
      <div className={styles.campEditActions}>
        <SaveBtn saving={saving} saved={saved} onClick={handle} />
        <CancelBtn onClick={() => setEditing(false)} />
      </div>
    </div>
  )
}

function HospitalImportSection() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  async function handleImport(e) {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setResult(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/hospitals/import', { method: 'POST', body: fd })
      const data = await res.json()
      setResult(data)
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch { alert('Import failed.') } finally { setLoading(false) }
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📥 Hospital Bulk Import</h2>
        <p className={styles.sectionDesc}>Upload a CSV or Excel file to import multiple hospitals at once.</p>
      </div>
      <div className={styles.addForm}>
        <div style={{ background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:10, padding:'12px 16px', marginBottom:20, fontSize:13 }}>
          <strong style={{ color:'#0369a1' }}>📋 Supported columns:</strong>
          <span style={{ marginLeft:8, color:'#1e3a5f' }}>
            Name*, Address, City, State, Country, Type, Number of Beds, Hospital Speciality, Hospital Contact Number*, Website URL, Justdial Review, Justdial Rating, Quora Rating, GeoMedico Rating
          </span>
          <br />
          <span style={{ color:'#64748b', fontSize:12, display:'block', marginTop:4 }}>
            (* = mandatory). First row must be a header row. Accepted formats: .csv, .xlsx, .xls
          </span>
        </div>
        <form onSubmit={handleImport} style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            style={{ display:'none' }}
            onChange={e => { const f = e.target.files[0]; if (f) setFile(f) }}
          />
          <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
            {file ? `📄 ${file.name}` : '📄 Select CSV / Excel File'}
          </button>
          <button type="submit" className={styles.addBtn} disabled={loading || !file}>
            {loading ? 'Importing…' : '📥 Upload & Import'}
          </button>
        </form>
        {result && (
          <div style={{ marginTop:20, padding:'14px 18px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10 }}>
            <p style={{ fontWeight:700, marginBottom:8, color:'#1e3a5f' }}>Import Results</p>
            <p style={{ color:'#16a34a', marginBottom:4 }}>✅ Inserted: <strong>{result.inserted ?? 0}</strong></p>
            <p style={{ color:'#d97706', marginBottom:4 }}>⚠️ Skipped: <strong>{result.skipped ?? 0}</strong></p>
            {result.errors && result.errors.length > 0 && (
              <div style={{ marginTop:8 }}>
                <p style={{ color:'#dc2626', fontWeight:600, marginBottom:4 }}>Errors ({result.errors.length}):</p>
                <ul style={{ paddingLeft:18, margin:0 }}>
                  {result.errors.map((err, i) => (
                    <li key={i} style={{ color:'#dc2626', fontSize:12, marginBottom:2 }}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function HospitalsSection() {
  const { items, loading, remove, save, prepend } = useEntityCRUD('/api/hospitals')
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🏥 Hospitals</h2>
        <p className={styles.sectionDesc}>Manage the hospital network shown in the Hospital tab.</p>
      </div>
      <HospitalAddForm onCreated={prepend} />
      <div className={styles.campListHeader}><h3>Hospitals ({items.length})</h3></div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : (
        <div className={styles.entityList}>
          {items.map(item => <EntityRowHospital key={item.id} item={item} onSave={save} onDelete={remove} />)}
        </div>
      )}
    </div>
  )
}

// ─── Pharmacies section ───────────────────────────────────────────────────────
function PharmacyAddForm({ onCreated }) {
  const EMPTY = {
    name: '', city: '', area: '', state: '', owner: '', phone: '',
    hours: '', url: '', map_url: '', justdial_rating: '', delivery: false, cold_chain: false,
  }
  const [form, setForm] = useState(EMPTY)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const fileRef = useRef()
  const csvRef  = useRef()
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
      if (file) fd.append('image', file)
      const res = await fetch('/api/pharmacies', { method: 'POST', body: fd })
      const created = await res.json()
      onCreated(created)
      setForm(EMPTY); setFile(null); setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch { alert('Failed to add pharmacy.') } finally { setSaving(false) }
  }

  async function handleImport(e) {
    e.preventDefault()
    if (!importFile) return
    setImporting(true); setImportResult(null)
    try {
      const fd = new FormData(); fd.append('file', importFile)
      const res = await fetch('/api/pharmacies/import', { method: 'POST', body: fd })
      setImportResult(await res.json())
      setImportFile(null)
      if (csvRef.current) csvRef.current.value = ''
    } catch { alert('Import failed.') } finally { setImporting(false) }
  }

  return (
    <div>
      {/* Manual add form */}
      <form className={styles.addForm} onSubmit={handleAdd}>
        <h3 className={styles.addTitle}>Add Pharmacy Manually</h3>
        <div className={styles.formGrid}>
          <Field label="Name *"><Inp value={form.name} onChange={s('name')} required placeholder="Pharmacy name" /></Field>
          <Field label="City"><Inp value={form.city} onChange={s('city')} placeholder="City" /></Field>
          <Field label="Area"><Inp value={form.area} onChange={s('area')} placeholder="Area / Locality" /></Field>
          <Field label="State"><Inp value={form.state} onChange={s('state')} placeholder="State" /></Field>
          <Field label="Owner / Contact"><Inp value={form.owner} onChange={s('owner')} placeholder="Owner or contact person" /></Field>
          <Field label="Phone *"><Inp value={form.phone} onChange={s('phone')} required placeholder="+91-XXXXX-XXXXX" /></Field>
          <Field label="Hours"><Inp value={form.hours} onChange={s('hours')} placeholder="e.g. 9AM–9PM" /></Field>
          <Field label="Website URL"><Inp type="url" value={form.url} onChange={s('url')} placeholder="https://…" /></Field>
          <Field label="Map URL (Google Maps)"><Inp type="url" value={form.map_url} onChange={s('map_url')} placeholder="https://maps.google.com/…" /></Field>
          <Field label="JustDial Rating (0–5)"><Inp type="number" step="0.1" min="0" max="5" value={form.justdial_rating} onChange={s('justdial_rating')} placeholder="e.g. 4.2" /></Field>
          <Field label="Logo / Image">
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)) } }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {preview && <img src={preview} alt="preview" style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', border: '2px solid #e2e8f0' }} />}
              <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
                {file ? '📷 Change Image' : '📷 Upload Logo/Image'}
              </button>
            </div>
          </Field>
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: 20 }}>
            <Check label="Home Delivery" checked={form.delivery} onChange={e => setForm(f => ({ ...f, delivery: e.target.checked }))} />
            <Check label="Cold Chain" checked={form.cold_chain} onChange={e => setForm(f => ({ ...f, cold_chain: e.target.checked }))} />
          </div>
          <button type="submit" className={styles.addBtn} disabled={saving}>{saving ? 'Adding…' : '+ Add Pharmacy'}</button>
        </div>
      </form>

      {/* CSV / Excel bulk import */}
      <div className={styles.addForm} style={{ marginTop: 0, borderTop: '2px dashed #e2e8f0', paddingTop: 24 }}>
        <h3 className={styles.addTitle}>📥 Bulk Import via CSV / Excel</h3>
        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 12.5 }}>
          <strong style={{ color: '#0369a1' }}>Supported columns:</strong>
          <span style={{ marginLeft: 8, color: '#1e3a5f' }}>Name*, City, Area, State, Owner/Contact, Phone*, Hours, Home Delivery, Cold Chain, Website URL, Map URL</span>
          <br /><span style={{ color: '#64748b', fontSize: 12, display: 'block', marginTop: 3 }}>* mandatory · Accepted: .csv, .xlsx, .xls · Images must be uploaded individually after import.</span>
        </div>
        <form onSubmit={handleImport} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <input ref={csvRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }}
            onChange={e => setImportFile(e.target.files[0] || null)} />
          <button type="button" className={styles.uploadBtn} onClick={() => csvRef.current?.click()}>
            {importFile ? `📄 ${importFile.name}` : '📄 Select CSV / Excel'}
          </button>
          <button type="submit" className={styles.addBtn} disabled={importing || !importFile} style={{ margin: 0 }}>
            {importing ? 'Importing…' : '📥 Import'}
          </button>
        </form>
        {importResult && (
          <div style={{ marginTop: 14, padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13 }}>
            <p style={{ fontWeight: 700, marginBottom: 6, color: '#1e3a5f' }}>Import Results</p>
            <p style={{ color: '#16a34a', marginBottom: 3 }}>✅ Inserted: <strong>{importResult.inserted ?? 0}</strong></p>
            <p style={{ color: '#d97706', marginBottom: 3 }}>⚠️ Skipped: <strong>{importResult.skipped ?? 0}</strong></p>
            {importResult.errors?.length > 0 && (
              <ul style={{ paddingLeft: 16, margin: '6px 0 0', color: '#dc2626' }}>
                {importResult.errors.map((e, i) => <li key={i} style={{ fontSize: 12 }}>{e}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function EntityRowPharmacy({ item, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: item.name || '', city: item.city || '', area: item.area || '',
    state: item.state || '', owner: item.owner || '', phone: item.phone || '',
    hours: item.hours || '', url: item.url || '', map_url: item.map_url || '',
    delivery: item.delivery || false, cold_chain: item.cold_chain || false,
  })
  const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handle() {
    setSaving(true)
    try { await onSave(item.id, form); setSaved(true); setTimeout(() => { setSaved(false); setEditing(false) }, 1200) }
    catch { alert('Save failed.') } finally { setSaving(false) }
  }

  if (!editing) return (
    <div className={styles.entityRow}>
      <div className={styles.entityInfo}>
        <strong>{item.name}</strong>
        <span className={styles.entityMeta}>
          {[item.city, item.state].filter(Boolean).join(', ')}
          {item.delivery ? ' · 🚚 Delivery' : ''}
          {item.cold_chain ? ' · ❄️ Cold Chain' : ''}
        </span>
      </div>
      <div className={styles.campActions}>
        <EditBtn onClick={() => setEditing(true)} />
        <DeleteBtn onClick={() => { if (window.confirm('Delete?')) onDelete(item.id) }} />
      </div>
    </div>
  )

  return (
    <div className={styles.entityEditWrap}>
      <div className={styles.formGrid}>
        <Field label="Name"><Inp value={form.name} onChange={s('name')} /></Field>
        <Field label="City"><Inp value={form.city} onChange={s('city')} /></Field>
        <Field label="Area"><Inp value={form.area} onChange={s('area')} /></Field>
        <Field label="State"><Inp value={form.state} onChange={s('state')} /></Field>
        <Field label="Owner / Contact"><Inp value={form.owner} onChange={s('owner')} /></Field>
        <Field label="Phone"><Inp value={form.phone} onChange={s('phone')} /></Field>
        <Field label="Hours"><Inp value={form.hours} onChange={s('hours')} /></Field>
        <Field label="Website URL"><Inp value={form.url} onChange={s('url')} /></Field>
        <Field label="Map URL"><Inp value={form.map_url} onChange={s('map_url')} /></Field>
        <div style={{ gridColumn: '1/-1', display: 'flex', gap: 20 }}>
          <Check label="Home Delivery" checked={form.delivery} onChange={e => setForm(f => ({ ...f, delivery: e.target.checked }))} />
          <Check label="Cold Chain" checked={form.cold_chain} onChange={e => setForm(f => ({ ...f, cold_chain: e.target.checked }))} />
        </div>
      </div>
      <div className={styles.campEditActions}><SaveBtn saving={saving} saved={saved} onClick={handle} /><CancelBtn onClick={() => setEditing(false)} /></div>
    </div>
  )
}

function PharmaciesSection() {
  const { items, loading, remove, save, prepend } = useEntityCRUD('/api/pharmacies')
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>💊 Pharmacies</h2>
        <p className={styles.sectionDesc}>Manage the pharmacy network shown in the Pharmacy tab. Add manually or import via CSV/Excel below.</p>
      </div>
      <PharmacyAddForm onCreated={prepend} />
      <div className={styles.campListHeader}><h3>Pharmacies ({items.length})</h3></div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : (
        <div className={styles.entityList}>
          {items.map(item => <EntityRowPharmacy key={item.id} item={item} onSave={save} onDelete={remove} />)}
        </div>
      )}
    </div>
  )
}

// ─── Labs section ─────────────────────────────────────────────────────────────
function LabAddForm({ onCreated }) {
  const EMPTY = {
    name: '', city: '', area: '', state: '', contact: '', phone: '',
    cert: '', tests: '', url: '', map_url: '', justdial_rating: '', home_collection: false,
  }
  const [form, setForm] = useState(EMPTY)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const fileRef = useRef()
  const csvRef  = useRef()
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
      if (file) fd.append('image', file)
      const res = await fetch('/api/labs', { method: 'POST', body: fd })
      const created = await res.json()
      onCreated(created)
      setForm(EMPTY); setFile(null); setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch { alert('Failed to add lab.') } finally { setSaving(false) }
  }

  async function handleImport(e) {
    e.preventDefault()
    if (!importFile) return
    setImporting(true); setImportResult(null)
    try {
      const fd = new FormData(); fd.append('file', importFile)
      const res = await fetch('/api/labs/import', { method: 'POST', body: fd })
      setImportResult(await res.json())
      setImportFile(null)
      if (csvRef.current) csvRef.current.value = ''
    } catch { alert('Import failed.') } finally { setImporting(false) }
  }

  return (
    <div>
      {/* Manual add form */}
      <form className={styles.addForm} onSubmit={handleAdd}>
        <h3 className={styles.addTitle}>Add Lab Manually</h3>
        <div className={styles.formGrid}>
          <Field label="Name *"><Inp value={form.name} onChange={s('name')} required placeholder="Lab name" /></Field>
          <Field label="City"><Inp value={form.city} onChange={s('city')} placeholder="City" /></Field>
          <Field label="Area"><Inp value={form.area} onChange={s('area')} placeholder="Area / Locality" /></Field>
          <Field label="State"><Inp value={form.state} onChange={s('state')} placeholder="State" /></Field>
          <Field label="Contact Person"><Inp value={form.contact} onChange={s('contact')} placeholder="Contact person name" /></Field>
          <Field label="Phone *"><Inp value={form.phone} onChange={s('phone')} required placeholder="+91-XXXXX-XXXXX" /></Field>
          <Field label="Certifications (comma-sep)"><Inp value={form.cert} onChange={s('cert')} placeholder="NABL, CAP, ISO 15189" /></Field>
          <Field label="Key Tests (comma-sep)"><Inp value={form.tests} onChange={s('tests')} placeholder="HbA1c, CBC, LFT…" /></Field>
          <Field label="Website URL"><Inp type="url" value={form.url} onChange={s('url')} placeholder="https://…" /></Field>
          <Field label="Map URL (Google Maps)"><Inp type="url" value={form.map_url} onChange={s('map_url')} placeholder="https://maps.google.com/…" /></Field>
          <Field label="JustDial Rating (0–5)"><Inp type="number" step="0.1" min="0" max="5" value={form.justdial_rating} onChange={s('justdial_rating')} placeholder="e.g. 4.2" /></Field>
          <Field label="Logo / Image">
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)) } }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {preview && <img src={preview} alt="preview" style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', border: '2px solid #e2e8f0' }} />}
              <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
                {file ? '📷 Change Image' : '📷 Upload Logo/Image'}
              </button>
            </div>
          </Field>
          <div style={{ gridColumn: '1/-1' }}>
            <Check label="Home Collection Available" checked={form.home_collection} onChange={e => setForm(f => ({ ...f, home_collection: e.target.checked }))} />
          </div>
          <button type="submit" className={styles.addBtn} disabled={saving}>{saving ? 'Adding…' : '+ Add Lab'}</button>
        </div>
      </form>

      {/* CSV / Excel bulk import */}
      <div className={styles.addForm} style={{ marginTop: 0, borderTop: '2px dashed #e2e8f0', paddingTop: 24 }}>
        <h3 className={styles.addTitle}>📥 Bulk Import via CSV / Excel</h3>
        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 12.5 }}>
          <strong style={{ color: '#0369a1' }}>Supported columns:</strong>
          <span style={{ marginLeft: 8, color: '#1e3a5f' }}>Name*, City, Area, State, Contact Person, Phone*, Certifications, Key Tests, Home Collection, Website URL, Map URL</span>
          <br /><span style={{ color: '#64748b', fontSize: 12, display: 'block', marginTop: 3 }}>* mandatory · Accepted: .csv, .xlsx, .xls · Images must be uploaded individually after import.</span>
        </div>
        <form onSubmit={handleImport} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <input ref={csvRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }}
            onChange={e => setImportFile(e.target.files[0] || null)} />
          <button type="button" className={styles.uploadBtn} onClick={() => csvRef.current?.click()}>
            {importFile ? `📄 ${importFile.name}` : '📄 Select CSV / Excel'}
          </button>
          <button type="submit" className={styles.addBtn} disabled={importing || !importFile} style={{ margin: 0 }}>
            {importing ? 'Importing…' : '📥 Import'}
          </button>
        </form>
        {importResult && (
          <div style={{ marginTop: 14, padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13 }}>
            <p style={{ fontWeight: 700, marginBottom: 6, color: '#1e3a5f' }}>Import Results</p>
            <p style={{ color: '#16a34a', marginBottom: 3 }}>✅ Inserted: <strong>{importResult.inserted ?? 0}</strong></p>
            <p style={{ color: '#d97706', marginBottom: 3 }}>⚠️ Skipped: <strong>{importResult.skipped ?? 0}</strong></p>
            {importResult.errors?.length > 0 && (
              <ul style={{ paddingLeft: 16, margin: '6px 0 0', color: '#dc2626' }}>
                {importResult.errors.map((e, i) => <li key={i} style={{ fontSize: 12 }}>{e}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function EntityRowLab({ item, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: item.name || '', city: item.city || '', area: item.area || '',
    state: item.state || '', contact: item.contact || '', phone: item.phone || '',
    cert: Array.isArray(item.cert) ? item.cert.join(', ') : (item.cert || ''),
    tests: Array.isArray(item.tests) ? item.tests.join(', ') : (item.tests || ''),
    url: item.url || '', map_url: item.map_url || '',
    home_collection: item.home_collection || false,
  })
  const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handle() {
    setSaving(true)
    try { await onSave(item.id, form); setSaved(true); setTimeout(() => { setSaved(false); setEditing(false) }, 1200) }
    catch { alert('Save failed.') } finally { setSaving(false) }
  }

  const certDisplay = Array.isArray(item.cert) ? item.cert.join(', ') : (item.cert || '')

  if (!editing) return (
    <div className={styles.entityRow}>
      <div className={styles.entityInfo}>
        <strong>{item.name}</strong>
        <span className={styles.entityMeta}>
          {[item.city, item.state].filter(Boolean).join(', ')}
          {certDisplay ? ` · ${certDisplay}` : ''}
          {item.home_collection ? ' · 🏠 Home Collection' : ''}
        </span>
      </div>
      <div className={styles.campActions}>
        <EditBtn onClick={() => setEditing(true)} />
        <DeleteBtn onClick={() => { if (window.confirm('Delete?')) onDelete(item.id) }} />
      </div>
    </div>
  )

  return (
    <div className={styles.entityEditWrap}>
      <div className={styles.formGrid}>
        <Field label="Name"><Inp value={form.name} onChange={s('name')} /></Field>
        <Field label="City"><Inp value={form.city} onChange={s('city')} /></Field>
        <Field label="Area"><Inp value={form.area} onChange={s('area')} /></Field>
        <Field label="State"><Inp value={form.state} onChange={s('state')} /></Field>
        <Field label="Contact Person"><Inp value={form.contact} onChange={s('contact')} /></Field>
        <Field label="Phone"><Inp value={form.phone} onChange={s('phone')} /></Field>
        <Field label="Certifications (comma-sep)"><Inp value={form.cert} onChange={s('cert')} /></Field>
        <Field label="Key Tests (comma-sep)"><Inp value={form.tests} onChange={s('tests')} /></Field>
        <Field label="Website URL"><Inp value={form.url} onChange={s('url')} /></Field>
        <Field label="Map URL"><Inp value={form.map_url} onChange={s('map_url')} /></Field>
        <div style={{ gridColumn: '1/-1' }}>
          <Check label="Home Collection" checked={form.home_collection} onChange={e => setForm(f => ({ ...f, home_collection: e.target.checked }))} />
        </div>
      </div>
      <div className={styles.campEditActions}><SaveBtn saving={saving} saved={saved} onClick={handle} /><CancelBtn onClick={() => setEditing(false)} /></div>
    </div>
  )
}

function LabsSection() {
  const { items, loading, remove, save, prepend } = useEntityCRUD('/api/labs')
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🔬 Labs</h2>
        <p className={styles.sectionDesc}>Manage the diagnostic labs shown in the Lab tab. Add manually or import via CSV/Excel below.</p>
      </div>
      <LabAddForm onCreated={prepend} />
      <div className={styles.campListHeader}><h3>Labs ({items.length})</h3></div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : (
        <div className={styles.entityList}>
          {items.map(item => <EntityRowLab key={item.id} item={item} onSave={save} onDelete={remove} />)}
        </div>
      )}
    </div>
  )
}

// ─── Mail Settings section ────────────────────────────────────────────────────
const SMTP_FIELDS = [
  { key:'smtp_host', label:'SMTP Host',     placeholder:'smtp.gmail.com' },
  { key:'smtp_port', label:'SMTP Port',     placeholder:'587' },
  { key:'smtp_user', label:'SMTP Username', placeholder:'you@gmail.com' },
  { key:'smtp_pass', label:'SMTP Password', placeholder:'App password or SMTP password' },
  { key:'smtp_from', label:'From Name',     placeholder:'GeoMedico Contact' },
]

function MailSettingsSection() {
  const [form, setForm] = useState({ smtp_host:'', smtp_port:'587', smtp_user:'', smtp_pass:'', smtp_from:'' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(s => {
      setForm(f => ({ ...f, ...Object.fromEntries(SMTP_FIELDS.map(sf => [sf.key, s[sf.key]||''])) }))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/settings', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(form) })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch { alert('Save failed.') } finally { setSaving(false) }
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📧 Mail Settings (SMTP)</h2>
        <p className={styles.sectionDesc}>Configure SMTP to receive contact form submissions by email. For Gmail, use an App Password with 2FA enabled.</p>
      </div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : (
        <div className={styles.addForm}>
          <div className={styles.formGrid}>
            {SMTP_FIELDS.map(sf => (
              <Field key={sf.key} label={sf.label}>
                <input
                  className={styles.input}
                  type={sf.key === 'smtp_pass' ? 'password' : 'text'}
                  value={form[sf.key]}
                  onChange={e => setForm(f => ({ ...f, [sf.key]: e.target.value }))}
                  placeholder={sf.placeholder}
                />
              </Field>
            ))}
            <SaveBtn saving={saving} saved={saved} onClick={handleSave} label="Save Mail Settings" />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Contact Queries section ──────────────────────────────────────────────────
function ContactQueriesSection() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/contact/submissions').then(r => r.json()).then(d => { setItems(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📬 Contact Queries</h2>
        <p className={styles.sectionDesc}>Messages submitted through the Contact page form.</p>
      </div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : items.length === 0 ? (
        <div className={styles.emptyState}><span>📭</span><p>No queries yet.</p></div>
      ) : (
        <div className={styles.entityList}>
          {items.map(q => (
            <div key={q.id} className={styles.entityRow}>
              <div className={styles.entityInfo}>
                <strong>{q.name}</strong>
                <span style={{ color:'#64748b', marginLeft:8, fontSize:12 }}>{q.email}{q.phone ? ` · ${q.phone}` : ''}</span>
                <span style={{ color:'#94a3b8', marginLeft:8, fontSize:11 }}>{new Date(q.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}</span>
                <p className={styles.entityDesc} style={{ whiteSpace:'pre-wrap' }}>{q.comment}</p>
              </div>
              <div className={styles.campActions}>
                <DeleteBtn onClick={async () => {
                  if (!window.confirm('Delete this query?')) return
                  await fetch(`/api/contact/submissions/${q.id}`, { method:'DELETE' })
                  setItems(p => p.filter(x => x.id !== q.id))
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Contact section ──────────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ email:'', phone:'', address:'', working_hours:'', map_url:'' })
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    fetch('/api/contact').then(r => r.json()).then(d => {
      if (d) setForm({ email:d.email||'', phone:d.phone||'', address:d.address||'', working_hours:d.working_hours||'', map_url:d.map_url||'' })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/contact', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(form) })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch { alert('Save failed.') } finally { setSaving(false) }
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📞 Contact Info</h2>
        <p className={styles.sectionDesc}>These details appear in the Contact section at the bottom of the homepage.</p>
      </div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : (
        <div className={styles.addForm}>
          <div className={styles.formGrid}>
            <Field label="Email"><Inp type="email" value={form.email} onChange={s('email')} placeholder="hello@geomedico.in" /></Field>
            <Field label="Phone"><Inp value={form.phone} onChange={s('phone')} placeholder="+91-XXXXX-XXXXX" /></Field>
            <Field label="Working Hours"><Inp value={form.working_hours} onChange={s('working_hours')} placeholder="Mon–Sat 9AM–6PM" /></Field>
            <Field label="Google Maps URL"><Inp type="url" value={form.map_url} onChange={s('map_url')} placeholder="https://maps.google.com/…" /></Field>
            <div style={{ gridColumn:'1/-1' }}>
              <Field label="Office Address">
                <Txa value={form.address} onChange={s('address')} rows={3} placeholder="Street, Area, City, State, PIN" />
              </Field>
            </div>
            <SaveBtn saving={saving} saved={saved} onClick={handleSave} label="Save Contact Info" />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Team Members section ─────────────────────────────────────────────────────
function TeamSection() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState({ name:'', role:'', sort_order:'0' })
  const [file, setFile]       = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving]   = useState(false)
  const [editId, setEditId]   = useState(null)
  const fileRef = useRef()
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(d => { setMembers(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => fd.append(k, v))
      if (file) fd.append('image', file)
      const url    = editId ? `/api/team/${editId}` : '/api/team'
      const method = editId ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, body: fd })
      const saved  = await res.json()
      if (editId) setMembers(p => p.map(x => x.id === saved.id ? saved : x))
      else        setMembers(p => [...p, saved])
      setForm({ name:'', role:'', sort_order:'0' }); setFile(null); setPreview(null); setEditId(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch { alert('Save failed.') } finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this team member?')) return
    await fetch(`/api/team/${id}`, { method:'DELETE' })
    setMembers(p => p.filter(x => x.id !== id))
  }

  function startEdit(m) {
    setEditId(m.id)
    setForm({ name: m.name, role: m.role, sort_order: String(m.sort_order || 0) })
    setFile(null); setPreview(null)
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>👥 Team Members</h2>
        <p className={styles.sectionDesc}>These appear on the About Us page. Add photo, name, and designation for each member.</p>
      </div>
      <form className={styles.addForm} onSubmit={handleSave}>
        <h3 className={styles.addTitle}>{editId ? 'Edit Team Member' : 'Add Team Member'}</h3>
        <div style={{ background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:10, padding:'10px 16px', marginBottom:16, fontSize:12.5, color:'#0369a1' }}>
          📸 Upload a professional face photo. Recommended: square (1:1), min 400×400 px, JPG/PNG.
        </div>
        <div className={styles.formGrid}>
          <Field label="Name *"><Inp value={form.name} onChange={s('name')} required placeholder="Full Name" /></Field>
          <Field label="Designation / Role *"><Inp value={form.role} onChange={s('role')} required placeholder="e.g. Founder & CEO" /></Field>
          <Field label="Display Order"><Inp type="number" value={form.sort_order} onChange={s('sort_order')} placeholder="0 = first" /></Field>
          <Field label="Photo">
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
              onChange={e => { const f=e.target.files[0]; if(f){ setFile(f); setPreview(URL.createObjectURL(f)) } }} />
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              {preview && <img src={preview} alt="preview" style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', border:'2px solid #e2e8f0' }} />}
              <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
                {file ? '📷 Change Photo' : '📷 Upload Photo'}
              </button>
            </div>
          </Field>
          <button type="submit" className={styles.addBtn} disabled={saving}>
            {saving ? 'Saving…' : editId ? '✓ Update Member' : '+ Add Member'}
          </button>
          {editId && <CancelBtn onClick={() => { setEditId(null); setForm({ name:'', role:'', sort_order:'0' }) }} />}
        </div>
      </form>

      <div className={styles.campListHeader}><h3>Team ({members.length})</h3></div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : members.length === 0 ? (
        <div className={styles.emptyState}><span>👥</span><p>No team members yet.</p></div>
      ) : (
        <div className={styles.campList}>
          {members.map(m => (
            <div key={m.id} className={styles.campItem}>
              <div style={{ width:64, height:64, borderRadius:'50%', overflow:'hidden', flexShrink:0, border:'2px solid #e2e8f0', background:'linear-gradient(135deg,#0a6ebd,#00b894)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {m.image_url
                  ? <img src={m.image_url} alt={m.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
                  : <span style={{ color:'white', fontWeight:800, fontSize:18 }}>{m.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</span>
                }
              </div>
              <div className={styles.campInfo}>
                <h4 className={styles.campTitle}>{m.name}</h4>
                <span className={styles.campDate}>{m.role}</span>
              </div>
              <div className={styles.campActions}>
                <EditBtn onClick={() => startEdit(m)} />
                <DeleteBtn onClick={() => handleDelete(m.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Sidebar navigation ───────────────────────────────────────────────────────
const NAV = [
  { id:'site-logo',    label:'Site Logo',       icon:'🎨' },
  { id:'story-image',  label:'Story Image',     icon:'📸' },
  { id:'social-links', label:'Social Links',    icon:'🔗' },
  { id:'hero-images',  label:'Hero Background', icon:'🖼️' },
  { id:'stats',        label:'Stats Strip',     icon:'📊' },
  { id:'campaigns',    label:'Campaigns',       icon:'📢' },
  { id:'testimonials', label:'Testimonials',   icon:'💬' },
  { id:'doctors',      label:'Doctors',        icon:'👨‍⚕️' },
  { id:'hospitals',       label:'Hospitals',      icon:'🏥' },
  { id:'hospital-import', label:'Hospital Import', icon:'📥' },
  { id:'pharmacies',      label:'Pharmacies',     icon:'💊' },
  { id:'labs',         label:'Labs',           icon:'🔬' },
  { id:'team',         label:'Team Members',   icon:'👥' },
  { id:'contact',      label:'Contact Info',   icon:'📞' },
  { id:'mail',         label:'Mail Settings',  icon:'📧' },
  { id:'queries',      label:'Contact Queries',icon:'📬' },
]

const SECTION_MAP = {
  'site-logo':    SiteLogoSection,
  'story-image':  StoryImageSection,
  'social-links': SocialLinksSection,
  'hero-images':  HeroImagesSection,
  stats:          StatsSection,
  campaigns:    CampaignsSection,
  testimonials: TestimonialsSection,
  doctors:      DoctorsSection,
  hospitals:         HospitalsSection,
  'hospital-import': HospitalImportSection,
  pharmacies:        PharmaciesSection,
  labs:         LabsSection,
  team:         TeamSection,
  contact:      ContactSection,
  mail:         MailSettingsSection,
  queries:      ContactQueriesSection,
}

// ─── Main admin shell ─────────────────────────────────────────────────────────
export default function AdminPage({ onBack }) {
  const [authed, setAuthed]   = useState(sessionStorage.getItem('gm_admin') === '1')
  const [active, setActive]   = useState('site-logo')
  const [sideOpen, setSideOpen] = useState(false)

  function handleLogout() { sessionStorage.removeItem('gm_admin'); setAuthed(false) }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  const ActiveSection = SECTION_MAP[active]

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className={styles.hamburger} onClick={() => setSideOpen(o => !o)}>☰</button>
            <div className={styles.topBarBrand}>
              <span className={styles.topBarIcon}>🏥</span>
              <div>
                <div className={styles.topBarName}>GeoMedico Admin</div>
                <div className={styles.topBarSub}>Content Management</div>
              </div>
            </div>
          </div>
          <div className={styles.topBarActions}>
            <button className={styles.backBtn} onClick={onBack}>← Back to Site</button>
            <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        {/* Sidebar */}
        <nav className={`${styles.sidebar} ${sideOpen ? styles.sidebarOpen : ''}`}>
          {NAV.map(n => (
            <button
              key={n.id}
              className={`${styles.navItem} ${active === n.id ? styles.navItemActive : ''}`}
              onClick={() => { setActive(n.id); setSideOpen(false) }}
            >
              <span className={styles.navIcon}>{n.icon}</span>
              <span className={styles.navLabel}>{n.label}</span>
            </button>
          ))}
        </nav>

        {/* Overlay for mobile */}
        {sideOpen && <div className={styles.overlay} onClick={() => setSideOpen(false)} />}

        {/* Content */}
        <main className={styles.content}>
          <ActiveSection />
        </main>
      </div>
    </div>
  )
}
