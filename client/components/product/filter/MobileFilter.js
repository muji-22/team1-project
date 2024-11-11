// components/product/filter/MobileFilter.js
import React from "react";
import { GrFilter } from "react-icons/gr";
import FilterContent from "./FilterContent";

const MobileFilter = ({
  filterProps,
  handleApplyFilters,
  handleClearFilters
}) => {
  return (
    <div className="d-lg-none">
      <div
        className="offcanvas offcanvas-bottom"
        tabIndex="-1"
        id="filterOffcanvasBottom"
        aria-labelledby="filterOffcanvasBottomLabel"
        data-bs-backdrop="true"
        style={{ height: "85vh", visibility: "visible" }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title" id="filterOffcanvasBottomLabel">
            <GrFilter className="me-2" />
            商品篩選
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body overflow-y-auto py-4">
          <FilterContent 
            {...filterProps}
            isMobile={true} 
          />
        </div>

        <div className="offcanvas-footer border-top p-3 sticky-bottom bg-white">
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary rounded-pill flex-grow-1"
              onClick={handleClearFilters}
            >
              清除全部
            </button>
            <button
              className="btn btn-custom rounded-pill flex-grow-1"
              data-bs-dismiss="offcanvas"
              onClick={handleApplyFilters}
            >
              套用篩選
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilter;