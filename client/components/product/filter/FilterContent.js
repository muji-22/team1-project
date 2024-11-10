// components/product/filter/FilterContent.js
import React from "react";

const FilterContent = ({
  isMobile = false,
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
}) => {
  return (
    <>
      {/* 搜尋欄 */}
      <div className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="請輸入商品名稱..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleApplyFilters}>
            搜尋
          </button>
        </div>
      </div>

      <div className="accordion" id="filterAccordion" data-bs-parent="">
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
              <div className={`${isMobile ? "d-flex flex-wrap gap-2" : ""}`}>
                {tags.map((tag) =>
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
                )}
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
          <div id="collapsePlayers" className="accordion-collapse collapse show">
            <div className="accordion-body">
              <div className={`${isMobile ? "d-flex flex-wrap gap-2" : ""}`}>
                {playersOptions.map((option) =>
                  isMobile ? (
                    <button
                      key={option.id}
                      onClick={() =>
                        handleSingleSelect(option.id, setSelectedPlayers)
                      }
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
                          onChange={() =>
                            handleSingleSelect(option.id, setSelectedPlayers)
                          }
                          name="players"
                          className="me-2"
                        />
                        <span>{option.label}</span>
                      </label>
                    </div>
                  )
                )}
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
          <div id="collapsePlaytime" className="accordion-collapse collapse show">
            <div className="accordion-body">
              <div className={`${isMobile ? "d-flex flex-wrap gap-2" : ""}`}>
                {playtimeOptions.map((option) =>
                  isMobile ? (
                    <button
                      key={option.id}
                      onClick={() =>
                        handleSingleSelect(option.id, setSelectedPlaytime)
                      }
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
                          onChange={() =>
                            handleSingleSelect(option.id, setSelectedPlaytime)
                          }
                          name="playtime"
                          className="me-2"
                        />
                        <span>{option.label}</span>
                      </label>
                    </div>
                  )
                )}
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
          <div id="collapseAge" className="accordion-collapse collapse show">
            <div className="accordion-body">
              <div className={`${isMobile ? "d-flex flex-wrap gap-2" : ""}`}>
                {ageOptions.map((option) =>
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
                          onChange={() =>
                            handleSingleSelect(option.id, setSelectedAge)
                          }
                          name="age"
                          className="me-2"
                        />
                        <span>{option.label}</span>
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 價格範圍 */}
        <div className="mt-3">
          <h4 className="mb-2">
            價格範圍 {(priceRange.min || priceRange.max) && "(1)"}
          </h4>
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

        {!isMobile && (
          <div className="mt-4 d-flex gap-2">
            <button
              className="btn btn-outline-secondary flex-grow-1"
              onClick={handleClearFilters}
            >
              清除全部
            </button>
            <button
              className="btn btn-primary flex-grow-1"
              onClick={handleApplyFilters}
            >
              套用篩選
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default FilterContent;