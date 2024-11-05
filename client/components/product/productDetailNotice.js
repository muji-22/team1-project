import React from "react";
import styles from "./productDetailNotice.module.css";
const ProductDetailNotice = ({}) => {
  return (
    <>
      <div>
        <div className={`row mt-5 ${styles.noticeLine}`}>
          <h5 className="mt-2">注意事項</h5>
        </div>
        <div className="mt-5">
          <p style={{ fontWeight: "700" }}>購物須知</p>
        </div>
        <ul><li>若對商品有疑問，請洽客服。</li></ul>
        <div className="mt-5">
          <p style={{ fontWeight: "700" }}>送貨時間為何？</p>
        </div>
        <ul>
        <li>
          線上購買 - 標準運送：每日 16:00前完成訂購，商品將於一個工作天起可宅配至您指定地點。每日 16:00後完成訂購，商品將於兩個工作天起可宅配至您指定地點。週日不配送，如遇週日則將延後至週一配送。
        </li>
        <li>
          原則上本島地區商品會於 2個工作天內送達，離島地區配送區域:台東縣綠島鄉蘭嶼鄉、澎湖縣、金門縣、連江縣、屏東縣琉球鄉。收貨地址如為離島地區，配送時間約3 - 7 天。
        </li>
        <li>
          實際到達時間、配送相關服務視配送地點及天候狀況而定。恕無法使用快速到貨，貨到付款服務亦因配送地區將有所限制，詳情請洽客服。若收貨人資訊不完整、收貨人無法收貨、遇颱風地震等天災、公共工程、或系統設備維護等情況，出貨時間將視實際狀況順延。
        </li>
        </ul>
      </div>
    </>
  );
};

export default ProductDetailNotice;
