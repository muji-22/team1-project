import React, { useState } from "react";
import CategorySidebar from "@/components/product/category";
import ProductCard from "@/components/product/productCard";
function HomePage() {
    return (
        <div className="container mb-5">
            <h2 className=" my-5">商品租借列表</h2>

            {/* 主要內容區 */}
            <div className="row">
                {/* 左側篩選欄 */}
                <div className="col-md-3">
                    <CategorySidebar />
                </div>

                {/* 右側內容區 */}
                <div className="col-md-9">
                    {/* 這裡可以放置商品列表或其他內容 */}
                    <ProductCard />
                    
                    <div className="p-3">{/* 商品列表內容 */}</div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
