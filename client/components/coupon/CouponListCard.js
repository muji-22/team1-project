// components/coupon/CouponListCard.js
import { FaTicket } from "react-icons/fa6";

export default function CouponListCard({ 
  name, 
  type, 
  discount, 
  startDate,
  endDate, 
  onClaim, 
  isOwned = false,
  isUsed = false,
  applyTo 
}) {
  // 檢查是否過期
  const now = new Date();
  const isExpired = new Date(endDate) < now;
  const isNotStarted = new Date(startDate) > now; 

  // 格式化折扣顯示
  const formatDiscount = () => {
    if (type === 'percentage') {
      return `${discount}折`
    } else {
      return `折抵 ${discount}元`
    }
  }

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW');
  }

  // 根據適用範圍顯示不同文字和顏色
  const getApplyInfo = () => {
    switch(applyTo) {
      case 'sale': 
        return {
          text: '限購買使用',
          color: 'text-danger'
        }
      case 'rental': 
        return {
          text: '限租借使用',
          color: 'text-danger'
        }
      case 'both': 
        return {
          text: '適用全部商品',
          color: 'text-custom'
        }
      default: 
        return {
          text: '',
          color: ''
        }
    }
  }

   // 根據優惠券狀態取得左側區塊的背景顏色
   const getBackgroundColor = () => {
    if (isOwned) return 'bg-secondary';
    if (isNotStarted) return 'bg-warning';
    if (isExpired) return 'bg-danger';
    return 'bg-custom';
  }

  // 根據優惠券狀態取得按鈕配置
  const getButtonConfig = () => {
    if (isOwned) {
      return {
        text: '已領取',
        className: 'btn btn-sm btn-secondary w-100',
        disabled: true
      };
    }
    if (isNotStarted) {
      return {
        text: '優惠尚未開始',
        className: 'btn btn-sm btn-secondary w-100',
        disabled: true
      };
    }
    if (isExpired) {
      return {
        text: '已過期',
        className: 'btn btn-sm btn-danger w-100',
        disabled: true
      };
    }
    return {
      text: '領取',
      className: 'btn btn-sm btn-custom w-100',
      disabled: false
    };
  }

  const applyInfo = getApplyInfo();
  const buttonConfig = getButtonConfig();

  return (
    <div className="container mb-3">
      <div className="card border shadow-sm">
        <div className="row g-0">
          {/* 左側圖示區 */}
          <div className={`col-4 ${getBackgroundColor()} d-flex align-items-center justify-content-center p-2`}>
            <FaTicket className="text-white w-75 h-auto" />
          </div>

          {/* 右側內容區 */}
          <div className="col-8 bg-white text-dark p-1">
            <div className="card-body p-2">
              {/* 優惠券名稱和狀態 */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title mb-0 fs-5 fw-bold">{name}</h5>
              </div>

              {/* 折扣金額 */}
              <p className="card-text mb-1 fs-5 fw-bold text-danger">
                {formatDiscount()}
              </p>

              {/* 活動期間 */}
              <div className="card-text mb-1 text-secondary small">
                <p className="mb-0">開始日期：{formatDate(startDate)}</p>
                <p className="mb-1">結束日期：{formatDate(endDate)}</p>
              </div>

              {/* 使用範圍 */}
              <p className={`card-text mb-2 ${applyInfo.color}`}>
                <small className="fw-bold">{applyInfo.text}</small>
              </p>

              {/* 按鈕 */}
              <button 
                onClick={onClaim}
                className={buttonConfig.className}
                disabled={buttonConfig.disabled}
              >
                {buttonConfig.text}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}