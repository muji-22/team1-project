import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import QuantityAdjuster from "@/components/product/quantityAdjuster";
import styles from "./productDetailSide.module.css";
import ProductDetailMainNotice from "./productDetailMainNotice2";
import AddToCartButton from "./AddToCartButton";
import { useAuth } from '@/contexts/AuthContext';
import FavoriteButton from "./FavoriteButton";
import Link from "next/link";

const ProductDetailSideMobile = ({
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
        <div className="col-12 text-center">
          <h4 style={{ fontWeight: "700" }}>
            {name}
            <FavoriteButton
            productId={id}
            isFavorited={isFavorited}
            setIsFavorited={setIsFavorited}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            className="btn"
          />
          </h4>
        </div>
        <h6 class="col-12 text-center">${price}</h6>
        <div className="col-12 mt-2 text-center">
          商品數量 <QuantityAdjuster />
        </div>
      </div>

      <div className="row align-items-center g-2 mt-4 mb-2">
        <div className="col mt-3 ">
        <AddToCartButton
            className="btn buttonCustomC w-100  gap-2" 
            productId={id}
            quantity={quantity}
          />
        </div>
        <div className="col mt-3 ">
        <Link
            href={`/rent/${id}`}
            className="btn btn-success w-100 rounded-pill d-flex align-items-center justify-content-center py-2"
          >
            切換至租借商品
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProductDetailSideMobile;
