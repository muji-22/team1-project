// components/product/ProductCard.js
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./productCard.module.css";
import FavoriteButton from "./FavoriteButton";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ id, name, price, description }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated } = useAuth();

  // 圖片路徑構建
  const imageUrl = `http://localhost:3005/productImages/${id}/${id}-1.jpg`;

  // 檢查收藏狀態
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated()) return;

      try {
        const response = await fetch(
          `http://localhost:3005/api/favorites/check/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setIsFavorited(data.data.isFavorited);
        }
      } catch (error) {
        console.error("檢查收藏狀態失敗:", error);
      }
    };

    checkFavoriteStatus();
  }, [id, isAuthenticated]);

  return (
    <Link href={`/product/${id}`} className="text-decoration-none">
      <div className={`card h-100 ${styles.card}`}>
        <div className="position-relative">
          {/* 商品圖片 */}
          <div className={`position-relative ${styles.imageContainer}`}>
            <img
              src={imageUrl}
              className={`card-img-top ${styles.productImage}`}
              alt={name}
              onError={(e) => {
                e.target.src = "/productImages/default-product.png";
              }}
            />
          </div>
        </div>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-dark">{name}</h5>
          <p className="card-text text-secondary text-truncate">
            {description}
          </p>

          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center">
              {/* 商品價格 */}
              <span className="card-text fs-5 m-2">
                NT$ {price?.toLocaleString()}
              </span>

              {/* 收藏按鈕 */}
              <FavoriteButton
                productId={id}
                isFavorited={isFavorited}
                setIsFavorited={setIsFavorited}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                className="pe-2"
              />
            </div>

            {/* 加入購物車按鈕 */}
            <AddToCartButton
              productId={id}
              className="buttonCustomC w-100"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;