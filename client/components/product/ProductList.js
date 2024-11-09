// components/product/ProductList.js
import React, { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useAuth } from "@/contexts/AuthContext";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // 取得商品列表
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3005/api/products");
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
  }, []);

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
          <h3>目前沒有商品</h3>
        </div>
      ) : (
        <div className="row g-4"> {/* 使用 g-4 設定間距 */}
          {products.map((product) => (
            <div 
              key={product.id} 
              className="col-6 col-lg-3" // col-6 在手機是2欄，col-lg-3 在PC是4欄
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