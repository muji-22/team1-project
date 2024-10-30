import React from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import styles from "./productCard.module.css";
import { FaCartPlus } from "react-icons/fa";
// // 定義產品資料型別

// // 元件接收產品資料作為props
const ProductCard = ({}) => {
    return (
        <>
            <div className="col-lg-4 col-md-5 col-sm-6 mb-4">
                <div className={`card border-0 ${styles.card} col-2`}>
                    <img
                        src="/images/product_img/5ab8f0d041c091b6fbceed32_AnimaUponAnimal_BOX_3D.jpg "
                        className={`card-img-top  ${styles.img}`}
                        alt="產品圖片"
                    />
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text price origin text-danger ">
                            <del>500</del>
                        </p>
                        <div className="row align-items-center g-2 mb-2">
                            <div className="col">
                                <p className="card-text price mb-0">1000</p>
                            </div>
                            <div className="col-auto">
                                <a href="#" className="btn">
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
