// components/product/productDetailSide.js
import React, { useState, useEffect } from "react";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import QuantityAdjuster from "@/components/product/quantityAdjuster";
import styles from "./productDetailSide.module.css";
import AddProduct from "@/components/cart/addProduct";
import { useAuth } from '@/contexts/AuthContext';
import Swal from "sweetalert2";
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
  const [isFavorite, setIsFavorite] = useState(false);

  // 檢查是否已收藏
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !id) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:3005/api/favorites/check/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.data.isFavorited);
        }
      } catch (error) {
        console.error('檢查收藏狀態失敗:', error);
      }
    };

    checkFavorite();
  }, [id, user]);

  // 處理收藏/取消收藏
  const handleFavorite = async () => {
    if (!user) {
      Swal.fire({
        title: '請先登入',
        text: '需要登入才能收藏商品',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '前往登入',
        cancelButtonText: '取消'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = isFavorite ? 'DELETE' : 'POST';
      
      const response = await fetch(
        `http://localhost:3005/api/favorites/${id}`,
        {
          method: method,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        setIsFavorite(!isFavorite);
        Swal.fire({
          title: isFavorite ? '已取消收藏' : '已加入收藏',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('收藏操作失敗:', error);
      Swal.fire({
        title: '操作失敗',
        text: '請稍後再試',
        icon: 'error',
      });
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-9">
          <h4 style={{ fontWeight: "700" }}>{name}</h4>
        </div>
        <div className="col-3">
          <button 
            onClick={handleFavorite} 
            className="btn"
            aria-label={isFavorite ? "取消收藏" : "加入收藏"}
          >
            {isFavorite ? (
              <IoMdHeart className="fs-4 text-danger" />
            ) : (
              <IoMdHeartEmpty className="fs-4 text-danger" />
            )}
          </button>
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
          <AddProduct 
            productId={id}
            quantity={quantity}
          />
        </div>
        <div className="col-sm-5">
        <Link
  href={`/rent/${id}`}  // 假設租借商品的路由是 /rent/[id]
  className="btn btn-success w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 mt-auto"
>
  切換至租借商品
</Link>
        </div>
      </div>

      {/* 商品敘述 */}
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