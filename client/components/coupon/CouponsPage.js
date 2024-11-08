import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CouponCard from '../../components/coupon/CouponCard';
import { useAuth } from '../../contexts/AuthContext';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('valid');
    
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    // 檢查登入狀態
    useEffect(() => {
        if (!authLoading && !isAuthenticated()) {
            router.push('/auth/login?redirect=/coupons');
            return;
        }
    }, [authLoading, isAuthenticated, router]);

    // 獲取使用者的優惠券
    useEffect(() => {
        const fetchUserCoupons = async () => {
            if (authLoading || !isAuthenticated()) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `http://localhost:3005/api/coupons/user/${user.id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
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

        fetchUserCoupons();
    }, [user, authLoading, isAuthenticated]);

    // 如果還在檢查認證狀態，顯示載入中
    if (authLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">載入中...</span>
                </div>
            </div>
        );
    }

    // 如果未登入，不顯示任何內容（會被重導向）
    if (!isAuthenticated()) {
        return null;
    }

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">載入中...</span>
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

    // 分類優惠券
    const categorizedCoupons = {
        valid: coupons.filter(coupon => 
            new Date(coupon.end_date) >= new Date() && !coupon.used_time
        ),
        used: coupons.filter(coupon => 
            coupon.used_time
        ),
        expired: coupons.filter(coupon => 
            new Date(coupon.end_date) < new Date() && !coupon.used_time
        )
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">我的優惠券</h2>

            {/* 分類標籤 */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'valid' ? 'active' : ''}`}
                        onClick={() => setActiveTab('valid')}
                    >
                        可使用的優惠券
                        <span className="badge bg-primary ms-2">
                            {categorizedCoupons.valid.length}
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
                            {categorizedCoupons.used.length}
                        </span>
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'expired' ? 'active' : ''}`}
                        onClick={() => setActiveTab('expired')}
                    >
                        已過期的優惠券
                        <span className="badge bg-danger ms-2">
                            {categorizedCoupons.expired.length}
                        </span>
                    </button>
                </li>
            </ul>

            {/* 優惠券列表 */}
            <div className="row g-4">
                {categorizedCoupons[activeTab].length === 0 ? (
                    <div className="col-12">
                        <div className="alert alert-info">
                            {activeTab === 'valid' && '目前沒有可使用的優惠券'}
                            {activeTab === 'used' && '沒有已使用的優惠券'}
                            {activeTab === 'expired' && '沒有已過期的優惠券'}
                        </div>
                    </div>
                ) : (
                    categorizedCoupons[activeTab].map((coupon) => (
                        <div key={coupon.id} className="col-12 col-md-6 col-lg-4">
                            <CouponCard
                                name={coupon.name}
                                type={coupon.type}
                                discount={coupon.discount}
                                endDate={coupon.end_date}
                                applyTo={coupon.apply_to}
                                isOwned={true}
                                isUsed={Boolean(coupon.used_time)}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}