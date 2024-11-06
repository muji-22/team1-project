import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateCartCount } = useCart();
  const { user } = useAuth();

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

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('請先登入會員');
      window.location.href = '/auth/login';
      return;
    }

    try {
      const response = await fetch('http://localhost:3005/api/cart/items', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // 加入 token
        },
        body: JSON.stringify({
          productId: productId,
          quantity: 1
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        alert('成功加入購物車！');
        updateCartCount();
      } else {
        throw new Error(data.message || '加入購物車失敗');
      }
    } catch (error) {
      console.error('加入購物車錯誤:', error);
      alert(error.message || '加入購物車失敗');
    }
};

  const handleAddToWishlist = (productId) => {
    // 處理加入收藏邏輯
    console.log("加入收藏:", productId);
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
              images={productImages[product.id] || []}
              onAddToCart={() => handleAddToCart(product.id)}
              onAddToWishlist={() => handleAddToWishlist(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;