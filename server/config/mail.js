// config/mail.js
import nodemailer from 'nodemailer'

// 建立郵件傳輸器
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER, // 你的 Gmail
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail 應用程式密碼
  },
})

export default transporter
