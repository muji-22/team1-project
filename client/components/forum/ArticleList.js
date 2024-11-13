import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/components/forum/AritcleCard.module.css";

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/forumarticle");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        setError(err);
      }
    };

    fetchArticles();
  }, []);

  if (error) return <div className="alert alert-danger">伺服器錯誤，請洽管理員......</div>;

  // 計算當前頁面要顯示的文章
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = articles.slice(indexOfFirstCard, indexOfLastCard);
  
  // 計算總頁數
  const totalPages = Math.ceil(articles.length / cardsPerPage);

  // 換頁函式
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {currentCards.map((article) => (
          <div className="col" key={article.id}>
            <div className={`card h-100 ${styles.articleCard}`}>
              <div className={styles.imgContainer}>
                <Image
                  width={420}
                  height={420}
                  alt="placeholder"
                  src="/images/forum_img/hq720.jpg"
                />
              </div>
              <div className="card-body">
                <h5 className={`card-title ${styles.textContent}`}>
                  {article.title}
                </h5>
                <div className="btn">
                  <Link
                    href={`/forum/viewArticle/${article.id}`}
                    className={styles.link}
                  >
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
                    繼續閱讀
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

{/* 分頁按鈕 */}
<div className={`${styles.page} container d-flex justify-content-center mt-4`}>
  {/* 上一頁按鈕 */}
  <div
    className={`${styles.btn} btn ${currentPage === 1 ? 'disabled' : ''}`}
    onClick={() => currentPage !== 1 && handlePageChange(currentPage - 1)}
  >
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.11023 13.3306L9.75086 19.9712C10.2098 20.4302 10.952 20.4302 11.4061 19.9712L12.5096 18.8677C12.9686 18.4087 12.9686 17.6665 12.5096 17.2124L7.8075 12.5005L12.5145 7.79346C12.9735 7.33447 12.9735 6.59229 12.5145 6.13818L11.411 5.02979C10.952 4.5708 10.2098 4.5708 9.75574 5.02979L3.11511 11.6704C2.65125 12.1294 2.65125 12.8716 3.11023 13.3306Z"
        fill="#1E1E28"
      />
    </svg>
  </div>

  {/* 頁碼按鈕 */}
  {[...Array(totalPages)].map((_, index) => (
    <div
      key={index + 1}
      className={`${styles.btn} btn ${currentPage === index + 1 ? 'active' : ''}`}
      onClick={() => handlePageChange(index + 1)}
    >
      {index + 1}
    </div>
  ))}

  {/* 下一頁按鈕 */}
  <div
    className={`${styles.btn} btn ${currentPage === totalPages ? 'disabled' : ''}`}
    onClick={() => currentPage !== totalPages && handlePageChange(currentPage + 1)}
  >
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.8892 11.6704L15.2485 5.02979C14.7895 4.5708 14.0474 4.5708 13.5933 5.02979L12.4897 6.1333C12.0308 6.59229 12.0308 7.33447 12.4897 7.78857C14.328 9.62679 15.3586 10.6574 17.1968 12.4956L12.4897 17.2026C12.0308 17.6616 12.0308 18.4038 12.4897 18.8579L13.5933 19.9614C14.0522 20.4204 14.7944 20.4204 15.2485 19.9614L21.8892 13.3208C22.3481 12.8716 22.3481 12.1294 21.8892 11.6704Z"
        fill="#1E1E28"
      />
    </svg>
  </div>
</div>
    </div>
  );
}

export default ArticleList;