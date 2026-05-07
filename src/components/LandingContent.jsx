import { useState } from 'react'
import styles from './LandingContent.module.css'
import TestimonialsSection from './TestimonialsSection'
import ContactSection from './ContactSection'

const FEATURES = [
  { icon: '📅', label: 'Quick Appointments' },
  { icon: '🔬', label: 'Lab Tests' },
  { icon: '💊', label: 'Medicine Delivery' },
  { icon: '🎤', label: 'Voice/Chat Booking' },
  { icon: '⚡', label: 'Instant Prescriptions' },
  { icon: '📍', label: 'Nearest Pharmacy' },
]

const DOCTORS = [
  { name: 'Dr. Rajesh Kumar',  emoji: '👨‍⚕️', qual: 'MD, MBBS (Delhi University)', spec: 'General Medicine',   exp: '15 years', clinic: 'City Medical Center, Rourkela',   badges: ['Consultation', 'Prescription'] },
  { name: 'Dr. Priya Sharma',  emoji: '👩‍⚕️', qual: 'MBBS, MD (Delhi)',            spec: 'Pediatrician',       exp: '12 years', clinic: 'Child Care Clinic, Rourkela',     badges: ['Child Care', 'Vaccination'] },
  { name: 'Dr. Amit Patel',    emoji: '👨‍⚕️', qual: 'MBBS, MD Cardiology',         spec: 'Cardiologist',       exp: '18 years', clinic: 'Heart Care Hospital, Rourkela',   badges: ['Heart Care', 'ECG'] },
  { name: 'Dr. Neha Verma',    emoji: '👩‍⚕️', qual: 'MBBS, DNB (Dermatology)',     spec: 'Dermatologist',      exp: '10 years', clinic: 'Skin & Hair Center, Rourkela',    badges: ['Skin Care', 'Hair Treatment'] },
  { name: 'Dr. Vikram Singh',  emoji: '👨‍⚕️', qual: 'MBBS, MD (Orthopedics)',      spec: 'Orthopedic Surgeon', exp: '16 years', clinic: 'Bone & Joint Hospital, Rourkela', badges: ['Orthopedics', 'Surgery'] },
  { name: 'Dr. Anjali Mishra', emoji: '👩‍⚕️', qual: 'MBBS, MD (Gynecology)',       spec: 'Gynecologist',       exp: '14 years', clinic: "Women's Health Clinic, Rourkela", badges: ['OB/GYN', 'Pregnancy Care'] },
]

const HOSPITALS = [
  { name: 'City Medical Center',   emoji: '🏥', type: 'Multi-specialty Hospital', location: 'Main Road, Rourkela',      capacity: '150+ beds',         avail: '24/7',            services: 'General Medicine, Surgery, Cardiology, Orthopedics, Pediatrics, ICU', badges: ['Emergency 24/7', 'ICU'] },
  { name: 'Heart Care Hospital',   emoji: '🏥', type: 'Specialty Hospital',       location: 'Hospital Road, Rourkela',  capacity: '80+ beds',          avail: '24/7',            services: 'Cardiology, Cardiac Surgery, Echo, Stress Test, Angiography',         badges: ['Cardiac Care', 'Surgery'] },
  { name: 'Child Care Clinic',     emoji: '🏥', type: 'Pediatric Clinic',         location: 'Market Area, Rourkela',    capacity: '8+ Pediatricians',  avail: 'Mon–Sat 9AM–8PM', services: 'Pediatrics, Vaccination, Growth monitoring, Nutrition counseling',     badges: ['Pediatrics', 'Vaccination'] },
  { name: "Women's Health Center", emoji: '🏥', type: 'Speciality Clinic',        location: 'City Center, Rourkela',    capacity: '6+ Gynecologists',  avail: 'Daily 8AM–9PM',   services: 'OB/GYN, Pregnancy care, Delivery, Lactation support',                 badges: ['OB/GYN', 'Pregnancy'] },
  { name: 'Bone & Joint Hospital', emoji: '🏥', type: 'Specialty Hospital',       location: 'South Road, Rourkela',     capacity: '60+ beds',          avail: '24/7',            services: 'Orthopedics, Trauma, Joint replacement, Physiotherapy',               badges: ['Orthopedics', 'Trauma'] },
  { name: 'Skin & Hair Center',    emoji: '🏥', type: 'Dermatology Clinic',       location: 'Market Street, Rourkela',  capacity: '5+ Dermatologists', avail: 'Mon–Sat 10AM–7PM',services: 'Skin care, Hair treatment, Laser therapy, Cosmetic procedures',         badges: ['Dermatology', 'Laser'] },
]

