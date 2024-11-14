// pages/forum/index.js
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { FaSearch, FaRegCommentDots } from 'react-icons/fa'
import { toast } from 'react-toastify'
import moment from 'moment'
import 'moment/locale/zh-tw'
moment.locale('zh-tw')

export default function ForumList() {
  const { isAuthenticated } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  // 載入文章列表
  const fetchPosts = async (pageNum = 1, search = '') => {
    try {
      setLoading(true)
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/forum/posts`)
      url.searchParams.append('page', pageNum)
      if (search) {
        url.searchParams.append('keyword', search)
      }

      const response = await fetch(url)
      const data = await response.json()

      if (response.ok) {
        setPosts(data.data.posts)
        setTotalPages(data.data.pagination.total_pages)
      } else {
        throw new Error(data.message || '載入文章失敗')
      }
    } catch (error) {
      console.error('載入文章失敗:', error)
      toast.error('載入文章失敗')
    } finally {
      setLoading(false)
    }
  }

  // 搜尋處理
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchPosts(1, keyword)
  }

  // 換頁處理
  const handlePageChange = (newPage) => {
    setPage(newPage)
    fetchPosts(newPage, keyword)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <Container className="py-4">
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
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : posts.length > 0 ? (
        <>
          <Row xs={1} md={2} lg={3} className="g-4 mb-4">
            {posts.map((post) => (
              <Col key={post.id}>
                <Card className="h-100">
                  <Card.Body>
                    <Link 
                      href={`/forum/${post.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <Card.Title className="mb-3">{post.title}</Card.Title>
                    </Link>
                    <Card.Text className="text-muted small">
                      {post.content.length > 100 
                        ? post.content.substring(0, 100) + '...' 
                        : post.content
                      }
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img
                          src={post.author_avatar || '/default-avatar.png'}
                          alt={post.author_name}
                          className="rounded-circle"
                          width="24"
                          height="24"
                        />
                        <span className="ms-2 small">{post.author_name}</span>
                      </div>
                      <div className="d-flex align-items-center text-muted small">
                        <FaRegCommentDots className="me-1" />
                        <span>{post.reply_count}</span>
                      </div>
                    </div>
                    <div className="text-muted small mt-2">
                      {moment(post.created_at).fromNow()}
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>

          {/* 分頁 */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center">
              <div className="btn-group">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <Button
                    key={num}
                    variant={num === page ? 'custom' : 'outline-custom'}
                    onClick={() => handlePageChange(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-5">
          <h4>目前還沒有文章</h4>
          <p className="text-muted">成為第一個發文的人吧！</p>
        </div>
      )}
    </Container>
  )
}