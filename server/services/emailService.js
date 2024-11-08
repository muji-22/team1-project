// services/emailService.js
import transporter from '../config/mail.js'

export const sendWelcomeEmail = async (email) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: '歡迎訂閱我們的電子報！',
      html: `
        <div style="padding: 20px; background-color: #f8f9fa;">
          <h2 style="color: #333;">感謝您訂閱我們的電子報！</h2>
          <p>親愛的訂閱者：</p>
          <p>感謝您訂閱我們的電子報。我們將定期為您提供：</p>
          <ul>
            <li>最新商品資訊</li>
            <li>限時特惠活動</li>
            <li>獨家優惠碼</li>
            <li>遊戲相關新聞</li>
          </ul>
          <p>祝您購物愉快！</p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            如果您想取消訂閱，請點擊 
            <a href="http://localhost:3000/unsubscribe?email=${email}">這裡</a>
          </p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('歡迎郵件發送成功')
  } catch (error) {
    console.error('發送歡迎郵件失敗:', error)
    throw error
  }
}

export const sendNewsletterEmail = async (email, subject, content) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      html: content
    }

    await transporter.sendMail(mailOptions)
    console.log('電子報發送成功')
  } catch (error) {
    console.error('發送電子報失敗:', error)
    throw error
  }
}