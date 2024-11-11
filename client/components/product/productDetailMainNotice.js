import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import QuantityAdjuster from "@/components/product/quantityAdjuster";
import AddProduct from "@/components/cart/addProduct";
import AddFavProduct from "@/components/cart/addFavProduct";
import styles from "./productDetailNotice.module.css";

const ProductDetailNotice = ({
  name,
  price,
  description, // 注意：資料庫中的欄位名稱是 descrition
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
      <div className={`row mt-5 `}>
        <div className={`${styles.noticeLine}`}>
          <h5 className="mt-2">說明</h5>
        </div>

        <p className="mt-5">{description}</p>
      </div>
    </>
  );
};

export default ProductDetailNotice;
