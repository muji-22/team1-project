import React, { useState } from "react";
import CategorySidebar from "@/components/product/category";
import ProductCard from "@/components/product/productCard";
import MayFavorite from "@/components/product/mayFavorite";
function ProductList() {
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
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductList;
