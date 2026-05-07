import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { parse as csvParse } from 'csv-parse/sync'
import * as XLSX from 'xlsx'
import pool from '../db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')

const imgStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS_DIR),
  filename:    (_, file, cb) => cb(null, `hosp_${Date.now()}${path.extname(file.originalname)}`),
})
const csvStorage = multer.memoryStorage()

const uploadImg = multer({ storage: imgStorage, limits: { fileSize: 8*1024*1024 },
  fileFilter: (_, f, cb) => f.mimetype.startsWith('image/') ? cb(null,true) : cb(new Error('Images only'))
})
const uploadCsv = multer({ storage: csvStorage, limits: { fileSize: 10*1024*1024 } })

const router = Router()

function toArr(val) {
  if (Array.isArray(val)) return val
  if (!val) return []
  return String(val).split(',').map(s => s.trim()).filter(Boolean)
}

function safeNum(v) {
  if (!v && v !== 0) return null
  // Handle "4.4/5" format from JustDial CSV
  const str = String(v).trim()
  const slashIdx = str.indexOf('/')
  const n = parseFloat(slashIdx > -1 ? str.slice(0, slashIdx) : str)
  return isNaN(n) ? null : n
}

// Map CSV/Excel row to DB fields
function rowToHospital(row) {
  return {
    name:             row['Name'] || row['name'] || '',
    address:          row['Address'] || row['address'] || '',
    city:             row['City'] || row['city'] || '',
    state:            row['State'] || row['state'] || '',
    country:          row['Country'] || row['country'] || 'India',
    type:             row['Type'] || row['type'] || 'Multi-Specialty',
    beds:             parseInt(row['Number of Beds'] || row['beds'] || '0') || 0,
    specialties:      toArr(row['Hospital Speciality'] || row['specialties'] || ''),
    phone:            String(row['Hospital Contact Number'] || row['phone'] || ''),
    url:              row['Website URL'] || row['url'] || null,
    justdial_url:     row['justdial_url'] || null,
    justdial_rating:  safeNum(row['Justdial Review'] || row['Justdial Rating'] || row['justdial_rating']),
    quora_rating:     safeNum(row['Quora Rating'] || row['quora_rating']),
    own_rating:       safeNum(row['GeoMedico Rating'] || row['own_rating'] || row['geomedico_rating']),
    contact:          row['Contact Person'] || row['contact'] || '',
    joined:           row['Joined'] || row['joined'] || '—',
  }
}

async function insertHospital(h) {
  const { rows } = await pool.query(
    `INSERT INTO hospitals
      (name,address,city,state,country,type,beds,specialties,phone,url,justdial_url,
       justdial_rating,quora_rating,own_rating,contact,joined,status,tier)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14,$15,$16,'active','Silver')
     RETURNING *`,
    [h.name, h.address, h.city, h.state, h.country, h.type, h.beds,
     JSON.stringify(h.specialties), h.phone, h.url||null, h.justdial_url||null,
     h.justdial_rating, h.quora_rating, h.own_rating, h.contact, h.joined]
  )
  return rows[0]
}

// ── GET all ──────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM hospitals ORDER BY name ASC')
    res.json(rows)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── POST (create with optional image) ────────────────────────────────────────
router.post('/', uploadImg.single('image'), async (req, res) => {
  const b = req.body
  const image_url = req.file ? `/uploads/${req.file.filename}` : null
  try {
    const { rows } = await pool.query(
      `INSERT INTO hospitals
        (name,address,city,state,country,type,beds,specialties,phone,url,justdial_url,
         justdial_rating,quora_rating,own_rating,contact,joined,status,tier,image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
       RETURNING *`,
      [b.name, b.address||'', b.city||'', b.state||'', b.country||'India',
       b.type||'Multi-Specialty', parseInt(b.beds)||0,
       JSON.stringify(toArr(b.specialties)), b.phone||'', b.url||null, b.justdial_url||null,
       safeNum(b.justdial_rating), safeNum(b.quora_rating), safeNum(b.own_rating ?? b.geomedico_rating),
       b.contact||'', b.joined||'—', b.status||'active', b.tier||'Silver', image_url]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── PUT (update with optional image) ─────────────────────────────────────────
router.put('/:id', uploadImg.single('image'), async (req, res) => {
  const b = req.body
  const { id } = req.params
  try {
    let q, params
    if (req.file) {
      q = `UPDATE hospitals SET name=$1,address=$2,city=$3,state=$4,country=$5,type=$6,beds=$7,
           specialties=$8::jsonb,phone=$9,url=$10,justdial_url=$11,justdial_rating=$12,
           quora_rating=$13,own_rating=$14,contact=$15,joined=$16,status=$17,tier=$18,image_url=$19
           WHERE id=$20 RETURNING *`
      params = [b.name, b.address||'', b.city||'', b.state||'', b.country||'India',
        b.type||'Multi-Specialty', parseInt(b.beds)||0, JSON.stringify(toArr(b.specialties)),
        b.phone||'', b.url||null, b.justdial_url||null,
        safeNum(b.justdial_rating), safeNum(b.quora_rating), safeNum(b.own_rating ?? b.geomedico_rating),
        b.contact||'', b.joined||'—', b.status||'active', b.tier||'Silver',
        `/uploads/${req.file.filename}`, id]
    } else {
      q = `UPDATE hospitals SET name=$1,address=$2,city=$3,state=$4,country=$5,type=$6,beds=$7,
           specialties=$8::jsonb,phone=$9,url=$10,justdial_url=$11,justdial_rating=$12,
           quora_rating=$13,own_rating=$14,contact=$15,joined=$16,status=$17,tier=$18
           WHERE id=$19 RETURNING *`
      params = [b.name, b.address||'', b.city||'', b.state||'', b.country||'India',
        b.type||'Multi-Specialty', parseInt(b.beds)||0, JSON.stringify(toArr(b.specialties)),
        b.phone||'', b.url||null, b.justdial_url||null,
        safeNum(b.justdial_rating), safeNum(b.quora_rating), safeNum(b.own_rating ?? b.geomedico_rating),
        b.contact||'', b.joined||'—', b.status||'active', b.tier||'Silver', id]
    }
    const { rows } = await pool.query(q, params)
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── DELETE ───────────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT image_url FROM hospitals WHERE id=$1', [req.params.id])
    if (rows[0]?.image_url) {
      const fp = path.join(UPLOADS_DIR, path.basename(rows[0].image_url))
      if (fs.existsSync(fp)) fs.unlinkSync(fp)
    }
    await pool.query('DELETE FROM hospitals WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── POST /import — CSV or Excel bulk upload ───────────────────────────────────
router.post('/import', uploadCsv.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  const ext = path.extname(req.file.originalname).toLowerCase()
  let rows = []

  try {
    if (ext === '.csv') {
      rows = csvParse(req.file.buffer, { columns: true, skip_empty_lines: true, trim: true })
    } else if (ext === '.xlsx' || ext === '.xls') {
      const wb = XLSX.read(req.file.buffer, { type: 'buffer' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      rows = XLSX.utils.sheet_to_json(ws, { defval: '' })
    } else {
      return res.status(400).json({ error: 'Only CSV, XLS, XLSX files allowed' })
    }

    const results = { inserted: 0, skipped: 0, errors: [] }
    for (const row of rows) {
      const h = rowToHospital(row)
      if (!h.name || !h.phone) { results.skipped++; continue }
      try {
        await insertHospital(h)
        results.inserted++
      } catch (e) {
        results.errors.push(`${h.name}: ${e.message}`)
      }
    }
    res.json(results)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
