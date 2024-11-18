// pages/forum/index.js
import React, { useState, useEffect, act } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { FaSearch, FaRegCommentDots, FaRegNewspaper } from "react-icons/fa";
import { toast } from "react-toastify";
import Pagination from "@/components/product/Pagination";
import Breadcrumb from "@/components/Breadcrumb";
import moment from "moment";
import "moment/locale/zh-tw";
moment.locale("zh-tw");

export default function ForumList() {
  const { isAuthenticated, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // 載入文章列表
  const fetchPosts = async (pageNum = 1, search = "") => {
    try {
      setPostLoading(true);
      let url = `http://localhost:3005/api/forum/posts?page=${pageNum}&limit=12`;
      if (search) {
        url = `http://localhost:3005/api/forum/search?keyword=${search}&page=${pageNum}&limit=12`;
      }

      console.log("Fetching posts from:", url); // 除錯用

      const response = await fetch(url);
      const data = await response.json();

      console.log("Response:", data); // 除錯用

      if (response.ok) {
        setPosts(data.data.posts);
        setTotalPages(data.data.pagination.total_pages);
      } else {
        throw new Error(data.message || "載入文章失敗");
      }
    } catch (error) {
      console.error("載入文章失敗:", error);
      toast.error("載入文章失敗");
    } finally {
      setPostLoading(false);
    }
  };

  // 搜尋處理
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts(1, keyword);
  };

  // 換頁處理
  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchPosts(newPage, keyword);
  };

  // 初始載入文章，等待身份驗證完成
  useEffect(() => {
    // 等待身份驗證載入完成
    if (loading) return;

    fetchPosts();
  }, [loading]);

  // 顯示載入中
  if (loading || postLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Container className="py-4">
       {/* 麵包屑 */}
       <Breadcrumb
        items={[
          { label: '首頁', href: '/' },
          { label: '討論區', active: true }, 
        ]}
      />

      {/* 標題區 */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>討論區</h2>
        {isAuthenticated() && (
          <Link href="/forum/edit" className="btn btn-custom">
            發表文章
          </Link>
        )}
      </div>

      {/* 搜尋區 */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="搜尋文章..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Button variant="outline-secondary" type="submit">
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>

      {/* 文章列表 */}
      {posts.length > 0 ? (
        <>
          <Row xs={1} md={2} lg={3} className="g-4 mb-4">
            {posts.map((post) => (
              <Col key={post.id}>
                <Card className="h-100 forum-card">
                  {/* 封面圖片區 */}
                  <Link
                    href={`/forum/${post.id}`}
                    className="text-decoration-none"
                  >
                    <div className="cover-image-wrapper">
                      {post.cover_image ? (
                        <Card.Img
                          variant="top"
                          src={`http://localhost:3005/uploads/forum/${post.cover_image}`}
                          alt={post.title}
                          className="cover-image"
                          onError={(e) => {
                            e.target.src =
                              "http://localhost:3005/productImages/default-post.png";
                          }}
                        />
                      ) : (
                        <div className="default-cover">
                          <FaRegNewspaper size={32} className="text-muted" />
                        </div>
                      )}
                    </div>
                  </Link>

                  <Card.Body className="d-flex flex-column">
                    <Link
                      href={`/forum/${post.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <Card.Title className="h5 mb-3">{post.title}</Card.Title>
                    </Link>
                  </Card.Body>

                  <Card.Footer className="bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            post.author_avatar ||
                            "http://localhost:3005/avatar/default-avatar.png"
                          }
                          alt={post.author_name}
                          className="rounded-circle"
                          width="24"
                          height="24"
                          onError={(e) => {
                            e.target.src =
                              "http://localhost:3005/avatar/default-avatar.png";
                          }}
                        />
                        <span className="ms-2 small">{post.author_name}</span>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center text-muted small">
                          <FaRegCommentDots className="me-1" />
                          <span>{post.reply_count}</span>
                        </div>
                        <small className="text-muted">
                          {moment(post.created_at).fromNow()}
                        </small>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>

          {/* 分頁 */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-5">
          <h4>目前還沒有文章</h4>
          <p className="text-muted">成為第一個發文的人吧！</p>
        </div>
      )}

      {/* 添加樣式 */}
      <style jsx global>{`
        .forum-card {
          transition: transform 0.2s;
        }

        .forum-card:hover {
          transform: translateY(-5px);
        }

        .cover-image-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background-color: #f8f9fa;
        }

        .cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .forum-card:hover .cover-image {
          transform: scale(1.05);
        }

        .default-cover {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
        }

        .card-title {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          min-height: 3rem;
        }
      `}</style>
    </Container>
  );
}
