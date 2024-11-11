import React from "react";
import style from "./rentNotice.module.css";
const RentNotice = ({ }) => {
  return (
    <>
      <div className={`row mt-5 ${style.noticeLine}`}>
          <h5 className="mt-2">租借注意事項</h5>
        </div>

        <div className="mt-5">
          <p style={{ fontWeight: "700" }}>租金計算方式：</p>
        </div>
        <ul>
          <li>租借以「1日」為基本計算單位，最少需租3日</li>
          <li>租金計算範例：3日租期 = 租金×3</li>
          <li>租期5日 = 租金×5，依此類推</li>
          <li>起租日為商品配送到達後隔日開始計算</li>
          <li>範例：3日租期，11/20收到商品，11/21開始計算，11/23須寄回</li>
          <li>歸還日期以寄回郵戳為準，如有逾期將收取罰金</li>
          <li>商品相關問題請透過客服信箱聯繫</li>
        </ul>

        <div className="mt-5">
          <p style={{ fontWeight: "700" }}>配送說明：</p>
        </div>
        <ul>
          <li>線上訂購配送時間：<br />
            1.每日16:00前完成訂購，隔日配送<br />
            2.16:00後完成訂購，第二個工作天配送<br />
            3.週日不配送，順延至週一</li>
          <li>
            配送區域說明：<br />
            1.本島地區約2個工作天到貨<br />
            2.離島地區(台東縣綠島/蘭嶼、澎湖縣、金門縣、連江縣、屏東縣琉球鄉)約3-7個工作天到貨
          </li>
        </ul>
    </>
  );
};

export default RentNotice;
