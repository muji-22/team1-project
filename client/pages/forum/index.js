import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import styles from "@/styles/forum.module.css";
import Video from "@/components/forum/Video";
import ArticleList from "@/components/forum/ArticleList";
function forumPage() {
  return (
    <>
      <div className="main container mt-5">
        <h1 className={"title"}>熱門文章</h1>
        <div className={styles.searchbar}>
          搜尋
          <input type="text" />
        </div>
        <div className="container"><ArticleList></ArticleList></div>
        
      
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
