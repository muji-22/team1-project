// components/product/ProductList.js
import React, { useState, useEffect } from "react";
import ProductCard from "@/components/product/productCard";
import { useAuth } from "@/contexts/AuthContext";
import Pagination from "@/components/product/Pagination";

function ProductList({ 
  filters, 
  currentPage, 
  totalPages, 
  setTotalPages, 
  onPageChange 
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        
        // 加入分頁參數
        queryParams.append('page', currentPage);
        queryParams.append('limit', ITEMS_PER_PAGE);
        
        // 加入篩選條件
        if (filters?.search) {
          queryParams.append('search', filters.search);
        }
        if (filters?.gametypes?.length > 0) {
          queryParams.append('gametypes', JSON.stringify(filters.gametypes));
        }
        if (filters?.players) {
          queryParams.append('players', filters.players);
        }
        if (filters?.playtime) {
          queryParams.append('playtime', filters.playtime);
        }
        if (filters?.age) {
          queryParams.append('age', filters.age);
        }
        if (filters?.price?.min) {
          queryParams.append('price_min', filters.price.min);
        }
        if (filters?.price?.max) {
          queryParams.append('price_max', filters.price.max);
        }
        if (filters?.sortPrice) {
          queryParams.append('sort_price', filters.sortPrice);
        }

        const response = await fetch(
          `http://localhost:3005/api/products?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error("網路回應不正確");
        }

        const result = await response.json();

        if (result.status === 'success') {
          setProducts(result.data.products);
          setTotalPages(result.data.pagination.total_pages);
        } else {
          throw new Error(result.message || "獲取商品失敗");
        }

      } catch (error) {
        console.error("獲取商品失敗:", error);
        setError("無法載入商品資料");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, currentPage]); // 當篩選條件或頁碼改變時重新獲取數據

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

  return (
    <div className="container py-4">
      {products.length === 0 ? (
        <div className="text-center">
          <h3>沒有符合條件的商品</h3>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {products.map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-xl-3">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
          
          {/* 分頁導航 */}
          {totalPages > 1 && (
            <div className="mt-5">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductList;