import React from "react";
import styles from "./productDetailNotice.module.css";
const ProductDetailNotice = ({}) => {
  return (
    <>
        <div className={`row mt-5 `}>
          <div className={`${styles.noticeLine}`}>
            <h5 className="mt-2">說明</h5>
          </div>

            <p className="mt-5">讀取說明</p>
        </div>
      
    </>
  );
};

export default ProductDetailNotice;
