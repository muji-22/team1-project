import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import CartItemList from "./testcartlisritem"; // 引入新的商品列表元件

export default function Cart() {
  // 原本的 state
  const [cart, setCart] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  // 新增這兩個 state
  const [showCouponSelector, setShowCouponSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState([]);

  const router = useRouter();

  // 取得購物車資料
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3005/api/cart", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.status === "success") {
        // 處理每個項目的圖片路徑
        const itemsWithImages = data.data.items.map((item) => ({
          ...item,
          imageUrl: `http://localhost:3005/productImages/${item.product_id}/${item.product_id}-1.jpg`,
        }));

        setCart({
          ...data.data,
          items: itemsWithImages,
        });

        if (data.data.coupon) {
          setAppliedCoupon(data.data.coupon);
        }
      }
    } catch (error) {
      console.error("取得購物車錯誤:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 取得優惠券列表
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3005/api/coupons/available",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.status === "success") {
          setFilteredCoupons(data.data);
        }
      } catch (error) {
        console.error("獲取優惠券失敗:", error);
      }
    };

    fetchCoupons();
  }, []);

  // 更新商品數量
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3005/api/cart/items/${itemId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        fetchCart();
      }
    } catch (error) {
      console.error("更新數量錯誤:", error);
    }
  };

  // 刪除商品
  const deleteItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3005/api/cart/items/${itemId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        fetchCart();
      }
    } catch (error) {
      console.error("刪除商品錯誤:", error);
    }
  };

  // 計算商品總金額（未套用優惠券）
  const calculateSubTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  // 計算優惠後金額
  const calculateTotal = () => {
    const subTotal = calculateSubTotal();

    if (!appliedCoupon) return subTotal;

    if (appliedCoupon.type === "percentage") {
      const discount = subTotal * (appliedCoupon.discount / 100);
      return subTotal - discount;
    } else if (appliedCoupon.type === "fixed") {
      return Math.max(0, subTotal - appliedCoupon.discount);
    }

    return subTotal;
  };

  // 套用優惠券
  const applyCoupon = async (code = couponCode) => {
    if (!code.trim()) {
      setCouponError("請輸入優惠券代碼");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3005/api/cart/apply-coupon",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code: code }),
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        setAppliedCoupon(data.data.coupon);
        setCouponError("");
        setCouponCode("");
        fetchCart();
      }
    } catch (error) {
      console.error("套用優惠券錯誤:", error);
      setCouponError("優惠券套用失敗");
    }
  };

  // 檢查使用者是否已登入並取得購物車資料
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchCart();
  }, []);

  if (isLoading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">購物車</h2>
      {cart.items.length === 0 ? (
        <div className="text-center">
          <p>購物車是空的</p>
          <Link href="/products" className="btn btn-primary">
            繼續購物
          </Link>
        </div>
      ) : (
        <>
          <CartItemList
            items={cart.items}
            updateQuantity={updateQuantity}
            deleteItem={deleteItem}
          />
          <div className="d-flex justify-content-between my-4">
            <div>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowCouponSelector(!showCouponSelector)}
              >
                套用優惠券
              </button>
              {showCouponSelector && (
                <div className="mt-3">
                  <input
                    type="text"
                    className="form-control"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="請輸入優惠券代碼"
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => applyCoupon()}
                  >
                    套用
                  </button>
                  {couponError && <p className="text-danger">{couponError}</p>}
                </div>
              )}
            </div>
            <div>
              <p>總計: ${calculateTotal()}</p>
              <Link href="/checkout" className="btn btn-success">
                前往結帳
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
