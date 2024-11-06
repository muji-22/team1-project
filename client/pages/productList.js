import React, { useState, useEffect } from "react";
import CategorySidebar from "@/components/product/category";
import ProductCard from "@/components/product/productCard";
import { GrFilter } from "react-icons/gr";

import MayFavorite from "@/components/product/mayFavorite";
function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3005/api/products');
                if (!response.ok) {
                    throw new Error('網路回應不正確');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('獲取商品失敗:', error);
                setError('無法載入商品資料，請稍後再試');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (productId) => {
        // 處理加入購物車邏輯
        console.log('加入購物車:', productId);
        // 這裡可以加入購物車的API呼叫
    };

    const handleAddToWishlist = (productId) => {
        // 處理加入收藏邏輯
        console.log('加入收藏:', productId);
        // 這裡可以加入收藏的API呼叫
    };

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
        <div className="container mt-5">
            {/* 麵包屑 */}
            <div className="">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                            <a href="#">首頁</a>
                        </li>
                        <li class="breadcrumb-item">
                            <a href="#">商品購買列表</a>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">
                            Data
                        </li>
                    </ol>
                </nav>
                <h2 className="mb-5 ">商品列表</h2>

                {/* 篩選按鈕 */}
                <div className=" d-lg-none d-flex justify-content-end">
                    <a
                        className="fs-2 text-custom me-3"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#filterOffcanvas"
                        aria-controls="filterOffcanvas"
                    >
                        <GrFilter />
                    </a>

                </div>
            </div>

            {/* 主要內容區 */}
            <div className="row ">
                {/* 左側篩選欄 */}
                <div className="col-2 pt-4">
                    <CategorySidebar />
                </div>

                {/* 右側內容區 */}

                <div className="col-10">
                    <div className="row">
                        {/* 這裡可以放置商品列表或其他內容 */}
                        {products.length === 0 ? (
                            <div className="text-center">
                                <h3>目前沒有商品</h3>
                            </div>
                        ) : (
                            <div className="row">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        {...product}
                                        onAddToCart={handleAddToCart}
                                        onAddToWishlist={handleAddToWishlist}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductList;
