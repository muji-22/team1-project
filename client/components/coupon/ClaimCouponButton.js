// components/coupon/ClaimCouponButton.js
//優惠券領取按鈕
// 使用方法
// 在pages/index.js 或其他任何頁面
// import ClaimCouponButton from '../components/coupon/ClaimCouponButton';
// export default function HomePage() {
//   return (
//     <div className="container">
//       {/* 其他內容 */}
  
//       {/* 基本使用 */}
//       <ClaimCouponButton couponId={1} />

//       {/* 自訂樣式和文字 */}
//       <ClaimCouponButton 
//         couponId={2}
//         buttonText="領取生日優惠券"
//         className="btn btn-outline-primary"
//       />

//       {/* 加入回調函數 */}
//       <ClaimCouponButton 
//         couponId={3}
//         onSuccess={() => {
//           console.log('優惠券領取成功！');
//           // 可以在這裡做其他處理
//         }}
//         onError={(errorMsg) => {
//           console.error('領取失敗：', errorMsg);
//           // 可以在這裡做錯誤處理
//         }}
//       />
//     </div>
//   );
// }

// components/coupon/ClaimCouponButton.js
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function ClaimCouponButton({ 
  couponId, 
  buttonText = '領取優惠券',
  className = 'btn btn-primary',
  onSuccess = () => {}, 
  onError = () => {},   
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isUsed, setIsUsed] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // 檢查優惠券狀態
  useEffect(() => {
    const checkCouponStatus = async () => {
      if (!isAuthenticated()) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:3005/api/coupons/check-status/${couponId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setIsClaimed(data.claimed);
          setIsUsed(!!data.usedTime);
          setIsExpired(data.expireTime && new Date(data.expireTime) < new Date());
        }
      } catch (err) {
        console.error('檢查優惠券狀態失敗:', err);
      }
    };

    checkCouponStatus();
  }, [couponId, isAuthenticated]);

  const handleClaim = async () => {
    // 檢查是否登入
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    // 檢查優惠券狀態
    if (isClaimed) {
      alert('您已經領取過此優惠券了！');
      return;
    }

    if (isExpired) {
      alert('此優惠券已過期！');
      return;
    }

    if (isUsed) {
      alert('此優惠券已使用！');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3005/api/coupons/claim/${couponId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '領取優惠券失敗');
      }

      setIsClaimed(true);
      
      // 顯示成功訊息
      const toastLiveExample = document.getElementById('claimToast');
      const toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
      
      onSuccess();

    } catch (err) {
      if (err.message.includes('已經領取')) {
        setIsClaimed(true);
      }
      onError(err.message);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 根據優惠券狀態返回按鈕文字
  const getButtonText = () => {
    if (isLoading) return (
      <>
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        處理中...
      </>
    );
    if (isUsed) return '已使用';
    if (isExpired) return '已過期';
    if (isClaimed) return '已領取';
    return buttonText;
  };

  // 根據優惠券狀態返回按鈕類別
  const getButtonClass = () => {
    const baseClass = 'btn ';
    if (isUsed || isExpired) return baseClass + 'btn-secondary';
    if (isClaimed) return baseClass + 'btn-success';
    return className;
  };

  return (
    <>
      <button 
        className={getButtonClass()}
        onClick={handleClaim}
        disabled={isLoading || isClaimed || isUsed || isExpired}
      >
        {getButtonText()}
      </button>

      {/* Toast 提示元件 */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="claimToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">系統通知</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            恭喜！優惠券領取成功
          </div>
        </div>
      </div>
    </>
  );
}