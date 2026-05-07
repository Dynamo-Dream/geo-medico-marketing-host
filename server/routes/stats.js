import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM stats ORDER BY sort_order')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/:id', async (req, res) => {
  const { value, label, icon } = req.body
  try {
    const { rows } = await pool.query(
      'UPDATE stats SET value=$1, label=$2, icon=$3 WHERE id=$4 RETURNING *',
      [value, label, icon, req.params.id]
    )
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
