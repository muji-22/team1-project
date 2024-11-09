// components/product/ProductCard.js
import React, { useState, useEffect } from "react";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./productCard.module.css";
import { toast } from "react-toastify";

const ProductCard = ({ id, name, price, description }) => {
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
        toast.success("成功加入購物車！", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          progress: undefined,
          icon: <FaCheckCircle size={30} style={{ color: "#40CBCE" }} />,
          progressStyle: { backgroundColor: "#40CBCE" },
        });
      } else {
        throw new Error(data.message || "加入購物車失敗");
      }
    } catch (error) {
      console.error("加入購物車錯誤:", error);
      toast.error("加入購物車失敗，請稍後再試", {
        autoClose: 1500,
      });
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
              <div
                className={`pe-2  ${isLoading ? "pe-none" : "pe-auto"}`}
                onClick={handleToggleFavorite}
                role="button"
              >
                {isFavorited ? (
                  <IoMdHeart
                    className={`fs-3 text-danger ${styles.favoriteIcon}`}
                  />
                ) : (
                  <IoMdHeartEmpty
                    className={`fs-3 text-danger ${styles.favoriteIcon}`}
                  />
                )}
              </div>
            </div>

            {/* 加入購物車按鈕 */}
            <button
              className={`btn buttonCustomC w-100  d-flex align-items-center justify-content-center gap-2 ${
                isAdding ? "disabled" : ""
              }`}
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  加入中...
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  加入購物車 <IoCartOutline size={25} />
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
