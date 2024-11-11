import React, { useState, useEffect } from "react";
import { Container, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import style from "@/components/cart/step.module.css";
import CartItemList from "@/components/cart/list.js"; // 引入新的商品列表元件
import CartRentItemList from "@/components/cart/rentlist.js";
import Link from "next/link";

//icon區
import { FaTrashCan } from "react-icons/fa6";
import { GiReturnArrow } from "react-icons/gi";
import { RiCoupon2Fill } from "react-icons/ri";

export default function StepOne({
  setstepType,
  setDiscountPrice,
  setDiscountAmount,
}) {
  // 原本的 state
  const [cart, setCart] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [CouponId, setCouponId] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  // 新增這兩個 state
  const [showCouponSelector, setShowCouponSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState([]);

  const router = useRouter();

  // *{---------取得購物車資料---------}*
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
          type: item.type ? "rent" : "product",
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

  const P_Items = cart.items.filter((item) => item.type === "product");
  const R_Items = cart.items.filter((item) => item.type === "rent");

  // 更新一般商品數量
  const newProductQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3005/api/cart/product-items/${itemId}`, // 指向一般商品 API 路徑
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
        fetchCart(); // 更新購物車
      }
    } catch (error) {
      console.error("更新一般商品數量錯誤:", error);
    }
  };

  // 更新租借商品數量
  const newRentQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3005/api/cart/rent-items/${itemId}`, // 指向租借商品 API 路徑
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
        fetchCart(); // 更新購物車
      }
    } catch (error) {
      console.error("更新租借商品數量錯誤:", error);
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
  // 清空購物車
  const deleteAllItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3005/api/cart/clear`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.status === "success") {
        fetchCart();
      }
    } catch (error) {
      console.error("清空購物車錯誤:", error);
    }
  };

  // 計算商品總數
  const calculateTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
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
        setCouponId("");
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

  // 返回賣場
  const handleRedirect = () => {
    router.push("http://localhost:3000/productList"); // 導航到指定的內部頁面(用於回到賣場)
  };

  // 最後匯出資料
  const sendDiscount = () => {
    const total = calculateTotal(); // 最終折扣後的價格
    const subTotal = calculateSubTotal(); // 未套用折扣的原始金額
    const discountAmount = subTotal - total; // 計算折扣金額
    setDiscountPrice(total); // 設置最終折扣後的價格
    setDiscountAmount(discountAmount); // 設置折扣金額
  };

  const sendCouponId = () => {
    if (appliedCoupon) {
      setAppliedCoupon(data.data.coupon); // 傳遞已套用的優惠券 ID
    }
  };

  const sendData = () => {
    setstepType(2); // 切換到下一步
    sendDiscount();
    sendCouponId();
    sendProductDetails(); // 傳遞商品詳細資料
  };

  const sendProductDetails = () => {
    cart.items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      imageUrl: item.imageUrl,
      type: item.type,
    }));
  };

  return (
    <Container className="container py-5">
      {cart.items.length === 0 ? (
        <div className="text-center">
          <h3 className="pb-2">購物車是空的</h3>
          <Link href="/products" className={`btn ${style.keepshoping}`}>
            繼續購物
          </Link>
        </div>
      ) : (
        <>
          {/*-----------商品區---------- */}
          <div className={style.listTitle}>
            <Col xs={10}>商品</Col>
          </div>

          <div className={`${style.productList} d-none d-lg-flex px-4 `}>
            <Col xs={2}>
              <span className={`${style.phoneDNone} pe-5`}>商品圖片&nbsp;</span>
            </Col>
            <Col xs={2}>
              <span className={`${style.phoneDNone} pe-5`}>商品名稱&nbsp;</span>
            </Col>
            <Col xs={2}>
              <span className={`${style.phoneDNone} ps-2`}>單價</span>
            </Col>
            <Col xs={2}>
              <span className={`${style.phoneDNone} ps-4`}>數量</span>
            </Col>
            <Col xs={2}>
              <span className={`${style.phoneDNone} ps-4`}>小計</span>
            </Col>
            <Col xs={1}>
              <span className={`${style.phoneDNone} ps-4`}>操作</span>
            </Col>
          </div>

          <div className={style.border}>
            <CartItemList
              items={P_Items}
              updateQuantity={newProductQuantity}
              deleteItem={deleteItem}
            />
          </div>
          <div>小計</div>
          {/* -----------租借商品區---------- */}
          <div className={style.listTitle}>
            <Col xs={10}>租借商品</Col>
          </div>

          <div className={`${style.productList} d-none d-lg-flex px-4`}>
            <Col xs={2}>
              <span className={`${style.phoneDNone} pe-5`}>商品名稱&nbsp;</span>
            </Col>
            <Col xs={2}>
              <span className={`${style.phoneDNone} pe-5`}>商品圖片&nbsp;</span>
            </Col>
            <Col xs={2}>
              <span className={`${style.phoneDNone} ps-2`}>單價</span>
            </Col>
            <Col xs={2}>
              <span className={`${style.phoneDNone} ps-4`}>數量/天數</span>
            </Col>
            <Col xs={2}>
              <span className={`${style.phoneDNone} ps-4`}>小計</span>
            </Col>
          </div>

          <div className={style.border}>
            <CartRentItemList
              items={R_Items}
              updateQuantity={newRentQuantity}
              deleteItem={deleteItem}
            />
          </div>
          <div>小計</div>

          {/* ---------結帳區---------- */}
          <div className={style.totalSection}>
            {/* 優惠券輸入 */}

            <Col className={style.deleteSection}>
              <div className="d-flex flex-column">
                <div className=" py-3">
                  <h4>選擇您的優惠券</h4>

                  {/* 優惠券輸入區 */}
                  <div className="mb-3">
                    {!appliedCoupon ? (
                      <div>
                        <div className="dropdown ">
                          {/* 觸發按鈕 */}
                          <button
                            className={`btn ${style.Couponbtn} btn-outline-secondary d-flex justify-content-center align-items-center `}
                            type="button"
                            onClick={() =>
                              setShowCouponSelector(!showCouponSelector)
                            }
                          >
                            <RiCoupon2Fill />
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
                          className="btn btn-link btn-sm text-danger p-0 phoneDnone"
                          onClick={removeCoupon}
                        >
                          移除
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 金額計算 */}
                </div>
                <button
                  className={`${style.backBtn} my-2 `}
                  onClick={() => deleteAllItems()}
                >
                  全部刪除&nbsp;
                  <FaTrashCan />
                </button>

                <button
                  className={`${style.backBtn} my-2 `}
                  onClick={handleRedirect}
                >
                  返回賣場&nbsp;
                  <GiReturnArrow />
                </button>
              </div>
            </Col>

            <div className={style.total}>
              <div>購買商品金額$</div>
              <div>租借商品金額$</div>
              <div className="discount">
                {`優惠券折抵 ${(calculateSubTotal() - calculateTotal()).toFixed(
                  2
                )}`}
                {/* {`${discountAmount}`} */}
              </div>
              <div>
                <span>
                  {`總金額(共 ${calculateTotalItems()} 件)`}${calculateTotal()}
                  {/* <span>${`${discountPrice + cart.rentproductTotal}`}</span> */}
                </span>
              </div>

              <span className="">
                <button
                  className={style.nextStepBtn}
                  onClick={sendData}
                  disabled={cart.totalItems === 0}
                >
                  前往結帳
                </button>
              </span>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
