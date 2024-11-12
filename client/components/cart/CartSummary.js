// components/cart/CartSummary.js
import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import styles from '@/styles/cart.module.css';

const CartSummary = ({
  total,
  setDiscountPrice,
  setDiscountAmount,
  setCartCouponId,
  onNextStep
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // 套用優惠券
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warning('請輸入優惠券代碼');
      return;
    }

    setIsApplying(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3005/api/coupons/detail/${couponCode}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '優惠券驗證失敗');
      }

      if (data.valid && new Date(data.end_date) >= new Date()) {
        setAppliedCoupon(data);
        setCartCouponId(data.id);

        // 計算折扣金額
        let discountAmount;
        if (data.type === 'percentage') {
          discountAmount = Math.round(total * (data.discount / 100));
        } else {
          discountAmount = Math.min(data.discount, total); // 固定金額不超過總金額
        }

        setDiscountAmount(discountAmount);
        setDiscountPrice(total - discountAmount);
        toast.success('優惠券套用成功！');
      } else {
        toast.error('優惠券已失效或過期');
      }
    } catch (error) {
      console.error('套用優惠券錯誤:', error);
      toast.error(error.message || '套用優惠券失敗');
    } finally {
      setIsApplying(false);
    }
  };

  // 移除優惠券
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCartCouponId(null);
    setDiscountAmount(0);
    setDiscountPrice(total);
    setCouponCode('');
    toast.success('已移除優惠券');
  };

  // 檢查是否可以進行結帳
  const handleNextStep = () => {
    if (total <= 0) {
      toast.warning('購物車是空的');
      return;
    }
    onNextStep();
  };

  return (
    <Card className={`${styles.summaryCard} shadow-sm`}>
      <Card.Body>
        <h5 className="mb-4">訂單摘要</h5>

        {/* 優惠券輸入區 */}
        <div className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label>優惠券代碼</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="請輸入優惠券代碼"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={appliedCoupon || isApplying}
              />
              <Button
                variant={appliedCoupon ? "outline-danger" : "outline-primary"}
                onClick={appliedCoupon ? handleRemoveCoupon : handleApplyCoupon}
                disabled={isApplying}
                style={{ width: '80px' }}
              >
                {isApplying ? '處理中...' : appliedCoupon ? '移除' : '套用'}
              </Button>
            </div>
          </Form.Group>
        </div>

        {/* 價格明細 */}
        <div className={styles.priceDetails}>
          <div className="d-flex justify-content-between mb-2">
            <span>商品總金額</span>
            <span className="fw-bold">NT$ {total.toLocaleString()}</span>
          </div>

          {appliedCoupon && (
            <div className="d-flex justify-content-between mb-2 text-danger">
              <span>優惠折抵</span>
              <span>-NT$ {(appliedCoupon.type === 'percentage' 
                ? Math.round(total * (appliedCoupon.discount / 100))
                : Math.min(appliedCoupon.discount, total)).toLocaleString()}</span>
            </div>
          )}

          <hr className="my-3" />

          <div className="d-flex justify-content-between">
            <span className="fw-bold">應付金額</span>
            <span className="fw-bold text-primary">
              NT$ {(total - (appliedCoupon ? (
                appliedCoupon.type === 'percentage'
                  ? Math.round(total * (appliedCoupon.discount / 100))
                  : Math.min(appliedCoupon.discount, total)
              ) : 0)).toLocaleString()}
            </span>
          </div>
        </div>

        {/* 下一步按鈕 */}
        <div className="mt-4">
          <Button
            variant="primary"
            size="lg"
            className="w-100"
            onClick={handleNextStep}
            disabled={total <= 0}
          >
            前往結帳
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CartSummary;