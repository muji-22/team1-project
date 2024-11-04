import React from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import QuantityAdjuster from "@/components/product/quantityAdjuster";




const ProductDetailSide = ({}) => {
  return (
      <>
        <dl class="row">
            <dt class="col-sm-9">
              <h4 style={{ fontWeight: "700" }}>商品名稱</h4>
            </dt>
            <dd class="col-sm-3">
              <a href="#" className="btn">
                <IoMdHeartEmpty className="fs-4 ${styles.heart} text-danger" />
              </a>
            </dd>
            <h6 class="col-sm-3">$</h6>
            <dd class="col-sm-9"></dd>
            <div className="col-6">
              商品數量 <QuantityAdjuster/>
            </div>
          </dl>

          <div className="row align-items-center g-2 mb-2">
            <div className="col-sm-4">
						<a
            href="#"
            className="btn btn-custom  w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 mt-auto "
          >
            加入購物車 <FaCartPlus size={20} />
          </a>
            </div>
						<div className="col-sm-4">
						<a
            href="#"
            className="btn btn-success  w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 mt-auto "
          >
            切換至租借商品
          </a>
            </div>
          </div>
          

          {/* 商品敘述 */}
          <p>讀取商品敘述</p>

          <dl class="row">
            <dt class="col-sm-3">規格</dt>
            <dd class="col-sm-9"></dd>

            <dt class="col-sm-3">最少玩家人數</dt>
            <dd class="col-sm-9">
              <p>讀取最少玩家人數</p>
            </dd>

            <dt class="col-sm-3">最多玩家人數</dt>
            <dd class="col-sm-9">
              <p>讀取最多玩家人數</p>
            </dd>

            <dt class="col-sm-3">建議年齡</dt>
            <dd class="col-sm-9">
              <p>讀取建議年齡</p>
            </dd>

            <dt class="col-sm-3">平均遊玩時長</dt>
            <dd class="col-sm-9">
              <p>讀取平均遊玩時長</p>
            </dd>
          </dl>
      </>
  );
}



export default ProductDetailSide;