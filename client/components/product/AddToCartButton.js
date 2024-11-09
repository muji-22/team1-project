import React, { useState } from 'react';
import { IoCartOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const AddToCartButton = ({ 
  productId,
  className, // 支援自定義樣式
  buttonText = "加入購物車", // 可自定義按鈕文字
  quantity = 1, // 預設數量
  type = "sale" // 預設類型
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const { isAuthenticated } = useAuth();
  const { updateCartCount } = useCart();
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
      const response = await fetch("http://localhost:3005/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          productId,
          quantity,
          type,
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