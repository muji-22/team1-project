// pages/product/[id].js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import style from "@/styles/productDetail.module.css";
import ProductDetailRent from "@/components/rent/productDetailRent";
import ProductDetailRentMobile from "@/components/rent/productDetailRentMobile";
import ProductDetailMainNotice from "@/components/product/productDetailMainNotice";
import ProductDetailMainNotice2 from "@/components/product/productDetailMainNotice2";
import MayFavorite from "@/components/product/mayFavorite";
import AddProduct from "@/components/cart/addProduct";
import Breadcrumb from "@/components/Breadcrumb";
import RentNotice from "@/components/rent/rentNotice";
import RentNotice2 from "@/components/rent/rentNotice2";
import MayFavoriteRent from "@/components/rent/mayFavoriteRent";
import AddToCartButton from "@/components/product/AddToCartButton";
import { useAuth } from '@/contexts/AuthContext';
import FavoriteButton from "@/components/rent/FavoriteButton";
import Link from "next/link";

function ProductRent() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 新增數量管理狀態
  const [quantity, setQuantity] = useState(1);
  const [days, setDays] = useState(3);

  // 獲取商品資料
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3005/api/rents/${id}`
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

  const handleDaysChange = (newDays) => {
    setDays(newDays);
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
    <div className="container mt-3">
      {/* 麵包屑 */}            
      <Breadcrumb
        items={[
          { label: "首頁", href: "/" },
          { label: "商品租賃", href: "/rents" },
          { label: `${product.name}`, active: true },
        ]}
      />


      {/* 內容區 */}
      <div className={`row mainContain ${style.mainContain}`}>
        {/* 左側商品圖片區 */}
        <div className="col-md-12 col-lg-6">
          <div id="carouselExampleIndicators" className="carousel slide">
            <div className="carousel-indicators">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to={index}
                  className={`${index === 0 ? "active" : ""} ${
                    style.carouselBtn
                  }`}
                  aria-current={index === 0 ? "true" : "false"}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

            <div
              className={`carousel-inner img-fluid ${style.productImgContainer}`}
            >
              {[1, 2, 3].map((num, index) => (
                <div
                  key={num}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={`http://localhost:3005/productImages/${product.id}/${product.id}-${num}.jpg`}
                    className="d-block w-100"
                    alt={`${product.name} ${num}`}
                    onError={(e) => {
                      e.target.src = "/images/default-product.png";
                    }}
                  />
                </div>
              ))}
            </div>

            {/* 輪播控制按鈕 */}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span
                className={`carousel-control-prev-icon ${style.prevBtn}`}
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span
                className={`carousel-control-next-icon ${style.nextBtn}`}
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        {/* 右側商品資訊 */}
        <div
          className={`d-none d-lg-block col-md-12 col-lg-6 ${style.rightSide}`}
        >
          <ProductDetailRent
            id={product.id}
            name={product.name}
            price={product.price}
            deposit={product.deposit}
            rental_fee={product.rental_fee}
            description={product.description}
            min_age={product.min_age}
            min_users={product.min_users}
            max_users={product.max_users}
            playtime={product.playtime}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            onDaysChange={handleDaysChange}
          />
        </div>
        <div className={`d-lg-none col-md-12 col-lg-6 ${style.rightSide}`}>
          <ProductDetailRentMobile
            id={product.id}
            name={product.name}
            price={product.price}
            deposit={product.deposit}
            rental_fee={product.rental_fee}
            description={product.description}
            min_age={product.min_age}
            min_users={product.min_users}
            max_users={product.max_users}
            playtime={product.playtime}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            onDaysChange={handleDaysChange}
          />
        </div>
      </div>

      {/* 說明及規格 */}
      <div className={`d-block d-lg-none col-md-12 col-lg-6`}>
        <ProductDetailMainNotice
          name={product.name}
          price={product.price}
          description={product.description}
          min_age={product.min_age}
          min_users={product.min_users}
          max_users={product.max_users}
          playtime={product.playtime}
        />
        <ProductDetailMainNotice2
          name={product.name}
          price={product.price}
          description={product.description}
          min_age={product.min_age}
          min_users={product.min_users}
          max_users={product.max_users}
          playtime={product.playtime}
        />
      </div>

      {/* 注意事項 */}
      <RentNotice/>
      <RentNotice2/>

      {/* 可能喜歡 */}
      <div className="d-flex justify-content-center">
      <MayFavoriteRent currentProduct={product} />
      </div>
    </div>
  );
}

export default ProductRent;