import PortalShell, { StatusBadge, StageTrack } from '../portal/PortalShell'
import styles from '../portal/PortalShell.module.css'

const PODS = [
  { id:1,  name:'POD-BBSR-001',     city:'Bhubaneswar', area:'Saheed Nagar',      type:'Urban',     operator:'Fortis Diabetes POD', contact:'Mr. Sujit Das',      phone:'+91-674-2391-500', equipment:['ECG','Glucose','SpO2','BP','BMI'], dailyConsults:38, uptime:'99.2%', status:'active',     installed:'Jan 2024' },
  { id:2,  name:'POD-MUM-007',      city:'Mumbai',      area:'Dharavi',           type:'Urban',     operator:'GeoMedico Ops',       contact:'Ms. Rekha Patil',    phone:'+91-22-6555-7007', equipment:['ECG','Glucose','SpO2','BP'],       dailyConsults:52, uptime:'98.7%', status:'active',     installed:'Nov 2023' },
  { id:3,  name:'POD-DEL-012',      city:'Delhi',       area:'Sangam Vihar',      type:'Urban',     operator:'GeoMedico Ops',       contact:'Mr. Ranjit Singh',   phone:'+91-11-4111-0012', equipment:['ECG','Glucose','SpO2','BP','BMI'], dailyConsults:61, uptime:'99.5%', status:'active',     installed:'Oct 2023' },
  { id:4,  name:'POD-RUR-KLDML-001',city:'Kalahandi',   area:'Dharmagarh Block',  type:'Rural',     operator:'Odisha Health Dept',  contact:'Mr. Pradip Bag',     phone:'+91-6670-220-100', equipment:['Glucose','SpO2','BP','Temp'],      dailyConsults:24, uptime:'97.1%', status:'active',     installed:'Dec 2023' },
  { id:5,  name:'POD-CORP-INFOSYS', city:'Bangalore',   area:'Electronics City',  type:'Corporate', operator:'Infosys Wellness',    contact:'Ms. Nandini Rao',    phone:'+91-80-2852-0261', equipment:['ECG','Glucose','SpO2','BP','BMI'], dailyConsults:47, uptime:'99.8%', status:'active',     installed:'Jan 2024' },
  { id:6,  name:'POD-SCH-DELHI-003',city:'Delhi',       area:'Rohini Sec-14',     type:'School',    operator:'Delhi Govt Schools',  contact:'Principal Ramesh',   phone:'+91-11-2780-0303', equipment:['BMI','BP','Temp','SpO2'],          dailyConsults:19, uptime:'96.4%', status:'active',     installed:'Feb 2024' },
  { id:7,  name:'POD-HYD-023',      city:'Hyderabad',   area:'Mehdipatnam',       type:'Urban',     operator:'GeoMedico Ops',       contact:'Mr. Ravi Teja',      phone:'+91-40-4500-0023', equipment:['ECG','Glucose','SpO2','BP'],       dailyConsults:0,  uptime:null,    status:'onboarding', installed:'Mar 2024' },
  { id:8,  name:'POD-CORP-TCS-CHN', city:'Chennai',     area:'Sholinganallur',    type:'Corporate', operator:'TCS Wellness',        contact:'Ms. Meena Iyer',     phone:'+91-44-6750-1000', equipment:['ECG','Glucose','SpO2','BP','BMI'], dailyConsults:0,  uptime:null,    status:'onboarding', installed:'Apr 2024' },
  { id:9,  name:'POD-RUR-GAJAPATI', city:'Gajapati',    area:'Paralakhemundi',    type:'Rural',     operator:'Pending',             contact:'Mr. Santosh Nayak',  phone:'+91-6815-220-400', equipment:[],                                  dailyConsults:0,  uptime:null,    status:'lead',       installed:'—' },
  { id:10, name:'POD-CORP-WIPRO-BG',city:'Bangalore',   area:'Sarjapur Road',     type:'Corporate', operator:'Pending',             contact:'Ms. Divya Kulkarni', phone:'+91-80-2844-0001', equipment:[],                                  dailyConsults:0,  uptime:null,    status:'lead',       installed:'—' },
]

const STATS = [
  { icon:'📦', value:'10',  label:'PODs in Network',      trend: 25 },
  { icon:'✅', value:'6',   label:'Operational & Live',   trend: 0  },
  { icon:'🩺', value:'241', label:'Daily Consults',       trend: 31 },
  { icon:'⚡', value:'3m',  label:'Avg Checkup Time'                 },
]

const TYPE_COLOR = { Urban:'#0a6ebd', Rural:'#00b894', Corporate:'#6c5ce7', School:'#fd7272' }

function PodCard({ item }) {
  return (
    <div className={styles.card} style={{ '--card-accent': '#ff9f43' }}>
      <div className={styles.cardHead}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', flex:1 }}>
          <div className={styles.avatar}>📦</div>
          <div style={{ flex:1 }}>
            <div className={styles.cardName}>{item.name}</div>
            <div className={styles.cardSub}>📍 {item.area}, {item.city}</div>
            <StageTrack status={item.status} />
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className={styles.tagRow}>
        <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:100,
          background:`${TYPE_COLOR[item.type]}18`, color: TYPE_COLOR[item.type],
          border:`1px solid ${TYPE_COLOR[item.type]}30` }}>
          {item.type === 'Urban' ? '🏙️' : item.type === 'Rural' ? '🌾' : item.type === 'Corporate' ? '🏢' : '🏫'} {item.type}
        </span>
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Operator</span>
          <span className={styles.metaValue} style={{ fontSize:12 }}>{item.operator}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Contact</span>
          <span className={styles.metaValue} style={{ fontSize:12 }}>{item.contact}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{item.status === 'active' ? 'Daily Consults' : 'Installed'}</span>
          <span className={styles.metaValue}>{item.status === 'active' ? `🩺 ${item.dailyConsults}` : item.installed}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Uptime</span>
          <span className={styles.metaValue}>{item.uptime ?? '—'}</span>
        </div>
      </div>

      {item.equipment.length > 0 && (
        <div className={styles.tagRow}>
          {item.equipment.map(e => (
            <span key={e} className={styles.tag}>🔬 {e}</span>
          ))}
        </div>
      )}

      <div className={styles.cardActions}>
        <button className={styles.actionBtn}>👁 View</button>
        <button className={styles.actionBtn}>📡 Remote</button>
        <button className={styles.actionBtn}>📋 Report</button>
        {item.status === 'lead' && (
          <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>➕ Deploy</button>
        )}
      </div>
    </div>
  )
}

export default function PodTab() {
  return (
    <PortalShell
      config={{ title:'POD Kiosk Network', icon:'📦', color:'#ff9f43', addLabel:'Deploy POD' }}
      stats={STATS}
      items={PODS}
      searchKeys={['name','city','area','type','operator']}
      renderCard={item => <PodCard key={item.id} item={item} />}
    />
  )
}
