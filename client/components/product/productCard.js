import React from "react";
// import { Heart } from "lucide-react";
import styles from "./productCard.module.css";

// // 定義產品資料型別

// // 元件接收產品資料作為props
const ProductCard = ({}) => {
    return (
        <>
            <div className="card col-3 border border-primary mb-5">
                <div className="py-5">
                    <img
                        src="/public/images/product_img/5a5f970ae84dd70001593509_DIXIT_7_Box_CH.jpg"
                        alt="產品圖片"
                    />
                </div>

                <div>
                    <h6>繽紛果園35週年版</h6>
                    <hr />
                    <span></span>
                    <span>NT$1690</span>
                    <p></p>
                    <button className="btn btn-success">加入購物車</button>
                </div>
            </div>
        </>
    );
};

export default ProductCard;
