// components/product/productDetailSide.js
import React, { useState, useEffect } from "react";
import QuantityAdjuster from "@/components/product/quantityAdjuster";
import DayAdjuster from "@/components/rent/dayAdjuster";
import style from "./productDetailRent.module.css";
import AddToCartButton from "../product/AddToCartButton";
import { useAuth } from '@/contexts/AuthContext';
import FavoriteButton from "./FavoriteButton";
import Link from "next/link";

const ProductDetailRent = ({
  id,
  name,
  price,
  deposit,
  rental_fee,
  description,
  min_age,
  min_users,
  max_users,
  playtime,
}) => {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [days, setDays] = useState(3);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleDaysChange = (newDays) => {
    setDays(newDays);
  };

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
        <div className="col-11">
          <h3 className={`${style.name}`}>(租借){name}</h3>
        </div>
        <div className="col-1 text-end">
          <FavoriteButton
            productId={id}
            isFavorited={isFavorited}
            setIsFavorited={setIsFavorited}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            className="btn"
          />
        </div>
        <h5 className={`col-12 ${style.deposit}`}>押金${deposit}</h5>
        <h5 className={`col-12 ${style.rental_fee}`}>租金${rental_fee}/天</h5>
        <div className="col-8 mt-3">
          商品數量 
          <QuantityAdjuster   
            value={quantity}
            onChange={handleQuantityChange}
          />
        </div><div className="col-8 mt-3">
          租借天數:最少三天，加入購物車後選擇天數
        </div>
        <h4 className={`col-4 mt-3 text-end ${style.total}`}>總價${(deposit+rental_fee*days)*quantity}</h4>
      </div>

      <div className="row align-items-center g-2 mt-4 mb-2">
        <div className="col-sm-6">
          <AddToCartButton
            className="btn buttonCustomC w-100  gap-2" 
            productId={id}
            quantity={quantity}
            days={days}
            deposit={deposit}
            rental_fee={rental_fee}
            type="rental"
          />
        </div>
        <div className="col-sm-6">
          <Link
            href={`/product/${id}`}
            className="btn btn-success w-100 rounded-pill d-flex align-items-center justify-content-center py-2"
          >
            切換至購買商品
          </Link>
        </div>
      </div>

      <p className="mt-5">{description}</p>

      <div className="row mt-4">
        <p className={`${style.subtitle}`}>規格</p>
        <div></div>

        <div className={`mt-3 ${style.subtitle}`}>最少玩家人數</div>
        <div>
          <p>{min_users}</p>
        </div>

        <div className={`${style.subtitle}`}>最多玩家人數</div>
        <div>
          <p>{max_users}</p>
        </div>

        <div className={`${style.subtitle}`}>建議年齡</div>
        <div>
          <p>{min_age}</p>
        </div>

        <div className={`${style.subtitle}`}>平均遊玩時長</div>
        <div>
          <p>{playtime}分鐘</p>
        </div>
      </div>
    </>
  );
};

export default ProductDetailRent;