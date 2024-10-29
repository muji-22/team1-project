import { FaTicket } from "react-icons/fa6";

export default function Coupon() {
  return (
    <div className="container">
      <div className="card border shadow-sm" style={{ maxWidth: '400px' }}>
        <div className="row g-0">
          <div className="col-4 bg-custom d-flex align-items-center justify-content-center p-2">
            <FaTicket className="text-white w-75 h-auto" />
          </div>
          <div className="col-8 bg-white text-dark p-1">
            <div className="card-body p-2">
              <h5 className="card-title mb-2 fs-5 fw-bold">優惠券</h5>
              <p className="card-text mb-1 fs-5 fw-bold text-danger">95折</p>
              <p className="card-text mb-1 text-secondary">到期日：2024/12/31</p>
              <a href="#" className="card-text text-custom text-decoration-none">前往商城</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}