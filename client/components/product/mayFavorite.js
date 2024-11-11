// components/product/mayFavorite.js
import React, { useState, useEffect } from "react";
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
        
        const queryParams = new URLSearchParams({
          exclude: currentProduct.id,
          limit: 4,
          tags: currentProduct.category_tag || ''
        });

        const response = await fetch(
          `http://localhost:3005/api/products`  // 先使用一般的商品API
        );

        const data = await response.json();
        
        // 手動過濾和隨機選擇4個商品
        const filteredProducts = data
          .filter(p => p.id !== currentProduct.id)
          .filter(p => p.valid === 1);
          
        // 隨機打亂陣列
        const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
        
        // 取前4個
        const selected = shuffled.slice(0, 4);

        setRecommendProducts(selected);
        
      } catch (error) {
        console.error("獲取推薦商品失敗:", error);
        setError(error.message || "無法載入推薦商品");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendProducts();
  }, [currentProduct]);

  // 載入中狀態
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

  // 沒有推薦商品時不顯示區塊
  if (!recommendProducts?.length) return null;

  return (
    <div className="container my-5">
        <h2 className="mb-4 text-center fw-bold">你可能也喜歡</h2>
        <div className="row g-4 justify-content-center">
            {recommendProducts.slice(0, 4).map((product) => (
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