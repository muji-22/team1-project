// components/product/filter/index.js
import React, { useState, useEffect } from "react";
import DesktopFilter from "./DesktopFilter";
import MobileFilter from "./MobileFilter";

const ProductFilter = ({ onSelectTags = () => {}, initialFilters = null }) => {
  // 狀態
  const [gametypesTags, setGametypesTags] = useState(new Set());
  const [selectedPlayers, setSelectedPlayers] = useState(null);
  const [selectedPlaytime, setSelectedPlaytime] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [searchQuery, setSearchQuery] = useState("");

  // 同步初始篩選條件
  useEffect(() => {
    if (initialFilters) {
      setGametypesTags(new Set(initialFilters.gametypes || []));
      setSelectedPlayers(initialFilters.players);
      setSelectedPlaytime(initialFilters.playtime);
      setSelectedAge(initialFilters.age);
      setPriceRange(initialFilters.price || { min: "", max: "" });
      setSearchQuery(initialFilters.search || "");
    }
  }, [initialFilters]);

  // 選項數據
  const tags = [
    { id: 1, name: "大腦" },
    { id: 2, name: "派對" },
    { id: 3, name: "樂齡" },
    { id: 4, name: "幼兒" },
    { id: 5, name: "紙牌" },
    { id: 6, name: "猜心" },
    { id: 7, name: "輕策略" },
    { id: 8, name: "競速" },
    { id: 9, name: "台灣作家" },
    { id: 10, name: "骰子" },
    { id: 11, name: "巧手" },
    { id: 12, name: "合作" },
    { id: 13, name: "言語" },
    { id: 14, name: "陣營" },
    { id: 15, name: "中策略" },
    { id: 16, name: "重策略" },
  ];

  const playersOptions = [
    { id: 1, label: "1-2人" },
    { id: 2, label: "3-5人" },
    { id: 3, label: "6人以上" },
  ];

  const playtimeOptions = [
    { id: 1, label: "30分鐘以下" },
    { id: 2, label: "30-60分鐘" },
    { id: 3, label: "60分鐘以上" },
  ];

  const ageOptions = [
    { id: 1, label: "0-6歲" },
    { id: 2, label: "6+" },
    { id: 3, label: "12+" },
    { id: 4, label: "18+" },
  ];

  // 處理函數
  const handleTagsChange = (tagId) => {
    const newTags = new Set(gametypesTags);
    if (newTags.has(tagId)) {
      newTags.delete(tagId);
    } else {
      newTags.add(tagId);
    }
    setGametypesTags(newTags);
  };

  const handleSingleSelect = (id, setter) => {
    setter((prevId) => (prevId === id ? null : id));
  };

  const handlePriceChange = (type, value) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleClearFilters = () => {
    setGametypesTags(new Set());
    setSelectedPlayers(null);
    setSelectedPlaytime(null);
    setSelectedAge(null);
    setPriceRange({ min: "", max: "" });
    setSearchQuery("");

    onSelectTags({
      search: "",
      gametypes: [],
      players: null,
      playtime: null,
      age: null,
      price: { min: "", max: "" },
    });
  };

  const handleApplyFilters = () => {
    const filters = {
      search: searchQuery,
      gametypes: Array.from(gametypesTags),
      players: selectedPlayers,
      playtime: selectedPlaytime,
      age: selectedAge,
      price: priceRange,
    };
    onSelectTags(filters);
  };

  // 共用的 props
  const filterProps = {
    gametypesTags,
    handleTagsChange,
    selectedPlayers,
    setSelectedPlayers,
    selectedPlaytime,
    setSelectedPlaytime,
    selectedAge,
    setSelectedAge,
    priceRange,
    handlePriceChange,
    searchQuery,
    setSearchQuery,
    handleApplyFilters,
    handleClearFilters,
    handleSingleSelect,
    tags,
    playersOptions,
    playtimeOptions,
    ageOptions,
  };

  return (
    <>
      <DesktopFilter filterProps={filterProps} />
      <MobileFilter 
        filterProps={filterProps}
        handleApplyFilters={handleApplyFilters}
        handleClearFilters={handleClearFilters}
      />
    </>
  );
};

export default ProductFilter;