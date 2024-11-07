import React, { useState, useEffect } from "react";
import { Container, Col } from "react-bootstrap";
import List from "./list.js";
import { useRouter } from "next/router";
import axios, { all } from "axios";
import style from "@/components/cart/step.module.css";
import CartItemList from "@/components/cart/list.js"; // 引入新的商品列表元件

//icon區
import { FaTrashCan } from "react-icons/fa6";
import { GiReturnArrow } from "react-icons/gi";

export default function Cart() {
  // 原本的 state
  const [cart, setCart] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  // 用來存儲已選取的商品 ID (新增)
  const [selectedItems, setSelectedItems] = useState([]);

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

  // 返回賣場
  const handleRedirect = () => {
    router.push("http://localhost:3000/productList"); // 導航到指定的內部頁面(用於回到賣場)
  };

  // 最後匯出資料
  const sendDiscount = () => {
    setDiscountPrice(discountPrice);
    setDiscountAmount(discountAmount);
  };

  const sendCouponId = () => {
    setCartCouponId(couponId);
  };

  const sendData = () => {
    // 在子组件中调用父组件传递的回调函数，并传递数据
    setstepType(2);
  };

  const sendProductDtl = () => {};

  return (
    <Container className="container">
      {/*-----------商品區---------- */}
      <div className={style.listTitle}>
        <Col xs={10}>商品</Col>
        <Col xs={1}>
          <span className={`expand ${style.phoneDNone}`}>縮</span>
        </Col>
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
          items={cart.items}
          updateQuantity={updateQuantity}
          deleteItem={deleteItem}
        />
      </div>

      {/* -----------租借商品區---------- */}
      <div className={style.listTitle}>
        <Col xs={10}>租借商品</Col>
        <Col xs={1}>
          <span className={`expand ${style.phoneDNone}`}>縮</span>
        </Col>
      </div>

      <div className={`${style.productList} d-none d-lg-flex px-4`}>
        <Col xs={2}>
          <span className={`${style.phoneDNone} pe-5`}>商品名稱&nbsp;</span>
        </Col>
        <Col xs={2}>
          <span className={`${style.phoneDNone} pe-5`}>商品圖片&nbsp;</span>
        </Col>
        <Col xs={1}>
          <span className={`${style.phoneDNone} pe-4`}>規格&nbsp;</span>
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
      </div>
      {/* -------------租借商品清單匯入區 */}
      {/* <div>
        <List
          mode={"rentproduct"}
          setCartOriginDtl={setCartOriginDtl}
          setCartProductDtl={setCartProductDtl}
        />
      </div> */}

      <div className={style.productList}>
        <Col className={style.deleteSection}>
          <div className="d-flex flex-column">
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

          <div className={style.couponSection}>
            <span>優惠券匯入區</span>
          </div>
        </Col>
      </div>

      {/* ---------結帳區---------- */}
      <div className={style.totalSection}>
        <label></label>
        <div className={style.total}>
          <div>
            {`總金額(共 ${calculateTotalItems()} 件)`}${calculateSubTotal()}
            {/* <span>${`${discountPrice + cart.rentproductTotal}`}</span> */}
          </div>
          <div className="discount">
            {`優惠券折抵 $ `}
            {/* {`${discountAmount}`} */}
          </div>
          <span className="">
            <span>
              {`確認訂單金額 `} ${calculateTotal()}
            </span>
            <button
              className={style.nextStepBtn}
              onClick={() => {
                sendData();
                sendDiscount();
                sendCouponId();
                sendProductDtl();
              }}
              disabled={cart.totalItems === 0}
            >
              下一步
            </button>
          </span>
        </div>
      </div>
    </Container>
  );
}
