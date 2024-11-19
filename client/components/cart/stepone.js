// components/cart/StepOne.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useCart } from "@/contexts/CartContext";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { toast } from "react-toastify";
import styles from "@/styles/cart.module.css";

const StepOne = ({
  setstepType,
  setDiscountPrice,
  setDiscountAmount,
  setCartCouponId,
  setCartProductDtl,
  setCartOriginDtl,
}) => {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [saleTotal, setSaleTotal] = useState(0);
  const [rentalTotal, setRentalTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const { fetchCartCount } = useCart();

  // 獲取購物車數據
  const fetchCartData = async () => {
    try {
      console.log("開始獲取購物車數據");
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("未找到 token");
        throw new Error("請先登入");
      }

      console.log("發送請求到伺服器");
      const response = await fetch("http://localhost:3005/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("收到伺服器響應:", response.status);
      const data = await response.json();
      console.log("解析後的數據:", data);

      if (!response.ok) {
        throw new Error(data.message || "獲取購物車數據失敗");
      }

      if (data.status === "success" && data.data) {
        console.log("成功獲取購物車數據:", data.data);

        // 確保 items 存在且是陣列
        const items = Array.isArray(data.data.items) ? data.data.items : [];
        console.log("處理後的商品列表:", items);

        setCartItems(items);

        // 計算購買商品總額
        const saleTotal = items.reduce((sum, item) => {
          if (item.type === "sale") {
            const itemTotal = (item.price || 0) * (item.quantity || 1);
            console.log("購買商品:", item.name, "金額:", itemTotal);
            return sum + itemTotal;
          }
          return sum;
        }, 0);

        // 在 fetchCartData 函數中的計算邏輯部分
        const rentalTotal = items.reduce((sum, item) => {
          if (item.type === "rental") {
            // 租金部分：商品數量*(租金*租借天數)
            const rentalFeeTotal =
              item.quantity * (item.rental_fee * (item.rental_days || 3));
            // 押金部分：商品數量*押金
            const depositTotal = item.quantity * item.deposit;
            // 總額：租金 + 押金
            const itemTotal = rentalFeeTotal + depositTotal;
            console.log(
              "租借商品:",
              item.name,
              "租金:",
              rentalFeeTotal,
              "押金:",
              depositTotal,
              "總額:",
              itemTotal
            );
            return sum + itemTotal;
          }
          return sum;
        }, 0);

        // 設定總金額
        console.log("購買商品總額:", saleTotal);
        console.log("租借商品總額:", rentalTotal);
        setSaleTotal(saleTotal);
        setRentalTotal(rentalTotal);
        const total = saleTotal + rentalTotal;
        setTotalAmount(total);
        setDiscountPrice(total);

        setCartOriginDtl(items);
        setCartProductDtl(items);

        await fetchCartCount();
      } else {
        console.log("數據格式不正確:", data);
        throw new Error("數據格式不正確");
      }
    } catch (error) {
      console.error("獲取購物車數據失敗:", error);
      if (error.message === "請先登入") {
        toast.error("請先登入");
      } else {
        toast.error(error.message || "獲取購物車數據失敗");
      }
      setCartItems([]);
      setSaleTotal(0);
      setRentalTotal(0);
      setTotalAmount(0);
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
          {cartItems.filter((item) => item.type === "sale").length > 0 && (
            <div className="mb-4 mt-3">
              <h5 className={`my-3 bg-custom py-3 text-center text-white`}>
                購買商品
              </h5>
              {cartItems
                .filter((item) => item.type === "sale")
                .map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdate={fetchCartData}
                  />
                ))}
            </div>
          )}

          {/* 租借商品列表 */}
          {cartItems.filter((item) => item.type === "rental").length > 0 && (
            <div className="mb-4 ">
              <h5 className={`my-3 bg-custom py-3 text-center text-white`}>
                租借商品
              </h5>
              {cartItems
                .filter((item) => item.type === "rental")
                .map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdate={fetchCartData}
                  />
                ))}
            </div>
          )}

          {/* 空購物車提示 */}
          {cartItems.length === 0 && (
            <div className="text-center py-5">
              <h4>購物車是空的</h4>
              <p className="text-muted">快去選購喜歡的商品吧！</p>
            </div>
          )}
        </Col>

        <Col lg={4}>
          <CartSummary
            total={totalAmount}
            saleTotal={saleTotal}
            rentalTotal={rentalTotal}
            cartItems={cartItems}
            setDiscountPrice={setDiscountPrice}
            setDiscountAmount={setDiscountAmount}
            setCartCouponId={setCartCouponId}
            onNextStep={() => {
              if (cartItems.length > 0) {
                setstepType(2);
              } else {
                toast.warning("購物車是空的");
              }
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default StepOne;
