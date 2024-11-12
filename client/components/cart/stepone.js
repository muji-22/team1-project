// components/cart/StepOne.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useCart } from '@/contexts/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { toast } from 'react-toastify';

const StepOne = ({ 
  setstepType,
  setDiscountPrice,
  setDiscountAmount,
  setCartCouponId,
  setCartProductDtl,
  setCartOriginDtl
}) => {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // 獲取購物車數據
  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('獲取購物車數據失敗');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setCartItems(data.data.items || []);
        
        // 計算總金額 - 考慮購買和租借的不同價格計算方式
        const total = data.data.items.reduce((sum, item) => {
          const price = item.type === 'rental' ? item.rental_fee : item.price;
          return sum + (price * item.quantity);
        }, 0);
        
        setTotalAmount(total);
        
        // 更新原始數據
        setCartOriginDtl(data.data.items || []);
        setCartProductDtl(data.data.items || []);
      }
    } catch (error) {
      console.error('獲取購物車數據失敗:', error);
      toast.error('獲取購物車數據失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // 載入中畫面
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <Row>
        <Col lg={8}>
          {/* 購買商品列表 */}
          {cartItems.filter(item => item.type === 'sale').length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3">購買商品</h5>
              {cartItems
                .filter(item => item.type === 'sale')
                .map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdate={fetchCartData}
                  />
                ))
              }
            </div>
          )}

          {/* 租借商品列表 */}
          {cartItems.filter(item => item.type === 'rental').length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3">租借商品</h5>
              {cartItems
                .filter(item => item.type === 'rental')
                .map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdate={fetchCartData}
                  />
                ))
              }
            </div>
          )}

          {/* 空購物車提示 */}
          {cartItems.length === 0 && (
            <div className="text-center py-5">
              <h4>購物車是空的</h4>
            </div>
          )}
        </Col>

        <Col lg={4}>
          <CartSummary
            total={totalAmount}
            setDiscountPrice={setDiscountPrice}
            setDiscountAmount={setDiscountAmount}
            setCartCouponId={setCartCouponId}
            onNextStep={() => {
              if (cartItems.length > 0) {
                setstepType(2);
              } else {
                toast.warning('購物車是空的');
              }
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default StepOne;