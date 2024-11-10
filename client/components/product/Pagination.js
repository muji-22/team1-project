// components/product/Pagination.js
import React from 'react';
import styles from './Pagination.module.css';
import { IoIosArrowBack } from "react-icons/io"; // 左箭頭
import { IoIosArrowForward } from "react-icons/io"; // 右箭頭



function Pagination({ currentPage, totalPages, onPageChange }) {
  // 生成頁碼數組
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      }
    }

    const withEllipsis = [];
    let prev = 0;
    for (const page of pages) {
      if (prev && page - prev > 1) {
        withEllipsis.push('...');
      }
      withEllipsis.push(page);
      prev = page;
    }

    return withEllipsis;
  };

  return (
    <nav aria-label="Product pagination" className={styles.paginationContainer}>
      <ul className="pagination justify-content-center mb-0">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <span aria-hidden="true"><IoIosArrowBack className="fs-4" /></span>
          </button>
        </li>

        {getPageNumbers().map((page, index) => (
          <li 
            key={index} 
            className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => page !== '...' && onPageChange(page)}
              disabled={page === '...'}
            >
              {page}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <span aria-hidden="true"><IoIosArrowForward className="fs-4"/></span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;