// pages/member/coupons.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import CouponCard from '../../components/coupon/CouponCard';

export default function MemberCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // 驗證是否登入（修改驗證邏輯）
  useEffect(() => {
    // 等待 auth 完成載入再進行檢查
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    // 若使用者已登入，則獲取優惠券資料
    if (user) {
      fetchUserCoupons();
    }
  }, [user, authLoading]);

  
// 獲取用戶優惠券
const fetchUserCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3005/api/coupons/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  // 使用優惠券
  const handleUseCoupon = async (couponId) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3005/api/coupons/use/${couponId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '使用優惠券失敗');
      }

      // 更新優惠券列表
      const updatedCoupons = coupons.map(coupon => 
        coupon.id === couponId 
          ? { ...coupon, used_time: new Date().toISOString() }
          : coupon
      );
      setCoupons(updatedCoupons);

      alert('優惠券使用成功！');
    } catch (err) {
      alert(err.message);
    }
  };

  // 根據目前的標籤過濾優惠券
  const filteredCoupons = coupons.filter(coupon => {
    const now = new Date();
    const endDate = new Date(coupon.end_date);
    const startDate = new Date(coupon.start_date);
    
    switch (activeTab) {
      case 'available':
        return !coupon.used_time && 
               endDate >= now && 
               startDate <= now;
      case 'expired':
        return !coupon.used_time && 
               (endDate < now || startDate > now);
      case 'used':
        return coupon.used_time !== null;
      default:
        return true;
    }
  });

  // 修改載入中的判斷條件
  if (authLoading || loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // 顯示錯誤訊息
  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">我的優惠券</h2>

      {/* 分類標籤 */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            可使用的優惠券
            <span className="badge bg-primary ms-2">
              {coupons.filter(c => 
                !c.used_time && 
                new Date(c.end_date) >= new Date() && 
                new Date(c.start_date) <= new Date()
              ).length}
            </span>
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'expired' ? 'active' : ''}`}
            onClick={() => setActiveTab('expired')}
          >
            已過期的優惠券
            <span className="badge bg-secondary ms-2">
              {coupons.filter(c => 
                !c.used_time && 
                (new Date(c.end_date) < new Date() || 
                new Date(c.start_date) > new Date())
              ).length}
            </span>
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'used' ? 'active' : ''}`}
            onClick={() => setActiveTab('used')}
          >
            已使用的優惠券
            <span className="badge bg-secondary ms-2">
              {coupons.filter(c => c.used_time !== null).length}
            </span>
          </button>
        </li>
      </ul>

      {/* 優惠券列表 */}
      {filteredCoupons.length === 0 ? (
        <div className="alert alert-info">
          {activeTab === 'available' && '目前沒有可用的優惠券'}
          {activeTab === 'expired' && '沒有已過期的優惠券'}
          {activeTab === 'used' && '沒有已使用的優惠券'}
        </div>
      ) : (
        <div className="row g-4">
          {filteredCoupons.map((coupon) => (
            <div key={coupon.id} className="col-12 col-md-6 col-lg-4">
              <CouponCard
                name={coupon.name}
                type={coupon.type}
                discount={coupon.discount}
                endDate={coupon.end_date}
                startDate={coupon.start_date}
                applyTo={coupon.apply_to}
                isOwned={true}
                isUsed={coupon.used_time !== null}
                onUse={() => handleUseCoupon(coupon.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* 優惠券使用說明 */}
      <div className="mt-4 p-3 bg-light rounded">
        <h5>使用說明</h5>
        <ul className="small text-muted">
          <li>優惠券需在有效期間內使用</li>
          <li>每個優惠券只能使用一次</li>
          <li>部分優惠券可能有使用限制，請查看優惠券說明</li>
          <li>優惠券一經使用，無法恢復</li>
        </ul>
      </div>
    </div>
  );
}