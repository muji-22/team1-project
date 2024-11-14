import React, { useState, useEffect } from "react";
import { FaArrowRight, FaArrowLeft, FaStar } from "react-icons/fa";
import { useRouter } from "next/router";

const Rating = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // 根據螢幕寬度決定每頁顯示數量
  const getItemsPerPage = () => {
    return isMobile ? 1 : 4;
  };

  // 監聽視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      // 如果螢幕寬度改變導致 isMobile 狀態改變，重置當前頁面
      if (mobile !== isMobile) {
        setIsMobile(mobile);
        // 計算新的最大頁數，並確保 currentPage 不會超過
        const newItemsPerPage = mobile ? 1 : 4;
        const maxPage = Math.ceil(products.length / newItemsPerPage) - 1;
        setCurrentPage(prev => Math.min(prev, Math.max(0, maxPage)));
      }
    };

    // 初始檢查
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, products.length]);

  // 獲取商品資料
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3005/api/comments/top-rated");
      const data = await response.json();

      if (data.status === "success") {
        setProducts(data.data);
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
    const maxPage = Math.ceil(products.length / getItemsPerPage()) - 1;
    setCurrentPage((prev) => (prev === 0 ? maxPage : prev - 1));
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(products.length / getItemsPerPage()) - 1;
    setCurrentPage((prev) => (prev === maxPage ? 0 : prev + 1));
  };

  // 計算當前頁面要顯示的商品
  const getCurrentProducts = () => {
    const itemsPerPage = getItemsPerPage();
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
    return <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  if (products.length === 0) {
    return <div className="text-center">目前沒有商品評分資料</div>;
  }

  return (
    <section className="container py-5 bg-white">
      {/* 標題區塊 */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-8 text-center">
          <h2 className="display-4 mb-3">顧客評分</h2>
          <p className="lead text-secondary">探索最受歡迎的遊戲商品</p>
        </div>
      </div>

      {/* 大螢幕換頁按鈕 */}
      <div className="row justify-content-end mb-4 d-none d-md-flex">
        <div className="col-auto">
          <button
            className="btn btn-outline-dark me-2 rounded-2 d-inline-flex align-items-center justify-content-center"
            style={{ width: "38px", height: "38px" }}
            onClick={handlePrevPage}
            disabled={products.length <= getItemsPerPage()}
          >
            <FaArrowLeft />
          </button>
          <button
            className="btn btn-outline-dark rounded-2 d-inline-flex align-items-center justify-content-center"
            style={{ width: "38px", height: "38px" }}
            onClick={handleNextPage}
            disabled={products.length <= getItemsPerPage()}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* 商品列表區域 */}
      <div className="position-relative px-md-0 px-4">
        {/* 小螢幕左側換頁按鈕 */}
        <div className="d-md-none position-absolute start-0 top-50 translate-middle-y opacity-75" 
             style={{ zIndex: 1, left: '-5px' }}>
          <button
            className="btn  d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
            onClick={handlePrevPage}
          >
            <FaArrowLeft />
          </button>
        </div>

        {/* 小螢幕右側換頁按鈕 */}
        <div className="d-md-none position-absolute end-0 top-50 translate-middle-y opacity-75" 
             style={{ zIndex: 1, right: '-5px' }}>
          <button
            className="btn  d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
            onClick={handleNextPage}
          >
            <FaArrowRight />
          </button>
        </div>

        {/* 商品列表 */}
        <div className="row">
          {getCurrentProducts().map((product, index) => (
            <div key={product.id} className="col-12 mb-3">
              <div
                className={`card border h-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-light"
                }`}
              >
                <div className="card-body">
                  <div className="row align-items-center g-3">
                    {/* 商品圖片 */}
                    <div className="col-12 col-md-2 text-center">
                      <img
                        src={`http://localhost:3005/productImages/${product.id}/${product.id}-1.jpg`}
                        alt={product.name}
                        className="img-fluid rounded"
                        style={{ maxWidth: "100px", objectFit: "cover" }}
                      />
                    </div>

                    {/* 商品資訊 */}
                    <div className="col-12 col-md-4 text-center text-md-start">
                      <h5 className="fw-semibold mb-2">{product.name}</h5>
                      <p className="text-danger mb-0 fw-medium">
                        NT$ {product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* 評分 */}
                    <div className="col-12 col-md-4 text-center">
                      <div className="d-flex align-items-center justify-content-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`me-1 fs-5 ${
                              i < Math.round(product.avg_score)
                                ? "text-custom"
                                : "text-secondary"
                            }`}
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
                    <div className="col-12 col-md-2 text-center">
                      <button
                        className="btn btn-dark rounded-pill py-2 fw-bold w-100"
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
      </div>
    </section>
  );
};

export default Rating;