import React from 'react'
import Login from '@/components/JZ_test/Login'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function TestLogin() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 如果用戶已登入，重定向到首頁
    if (user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  // 如果正在檢查登入狀態，顯示載入中
  if (loading) {
    return (
      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
      </div>
    )
  }

  return (
    <main className='container min-vh-100'>
      <Login />
    </main>
  )
}

export default TestLogin