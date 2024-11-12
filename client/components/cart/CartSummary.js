// components/cart/CartSummary.js
import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import styles from '@/styles/cart.module.css';
import { FaTicket } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const CartSummary = ({
  total,
  setDiscountPrice,
  setDiscountAmount,
  setCartCouponId,
  onNextStep
}) => {
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponSelector, setShowCouponSelector] = useState(false);
  const [userCoupons, setUserCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 獲取用戶優惠券列表
  useEffect(() => {
    const fetchUserCoupons = async () => {
      try {
        const token = localStorage.getItem('token');
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenPayload.id;

        const response = await fetch(
          `http://localhost:3005/api/coupons/user/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('獲取優惠券失敗');
        }

        const data = await response.json();
        // 只過濾未使用的優惠券
        const validCoupons = data.filter(coupon => 
          coupon.status === 'valid' && 
          !coupon.used_time && 
          new Date(coupon.end_date) > new Date()
        );
        setUserCoupons(validCoupons);
      } catch (error) {
        console.error('獲取優惠券失敗:', error);
        toast.error('獲取優惠券失敗');
      }
    };

    fetchUserCoupons();
  }, []);

  // 過濾優惠券
  const filteredCoupons = userCoupons.filter(
    (coupon) =>
      coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 優惠券顯示格式
  const formatCouponValue = (coupon) => {
    if (coupon.type === 'percentage') {
      return `${coupon.discount}折`;
    } else {
      return `NT$ ${coupon.discount}`;
    }
  };

  // 選擇優惠券
  const handleSelectCoupon = async (coupon) => {
    const couponData = {
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      type: coupon.type,
      discount: coupon.discount,
      start_date: coupon.start_date,
      end_date: coupon.end_date,
      apply_to: coupon.apply_to,
      valid: coupon.valid
    };
    
    // 設定優惠券資訊
    setAppliedCoupon(couponData);
    setCartCouponId(couponData.id);

    // 計算折扣金額
    let discountAmount;
    if (couponData.type === 'percentage') {
      discountAmount = Math.round(total * ((100 - couponData.discount) / 100));
    } else {
      discountAmount = Math.min(couponData.discount, total);
    }

    setDiscountAmount(discountAmount);
    setDiscountPrice(total - discountAmount);
    toast.success('優惠券套用成功！');
  };

  // 移除優惠券
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCartCouponId(null);
    setDiscountAmount(0);
    setDiscountPrice(total);
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

  // 優惠券選擇器UI
  const renderCouponSelector = () => {
    if (!showCouponSelector) return null;

    return (
      <div className="border rounded mt-2 p-3 bg-white">
        {/* 搜尋框 */}
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="搜尋優惠券..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 優惠券列表 */}
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto',
          paddingRight: '5px'
        }}>
          {filteredCoupons.length > 0 ? (
            <div className="d-flex flex-column gap-2">
              {filteredCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`card shadow-sm w-100 ${appliedCoupon?.id === coupon.id ? 'border-success' : ''}`}
                  onClick={() => handleSelectCoupon(coupon)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="row g-0">
                    <div className={`col-3 ${appliedCoupon?.id === coupon.id ? 'bg-success' : 'bg-custom'} d-flex align-items-center justify-content-center p-2`}>
                      <FaTicket className="text-white w-75 h-auto" />
                    </div>
                    <div className="col-9 bg-white text-dark p-1">
                      <div className="card-body p-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="card-title mb-2 fs-6 fw-bold text-truncate">
                            {coupon.name}
                          </h5>
                          {appliedCoupon?.id === coupon.id && (
                            <span className="badge bg-success">使用中</span>
                          )}
                        </div>
                        <p className="card-text mb-1 fs-5 fw-bold text-danger">
                          {formatCouponValue(coupon)}
                        </p>
                        <p className="card-text mb-0 text-secondary small">
                          到期日：{new Date(coupon.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-3">
              {searchTerm ? '沒有符合條件的優惠券' : '目前沒有可用的優惠券'}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={`${styles.summaryCard} shadow-sm`}>
      <Card.Body>
        <h5 className="mb-4">訂單摘要</h5>

        {/* 優惠券區域 */}
        <div className="mb-4">
          {/* 已選擇的優惠券顯示 */}
          {appliedCoupon && (
            <div className="alert alert-success d-flex align-items-center justify-content-between mb-3">
              <div>
                <div className="fw-bold">{appliedCoupon.name}</div>
                <small className="text-muted">
                  {appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}折` : `折抵 NT$ ${appliedCoupon.discount}`}
                </small>
              </div>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={handleRemoveCoupon}
              >
                移除
              </Button>
            </div>
          )}

          {/* 優惠券代碼輸入 */}
          <Form.Group className="mb-3">
            <Form.Label>優惠券代碼</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="請輸入優惠券代碼"
                disabled={appliedCoupon}
              />
              <Button
                variant={appliedCoupon ? "outline-danger" : "outline-primary"}
                onClick={appliedCoupon ? handleRemoveCoupon : null} // handleApplyCoupon 被移除
                style={{ width: '80px' }}
              >
                {appliedCoupon ? '移除' : '套用'}
              </Button>
            </div>
          </Form.Group>

          {/* 選擇優惠券按鈕 */}
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={() => setShowCouponSelector(!showCouponSelector)}
          >
            <FaTicket className="me-2" />
            {showCouponSelector ? '收起優惠券' : '選擇我的優惠券'}
          </Button>

          {/* 優惠券選擇器 */}
          {renderCouponSelector()}
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
                ? Math.round(total * ((100 - appliedCoupon.discount) / 100))
                : Math.min(appliedCoupon.discount, total)).toLocaleString()}</span>
            </div>
          )}

          <hr className="my-3" />

          <div className="d-flex justify-content-between">
            <span className="fw-bold">應付金額</span>
            <span className="fw-bold text-primary">
              NT$ {(total - (appliedCoupon ? (
                appliedCoupon.type === 'percentage'
                  ? Math.round(total * ((100 - appliedCoupon.discount) / 100))
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