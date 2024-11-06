import React, { useState, useEffect } from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import style from "@/styles/productDetail.module.css";
import ProductDetailSide from "@/components/product/productDetailSide";
import ProductDetailNotice from "@/components/product/productDetailNotice";
import ProductDetailNotice2 from "@/components/product/productDetailNotice2";
import ProductDetailMainNotice from "@/components/product/productDetailMainNotice";
import ProductDetailMainNotice2 from "@/components/product/productDetailMainNotice2";
import ProductDetailSideMobile from "@/components/product/productDetailSideMobile";
import MayFavorite from "@/components/product/mayFavorite";
import AddProduct from "@/components/cart/addProduct";

function ProductDetail() {
  const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    
  const Product = ({
    id,
    name,
    price,
    descrition, // 注意：資料庫中的欄位名稱是 descrition
    onAddToCart,
    onAddToWishlist,
  }) => {
    // 取得商品圖片（主圖）的路徑
    const imageUrl = `http://localhost:3005/productImages/${id}/${id}-1.jpg`;
    const imageUrl2 = `http://localhost:3005/productImages/${id}/${id}-2.jpg`;
    const imageUrl3 = `http://localhost:3005/productImages/${id}/${id}-3.jpg`;
    const handleImageError = (e) => {
      e.target.src = "http://localhost:3005/productImages/default-product.png";
    }; 

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
                {name}
              </li>
            </ol>
          </nav>
        </div>

        {/* 內容區 */}
        <div className={`row mainContain ${style.mainContain}`}>
          {/* 左側商品圖片區 */}

          <div className="col-md-12 col-lg-6">
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
              <div
                className={`carousel-inner img-fluid ${style.productImgContainer}`}
              >
                <div className={`carousel-item active ${style.productImg}`}>
                  <img
                    src={imageUrl}
                    className="d-block w-100 img-fluid"
                    alt="..."
                  />
                </div>
                <div className="carousel-item">
                  <img src={imageUrl2} className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src={imageUrl3} className="d-block w-100" alt="..." />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>

          {/* 右側內容區 */}

          <div
            className={`d-none d-lg-block col-md-12 col-lg-6 ${style.rightSide}`}
          >
            <ProductDetailSide />
          </div>
          <div className={`d-lg-none col-md-12 col-lg-6 ${style.rightSide}`}>
            <ProductDetailSideMobile />
          </div>
        </div>

        {/* 說明及規格 */}
        <div className={`d-block d-lg-none col-md-12 col-lg-6`}>
          <ProductDetailMainNotice />
          <ProductDetailMainNotice2 />
        </div>

        {/* 注意事項 */}
        <ProductDetailNotice />
        <ProductDetailNotice2 />

        {/* 可能喜歡 */}
        <div className="d-flex justify-content-center">
          <MayFavorite />
        </div>
      </div>
    );
  };
}

export default ProductDetail;
