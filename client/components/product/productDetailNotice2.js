import React from "react";
import styles from "./productDetailNotice2.module.css";

const ProductDetailNotice2 = () => {
  return (
    <div className="accordion" id="noticeAccordion2">
      <div className="accordion-item border-0">
        <div className={`row ${styles.noticeLine}`}>
          <h5 className="accordion-header">
            <button
              className={`accordion-button h5 ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseNotice2"
            >
              退款換貨須知
            </button>
          </h5>
        </div>

        <div
          id="collapseNotice2"
          className="accordion-collapse collapse show"
          data-bs-parent="#noticeAccordion2"
        >
          <div className="accordion-body">
            <div className="mt-5">
              <p className={styles.p}>如何退貨?</p>
            </div>
            <ul>
              <li>退款申請須於收到商品後隔日起算 7 日內提出。</li>
              <li>若申請逾時或不符合退貨政策條件範圍，本店有權拒絕退貨。</li>
              <li>本店不提供換貨服務。</li>
              <li>如對商品或訂單有疑問，請以站內訊息詢問客服。</li>
              <li>以下商品不接受客人因個人因素申請退款：1.已拆封商品</li>
            </ul>
            <div className="mt-5">
              <p className={styles.p}>退款流程為何?</p>
            </div>
            <ol>
              <li>
                接獲買家申請退貨後，本店將儘速確認並回覆退貨要求（約3－７個工作日）。
              </li>
              <li>
                原則上本島地區商品會於 2個工作天內送達，離島地區配送區域:台東縣綠島鄉蘭嶼鄉、澎湖縣、金門縣、連江縣、屏東縣琉球鄉。收貨地址如為離島地區，配送時間約3 - 7 天。
              </li>
              <li>
                請於４個工作天內，將完整的商品寄出。(宅配商品本店將委託指定之宅配公司，在3-7個工作天內透過電話與您連絡前往取回退貨商品)
              </li>
              <li>
                本店於收到退貨商品後，約3個工作日完成退貨款項。
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailNotice2;