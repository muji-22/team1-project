// components/CouponCard.js
import { FaTicket } from "react-icons/fa6";

export default function CouponCard({ 
  name, 
  type, 
  discount, 
  endDate, 
  onClaim, 
  isOwned = false,
  isUsed = false,
  applyTo 
}) {
  // 檢查是否過期
  const isExpired = new Date(endDate) < new Date();

  // 格式化折扣顯示
  const formatDiscount = () => {
    if (type === 'percentage') {
      return `${100 - discount}折`
    } else {
      return `折抵 ${discount}元`
    }
  }

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW');
  }

  // 根據適用範圍顯示不同文字
  const getApplyText = () => {
    switch(applyTo) {
      case 'sale': return '限購買使用'
      case 'rental': return '限租借使用'
      case 'both': return '購買租借皆可用'
      default: return ''
    }
  }

  // 根據優惠券狀態取得背景顏色
  const getBackgroundClass = () => {
    if (isUsed) return 'bg-secondary'; // 已使用
    if (isExpired) return 'bg-danger';  // 已過期
    return 'bg-primary';  // 可使用
  }

  // 根據優惠券狀態取得狀態文字
  const getStatusText = () => {
    if (isUsed) return '已使用';
    if (isExpired) return '已過期';
    return getApplyText();
  }

  // 根據優惠券狀態決定是否要添加視覺效果
  const getCardStyle = () => {
    if (isUsed || isExpired) {
      return {
        maxWidth: '400px',
        opacity: '0.7',
        filter: 'grayscale(50%)'
      };
    }
    return { maxWidth: '400px' };
  }

  return (
    <div className="container mb-3">
      <div className="card border shadow-sm" style={getCardStyle()}>
        <div className="row g-0">
          {/* 左側圖示區 */}
          <div className={`col-4 ${getBackgroundClass()} d-flex align-items-center justify-content-center p-2`}>
            <FaTicket className="text-white w-75 h-auto" />
          </div>

          {/* 右側內容區 */}
          <div className="col-8 bg-white text-dark p-1">
            <div className="card-body p-2">
              {/* 優惠券名稱 */}
              <h5 className="card-title mb-2 fs-5 fw-bold">
                {name}
                {(isUsed || isExpired) && (
                  <span className={`badge ${isUsed ? 'bg-secondary' : 'bg-danger'} ms-2 fs-6`}>
                    {getStatusText()}
                  </span>
                )}
              </h5>

              {/* 折扣金額 */}
              <p className={`card-text mb-1 fs-5 fw-bold ${isUsed || isExpired ? 'text-secondary' : 'text-danger'}`}>
                {formatDiscount()}
              </p>

              {/* 到期日期 */}
              <p className="card-text mb-1 text-secondary">
                到期日：{formatDate(endDate)}
              </p>

              {/* 使用範圍 */}
              <p className="card-text mb-1 text-secondary small">
                {getApplyText()}
              </p>

              {/* 按鈕區域 */}
              {!isOwned && !isUsed && !isExpired && (
                <button 
                  onClick={onClaim}
                  className="btn btn-sm btn-primary w-100 mt-2"
                >
                  領取優惠券
                </button>
              )}
              
              {isOwned && !isUsed && !isExpired && (
                <button 
                  className="btn btn-sm btn-outline-primary w-100 mt-2"
                  onClick={() => window.location.href = '/products'}
                >
                  立即使用
                </button>
              )}

              {/* 狀態提示 */}
              {(isUsed || isExpired) && (
                <div className="text-center mt-2">
                  <span className={`text-${isUsed ? 'secondary' : 'danger'} small`}>
                    {getStatusText()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}