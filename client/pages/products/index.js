import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProductFilter from "@/components/product/filter";
import ProductList from "@/components/product/ProductList";
import { GrFilter } from "react-icons/gr";
import Breadcrumb from "@/components/Breadcrumb";

function Products() {
  const router = useRouter();

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

  // 監聽 URL 參數變化，只做初始化
  useEffect(() => {
    if (router.isReady) {
      const { gametypes, search, players, playtime, age, price_min, price_max } = router.query;

      const newFilters = {
        search: search || "",
        gametypes: gametypes ? JSON.parse(gametypes) : [],
        players: players ? Number(players) : null,
        playtime: playtime ? Number(playtime) : null,
        age: age ? Number(age) : null,
        price: {
          min: price_min || "",
          max: price_max || "",
        }
      };

      // 更新 filters 和 activeFilters
      setFilters(newFilters);
      updateActiveFilters(newFilters);
    }
  }, [router.isReady]);

  // 更新活動篩選器標籤的函數
  const updateActiveFilters = (newFilters) => {
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

  // 處理分頁變更
  const handlePageChange = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  // 處理篩選條件變更
  const handleFilterChange = (newFilters) => {
    setCurrentPage(1); // 重設頁碼到第一頁
    setFilters(newFilters);
    updateActiveFilters(newFilters);

    // 更新 URL，但不重新加載頁面
    router.push({
      pathname: '/products',
      query: {
        ...(newFilters.search && { search: newFilters.search }),
        ...(newFilters.gametypes?.length > 0 && { 
          gametypes: JSON.stringify(newFilters.gametypes) 
        }),
        ...(newFilters.players && { players: newFilters.players }),
        ...(newFilters.playtime && { playtime: newFilters.playtime }),
        ...(newFilters.age && { age: newFilters.age }),
        ...(newFilters.price?.min && { price_min: newFilters.price.min }),
        ...(newFilters.price?.max && { price_max: newFilters.price.max }),
        ...(newFilters.sortPrice && { sort_price: newFilters.sortPrice }),
      }
    }, undefined, { shallow: true });
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
    setCurrentPage(1);
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
        <div className="d-flex justify-content-end gap-2 overflow-auto pb-2">
          <button
            className="btn btn-custom d-flex align-items-center gap-2 flex-shrink-0 rounded-pill"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#filterOffcanvasBottom"
            aria-controls="filterOffcanvasBottom"
          >
            <GrFilter />
            <span>篩選</span>
          </button>
        </div>

        {/* 已選擇的篩選標籤 */}
        {hasActiveFilters && (
          <div className="d-flex flex-wrap gap-2 mt-2 justify-content-end">
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="badge bg-custom d-flex align-items-center gap-2"
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
        <ProductFilter onSelectTags={handleFilterChange} initialFilters={filters} />

        {/* 右側-商品列表 */}
        <div className="col-12 col-lg-9">
          <select
            className="form-select mb-4"
            onChange={(e) => handleFilterChange({...filters, sortPrice: e.target.value })}
            value={filters.sortPrice || ""}
          >
            <option value="">價格排序</option>
            <option value="asc">價格：低到高</option>
            <option value="desc">價格：高到低</option>
          </select>
          
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