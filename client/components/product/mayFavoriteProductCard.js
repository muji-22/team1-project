import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IoMdHeartEmpty } from "react-icons/io";
import styles from "./productCard.module.css";
import { FaCartPlus } from "react-icons/fa";
import AddFavProduct from "@/components/cart/addFavProduct";

const MayFavoriteProductCard = ({
  name,
  price,
  onSale,
  salePrice,
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
  const random = Math.floor(Math.random() * 548);
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
        data.tagList = data.tags ? data.tags.split(",") : [];
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
      {/* 修改 col 寬度為 col-lg-3 (一排四個) */}
      <div className="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center">
        <div className={`card border-0 ${styles.card}`}>
          <img
            src={`http://localhost:3005/productImages/${product.id}/${product.id}-1.jpg`}
            className={`card-img-top ${styles.img}`}
            alt="產品圖片"
          />
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <p className="card-text price origin text-danger">
              <del>{salePrice}</del>
            </p>
            <div className="row align-items-center g-2 mb-2">
              <div className="col">
                <p className="card-text price mb-0">{price}</p>
              </div>
              <div className="col-auto">
                <a href="#" className="btn">
                  <IoMdHeartEmpty className="fs-4 ${styles.heart} text-danger" />
                </a>
              </div>
            </div>
            <AddFavProduct />
          </div>
        </div>
      </div>
    </>
  );
};

export default MayFavoriteProductCard;
