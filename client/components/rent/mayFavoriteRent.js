// components/product/mayFavorite.js
import React, { useState, useEffect } from "react";
import RentCard from "./rentCard";

const MayFavoriteRent = ({ currentProduct }) => {
  const [recommendProducts, setRecommendProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendProducts = async () => {
      if (!currentProduct?.id) return;

      try {
        setLoading(true);
        
        // 獲取商品，設定 limit 參數來限制回傳數量
        const response = await fetch('http://localhost:3005/api/rents?limit=12');
        
        if (!response.ok) {
          throw new Error('獲取商品失敗');
        }

        const result = await response.json();
        
        // 從 result.data.products 取得商品列表
        const availableProducts = result.data.rents.filter(product => 
          product.id !== currentProduct.id && 
          product.valid === 1
        );

        // 如果沒有足夠的商品，直接返回全部
        if (availableProducts.length <= 4) {
          setRecommendProducts(availableProducts);
          return;
        }

        // 隨機選擇4個商品
        const randomProducts = [];
        const tempProducts = [...availableProducts];
        
        for (let i = 0; i < 4 && tempProducts.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * tempProducts.length);
          randomProducts.push(tempProducts[randomIndex]);
          tempProducts.splice(randomIndex, 1);
        }

        setRecommendProducts(randomProducts);
        console.log(randomProducts);
      } catch (error) {
        console.error("獲取推薦商品失敗:", error);
        setError(error.message || "無法載入推薦商品");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendProducts();
  }, [currentProduct]);

  if (loading) {
    return (
      <div className="container my-5">
        <h2 className="mb-4 text-center fw-bold">你可能也喜歡</h2>
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recommendProducts?.length) return null;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center fw-bold">你可能也喜歡</h2>
      <div className="row g-4 justify-content-center">
        {recommendProducts.map((rent) => (
          <div key={rent.id} className="col-xl-3 col-lg-3 col-md-6 col-sm-12">
            <RentCard
              {...rent}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MayFavoriteRent;