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
  filename: (_, file, cb) =>
    cb(null, `testimonial_${Date.now()}${path.extname(file.originalname)}`),
})
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Images only'))
  },
})

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/', upload.single('image'), async (req, res) => {
  const { name, role, content, rating } = req.body
  const image_url = req.file ? `/uploads/${req.file.filename}` : null
  try {
    const { rows } = await pool.query(
      'INSERT INTO testimonials (name, role, content, rating, image_url) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, role || '', content, parseInt(rating) || 5, image_url]
    )
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/:id', upload.single('image'), async (req, res) => {
  const { name, role, content, rating } = req.body
  try {
    let q, params
    if (req.file) {
      q = 'UPDATE testimonials SET name=$1,role=$2,content=$3,rating=$4,image_url=$5,updated_at=NOW() WHERE id=$6 RETURNING *'
      params = [name, role || '', content, parseInt(rating) || 5, `/uploads/${req.file.filename}`, req.params.id]
    } else {
      q = 'UPDATE testimonials SET name=$1,role=$2,content=$3,rating=$4,updated_at=NOW() WHERE id=$5 RETURNING *'
      params = [name, role || '', content, parseInt(rating) || 5, req.params.id]
    }
    const { rows } = await pool.query(q, params)
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT image_url FROM testimonials WHERE id=$1', [req.params.id])
    if (rows[0]?.image_url) {
      const fp = path.join(UPLOADS_DIR, path.basename(rows[0].image_url))
      if (fs.existsSync(fp)) fs.unlinkSync(fp)
    }
    await pool.query('DELETE FROM testimonials WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
