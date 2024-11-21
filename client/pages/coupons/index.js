// pages/coupons/index.js
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Head from "next/head";
import CouponListCard from "@/components/coupon/CouponListCard";
import Pagination from "@/components/product/Pagination";
import Swal from "sweetalert2";
import Breadcrumb from "@/components/Breadcrumb";

export default function Coupons() {
  // 狀態管理
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCoupons, setUserCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const ITEMS_PER_PAGE = 6;

  const { user, isAuthenticated } = useAuth();

  // 獲取所有優惠券
  const fetchCoupons = async () => {
    try {
      const response = await fetch("http://localhost:3005/api/coupons");
      const data = await response.json();

      // 篩選出目前可用的優惠券（排除過期和未開始的）
      const now = new Date();
      const availableCoupons = data.filter((coupon) => {
        const startDate = new Date(coupon.start_date);
        const endDate = new Date(coupon.end_date);
        return startDate <= now && endDate >= now;
      });

      setCoupons(availableCoupons);
      setTotalPages(Math.ceil(availableCoupons.length / ITEMS_PER_PAGE));
    } catch (err) {
      setError("獲取優惠券失敗");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 獲取使用者的優惠券
  const fetchUserCoupons = async () => {
    try {
      if (!isAuthenticated() || !user) {
        setUserCoupons([]);
        return;
      }

      const response = await fetch(
        `http://localhost:3005/api/coupons/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setUserCoupons(data);
    } catch (err) {
      console.error("獲取用戶優惠券失敗:", err);
      setUserCoupons([]);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      await fetchCoupons();
      await fetchUserCoupons();
    };

    initPage();
  }, [user, isAuthenticated]);

  // 領取優惠券
  const handleClaimCoupon = async (couponId) => {
    if (!isAuthenticated()) {
      Swal.fire({
        icon: "warning",
        title: "請先登入",
        text: "需要登入才能領取優惠券",
        confirmButtonText: "前往登入",
        showCancelButton: true,
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/auth/login";
        }
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3005/api/coupons/claim/${couponId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "領取成功！",
          text: "優惠券已加入您的帳戶",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchUserCoupons();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "領取失敗",
        text: error.message || "請稍後再試",
      });
    }
  };

  // 處理排序
  const handleSort = (type) => {
    setSortType(type);
    setCurrentPage(1);
    let sorted = [...coupons];

    switch (type) {
      case "newest":
        sorted.sort(
          (a, b) => new Date(b.created_time) - new Date(a.created_time)
        );
        break;
      case "expiringSoon":
        sorted.sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
        break;
      default:
        break;
    }

    setCoupons(sorted);
  };

  // 處理搜尋文字改變
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 處理適用範圍篩選改變
  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };

  // 處理搜尋和篩選
  const getFilteredCoupons = () => {
    return coupons.filter((coupon) => {
      const searchCondition = searchTerm.toLowerCase();
      const nameMatch = coupon.name.toLowerCase().includes(searchCondition);
      const codeMatch = coupon.code.toLowerCase().includes(searchCondition);
      const filterMatch = filterType === "all" || coupon.apply_to === filterType;

      return (nameMatch || codeMatch) && filterMatch;
    });
  };

  // 獲取當前頁面的優惠券
  const getCurrentPageCoupons = () => {
    const filtered = getFilteredCoupons();
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return filtered.slice(indexOfFirstItem, indexOfLastItem);
  };

  // 處理分頁改變
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const filteredCoupons = getFilteredCoupons();
  const currentCoupons = getCurrentPageCoupons();

  if (loading) return <div className="text-center p-5">載入中...</div>;
  if (error) return <div className="text-center p-5 text-danger">{error}</div>;

  return (
    <>
    <Head>
    <title>優惠券領取 | Pertho</title>
    </Head>
    <div className="container py-5">
      {/* 麵包屑 */}
      <Breadcrumb
        items={[
          { label: "首頁", href: "/" },
          { label: "優惠券領取", href: "/coupons", active: true },
        ]}
      />

      {/* 標題區域 */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="text-center mb-4">優惠券領取</h2>
        </div>
      </div>

      {/* 搜尋、排序和篩選區域 */}
      <div className="row mb-4">
        {/* 搜尋欄位 */}
        <div className="col-md-4 mb-3 mb-md-0">
          <input
            type="text"
            className="form-control"
            placeholder="搜尋優惠券..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* 適用範圍篩選 */}
        <div className="col-md-4 mb-3 mb-md-0">
          <select
            className="form-select"
            value={filterType}
            onChange={handleFilterChange}
          >
            <option value="all">全部優惠券</option>
            <option value="sale">限購買使用</option>
            <option value="rental">限租借使用</option>
            <option value="both">通用券</option>
          </select>
        </div>

        {/* 排序選項 */}
        <div className="col-md-4">
          <select
            className="form-select"
            value={sortType}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="newest">最新優惠券</option>
            <option value="expiringSoon">即將到期</option>
          </select>
        </div>
      </div>

      {/* 優惠券列表 */}
      <div className="row">
        {currentCoupons.length > 0 ? (
          currentCoupons.map((coupon) => (
            <div key={coupon.id} className="col-md-6 mb-4">
              <CouponListCard
                name={coupon.name}
                type={coupon.type}
                discount={coupon.discount}
                startDate={coupon.start_date}
                endDate={coupon.end_date}
                applyTo={coupon.apply_to}
                isOwned={userCoupons.some((uc) => uc.id === coupon.id)}
                onClaim={() => handleClaimCoupon(coupon.id)}
              />
            </div>
          ))
        ) : (
          <div className="col text-center">
            <p>沒有找到符合條件的優惠券</p>
          </div>
        )}
      </div>

      {/* 分頁 */}
      {filteredCoupons.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
    </>
  );
}