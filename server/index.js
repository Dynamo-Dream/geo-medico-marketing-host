import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import http from 'http'
import { fileURLToPath } from 'url'
import pool from './db.js'
import statsRouter        from './routes/stats.js'
import campaignsRouter    from './routes/campaigns.js'
import testimonialsRouter from './routes/testimonials.js'
import doctorsRouter      from './routes/doctors.js'
import hospitalsRouter    from './routes/hospitals.js'
import pharmaciesRouter   from './routes/pharmacies.js'
import labsRouter         from './routes/labs.js'
import contactRouter      from './routes/contact.js'
import heroImagesRouter   from './routes/hero-images.js'
import settingsRouter     from './routes/settings.js'
import teamRouter         from './routes/team.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const clientDir = path.join(__dirname, '..', 'dist');
const UPLOADS_DIR = path.join(__dirname, 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(clientDir));
app.use('/uploads', express.static(UPLOADS_DIR))
app.use('/api/stats', statsRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/hospitals', hospitalsRouter);
app.use('/api/pharmacies', pharmaciesRouter);
app.use('/api/labs', labsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/hero-images', heroImagesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/team', teamRouter);

// app.use('/api/stats',        statsRouter)
// app.use('/api/campaigns',    campaignsRouter)
// app.use('/api/testimonials', testimonialsRouter)
// app.use('/api/doctors',      doctorsRouter)
// app.use('/api/hospitals',    hospitalsRouter)
// app.use('/api/pharmacies',   pharmaciesRouter)
// app.use('/api/labs',         labsRouter)
// app.use('/api/contact',      contactRouter)
// app.use('/api/hero-images',  heroImagesRouter)
// app.use('/api/settings',    settingsRouter)
// app.use('/api/team',        teamRouter)
app.get('/api/health', (_, res) => res.json({ ok: true }))
// React fallback for refresh/deep links
app.get('/{*path}', (req, res, next) => {
 if (req.path.startsWith('/api')) return next();
 res.sendFile(path.join(clientDir, 'index.html'));
});

// ── Database setup ───────────────────────────────────────────────────────────
try {
  // Stats
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stats (
      id SERIAL PRIMARY KEY, value VARCHAR(50) NOT NULL,
      label VARCHAR(100) NOT NULL, icon VARCHAR(50) NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )`)

  // Campaigns
  await pool.query(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY, title VARCHAR(200) NOT NULL,
      description TEXT NOT NULL DEFAULT '', image_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
    )`)

  // Testimonials
  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL,
      role VARCHAR(150) NOT NULL DEFAULT '', content TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
      image_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
    )`)

  // Doctors
  await pool.query(`
    CREATE TABLE IF NOT EXISTS doctors (
      id SERIAL PRIMARY KEY, name VARCHAR(150) NOT NULL,
      specialty VARCHAR(100) NOT NULL DEFAULT '', city VARCHAR(100) NOT NULL DEFAULT '',
      exp INTEGER NOT NULL DEFAULT 0, rating DECIMAL(3,1),
      consults INTEGER NOT NULL DEFAULT 0, fee VARCHAR(20) NOT NULL DEFAULT '',
      status VARCHAR(20) NOT NULL DEFAULT 'lead', qual VARCHAR(100) NOT NULL DEFAULT '',
      verified BOOLEAN NOT NULL DEFAULT false, joined VARCHAR(50) NOT NULL DEFAULT '—',
      created_at TIMESTAMP DEFAULT NOW()
    )`)

  // Hospitals
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hospitals (
      id SERIAL PRIMARY KEY, name VARCHAR(200) NOT NULL,
      city VARCHAR(100) NOT NULL DEFAULT '', type VARCHAR(100) NOT NULL DEFAULT 'Multi-Specialty',
      beds INTEGER NOT NULL DEFAULT 0, tier VARCHAR(20) NOT NULL DEFAULT 'Silver',
      specialties JSONB NOT NULL DEFAULT '[]',
      status VARCHAR(20) NOT NULL DEFAULT 'lead',
      contact VARCHAR(150) NOT NULL DEFAULT '', phone VARCHAR(30) NOT NULL DEFAULT '',
      joined VARCHAR(50) NOT NULL DEFAULT '—', url VARCHAR(500),
      created_at TIMESTAMP DEFAULT NOW()
    )`)

  // Pharmacies
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pharmacies (
      id SERIAL PRIMARY KEY, name VARCHAR(200) NOT NULL,
      city VARCHAR(100) NOT NULL DEFAULT '', area VARCHAR(150) NOT NULL DEFAULT '',
      owner VARCHAR(150) NOT NULL DEFAULT '', phone VARCHAR(30) NOT NULL DEFAULT '',
      hours VARCHAR(50) NOT NULL DEFAULT '', delivery BOOLEAN NOT NULL DEFAULT false,
      cold_chain BOOLEAN NOT NULL DEFAULT false, rx_orders INTEGER NOT NULL DEFAULT 0,
      status VARCHAR(20) NOT NULL DEFAULT 'lead',
      joined VARCHAR(50) NOT NULL DEFAULT '—', url VARCHAR(500),
      created_at TIMESTAMP DEFAULT NOW()
    )`)

  // Labs
  await pool.query(`
    CREATE TABLE IF NOT EXISTS labs (
      id SERIAL PRIMARY KEY, name VARCHAR(200) NOT NULL,
      city VARCHAR(100) NOT NULL DEFAULT '', area VARCHAR(150) NOT NULL DEFAULT '',
      contact VARCHAR(150) NOT NULL DEFAULT '', phone VARCHAR(30) NOT NULL DEFAULT '',
      cert JSONB NOT NULL DEFAULT '[]', home_collection BOOLEAN NOT NULL DEFAULT false,
      tests JSONB NOT NULL DEFAULT '[]', test_count INTEGER NOT NULL DEFAULT 0,
      status VARCHAR(20) NOT NULL DEFAULT 'lead',
      joined VARCHAR(50) NOT NULL DEFAULT '—', url VARCHAR(500),
      created_at TIMESTAMP DEFAULT NOW()
    )`)

  // Contact
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_info (
      id SERIAL PRIMARY KEY, email VARCHAR(200) NOT NULL DEFAULT '',
      phone VARCHAR(50) NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '',
      working_hours VARCHAR(200) NOT NULL DEFAULT '', map_url VARCHAR(500) NOT NULL DEFAULT '',
      updated_at TIMESTAMP DEFAULT NOW()
    )`)

  // Contact form submissions
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY, name VARCHAR(150) NOT NULL,
      email VARCHAR(200) NOT NULL, phone VARCHAR(50) NOT NULL DEFAULT '',
      comment TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )`)

  // Site settings (logo, social links)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id SERIAL PRIMARY KEY,
      key VARCHAR(100) UNIQUE NOT NULL,
      value TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMP DEFAULT NOW()
    )`)

  // Hero images
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hero_images (
      id SERIAL PRIMARY KEY, image_url VARCHAR(500) NOT NULL,
      caption VARCHAR(200) NOT NULL DEFAULT '',
      active BOOLEAN NOT NULL DEFAULT true,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )`)

  // Migrate doctors — justdial rating
  await pool.query(`ALTER TABLE doctors ADD COLUMN IF NOT EXISTS justdial_rating DECIMAL(3,1)`)

  // Migrate doctors table — add new columns if they don't exist
  await pool.query(`ALTER TABLE doctors ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)`)
  await pool.query(`ALTER TABLE doctors ADD COLUMN IF NOT EXISTS email VARCHAR(200) NOT NULL DEFAULT ''`)
  await pool.query(`ALTER TABLE doctors ADD COLUMN IF NOT EXISTS address TEXT NOT NULL DEFAULT ''`)
  await pool.query(`ALTER TABLE doctors ADD COLUMN IF NOT EXISTS state VARCHAR(100) NOT NULL DEFAULT ''`)
  await pool.query(`ALTER TABLE doctors ADD COLUMN IF NOT EXISTS education TEXT NOT NULL DEFAULT ''`)
  await pool.query(`ALTER TABLE doctors ADD COLUMN IF NOT EXISTS achievements TEXT NOT NULL DEFAULT ''`)
  await pool.query(`ALTER TABLE doctors ADD COLUMN IF NOT EXISTS past_experience TEXT NOT NULL DEFAULT ''`)

  // Team members
  await pool.query(`
    CREATE TABLE IF NOT EXISTS team_members (
      id SERIAL PRIMARY KEY, name VARCHAR(150) NOT NULL,
      role VARCHAR(150) NOT NULL DEFAULT '',
      image_url VARCHAR(500), sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )`)

  // Migrate pharmacies table
  await pool.query(`ALTER TABLE pharmacies ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)`)
  await pool.query(`ALTER TABLE pharmacies ADD COLUMN IF NOT EXISTS state VARCHAR(100) NOT NULL DEFAULT ''`)
  await pool.query(`ALTER TABLE pharmacies ADD COLUMN IF NOT EXISTS map_url VARCHAR(500) NOT NULL DEFAULT ''`)
  await pool.query(`ALTER TABLE pharmacies ADD COLUMN IF NOT EXISTS justdial_rating DECIMAL(3,1)`)

  // Migrate labs table
  await pool.query(`ALTER TABLE labs ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)`)
  await pool.query(`ALTER TABLE labs ADD COLUMN IF NOT EXISTS state VARCHAR(100) NOT NULL DEFAULT ''`)
  await pool.query(`ALTER TABLE labs ADD COLUMN IF NOT EXISTS map_url VARCHAR(500) NOT NULL DEFAULT ''`)
  await pool.query(`ALTER TABLE labs ADD COLUMN IF NOT EXISTS justdial_rating DECIMAL(3,1)`)

  // Migrate hospitals table — add new columns if they don't exist
  await pool.query(`ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS address TEXT NOT NULL DEFAULT ''`)
  await pool.query(`ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS state VARCHAR(100) NOT NULL DEFAULT ''`)
  await pool.query(`ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS country VARCHAR(100) NOT NULL DEFAULT 'India'`)
  await pool.query(`ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)`)
  await pool.query(`ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS justdial_rating DECIMAL(3,1)`)
  await pool.query(`ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS quora_rating DECIMAL(3,1)`)
  await pool.query(`ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS own_rating DECIMAL(3,1)`)
  await pool.query(`ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS justdial_url VARCHAR(500)`)

  console.log('✓ Tables ready')

  // ── Seed stats ─────────────────────────────────────────────────────────────
  const { rows: sc } = await pool.query('SELECT COUNT(*) FROM stats')
  if (parseInt(sc[0].count) === 0) {
    await pool.query(`
      INSERT INTO stats (value,label,icon,sort_order) VALUES
      ('50M+','Patients Served','👥',1),
      ('1,20,000+','Verified Doctors','👨‍⚕️',2),
      ('8,500+','Hospitals On Network','🏥',3),
      ('25,000+','Pharmacies & Labs','💊',4),
      ('4 Min','Avg Ambulance Response','🚑',5),
      ('500+','Cities Covered','🌍',6)`)
    console.log('✓ Seeded stats')
  }

  // ── Seed doctors ────────────────────────────────────────────────────────────
  const { rows: dc } = await pool.query('SELECT COUNT(*) FROM doctors')
  if (parseInt(dc[0].count) === 0) {
    await pool.query(`
      INSERT INTO doctors (name,specialty,city,exp,rating,consults,fee,status,qual,verified,joined) VALUES
      ('Dr. Priya Sharma','Cardiologist','Mumbai',14,4.8,127,'₹800','active','MD (Cardiology)',true,'Jan 2024'),
      ('Dr. Rajesh Kumar','Diabetologist','Delhi',18,4.9,203,'₹1000','active','DM (Endo)',true,'Feb 2024'),
      ('Dr. Ananya Mehta','Gynecologist','Bangalore',11,4.7,89,'₹700','active','MD (OBG)',true,'Mar 2024'),
      ('Dr. Suresh Patel','Orthopedic','Ahmedabad',16,4.6,156,'₹900','active','MS (Ortho)',true,'Nov 2023'),
      ('Dr. Kavitha Reddy','Neurologist','Hyderabad',13,4.8,67,'₹1200','active','DM (Neuro)',true,'Dec 2023'),
      ('Dr. Amit Singh','Pediatrician','Kolkata',9,4.9,212,'₹600','active','MD (Paed)',true,'Oct 2023'),
      ('Dr. Lakshmi Nair','Dermatologist','Chennai',8,4.5,94,'₹650','active','MD (Derm)',true,'Jan 2024'),
      ('Dr. Vikram Joshi','Psychiatrist','Pune',12,null,0,'₹950','onboarding','MD (Psych)',false,'Apr 2024'),
      ('Dr. Pooja Agarwal','ENT Specialist','Jaipur',7,null,0,'₹700','onboarding','MS (ENT)',false,'Apr 2024'),
      ('Dr. Mohan Das','General Physician','Bhubaneswar',15,null,0,'₹400','onboarding','MBBS MD',false,'Apr 2024'),
      ('Dr. Sanjay Verma','Urologist','Lucknow',10,null,0,'₹800','lead','MCh (Uro)',false,'—'),
      ('Dr. Ritu Sharma','Endocrinologist','Chandigarh',8,null,0,'₹900','lead','DM (Endo)',false,'—')`)
    console.log('✓ Seeded doctors')
  }

  // ── Seed hospitals ──────────────────────────────────────────────────────────
  const { rows: hc } = await pool.query('SELECT COUNT(*) FROM hospitals')
  if (parseInt(hc[0].count) === 0) {
    const hData = [
      ['Apollo Hospitals','Chennai','Multi-Specialty',520,'Platinum',['Cardio','Onco','Neuro'],'active','Mr. Ravi Nair','+91-44-2829-3333','Oct 2023','https://www.apollohospitals.com'],
      ['Fortis Hospital Mulund','Mumbai','Multi-Specialty',380,'Gold',['Ortho','Cardio','Gastro'],'active','Ms. Preeti Joshi','+91-22-6799-7000','Nov 2023','https://www.fortishealthcare.com'],
      ['Max Healthcare Saket','Delhi','Multi-Specialty',600,'Platinum',['Cardio','Neuro','Transplant'],'active','Mr. Deepak Gupta','+91-11-2651-5050','Sep 2023','https://www.maxhealthcare.in'],
      ['Manipal Hospital','Bangalore','Multi-Specialty',450,'Gold',['Cardio','Ortho','Onco'],'active','Dr. Suresh Kumar','+91-80-2502-4444','Dec 2023','https://www.manipalhospitals.com'],
      ['KIMS Hospitals','Hyderabad','Multi-Specialty',400,'Gold',['Neuro','Cardio','Gastro'],'active','Ms. Vidya Reddy','+91-40-4488-5000','Jan 2024','https://www.kimshospitals.com'],
      ['Care Hospitals','Hyderabad','Multi-Specialty',250,'Silver',['Cardio','Nephro'],'onboarding','Mr. Kiran Rao','+91-40-3041-8888','Mar 2024','https://www.carehospitals.com'],
      ['Medanta Lucknow','Lucknow','Multi-Specialty',350,'Gold',['Cardio','Ortho','Onco'],'onboarding','Dr. Anil Saxena','+91-522-4500-555','Apr 2024','https://www.medanta.org'],
      ['KIMS Bhubaneswar','Bhubaneswar','Multi-Specialty',200,'Silver',['Ortho','Cardio'],'lead','Mr. Sarat Panda','+91-674-6660-000','—','https://www.kimshospitals.com'],
      ['Sparsh Hospital','Bangalore','Orthopedic',120,'Silver',['Ortho','Spine','Sports'],'lead','Dr. Praveen','+91-80-4600-1000','—','https://www.sparshospital.com'],
    ]
    for (const [n,ci,t,b,ti,sp,st,co,ph,jo,ur] of hData) {
      await pool.query(
        `INSERT INTO hospitals (name,city,type,beds,tier,specialties,status,contact,phone,joined,url)
         VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10,$11)`,
        [n,ci,t,b,ti,JSON.stringify(sp),st,co,ph,jo,ur])
    }
    console.log('✓ Seeded hospitals')
  }

  // ── Seed pharmacies ─────────────────────────────────────────────────────────
  const { rows: pc } = await pool.query('SELECT COUNT(*) FROM pharmacies')
  if (parseInt(pc[0].count) === 0) {
    await pool.query(`
      INSERT INTO pharmacies (name,city,area,owner,phone,hours,delivery,cold_chain,rx_orders,status,joined,url) VALUES
      ('MedPlus – Saheed Nagar','Bhubaneswar','Saheed Nagar','Ramesh Pattnaik','+91-674-2540-100','24×7',true,true,142,'active','Jan 2024','https://www.medplusmart.com'),
      ('Apollo Pharmacy','Mumbai','Andheri West','Anjali Shah','+91-22-2674-0000','6AM–11PM',true,true,218,'active','Nov 2023','https://www.apollopharmacy.in'),
      ('Wellness Forever','Pune','Koregaon Park','Nitin Deshpande','+91-20-4120-7777','8AM–10PM',true,false,96,'active','Dec 2023','https://www.wellnessforever.com'),
      ('Frank Ross Pharmacy','Kolkata','Park Street','Subir Ghosh','+91-33-2229-6000','9AM–9PM',false,false,74,'active','Jan 2024',null),
      ('Jan Aushadhi Centre','Hyderabad','Jubilee Hills','Venkat Rao','+91-40-2355-1000','9AM–8PM',false,false,53,'active','Feb 2024','https://janaushadhi.gov.in'),
      ('Netmeds Hub','Chennai','T. Nagar','Arun Kumar','+91-44-2434-0000','8AM–10PM',true,true,0,'onboarding','Mar 2024','https://www.netmeds.com'),
      ('Guardian Pharmacy','Delhi','Connaught Place','Harpreet Singh','+91-11-2341-5000','24×7',true,false,0,'onboarding','Apr 2024',null),
      ('City Medicals','Jaipur','MI Road','Deepak Sharma','+91-141-2374-000','9AM–9PM',false,false,0,'lead','—',null)`)
    console.log('✓ Seeded pharmacies')
  }

  // ── Seed labs ───────────────────────────────────────────────────────────────
  const { rows: lc } = await pool.query('SELECT COUNT(*) FROM labs')
  if (parseInt(lc[0].count) === 0) {
    const lData = [
      ['Neuberg Diagnostics','Bhubaneswar','Ashok Nagar','Dr. S. Mohanty','+91-674-2391-111',['NABL','ISO 15189'],true,['HbA1c','FBS','Lipids','eGFR','CBC'],480,'active','Jan 2024','https://www.neubergdiagnostics.com'],
      ['Thyrocare (Agilus)','Mumbai','Turbhe','Mr. Anil Jain','+91-22-6900-1111',['NABL','CAP'],true,['Thyroid','Diabetes Panel','Metabolic'],1240,'active','Oct 2023','https://www.thyrocare.com'],
      ['Redcliffe Labs','Delhi','Lajpat Nagar','Ms. Priya Arora','+91-11-4567-8900',['NABL'],true,['CBC','LFT','RFT','HbA1c'],867,'active','Nov 2023','https://www.redcliffelabs.com'],
      ['SRL Diagnostics','Bangalore','Koramangala','Mr. Rohit Kumar','+91-80-4042-0000',['NABL','ISO'],true,['Oncology','Genetics','Routine'],654,'active','Dec 2023','https://www.srlworld.com'],
      ['Metropolis Healthcare','Chennai','Anna Nagar','Dr. Meena','+91-44-4298-7000',['NABL','CAP'],false,['Pathology','Microbiology','Serology'],423,'active','Jan 2024','https://www.metropolisindia.com'],
      ['Dr. Lal PathLabs','Delhi','Rohini','Mr. Vikas Garg','+91-11-3030-3030',['NABL','ISO 15189'],true,['Routine','Specialised'],0,'onboarding','Mar 2024','https://www.lalpathlabs.com'],
      ['Vijaya Diagnostics','Hyderabad','Banjara Hills','Dr. Ravi Teja','+91-40-2355-7777',['NABL'],true,['Radiology','Pathology'],0,'lead','—','https://www.vijayadiagnostic.com'],
    ]
    for (const [n,ci,ar,co,ph,ce,hc2,te,tc,st,jo,ur] of lData) {
      await pool.query(
        `INSERT INTO labs (name,city,area,contact,phone,cert,home_collection,tests,test_count,status,joined,url)
         VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8::jsonb,$9,$10,$11,$12)`,
        [n,ci,ar,co,ph,JSON.stringify(ce),hc2,JSON.stringify(te),tc,st,jo,ur])
    }
    console.log('✓ Seeded labs')
  }

  console.log('✓ Database ready')
} catch (e) {
  console.error('✗ Database error:', e.message)
  process.exit(1)
}

// ── HTTP server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
const server = http.createServer(app)

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`✗ Port ${PORT} already in use. Kill the existing process and retry.`)
  } else {
    console.error('✗ Server error:', err.message)
  }
  process.exit(1)
})

server.listen(PORT, () => {
  console.log(`✓ API server running at http://localhost:${PORT}`)
})

process.stdin.resume()
