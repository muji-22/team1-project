// components/cart/StepThree.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-toastify';
import styles from '@/styles/cart.module.css';

const StepThree = ({
  setstepType,
  discountPrice,
  discountAmount,
  orderName,
  orderPhone,
  orderAddress,
  cartCouponId,
  cartOriginDtl,
  cartProducDtl
}) => {
  const router = useRouter();
  const { fetchCartCount } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card'); // 'credit_card' or 'transfer'

  // 確認訂單
  const handleConfirmOrder = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      // 準備訂單數據
      const orderData = {
        recipient_name: orderName,
        recipient_phone: orderPhone,
        recipient_address: orderAddress,
        total_amount: discountPrice + discountAmount,
        discount_amount: discountAmount,
        final_amount: discountPrice,
        coupon_id: cartCouponId,
        payment_method: paymentMethod,
        items: cartProducDtl.map(item => ({
          product_id: item.product_id,
          type: item.type,
          quantity: item.quantity,
          price: item.type === 'rental' ? item.rental_fee : item.price,
          ...(item.type === 'rental' && {
            deposit: item.deposit,
            rental_start_date: item.rental_start_date,
            rental_end_date: item.rental_end_date
          })
        }))
      };

      // 送出訂單
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '建立訂單失敗');
      }

      // 清空購物車
      await fetch('http://localhost:3005/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // 更新購物車數量
      await fetchCartCount();

      // 顯示成功訊息
      toast.success('訂單建立成功！');

      // 導向訂單詳情頁
      router.push(`/orders/${data.orderId}`);

    } catch (error) {
      console.error('建立訂單錯誤:', error);
      toast.error(error.message || '建立訂單失敗，請稍後再試');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {/* 訂單資訊確認 */}
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-4">訂單資訊確認</h5>

              {/* 收件資訊 */}
              <div className="mb-4">
                <h6 className="text-muted mb-3">收件資訊</h6>
                <p className="mb-1">收件人：{orderName}</p>
                <p className="mb-1">聯絡電話：{orderPhone}</p>
                <p className="mb-0">收件地址：{orderAddress}</p>
              </div>

              <hr />

              {/* 商品清單 */}
              <div className="mb-4">
                <h6 className="text-muted mb-3">商品清單</h6>
                {cartOriginDtl.map((item, index) => (
                  <div key={index} className="d-flex align-items-center mb-3">
                    <img
                      src={`http://localhost:3005/productImages/${item.product_id}/${item.product_id}-1.jpg`}
                      alt={item.name}
                      className="rounded"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = "http://localhost:3005/productImages/default-product.png"
                      }}
                    />
                    <div className="ms-3 flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-1">{item.name}</h6>
                        <span className="text-muted">x{item.quantity}</span>
                      </div>
                      <p className="mb-0 text-muted">
                        {item.type === 'rental' 
                          ? `租金：NT$ ${item.rental_fee.toLocaleString()} /天`
                          : `NT$ ${item.price.toLocaleString()}`
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <hr />

              {/* 付款方式選擇 */}
              <div className="mb-4">
                <h6 className="text-muted mb-3">付款方式</h6>
                <Form>
                  <Form.Check
                    type="radio"
                    id="credit_card"
                    name="payment_method"
                    label="信用卡付款"
                    checked={paymentMethod === 'credit_card'}
                    onChange={() => setPaymentMethod('credit_card')}
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    id="transfer"
                    name="payment_method"
                    label="銀行轉帳"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                  />
                </Form>
              </div>

              {/* 金額摘要 */}
              <div className="bg-light p-3 rounded">
                <div className="d-flex justify-content-between mb-2">
                  <span>商品總金額</span>
                  <span>NT$ {(discountPrice + discountAmount).toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-danger">
                    <span>優惠折抵</span>
                    <span>-NT$ {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold">
                  <span>應付金額</span>
                  <span className="text-primary">NT$ {discountPrice.toLocaleString()}</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* 按鈕區 */}
          <div className="d-flex justify-content-between gap-3 mb-5">
            <Button
              variant="outline-secondary"
              onClick={() => setstepType(2)}
              className="px-4"
              disabled={isProcessing}
            >
              返回修改
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmOrder}
              className="px-4"
              disabled={isProcessing}
            >
              {isProcessing ? '處理中...' : '確認下單'}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StepThree;