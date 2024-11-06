import React from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import styles from "./productCard.module.css";
import { FaCartPlus } from "react-icons/fa";
// // 定義產品資料型別

// // 元件接收產品資料作為props
const ProductCard = ({
    id,
    name,
    price,
    image,
    descrition, // 注意：資料庫中的欄位名稱是 descrition
    onAddToCart,
    onAddToWishlist, }) => {
    const handleImageError = (e) => {
        e.target.src = "/images/default-product.jpg";
    };

    return (
        <>
            <div className="col-lg-4 col-md-5 col-sm-6 mb-4">
                <div className={`card border-0 ${styles.card} col-2`}>
                    <img
                        className={`card-img-top ${styles.img}`}
                        src={`/images/product_img/${encodeURIComponent(image)}`}
                        onError={(e) => {
                            // 錯誤時的預設圖片
                        }}
                        alt={name}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{name}</h5>
                        <p className="card-text price origin text-danger ">
                            <del>{descrition}</del>
                        </p>
                        <div className="row align-items-center g-2 mb-2">
                            <div className="col">
                                <p className="card-text price mb-0"> NT$ {price?.toLocaleString()}</p>
                            </div>
                            <div className="col-auto">
                                <a className="btn btn-outline-danger border-0"
                                    onClick={() => onAddToWishlist?.(id)}
                                    title="加入收藏">
                                    <IoMdHeartEmpty className="fs-4 ${styles.heart} text-danger" />
                                </a>
                            </div>
                        </div>
                        <a
                            href="#"
                            className="btn btn-custom  w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 mt-auto "
                        >
                            加入購物車 <FaCartPlus size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductCard;
