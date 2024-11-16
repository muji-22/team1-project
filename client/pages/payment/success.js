// pages/payment/success.js
import React, { useEffect, useState } from 'react'
import { Container, Card, Button, Table } from 'react-bootstrap'
import { useRouter } from 'next/router'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Swal from 'sweetalert2'
import { CheckCircle } from 'lucide-react'
import styles from '@/styles/payment.module.css'

export default function PaymentSuccess() {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  // 取得訂單詳細資料
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // 直接從 query string 取得 orderId
        const { orderId } = router.query
        if (!orderId) return

        const response = await fetch(`http://localhost:3005/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (!response.ok) throw new Error('訂單載入失敗')

        const data = await response.json()
        setOrderDetails(data)
      } catch (error) {
        console.error('訂單載入錯誤:', error)
        Swal.fire({
          icon: 'error',
          title: '訂單載入失敗',
          text: error.message || '無法取得訂單詳細資料',
          confirmButtonColor: '#40CBCE'
        })
      } finally {
        setLoading(false)
      }
    }

    if (router.isReady) {
      fetchOrderDetails()
    }
  }, [router.isReady, router.query])

  // 下載訂單PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    
    // 設定中文字型
    doc.setFont('helvetica')
    
    // 標題
    doc.setFontSize(20)
    doc.text('訂單明細', 105, 20, { align: 'center' })
    
    // 訂單基本資訊
    doc.setFontSize(12)
    doc.text(`訂單編號：${orderDetails.id}`, 20, 40)
    doc.text(`訂購日期：${new Date(orderDetails.created_at).toLocaleDateString()}`, 20, 50)
    doc.text(`收件人：${orderDetails.recipient_name}`, 20, 60)
    doc.text(`聯絡電話：${orderDetails.recipient_phone}`, 20, 70)
    doc.text(`收件地址：${orderDetails.recipient_address}`, 20, 80)
    
    // 商品明細表格
    const tableData = orderDetails.items.map(item => [
      item.name,
      item.type === 'rental' ? '租借' : '購買',
      item.quantity,
      `NT$ ${item.price.toLocaleString()}`,
      `NT$ ${(item.price * item.quantity).toLocaleString()}`
    ])

    doc.autoTable({
      startY: 90,
      head: [['商品名稱', '類型', '數量', '單價', '小計']],
      body: tableData,
    })
    
    // 金額總計
    const finalY = doc.previousAutoTable.finalY + 10
    doc.text(`商品總額：NT$ ${orderDetails.total_amount.toLocaleString()}`, 150, finalY)
    doc.text(`優惠折抵：NT$ ${orderDetails.discount_amount.toLocaleString()}`, 150, finalY + 10)
    doc.text(`應付總額：NT$ ${orderDetails.final_amount.toLocaleString()}`, 150, finalY + 20)
    
    // 下載PDF
    doc.save(`order-${orderDetails.id}.pdf`)
  }

  // 完成訂單
  const handleComplete = () => {
    Swal.fire({
      icon: 'success',
      title: '感謝您的購買！',
      text: '期待您再次光臨',
      confirmButtonColor: '#40CBCE'
    }).then(() => {
      router.push('/member/orders')
    })
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    )
  }

  if (!orderDetails) {
    return (
      <Container className="py-5 text-center">
        <h3>找不到訂單資料</h3>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          {/* 成功圖示 */}
          <div className={`${styles.successIcon} mb-4`}>
            <CheckCircle size={60} color="#40CBCE" />
          </div>
          
          <h2 className="mb-4">付款成功！</h2>
          <p className="text-muted mb-4">
            感謝您的購買，您的訂單已確認付款完成
          </p>

          {/* 訂單資訊 */}
          <div className="mb-4">
            <h5 className="mb-3">訂單資訊</h5>
            <Table responsive className="mt-3">
              <tbody>
                <tr>
                  <td className="text-muted">訂單編號</td>
                  <td>{orderDetails.id}</td>
                </tr>
                <tr>
                  <td className="text-muted">訂購日期</td>
                  <td>{new Date(orderDetails.created_at).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="text-muted">收件人</td>
                  <td>{orderDetails.recipient_name}</td>
                </tr>
                <tr>
                  <td className="text-muted">聯絡電話</td>
                  <td>{orderDetails.recipient_phone}</td>
                </tr>
                <tr>
                  <td className="text-muted">收件地址</td>
                  <td>{orderDetails.recipient_address}</td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* 商品明細 */}
          <div className="mb-4">
            <h5 className="mb-3">商品明細</h5>
            <Table responsive>
              <thead>
                <tr>
                  <th>商品名稱</th>
                  <th>類型</th>
                  <th>數量</th>
                  <th>單價</th>
                  <th>小計</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.type === 'rental' ? '租借' : '購買'}</td>
                    <td>{item.quantity}</td>
                    <td>NT$ {item.price.toLocaleString()}</td>
                    <td>NT$ {(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* 金額總計 */}
          <div className="text-end mb-4">
            <p>商品總額：NT$ {orderDetails.total_amount.toLocaleString()}</p>
            <p>優惠折抵：NT$ {orderDetails.discount_amount.toLocaleString()}</p>
            <h5>應付總額：NT$ {orderDetails.final_amount.toLocaleString()}</h5>
          </div>

          {/* 按鈕區 */}
          <div className="d-flex justify-content-center gap-3">
            <Button 
              variant="outline-primary" 
              onClick={handleDownloadPDF}
              className={styles.downloadBtn}
            >
              下載訂單
            </Button>
            <Button 
              variant="custom"
              onClick={handleComplete}
              className={styles.completeBtn}
            >
              完成
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}