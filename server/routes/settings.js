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
    cb(null, `logo_${Date.now()}${path.extname(file.originalname)}`),
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ok = ['image/png','image/jpeg','image/jpg','image/svg+xml','image/webp']
    ok.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only PNG, SVG, JPG allowed'))
  },
})

const upsert = (key, value) =>
  pool.query(
    `INSERT INTO site_settings(key,value) VALUES($1,$2)
     ON CONFLICT(key) DO UPDATE SET value=$2, updated_at=NOW()`,
    [key, value]
  )

const router = Router()

// GET all settings as { key: value }
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT key, value FROM site_settings')
    const settings = {}
    rows.forEach(r => { settings[r.key] = r.value })
    res.json(settings)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// PUT text settings (social links etc.)
router.put('/', async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await upsert(key, value)
    }
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// POST logo upload
router.post('/logo', upload.single('logo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  try {
    const logo_url = `/uploads/${req.file.filename}`
    await upsert('logo_url', logo_url)
    res.json({ logo_url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// POST story image upload
router.post('/story-image', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  try {
    const story_image_url = `/uploads/${req.file.filename}`
    await upsert('story_image_url', story_image_url)
    res.json({ story_image_url })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// DELETE story image
router.delete('/story-image', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT value FROM site_settings WHERE key='story_image_url'`)
    if (rows[0]?.value) {
      const filePath = path.join(UPLOADS_DIR, path.basename(rows[0].value))
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
    await pool.query(`DELETE FROM site_settings WHERE key='story_image_url'`)
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// DELETE logo
router.delete('/logo', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT value FROM site_settings WHERE key='logo_url'`)
    if (rows[0]?.value) {
      const filePath = path.join(UPLOADS_DIR, path.basename(rows[0].value))
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
    await pool.query(`DELETE FROM site_settings WHERE key='logo_url'`)
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
