// components/product/mayFavorite.js
import React, { useState, useEffect } from "react";  // 加入這行
import ProductCard from "@/components/product/productCard";

const MayFavorite = ({ currentProduct }) => {
  const [recommendProducts, setRecommendProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendProducts = async () => {
      if (!currentProduct?.id) return;

      try {
        setLoading(true);
        
        const strategies = [
          `/recommendations/by-tags/${currentProduct.id}`,
          `/recommendations/by-price/${currentProduct.id}?price=${currentProduct.price}`,
          `/recommendations/by-features/${currentProduct.id}?min_users=${currentProduct.min_users}&max_users=${currentProduct.max_users}&min_age=${currentProduct.min_age}`
        ];

        const strategy = strategies[Math.floor(Math.random() * strategies.length)];
        
        const response = await fetch(`http://localhost:3005/api${strategy}`);
        
        if (!response.ok) {
          throw new Error(`推薦請求失敗: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status === 'success' && Array.isArray(result.data)) {
          setRecommendProducts(result.data);
        } else {
          throw new Error('無效的回應格式');
        }

      } catch (error) {
        console.error("獲取推薦商品失敗:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendProducts();
  }, [currentProduct]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
      </div>
    );
  }

  if (error || !recommendProducts.length) {
    console.log('無推薦商品或發生錯誤:', error);
    return null;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center fw-bold">你可能也喜歡</h2>
      <div className="row g-4 justify-content-center">
        {recommendProducts.map((product) => (
          <div key={product.id} className="col-xl-3 col-lg-3 col-md-6 col-sm-12">
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              description={product.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MayFavorite;