import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 監聽滾動事件
  useEffect(() => {
    const toggleVisibility = () => {
      // 當頁面滾動超過 300px 時顯示按鈕
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    // 清理監聽器
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // 滾動到頂部的函數
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'  // 平滑滾動效果
    });
  };

  return (
    <>
      {isVisible && (
        <button
          className="position-fixed bottom-0 end-0 m-4 btn btn-custom rounded-circle d-flex align-items-center justify-content-center shadow-sm"
          onClick={scrollToTop}
          style={{
            width: '45px',
            height: '45px',
            zIndex: 1000,
            opacity: 0.8,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.opacity = 1}
          onMouseLeave={(e) => e.target.style.opacity = 0.8}
          aria-label="返回頂部"
        >
          <FaArrowUp className="text-white" size={20} />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;