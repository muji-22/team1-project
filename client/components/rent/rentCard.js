// components/rent/RentCard.js
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../product/productCard.module.css";
import AddToCartButton from "./AddToCartButton";
import { useAuth } from '@/contexts/AuthContext';
import FavoriteButton from "./FavoriteButton";

const RentCard = ({
  id,
  name,
  rental_fee,
  deposit,
  description,
  min_users,
  max_users,
  playtime,
  tags = [],
  className,
}) => {
  // 遊戲時間對照表
  const playtimeMap = {
    15: "15分鐘",
    30: "30分鐘",
    60: "60分鐘",
    "60+": "60分鐘以上",
  };
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 檢查收藏狀態
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) return;

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
  }, [id, user]);

  return (
    <Link href={`/rent/${id}`} className="text-decoration-none">
      <div className={`card h-100 ${styles.card} ${className || ""}`}>
        <div className="position-relative">
          {/* 商品圖片 */}
          <div className={`position-relative ${styles.imageContainer}`}>
            <img
              src={`http://localhost:3005/productImages/${id}/${id}-1.jpg`}
              className={`card-img-top ${styles.productImage}`}
              alt={name}
              onError={(e) => {
                e.target.src =
                  "http://localhost:3005/productImages/default-product.png";
              }}
            />
          </div>
        </div>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-dark">{name}</h5>
          <p className="card-text text-secondary text-truncate">
            {description || "無商品描述"}
          </p>

          <div className="mt-auto d-flex justify-content-between align-items-center">
            {/* 租金資訊 */}
            <div className="mb-2">
              <p className="card-text mb-1">
                租金：
                <span className="fw-bold">
                  NT$ {(rental_fee || 0).toLocaleString()}
                </span>{" "}
                /天
              </p>
              <p className="card-text small text-muted">
                押金：NT$ {(deposit || 0).toLocaleString()}
              </p>
            </div>
            {/* 收藏按鈕 */}
            <FavoriteButton productId={id} className="pe-2" />
          </div>

          {/* 加入購物車按鈕 */}
          <AddToCartButton
            productId={id}
            className="buttonCustomC w-100 text-nowrap"
            type="rental"
          />
        </div>
      </div>
    </Link>
  );
};

export default RentCard;
