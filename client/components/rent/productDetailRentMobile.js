import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./productDetailRent.module.css";
import QuantityAdjuster from "@/components/product/quantityAdjuster";
import DayAdjuster from "@/components/rent/dayAdjuster";
import AddToCartButton from "../product/AddToCartButton";
import { useAuth } from '@/contexts/AuthContext';
import FavoriteButton from "./FavoriteButton";
import Link from "next/link";

const ProductDetailSideMobile = ({
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
      <div class="row mt-5">
        <div class="col-12 text-center">
          <h4 style={{ fontWeight: "700" }}>
            {name}
            <FavoriteButton
            productId={id}
            isFavorited={isFavorited}
            setIsFavorited={setIsFavorited}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            className="btn"
          />
          </h4>
        </div>
        <h5 class="col-6 text-center">押金${deposit}</h5>
        <h5 class="col-6 text-center">租金{rental_fee}/天$</h5>
        <div className="col-12 mt-3 text-center">
          商品數量<QuantityAdjuster 
            value={quantity}
            onChange={handleQuantityChange}
          />
        </div>
        <div className="col-12 mt-3 text-center">
        租借天數 
          <DayAdjuster 
            value={days}
            onChange={handleDaysChange}
          />
        </div>
        <h5 className="col-12 mt-4 text-center">總價${(deposit+rental_fee*days)*quantity}</h5>
      </div>

      <div className="row align-items-center g-2 mt-4 mb-2">
        <div className="col-6 pe-5">
        <AddToCartButton
            className="btn buttonCustomC w-100  gap-2" 
            productId={id}
            quantity={quantity}
            days={days}
            deposit={deposit}
            rental_fee={rental_fee}
          />
        </div>
        <div className="col-6 ps-5">
        <Link
            href={`/product/${id}`}
            className="btn btn-success w-100 rounded-pill d-flex align-items-center justify-content-center py-2"
          >
            切換至購買商品
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProductDetailSideMobile;
