// components/comment/CommentList.js
import React, { useEffect } from 'react'
import { useComment } from '@/contexts/CommentContext'
import { useAuth } from '@/contexts/AuthContext'
import StarRating from '../comment/StarRating'

const CommentList = ({ productId, user }) => {
  const { 
    comments, 
    avgScore,
    totalPages,
    currentPage,
    loading,
    error,
    fetchComments,
    deleteComment,
  } = useComment()

  useEffect(() => {
    console.log('avgScore type:', typeof avgScore)
    console.log('avgScore value:', avgScore)
    fetchComments(productId)
  }, [productId])

  const handleDelete = async (commentId) => {
    if (window.confirm('確定要刪除此評價嗎？')) {
      try {
        await deleteComment(commentId, productId)
      } catch (error) {
        console.error('刪除評價失敗:', error)
      }
    }
  }

  if (loading) return <div className="text-center">載入中...</div>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div>
      {/* 平均評分 */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <h4 className="mb-0">商品評價</h4>
        <div className="d-flex align-items-center">
          <StarRating 
            initialRating={avgScore ? Math.round(avgScore) : 0} 
            totalStars={5}
            onRatingChange={() => {}} // 唯讀模式
          />
          <span className="ms-2">
            {avgScore ? `(${Number(avgScore).toFixed(1)}分)` : '(尚無評分)'}
          </span>
        </div>
      </div>

      {/* 評價列表 */}
      {comments.length === 0 ? (
        <div className="text-center text-muted">暫無評價</div>
      ) : (
        <div className="comment-list">
          {comments.map((comment) => (
            <div key={comment.id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center gap-2">
                    {/* 使用者頭像 */}
                    <img
                      src={comment.avatar_url || '/default-avatar.png'}
                      alt="avatar"
                      className="rounded-circle"
                      width="40"
                      height="40"
                    />
                    {/* 使用者名稱 */}
                    <div>
                      <div className="fw-bold">{comment.user_name}</div>
                      <small className="text-muted">
                        {new Date(comment.comment_date).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                  {/* 刪除按鈕 (僅顯示給評價作者) */}
                  {user?.id === comment.user_id && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(comment.id)}
                    >
                      刪除
                    </button>
                  )}
                </div>
                
                {/* 評分 */}
                <div className="mb-2">
                  <StarRating 
                    initialRating={comment.score}
                    totalStars={5}
                    onRatingChange={() => {}} // 唯讀模式
                  />
                </div>
                
                {/* 評價內容 */}
                <p className="card-text">{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 分頁 */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <li 
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => fetchComments(productId, index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}

export default CommentList