// components/FavoriteButton.js
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

const FavoriteButton = ({ productId }) => {
  const { user, isAuthenticated } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 檢查是否已收藏
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated()) return
      
      try {
        const response = await fetch(
          `http://localhost:3005/api/favorites/check/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        const data = await response.json()
        if (response.ok) {
          setIsFavorited(data.data.isFavorited)
        }
      } catch (error) {
        console.error('檢查收藏狀態失敗:', error)
      }
    }

    checkFavoriteStatus()
  }, [productId, isAuthenticated])

  // 切換收藏狀態
  const toggleFavorite = async () => {
    if (!isAuthenticated()) {
      router.push('/auth/login')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `http://localhost:3005/api/favorites/${productId}`,
        {
          method: isFavorited ? 'DELETE' : 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        setIsFavorited(!isFavorited)
      } else {
        throw new Error('操作失敗')
      }
    } catch (error) {
      console.error('切換收藏狀態失敗:', error)
      alert('操作失敗，請稍後再試')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`btn ${isFavorited ? 'btn-danger' : 'btn-outline-danger'}`}
      title={isFavorited ? '取消收藏' : '加入收藏'}
    >
      {isFavorited ? (
        <AiFillHeart size={20} />
      ) : (
        <AiOutlineHeart size={20} />
      )}
    </button>
  )
}

export default FavoriteButton