// components/product/ProductList.js
import React, { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useAuth } from "@/contexts/AuthContext";

function ProductList({ filters }) {  // 新增 filters 參數
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // 取得商品列表
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // 構建查詢參數
        const queryParams = new URLSearchParams();
        
        // 搜尋關鍵字
        if (filters?.search) {
          queryParams.append('search', filters.search);
        }

        // 遊戲類型
        if (filters?.gametypes?.length > 0) {
          queryParams.append('gametypes', JSON.stringify(filters.gametypes));
        }

        // 人數範圍
        if (filters?.players) {
          queryParams.append('players', filters.players);
        }

        // 遊玩時間
        if (filters?.playtime) {
          queryParams.append('playtime', filters.playtime);
        }

        // 適合年齡
        if (filters?.age) {
          queryParams.append('age', filters.age);
        }

        // 價格範圍
        if (filters?.price?.min) {
          queryParams.append('price_min', filters.price.min);
        }
        if (filters?.price?.max) {
          queryParams.append('price_max', filters.price.max);
        }

        // 發送 API 請求
        const response = await fetch(
          `http://localhost:3005/api/products?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error("網路回應不正確");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("獲取商品失敗:", error);
        setError("無法載入商品資料");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]); // 當 filters 改變時重新獲取資料

  // 載入中畫面
  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // 錯誤畫面
  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  // 主要的商品列表畫面
  return (
    <div className="container py-4">
      {products.length === 0 ? (
        <div className="text-center">
          <h3>沒有符合條件的商品</h3>
        </div>
      ) : (
        <div className="row g-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="col-6 col-lg-3"
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;