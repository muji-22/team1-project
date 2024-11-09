// components/product/productDetailSide.js
import React, { useState, useEffect } from "react";
import QuantityAdjuster from "@/components/product/quantityAdjuster";
import styles from "./productDetailSide.module.css";
import AddToCartButton from "./AddToCartButton";
import { useAuth } from '@/contexts/AuthContext';
import FavoriteButton from "./FavoriteButton";
import Link from "next/link";

const ProductDetailSide = ({
  id,
  name,
  price,
  description,
  min_age,
  min_users,
  max_users,
  playtime,
  quantity,
  onQuantityChange,
}) => {
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
    <>
      <div className="row">
        <div className="col-9">
          <h4 style={{ fontWeight: "700" }}>{name}</h4>
        </div>
        <div className="col-3">
          <FavoriteButton
            productId={id}
            isFavorited={isFavorited}
            setIsFavorited={setIsFavorited}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            className="btn"
          />
        </div>
        <h5 className="col-3">${price}</h5>
        <div className="col-9 mt-3"></div>
        <div className="col-8 mt-3">
          商品數量 
          <QuantityAdjuster 
            value={quantity}
            onChange={onQuantityChange}
          />
        </div>
      </div>

      <div className="row align-items-center g-2 mt-4 mb-2">
        <div className="col-sm-5">
          <AddToCartButton
            className="btn buttonCustomC w-100  gap-2" 
            productId={id}
            quantity={quantity}
          />
        </div>
        <div className="col-sm-5">
          <Link
            href={`/rent/${id}`}
            className="btn btn-success w-100 rounded-pill d-flex align-items-center justify-content-center py-2"
          >
            切換至租借商品
          </Link>
        </div>
      </div>

      <p className="mt-5">{description}</p>

      <div className="row mt-4">
        <p className={`${styles.subtitle}`}>規格</p>
        <div></div>

        <div className={`mt-3 ${styles.subtitle}`}>最少玩家人數</div>
        <div>
          <p>{min_users}</p>
        </div>

        <div className={`${styles.subtitle}`}>最多玩家人數</div>
        <div>
          <p>{max_users}</p>
        </div>

        <div className={`${styles.subtitle}`}>建議年齡</div>
        <div>
          <p>{min_age}</p>
        </div>

        <div className={`${styles.subtitle}`}>平均遊玩時長</div>
        <div>
          <p>{playtime}分鐘</p>
        </div>
      </div>
    </>
  );
};

export default ProductDetailSide;