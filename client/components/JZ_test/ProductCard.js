import React from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import styles from "./productCard.module.css";
import { FaCartPlus } from "react-icons/fa";

const ProductCard = ({
    id,
    name,
    price,
    descrition, // 注意：資料庫中的欄位名稱是 descrition
    onAddToCart,
    onAddToWishlist,
}) => {
    // 取得商品第一張圖片（主圖）的路徑
    const imageUrl = `http://localhost:3005/productImages/${id}/${id}-1.jpg`;
    const handleImageError = (e) => {
        e.target.src =
            "http://localhost:3005/productImages/default-product.png";
    };

    return (
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className={`card border-0 h-100 ${styles.card}`}>
                <div>
                    <img
                        className={`card-img-top ${styles.img}`}
                        src={imageUrl}
                        onError={handleImageError}
                        alt={name}
                    />
                </div>
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{name}</h5>
                    <p className="card-text text-truncate">{descrition}</p>
                    <div className="mt-auto">
                        <div className="row align-items-center g-2 mb-2">
                            <div className="col">
                                <p className="card-text price fs-5 mb-0">
                                    NT$ {price?.toLocaleString()}
                                </p>
                            </div>
                            <div className="col-auto">
                                <button
                                    className="btn btn-outline-danger border-0"
                                    onClick={() => onAddToWishlist?.(id)}
                                    title="加入收藏"
                                >
                                    <IoMdHeartEmpty className="fs-4" />
                                </button>
                            </div>
                        </div>
                        <a
                            className="btn btn-primary w-100 rounded-pill d-flex align-items-center justify-content-center gap-2"
                            onClick={() => onAddToCart?.(id)}
                        >
                            加入購物車 <FaCartPlus size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
