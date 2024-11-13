// import { useRouter } from "next/router";
// import React, { useEffect, useState } from "react";
// const ArticleView = () => {
//   const [articles, setArticles] = useState([]);
//   const [error, setError] = useState(null);
//   const router = useRouter();
//   const { id } = router.query; // 獲取文章 id
//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3005/api/forumarticle/article${id}`
//         );
//         const data = await res.json();
//         setArticles(data);
//       } catch (err) {
//         setError(err);
//       }
//     };

//     fetchArticles();
//   }, []);
//   return (
//     <>
//       <div>文章 ID: {id}</div>
//       <div>
//         <p>{data.content}</p>
//       </div>
//     </>
//   );
// };

// export default ArticleView;

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ArticleView = () => {
  const [article, setArticle] = useState(null); // 改為單篇文章
  const [loading, setLoading] = useState(true); // 加入載入狀態
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // 確保有 id 才發送請求
    if (!id) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3005/api/forumarticle/article/${id}`
        );

        if (!res.ok) {
          throw new Error('文章獲取失敗');
        }

        const data = await res.json();
        setArticle(data);
      } catch (err) {
        console.error('獲取文章錯誤:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]); // 加入 id 為依賴

  // 載入中
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
      </div>
    );
  }

  // 錯誤處理
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  // 找不到文章
  if (!article) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          找不到此文章
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* 文章標題 */}
      <h1 className="mb-4">{article.title}</h1>

      {/* 文章資訊 */}
      <div className="mb-4 text-muted">
        <small>
          發布時間：{new Date(article.published_time).toLocaleDateString()}
        </small>
      </div>

      {/* 文章內容 */}
      <div className="article-content">
        {/* 如果內容包含 HTML，使用 dangerouslySetInnerHTML */}
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {/* 返回按鈕 */}
      <div className="mt-5">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => router.push('/forum')}
        >
          返回文章列表
        </button>
      </div>
    </div>
  );
};

export default ArticleView;