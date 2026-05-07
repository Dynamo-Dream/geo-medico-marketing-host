import PortalShell, { StatusBadge, StageTrack } from '../portal/PortalShell'
import styles from '../portal/PortalShell.module.css'

const AMBULANCES = [
  { id:1,  name:'Ziqitza Healthcare',      city:'Mumbai',      area:'Andheri',          contact:'Mr. Rohit Anand',    phone:'+91-22-6111-1234', type:'BLS+ALS', fleet:42, responseTime:'3.8 min', cert:['NABL','ACLS'], coverage:['Mumbai','Thane','Navi Mumbai'], dispatch:387, status:'active',     joined:'Oct 2023' },
  { id:2,  name:'EMRI (GVK)',              city:'Hyderabad',   area:'Secunderabad',     contact:'Ms. Lakshmi Devi',   phone:'+91-40-1033',      type:'ALS',     fleet:68, responseTime:'4.1 min', cert:['ACLS','BLS'],  coverage:['Hyderabad','Rangareddy'],       dispatch:512, status:'active',     joined:'Sep 2023' },
  { id:3,  name:'Falck India',             city:'Delhi',       area:'Dwarka',           contact:'Mr. Sanjeev Sharma', phone:'+91-11-4444-5678', type:'BLS+ALS', fleet:35, responseTime:'4.4 min', cert:['ACLS'],        coverage:['Delhi','Gurugram','Noida'],     dispatch:298, status:'active',     joined:'Nov 2023' },
  { id:4,  name:'BVG Life Sciences',       city:'Pune',        area:'Hadapsar',         contact:'Ms. Anita Deshpande',phone:'+91-20-6780-0001', type:'BLS',     fleet:21, responseTime:'5.2 min', cert:['BLS'],         coverage:['Pune','PCMC'],                  dispatch:174, status:'active',     joined:'Dec 2023' },
  { id:5,  name:'CATS Ambulance',          city:'Delhi',       area:'Sarita Vihar',     contact:'Mr. Harish Yadav',   phone:'+91-11-1099',      type:'BLS+ALS', fleet:29, responseTime:'4.8 min', cert:['ACLS','ATLS'], coverage:['Delhi NCR'],                    dispatch:221, status:'active',     joined:'Jan 2024' },
  { id:6,  name:'Sundaram Medical',        city:'Chennai',     area:'Perambur',         contact:'Dr. Prabhakaran',    phone:'+91-44-2345-6789', type:'ALS',     fleet:18, responseTime:'5.5 min', cert:['ACLS'],        coverage:['Chennai','Kancheepuram'],       dispatch:163, status:'active',     joined:'Feb 2024' },
  { id:7,  name:'Portea Emergency',        city:'Bangalore',   area:'Whitefield',       contact:'Ms. Sowmya Raj',     phone:'+91-80-6741-0000', type:'BLS',     fleet:14, responseTime:'6.0 min', cert:['BLS'],         coverage:['Bangalore East'],               dispatch:0,   status:'onboarding', joined:'Mar 2024' },
  { id:8,  name:'LifeLine Ambulance Co.',  city:'Bhubaneswar', area:'Nayapalli',        contact:'Mr. Sujit Mohanty',  phone:'+91-674-2540-222', type:'BLS+ALS', fleet:8,  responseTime:null,      cert:['BLS'],         coverage:['Bhubaneswar','Cuttack'],        dispatch:0,   status:'onboarding', joined:'Apr 2024' },
  { id:9,  name:'Rapid Care Ambulance',    city:'Jaipur',      area:'Vaishali Nagar',   contact:'Mr. Deepak Rathi',   phone:'+91-141-2780-000', type:'BLS',     fleet:0,  responseTime:null,      cert:[],              coverage:['Jaipur'],                       dispatch:0,   status:'lead',       joined:'—' },
  { id:10, name:'Swift Med Transport',     city:'Lucknow',     area:'Hazratganj',       contact:'Mr. Amit Bajpai',    phone:'+91-522-2345-001', type:'BLS+ALS', fleet:0,  responseTime:null,      cert:[],              coverage:['Lucknow'],                      dispatch:0,   status:'lead',       joined:'—' },
]

const STATS = [
  { icon:'🚑', value:'10',   label:'Operators in Network',  trend: 11 },
  { icon:'✅', value:'6',    label:'Active & Dispatching',  trend: 0  },
  { icon:'📡', value:'1,755',label:'Dispatches This Month', trend: 19 },
  { icon:'⚡', value:'4.6m', label:'Avg Response Time'                 },
]

const TYPE_COLOR = { 'BLS+ALS':'#0a6ebd', ALS:'#6c5ce7', BLS:'#00b894' }

function AmbulanceCard({ item }) {
  return (
    <div className={styles.card} style={{ '--card-accent': '#fd7272' }}>
      <div className={styles.cardHead}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', flex:1 }}>
          <div className={styles.avatar}>🚑</div>
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
          background: `${TYPE_COLOR[item.type]}18`, color: TYPE_COLOR[item.type],
          border: `1px solid ${TYPE_COLOR[item.type]}30` }}>
          🚑 {item.type}
        </span>
        {item.cert.map(c => (
          <span key={c} className={styles.tag}>{c}</span>
        ))}
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Contact</span>
          <span className={styles.metaValue}>{item.contact}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Phone</span>
          <span className={styles.metaValue} style={{ fontSize:11 }}>{item.phone}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Fleet Size</span>
          <span className={styles.metaValue}>{item.fleet > 0 ? `🚑 ${item.fleet} units` : '—'}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{item.status === 'active' ? 'Dispatches/Month' : 'Joined'}</span>
          <span className={styles.metaValue}>{item.status === 'active' ? item.dispatch : item.joined}</span>
        </div>
      </div>

      {item.responseTime && (
        <div className={styles.ratingRow}>
          ⚡ <span className={styles.ratingVal}>{item.responseTime}</span>
          <span>avg response time</span>
        </div>
      )}

      <div className={styles.tagRow}>
        {item.coverage.map(c => (
          <span key={c} style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:100,
            background:'#fff4e8', color:'#c0690a' }}>📍 {c}</span>
        ))}
      </div>

      <div className={styles.cardActions}>
        <button className={styles.actionBtn}>👁 View</button>
        <button className={styles.actionBtn}>📞 Call</button>
        <button className={styles.actionBtn}>📋 SLA</button>
        {item.status === 'lead' && (
          <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>➕ Empanel</button>
        )}
      </div>
    </div>
  )
}

export default function AmbulanceTab() {
  return (
    <PortalShell
      config={{ title:'Ambulance & Emergency Fleet', icon:'🚑', color:'#fd7272', addLabel:'Add Operator' }}
      stats={STATS}
      items={AMBULANCES}
      searchKeys={['name','city','area','type','contact']}
      renderCard={item => <AmbulanceCard key={item.id} item={item} />}
    />
  )
}
