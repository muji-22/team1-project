//pages/products/index.js
import React, { useState, useEffect } from "react";
import ProductFilter from "@/components/product/ProductFilter";
import ProductList from "@/components/product/ProductList";
import { GrFilter } from "react-icons/gr";

function Products() {
  // 移除不需要的 products、loading、error 狀態，因為已經移到 ProductList 組件中

  // 新增篩選條件狀態
  const [filters, setFilters] = useState({
    search: "",
    gametypes: [],
    players: null,
    playtime: null,
    age: null,
    price: { min: "", max: "" },
  });

  // 處理篩選條件變更
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mt-5">
      {/* 麵包屑 */}
      <div className="">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">首頁</a>
            </li>
            <li className="breadcrumb-item">
              <a href="#">商品購買列表</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Data
            </li>
          </ol>
        </nav>
        <h2 className="mb-5">商品列表</h2>

       {/* 修改篩選按鈕 */}
       <div className="d-lg-none d-flex justify-content-end">
                    <button
                        className="btn fs-2 border-0"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#filterOffcanvas"
                        aria-controls="filterOffcanvas"
                    >
                        <GrFilter />
                    </button>
        </div>
      </div>

      {/* 主要內容區 */}
      <div className="row">
        {/* 左側篩選欄 */}
        <div className="col-3 pt-4 d-none d-lg-block">
          <ProductFilter onSelectTags={handleFilterChange} />
        </div>

        {/* 右側內容區 */}
        <div className="col col-lg-9">
          <div className="row">
            <ProductList filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
