import React from 'react';
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import styles from "./productCard.module.css";

const FavoriteButton = ({ 
  productId, 
  isFavorited, 
  setIsFavorited, 
  isLoading, 
  setIsLoading,
  className // 新增className prop以支援自定義樣式
}) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

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
      console.error("切換收藏狀態失敗:", error);
      alert("操作失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${className} ${isLoading ? "pe-none" : "pe-auto"}`}
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