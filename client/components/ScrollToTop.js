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
          className={`${styles.scrollButton} ${styles.fadeIn}`}
          onClick={scrollToTop}
          aria-label="返回頂部"
          title="返回頂部"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;