// components/product/ProductCard.js
import React, { useState, useEffect } from "react";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./productCard.module.css";

const ProductCard = ({
  id,
  name,
  price,
  description,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { updateCartCount } = useCart();
  const router = useRouter();

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

  // 處理加入購物車
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    if (isAdding) return;

    setIsAdding(true);
    try {
      const response = await fetch("http://localhost:3005/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
          type: "sale",
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        updateCartCount();
        alert("成功加入購物車！");
      } else {
        throw new Error(data.message || "加入購物車失敗");
      }
    } catch (error) {
      console.error("加入購物車錯誤:", error);
      alert(error.message || "加入購物車失敗");
    } finally {
      setIsAdding(false);
    }
  };

  // 處理收藏
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3005/api/favorites/${id}`,
        {
          method: isFavorited ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsFavorited(!isFavorited);
      } else {
        throw new Error("操作失敗");
      }
    } catch (error) {
      console.error("切換收藏狀態失敗:", error);
      alert("操作失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/product/${id}`} className="text-decoration-none">
      <div className={`card h-100 ${styles.card}`}>
        <div className="position-relative">
          {/* 收藏按鈕 */}
          <button
            className={`btn btn-outline-danger border-0 position-absolute top-0 end-0 m-2 z-1 ${
              isLoading ? "disabled" : ""
            }`}
            onClick={handleToggleFavorite}
            disabled={isLoading}
          >
            {isFavorited ? (
              <IoMdHeart className="fs-4" />
            ) : (
              <IoMdHeartEmpty className="fs-4" />
            )}
          </button>
          
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
          <p className="card-text text-secondary text-truncate">{description}</p>
          
          <div className="mt-auto">
            <p className="card-text fs-5 mb-2 text-primary">
              NT$ {price?.toLocaleString()}
            </p>
            
            {/* 加入購物車按鈕 */}
            <button
              className={`btn btn-primary w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 ${
                isAdding ? "disabled" : ""
              }`}
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  加入中...
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  加入購物車 <FaCartPlus size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;