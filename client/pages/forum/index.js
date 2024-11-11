import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import styles from "@/styles/forum.module.css";
import Articles from "@/components/forum/ArticleCard";
import Video from "@/components/forum/Video";
import ArticleList from "@/components/forum/aaaa";
function forumPage() {
  return (
    <>
      <div className="main container mt-5">
        <h1 className={"title"}>熱門文章</h1>
        <div className={styles.searchbar}>
          搜尋
          <input type="text" />
        </div>
        <div>
        <ArticleList></ArticleList>
        </div>
        <div className="article-container container text-center">
          <div className="article-row d-flex">
            
          </div>
          <div className="article-row d-flex">
            
          </div>
          <div className="article-row d-flex">
            
          </div>
        </div>
        <div className={`${styles.page} container d-flex`}>
          <div className={`${styles.btn} btn`}>
            {" "}
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
          <div className={`${styles.btn} btn`}>1</div>
          <div className={`${styles.btn} btn`}>2</div>
          <div className={`${styles.btn} btn`}>3</div>
          <div className={`${styles.btn} btn`}>4</div>
          <div className={`${styles.btn} btn`}>5</div>
          <div className={`${styles.btn} btn`}>
            <svg
              className={styles.btn}
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
      <div className={styles.banner}>
        <div className="container">
          <h1 className={`${styles.title} `}>熱門教學影片</h1>
          <div className="d-flex">
            <div>
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="-0.5"
                  y="0.5"
                  width="37"
                  height="37"
                  rx="4.5"
                  transform="matrix(-1 0 0 1 37 0)"
                  stroke="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.9209 11.4231C18.7665 11.0051 18.438 10.8747 18.1871 11.132L11.2538 18.243C11.0961 18.4048 11 18.6913 11 19C11 19.3087 11.0961 19.5952 11.2538 19.757L18.1871 26.868C18.438 27.1253 18.7665 26.9949 18.9209 26.5769C19.0753 26.1588 18.997 25.6113 18.7462 25.354L13.4176 19.8889H26.4667C26.7612 19.8889 27 19.4909 27 19C27 18.5091 26.7612 18.1111 26.4667 18.1111H13.4176L18.7462 12.646C18.997 12.3887 19.0753 11.8412 18.9209 11.4231Z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="37"
                  height="37"
                  rx="4.5"
                  stroke="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.0791 11.4231C19.2335 11.0051 19.562 10.8747 19.8129 11.132L26.7462 18.243C26.9039 18.4048 27 18.6913 27 19C27 19.3087 26.9039 19.5952 26.7462 19.757L19.8129 26.868C19.562 27.1253 19.2335 26.9949 19.0791 26.5769C18.9247 26.1588 19.003 25.6113 19.2538 25.354L24.5824 19.8889H11.5333C11.2388 19.8889 11 19.4909 11 19C11 18.5091 11.2388 18.1111 11.5333 18.1111H24.5824L19.2538 12.646C19.003 12.3887 18.9247 11.8412 19.0791 11.4231Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <div className={`${styles.videoContainer} d-flex`}>
            <Video></Video>
            <Video></Video>
            <Video></Video>
          </div>
        </div>
      </div>
    </>
  );
}

export default forumPage;
