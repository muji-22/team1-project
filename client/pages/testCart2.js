import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// 加入樣式
const styles = {
  cursorPointer: {
    cursor: "pointer",
  },
};

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

  // 移除優惠券
  const removeCoupon = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3005/api/cart/remove-coupon",
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
        setAppliedCoupon(null);
        fetchCart();
      }
    } catch (error) {
      console.error("移除優惠券錯誤:", error);
    }
  };

  // 處理選擇優惠券
  const handleSelectCoupon = (coupon) => {
    setShowCouponSelector(false);
    setCouponCode(coupon.code);
    applyCoupon(coupon.code);
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
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>商品圖片</th>
                  <th>商品名稱</th>
                  <th>單價</th>
                  <th>數量</th>
                  <th>小計</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.imageUrl}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/default-product.png";
                        }}
                        alt={item.name}
                        className="rounded"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          border: "1px solid #dee2e6",
                        }}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>${item.price}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>${item.price * item.quantity}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteItem(item.id)}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 訂單摘要 */}
          <div className="row justify-content-end">
            <div className="col-md-4">
              <div className="bg-light p-3">
                <h4>訂單摘要</h4>

                {/* 優惠券輸入區 */}
                <div className="mb-3">
                  {!appliedCoupon ? (
                    <div>
                      <div className="dropdown w-100">
                        {/* 觸發按鈕 */}
                        <button
                          className="btn btn-outline-secondary w-100 d-flex justify-content-between align-items-center"
                          type="button"
                          onClick={() =>
                            setShowCouponSelector(!showCouponSelector)
                          }
                        >
                          <span>選擇優惠券</span>
                          <i className="bi bi-chevron-down"></i>
                        </button>

                        {/* 下拉選單內容 */}
                        {showCouponSelector && (
                          <div
                            className="dropdown-menu show w-100 p-3 shadow-lg"
                            style={{ maxHeight: "400px", overflowY: "auto" }}
                          >
                            {/* 搜尋框 */}
                            <div className="mb-3 sticky-top bg-white pt-1">
                              <div className="input-group input-group-sm">
                                <span className="input-group-text">
                                  <i className="bi bi-search"></i>
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="搜尋優惠券..."
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            {/* 優惠券列表 */}
                            {filteredCoupons.length > 0 ? (
                              filteredCoupons.map((coupon) => (
                                <div
                                  key={coupon.id}
                                  className="coupon-item card mb-2 cursor-pointer"
                                  onClick={() => handleSelectCoupon(coupon)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="row g-0">
                                    <div className="col-3 bg-primary d-flex align-items-center justify-content-center p-2">
                                      <i className="bi bi-ticket-perforated text-white fs-4"></i>
                                    </div>
                                    <div className="col-9 bg-white text-dark">
                                      <div className="card-body p-2">
                                        <h6 className="card-title mb-1 fw-bold text-truncate">
                                          {coupon.name}
                                        </h6>
                                        <p className="card-text mb-1 text-danger fw-bold">
                                          {coupon.type === "percentage"
                                            ? `${coupon.discount}% OFF`
                                            : `$${coupon.discount} OFF`}
                                        </p>
                                        <small className="text-muted">
                                          到期日：
                                          {new Date(
                                            coupon.end_date
                                          ).toLocaleDateString()}
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center text-muted py-3">
                                沒有符合條件的優惠券
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center bg-success bg-opacity-10 p-2 rounded">
                      <div>
                        <div className="fw-bold">{appliedCoupon.name}</div>
                        <small className="text-danger">
                          {appliedCoupon.type === "percentage"
                            ? `${appliedCoupon.discount}% OFF`
                            : `$${appliedCoupon.discount} OFF`}
                        </small>
                      </div>
                      <button
                        className="btn btn-link btn-sm text-danger p-0"
                        onClick={removeCoupon}
                      >
                        移除
                      </button>
                    </div>
                  )}
                </div>

                {/* 金額計算 */}
                <div className="border-top pt-2">
                  <div className="d-flex justify-content-between mb-2">
                    <span>商品小計：</span>
                    <span>${calculateSubTotal()}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="d-flex justify-content-between mb-2 text-danger">
                      <span>優惠折抵：</span>
                      <span>
                        -${(calculateSubTotal() - calculateTotal()).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mb-2 fw-bold">
                    <span>結帳金額：</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>

                <Link href="/checkout" className="btn btn-primary w-100 mt-3">
                  前往結帳
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
