import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import styles from "@/styles/forum.module.css";
import Articles from "@/components/forum/ArticleCard";
import Video from "@/components/forum/Video";
function forumPage() {
  return (
    <>
      <div className="main container">
        <h1 className={"title"}>熱門文章</h1>
        <div className={styles.searchbar}>
          <input type="text" />
        </div>
        <div className="article-container container text-center">
          <div className="article-row d-flex">
            <Articles></Articles>
            <Articles></Articles>
            <Articles></Articles>
          </div>
          <div className="article-row d-flex">
            <Articles></Articles>
            <Articles></Articles>
            <Articles></Articles>
          </div>
          <div className="article-row d-flex">
            <Articles></Articles>
            <Articles></Articles>
            <Articles></Articles>
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
        <h1 className={`${styles.title}`}>熱門教學影片</h1>
        <div>
          <div>
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.11023 13.3306L9.75086 19.9712C10.2098 20.4302 10.952 20.4302 11.4061 19.9712L12.5096 18.8677C12.9686 18.4087 12.9686 17.6665 12.5096 17.2124L7.8075 12.5005L12.5145 7.79346C12.9735 7.33447 12.9735 6.59229 12.5145 6.13818L11.411 5.02979C10.952 4.5708 10.2098 4.5708 9.75574 5.02979L3.11511 11.6704C2.65125 12.1294 2.65125 12.8716 3.11023 13.3306Z"
                fill="#ccc"
              />
            </svg>
          </div>
          <div>
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.8892 11.6704L15.2485 5.02979C14.7895 4.5708 14.0474 4.5708 13.5933 5.02979L12.4897 6.1333C12.0308 6.59229 12.0308 7.33447 12.4897 7.78857C14.328 9.62679 15.3586 10.6574 17.1968 12.4956L12.4897 17.2026C12.0308 17.6616 12.0308 18.4038 12.4897 18.8579L13.5933 19.9614C14.0522 20.4204 14.7944 20.4204 15.2485 19.9614L21.8892 13.3208C22.3481 12.8716 22.3481 12.1294 21.8892 11.6704Z"
                fill="#ccc"
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
    </>
  );
}

export default forumPage;