const LABS = [
  { name: 'Care Diagnostics',    emoji: '🔬', location: 'Main Road, Rourkela',      services: 'Blood tests, Pathology, Radiology, ECG, Ultrasound',               reports: '24 hours',  timing: '7AM–8PM Daily',  badges: ['Home Collection', 'Fast Results'] },
  { name: 'Apollo Diagnostics',  emoji: '🔬', location: 'Hospital Road, Rourkela',  services: 'Complete blood work, Imaging, Pathology, COVID testing',           reports: '12–24 hrs', timing: '24/7',           badges: ['24/7 Available', 'COVID Test'] },
  { name: 'Max Healthcare Labs', emoji: '🔬', location: 'Market Area, Rourkela',    services: 'Pathology, Radiology, Ultrasound, CT Scan, MRI',                   reports: 'Same day',  timing: '8AM–9PM Daily',  badges: ['Advanced Imaging', 'Same Day'] },
  { name: 'LabCure Pathology',   emoji: '🔬', location: 'City Center, Rourkela',    services: 'Blood tests, Biochemistry, Microbiology, Pathology',               reports: '24 hours',  timing: '7AM–7PM Daily',  badges: ['Affordable', 'Trusted'] },
  { name: 'Thyrocare Centers',   emoji: '🔬', location: 'South Road, Rourkela',     services: 'Thyroid tests, Hormone levels, Genetic testing, Wellness packages', reports: '24–48 hrs', timing: '9AM–6PM Daily',  badges: ['Thyroid Specialist', 'Wellness'] },
  { name: 'Redcare Labs',        emoji: '🔬', location: 'Market Street, Rourkela',  services: 'General pathology, Vaccination, Health checkup, Prenatal tests',   reports: '24 hours',  timing: '7AM–8PM Daily',  badges: ['Home Service', 'Quick'] },
]

const DISEASES = [
  'Diabetes', 'Hypertension / High Blood Pressure', 'Asthma', 'Heart Disease',
  'Thyroid Problem', 'Arthritis', 'Cold / Cough / Fever', 'Skin Disease',
  'No Specific Condition', 'Other',
]

function SectionHead({ title, sub, accent }) {
  return (
    <div className={styles.sectionHead}>
      <h2 className={styles.sectionTitle} style={{ color: accent }}>{title}</h2>
      <div className={styles.sectionBar} style={{ background: accent }} />
      {sub && <p className={styles.sectionSub}>{sub}</p>}
    </div>
  )
}

function DoctorCard({ d }) {
  return (
    <div className={styles.eCard}>
      <div className={styles.eCardImg} style={{ background: 'linear-gradient(135deg, #0a6ebd, #38bdf8)' }}>
        <span className={styles.eCardEmoji}>{d.emoji}</span>
      </div>
      <div className={styles.eCardBody}>
        <h3 className={styles.eCardName}>{d.name}</h3>
        <p className={styles.eCardDesig} style={{ color: '#0a6ebd' }}>{d.qual}</p>
        <p className={styles.eCardMeta}><strong>Specialization:</strong> {d.spec}</p>
        <p className={styles.eCardMeta}><strong>Experience:</strong> {d.exp}</p>
        <p className={styles.eCardMeta}><strong>Clinic:</strong> {d.clinic}</p>
        <div className={styles.eBadges}>
          {d.badges.map(b => <span key={b} className={styles.eBadge}>{b}</span>)}
        </div>
      </div>
    </div>
  )
}

function HospitalCard({ h }) {
  return (
    <div className={styles.eCard}>
      <div className={styles.eCardImg} style={{ background: 'linear-gradient(135deg, #00806a, #00b894)' }}>
        <span className={styles.eCardEmoji}>{h.emoji}</span>
      </div>
      <div className={styles.eCardBody}>
        <h3 className={styles.eCardName}>{h.name}</h3>
        <p className={styles.eCardMeta}><strong>Location:</strong> {h.location}</p>
        <p className={styles.eCardMeta}><strong>Type:</strong> {h.type}</p>
        <p className={styles.eCardMeta}><strong>Capacity:</strong> {h.capacity}</p>
        <p className={styles.eCardMeta}><strong>Services:</strong> {h.services}</p>
        <p className={styles.eCardMeta}><strong>Availability:</strong> {h.avail}</p>
        <div className={styles.eBadges}>
          {h.badges.map(b => <span key={b} className={`${styles.eBadge} ${styles.eBadgeGreen}`}>{b}</span>)}
        </div>
      </div>
    </div>
  )
}

function LabCard({ l }) {
  return (
    <div className={styles.eCard}>
      <div className={styles.eCardImg} style={{ background: 'linear-gradient(135deg, #5b21b6, #a78bfa)' }}>
        <span className={styles.eCardEmoji}>{l.emoji}</span>
      </div>
      <div className={styles.eCardBody}>
        <h3 className={styles.eCardName}>{l.name}</h3>
        <p className={styles.eCardMeta}><strong>Location:</strong> {l.location}</p>
        <p className={styles.eCardMeta}><strong>Services:</strong> {l.services}</p>
        <p className={styles.eCardMeta}><strong>Home Collection:</strong> Yes, Free</p>
        <p className={styles.eCardMeta}><strong>Report Delivery:</strong> {l.reports}</p>
        <p className={styles.eCardMeta}><strong>Timing:</strong> {l.timing}</p>
        <div className={styles.eBadges}>
          {l.badges.map(b => <span key={b} className={`${styles.eBadge} ${styles.eBadgePurple}`}>{b}</span>)}
        </div>
      </div>
    </div>
  )
}

