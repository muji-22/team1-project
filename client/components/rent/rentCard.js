import React from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import styles from "./rentCard.module.css";
import { FaCartPlus } from "react-icons/fa";
// // 定義產品資料型別

// // 元件接收產品資料作為props
const RentCard = ({  id, 
    name, 
    rental_fee,    // 改用租金
    deposit,       // 押金
    penalty_fee,   // 罰金
    image,         // 圖片路徑
    onAddToCart, 
    onAddToWishlist  }) => {
    // 取得商品第一張圖片（主圖）的路徑
    const imageUrl = `http://localhost:3005/productImages/${id}/${id}-1.jpg`;
    const handleImageError = (e) => {
        e.target.src =
            "http://localhost:3005/productImages/default-product.png";
    };

    return (
        <>
            <div className="col-lg-4 col-md-5 col-sm-6 mb-4">
                <div className={`card border-0 ${styles.card} col-2`}>
                    <img
                        className={`card-img-top ${styles.img}`}
                        src={imageUrl}
                        onError={handleImageError}
                        alt={name}
                    />
                    <div className="card-body">
                    <h5 className={`card-title ${styles.cardTitle}`}>(租借){name}</h5>
                        <p className="card-text price origin text-danger ">
                            <del> </del>
                            {/* 要放打折後原價的位子] */}
                        </p>
                        <div className="row align-items-center g-2 mb-2">
                            <div className="col">
                                <p className="card-text price mb-0">
                                    {" "}
                                    NT$ {rental_fee?.toLocaleString()}/日
                                </p>
                            </div>
                            <div className="col-auto">
                                <a
                                    className="btn btn-outline-danger border-0"
                                    onClick={() => onAddToWishlist?.(id)}
                                    title="加入收藏"
                                >
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

export default RentCard;
