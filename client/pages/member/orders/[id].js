// pages/member/orders/[id].js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Breadcrumb from '@/components/Breadcrumb';
import { toast } from 'react-toastify';

// 訂單狀態對照表
const ORDER_STATUS = {
  1: { label: '處理中', variant: 'info' },
  2: { label: '已出貨', variant: 'primary' },
  3: { label: '已完成', variant: 'success' },
  '-1': { label: '已取消', variant: 'danger' }
};

// 付款狀態對照表
const PAYMENT_STATUS = {
  0: { label: '未付款', variant: 'warning' },
  1: { label: '已付款', variant: 'success' }
};

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 獲取訂單詳情
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!id) return;
      if (!isAuthenticated()) {
        router.push('/auth/login');
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3005/api/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || '獲取訂單詳情失敗');
        }

        setOrder(data.data);
      } catch (error) {
        console.error('獲取訂單詳情錯誤:', error);
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id, isAuthenticated]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error || '找不到訂單資料'}
      </div>
    );
  }

  return (
    <Container className="py-4">
      {/* 麵包屑 */}
      <Breadcrumb
        items={[
          { label: '首頁', href: '/' },
          { label: '會員中心', href: '/member' },
          { label: '訂單紀錄', href: '/member/orders' },
          { label: `訂單編號：${order.id}`, active: true },
        ]}
      />

      <h2 className="mb-4">訂單詳情</h2>

      {/* 訂單狀態卡片 */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col sm={6} md={3} className="mb-3">
              <div className="small text-muted">訂單編號</div>
              <div>{order.id}</div>
            </Col>
            <Col sm={6} md={3} className="mb-3">
              <div className="small text-muted">訂單日期</div>
              <div>{new Date(order.created_at).toLocaleDateString()}</div>
            </Col>
            <Col sm={6} md={3} className="mb-3">
              <div className="small text-muted">訂單狀態</div>
              <div>
                <Badge bg={ORDER_STATUS[order.order_status].variant}>
                  {ORDER_STATUS[order.order_status].label}
                </Badge>
              </div>
            </Col>
            <Col sm={6} md={3} className="mb-3">
              <div className="small text-muted">付款狀態</div>
              <div>
                <Badge bg={PAYMENT_STATUS[order.payment_status].variant}>
                  {PAYMENT_STATUS[order.payment_status].label}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 收件資訊卡片 */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-4">收件資訊</h5>
          <Row>
            <Col md={4} className="mb-3">
              <div className="small text-muted">收件人</div>
              <div>{order.recipient_name}</div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="small text-muted">聯絡電話</div>
              <div>{order.recipient_phone}</div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="small text-muted">付款方式</div>
              <div>
                {order.payment_method === 'credit_card' ? '信用卡' : '銀行轉帳'}
              </div>
            </Col>
            <Col xs={12}>
              <div className="small text-muted">收件地址</div>
              <div>{order.recipient_address}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 商品清單卡片 */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-4">商品清單</h5>
          
          {/* 一般商品 */}
          {order.items.filter(item => item.type === 'sale').length > 0 && (
            <div className="mb-4">
              <h6 className="text-muted mb-3">購買商品</h6>
              {order.items
                .filter(item => item.type === 'sale')
                .map((item, index) => (
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
                        NT$ {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {/* 租借商品 */}
          {order.items.filter(item => item.type === 'rental').length > 0 && (
            <div className="mb-4">
              <h6 className="text-muted mb-3">租借商品</h6>
              {order.items
                .filter(item => item.type === 'rental')
                .map((item, index) => (
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
                        租期：{item.rental_days}天<br />
                        租金：NT$ {item.price.toLocaleString()} /天<br />
                        押金：NT$ {item.deposit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          <hr />

          {/* 金額摘要 */}
          <div className="ms-auto" style={{ maxWidth: '300px' }}>
            <div className="d-flex justify-content-between mb-2">
              <span>商品總金額</span>
              <span>NT$ {order.total_amount.toLocaleString()}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-danger">
                <span>優惠折抵</span>
                <span>-NT$ {order.discount_amount.toLocaleString()}</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="d-flex justify-content-between fw-bold">
              <span>應付總額</span>
              <span className="text-primary">
                NT$ {order.final_amount.toLocaleString()}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}