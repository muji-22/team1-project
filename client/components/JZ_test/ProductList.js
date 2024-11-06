import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({}); // 新增圖片狀態
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        // 取得每個商品的圖片資料
        const imagesData = {};
        for (const product of data) {
          const imageResponse = await fetch(
            `http://localhost:3005/api/product-images/${product.id}`
          );
          if (imageResponse.ok) {
            const images = await imageResponse.json();
            imagesData[product.id] = images;
          }
        }
        setProductImages(imagesData);
      } catch (error) {
        console.error("獲取資料失敗:", error);
        setError("無法載入資料，請稍後再試");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (productId) => {
    // 處理加入購物車邏輯
    console.log("加入購物車:", productId);
    // 這裡可以加入購物車的API呼叫
  };

  const handleAddToWishlist = (productId) => {
    // 處理加入收藏邏輯
    console.log("加入收藏:", productId);
    // 這裡可以加入收藏的API呼叫
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

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
          <h3>目前沒有商品</h3>
        </div>
      ) : (
        <div className="row">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              images={productImages[product.id] || []}  // 傳遞圖片資料
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
