import React, { useState, useEffect } from "react";
import { GrFilter } from "react-icons/gr";

const CategorySidebar = ({ onSelectTags = () => {} }) => {
    const [gametypesTags, setGametypesTags] = useState(new Set());
    const [selectedPlayers, setSelectedPlayers] = useState(null);
    const [selectedPlaytime, setSelectedPlaytime] = useState(null);
    const [selectedAge, setSelectedAge] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [searchQuery, setSearchQuery] = useState("");

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
        setter(id);
    };

    const handleMinPriceChange = (event) => {
        const newPriceRange = { ...priceRange, min: event.target.value };
        setPriceRange(newPriceRange);
    };

    const handleMaxPriceChange = (event) => {
        const newPriceRange = { ...priceRange, max: event.target.value };
        setPriceRange(newPriceRange);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // 將搜尋關鍵字加入到篩選條件中
        const filters = {
            gametypes: Array.from(gametypesTags),
            players: selectedPlayers,
            playtime: selectedPlaytime,
            age: selectedAge,
            price: priceRange,
            search: searchQuery,
        };
        onSelectTags(filters);
    };

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

    return (
        <>
            {/* 桌面版側邊欄 (lg以上顯示) */}
            <div className="d-none d-lg-block">
                {/* 搜尋欄 */}
                <div className="mb-3">
                    <form onSubmit={handleSearch}>
                        <div className="input-group rounded-pill search-box rounded-pill">
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

                <div className="accordion" id="filterAccordionDesktop">
                    {/* 遊戲類型 */}
                    <div className="accordion-item">
                        <h3 className="accordion-header px-3 accordion-flush">
                            <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseGameTypesDesktop"
                            >
                                遊戲類型
                            </button>
                        </h3>
                        <div
                            id="collapseGameTypesDesktop"
                            className="accordion-collapse collapse show"
                        >
                            <div className="accordion-body">
                                <ul className="list-unstyled mb-0">
                                    {tags.map((tag) => (
                                        <li key={tag.id} className="mb-2 px-3">
                                            <label className="d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={gametypesTags.has(
                                                        tag.id
                                                    )}
                                                    onChange={() =>
                                                        handleTagsChange(tag.id)
                                                    }
                                                    className="me-2"
                                                />
                                                <span>{tag.name}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 人數 */}
                    <div className="accordion-item">
                        <h3 className="accordion-header px-3 accordion-flush">
                            <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapsePlayersDesktop"
                            >
                                人數
                            </button>
                        </h3>
                        <div
                            id="collapsePlayersDesktop"
                            className="accordion-collapse collapse show"
                        >
                            <div className="accordion-body">
                                <ul className="list-unstyled mb-0">
                                    {playersOptions.map((option) => (
                                        <li
                                            key={option.id}
                                            className="mb-2 px-3"
                                        >
                                            <label className="d-flex align-items-center">
                                                <input
                                                    type="radio"
                                                    checked={
                                                        selectedPlayers ===
                                                        option.id
                                                    }
                                                    onChange={() =>
                                                        handleSingleSelect(
                                                            option.id,
                                                            setSelectedPlayers
                                                        )
                                                    }
                                                    name="playersDesktop"
                                                    className="me-2"
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 遊玩時間 */}
                    <div className="accordion-item">
                        <h3 className="accordion-header px-3 accordion-flush">
                            <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapsePlaytimeDesktop"
                            >
                                遊玩時間
                            </button>
                        </h3>
                        <div
                            id="collapsePlaytimeDesktop"
                            className="accordion-collapse collapse show"
                        >
                            <div className="accordion-body">
                                <ul className="list-unstyled mb-0">
                                    {playtimeOptions.map((option) => (
                                        <li
                                            key={option.id}
                                            className="mb-2 px-3"
                                        >
                                            <label className="d-flex align-items-center">
                                                <input
                                                    type="radio"
                                                    checked={
                                                        selectedPlaytime ===
                                                        option.id
                                                    }
                                                    onChange={() =>
                                                        handleSingleSelect(
                                                            option.id,
                                                            setSelectedPlaytime
                                                        )
                                                    }
                                                    name="playtimeDesktop"
                                                    className="me-2"
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 適合年齡 */}
                    <div className="accordion-item">
                        <h3 className="accordion-header px-3 accordion-flush">
                            <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseAgeDesktop"
                            >
                                適合年齡
                            </button>
                        </h3>
                        <div
                            id="collapseAgeDesktop"
                            className="accordion-collapse collapse show"
                        >
                            <div className="accordion-body">
                                <ul className="list-unstyled mb-0">
                                    {ageOptions.map((option) => (
                                        <li
                                            key={option.id}
                                            className="mb-2 px-3"
                                        >
                                            <label className="d-flex align-items-center">
                                                <input
                                                    type="radio"
                                                    checked={
                                                        selectedAge ===
                                                        option.id
                                                    }
                                                    onChange={() =>
                                                        handleSingleSelect(
                                                            option.id,
                                                            setSelectedAge
                                                        )
                                                    }
                                                    name="ageDesktop"
                                                    className="me-2"
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 價格範圍 */}
                    <div className="mt-3">
                        <h4 className="mb-2">價格範圍</h4>
                        <div className="d-flex align-items-center gap-2">
                            <input
                                type="number"
                                value={priceRange.min}
                                onChange={handleMinPriceChange}
                                placeholder="最低價格"
                                className="form-control"
                            />
                            <span>-</span>
                            <input
                                type="number"
                                value={priceRange.max}
                                onChange={handleMaxPriceChange}
                                placeholder="最高價格"
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 手機版側邊欄 (lg以下顯示) */}
            <div className="d-lg-none">
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
                                遊戲類型{" "}
                                {gametypesTags.size > 0 &&
                                    `(${gametypesTags.size})`}
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
                                            onClick={() =>
                                                handleTagsChange(tag.id)
                                            }
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
                            data-bs-parent="#filterAccordionMobile"
                        >
                            <div className="accordion-body">
                                <div className="d-flex flex-wrap gap-2">
                                    {playersOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() =>
                                                handleSingleSelect(
                                                    option.id,
                                                    setSelectedPlayers
                                                )
                                            }
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
                            data-bs-parent="#filterAccordionMobile"
                        >
                            <div className="accordion-body">
                                <div className="d-flex flex-wrap gap-2">
                                    {playtimeOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() =>
                                                handleSingleSelect(
                                                    option.id,
                                                    setSelectedPlaytime
                                                )
                                            }
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
                            data-bs-parent="#filterAccordionMobile"
                        >
                            <div className="accordion-body">
                                <div className="d-flex flex-wrap gap-2">
                                    {ageOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() =>
                                                handleSingleSelect(
                                                    option.id,
                                                    setSelectedAge
                                                )
                                            }
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
                                價格範圍{" "}
                                {(priceRange.min || priceRange.max) && "(1)"}
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
                                        onChange={(e) =>
                                            handlePriceChange(
                                                "min",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="最高"
                                        value={priceRange.max}
                                        onChange={(e) =>
                                            handlePriceChange(
                                                "max",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategorySidebar;
