import React, { useState, useEffect } from "react";

const CategorySidebar = ({ onSelectTags = () => {} }) => {
    const [gametypesTags, setGametypesTags] = useState(new Set());
    const [selectedPlayers, setSelectedPlayers] = useState(null);
    const [selectedPlaytime, setSelectedPlaytime] = useState(null);
    const [selectedAge, setSelectedAge] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });

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

    // 處理遊戲類型的複選
    const handleTagsChange = (tagId) => {
        const newTags = new Set(gametypesTags);
        if (newTags.has(tagId)) {
            newTags.delete(tagId);
        } else {
            newTags.add(tagId);
        }
        setGametypesTags(newTags);
    };

    // 處理其他選項的單選
    const handleSingleSelect = (id, setter) => {
        setter(id);
    };

    // 處理價格範圍變更
    const handleMinPriceChange = (event) => {
        const newPriceRange = { ...priceRange, min: event.target.value };
        setPriceRange(newPriceRange);
    };

    const handleMaxPriceChange = (event) => {
        const newPriceRange = { ...priceRange, max: event.target.value };
        setPriceRange(newPriceRange);
    };

    // 當任何篩選條件改變時，更新父組件
    useEffect(() => {
        const filters = {
            gametypes: Array.from(gametypesTags),
            players: selectedPlayers,
            playtime: selectedPlaytime,
            age: selectedAge,
            price: priceRange,
        };
        onSelectTags(filters);
    }, [
        gametypesTags,
        selectedPlayers,
        selectedPlaytime,
        selectedAge,
        priceRange,
    ]);

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">篩選條件</h2>
            </div>

            <div className="overflow-y-auto h-[calc(100vh-5rem)] space-y-6 p-4">
                {/* 遊戲類型選項 - 複選 */}
                <div>
                    <h3 className="text-md font-medium mb-2">遊戲類型</h3>
                    <div className="space-y-2">
                        {tags.map((tag) => (
                            <label
                                key={tag.id}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                            >
                                <input
                                    type="checkbox"
                                    checked={gametypesTags.has(tag.id)}
                                    onChange={() => handleTagsChange(tag.id)}
                                    className="w-4 h-4"
                                />
                                <span className="text-gray-700">
                                    {tag.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 人數選項 - 單選 */}
                <div>
                    <h3 className="text-md font-medium mb-2">人數</h3>
                    <div className="space-y-2">
                        {playersOptions.map((option) => (
                            <label
                                key={option.id}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                            >
                                <input
                                    type="radio"
                                    checked={selectedPlayers === option.id}
                                    onChange={() =>
                                        handleSingleSelect(
                                            option.id,
                                            setSelectedPlayers
                                        )
                                    }
                                    className="w-4 h-4"
                                    name="players"
                                />
                                <span className="text-gray-700">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 遊玩時間選項 - 單選 */}
                <div>
                    <h3 className="text-md font-medium mb-2">遊玩時間</h3>
                    <div className="space-y-2">
                        {playtimeOptions.map((option) => (
                            <label
                                key={option.id}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                            >
                                <input
                                    type="radio"
                                    checked={selectedPlaytime === option.id}
                                    onChange={() =>
                                        handleSingleSelect(
                                            option.id,
                                            setSelectedPlaytime
                                        )
                                    }
                                    className="w-4 h-4"
                                    name="playtime"
                                />
                                <span className="text-gray-700">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 年齡選項 - 單選 */}
                <div>
                    <h3 className="text-md font-medium mb-2">適合年齡</h3>
                    <div className="space-y-2">
                        {ageOptions.map((option) => (
                            <label
                                key={option.id}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                            >
                                <input
                                    type="radio"
                                    checked={selectedAge === option.id}
                                    onChange={() =>
                                        handleSingleSelect(
                                            option.id,
                                            setSelectedAge
                                        )
                                    }
                                    className="w-4 h-4"
                                    name="age"
                                />
                                <span className="text-gray-700">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* 價格篩選 */}
            <div>
                <h3 className="text-md font-medium mb-2">價格範圍</h3>
                <div className="flex space-x-2">
                    <input
                        type="number"
                        value={priceRange.min}
                        onChange={handleMinPriceChange}
                        placeholder="最低價格"
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                        type="number"
                        value={priceRange.max}
                        onChange={handleMaxPriceChange}
                        placeholder="最高價格"
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                </div>
            </div>
        </div>
    );
};

export default CategorySidebar;
