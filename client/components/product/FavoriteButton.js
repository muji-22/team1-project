// components/product/FavoriteButton.js
import React, { useState, useEffect } from 'react';
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import styles from "./productCard.module.css";

const FavoriteButton = ({ productId, className }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // 檢查收藏狀態
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated()) return;
      
      try {
        const response = await fetch(
          `http://localhost:3005/api/favorites/check/${productId}`,
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
  }, [productId, isAuthenticated]);

  // 新增：監聽收藏移除事件
  useEffect(() => {
    const handleFavoriteRemove = (e) => {
      if(e.detail.productId === productId) {
        setIsFavorited(false);
      }
    };

    window.addEventListener('favoriteRemoved', handleFavoriteRemove);
    
    return () => {
      window.removeEventListener('favoriteRemoved', handleFavoriteRemove);
    };
  }, [productId]);

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
        `http://localhost:3005/api/favorites/${productId}`,
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
      toast.error("加入收藏失敗，請稍後再試", {
        position: "bottom-center",
        autoClose: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${className} ${isLoading ? "pe-none opacity-50" : "pe-auto"}`}
      onClick={handleToggleFavorite}
      role="button"
    >
      {isFavorited ? (
        <IoMdHeart className={`fs-3 text-danger ${styles.favoriteIcon}`} />
      ) : (
        <IoMdHeartEmpty className={`fs-3 text-danger ${styles.favoriteIcon}`} />
      )}
    </div>
  );
};

export default FavoriteButton;