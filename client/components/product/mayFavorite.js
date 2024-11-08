import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import MayFavoriteProductCard from "./mayFavoriteProductCard"; // 確保路徑正確
import AddFavProduct from "@/components/cart/addFavProduct";
import { IoMdHeartEmpty } from "react-icons/io";

const MayFavorite = () => {
  const router = useRouter();
  // const { id } = router.query;
  const randomId = Math.floor(Math.random() * 548);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 獲取商品資料
  useEffect(() => {
    const fetchProduct = async () => {
      if (!randomId) return;

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3005/api/products/${randomId}`
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
  }, []);

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
      <div className="col-9">
        <h2 className="mb-4 text-center">你可能也喜歡</h2>
        <div className="row">
          <MayFavoriteProductCard
            name={product.name}
            price={product.price}
            salePrice={product.salePrice}
          />
          <MayFavoriteProductCard
            name={product.name}
            price={product.price}
            salePrice={product.salePrice}
          />
          <MayFavoriteProductCard
            name={product.name}
            price={product.price}
            salePrice={product.salePrice}
          />
          <MayFavoriteProductCard
            name={product.name}
            price={product.price}
            salePrice={product.salePrice}
          />
        </div>
      </div>
    </>
  );
};

export default MayFavorite;
