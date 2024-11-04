import React, { useState } from "react";
import CategorySidebar from "@/components/product/category";
import ProductCard from "@/components/product/productCard";
import MayFavorite from "@/components/product/mayFavorite";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import ProductDetailSide from "@/components/product/productDetailSide";
import ProductDetailNotice from "@/components/product/productDetailNotice";

function ProductDetail() {
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
              商品名稱
            </li>
          </ol>
        </nav>
      </div>

      {/* 內容區 */}
      <div className="row ">
        {/* 左側內容區 */}

        <div className="col-6">
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={0}
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              />
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={1}
                aria-label="Slide 2"
              />
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={2}
                aria-label="Slide 3"
              />
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="https://images.pexels.com/photos/21352813/pexels-photo-21352813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  className="d-block w-100"
                  alt="..."
                />
              </div>
              <div className="carousel-item">
                <img
                  src="https://images.pexels.com/photos/21352813/pexels-photo-21352813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  className="d-block w-100"
                  alt="..."
                />
              </div>
              <div className="carousel-item">
                <img
                  src="https://images.pexels.com/photos/21352813/pexels-photo-21352813.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  className="d-block w-100"
                  alt="..."
                />
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        {/* 右側內容區 */}

        <div className="col-6">
          <ProductDetailSide/>
        </div>
      </div>
      
			{/* 注意事項 */}
      <ProductDetailNotice/>
    </div>
  );
}

export default ProductDetail;
