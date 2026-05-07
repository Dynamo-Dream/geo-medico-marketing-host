import PortalShell, { StatusBadge, StageTrack } from '../portal/PortalShell'
import styles from '../portal/PortalShell.module.css'

const PATIENTS = [
  { id:1,  name:'Ramesh Pattnaik',    age:54, city:'Bhubaneswar', condition:'Type 2 Diabetes',    doctor:'Dr. Rajesh Kumar',    lastVisit:'22 Apr 2024', nextAppt:'22 May 2024', hba1c:'6.9%',  plan:'Fortis POD',   status:'active',   joined:'Jan 2024' },
  { id:2,  name:'Sunita Agarwal',     age:38, city:'Delhi',        condition:'Hypertension',        doctor:'Dr. Priya Sharma',    lastVisit:'19 Apr 2024', nextAppt:'19 May 2024', hba1c:'—',     plan:'Virtual Care', status:'active',   joined:'Feb 2024' },
  { id:3,  name:'Mohammed Iqbal',     age:62, city:'Hyderabad',    condition:'Cardiac + Diabetes',  doctor:'Dr. Mohammed Rashid', lastVisit:'15 Apr 2024', nextAppt:'15 May 2024', hba1c:'7.4%',  plan:'Hospital OPD', status:'active',   joined:'Nov 2023' },
  { id:4,  name:'Preethi Narayanan',  age:29, city:'Chennai',      condition:'PCOS',                doctor:'Dr. Poornima Iyer',   lastVisit:'10 Apr 2024', nextAppt:'10 May 2024', hba1c:'—',     plan:'Virtual Care', status:'active',   joined:'Mar 2024' },
  { id:5,  name:'Vikram Singh',       age:47, city:'Pune',         condition:'Asthma + Obesity',    doctor:'Dr. Ananya Mehta',    lastVisit:'08 Apr 2024', nextAppt:'08 May 2024', hba1c:'—',     plan:'POD Kiosk',    status:'active',   joined:'Dec 2023' },
  { id:6,  name:'Annapurna Devi',     age:71, city:'Bhubaneswar',  condition:'Osteoarthritis',      doctor:'Dr. Suresh Patel',    lastVisit:'05 Apr 2024', nextAppt:'05 Jun 2024', hba1c:'—',     plan:'Home Visit',   status:'active',   joined:'Jan 2024' },
  { id:7,  name:'Rohan Mehta',        age:23, city:'Mumbai',       condition:'Anxiety Disorder',    doctor:'Dr. Sunita Rao',      lastVisit:'01 Apr 2024', nextAppt:'01 May 2024', hba1c:'—',     plan:'Virtual Care', status:'active',   joined:'Feb 2024' },
  { id:8,  name:'Kavya Krishnamurthy',age:35, city:'Bangalore',    condition:'Gestational Diabetes',doctor:'Dr. Arvind Nair',     lastVisit:'28 Mar 2024', nextAppt:'28 Apr 2024', hba1c:'5.8%',  plan:'Virtual Care', status:'active',   joined:'Mar 2024' },
  { id:9,  name:'Deepak Jha',         age:58, city:'Patna',        condition:'CKD Stage 3',         doctor:'Unassigned',          lastVisit:'—',           nextAppt:'—',           hba1c:'—',     plan:'—',            status:'onboarding', joined:'Apr 2024' },
  { id:10, name:'Lalitha Subramaniam',age:44, city:'Coimbatore',   condition:'Hypothyroidism',      doctor:'Unassigned',          lastVisit:'—',           nextAppt:'—',           hba1c:'—',     plan:'—',            status:'onboarding', joined:'Apr 2024' },
  { id:11, name:'Suresh Babu',        age:66, city:'Vijayawada',   condition:'Heart Failure + T2D', doctor:'Unassigned',          lastVisit:'—',           nextAppt:'—',           hba1c:'8.2%',  plan:'—',            status:'onboarding', joined:'Apr 2024' },
  { id:12, name:'Meera Nambiar',      age:31, city:'Kochi',        condition:'Migraine',            doctor:'Unassigned',          lastVisit:'—',           nextAppt:'—',           hba1c:'—',     plan:'—',            status:'lead',       joined:'—' },
  { id:13, name:'Amitabh Choudhury',  age:52, city:'Kolkata',      condition:'Liver Cirrhosis',     doctor:'Unassigned',          lastVisit:'—',           nextAppt:'—',           hba1c:'—',     plan:'—',            status:'lead',       joined:'—' },
  { id:14, name:'Farida Begum',       age:48, city:'Lucknow',      condition:'Rheumatoid Arthritis',doctor:'Unassigned',          lastVisit:'—',           nextAppt:'—',           hba1c:'—',     plan:'—',            status:'lead',       joined:'—' },
]

const STATS = [
  { icon:'🧑‍🤝‍🧑', value:'14',   label:'Total Patients',       trend: 17 },
  { icon:'✅',     value:'8',    label:'Active & Managed',     trend: 0  },
  { icon:'🩺',     value:'52',   label:'Visits This Month',    trend: 22 },
  { icon:'📅',     value:'9',    label:'Appointments This Week'           },
]

const PLAN_COLOR = {
  'Fortis POD':   '#7c3aed',
  'Virtual Care': '#00b894',
  'Hospital OPD': '#0a6ebd',
  'POD Kiosk':    '#ff9f43',
  'Home Visit':   '#fd7272',
}

function PatientCard({ item }) {
  const planColor = PLAN_COLOR[item.plan] || '#6b7280'
  return (
    <div className={styles.card} style={{ '--card-accent': '#0a6ebd' }}>
      <div className={styles.cardHead}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', flex:1 }}>
          <div className={styles.avatar}>🧑‍⚕️</div>
          <div style={{ flex:1 }}>
            <div className={styles.cardName}>{item.name}
              <span style={{ marginLeft:8, fontSize:12, color:'var(--text-muted)', fontWeight:500 }}>
                {item.age} yrs
              </span>
            </div>
            <div className={styles.cardSub}>📍 {item.city} · {item.condition}</div>
            <StageTrack status={item.status} />
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {item.plan !== '—' && (
        <div className={styles.tagRow}>
          <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:100,
            background:`${planColor}18`, color:planColor, border:`1px solid ${planColor}30` }}>
            🏥 {item.plan}
          </span>
        </div>
      )}

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Assigned Doctor</span>
          <span className={styles.metaValue} style={{ fontSize:12 }}>{item.doctor}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>HbA1c</span>
          <span className={styles.metaValue}>{item.hba1c}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Last Visit</span>
          <span className={styles.metaValue} style={{ fontSize:11 }}>{item.lastVisit}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Next Appointment</span>
          <span className={styles.metaValue} style={{ fontSize:11 }}>{item.nextAppt}</span>
        </div>
      </div>

      <div className={styles.cardActions}>
        <button className={styles.actionBtn}>👁 Records</button>
        <button className={styles.actionBtn}>📞 Call</button>
        <button className={styles.actionBtn}>📅 Book</button>
        {item.status === 'lead' && (
          <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>➕ Enroll</button>
        )}
      </div>
    </div>
  )
}

export default function PatientTab() {
  return (
    <PortalShell
      config={{ title:'Patient Portfolio', icon:'🧑‍⚕️', color:'#0a6ebd', addLabel:'Add Patient' }}
      stats={STATS}
      items={PATIENTS}
      searchKeys={['name','city','condition','doctor']}
      renderCard={item => <PatientCard key={item.id} item={item} />}
    />
  )
}
