import React from "react";
import styles from "./Rating.module.css";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

const Rating = () => {
  const products = [
    { name: "農場早點名", price: 790, image: "#Image網址.png" },
    { name: "貓貓食堂", price: 490, image: "#Image網址.png" },
    { name: "鯊魚警報", price: 490, image: "#Image網址.png" },
    { name: "呼拉大師", price: 490, image: "#Image網址.png" },
  ];

  return (
    <section className={`container ${styles.section} py-5`}>
      <div className="row">
        {products.map((product, index) => (
          <div key={index} className="col-12 mb-3">
            <div className="h-100">
              <div
                className={`p-3 border rounded-2 ${
                  index % 2 === 0 ? styles.evenCard : styles.oddCard
                }`}
              >
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <div className={styles.productInfo}>
                      <h5 className={styles.productName}>{product.name}</h5>
                      <p className={styles.productPrice}>{product.price}</p>
                    </div>
                  </div>

                  <div
                    className={`${styles.ratingContainer} col-12 col-lg-4 col-sm-4 d-flex justify-content-center align-items-center`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${styles.star} ${
                          i < 3 ? styles.filled : ""
                        } text-custom fs-5 me-1`}
                      />
                    ))}
                  </div>

                  <div className="col-12 col-sm-2 d-flex justify-content-center">
                    <button className={`btn btn-dark ${styles.buyButton}`}>
                      立即購買
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Rating;
