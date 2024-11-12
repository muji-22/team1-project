import express from 'express'
import pool from '../config/db.js' // Make sure this is the correct import path

const router = express.Router()
const db = pool 

router.get('/test', async (req, res) => {
  res.json({ message: 'testing' })
})

router.get('/', async (req, res) => {
  // console.log('GETING....')
  try {
    const [rows] = await db.query('SELECT * FROM forum_article') 
   // console.log('Query result:', rows) // 檢查資料

    res.json(rows) // Send data back to the client as JSON
  } catch (error) {
    console.error('Error type:', error.name)
    console.error('Error message:', error.message)
    console.error('SQL query that caused the error:', error.sql)

    // Send a user-friendly error message without exposing internal details
    res.status(500).json({
      message: 'An error occurred while fetching the articles.',
      error: error.message, // Optional: Expose only the error message to the client
    })
  }
})



export default router
