import React from "react";
import style from "./rentNotice2.module.css";
const RentNotice2 = ({}) => {
  return (
    <>
      <div className={`row mt-5 ${style.noticeLine}`}>
        <h5 className="mt-2">商品歸還與押金退款</h5>
      </div>

      {/* 歸還說明 */}
      <div className="mt-5">
        <p style={{ fontWeight: "700" }}>商品歸還：</p>
      </div>
      <ul>
        <li>歸還時請先拍照記錄完整商品狀態</li>
        <li>使用原包裝完整包裝後寄回</li>
        <li>寄回時請使用宅配或郵局包裹寄送</li>
      </ul>

      {/* 押金退款 */}
      <div className="mt-5">
        <p style={{ fontWeight: "700" }}>押金退款：</p>
      </div>
      <ul>
        <li>收到商品並確認狀態無誤後，3個工作日內退還押金</li>
        <li>自然耗損不收取費用</li>
        <li>退款將退回原付款帳戶或信用卡</li>
      </ul>

      {/* 罰款規定 */}
      <div className="mt-5">
        <p style={{ fontWeight: "700" }}>罰款規定：</p>
      </div>
      <ul>
        <li>商品如有人為損壞，依損壞程度扣除押金</li>
        <li>商品如有遺失，將沒收全額押金</li>
        <li>逾期歸還，每日加收租金2.5倍罰金</li>
      </ul>
    </>
  );
};

export default RentNotice2;
