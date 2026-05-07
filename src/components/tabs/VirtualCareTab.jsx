import PortalShell, { StatusBadge, StageTrack } from '../portal/PortalShell'
import styles from '../portal/PortalShell.module.css'

const PROVIDERS = [
  { id:1,  name:'Dr. Neha Kapoor',      specialty:'General Physician',  city:'Delhi',        platform:'Video+Chat', languages:['Hindi','English'],       availability:'24×7',    rating:4.9, consults:389, fee:'₹299',  status:'active',     joined:'Oct 2023' },
  { id:2,  name:'Dr. Arvind Nair',      specialty:'Diabetologist',       city:'Kochi',        platform:'Video',      languages:['Malayalam','English'],   availability:'9AM–9PM', rating:4.8, consults:214, fee:'₹499',  status:'active',     joined:'Nov 2023' },
  { id:3,  name:'Dr. Sunita Rao',       specialty:'Psychiatrist',        city:'Bangalore',    platform:'Video+Chat', languages:['Kannada','Hindi','English'], availability:'10AM–8PM',rating:4.9, consults:156, fee:'₹599',  status:'active',     joined:'Dec 2023' },
  { id:4,  name:'Dr. Mohammed Rashid',  specialty:'Cardiologist',        city:'Hyderabad',    platform:'Video',      languages:['Telugu','Urdu','English'],availability:'9AM–6PM', rating:4.7, consults:98,  fee:'₹799',  status:'active',     joined:'Jan 2024' },
  { id:5,  name:'Dr. Poornima Iyer',    specialty:'Gynecologist',        city:'Chennai',      platform:'Video+Chat', languages:['Tamil','English'],       availability:'24×7',    rating:4.8, consults:271, fee:'₹499',  status:'active',     joined:'Nov 2023' },
  { id:6,  name:'Dr. Aakash Mehta',     specialty:'Pediatrician',        city:'Ahmedabad',    platform:'Video',      languages:['Gujarati','Hindi','English'],availability:'8AM–10PM',rating:4.9, consults:318, fee:'₹349',  status:'active',     joined:'Oct 2023' },
  { id:7,  name:'Dr. Smita Patil',      specialty:'Dermatologist',       city:'Mumbai',       platform:'Chat+Async', languages:['Marathi','Hindi','English'],availability:'10AM–9PM',rating:4.6, consults:187, fee:'₹399',  status:'active',     joined:'Jan 2024' },
  { id:8,  name:'Dr. Tapas Barik',      specialty:'ENT Specialist',      city:'Bhubaneswar',  platform:'Video',      languages:['Odia','Hindi','English'], availability:'9AM–7PM', rating:null,consults:0,   fee:'₹449',  status:'onboarding', joined:'Mar 2024' },
  { id:9,  name:'Dr. Kavya Shetty',     specialty:'Endocrinologist',     city:'Mangalore',    platform:'Video+Chat', languages:['Kannada','English'],     availability:'10AM–8PM',rating:null,consults:0,   fee:'₹649',  status:'onboarding', joined:'Apr 2024' },
  { id:10, name:'Dr. Vivek Tripathi',   specialty:'Orthopedic',          city:'Lucknow',      platform:'Video',      languages:['Hindi','English'],       availability:'9AM–6PM', rating:null,consults:0,   fee:'₹549',  status:'onboarding', joined:'Apr 2024' },
  { id:11, name:'Dr. Fatima Sheikh',    specialty:'Neurologist',         city:'Kolkata',      platform:'Video',      languages:['Bengali','Urdu','English'],availability:'11AM–7PM',rating:null,consults:0,   fee:'₹899',  status:'lead',       joined:'—' },
  { id:12, name:'Dr. Rajan Pillai',     specialty:'Pulmonologist',       city:'Thiruvananthapuram', platform:'Video+Chat', languages:['Malayalam','English'], availability:'9AM–5PM', rating:null,consults:0, fee:'₹699',  status:'lead',       joined:'—' },
]

const STATS = [
  { icon:'💻', value:'12',    label:'Virtual Providers',      trend: 20 },
  { icon:'✅', value:'7',     label:'Live & Active',          trend: 0  },
  { icon:'🩺', value:'1,633', label:'Consults This Month',    trend: 28 },
  { icon:'⭐', value:'4.83',  label:'Avg Platform Rating'                },
]

const PLATFORM_COLOR = { 'Video':'#0a6ebd', 'Video+Chat':'#6c5ce7', 'Chat+Async':'#00b894' }

function VirtualProviderCard({ item }) {
  const pc = PLATFORM_COLOR[item.platform] || '#6b7280'
  return (
    <div className={styles.card} style={{ '--card-accent': '#00cec9' }}>
      <div className={styles.cardHead}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', flex:1 }}>
          <div className={styles.avatar}>💻</div>
          <div style={{ flex:1 }}>
            <div className={styles.cardName}>{item.name}</div>
            <div className={styles.cardSub}>{item.specialty} · {item.city}</div>
            <StageTrack status={item.status} />
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className={styles.tagRow}>
        <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:100,
          background:`${pc}18`, color:pc, border:`1px solid ${pc}30` }}>
          📹 {item.platform}
        </span>
        {item.languages.map(l => (
          <span key={l} className={styles.tag}>🌐 {l}</span>
        ))}
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Availability</span>
          <span className={styles.metaValue}>🕐 {item.availability}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Consult Fee</span>
          <span className={styles.metaValue}>{item.fee}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{item.status === 'active' ? 'Consults/Month' : 'Joined'}</span>
          <span className={styles.metaValue}>{item.status === 'active' ? item.consults : item.joined}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Rating</span>
          <span className={styles.metaValue}>{item.rating ? `⭐ ${item.rating}` : '—'}</span>
        </div>
      </div>

      {item.rating && (
        <div className={styles.ratingRow}>
          ⭐ <span className={styles.ratingVal}>{item.rating}</span>
          <span>patient rating</span>
        </div>
      )}

      <div className={styles.cardActions}>
        <button className={styles.actionBtn}>👁 Profile</button>
        <button className={styles.actionBtn}>📞 Call</button>
        <button className={styles.actionBtn}>📋 Contract</button>
        {item.status === 'lead' && (
          <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>➕ Onboard</button>
        )}
      </div>
    </div>
  )
}

export default function VirtualCareTab() {
  return (
    <PortalShell
      config={{ title:'Virtual Care Providers', icon:'💻', color:'#00cec9', addLabel:'Add Provider' }}
      stats={STATS}
      items={PROVIDERS}
      searchKeys={['name','specialty','city','platform']}
      renderCard={item => <VirtualProviderCard key={item.id} item={item} />}
    />
  )
}
