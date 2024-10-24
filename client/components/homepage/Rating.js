import React from 'react'
import styles from './Rating.module.css'
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

const Rating = () => {
  const products = [
    { name: '農場早點名', price: 790, image: '#Image網址.png' },
    { name: '貓貓食堂', price: 490, image: '#Image網址.png' },
    { name: '鯊魚警報', price: 490, image: '#Image網址.png' },
    { name: '呼拉大師', price: 490, image: '#Image網址.png' },
  ]

  return (
    <section className={`${styles.section} container py-5`}>
      <div className="row justify-content-center mb-4">
        <div className="col-md-8 text-center">
          <h2 className={`${styles.sectionTitle} mb-3`}>顧客評分</h2>
          <p className={styles.sectionDescription}>
            放商品資訊、評分、購買連結等
          </p>
        </div>
      </div>
      <div className="row justify-content-center mb-4">
        <div className="col-auto">
          <button className={`btn ${styles.arrowButton}`}>
          <FaArrowLeft/>
          </button>
          <button className={`btn ${styles.arrowButton}`}>
          <FaArrowRight/>
          </button>
        </div>
      </div>
      <div className="row">
        {products.map((product, index) => (
          <div key={index} className="col-md-6 col-lg-3 mb-4">
            <div
              className={`card ${styles.productCard} ${
                index % 2 === 0 ? styles.evenCard : styles.oddCard
              }`}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
                <div className={styles.productInfo}>
                  <h5 className={styles.productName}>{product.name}</h5>
                  <p className={styles.productPrice}>{product.price}</p>
                </div>
              </div>
              <div className={`${styles.ratingContainer} my-2`}>
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src="Icon.svg"
                    alt="Star"
                    className={styles.starIcon}
                  />
                ))}
              </div>
              <button className={`btn btn-dark ${styles.buyButton}`}>
                立即購買
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Rating
