// import mysql from 'mysql2'
// import pool from '##/config/db'
// import e from 'express'
// const router = express.Router()
// const db = pool.promise()
// const promisePool = pool.promise()
// // export default async function handler(req, res) {
// //   try {
// //     const [rows] = await article_db.query('SELECT * FROM forum_article ')
// //     res.status(200).json(rows)
// //   } catch (error) {
// //     console.error(error)
// //     res.status(500).json({ message: 'Error fetching data from database' })
// //   }
// // }
// router.get("/",async (req,res)=>{
//   try {
//     const [rows] = await pool.query(`SELECT * FROM forum_article `)
//     console.log('查詢結果:', rows)  // 檢查結果
//     res.json(rows)
// } catch (error) {
//     console.error('錯誤類型:', error.name)
//     console.error('錯誤訊息:', error.message)
//     console.error('SQL語句:', error.sql)
//     res.status(500).json({
//         message: '伺服器錯誤',
//         error: error.message
//     })
// }
// })

import express from 'express'
import pool from '../config/db.js' // Make sure this is the correct import path

const router = express.Router()
const db = pool.promise() // You can use this directly for querying

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM forum_article') // Use db.query with promise pool
    console.log('Query result:', rows) // Debugging: Log the result

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
