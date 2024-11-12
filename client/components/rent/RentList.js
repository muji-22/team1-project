// components/rent/RentList.js
import React, { useState, useEffect } from "react";
import RentCard from "./rentCard";
import { useAuth } from "@/contexts/AuthContext";
import Pagination from "@/components/product/Pagination";

function RentList({ 
  filters,
  currentPage, 
  totalPages, 
  setTotalPages, 
  onPageChange 
}) {
  const [rents, setRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchRents = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        
        // 加入分頁參數
        queryParams.append('page', currentPage);
        queryParams.append('limit', ITEMS_PER_PAGE);
        
        // 搜尋關鍵字
        if (filters?.search) {
          queryParams.append('search', filters.search);
        }

        if (filters?.gametypes?.length > 0) {
          queryParams.append('gametypes', JSON.stringify(filters.gametypes));
        }

        if (filters?.players) {
          queryParams.append('players', filters.players);
        }

        if (filters?.playtime) {
          queryParams.append('playtime', filters.playtime);
        }

        if (filters?.age) {
          queryParams.append('age', filters.age);
        }

        if (filters?.price?.min) {
          queryParams.append('rental_fee_min', filters.price.min);
        }
        if (filters?.price?.max) {
          queryParams.append('rental_fee_max', filters.price.max);
        }

        const response = await fetch(
          `http://localhost:3005/api/rents?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error("網路回應不正確");
        }
        const result = await response.json();
        
        if (result.status === 'success') {
          setRents(result.data.rents);
          setTotalPages(result.data.pagination.total_pages);
        } else {
          throw new Error(result.message || "獲取租賃商品失敗");
        }

      } catch (error) {
        console.error("獲取租賃商品失敗:", error);
        setError("無法載入租賃商品資料");
        setRents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRents();
  }, [filters, currentPage]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {!rents || rents.length === 0 ? (
        <div className="text-center">
          <h3>沒有符合條件的租賃商品</h3>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {rents.map((rent) => (
              <div key={rent.id} className="col-6 col-md-4 col-xl-3">
                <RentCard {...rent} />
              </div>
            ))}
          </div>
          
          {/* 分頁導航 */}
          {totalPages > 1 && (
            <div className="mt-5">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RentList;