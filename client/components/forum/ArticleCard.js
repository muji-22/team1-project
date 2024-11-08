import React from "react";
import styles from "@/components/forum/AritcleCard.module.css";
import Image from "next/image";
import Link from "next/link";
export default function Articles() {
  return (
    <>
      <div className={styles.articleCard}>
        <div className={`${styles.card}`}>
          <Image
            className="img"
            src="/images/product_img/5ab8f6bea14f101eb8a54752_DIXIT_4_Box_3D.jpg"
            alt=""
            width={420}
            height={420}
          />
        </div>
        <div className="text-container">
          <h4 className={`${styles.textContent}`}>
            財務記者信心樓上我會這段傳說選手案件信箱運輸
          </h4>
          <div className="icon-container btn">
            <Link href="/forum/viewArticle" className={styles.link}>
              {" "}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.07912 0.423143C8.23349 0.00505336 8.56199 -0.125304 8.81285 0.131982L15.7462 7.24298C15.9039 7.40476 16 7.69133 16 8C16 8.30867 15.9039 8.59524 15.7462 8.75702L8.81285 15.868C8.56199 16.1253 8.23349 15.9949 8.07912 15.5769C7.92474 15.1588 8.00296 14.6113 8.25381 14.354L13.5824 8.88888H0.533333C0.238781 8.88888 0 8.49091 0 8C0 7.50909 0.238781 7.11112 0.533333 7.11112H13.5824L8.25381 1.64602C8.00296 1.38873 7.92474 0.841232 8.07912 0.423143Z"
                  fill="#2DACAE"
                />
              </svg>
              繼續閱讀{" "}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
