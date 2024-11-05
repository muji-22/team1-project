import { useState, useEffect } from 'react';
import CouponCard from '../../components/coupon/CouponCard';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // 獲取所有優惠券
    useEffect(() => {
      const fetchCoupons = async () => {
        try {
          const response = await fetch('http://localhost:3005/api/coupons');
          if (!response.ok) {
            throw new Error('獲取優惠券失敗');
          }
          const data = await response.json();
          setCoupons(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCoupons();
    }, []);

    const handleClaimCoupon = async (couponId) => {
        try {
          // 這裡應該要從登入狀態獲取 userId
          const userId = 1; // 假設用戶ID為1
          
          const response = await fetch(`http://localhost:3005/api/coupons/claim/${couponId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          });
    
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '領取優惠券失敗');
          }
    
          // 顯示成功訊息（可以使用 bootstrap 的 alert 或 toast）
          alert('優惠券領取成功！');
          
        } catch (err) {
          alert(err.message);
        }
      };
    
      if (loading) {
        return (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        );
      }
    
      if (error) {
        return (
          <div className="alert alert-danger m-3" role="alert">
            {error}
          </div>
        );
      }


  return (
    <div className="container py-4">
      <h2 className="mb-4">可用優惠券</h2>
      {coupons.length === 0 ? (
        <div className="alert alert-info">
          目前沒有可用的優惠券
        </div>
      ) : (
        <div className="row g-4">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="col-12 col-md-6 col-lg-4">
              <CouponCard
                name={coupon.name}
                type={coupon.type}
                discount={coupon.discount}
                endDate={coupon.end_date}
                applyTo={coupon.apply_to}
                onClaim={() => handleClaimCoupon(coupon.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}