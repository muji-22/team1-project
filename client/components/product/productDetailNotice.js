// ProductDetailNotice.js
import React from "react";
import styles from "./productDetailNotice.module.css";

const ProductDetailNotice = () => {
    return (
        <div className="accordion" id="noticeAccordion">
            <div className="accordion-item border-0">
                <div className={`row ${styles.noticeLine}`}>
                    <h5 className=" accordion-header">
                        <button
                            className={`accordion-button h5 ${styles.accordionButton}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseNotice"
                        >
                            注意事項
                        </button>
                    </h5>
                </div>

                <div
                    id="collapseNotice"
                    className="accordion-collapse collapse show gap-bottom-3"
                    data-bs-parent="#noticeAccordion"
                >
                    <div className="accordion-body">
                        <div className="mt-5">
                            <p className={styles.p}>購物須知</p>
                        </div>
                        <ul>
                            <li>若對商品有疑問，請洽客服。</li>
                        </ul>
                        <div className="mt-5">
                            <p className={styles.p}>送貨時間為何？</p>
                        </div>
                        <ul>
                            <li>
                                線上購買 - 標準運送：每日
                                16:00前完成訂購，商品將於一個工作天起可宅配至您指定地點...
                            </li>
                            <li>
                                原則上本島地區商品會於
                                2個工作天內送達，離島地區配送區域...
                            </li>
                            <li>
                                實際到達時間、配送相關服務視配送地點及天候狀況而定...
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailNotice;
