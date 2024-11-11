//pages/rents/index.js
import React, { useState } from "react";
import ProductFilter from "@/components/product/filter";
import RentList from "@/components/rent/RentList";
import { GrFilter } from "react-icons/gr";
import Breadcrumb from "@/components/Breadcrumb";

function Rents() {
  const [filters, setFilters] = useState({
    search: "",
    gametypes: [],
    players: null,
    playtime: null,
    age: null,
    price: { min: "", max: "" },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [activeFilters, setActiveFilters] = useState([]);
  const hasActiveFilters = activeFilters.length > 0;

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
        label: `租金: ${priceLabel.join("-")}`,
      });
    }

    setActiveFilters(active);
  };

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
    handleFilterChange(newFilters);
  };

  return (
    <div className="container mt-3">
      <Breadcrumb
        items={[
          { label: "首頁", href: "/" },
          { label: "商品租賃列表", active: true },
        ]}
      />

      <h2 className="mb-5">商品租賃列表</h2>

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
            <span>篩選</span>
          </button>
        </div>

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

      <div className="row">
        <ProductFilter onSelectTags={handleFilterChange} />

        <div className="col-12 col-lg-9">
          <RentList
            filters={filters}
            currentPage={currentPage}
            totalPages={totalPages}
            setTotalPages={setTotalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}

export default Rents;
