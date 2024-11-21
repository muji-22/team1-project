import React from "react";
import styles from "./rentNotice2.module.css";
const RentNotice2 = ({}) => {
    return (
        <>
            <div className="accordion" id="rentNotice2Accordion">
                <div className="accordion-item border-0">
                    <div className={`row ${styles.noticeLine}`}>
                        <h5 className="accordion-header">
                            <button
                                className={`accordion-button h5 ${styles.accordionButton}`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseRentNotice2"
                            >
                                商品歸還與押金退款
                            </button>
                        </h5>
                    </div>

                    <div
                        id="collapseRentNotice2"
                        className="accordion-collapse collapse show"
                        data-bs-parent="#rentNotice2Accordion"
                    >
                        <div className="accordion-body">
                            <div className="mt-5">
                                <p className={styles.p}>商品歸還：</p>
                            </div>
                            <ul>
                                <li>歸還時請先拍照記錄完整商品狀態</li>
                                <li>使用原包裝完整包裝後寄回</li>
                                <li>寄回時請使用宅配或郵局包裹寄送</li>
                            </ul>

                            {/* 押金退款 */}
                            <div className="mt-5">
                                <p className={styles.p}>押金退款：</p>
                            </div>
                            <ul>
                                <li>
                                    收到商品並確認狀態無誤後，3個工作日內退還押金
                                </li>
                                <li>自然耗損不收取費用</li>
                                <li>退款將退回原付款帳戶或信用卡</li>
                            </ul>

                            {/* 罰款規定 */}
                            <div className="mt-5">
                                <p className={styles.p}>罰款規定：</p>
                            </div>
                            <ul>
                                <li>商品如有人為損壞，依損壞程度扣除押金</li>
                                <li>商品如有遺失，將沒收全額押金</li>
                                <li>逾期歸還，每日加收租金2.5倍罰金</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RentNotice2;
