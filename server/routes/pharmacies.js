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
  filename: (_, file, cb) => cb(null, `pharm_${Date.now()}${path.extname(file.originalname)}`),
})
const uploadImg = multer({ storage: imgStorage, limits: { fileSize: 5*1024*1024 },
  fileFilter: (_, f, cb) => f.mimetype.startsWith('image/') ? cb(null,true) : cb(new Error('Images only'))
})
const uploadCsv = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10*1024*1024 } })

const router = Router()

const parse = (r) => ({ ...r, delivery: Boolean(r.delivery), cold_chain: Boolean(r.cold_chain) })

function rowToPharmacy(row) {
  return {
    name:       row['Name'] || row['name'] || '',
    city:       row['City'] || row['city'] || '',
    area:       row['Area'] || row['area'] || '',
    state:      row['State'] || row['state'] || '',
    owner:      row['Owner'] || row['Contact Person'] || row['owner'] || '',
    phone:      String(row['Phone'] || row['phone'] || ''),
    hours:      row['Hours'] || row['hours'] || '',
    delivery:   String(row['Home Delivery'] || row['delivery'] || '').toLowerCase() === 'true',
    cold_chain: String(row['Cold Chain'] || row['cold_chain'] || '').toLowerCase() === 'true',
    url:        row['Website URL'] || row['url'] || null,
    map_url:         row['Map URL'] || row['map_url'] || '',
    justdial_rating: (() => { const n = parseFloat(row['Justdial Rating']||row['justdial_rating']||''); return isNaN(n)?null:n })(),
    joined:          row['Joined'] || row['joined'] || '—',
  }
}

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pharmacies ORDER BY name ASC')
    res.json(rows.map(parse))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/', uploadImg.single('image'), async (req, res) => {
  const b = req.body
  const image_url = req.file ? `/uploads/${req.file.filename}` : null
  try {
    const { rows } = await pool.query(
      `INSERT INTO pharmacies (name,city,area,state,owner,phone,hours,delivery,cold_chain,status,joined,url,map_url,image_url,justdial_rating)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'active',$10,$11,$12,$13,$14) RETURNING *`,
      [b.name, b.city||'', b.area||'', b.state||'', b.owner||'', b.phone||'', b.hours||'',
       b.delivery==='true', b.cold_chain==='true',
       b.joined||'—', b.url||null, b.map_url||'', image_url,
       b.justdial_rating ? parseFloat(b.justdial_rating) : null]
    )
    res.json(parse(rows[0]))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.put('/:id', uploadImg.single('image'), async (req, res) => {
  const b = req.body; const { id } = req.params
  try {
    let q, params
    if (req.file) {
      const { rows: old } = await pool.query('SELECT image_url FROM pharmacies WHERE id=$1', [id])
      if (old[0]?.image_url) { const fp = path.join(UPLOADS_DIR, path.basename(old[0].image_url)); if (fs.existsSync(fp)) fs.unlinkSync(fp) }
      q = `UPDATE pharmacies SET name=$1,city=$2,area=$3,state=$4,owner=$5,phone=$6,hours=$7,delivery=$8,cold_chain=$9,joined=$10,url=$11,map_url=$12,image_url=$13,justdial_rating=$14 WHERE id=$15 RETURNING *`
      params = [b.name,b.city||'',b.area||'',b.state||'',b.owner||'',b.phone||'',b.hours||'',b.delivery==='true',b.cold_chain==='true',b.joined||'—',b.url||null,b.map_url||'',`/uploads/${req.file.filename}`,b.justdial_rating?parseFloat(b.justdial_rating):null,id]
    } else {
      q = `UPDATE pharmacies SET name=$1,city=$2,area=$3,state=$4,owner=$5,phone=$6,hours=$7,delivery=$8,cold_chain=$9,joined=$10,url=$11,map_url=$12,justdial_rating=$13 WHERE id=$14 RETURNING *`
      params = [b.name,b.city||'',b.area||'',b.state||'',b.owner||'',b.phone||'',b.hours||'',b.delivery==='true',b.cold_chain==='true',b.joined||'—',b.url||null,b.map_url||'',b.justdial_rating?parseFloat(b.justdial_rating):null,id]
    }
    const { rows } = await pool.query(q, params)
    res.json(parse(rows[0]))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT image_url FROM pharmacies WHERE id=$1', [req.params.id])
    if (rows[0]?.image_url) { const fp = path.join(UPLOADS_DIR, path.basename(rows[0].image_url)); if (fs.existsSync(fp)) fs.unlinkSync(fp) }
    await pool.query('DELETE FROM pharmacies WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/import', uploadCsv.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' })
  const ext = path.extname(req.file.originalname).toLowerCase()
  let rows = []
  try {
    if (ext === '.csv') rows = csvParse(req.file.buffer, { columns:true, skip_empty_lines:true, trim:true })
    else if (ext==='.xlsx'||ext==='.xls') { const wb=XLSX.read(req.file.buffer,{type:'buffer'}); rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:''}) }
    else return res.status(400).json({ error:'Only CSV/XLS/XLSX allowed' })
    const results = { inserted:0, skipped:0, errors:[] }
    for (const row of rows) {
      const p = rowToPharmacy(row)
      if (!p.name) { results.skipped++; continue }
      try {
        await pool.query(
          `INSERT INTO pharmacies (name,city,area,state,owner,phone,hours,delivery,cold_chain,status,joined,url,map_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'active',$10,$11,$12)`,
          [p.name,p.city,p.area,p.state,p.owner,p.phone,p.hours,p.delivery,p.cold_chain,p.joined,p.url,p.map_url]
        )
        results.inserted++
      } catch(e) { results.errors.push(`${p.name}: ${e.message}`) }
    }
    res.json(results)
  } catch(e) { res.status(500).json({ error:e.message }) }
})

export default router
