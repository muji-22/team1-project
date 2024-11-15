import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Card } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-toastify'
import dynamic from 'next/dynamic'

// 動態載入編輯器，並添加載入時的佔位元件
const Editor = dynamic(
  () => import('@/components/forum/Editor'),
  { 
    ssr: false,
    loading: () => <p>載入編輯器中...</p>
  }
)

export default function PostEdit() {
  const router = useRouter()
  const { id } = router.query
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [validated, setValidated] = useState(false)
  const [editorReady, setEditorReady] = useState(false)

  useEffect(() => {
    // 確保組件完全掛載後再初始化編輯器
    setEditorReady(true)
  }, [])

  const handleEditorChange = (newContent) => {
    setContent(newContent)
  }

  // 檢查登入狀態
  useEffect(() => {
    const checkAuth = async () => {
      // 等待身份驗證完成
      if (authLoading) return;
      
      // 檢查 token 和登入狀態
      const token = localStorage.getItem('token');
      if (!token || !isAuthenticated()) {
        toast.error('請先登入')
        router.push('/auth/login')
        return;
      }
    };

    checkAuth();
  }, [isAuthenticated, authLoading, router]);

  // 如果是編輯模式，載入文章內容
  useEffect(() => {
    const fetchPost = async () => {
      if (!id || authLoading) return;  // 等待身份驗證完成

      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/forum/posts/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const data = await response.json();

        if (response.ok) {
          setTitle(data.data.post.title);
          setContent(data.data.post.content);
        } else {
          throw new Error(data.message || '載入文章失敗');
        }
      } catch (error) {
        console.error('載入文章失敗:', error);
        toast.error('載入文章失敗');
        router.push('/forum');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, authLoading]);

  // 表單提交處理
  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    
    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    if (!content) {
      toast.warning('請輸入文章內容')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const url = id 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/forum/posts/${id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/forum/posts`
      
      const response = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(id ? '文章更新成功' : '發文成功')
        router.push(id ? `/forum/${id}` : '/forum')
      } else {
        throw new Error(data.message || (id ? '更新文章失敗' : '發文失敗'))
      }
    } catch (error) {
      console.error(id ? '更新文章失敗:' : '發文失敗:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // 顯示載入中狀態
  if (authLoading || loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // 在渲染編輯器時添加條件檢查
  return (
    <Container className="py-4">
      <div className="forum-edit-container">
        <Card>
          <Card.Body>
            <h2 className="mb-4">{id ? '編輯文章' : '發表新文章'}</h2>

            <Form 
              noValidate 
              validated={validated} 
              onSubmit={handleSubmit}
            >
              {/* 標題 */}
              <Form.Group className="mb-3">
                <Form.Label>標題</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="請輸入文章標題"
                  maxLength={100}
                />
                <Form.Control.Feedback type="invalid">
                  請輸入文章標題
                </Form.Control.Feedback>
              </Form.Group>

              {/* 內容 */}
              <Form.Group className="mb-4">
                <Form.Label>內容</Form.Label>
                <div className="editor-container">
                  {editorReady && (
                    <Editor
                      initialContent={content}
                      onChange={handleEditorChange}
                      readOnly={loading}
                    />
                  )}
                </div>
              </Form.Group>

              {/* 按鈕區 */}
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  variant="outline-secondary"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  取消
                </Button>
                <Button
                  variant="custom"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? '處理中...' : (id ? '更新文章' : '發表文章')}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <style jsx global>{`
          .forum-edit-container {
            margin-bottom: 2rem;
          }
          .editor-container {
            min-height: 350px;
            margin-bottom: 1rem;
          }
          .editor-container .ql-editor {
            min-height: 300px;
          }
        `}</style>
      </div>
    </Container>
  )
}