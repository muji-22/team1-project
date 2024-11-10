// pages/cart/index.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useCart } from '@/contexts/CartContext';
import StepOne from '@/components/cart/stepone';
import StepTwo from '@/components/cart/steptwo';
import StepThree from '@/components/cart/stepthree';
import styles from '@/styles/cart.module.css';
import MayFavorite from '@/components/product/mayFavorite';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
  // Auth 相關
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // 購物車相關
  const { fetchCartCount } = useCart();
  const [payment, setPayment] = useState('');
  const [discountPrice, setDiscountPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [stepType, setStepType] = useState(1);
  const [orderName, setOrderName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [cartCouponId, setCartCouponId] = useState(0);
  const [cartProducDtl, setCartProductDtl] = useState([]);
  const [cartOriginDtl, setCartOriginDtl] = useState([]);

  // 檢查是否登入
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [isAuthenticated]);

  // 初始化時獲取購物車數據
  useEffect(() => {
    if (isAuthenticated()) {
      fetchCartCount();
    }
  }, []);

  // 步驟切換處理
  const handleStepChange = (newStep) => {
    setStepType(newStep);
  };

  // 步驟指示器渲染
  const renderStepIndicator = (stepNumber, text) => {
    return (
      <Col className={`${styles.step} ${stepType === stepNumber && styles.nowStep}`}>
        <div className={styles.stepBox}>
          <div className={styles.stepNum}>{stepNumber}</div>
        </div>
        <div className={styles.stepWord}>
          <div className={styles.phoneDNone}>第{stepNumber}步</div>
          <div className={`${styles.phoneDNone} ${styles.stepline}`}></div>
          <span>{text}</span>
        </div>
      </Col>
    );
  };

  return (
    <>
      <Container fluid="xxl">
        <Row className={`d-flex justify-content-center align-items-center ${styles.stepBar}`}>
          {renderStepIndicator(1, '購物車')}
          {renderStepIndicator(2, '填寫資料')}
          {renderStepIndicator(3, '最後確認')}
        </Row>
      </Container>

      <div className="mb-4">
        {stepType === 1 && (
          <StepOne
            setstepType={handleStepChange}
            setDiscountPrice={setDiscountPrice}
            setDiscountAmount={setDiscountAmount}
            setCartCouponId={setCartCouponId}
            setCartProductDtl={setCartProductDtl}
            setCartOriginDtl={setCartOriginDtl}
          />
        )}

        {stepType === 2 && (
          <StepTwo
            setstepType={handleStepChange}
            discountPrice={discountPrice}
            discountAmount={discountAmount}
            setOrderAddress={setOrderAddress}
            setOrderName={setOrderName}
            setOrderPhone={setOrderPhone}
          />
        )}

        {stepType === 3 && (
          <StepThree
            setstepType={handleStepChange}
            discountPrice={discountPrice}
            discountAmount={discountAmount}
            payment={payment}
            orderName={orderName}
            orderAddress={orderAddress}
            orderPhone={orderPhone}
            cartCouponId={cartCouponId}
            cartOriginDtl={cartOriginDtl}
            cartProducDtl={cartProducDtl}
          />
        )}
      </div>

      <Container>
        <Row className="d-flex justify-content-center align-items-center">
          <MayFavorite />
        </Row>
      </Container>
    </>
  );
}