// components/comment/CommentForm.js
import React, { useState } from 'react'
import { useComment } from '@/contexts/CommentContext'
import StarRating from './StarRating'

const CommentForm = ({ productId, orderId, onSuccess }) => {
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const { addComment, loading, error } = useComment()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 基本驗證
    if (rating === 0) {
      alert('請選擇評分')
      return
    }
    if (!comment.trim()) {
      alert('請填寫評價內容')
      return
    }

    try {
      await addComment(productId, orderId, comment, rating)
      // 清空表單
      setComment('')
      setRating(0)
      // 呼叫成功回調
      onSuccess?.()
    } catch (error) {
      console.error('提交評價失敗:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label className="form-label fw-bold">評分</label>
        <StarRating 
          initialRating={rating}
          onRatingChange={(value) => setRating(value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">評價內容</label>
        <textarea
          className="form-control"
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="請分享您的使用心得..."
          required
        />
      </div>

      {error && (
        <div className="alert alert-danger mb-3">
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? '提交中...' : '提交評價'}
      </button>
    </form>
  )
}

export default CommentForm