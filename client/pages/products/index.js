//pages/products/index.js
import React, { useState, useEffect } from "react";
import ProductFilter from "@/components/product/filter";
import ProductList from "@/components/product/ProductList";
import { GrFilter } from "react-icons/gr";
import Breadcrumb from "@/components/Breadcrumb";

function Products() {
  // 篩選條件狀態
  const [filters, setFilters] = useState({
    search: "",
    gametypes: [],
    players: null,
    playtime: null,
    age: null,
    price: { min: "", max: "" },
  });

  // 分頁相關狀態
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 活動篩選器狀態
  const [activeFilters, setActiveFilters] = useState([]);
  const hasActiveFilters = activeFilters.length > 0;

  // 處理分頁變更
  const handlePageChange = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  // 處理篩選條件變更
  const handleFilterChange = (newFilters) => {
    setCurrentPage(1); // 重設頁碼到第一頁
    setFilters(newFilters);

    // 更新活動的篩選器
    const active = [];

    if (newFilters.search) {
      active.push({
        id: "search",
        label: `搜尋: ${newFilters.search}`,
      });
    }

    if (newFilters.gametypes?.length > 0) {
      active.push({
        id: "gametypes",
        label: `遊戲類型: ${newFilters.gametypes.length}`,
      });
    }

    if (newFilters.players) {
      const playersMap = {
        1: "1-2人",
        2: "3-5人",
        3: "6人以上",
      };
      active.push({
        id: "players",
        label: `人數: ${playersMap[newFilters.players]}`,
      });
    }

    if (newFilters.playtime) {
      const playtimeMap = {
        1: "30分鐘以下",
        2: "30-60分鐘",
        3: "60分鐘以上",
      };
      active.push({
        id: "playtime",
        label: `時間: ${playtimeMap[newFilters.playtime]}`,
      });
    }

    if (newFilters.age) {
      const ageMap = {
        1: "0-6歲",
        2: "6+",
        3: "12+",
        4: "18+",
      };
      active.push({
        id: "age",
        label: `年齡: ${ageMap[newFilters.age]}`,
      });
    }

    if (newFilters.price?.min || newFilters.price?.max) {
      const priceLabel = [];
      if (newFilters.price.min) priceLabel.push(`${newFilters.price.min}元`);
      if (newFilters.price.max) priceLabel.push(`${newFilters.price.max}元`);
      active.push({
        id: "price",
        label: `價格: ${priceLabel.join("-")}`,
      });
    }

    setActiveFilters(active);
  };

  // 移除篩選標籤
  const removeFilter = (filterId) => {
    const newFilters = { ...filters };
    switch (filterId) {
      case "search":
        newFilters.search = "";
        break;
      case "gametypes":
        newFilters.gametypes = [];
        break;
      case "players":
        newFilters.players = null;
        break;
      case "playtime":
        newFilters.playtime = null;
        break;
      case "age":
        newFilters.age = null;
        break;
      case "price":
        newFilters.price = { min: "", max: "" };
        break;
    }
    setCurrentPage(1); // 重設頁碼到第一頁
    handleFilterChange(newFilters);
  };

  return (
    <div className="container mt-3">
      {/* 麵包屑 */}
      <Breadcrumb
        items={[
          { label: "首頁", href: "/" },
          { label: "商品列表", active: true },
        ]}
      />

      <h2 className="mb-5">商品列表</h2>

      {/* 手機版篩選按鈕區 */}
      <div className="d-lg-none mb-4">
        <div className="d-flex gap-2 overflow-auto pb-2">
          <button
            className="btn btn-primary d-flex align-items-center gap-2 flex-shrink-0"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#filterOffcanvasBottom"
            aria-controls="filterOffcanvasBottom"
          >
            <GrFilter />
            <span>所有篩選</span>
          </button>
        </div>

        {/* 已選擇的篩選標籤 */}
        {hasActiveFilters && (
          <div className="d-flex flex-wrap gap-2 mt-2">
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="badge bg-primary d-flex align-items-center gap-2"
              >
                {filter.label}
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => removeFilter(filter.id)}
                  style={{ fontSize: "0.65em" }}
                ></button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 主要內容區 */}
      <div className="row">
        {/* 左側-篩選欄 */}
        <div className="col-3 d-none d-lg-block pt-4">
          <ProductFilter onSelectTags={handleFilterChange} />
        </div>

        {/* 右側-商品列表 */}
        <div className="col-12 col-lg-9">
          <ProductList 
            filters={filters}
            currentPage={currentPage}
            totalPages={totalPages}
            setTotalPages={setTotalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Products;