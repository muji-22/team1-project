import React, { useEffect, useState } from "react";

function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // 呼叫 API 來獲取文章資料
    const fetchArticles = async () => {
      const res = await fetch("http://localhost:3005/api/forumarticle");
      const data = await res.json();
      setArticles(data);
      console.log(data); // Log the data to the console
    };

    fetchArticles();
  }, []);

  return (
    <div>
      <h1>Articles</h1>
      {articles.length === 0 ? (
        <p>Loading...</p> // Show a loading message if articles are not yet fetched
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article.id}>{article.title}</li> // Assuming articles have 'id' and 'title' properties
          ))}
        </ul>
      )}
    </div>
  );
}

export default ArticleList;
