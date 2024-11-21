import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import CouponCard from '../../components/coupon/CouponCard';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import styles from './CouponsPage.module.scss';

const TABS = {
 VALID: 'valid',
 USED: 'used', 
 EXPIRED: 'expired'
};

const TAB_LABELS = {
 [TABS.VALID]: '可使用',
 [TABS.USED]: '已使用',
 [TABS.EXPIRED]: '已過期'
};

const LoadingSpinner = () => (
 <div className="text-center py-5">
   <div className="spinner-border text-primary" role="status">
     <span className="visually-hidden">載入中...</span>
   </div>
 </div>
);

export default function CouponsPage() {
 const [coupons, setCoupons] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [activeTab, setActiveTab] = useState(TABS.VALID);
 
 const router = useRouter();
 const { user, isAuthenticated, loading: authLoading } = useAuth();

 useEffect(() => {
   if (!authLoading && !isAuthenticated()) {
     router.push('/auth/login?redirect=/coupons');
     return;
   }
 }, [authLoading, isAuthenticated, router]);

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
     toast.error('獲取優惠券失敗');
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   fetchUserCoupons();
 }, [user, authLoading, isAuthenticated]);

 const categorizedCoupons = useMemo(() => {
   const now = new Date();
   const validCoupons = [];
   const usedCoupons = [];
   const expiredCoupons = [];

   coupons.forEach((coupon) => {
     const endDate = new Date(coupon.end_date);
     const key = `${coupon.id}-${coupon.status}`;

     if(coupon.used_time) {
       usedCoupons.push({...coupon, uniqueKey: `used-${key}`});
     } else if(endDate < now) {
       expiredCoupons.push({...coupon, uniqueKey: `expired-${key}`});
     } else {
       validCoupons.push({...coupon, uniqueKey: `valid-${key}`});
     }
   });

   return {
     [TABS.VALID]: validCoupons,
     [TABS.USED]: usedCoupons,
     [TABS.EXPIRED]: expiredCoupons
   };
 }, [coupons]);

 const handleRetry = () => {
   setError(null);
   setLoading(true);
   fetchUserCoupons();
 };

 if (authLoading || loading) {
   return <LoadingSpinner />;
 }

 if (!isAuthenticated()) {
   return null;
 }

 if (error) {
   return (
     <div className="container py-4">
       <div className="alert alert-danger m-3" role="alert">
         {error}
         <button 
           className="btn btn-link"
           onClick={handleRetry}
         >
           重試
         </button>
       </div>
     </div>
   );
 }

 return (
   <div className={styles.mainContent}>
     <div className={styles.tabs}>
       {Object.entries(TAB_LABELS).map(([key, label]) => (
         <button 
           key={key}
           className={`${styles.tab} ${activeTab === key ? styles.activeTab : ''}`}
           onClick={() => setActiveTab(key)}
         >
           {label}
           <span className={`${styles.badge} ${styles[key]}`}>
             {categorizedCoupons[key].length}
           </span>
         </button>
       ))}
     </div>

     <div className={styles.listWrapper}>
       {categorizedCoupons[activeTab].length === 0 ? (
         <div className={styles.emptyMessage}>
           {`目前沒有${TAB_LABELS[activeTab]}的優惠券`}
         </div>
       ) : (
         <div className={styles.list}>
           {categorizedCoupons[activeTab].map((coupon) => (
             <CouponCard
               key={coupon.uniqueKey}
               name={coupon.name}
               type={coupon.type}
               discount={coupon.discount}
               endDate={coupon.end_date}
               applyTo={coupon.apply_to} 
               isOwned={true}
               isUsed={activeTab === TABS.USED}
               isExpired={activeTab === TABS.EXPIRED}
             />
           ))}
         </div>
       )}
     </div>
   </div>
 );
}