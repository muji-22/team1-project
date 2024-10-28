import React, { useState, useRef, useEffect } from "react";
import { FaTicket } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const customButtonStyles = `
 .btn-outline-custom:hover {
    color: white;
  }
`;

// 模擬的優惠券數據
const COUPONS = [
  {
    id: 1,
    title: "新用戶優惠",
    value: "85折",
    description: "首次購物可使用",
    validUntil: "2024-12-31",
    code: "NEW85",
  },
  {
    id: 2,
    title: "春節特惠",
    value: "現折$100",
    description: "單筆消費滿$1000可使用",
    validUntil: "2024-02-29",
    code: "SPRING100",
  },
  {
    id: 3,
    title: "會員日優惠",
    value: "9折",
    description: "指定商品可使用",
    validUntil: "2024-03-31",
    code: "MEM90",
  },
];

const CouponSelector = () => {
  const [show, setShow] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const target = useRef(null);
  const popoverRef = useRef(null);

  // 處理點擊外部關閉
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        target.current &&
        !target.current.contains(event.target)
      ) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 過濾優惠券
  const filteredCoupons = COUPONS.filter(
    (coupon) =>
      coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 選擇優惠券
  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setShow(false);
  };

  // 優惠券卡片組件
  const CouponCard = ({ coupon, isSelected, onSelect }) => (
    <div
      className={`mb-2 cursor-pointer ${
        isSelected ? "border-primary" : ""
      }`}
      onClick={() => onSelect(coupon)}
    >
      <div className="card shadow-sm mx-2" style={{ maxWidth: "400px" }}>
        <div className="row g-0">
          <div className="col-4 bg-custom d-flex align-items-center justify-content-center p-2">
            <FaTicket className="text-white w-75 h-auto" />
          </div>
          <div className="col-8 bg-white text-dark p-1">
            <div className="card-body p-2">
              <h5 className="card-title mb-2 fs-5 fw-bold">{coupon.title}</h5>
              <p className="card-text mb-1 fs-5 fw-bold text-danger">{coupon.value}</p>
              <p className="card-text mb-1 text-secondary">
                到期日：{coupon.validUntil}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-tag text-primary"></i>
            <h6 className="card-title mb-0">{coupon.title}</h6>
          </div>
          <span className="text-danger fw-bold">{coupon.value}</span>
        </div>
        <p className="card-text small text-muted mt-2 mb-1">
          {coupon.description}
        </p>
        <div className="d-flex align-items-center gap-1 small text-muted">
          <i className="bi bi-clock"></i>
          <span>有效期限：{coupon.validUntil}</span>
        </div>
      </div> */}
    </div>
  );

  return (
    <div className="container py-4">
      <div className="position-relative " style={{ maxWidth: "350px" }}>
        {/* 觸發按鈕 */}
        <button
          ref={target}
          className="btn btn-outline-custom w-100 d-flex justify-content-between align-items-center"
          onClick={() => setShow(!show)}
        >
          <span>選擇優惠券</span>
          {selectedCoupon && (
            <span className="badge bg-secondary">已選擇 1 張</span>
          )}
        </button>

        {/* Popover 內容 */}
        {show && (
          <div
            ref={popoverRef}
            className="position-absolute top-100 start-0 mt-2 w-100 bg-white border rounded shadow-sm"
            style={{ zIndex: 1000, maxWidth: "350px" }}
          >
            <div className="p-3">
              {/* 搜尋框 */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                  <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="搜尋優惠券..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* 優惠券列表 */}
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {filteredCoupons.length > 0 ? (
                  filteredCoupons.map((coupon) => (
                    <CouponCard
                      key={coupon.id}
                      coupon={coupon}
                      isSelected={selectedCoupon?.id === coupon.id}
                      onSelect={handleSelectCoupon}
                    />
                  ))
                ) : (
                  <div className="text-center text-muted py-3">
                    沒有符合條件的優惠券
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 已選擇的優惠券顯示 */}
      {selectedCoupon && (
        <div className="mt-4">
          <h6 className="mb-3">已選擇的優惠券：</h6>
          <div className="alert alert-info">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="alert-heading">{selectedCoupon.title}</h6>
                <p className="mb-0 small">{selectedCoupon.description}</p>
                <small className="text-muted">
                  優惠碼：{selectedCoupon.code}
                </small>
              </div>
              <span className="badge bg-success">{selectedCoupon.value}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponSelector;
