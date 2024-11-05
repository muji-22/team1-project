import React from "react";
import styles from "./productDetailNotice.module.css";
const ProductDetailNotice2 = ({}) => {
  return (
    <>
        <div className={`row mt-5 `}>
          <div className={`${styles.noticeLine}`}>
            <h5 className="mt-2">規格</h5>
          </div>

            <div className={`mt-5 ${styles.subtitle}`}>最少玩家人數</div>
            <div className="mt-2">
              <p>讀取最少玩家人數</p>
            </div>

            <div className={`mt-3 ${styles.subtitle}`}>最多玩家人數</div>
            <div className="mt-2">
              <p>讀取最多玩家人數</p>
            </div>

            <div className={`mt-3 ${styles.subtitle}`}>建議年齡</div>
            <div className="mt-2">
              <p>讀取建議年齡</p>
            </div>

            <div className={`mt-3 ${styles.subtitle}`}>平均遊玩時長</div>
            <div className="mt-2">
              <p>讀取平均遊玩時長</p>
            </div>
          </div>
      
    </>
  );
};

export default ProductDetailNotice2;
