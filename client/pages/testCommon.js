import React from 'react'
import CommentList from '@/components/comment/CommentList'
import CommentForm from '@/components/comment/CommentForm'
import { useAuth } from '@/contexts/AuthContext'

function TestComment() {
  const { user } = useAuth()
  // 這裡使用固定的商品ID進行測試
  const testProductId = 1

  return (
    <div className="container py-4">
      <h2 className="mb-4">評論區塊測試頁面</h2>
      
      {/* 分隔線 */}
      <hr className="my-4" />

      {/* 評論表單區 */}
      <div className="mb-5">
        <h3 className="mb-3">新增評論</h3>
        {user ? (
          <CommentForm 
            productId={testProductId}
            onSuccess={() => {
              // 可以加入提示訊息
              alert('評論新增成功！')
            }}
          />
        ) : (
          <div className="alert alert-info">
            請先登入才能發表評論
          </div>
        )}
      </div>

      {/* 評論列表區 */}
      <div>
        <h3 className="mb-3">商品評論</h3>
        <CommentList productId={testProductId} />
      </div>
    </div>
  )
}

export default TestComment