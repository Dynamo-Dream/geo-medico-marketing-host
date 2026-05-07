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
    cb(null, `hero_${Date.now()}${path.extname(file.originalname)}`),
})
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files allowed'))
  },
})

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM hero_images WHERE active=true ORDER BY sort_order, created_at DESC'
    )
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/all', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM hero_images ORDER BY sort_order, created_at DESC'
    )
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/', upload.single('image'), async (req, res) => {
  const { caption } = req.body
  const image_url = req.file ? `/uploads/${req.file.filename}` : null
  if (!image_url) return res.status(400).json({ error: 'Image required' })
  try {
    const { rows } = await pool.query(
      'INSERT INTO hero_images (image_url, caption, active) VALUES ($1, $2, true) RETURNING *',
      [image_url, caption || '']
    )
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.patch('/:id/toggle', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE hero_images SET active = NOT active WHERE id=$1 RETURNING *',
      [req.params.id]
    )
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT image_url FROM hero_images WHERE id=$1', [req.params.id])
    if (rows[0]?.image_url) {
      const filePath = path.join(UPLOADS_DIR, path.basename(rows[0].image_url))
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
    await pool.query('DELETE FROM hero_images WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
