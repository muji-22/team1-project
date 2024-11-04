import React from "react";
import styles from "./index.module.css";

export default function Breadcrumb() {
  return (
    <>
      <div className={styles.breadcrumb}>
        <a className={styles.aLink} href="/">
          首頁
        </a>
        →
        <a className={styles.aLink} href="/users">
          個人資料
        </a>
      </div>
    </>
  );
}
