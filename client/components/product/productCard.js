// components/product/ProductCard.js
import React from "react";
import Link from "next/link";
import styles from "./productCard.module.css";
import FavoriteButton from "./FavoriteButton";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ id, name, price, description, className }) => {

  return (
    <Link href={`/product/${id}`} className="text-decoration-none">
      <div className={`card h-100 ${styles.card} ${className || ''}`}>
        <div className="position-relative">
          {/* 商品圖片 */}
          <div className={`position-relative ${styles.imageContainer}`}>
            <img
              src={`http://localhost:3005/productImages/${id}/${id}-1.jpg`}
              className={`card-img-top ${styles.productImage}`}
              alt={name}
              onError={(e) => {
                e.target.src = "http://localhost:3005/productImages/default-product.png";
              }}
            />
          </div>
        </div>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-dark">{name}</h5>
          <p className="card-text text-secondary text-truncate">
            {description || '無商品描述'}
          </p>

          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center">
              {/* 商品價格 */}
              <span className="card-text fs-5 m-2">
                NT$ {(price || 0).toLocaleString()}
              </span>

              {/* 收藏按鈕 */}
              <FavoriteButton
                productId={id}
                className="pe-2"
              />
            </div>

            {/* 加入購物車按鈕 */}
            <AddToCartButton productId={id} className="buttonCustomC w-100 text-nowrap"/>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;