// components/Breadcrumb.js
import React from 'react';
import Link from 'next/link';
import { IoHomeOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io"; // 新增箭頭圖標

// 麵包屑元件
const Breadcrumb = ({ items = [] }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb mb-0 py-3 d-flex align-items-center">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li 
              className={`breadcrumb-item ${item.active ? 'active  fs-6' : ''}`}
              {...(item.active ? { 'aria-current': 'page' } : {})}
            >
              {item.active ? (
                <span className="d-flex align-items-center">
                  {item.label === '首頁' ? (
                    <IoHomeOutline className="me-1" />
                  ) : (
                    item.label
                  )}
                </span>
              ) : (
                <Link 
                  href={item.href}
                  className="text-decoration-none d-flex align-items-center text-custom fs-6"
                >
                  {item.label === '首頁' ? (
                    <IoHomeOutline className="me-1 fs-5" />
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
            {index < items.length - 1 && (
              <IoIosArrowForward className="mx-2 text-custom" />
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;