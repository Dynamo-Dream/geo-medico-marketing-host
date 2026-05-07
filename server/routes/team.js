import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import pool from '../db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS_DIR),
  filename: (_, file, cb) => cb(null, `team_${Date.now()}${path.extname(file.originalname)}`),
})
const upload = multer({ storage, limits: { fileSize: 5*1024*1024 },
  fileFilter: (_, f, cb) => f.mimetype.startsWith('image/') ? cb(null,true) : cb(new Error('Images only'))
})

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM team_members ORDER BY sort_order, created_at ASC')
    res.json(rows)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/', upload.single('image'), async (req, res) => {
  const { name, role, sort_order } = req.body
  const image_url = req.file ? `/uploads/${req.file.filename}` : null
  try {
    const { rows } = await pool.query(
      `INSERT INTO team_members (name, role, image_url, sort_order) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, role||'', image_url, parseInt(sort_order)||0]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.put('/:id', upload.single('image'), async (req, res) => {
  const { name, role, sort_order } = req.body; const { id } = req.params
  try {
    let q, params
    if (req.file) {
      const { rows: old } = await pool.query('SELECT image_url FROM team_members WHERE id=$1', [id])
      if (old[0]?.image_url) { const fp = path.join(UPLOADS_DIR, path.basename(old[0].image_url)); if (fs.existsSync(fp)) fs.unlinkSync(fp) }
      q = `UPDATE team_members SET name=$1,role=$2,sort_order=$3,image_url=$4 WHERE id=$5 RETURNING *`
      params = [name, role||'', parseInt(sort_order)||0, `/uploads/${req.file.filename}`, id]
    } else {
      q = `UPDATE team_members SET name=$1,role=$2,sort_order=$3 WHERE id=$4 RETURNING *`
      params = [name, role||'', parseInt(sort_order)||0, id]
    }
    const { rows } = await pool.query(q, params)
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT image_url FROM team_members WHERE id=$1', [req.params.id])
    if (rows[0]?.image_url) { const fp = path.join(UPLOADS_DIR, path.basename(rows[0].image_url)); if (fs.existsSync(fp)) fs.unlinkSync(fp) }
    await pool.query('DELETE FROM team_members WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

export default router
