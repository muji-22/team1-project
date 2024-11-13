// components/cart/StepTwo.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/cart.module.css';

const StepTwo = ({
  setstepType,
  discountPrice,
  discountAmount,
  setOrderName,
  setOrderPhone,
  setOrderAddress,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });
  const [validated, setValidated] = useState(false);

  // 載入用戶資料
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [user]);

  // 表單提交處理
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // 更新訂單資訊
    setOrderName(formData.name);
    setOrderPhone(formData.phone);
    setOrderAddress(formData.address);

    // 前往下一步
    setstepType(3);
  };

  // 表單欄位變更處理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="border rounded p-4 bg-white shadow-sm">
            <h4 className="mb-4">填寫收件資料</h4>
            
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {/* 姓名 */}
              <Form.Group className="mb-3">
                <Form.Label>姓名</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="請輸入收件人姓名"
                />
                <Form.Control.Feedback type="invalid">
                  請輸入姓名
                </Form.Control.Feedback>
              </Form.Group>

              {/* 電話 */}
              <Form.Group className="mb-3">
                <Form.Label>聯絡電話</Form.Label>
                <Form.Control
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="請輸入聯絡電話"
                  pattern="[0-9]{10}"
                />
                <Form.Control.Feedback type="invalid">
                  請輸入有效的電話號碼（10碼）
                </Form.Control.Feedback>
              </Form.Group>

              {/* 地址 */}
              <Form.Group className="mb-3">
                <Form.Label>收件地址</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="請輸入完整收件地址"
                />
                <Form.Control.Feedback type="invalid">
                  請輸入收件地址
                </Form.Control.Feedback>
              </Form.Group>

              {/* 備註 */}
              <Form.Group className="mb-4">
                <Form.Label>訂單備註</Form.Label>
                <Form.Control
                  as="textarea"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="有什麼想告訴我們的嗎？"
                  rows={3}
                />
              </Form.Group>

              {/* 按鈕區 */}
              <div className="d-flex justify-content-between gap-3">
                <Button
                  variant="outline-secondary"
                  onClick={() => setstepType(1)}
                  className="px-4"
                >
                  返回購物車
                </Button>
                <Button 
                  variant="custom" 
                  type="submit"
                  className="px-4"
                >
                  下一步
                </Button>
              </div>
            </Form>
          </div>

          {/* 金額摘要 */}
          <div className="mt-4 p-3 border rounded bg-light">
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
        </Col>
      </Row>
    </Container>
  );
};

export default StepTwo;