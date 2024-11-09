import React from 'react';
import { GrFilter } from "react-icons/gr";

const ProductFilterMobile = ({
    searchQuery,
    setSearchQuery,
    handleSearch,
    tags,
    gametypesTags,
    handleTagsChange,
    playersOptions,
    selectedPlayers,
    playtimeOptions,
    selectedPlaytime,
    ageOptions,
    selectedAge,
    priceRange,
    handlePriceChange,
    handleSingleSelect,
    setSelectedPlayers,
    setSelectedPlaytime,
    setSelectedAge
}) => {
    return (
        <div className="d-lg-none">
            {/* Offcanvas 過濾面板 - 從右側滑出 */}
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="filterOffcanvas"
                aria-labelledby="filterOffcanvasLabel"
                style={{ width: '80%' }}
            >
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title" id="filterOffcanvasLabel">
                        <GrFilter className="me-2" />
                        商品過濾
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>

                <div className="offcanvas-body">
                    {/* 搜尋欄 */}
                    <div className="mb-3 bg-white pt-2">
                        <form onSubmit={handleSearch}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="請輸入商品名稱..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="btn btn-primary" type="submit">
                                    搜尋
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 過濾選項 Accordion */}
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
                            >
                                <div className="accordion-body">
                                    <div className="d-flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <button
                                                key={tag.id}
                                                onClick={() => handleTagsChange(tag.id)}
                                                className={`btn ${
                                                    gametypesTags.has(tag.id)
                                                        ? "btn-primary"
                                                        : "btn-outline-primary"
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
                                    人數 {selectedPlayers && "(1)"}
                                </button>
                            </h2>
                            <div
                                id="collapsePlayersMobile"
                                className="accordion-collapse collapse show"
                            >
                                <div className="accordion-body">
                                    <div className="d-flex flex-wrap gap-2">
                                        {playersOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleSingleSelect(option.id, setSelectedPlayers)}
                                                className={`btn ${
                                                    selectedPlayers === option.id
                                                        ? "btn-primary"
                                                        : "btn-outline-primary"
                                                }`}
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
                                    遊玩時間 {selectedPlaytime && "(1)"}
                                </button>
                            </h2>
                            <div
                                id="collapsePlaytimeMobile"
                                className="accordion-collapse collapse show"
                            >
                                <div className="accordion-body">
                                    <div className="d-flex flex-wrap gap-2">
                                        {playtimeOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleSingleSelect(option.id, setSelectedPlaytime)}
                                                className={`btn ${
                                                    selectedPlaytime === option.id
                                                        ? "btn-primary"
                                                        : "btn-outline-primary"
                                                }`}
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
                                    適合年齡 {selectedAge && "(1)"}
                                </button>
                            </h2>
                            <div
                                id="collapseAgeMobile"
                                className="accordion-collapse collapse show"
                            >
                                <div className="accordion-body">
                                    <div className="d-flex flex-wrap gap-2">
                                        {ageOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleSingleSelect(option.id, setSelectedAge)}
                                                className={`btn ${
                                                    selectedAge === option.id
                                                        ? "btn-primary"
                                                        : "btn-outline-primary"
                                                }`}
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
                </div>

                {/* 底部固定的套用按鈕 */}
                <div className="offcanvas-footer border-top p-3">
                    <button 
                        className="btn btn-primary w-100"
                        data-bs-dismiss="offcanvas"
                        onClick={handleSearch}
                    >
                        套用篩選
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductFilterMobile;