import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import QuantityAdjuster from "@/components/product/quantityAdjuster";
import styles from "./productDetailSide.module.css";
import AddProduct from "@/components/cart/addProduct";
import AddFavProduct from "@/components/cart/addFavProduct";

const ProductDetailSide = ({
  
  name,
  price,
  descrition, // 注意：資料庫中的欄位名稱是 descrition
  min_age,
  min_users,
  max_users,
  playtime,
  onAddToCart,
  onAddToWishlist,
}) => {
  const router = useRouter();
    const { id } = router.query;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 獲取商品資料
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:3005/api/products/${id}`
                );

                if (response.status === 404) {
                    setError("找不到該商品");
                    return;
                }

                if (!response.ok) {
                    throw new Error("網路回應不正確");
                }

                const data = await response.json();

                // 處理標籤字串
                data.tagList = data.tags ? data.tags.split(",") : [];
                setProduct(data);
            } catch (error) {
                console.error("獲取商品失敗:", error);
                setError(error.message || "無法載入商品資料");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // 載入中畫面
    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "50vh" }}
            >
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">載入中...</span>
                </div>
            </div>
        );
    }

    // 錯誤畫面
    if (error) {
        return (
            <div className="alert alert-danger m-3" role="alert">
                {error}
            </div>
        );
    }

    // 商品不存在
    if (!product) return null;
  return (
    <>
      <div class="row">
        <div class="col-9">
          <h4 style={{ fontWeight: "700" }}>{name}</h4>
        </div>
        <div class="col-3">
          <a href="#" className="btn">
            <IoMdHeartEmpty className="fs-4 ${styles.heart} text-danger" />
          </a>
        </div>
        <h5 class="col-3">${price}</h5>
        <div class="col-9 mt-3"></div>
        <div className="col-8 mt-3">
          商品數量 <QuantityAdjuster />
        </div>
      </div>

      <div className="row align-items-center g-2 mt-4 mb-2">
        <div className="col-sm-5">
          <AddProduct />
        </div>
        <div className="col-sm-5">
          <a
            href="#"
            className="btn btn-success  w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 mt-auto "
          >
            切換至租借商品
          </a>
        </div>
      </div>

      {/* 商品敘述 */}
      <p className="mt-5">{descrition}</p>

      <div class="row mt-4">
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
