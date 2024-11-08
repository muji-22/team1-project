// components/cart/addProduct.js
import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/router';
import style from '@/components/cart/addProduct.module.css';

export default function AddProduct({ quantity, productId }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { updateCartCount } = useCart();
  const router = useRouter();

  const handleAddToCart = async () => {
    // 檢查是否登入
    if (!user) {
      Swal.fire({
        title: '請先登入',
        text: '需要登入才能加入購物車',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '前往登入',
        cancelButtonText: '取消',
        backdrop: `rgba(45, 172, 174, 0.55)`,
        width: '35%',
        padding: '0 0 3em',
        customClass: {
          popup: 'swal-popup',
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/auth/login');
        }
      });
      return;
    }

    // 檢查數量
    if (quantity <= 0) {
      Swal.fire({
        icon: 'error',
        title: '加入購物車失敗',
        text: '數量不能為零',
        showConfirmButton: false,
        timer: 1500,
        backdrop: `rgba(45, 172, 174, 0.55)`,
        width: '35%',
        padding: '0 0 3em',
        customClass: {
          popup: 'swal-popup',
        }
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          quantity,
          type: 'sale'
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        updateCartCount(); // 更新購物車數量
        
        Swal.fire({
          icon: 'success',
          title: '加入購物車成功',
          showConfirmButton: false,
          timer: 1500,
          backdrop: `rgba(45, 172, 174, 0.55)`,
          width: '35%',
          padding: '0 0 3em',
          customClass: {
            popup: 'swal-popup',
          }
        });
      } else {
        throw new Error(result.message || '加入購物車失敗');
      }
    } catch (error) {
      console.error('加入購物車錯誤:', error);
      Swal.fire({
        icon: 'error',
        title: '加入購物車失敗',
        text: error.message || '請稍後再試',
        showConfirmButton: false,
        timer: 1500,
        backdrop: `rgba(45, 172, 174, 0.55)`,
        width: '35%',
        padding: '0 0 3em',
        customClass: {
          popup: 'swal-popup',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`cart-btn w-auto btn ${style.cartBGc} d-flex align-items-center justify-content-center gap-2`}
      onClick={handleAddToCart}
      disabled={loading}
      aria-label="加入購物車"
    >
      {loading ? (
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <>
          加入購物車
          <FaShoppingCart className="mx-2" />
        </>
      )}
    </button>
  );
}