// pages/cart/index.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useCart } from "@/contexts/CartContext";
import StepOne from "@/components/cart/Stepone";
import StepTwo from "@/components/cart/steptwo";
import StepThree from "@/components/cart/Stepthree";
import styles from "@/styles/cart.module.css";
import MayFavorite from "@/components/product/mayFavorite";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function CartPage() {
  // Auth 相關
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { fetchCartCount } = useCart();

  // 購物車狀態管理
  const [currentStep, setCurrentStep] = useState(1);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [cartCouponId, setCartCouponId] = useState(null);
  const [cartProductDtl, setCartProductDtl] = useState([]);
  const [cartOriginDtl, setCartOriginDtl] = useState([]);

  // 訂單資訊
  const [orderInfo, setOrderInfo] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    note: "",
    payment: "credit_card",
  });

  // 檢查登入狀態
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("請先登入");
      router.push("/auth/login");
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
      console.error("購物車初始化失敗:", error);
      toast.error("購物車載入失敗，請重試");
    }
  };

  // 步驟控制
  const handleStepChange = (step) => {
    // 驗證步驟切換條件
    if (step > currentStep && !validateStep(currentStep)) {
      return;
    }
    setCurrentStep(step);
    // 切換步驟時滾動到頁面頂部
    window.scrollTo(0, 0);
  };

  // 步驟驗證
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (cartOriginDtl.length === 0) {
          toast.warning("購物車是空的");
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

  // 更新訂單資訊
  const updateOrderInfo = (info) => {
    setOrderInfo((prev) => ({
      ...prev,
      ...info,
    }));
  };

  // 渲染步驟指示器
  const renderStepIndicator = (number, text) => (
    <Col
      className={`${styles.step}  ${
        currentStep === number ? styles.nowStep : ""
      }`}
    >
      <div className={`${styles.stepBox}`}>
        <div className={styles.stepNum}>{number}</div>
      </div>
      <div className={styles.stepWord}>
        <div className="">第{number}步</div>
        <div className= {styles.stepline}></div>
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
            setDiscountPrice={setDiscountPrice}
            setDiscountAmount={setDiscountAmount}
            setCartCouponId={setCartCouponId}
            setCartProductDtl={setCartProductDtl}
            setCartOriginDtl={setCartOriginDtl}
          />
        );
      case 2:
        return (
          <StepTwo
            setstepType={handleStepChange}
            discountPrice={discountPrice}
            discountAmount={discountAmount}
            setOrderName={(value) => updateOrderInfo({ name: value })}
            setOrderPhone={(value) => updateOrderInfo({ phone: value })}
            setOrderAddress={(value) => updateOrderInfo({ address: value })}
          />
        );
      case 3:
        return (
          <StepThree
            setstepType={handleStepChange}
            discountPrice={discountPrice}
            discountAmount={discountAmount}
            orderName={orderInfo.name}
            orderPhone={orderInfo.phone}
            orderAddress={orderInfo.address}
            cartCouponId={cartCouponId}
            cartOriginDtl={cartOriginDtl}
            cartProducDtl={cartProductDtl}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className={`${styles.stepImg} d-flex justify-content-center align-items-center`} >
        <Container fluid="xxl">
          <Row
            className={`d-flex justify-content-center align-items-center ${styles.stepBar}`}
          >
            {renderStepIndicator(1, "購物車")}
            {renderStepIndicator(2, "填寫資料")}
            {renderStepIndicator(3, "最後確認")}
          </Row>
        </Container>
      </div>
      
      
      <div className={`mb-4 mt-3`}>{renderStepContent()}</div>
    </>
  );
}
