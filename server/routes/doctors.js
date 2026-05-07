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
  filename:    (_, file, cb) => cb(null, `doctor_${Date.now()}${path.extname(file.originalname)}`),
})
const uploadImg = multer({ storage: imgStorage, limits: { fileSize: 5*1024*1024 },
  fileFilter: (_, f, cb) => f.mimetype.startsWith('image/') ? cb(null,true) : cb(new Error('Images only'))
})
const uploadCsv = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10*1024*1024 } })

const router = Router()

function safeNum(v) {
  if (!v && v !== 0) return null
  const n = parseFloat(String(v).split('/')[0])
  return isNaN(n) ? null : n
}

function rowToDoctor(row) {
  return {
    name:            row['Name'] || row['name'] || '',
    specialty:       row['Specialty'] || row['specialty'] || '',
    qual:            row['Qualification'] || row['qual'] || row['Qual'] || '',
    city:            row['City'] || row['city'] || '',
    state:           row['State'] || row['state'] || '',
    exp:             parseInt(row['Experience'] || row['exp'] || '0') || 0,
    fee:             row['Fee'] || row['fee'] || '',
    phone:           String(row['Phone'] || row['phone'] || ''),
    email:           row['Email'] || row['email'] || '',
    address:         row['Address'] || row['address'] || '',
    rating:          safeNum(row['Rating'] || row['rating']),
    education:       row['Education'] || row['education'] || '',
    achievements:    row['Achievements'] || row['achievements'] || '',
    past_experience: row['Past Experience'] || row['past_experience'] || '',
    justdial_rating: safeNum(row['Justdial Rating'] || row['justdial_rating']),
    verified:        String(row['Verified'] || row['verified'] || '').toLowerCase() === 'true',
    joined:          row['Joined'] || row['joined'] || '—',
  }
}

const parse = (r) => ({
  ...r,
  exp: Number(r.exp),
  rating: r.rating != null ? Number(r.rating) : null,
  consults: Number(r.consults || 0),
})

// ── GET all ──────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM doctors ORDER BY name ASC')
    res.json(rows.map(parse))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── POST create with optional photo ──────────────────────────────────────────
router.post('/', uploadImg.single('image'), async (req, res) => {
  const b = req.body
  const image_url = req.file ? `/uploads/${req.file.filename}` : null
  try {
    const { rows } = await pool.query(
      `INSERT INTO doctors
        (name,specialty,city,state,exp,rating,fee,qual,verified,joined,
         email,address,education,achievements,past_experience,image_url,justdial_rating,status,consults)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'active',0) RETURNING *`,
      [b.name, b.specialty||'', b.city||'', b.state||'',
       parseInt(b.exp)||0, safeNum(b.rating),
       b.fee||'', b.qual||'', b.verified==='true'||b.verified===true,
       b.joined||'—', b.email||'', b.address||'',
       b.education||'', b.achievements||'', b.past_experience||'', image_url,
       safeNum(b.justdial_rating)]
    )
    res.json(parse(rows[0]))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── PUT update with optional photo ───────────────────────────────────────────
router.put('/:id', uploadImg.single('image'), async (req, res) => {
  const b = req.body
  const { id } = req.params
  try {
    let q, params
    if (req.file) {
      const { rows: old } = await pool.query('SELECT image_url FROM doctors WHERE id=$1', [id])
      if (old[0]?.image_url) {
        const fp = path.join(UPLOADS_DIR, path.basename(old[0].image_url))
        if (fs.existsSync(fp)) fs.unlinkSync(fp)
      }
      q = `UPDATE doctors SET name=$1,specialty=$2,city=$3,state=$4,exp=$5,rating=$6,fee=$7,
           qual=$8,verified=$9,joined=$10,email=$11,address=$12,education=$13,
           achievements=$14,past_experience=$15,image_url=$16,justdial_rating=$17 WHERE id=$18 RETURNING *`
      params = [b.name, b.specialty||'', b.city||'', b.state||'', parseInt(b.exp)||0,
        safeNum(b.rating), b.fee||'', b.qual||'', b.verified==='true'||b.verified===true,
        b.joined||'—', b.email||'', b.address||'', b.education||'',
        b.achievements||'', b.past_experience||'', `/uploads/${req.file.filename}`,
        safeNum(b.justdial_rating), id]
    } else {
      q = `UPDATE doctors SET name=$1,specialty=$2,city=$3,state=$4,exp=$5,rating=$6,fee=$7,
           qual=$8,verified=$9,joined=$10,email=$11,address=$12,education=$13,
           achievements=$14,past_experience=$15,justdial_rating=$16 WHERE id=$17 RETURNING *`
      params = [b.name, b.specialty||'', b.city||'', b.state||'', parseInt(b.exp)||0,
        safeNum(b.rating), b.fee||'', b.qual||'', b.verified==='true'||b.verified===true,
        b.joined||'—', b.email||'', b.address||'', b.education||'',
        b.achievements||'', b.past_experience||'', safeNum(b.justdial_rating), id]
    }
    const { rows } = await pool.query(q, params)
    res.json(parse(rows[0]))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── DELETE ───────────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT image_url FROM doctors WHERE id=$1', [req.params.id])
    if (rows[0]?.image_url) {
      const fp = path.join(UPLOADS_DIR, path.basename(rows[0].image_url))
      if (fs.existsSync(fp)) fs.unlinkSync(fp)
    }
    await pool.query('DELETE FROM doctors WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// ── POST /import CSV or Excel ─────────────────────────────────────────────────
router.post('/import', uploadCsv.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const ext = path.extname(req.file.originalname).toLowerCase()
  let rows = []
  try {
    if (ext === '.csv') {
      rows = csvParse(req.file.buffer, { columns: true, skip_empty_lines: true, trim: true })
    } else if (ext === '.xlsx' || ext === '.xls') {
      const wb = XLSX.read(req.file.buffer, { type: 'buffer' })
      rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' })
    } else {
      return res.status(400).json({ error: 'Only CSV, XLS, XLSX allowed' })
    }
    const results = { inserted: 0, skipped: 0, errors: [] }
    for (const row of rows) {
      const d = rowToDoctor(row)
      if (!d.name) { results.skipped++; continue }
      try {
        await pool.query(
          `INSERT INTO doctors
            (name,specialty,city,state,exp,rating,fee,qual,verified,joined,
             email,address,education,achievements,past_experience,justdial_rating,status,consults)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'active',0)`,
          [d.name, d.specialty, d.city, d.state, d.exp, d.rating, d.fee,
           d.qual, d.verified, d.joined, d.email, d.address,
           d.education, d.achievements, d.past_experience, d.justdial_rating]
        )
        results.inserted++
      } catch (e) { results.errors.push(`${d.name}: ${e.message}`) }
    }
    res.json(results)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

export default router
