// components/cart/CartSummary.js
import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "@/styles/cart.module.css";
import { FaTicket } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

const CartSummary = ({
  total,
  saleTotal = 0,
  rentalTotal = 0,
  setDiscountPrice,
  setDiscountAmount,
  setCartCouponId,
  onNextStep,
}) => {
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponSelector, setShowCouponSelector] = useState(false);
  const [userCoupons, setUserCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 獲取用戶優惠券列表
  useEffect(() => {
    const fetchUserCoupons = async () => {
      try {
        const token = localStorage.getItem("token");
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        const userId = tokenPayload.id;

        const response = await fetch(
          `http://localhost:3005/api/coupons/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("獲取優惠券失敗");
        }

        const data = await response.json();
        // 只過濾未使用的優惠券
        const validCoupons = data.filter(
          (coupon) =>
            coupon.status === "valid" &&
            !coupon.used_time &&
            new Date(coupon.end_date) > new Date()
        );
        setUserCoupons(validCoupons);
      } catch (error) {
        console.error("獲取優惠券失敗:", error);
        toast.error("獲取優惠券失敗");
      }
    };

    fetchUserCoupons();
  }, []);

  // 監測購物車金額變化
  useEffect(() => {
    // 當購物車完全為空時
    if (total <= 0 && appliedCoupon) {
      setAppliedCoupon(null);
      setCartCouponId(null);
      setDiscountAmount(0);
      setDiscountPrice(0);
      setShowCouponSelector(false);
      return;
    }

    // 當已選擇優惠券時，檢查對應類型的商品是否還存在
    if (appliedCoupon) {
      const shouldRemoveCoupon = (
        (appliedCoupon.apply_to === 'sale' && saleTotal <= 0) ||
        (appliedCoupon.apply_to === 'rental' && rentalTotal <= 0)
      );

      if (shouldRemoveCoupon) {
        setAppliedCoupon(null);
        setCartCouponId(null);
        setDiscountAmount(0);
        setDiscountPrice(total);
        toast.info("已自動移除不適用的優惠券", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          progress: undefined,
        });
      }
    }
  }, [total, saleTotal, rentalTotal]);

  // 判斷優惠券是否可用
  const isCouponApplicable = (coupon) => {
    switch (coupon.apply_to) {
      case 'sale':
        return saleTotal > 0;
      case 'rental':
        return rentalTotal > 0;
      case 'both':
        return total > 0;
      default:
        return false;
    }
  };

  // 過濾優惠券
  const filteredCoupons = userCoupons.filter(
    (coupon) =>
      coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 優惠券顯示格式
  const formatCouponValue = (coupon) => {
    if (coupon.type === "percentage") {
      return `${coupon.discount}折`;
    } else {
      return `NT$ ${coupon.discount}`;
    }
  };

  // 計算折扣
  const calculateDiscount = (couponData) => {
    let baseAmount = total;

    // 根據優惠券類型決定折扣基準
    switch (couponData.apply_to) {
      case 'sale':
        baseAmount = saleTotal;
        break;
      case 'rental':
        baseAmount = rentalTotal;
        break;
      // case 'both' 使用 total，不需要改變
    }

    // 計算折扣金額
    let discountAmount = 0;
    if (couponData.type === 'percentage') {
      discountAmount = Math.round(baseAmount * ((100 - couponData.discount) / 100));
    } else {
      discountAmount = Math.min(couponData.discount, baseAmount);
    }

    return discountAmount;
  };

  // 選擇優惠券
  const handleSelectCoupon = async (coupon) => {
    if (!isCouponApplicable(coupon)) return;

    const couponData = {
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      type: coupon.type,
      discount: coupon.discount,
      start_date: coupon.start_date,
      end_date: coupon.end_date,
      apply_to: coupon.apply_to,
      valid: coupon.valid,
    };

    // 設定優惠券資訊
    setAppliedCoupon(couponData);
    setCartCouponId(couponData.id);

    // 計算折扣金額
    const discountAmount = calculateDiscount(couponData);
    setDiscountAmount(discountAmount);
    setDiscountPrice(total - discountAmount);

    // 自動收起優惠券列表
    setShowCouponSelector(false);

    toast.success("成功套用優惠券", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      progress: undefined,
      icon: <FaCheckCircle size={30} style={{ color: "#40CBCE" }} />,
    });
  };

  // 移除優惠券
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCartCouponId(null);
    setDiscountAmount(0);
    setDiscountPrice(total);
    toast.success("已移除優惠券", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      progress: undefined,
      icon: <FaCheckCircle size={30} style={{ color: "#40CBCE" }} />,
    });
  };

  // 檢查是否可以進行結帳
  const handleNextStep = () => {
    if (total <= 0) {
      toast.warning("購物車是空的");
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
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            paddingRight: "5px",
          }}
        >
          {filteredCoupons.length > 0 ? (
            <div className="d-flex flex-column gap-2">
              {filteredCoupons.map((coupon) => {
                const isApplicable = isCouponApplicable(coupon);
                return (
                  <div
                    key={coupon.id}
                    className={`card shadow-sm w-100 ${!isApplicable ? 'opacity-50' : ''}`}
                    onClick={() => isApplicable && handleSelectCoupon(coupon)}
                    style={{ 
                      cursor: isApplicable ? "pointer" : "not-allowed",
                    }}
                  >
                    <div className="row g-0">
                      <div className={`col-3 ${isApplicable ? 'bg-custom' : 'bg-secondary'} d-flex align-items-center justify-content-center p-2`}>
                        <FaTicket className="text-white w-75 h-auto" />
                      </div>
                      <div className="col-9 bg-white text-dark p-1">
                        <div className="card-body p-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-2 fs-6 fw-bold text-truncate">
                              {coupon.name}
                            </h5>
                            {appliedCoupon?.id === coupon.id && (
                              <FaCheckCircle className="fs-4 text-custom" />
                            )}
                          </div>
                          <p className="card-text mb-1 fs-5 fw-bold text-danger">
                            {formatCouponValue(coupon)}
                          </p>
                          <p className="card-text mb-0 text-secondary small">
                            到期日：{new Date(coupon.end_date).toLocaleDateString()}
                          </p>
                          <div className="d-flex gap-2 align-items-center">
                            <span className={`badge ${isApplicable ? 'bg-secondary' : 'bg-danger'}`}>
                              {coupon.apply_to === 'sale' && '限購買商品'}
                              {coupon.apply_to === 'rental' && '限租借商品'}
                              {coupon.apply_to === 'both' && '適用全部商品'}
                            </span>
                            {!isApplicable && (
                              <small className="text-danger">
                                {coupon.apply_to === 'sale' && '購物車中無購買商品'}
                                {coupon.apply_to === 'rental' && '購物車中無租借商品'}
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted py-3">
              {searchTerm ? "沒有符合條件的優惠券" : "目前沒有可用的優惠券"}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={`${styles.summaryCard} shadow-sm`}>
      <Card.Body className={`${styles.CardShadow}`}>
        <h5 className="mb-4 text-center">訂單摘要</h5>

        {/* 優惠券區域 */}
        <div className="mb-4">
          {/* 已選擇的優惠券顯示 */}
          {appliedCoupon && (
            <div className="alert border d-flex align-items-center justify-content-between mb-3">
              <div>
                <div className="fw-bold">{appliedCoupon.name}</div>
                <small className="text-muted">
                  {appliedCoupon.type === "percentage"
                    ? `${appliedCoupon.discount}折`
                    : `折抵 NT$ ${appliedCoupon.discount}`}
                </small>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleRemoveCoupon}
              >
                取消
              </Button>
            </div>
          )}

          {/* 選擇優惠券按鈕 */}
          <Button
            variant="outline-secondary"
            className={`w-100 ${styles.BBBtn}`}
            onClick={() => setShowCouponSelector(!showCouponSelector)}
            disabled={total <= 0}
          >
            {total <= 0 ? "購物車是空的" : appliedCoupon ? "更改優惠券" : "選擇優惠券"}
          </Button>

          {/* 優惠券選擇器 */}
          {renderCouponSelector()}
        </div>

        {/* 價格明細 */}
        <div className={styles.priceDetails}>
          {/* 購買商品小計 */}
          <div className="d-flex justify-content-between mb-2 text-secondary">
            <span>購買商品小計</span>
            <span>NT$ {saleTotal.toLocaleString()}</span>
          </div>

          {/* 租借商品小計 */}
          <div className="d-flex justify-content-between mb-2 text-secondary">
            <span>租借商品小計</span>
            <span>NT$ {rentalTotal.toLocaleString()}</span>
          </div>

          {/* 商品總金額 */}
          <div className="d-flex justify-content-between mb-2 pt-2 border-top fw-bold">
            <span>商品總金額</span>
            <span>NT$ {total.toLocaleString()}</span>
          </div>

          {/* 優惠折抵 */}
          {appliedCoupon && (
            <div className="d-flex justify-content-between mb-2 text-danger">
              <span>
                優惠折抵 
                {appliedCoupon.apply_to === 'sale' && '(限購買)'}
                {appliedCoupon.apply_to === 'rental' && '(限租借)'}
              </span>
              <span>-NT$ {calculateDiscount(appliedCoupon).toLocaleString()}</span>
            </div>
          )}

          <hr className="my-3" />

          {/* 應付金額 */}
          <div className="d-flex justify-content-between">
            <span className="fw-bold">應付金額</span>
            <span className="fw-bold">
              NT$ {(total - (appliedCoupon ? calculateDiscount(appliedCoupon) : 0)).toLocaleString()}
            </span>
          </div>
        </div>

        {/* 下一步按鈕 */}
        <div className="mt-4">
          <Button
            variant="custom"
            size="lg"
            className={`w-100 ${styles.checkoutButton} ${styles.BBBtn}`} 
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