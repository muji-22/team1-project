// contexts/CommentContext.js
import React, { createContext, useContext, useState } from 'react'

const CommentContext = createContext()

export function CommentProvider({ children }) {
  const [comments, setComments] = useState([])
  const [avgScore, setAvgScore] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 取得評價列表
  const fetchComments = async (productId, page = 1, limit = 5) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(
        `http://localhost:3005/api/comments/product/${productId}?page=${page}&limit=${limit}`
      )
      const data = await response.json()

      if(!response.ok) {
        throw new Error(data.message)
      }

      setComments(data.data.comments)
      setAvgScore(data.data.avg_score)
      setTotalPages(data.data.total_pages)
      setCurrentPage(data.data.current_page)

    } catch (error) {
      console.error('取得評價失敗:', error)
      setError('取得評價失敗')
    } finally {
      setLoading(false)
    }
  }

  // 新增評價
  const addComment = async (productId, orderId, comment, score) => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3005/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          order_id: orderId,
          comment,
          score,
        }),
      })

      const data = await response.json()

      if(!response.ok) {
        throw new Error(data.message)
      }

      // 重新取得評價列表
      await fetchComments(productId)

    } catch (error) {
      console.error('新增評價失敗:', error)
      setError('新增評價失敗')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 修改評價
  const updateComment = async (commentId, productId, comment, score) => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3005/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment, score }),
      })

      const data = await response.json()

      if(!response.ok) {
        throw new Error(data.message)
      }

      // 重新取得評價列表
      await fetchComments(productId)

    } catch (error) {
      console.error('修改評價失敗:', error)
      setError('修改評價失敗')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 刪除評價
  const deleteComment = async (commentId, productId) => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3005/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if(!response.ok) {
        throw new Error(data.message)
      }

      // 重新取得評價列表
      await fetchComments(productId)

    } catch (error) {
      console.error('刪除評價失敗:', error)
      setError('刪除評價失敗')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <CommentContext.Provider
      value={{
        comments,
        avgScore,
        totalPages,
        currentPage,
        loading,
        error,
        fetchComments,
        addComment,
        updateComment,
        deleteComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  )
}

export const useComment = () => {
  const context = useContext(CommentContext)
  if (!context) {
    throw new Error('useComment must be used within a CommentProvider')
  }
  return context
}

export default CommentContext