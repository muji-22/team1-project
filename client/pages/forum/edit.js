import React, { useState, useEffect } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-toastify'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@/components/forum/Editor'), {
  ssr: false,
  loading: () => <p>載入編輯器中...</p>
})

export default function PostEdit() {
  const router = useRouter()
  const { id } = router.query
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [validated, setValidated] = useState(false)

  // 檢查登入狀態
  useEffect(() => {
    const checkAuth = async () => {
      if (authLoading) return
      
      const token = localStorage.getItem('token')
      if (!token || !isAuthenticated()) {
        toast.error('請先登入')
        router.push('/auth/login')
      }
    }

    checkAuth()
  }, [isAuthenticated, authLoading, router])

  // 載入文章內容（編輯模式）
  useEffect(() => {
    const fetchPost = async () => {
      if (!id || authLoading) return

      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch(
          `http://localhost:3005/api/forum/posts/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || '載入文章失敗')
        }

        const data = await response.json()
        setTitle(data.data.post.title)
        setContent(data.data.post.content)
      } catch (error) {
        console.error('載入文章失敗:', error)
        toast.error(error.message)
        router.push('/forum')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, authLoading])

  // 編輯器內容變更處理
  const handleEditorChange = (newContent) => {
    setContent(newContent)
  }

  // 表單提交處理
  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    
    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    // 內容驗證
    if (!content || content.trim() === '<p><br></p>') {
      toast.warning('請輸入文章內容')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const url = id 
        ? `http://localhost:3005/api/forum/posts/${id}`
        : 'http://localhost:3005/api/forum/posts'
      
      const postData = {
        title: title.trim(),
        content: content
      }

      const response = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || (id ? '更新文章失敗' : '發文失敗'))
      }

      await response.json()
      toast.success(id ? '文章更新成功' : '發文成功')
      router.push(id ? `/forum/${id}` : '/forum')
    } catch (error) {
      console.error(id ? '更新文章失敗:' : '發文失敗:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // 載入中狀態
  if (authLoading || loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <Container className="py-4">
      <div className="forum-edit-container">
        <h2 className="mb-4">{id ? '編輯文章' : '發表新文章'}</h2>

        <Form 
          noValidate 
          validated={validated} 
          onSubmit={handleSubmit}
          className="edit-form"
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

          {/* 內容編輯器 */}
          <Form.Group className="mb-4">
            <Form.Label>內容</Form.Label>
            <Editor
              value={content}
              onChange={handleEditorChange}
              readOnly={loading}
            />
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

        <style jsx global>{`
          .forum-edit-container {
            margin-bottom: 2rem;
            background: #fff;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .edit-form {
            max-width: 100%;
          }
          .ql-editor {
            min-height: 300px;
            background: white;
          }
          .editor-container {
            min-height: 400px;
            margin-bottom: 1rem;
          }
          .form-group {
            margin-bottom: 1.5rem;
          }
        `}</style>
      </div>
    </Container>
  )
}