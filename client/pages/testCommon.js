import React from 'react'
import CommentList from '@/components/comment/CommentList'
import CommentForm from '@/components/comment/CommentForm'
import { useAuth } from '@/contexts/AuthContext'

function TestComment() {
  const { user } = useAuth()
  console.log('User:', user) // 調試用
  const testProductId = 1

  return (
    <div className="container py-4">
      <h2 className="mb-4">評論區塊測試頁面</h2>
      
      <hr className="my-4" />

      <div className="mb-5">
        <h3 className="mb-3">新增評論</h3>
        {user ? (
          <CommentForm 
            productId={testProductId}
            onSuccess={() => {
              alert('評論新增成功！')
            }}
          />
        ) : (
          <div className="alert alert-info">
            請先登入才能發表評論
          </div>
        )}
      </div>

      <div className="mb-5">
        <h3 className="mb-3">評論列表</h3>
        <CommentList productId={testProductId} />
      </div>
    </div>
  )
}

export default TestComment