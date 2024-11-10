// components/product/ProductFilter.js
import React, { useState, useEffect } from "react";
import { GrFilter } from "react-icons/gr";

const ProductFilter = ({ onSelectTags = () => {} }) => {
    const [gametypesTags, setGametypesTags] = useState(new Set());
    const [selectedPlayers, setSelectedPlayers] = useState(null);
    const [selectedPlaytime, setSelectedPlaytime] = useState(null);
    const [selectedAge, setSelectedAge] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [searchQuery, setSearchQuery] = useState("");

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
        setter(prevId => prevId === id ? null : id);
    };

    const handlePriceChange = (type, value) => {
        setPriceRange(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const handleSearch = (e) => {
        e?.preventDefault();
        const filters = {
            search: searchQuery,
            gametypes: Array.from(gametypesTags),
            players: selectedPlayers,
            playtime: selectedPlaytime,
            age: selectedAge,
            price: priceRange
        };
        onSelectTags(filters);
    };

    // 篩選條件改變時自動更新
    useEffect(() => {
        const filters = {
            gametypes: Array.from(gametypesTags),
            players: selectedPlayers,
            playtime: selectedPlaytime,
            age: selectedAge,
            price: priceRange,
            search: searchQuery,
        };
        onSelectTags(filters);
    }, [
        gametypesTags,
        selectedPlayers,
        selectedPlaytime,
        selectedAge,
        priceRange,
        searchQuery,
    ]);

    // 篩選器內容
    const FilterContent = ({ isMobile = false }) => (
        <>
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
                        <button className="btn btn-primary" type="submit">
                            搜尋
                        </button>
                    </div>
                </form>
            </div>

            <div className="accordion" id="filterAccordion">
                {/* 遊戲類型 */}
                <div className="accordion-item">
                    <h3 className="accordion-header">
                        <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseGameTypes"
                        >
                            遊戲類型 {gametypesTags.size > 0 && `(${gametypesTags.size})`}
                        </button>
                    </h3>
                    <div
                        id="collapseGameTypes"
                        className="accordion-collapse collapse show"
                    >
                        <div className="accordion-body">
                            <div className={`${isMobile ? 'd-flex flex-wrap gap-2' : ''}`}>
                                {tags.map((tag) => (
                                    isMobile ? (
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
                                    ) : (
                                        <div key={tag.id} className="mb-2">
                                            <label className="d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={gametypesTags.has(tag.id)}
                                                    onChange={() => handleTagsChange(tag.id)}
                                                    className="me-2"
                                                />
                                                <span>{tag.name}</span>
                                            </label>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 人數 */}
                <div className="accordion-item">
                    <h3 className="accordion-header">
                        <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapsePlayers"
                        >
                            人數 {selectedPlayers && "(1)"}
                        </button>
                    </h3>
                    <div
                        id="collapsePlayers"
                        className="accordion-collapse collapse show"
                    >
                        <div className="accordion-body">
                            <div className={`${isMobile ? 'd-flex flex-wrap gap-2' : ''}`}>
                                {playersOptions.map((option) => (
                                    isMobile ? (
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
                                    ) : (
                                        <div key={option.id} className="mb-2">
                                            <label className="d-flex align-items-center">
                                                <input
                                                    type="radio"
                                                    checked={selectedPlayers === option.id}
                                                    onChange={() => handleSingleSelect(option.id, setSelectedPlayers)}
                                                    name="players"
                                                    className="me-2"
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 遊玩時間 */}
                <div className="accordion-item">
                    <h3 className="accordion-header">
                        <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapsePlaytime"
                        >
                            遊玩時間 {selectedPlaytime && "(1)"}
                        </button>
                    </h3>
                    <div
                        id="collapsePlaytime"
                        className="accordion-collapse collapse show"
                    >
                        <div className="accordion-body">
                            <div className={`${isMobile ? 'd-flex flex-wrap gap-2' : ''}`}>
                                {playtimeOptions.map((option) => (
                                    isMobile ? (
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
                                    ) : (
                                        <div key={option.id} className="mb-2">
                                            <label className="d-flex align-items-center">
                                                <input
                                                    type="radio"
                                                    checked={selectedPlaytime === option.id}
                                                    onChange={() => handleSingleSelect(option.id, setSelectedPlaytime)}
                                                    name="playtime"
                                                    className="me-2"
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 適合年齡 */}
                <div className="accordion-item">
                    <h3 className="accordion-header">
                        <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseAge"
                        >
                            適合年齡 {selectedAge && "(1)"}
                        </button>
                    </h3>
                    <div
                        id="collapseAge"
                        className="accordion-collapse collapse show"
                    >
                        <div className="accordion-body">
                            <div className={`${isMobile ? 'd-flex flex-wrap gap-2' : ''}`}>
                                {ageOptions.map((option) => (
                                    isMobile ? (
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
                                    ) : (
                                        <div key={option.id} className="mb-2">
                                            <label className="d-flex align-items-center">
                                                <input
                                                    type="radio"
                                                    checked={selectedAge === option.id}
                                                    onChange={() => handleSingleSelect(option.id, setSelectedAge)}
                                                    name="age"
                                                    className="me-2"
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 價格範圍 */}
                <div className="mt-3">
                    <h4 className="mb-2">價格範圍 {(priceRange.min || priceRange.max) && "(1)"}</h4>
                    <div className="d-flex align-items-center gap-2">
                        <input
                            type="number"
                            value={priceRange.min}
                            onChange={(e) => handlePriceChange("min", e.target.value)}
                            placeholder="最低價格"
                            className="form-control"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            value={priceRange.max}
                            onChange={(e) => handlePriceChange("max", e.target.value)}
                            placeholder="最高價格"
                            className="form-control"
                        />
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* 桌面版側邊欄 */}
            <div className="d-none d-lg-block" style={{ top: '2rem' }}>
                <FilterContent />
            </div>

            {/* 手機版 Offcanvas */}
            <div className="d-lg-none">
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
                        <FilterContent isMobile={true} />
                    </div>

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
        </>
    );
};

export default ProductFilter;