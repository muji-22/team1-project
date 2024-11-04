import React from 'react';

const CategoryMobile = ({
    tags,
    playersOptions,
    playtimeOptions,
    ageOptions,
    gametypesTags,
    selectedPlayers,
    selectedPlaytime,
    selectedAge,
    priceRange,
    handleTagsChange,
    setSelectedPlayers,
    setSelectedPlaytime,
    setSelectedAge,
    handlePriceChange,
    searchQuery,
    setSearchQuery
}) => {
    // 控制各區塊的展開/收合狀態
    const [openSections, setOpenSections] = useState({
        players: true,
        age: true,
        types: true,
        time: true,
        price: true
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className="d-lg-none">
            {/* 搜尋框 */}
            <div className="p-3 bg-light">
                <div className="input-group">
                    <input 
                        type="text"
                        className="form-control"
                        placeholder="搜尋..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* 篩選區域 */}
            <div className="bg-white">
                {/* 遊戲人數 */}
                <div className="border-bottom py-2">
                    <div 
                        className="d-flex justify-content-between align-items-center px-3"
                        onClick={() => toggleSection('players')}
                    >
                        <span>遊戲人數</span>
                        <i className={`bi bi-chevron-${openSections.players ? 'up' : 'down'}`}></i>
                    </div>
                    {openSections.players && (
                        <div className="px-3 pt-2">
                            <div className="d-flex flex-wrap gap-2">
                                {playersOptions.map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedPlayers(option.id)}
                                        className={`btn btn-sm rounded-pill ${
                                            selectedPlayers === option.id
                                                ? 'btn-info text-white'
                                                : 'btn-outline-info'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 其他區塊使用相同結構 */}
                {/* ... */}
            </div>
        </div>
    );
};


export default CategoryMobile;