// components/product/filter/DesktopFilter.js
import React from "react";
import FilterContent from "./FilterContent";

const DesktopFilter = ({
  filterProps
}) => {
  return (
    <div className="col-3 d-none d-lg-block pt-4">
    <div className="d-none d-lg-block " style={{ top: "2rem" }}>
      <FilterContent 
        {...filterProps} 
        isMobile={false}
      />
    </div>
    </div>
  );
};

export default DesktopFilter;