import { useState, useEffect } from "react";
import Link from "next/link";
//import styles from "./yourStyles.module.css"; // Update with your actual styles

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch articles from the API
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articledb");
        if (!res.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Show loading state or error message
  if (loading) return <p>Loading articles...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {articles.map((article) => (
        <li key={article.id}>
          <div className={styles.articleCard}>
            <div className={styles.card}>
              {/* Optionally, you can add an image or any other content here */}
            </div>
            <div className="text-container">
              <h4 className={styles.textContent}>{article.title}</h4>
              <div className="icon-container btn">
                <Link href={`/forum/viewArticle/${article.id}`} className={styles.link}>
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
        </li>
      ))}
    </ul>
  );
}
