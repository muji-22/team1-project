import React, { useState, useEffect, useContext, createContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import StepOne from '@/components/cart/stepone';
import StepTwo from '@/components/cart/steptwo';
import StepThree from '@/components/cart/stepthree';
import styles from '@/styles/cart.module.css';
import AddCartProduct from '@/components/cart/addProduct';

export default function index() {



  const [cartList, setCartList] = useState([])




  return (
    <>
      <Container fluid= {"xxl"}>

        <Row className={`d-flex justify-content-center align-items-center ${styles.stepBar}`}>
          <Col className={styles.step}>
          <div className={styles.stepBox}>
            <div className={styles.stepNum}>1</div>
          </div>
          <div className={styles.stepWord}>
            <div className={styles.phoneDNone}>第一步</div>
            <div className={`${styles.phoneDNone} ${styles.stepline}`}></div>
            <span>購物車</span>
          </div>
          </Col>
          <Col className={styles.step}>
          <div className={styles.stepBox}>
            <div className={styles.stepNum}>2</div>
          </div>
          <div className={styles.stepWord}>
            <div className={styles.phoneDNone}>第二步</div>
            <div className={`${styles.phoneDNone} ${styles.stepline}`} ></div>
            <span>填寫資料</span>
          </div>
          </Col>
          <Col className={styles.step}>
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
    </>
  )
}
