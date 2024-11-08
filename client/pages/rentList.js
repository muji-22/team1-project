import React, { useState } from "react";
import CategorySidebar from "@/components/product/category";
import ProductCard from "@/components/product/productCard";
import ProductCard from "@/components/product/ProductList";
function RentList() {
    return (
        <div className="container mb-5">
            <h2 className=" my-5">租借商品列表</h2>

            {/* 主要內容區 */}
            <div className="row">
                {/* 左側篩選欄 */}
                <div className="col-2">
                    <CategorySidebar />
                </div>

                {/* 右側內容區 */}

                <div className="col-10">
                    <div className="row">
                        {/* 這裡可以放置商品列表或其他內容 */}
                        <productList/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RentList;
