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

// services/emailService.js
// 在原有的檔案中新增以下函數

export const sendOrderConfirmationEmail = async (email, orderData) => {
  try {
    // 格式化訂單商品列表
    const formatItems = (items) => {
      return items.map(item => {
        if (item.type === 'rental') {
          return `
            <tr>
              <td>${item.name}</td>
              <td>租借 (${item.rental_days}天)</td>
              <td>${item.quantity}</td>
              <td>NT$ ${item.price}/天</td>
              <td>NT$ ${item.deposit} (押金)</td>
            </tr>
          `;
        } else {
          return `
            <tr>
              <td>${item.name}</td>
              <td>購買</td>
              <td>${item.quantity}</td>
              <td>NT$ ${item.price}</td>
              <td>NT$ ${item.price * item.quantity}</td>
            </tr>
          `;
        }
      }).join('');
    };

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `訂單確認通知 #${orderData.id}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">訂單確認通知</h2>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #198754; margin-top: 0;">親愛的 ${orderData.recipient_name} 您好：</h3>
            <p>感謝您的訂購！您的訂單已經成功建立，以下是您的訂單詳情：</p>
          </div>

          <div style="margin: 20px 0;">
            <h4 style="color: #666;">訂單資訊</h4>
            <table style="width: 100%; margin-bottom: 10px;">
              <tr>
                <td style="padding: 5px 0;">訂單編號：</td>
                <td>#${orderData.id}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">訂購日期：</td>
                <td>${new Date(orderData.created_at).toLocaleDateString()}</td>
              </tr>
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h4 style="color: #666;">收件資訊</h4>
            <table style="width: 100%; margin-bottom: 10px;">
              <tr>
                <td style="padding: 5px 0;">收件人：</td>
                <td>${orderData.recipient_name}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">聯絡電話：</td>
                <td>${orderData.recipient_phone}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">收件地址：</td>
                <td>${orderData.recipient_address}</td>
              </tr>
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h4 style="color: #666;">商品明細</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">商品名稱</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">類型</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">數量</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">單價</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">小計</th>
                </tr>
              </thead>
              <tbody>
                ${formatItems(orderData.items)}
              </tbody>
            </table>
          </div>

          <div style="margin: 20px 0; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 5px 0;">商品總金額：</td>
                <td style="text-align: right;">NT$ ${orderData.total_amount}</td>
              </tr>
              ${orderData.discount_amount > 0 ? `
                <tr style="color: #dc3545;">
                  <td style="padding: 5px 0;">優惠折抵：</td>
                  <td style="text-align: right;">-NT$ ${orderData.discount_amount}</td>
                </tr>
              ` : ''}
              <tr style="font-weight: bold; color: #0d6efd;">
                <td style="padding: 5px 0;">應付金額：</td>
                <td style="text-align: right;">NT$ ${orderData.final_amount}</td>
              </tr>
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h4 style="color: #666;">付款資訊</h4>
            <p>付款方式：${orderData.payment_method === 'credit_card' ? '信用卡' : '銀行轉帳'}</p>
            ${orderData.payment_method === 'transfer' ? `
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px;">
                <p style="margin: 0; color: #856404;">請於 24 小時內完成轉帳，轉帳資訊如下：</p>
                <p style="margin: 10px 0;">銀行代碼：808<br>
                帳號：123456789<br>
                戶名：XXXXXXXX</p>
              </div>
            ` : ''}
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d;">
            <p>如有任何問題，請聯繫我們的客服：<br>
            電話：(02)1234-5678<br>
            Email：service@example.com</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('訂單確認信發送成功');
  } catch (error) {
    console.error('發送訂單確認信失敗:', error);
    throw error;
  }
};