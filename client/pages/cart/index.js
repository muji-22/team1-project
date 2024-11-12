// pages/cart/index.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useCart } from '@/contexts/CartContext';
import StepOne from '@/components/cart/Stepone';
import StepTwo from '@/components/cart/steptwo';
import StepThree from '@/components/cart/Stepthree';
import styles from '@/styles/cart.module.css';
import MayFavorite from '@/components/product/mayFavorite';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

export default function CartPage() {
  // Auth 相關
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { fetchCartCount } = useCart();

  // 購物車狀態管理
  const [currentStep, setCurrentStep] = useState(1);
  const [cartData, setCartData] = useState({
    products: [],
    originalProducts: [],
    totalAmount: 0,
    discount: {
      price: 0,
      amount: 0,
      couponId: null
    }
  });

  // 訂單資訊
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    phone: '',
    address: '',
    payment: ''
  });

  // 檢查登入狀態
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('請先登入');
      router.push('/auth/login');
      return;
    }
    
    // 初始化購物車
    initializeCart();
  }, [isAuthenticated]);

  // 初始化購物車
  const initializeCart = async () => {
    try {
      await fetchCartCount();
    } catch (error) {
      console.error('購物車初始化失敗:', error);
      toast.error('購物車載入失敗，請重試');
    }
  };

  // 步驟控制
  const handleStepChange = (step) => {
    // 驗證步驟切換條件
    if (step > currentStep && !validateStep(currentStep)) {
      return;
    }
    setCurrentStep(step);
  };

  // 步驟驗證
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (cartData.products.length === 0) {
          toast.warning('購物車是空的');
          return false;
        }
        return true;
      case 2:
        // 驗證訂單基本資料
        return true;
      default:
        return true;
    }
  };

  // 更新購物車資料
  const updateCartData = (newData) => {
    setCartData(prev => ({
      ...prev,
      ...newData
    }));
  };

  // 更新訂單資訊
  const updateOrderInfo = (info) => {
    setOrderInfo(prev => ({
      ...prev,
      ...info
    }));
  };

  // 渲染步驟指示器
  const renderStepIndicator = (number, text) => (
    <Col className={`${styles.step} ${currentStep === number ? styles.nowStep : ''}`}>
      <div className={styles.stepBox}>
        <div className={styles.stepNum}>{number}</div>
      </div>
      <div className={styles.stepWord}>
        <div className={styles.phoneDNone}>第{number}步</div>
        <div className={`${styles.phoneDNone} ${styles.stepline}`}></div>
        <span>{text}</span>
      </div>
    </Col>
  );

  // 渲染當前步驟內容
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            setstepType={handleStepChange}
            cartData={cartData}
            updateCartData={updateCartData}
          />
        );
      case 2:
        return (
          <StepTwo
            setstepType={handleStepChange}
            orderInfo={orderInfo}
            updateOrderInfo={updateOrderInfo}
            cartData={cartData}
          />
        );
      case 3:
        return (
          <StepThree
            setstepType={handleStepChange}
            orderInfo={orderInfo}
            cartData={cartData}
          />
        );
      default:
        return null;
    }
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
        {renderStepContent()}
      </div>

      <Container>
        <Row className="d-flex justify-content-center align-items-center">
          <MayFavorite />
        </Row>
      </Container>
    </>
  );
}