// components/product/filter/DesktopFilter.js
import React from "react";
import FilterContent from "./FilterContent";

const DesktopFilter = ({
  filterProps
}) => {
  return (
    <div className="d-none d-lg-block" style={{ top: "2rem" }}>
      <FilterContent 
        {...filterProps} 
        isMobile={false}
      />
    </div>
  );
};

export default DesktopFilter;