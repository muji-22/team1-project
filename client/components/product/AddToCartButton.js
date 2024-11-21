// components/product/AddToCartButton.js
import React, { useState } from 'react';
import { IoCartOutline } from "react-icons/io5";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/router";

const AddToCartButton = ({ 
  productId,
  className,
  buttonText = "加入購物車",
  quantity = 1,
  type = "sale" // 'sale' 或 'rental'
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

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
      await addToCart(productId, quantity, type);
    } catch (error) {
      console.error("加入購物車錯誤:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      className={`btn d-flex align-items-center justify-content-center gap-2 ${className} ${
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
          {buttonText} <IoCartOutline size={25} />
        </>
      )}
    </button>
  );
};

export default AddToCartButton;