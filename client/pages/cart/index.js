import React, { useState, useEffect, useContext, createContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { CartProvider } from '@/hooks/use_cart.js'

import StepOne from '@/components/cart/stepone';
import StepTwo from '@/components/cart/steptwo';
import StepThree from '@/components/cart/stepthree';
import styles from '@/styles/cart.module.css';
import MayFavorite from '@/components/product/mayFavorite';
import AddProduct from '@/components/cart/addProduct'; 


export default function index() {

  const [cartList, setCartList] = useState([])



  
  

  const [ payment, setPayment ] = useState(' ')

  const [discountPrice, setDiscountPrice] = useState(0)

  const [discountAmount, setDiscountAmount] = useState(0)

  const [stepType, setStepType] = useState(1)

  const [orderName , setOrderName] = useState('')

  const [orderPhone , setOrderPhone] = useState('')

  const [orderAddress , setOrderAddress] = useState('')

  const [cartCouponId, setCartCouponId] = useState(0)

  const [cartProducDtl, setCartProductDtl] = useState([])

  const [cartOriginDtl, setCartOriginDtl] = useState([])


  const handleStepChange = (newStep) => {
    setStepType(newStep);
  };


  return (
    <>
      <Container fluid= {"xxl"}>

        <Row className={`d-flex justify-content-center align-items-center ${styles.stepBar}`}>
          <Col className={`${styles.step} ${stepType === 1 && styles.nowStep}`}>
          <div className={styles.stepBox}>
            <div className={styles.stepNum}>1</div>
          </div>
          <div className={styles.stepWord}>
            <div className={styles.phoneDNone}>第一步</div>
            <div className={`${styles.phoneDNone} ${styles.stepline}`}></div>
            <span>購物車</span>
          </div>
          </Col>
          <Col className={`${styles.step} ${stepType === 2 && styles.nowStep}`}>
          <div className={styles.stepBox}>
            <div className={styles.stepNum}>2</div>
          </div>
          <div className={styles.stepWord}>
            <div className={styles.phoneDNone}>第二步</div>
            <div className={`${styles.phoneDNone} ${styles.stepline}`} ></div>
            <span>填寫資料</span>
          </div>
          </Col>
          <Col className={`${styles.step} ${stepType === 3 && styles.nowStep}`}>
          <div className={styles.stepBox}>
            <div className={styles.stepNum}>3</div>
          </div>
          <div className={styles.stepWord}>
            <div className={styles.phoneDNone}>第三步</div>
            <div className={`${styles.phoneDNone} ${styles.stepline}`}></div>
            <span>最後確認</span>
          </div>
          </Col>
        </Row>
      </Container>
      <CartProvider cartList={cartList}>

        {stepType === 1 && 
        <StepOne 
        setstepType={handleStepChange} 
        setDiscountPrice={setDiscountPrice} 
        setDiscountAmount={setDiscountAmount} 
        setCartCouponId={setCartCouponId}
        setCartProductDtl={setCartProductDtl}
        setCartOriginDtl={setCartOriginDtl}
        />}
        {/* {stepType === 2 &&
        <StepTwo
        setstepType={handleStepChange} 
        discountPrice={discountPrice} 
        discountAmount={discountAmount}
        setOrderAddress={setOrderAddress}
        setOrderName={setOrderName}
        setOrderPhone={setOrderPhone}   
        />}
        {stepType === 3 && 
        <StepFour 
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
        } */}

      </CartProvider>
      <Container>
        <Row className={`d-flex justify-content-center align-items-center`}>
          <MayFavorite/>
        </Row>
      </Container>
    </>
  )
}
