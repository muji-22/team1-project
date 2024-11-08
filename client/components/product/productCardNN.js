// components/product/ProductCard.js
import React, { useState, useEffect } from "react";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/router";
import Link from 'next/link';
import Swal from 'sweetalert2';
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
  
  const imageUrl = `http://localhost:3005/productImages/${id}/${id}-1.jpg`;

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated()) return;
      
      try {
        const response = await fetch(
          `http://localhost:3005/api/favorites/check/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setIsFavorited(data.data.isFavorited);
        }
      } catch (error) {
        console.error('檢查收藏狀態失敗:', error);
      }
    };

    checkFavoriteStatus();
  }, [id, isAuthenticated]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      Swal.fire({
        title: '請先登入',
        text: '需要登入才能收藏商品',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '前往登入',
        cancelButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/auth/login');
        }
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3005/api/favorites/${id}`,
        {
          method: isFavorited ? 'DELETE' : 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setIsFavorited(!isFavorited);
        Swal.fire({
          icon: 'success',
          title: isFavorited ? '已取消收藏' : '已加入收藏',
          showConfirmButton: false,
          timer: 1500,
          position: 'top-end',
          toast: true
        });
      } else {
        throw new Error('操作失敗');
      }
    } catch (error) {
      console.error('切換收藏狀態失敗:', error);
      Swal.fire({
        icon: 'error',
        title: '操作失敗',
        text: '請稍後再試',
        timer: 1500
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageError = (e) => {
    e.target.src = "/images/default-product.png";
    e.target.onerror = null;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      Swal.fire({
        title: '請先登入',
        text: '需要登入才能加入購物車',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '前往登入',
        cancelButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/auth/login');
        }
      });
      return;
    }
    
    if (isAdding) return;
    
    setIsAdding(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
          type: 'sale'
        })
      });

      const result = await response.json();

      if (response.ok) {
        updateCartCount();
        Swal.fire({
          icon: 'success',
          title: '已加入購物車',
          showConfirmButton: false,
          timer: 1500,
          position: 'top-end',
          toast: true
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
        timer: 1500
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="h-100">
      <Link href={`/product/${id}`} className="text-decoration-none">
        <div className={`card border-0 h-100 ${styles.card} position-relative`}>
          <button
            className={`btn btn-outline-danger border-0 position-absolute top-0 end-0 m-2 ${
              isLoading ? 'disabled' : ''
            }`}
            onClick={handleToggleFavorite}
            title={isFavorited ? "取消收藏" : "加入收藏"}
            disabled={isLoading}
          >
            {isFavorited ? (
              <IoMdHeart className="fs-4" />
            ) : (
              <IoMdHeartEmpty className="fs-4" />
            )}
          </button>
          <div className={styles.imgWrapper}>
            <img
              className={styles.productImage}
              src={imageUrl}
              onError={handleImageError}
              alt={name}
              loading="lazy"
            />
          </div>
          <div className="card-body d-flex flex-column">
            <h5 className={`card-title text-dark ${styles.productTitle}`}>{name}</h5>
            {description && (
              <p className="card-text text-truncate text-secondary">
                {description}
              </p>
            )}
            <div className="mt-auto">
              <div className={styles.priceContainer}>
                <span className={styles.currency}>NT</span>
                <span className={styles.price}>${price?.toLocaleString()}</span>
              </div>
              <button
                className={`btn btn-primary w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 ${styles.cartButton} ${
                  isAdding ? 'disabled' : ''
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
    </div>
  );
};

export default ProductCard;