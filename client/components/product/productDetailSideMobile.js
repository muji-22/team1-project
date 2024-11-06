import React from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import QuantityAdjuster from "@/components/product/quantityAdjuster";
import styles from "./productDetailSide.module.css";
import ProductDetailMainNotice from "./productDetailMainNotice2";
import AddProduct from '@/components/cart/addProduct';

const ProductDetailSideMobile = ({}) => {
  return (
    <>
      <div class="row mt-5">
        <div class="col-12 text-center">
          <h4 style={{ fontWeight: "700" }}>
            商品名稱
            <a href="#" className="btn">
              <IoMdHeartEmpty className="fs-4 ${styles.heart} text-danger" />
            </a>
          </h4>
        </div>
        <h6 class="col-12 text-center">$</h6>
        <div className="col-12 mt-2 text-center">
          商品數量 <QuantityAdjuster />
        </div>
      </div>

      <div className="row align-items-center g-2 mt-4 mb-2">
        <div className="col-2"></div>
        <div className="col-4 pe-5">
        <AddProduct/>
        </div>
        <div className="col-4 ps-5">
          <a
            href="#"
            className="btn btn-success  w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 mt-auto "
          >
            切換至租借商品
          </a>
        </div>
        <div className="col-2"></div>
      </div>

      {/* 商品敘述 */}

      {/* <div class="row">
            <p className={`${styles.subtitle}`}>規格</p>
            <div></div>

            <div className={`mt-3 ${styles.subtitle}`}>最少玩家人數</div>
            <div>
              <p>讀取最少玩家人數</p>
            </div>

            <div className={`${styles.subtitle}`}>最多玩家人數</div>
            <div>
              <p>讀取最多玩家人數</p>
            </div>

            <div className={`${styles.subtitle}`}>建議年齡</div>
            <div>
              <p>讀取建議年齡</p>
            </div>

            <div className={`${styles.subtitle}`}>平均遊玩時長</div>
            <div>
              <p>讀取平均遊玩時長</p>
            </div>
          </div> */}
    </>
  );
};

export default ProductDetailSideMobile;
