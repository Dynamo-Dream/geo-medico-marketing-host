import { Router } from 'express'
import nodemailer from 'nodemailer'
import pool from '../db.js'

const router = Router()

// ── Get contact info ──────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM contact_info LIMIT 1')
    res.json(rows[0] || null)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Update contact info ───────────────────────────────────────────────────────
router.put('/', async (req, res) => {
  const { email, phone, address, working_hours, map_url } = req.body
  try {
    const existing = await pool.query('SELECT id FROM contact_info LIMIT 1')
    let rows
    if (existing.rows.length > 0) {
      ;({ rows } = await pool.query(
        'UPDATE contact_info SET email=$1,phone=$2,address=$3,working_hours=$4,map_url=$5,updated_at=NOW() WHERE id=$6 RETURNING *',
        [email||'', phone||'', address||'', working_hours||'', map_url||'', existing.rows[0].id]
      ))
    } else {
      ;({ rows } = await pool.query(
        'INSERT INTO contact_info (email,phone,address,working_hours,map_url) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [email||'', phone||'', address||'', working_hours||'', map_url||'']
      ))
    }
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Submit contact form ───────────────────────────────────────────────────────
router.post('/submit', async (req, res) => {
  const { name, email, phone, comment } = req.body
  if (!name || !email || !comment) return res.status(400).json({ error: 'Name, email and comment required' })

  try {
    // Save to DB
    await pool.query(
      'INSERT INTO contact_submissions (name, email, phone, comment) VALUES ($1,$2,$3,$4)',
      [name, email, phone||'', comment]
    )

    // Load SMTP settings + destination email
    const { rows: settings } = await pool.query('SELECT key, value FROM site_settings')
    const cfg = {}
    settings.forEach(r => { cfg[r.key] = r.value })

    const { rows: contactRows } = await pool.query('SELECT email FROM contact_info LIMIT 1')
    const toEmail = contactRows[0]?.email

    if (toEmail && cfg.smtp_host && cfg.smtp_user && cfg.smtp_pass) {
      try {
        const transporter = nodemailer.createTransport({
          host: cfg.smtp_host,
          port: parseInt(cfg.smtp_port || '587'),
          secure: cfg.smtp_port === '465',
          auth: { user: cfg.smtp_user, pass: cfg.smtp_pass },
        })
        await transporter.sendMail({
          from: `"${cfg.smtp_from || 'GeoMedico Contact'}" <${cfg.smtp_user}>`,
          to: toEmail,
          subject: `New Contact Query from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <p>${comment.replace(/\n/g, '<br>')}</p>
            <hr>
            <small>Sent from GeoMedico Contact Form</small>
          `,
        })
      } catch (mailErr) {
        console.warn('Email send failed:', mailErr.message)
      }
    }

    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Get all submissions (admin) ───────────────────────────────────────────────
router.get('/submissions', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/submissions/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM contact_submissions WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