function RegistrationSection() {
  const EMPTY = { name: '', mobile: '', address: '', disease: '', age: '', allergies: '' }
  const [form, setForm] = useState(EMPTY)
  const [submitted, setSubmitted] = useState(false)

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    localStorage.setItem('patientData', JSON.stringify({ ...form, registrationTime: new Date().toLocaleString() }))
    setSubmitted(true)
    setForm(EMPTY)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className={`${styles.sectionWrap} ${styles.regBg}`} id="register">
      <div className={styles.sectionInner}>
        <SectionHead title="Simple Registration" accent="var(--primary)" />
        <div className={styles.regCard}>
          <h3 className={styles.regTitle}>Register in 2 Minutes</h3>
          {submitted && (
            <div className={styles.successMsg}>✓ Registration Successful! We'll be in touch shortly.</div>
          )}
          <form onSubmit={handleSubmit} className={styles.regForm}>
            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input type="text" required placeholder="Enter your full name" value={form.name} onChange={set('name')} />
            </div>
            <div className={styles.formGroup}>
              <label>Mobile Number *</label>
              <input type="tel" required placeholder="10 digit mobile number" pattern="[0-9]{10}" value={form.mobile} onChange={set('mobile')} />
            </div>
            <div className={styles.formGroup}>
              <label>Address *</label>
              <textarea required placeholder="House No., Area, City, Pin Code" rows={2} value={form.address} onChange={set('address')} />
            </div>
            <div className={styles.formGroup}>
              <label>Current Health Condition *</label>
              <select required value={form.disease} onChange={set('disease')}>
                <option value="">-- Select Your Condition --</option>
                {DISEASES.map(d => <option key={d} value={d.toLowerCase().replace(/ \/ /g, '_').replace(/ /g, '_')}>{d}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Age (Optional)</label>
              <input type="number" placeholder="Your age" min={1} max={120} value={form.age} onChange={set('age')} />
            </div>
            <div className={styles.formGroup}>
              <label>Medicine Allergies (if any)</label>
              <textarea placeholder="List any medicine allergies here" rows={2} value={form.allergies} onChange={set('allergies')} />
            </div>
            <button type="submit" className={styles.regBtn}>Register Now — It's Free!</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LandingContent() {
  return (
    <>
      {/* About */}
      <div className={styles.sectionWrap} id="about">
        <div className={styles.sectionInner}>
          <SectionHead title="About Geo Medico" accent="var(--primary)" />
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <h3>Your Trusted Healthcare Partner</h3>
              <p>Geo Medico is a comprehensive digital healthcare platform designed to make quality healthcare accessible to everyone, everywhere. We bridge the gap between patients and healthcare providers through technology.</p>
              <p>Whether you need to consult a doctor, get lab tests done, or order medicines, Geo Medico brings all healthcare services to your fingertips in the simplest way possible.</p>
              <p><strong>Easy & Secure:</strong> Simple registration, quick appointments, and safe prescription management.</p>
            </div>
            <div className={styles.featureGrid}>
              {FEATURES.map(f => (
                <div key={f.label} className={styles.featureItem}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <strong>{f.label}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Registration */}
      <RegistrationSection />

      {/* Testimonials — DB-driven */}
      <TestimonialsSection />

      {/* Contact — DB-driven */}
      <ContactSection />

      {/* Doctors
      <div className={styles.sectionWrap} id="doctors">
        <div className={styles.sectionInner}>
          <SectionHead title="Our Trusted Doctors" sub="Connect with 500+ experienced doctors across various specializations" accent="var(--primary)" />
          <div className={styles.cardsGrid}>
            {DOCTORS.map(d => <DoctorCard key={d.name} d={d} />)}
          </div>
        </div>
      </div> */}

      {/* Hospitals */}
      {/* <div className={`${styles.sectionWrap} ${styles.altBg}`} id="hospitals">
        <div className={styles.sectionInner}>
          <SectionHead title="Associated Hospitals & Clinics" sub="50+ hospitals and clinics partnered with Geo Medico" accent="var(--secondary-dark)" />
          <div className={styles.cardsGrid}>
            {HOSPITALS.map(h => <HospitalCard key={h.name} h={h} />)}
          </div>
        </div>
      </div> */}

      {/* Labs */}
      {/* <div className={styles.sectionWrap} id="labs">
        <div className={styles.sectionInner}>
          <SectionHead title="Diagnostic Labs" sub="30+ diagnostic centers with home sample collection" accent="#5b21b6" />
          <div className={styles.cardsGrid}>
            {LABS.map(l => <LabCard key={l.name} l={l} />)}
          </div>
        </div>
      </div> */}
    </>
  )
}
