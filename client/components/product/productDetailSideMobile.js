import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import QuantityAdjuster from "@/components/product/quantityAdjuster";
import styles from "./productDetailSide.module.css";
import ProductDetailMainNotice from "./productDetailMainNotice2";
import AddProduct from "@/components/cart/addProduct";

const ProductDetailSideMobile = ({
  name,
  price,
  descrition, // 注意：資料庫中的欄位名稱是 descrition
  min_age,
  min_users,
  max_users,
  playtime,
  onAddToCart,
  onAddToWishlist,
}) => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 新增數量管理狀態
  const [quantity, setQuantity] = useState(1);

  // 獲取商品資料
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3005/api/products/${id}`
        );

        if (response.status === 404) {
          setError("找不到該商品");
          return;
        }

        if (!response.ok) {
          throw new Error("網路回應不正確");
        }

        const data = await response.json();

        // 處理標籤字串
        // data.tagList = data.tags ? data.tags.split(',').filter(Boolean) : [];
        setProduct(data);
      } catch (error) {
        console.error("獲取商品失敗:", error);
        setError(error.message || "無法載入商品資料");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 處理數量變更
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  // 載入中畫面
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
      </div>
    );
  }

  // 錯誤畫面
  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  // 商品不存在
  if (!product) return null;

  return (
    <>
      <div className="row mt-5">
        <div className="col-12 text-center">
          <h4 style={{ fontWeight: "700" }}>
            {name}
            <a href="#" className="btn">
              <IoMdHeartEmpty className="fs-4 ${styles.heart} text-danger" />
            </a>
          </h4>
        </div>
        <h6 class="col-12 text-center">${price}</h6>
        <div className="col-12 mt-2 text-center">
          商品數量 <QuantityAdjuster />
        </div>
      </div>

      <div className="row align-items-center g-2 mt-4 mb-2">
        <div className="col-2"></div>
        <div className="col-4 pe-5">
          <AddProduct />
        </div>
        <div className="col-4 ps-5">
          <a
            href="#"
            className="btn btn-success  w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 mt-auto "
          >
            切換至租借商品
          </a>
        </div>
        <div className="col-2"></div>
      </div>
    </>
  );
};

export default ProductDetailSideMobile;
