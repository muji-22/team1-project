// CategoryMobile.js
import React, { useState } from 'react';
import { GrFilter } from "react-icons/gr";

const CategoryMobile = ({
    searchQuery,
    setSearchQuery,
    handleSearch,
    tags,
    gametypesTags,
    handleTagsChange,
    playersOptions,
    selectedPlayers,
    setSelectedPlayers,
    playtimeOptions,
    selectedPlaytime,
    setSelectedPlaytime,
    ageOptions,
    selectedAge,
    setSelectedAge,
    priceRange,
    handlePriceChange,
    handleSingleSelect
}) => {
    return (
        <div className="d-lg-none">
           

            {/* Offcanvas 篩選面板 */}
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="filterOffcanvas"
                aria-labelledby="filterOffcanvasLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="filterOffcanvasLabel">篩選條件</h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                
                <div className="offcanvas-body">
                    {/* 搜尋欄 */}
                    <div className="mb-3">
                        <form onSubmit={handleSearch}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="請輸入商品名稱..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="btn btn-custom" type="submit">
                                    搜尋
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 篩選區塊 */}
                    <div className="accordion" id="filterAccordionMobile">
                        {/* 遊戲類型 */}
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseGameTypesMobile"
                                >
                                    遊戲類型 {gametypesTags.size > 0 && `(${gametypesTags.size})`}
                                </button>
                            </h2>
                            <div
                                id="collapseGameTypesMobile"
                                className="accordion-collapse collapse show"
                                data-bs-parent="#filterAccordionMobile"
                            >
                                <div className="accordion-body">
                                    <div className="d-flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <button
                                                key={tag.id}
                                                onClick={() => handleTagsChange(tag.id)}
                                                className={`btn ${
                                                    gametypesTags.has(tag.id)
                                                        ? "btn-custom"
                                                        : "btn-outline-custom"
                                                }`}
                                            >
                                                {tag.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                         {/* 人數 */}
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsePlayersMobile"
                    >
                        人數 {selectedPlayers ? "(1)" : ""}
                    </button>
                </h2>
                <div
                    id="collapsePlayersMobile"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#filterAccordionMobile"
                >
                    <div className="accordion-body">
                        <div className="d-flex flex-wrap gap-2">
                            {playersOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleSingleSelect(option.id, setSelectedPlayers)}
                                    className={`btn btn-outline-primary`}
                                    style={{
                                        backgroundColor: selectedPlayers === option.id ? '#40CBCE' : 'transparent',
                                        color: selectedPlayers === option.id ? 'black' : '#40CBCE',
                                        borderColor: '#40CBCE'
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 遊玩時間 */}
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsePlaytimeMobile"
                    >
                        遊玩時間 {selectedPlaytime ? "(1)" : ""}
                    </button>
                </h2>
                <div
                    id="collapsePlaytimeMobile"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#filterAccordionMobile"
                >
                    <div className="accordion-body">
                        <div className="d-flex flex-wrap gap-2">
                            {playtimeOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleSingleSelect(option.id, setSelectedPlaytime)}
                                    className="btn btn-custom"
                                    style={{
                                        backgroundColor: selectedPlaytime === option.id ? '#40CBCE' : 'transparent',
                                        color: selectedPlaytime === option.id ? 'black' : '#40CBCE',
                                        borderColor: '#40CBCE'
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 適合年齡 */}
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseAgeMobile"
                    >
                        適合年齡 {selectedAge ? "(1)" : ""}
                    </button>
                </h2>
                <div
                    id="collapseAgeMobile"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#filterAccordionMobile"
                >
                    <div className="accordion-body">
                        <div className="d-flex flex-wrap gap-2">
                            {ageOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleSingleSelect(option.id, setSelectedAge)}
                                    className={`btn btn-outline-primary`}
                                    style={{
                                        backgroundColor: selectedAge === option.id ? '#40CBCE' : 'transparent',
                                        color: selectedAge === option.id ? 'black' : '#40CBCE',
                                        borderColor: '#40CBCE'
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

                        {/* 價格範圍 */}
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapsePriceMobile"
                                >
                                    價格範圍 {(priceRange.min || priceRange.max) && "(1)"}
                                </button>
                            </h2>
                            <div
                                id="collapsePriceMobile"
                                className="accordion-collapse collapse show"
                                data-bs-parent="#filterAccordionMobile"
                            >
                                <div className="accordion-body">
                                    <div className="d-flex align-items-center gap-2">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="最低"
                                            value={priceRange.min}
                                            onChange={(e) => handlePriceChange("min", e.target.value)}
                                        />
                                        <span>-</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="最高"
                                            value={priceRange.max}
                                            onChange={(e) => handlePriceChange("max", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 套用篩選按鈕 */}
                    <div className="position-sticky bottom-0 bg-white pt-3 border-top mt-3">
                        <button 
                            className="btn btn-custom w-100"
                            data-bs-dismiss="offcanvas"
                        >
                            套用篩選
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryMobile;