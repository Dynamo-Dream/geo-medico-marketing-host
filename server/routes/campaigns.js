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
    cb(null, `campaign_${Date.now()}${path.extname(file.originalname)}`),
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files allowed'))
  },
})

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM campaigns ORDER BY created_at DESC')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/', upload.single('image'), async (req, res) => {
  const { title, description } = req.body
  const image_url = req.file ? `/uploads/${req.file.filename}` : null
  try {
    const { rows } = await pool.query(
      'INSERT INTO campaigns (title, description, image_url) VALUES ($1, $2, $3) RETURNING *',
      [title, description || '', image_url]
    )
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/:id', upload.single('image'), async (req, res) => {
  const { title, description } = req.body
  const { id } = req.params
  try {
    let q, params
    if (req.file) {
      q = 'UPDATE campaigns SET title=$1, description=$2, image_url=$3, updated_at=NOW() WHERE id=$4 RETURNING *'
      params = [title, description || '', `/uploads/${req.file.filename}`, id]
    } else {
      q = 'UPDATE campaigns SET title=$1, description=$2, updated_at=NOW() WHERE id=$3 RETURNING *'
      params = [title, description || '', id]
    }
    const { rows } = await pool.query(q, params)
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT image_url FROM campaigns WHERE id=$1', [req.params.id])
    if (rows[0]?.image_url) {
      const filePath = path.join(UPLOADS_DIR, path.basename(rows[0].image_url))
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
    await pool.query('DELETE FROM campaigns WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
