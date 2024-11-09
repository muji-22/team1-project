// components/ScrollToTop.js

import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styles from '../styles/ScrollToTop.module.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          className={`position-fixed bottom-0 end-0 m-4 btn rounded-circle d-flex align-items-center justify-content-center ${styles.scrollButton} ${styles.fadeIn}`}
          onClick={scrollToTop}
          style={{
            width: '45px',
            height: '45px',
            zIndex: 1000
          }}
          aria-label="返回頂部"
          title="返回頂部"
        >
          <FaArrowUp className="text-white" size={20} />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;