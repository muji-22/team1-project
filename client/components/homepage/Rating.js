import React, { useState, useEffect } from "react";
import styles from "./Rating.module.css";
import { FaArrowRight, FaArrowLeft, FaStar } from "react-icons/fa";
import { useRouter } from "next/router";

const Rating = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const router = useRouter();
  const itemsPerPage = 4;

  // 獲取商品資料
  const fetchProducts = async () => {
    try {
      console.log('開始獲取商品資料');
      const response = await fetch("http://localhost:3005/api/comments/top-rated");
      console.log('API回應狀態:', response.status);
      
      const data = await response.json();
      console.log('獲取到的資料:', data);
      
      if(data.status === 'success') {
        setProducts(data.data);
        console.log('設置後的商品資料:', data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("獲取商品評分資料錯誤:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 處理頁面切換
  const handlePrevPage = () => {
    setCurrentPage((prev) => 
      prev === 0 ? Math.ceil(products.length / itemsPerPage) - 1 : prev - 1
    );
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => 
      prev === Math.ceil(products.length / itemsPerPage) - 1 ? 0 : prev + 1
    );
  };

  // 計算當前頁面要顯示的商品
  const getCurrentProducts = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return products.slice(start, end);
  };

  // 處理購買按鈕點擊
  const handleBuyClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  if (error) {
    return <div className="text-center text-danger">錯誤: {error}</div>;
  }

  if (loading) {
    return <div className="text-center">載入中...</div>;
  }

  if (products.length === 0) {
    return <div className="text-center">目前沒有商品評分資料</div>;
  }

  console.log('準備渲染的商品:', getCurrentProducts());

  return (
    <section className={`container ${styles.section} py-5`}>
      <div className="row justify-content-center mb-4">
        <div className="col-md-8 text-center">
          <h2 className={`display-4 mb-3`}>顧客評分</h2>
          <p className="lead">
            探索最受歡迎的遊戲商品
          </p>
        </div>
      </div>
      
      <div className="row justify-content-end mb-4">
        <div className="col-auto">
          <button 
            className={`btn ${styles.arrowButton}`}
            onClick={handlePrevPage}
            disabled={products.length <= itemsPerPage}
          >
            <FaArrowLeft />
          </button>
          <button 
            className={`btn ${styles.arrowButton}`}
            onClick={handleNextPage}
            disabled={products.length <= itemsPerPage}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      <div className="row">
        {getCurrentProducts().map((product, index) => (
          <div key={product.id} className="col-12 mb-3">
            <div className="h-100">
              <div
                className={`p-3 border rounded-2 ${
                  index % 2 === 0 ? styles.evenCard : styles.oddCard
                }`}
              >
                <div className="row g-3 align-items-center">
                  {/* 商品圖片 */}
                  <div className="col-12 col-sm-2">
                    <img
                      src={`http://localhost:3005/productImages/${product.id}/${product.id}-1.jpg`}
                      alt={product.name}
                      className={styles.productImage}
                    />
                  </div>

                  {/* 商品資訊 */}
                  <div className="col-12 col-sm-4">
                    <div className={styles.productInfo}>
                      <h5 className={styles.productName}>{product.name}</h5>
                      <p className={`${styles.productPrice} mb-0`}>
                        NT$ {product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* 評分 */}
                  <div className={`${styles.ratingContainer} col-12 col-lg-4 col-sm-4 d-flex flex-column align-items-center`}>
                    <div className="d-flex align-items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${styles.star} ${
                            i < Math.round(product.avg_score) ? "text-custom" : "text-secondary"
                          } fs-5 me-1`}
                        />
                      ))}
                      <span className="ms-2 text-muted">
                        ({product.avg_score})
                      </span>
                    </div>
                    <small className="text-muted">
                      {product.review_count} 則評價
                    </small>
                  </div>

                  {/* 購買按鈕 */}
                  <div className="col-12 col-sm-2 d-flex justify-content-center">
                    <button 
                      className={`btn ${styles.buyButton}`}
                      onClick={() => handleBuyClick(product.id)}
                    >
                      立即購買
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Rating;